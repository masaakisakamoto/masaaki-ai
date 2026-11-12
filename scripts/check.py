#!/usr/bin/env python3
"""ハーネス（AIエージェント向けの指示・知識・状態のファイル）を検査する。

使い方:
    python3 scripts/check.py              エラーがあれば終了コード 1
    python3 scripts/check.py --strict     警告もエラーとして扱う
    python3 scripts/check.py --root DIR   検査するリポジトリを指定する

検査すること:
    1. AGENTS.md があり、短く保たれている
    2. CLAUDE.md が AGENTS.md を読み込んでいる
    3. 指示や設定のファイルに、目に見えない文字が紛れていない
    4. Markdown の相対リンクと、AGENTS.md が指すファイルが存在する
    5. docs/ の文書がすべて docs/index.md から辿れる
    6. state/tasks.json が決められた形に沿っている
    7. 手順書（.agents/skills/）の形と、.claude/skills/ のリンクが正しい
    8. 文書の last_reviewed が古すぎない
    9. 記入もれ（【要記入】など）が残っていない

標準ライブラリだけで動く。Python 3.8 以上。
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import unquote

# ---- 設定（リポジトリに合わせて変えてよい） --------------------------------

AGENTS_WARN_LINES = 100       # これを超えたら警告
AGENTS_MAX_LINES = 200        # これを超えたらエラー
AGENTS_MAX_BYTES = 32 * 1024  # Codex が読み込む指示の合計の上限（既定値）に合わせている
STALE_DAYS = 180              # last_reviewed がこれより古ければ警告
WIP_LIMIT = 3                 # 同時に doing にしてよいタスクの数。超えたら警告
MAX_SCAN_BYTES = 1024 * 1024  # これより大きいファイルは、指示ファイル以外は読まない

# どこにあっても、指示や設定のファイルとして扱う名前
INSTRUCTION_NAMES = {
    "AGENTS.md", "AGENTS.override.md", "CLAUDE.md", "CLAUDE.local.md", "GEMINI.md",
    "SKILL.md", ".cursorrules", ".windsurfrules", "copilot-instructions.md", ".mcp.json",
}
# 中身をすべて検査するフォルダ（リポジトリ直下から）
HARNESS_DIRS = [".agents", ".claude", ".codex", ".cursor", ".github", "docs", "state", "scripts"]
# 直下にあれば検査するファイル
HARNESS_FILES = ["HARNESS.md"]
# 探索しないフォルダ
SKIP_DIRS = {
    ".git", "node_modules", "vendor", "dist", "build", "out", "target", ".next", ".nuxt",
    ".venv", "venv", "__pycache__", "Pods", ".gradle", ".dart_tool", "DerivedData", ".terraform",
}
# 記入もれを探すファイルと、その目印
PLACEHOLDER_FILES = ["AGENTS.md", ".github/CODEOWNERS"]
PLACEHOLDERS = ["【要記入】", "REPLACE-ME"]

TASK_RISKS = ("low", "medium", "high")
TASK_STATUSES = ("todo", "doing", "done", "blocked")
TASK_EXECUTORS = ("agent", "human")
TASK_KEYS = {"id", "title", "risk", "status", "executor", "verify", "notes"}

# ---- 共通の道具 ------------------------------------------------------------


class Report:
    def __init__(self) -> None:
        self.errors: list[tuple[str, str]] = []
        self.warnings: list[tuple[str, str]] = []

    def error(self, where: str, message: str) -> None:
        self.errors.append((where, message))

    def warn(self, where: str, message: str) -> None:
        self.warnings.append((where, message))


def rel(root: Path, path: Path) -> str:
    try:
        return path.relative_to(root).as_posix()
    except ValueError:
        return path.as_posix()


def read_text(path: Path) -> str | None:
    """UTF-8 のテキストとして読む。読めなければ None。"""
    try:
        return path.read_bytes().decode("utf-8")
    except (OSError, UnicodeDecodeError):
        return None


def is_instruction_file(path: Path) -> bool:
    return path.name in INSTRUCTION_NAMES or path.suffix.lower() in (".md", ".mdc")


def collect_files(root: Path) -> list[Path]:
    """検査の対象になるファイルを集める。"""
    found: set[Path] = set()
    for name in HARNESS_FILES:
        if (root / name).is_file():
            found.add(root / name)
    for name in HARNESS_DIRS:
        base = root / name
        if not base.is_dir():
            continue
        for dirpath, dirnames, filenames in os.walk(base):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            found.update(Path(dirpath) / f for f in filenames)
    # AGENTS.md などは、どの階層にあっても対象にする
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for f in filenames:
            if f in INSTRUCTION_NAMES or f.endswith(".mdc"):
                found.add(Path(dirpath) / f)
    return sorted(p for p in found if p.is_file())


def load_texts(root: Path, files: list[Path], rep: Report) -> dict[Path, str]:
    texts: dict[Path, str] = {}
    for path in files:
        important = is_instruction_file(path)
        try:
            size = path.stat().st_size
        except OSError:
            continue
        if size > MAX_SCAN_BYTES and not important:
            continue
        text = read_text(path)
        if text is None:
            if important:
                rep.error(rel(root, path), "UTF-8 のテキストとして読めません")
            continue
        texts[path] = text
    return texts


# ---- Markdown の読み取り ---------------------------------------------------

FENCE_RE = re.compile(r"^\s{0,3}(`{3,}|~{3,})")
INLINE_CODE_RE = re.compile(r"`[^`\n]*`")
LINK_RE = re.compile(
    r"!?\[(?:[^\]\\]|\\.)*\]\(\s*(<[^>]*>|[^)\s]+)(?:\s+(?:\"[^\"]*\"|'[^']*'))?\s*\)"
)
REF_LINK_RE = re.compile(r"^\s{0,3}\[[^\]]+\]:\s*(<[^>]*>|\S+)")
SCHEME_RE = re.compile(r"^[A-Za-z][A-Za-z0-9+.\-]*:")
FRONT_MATTER_RE = re.compile(r"\A---[ \t]*\r?\n(.*?)\r?\n---[ \t]*(?:\r?\n|\Z)", re.S)
BOM = chr(0xFEFF)


def lines_without_fences(text: str) -> list[str]:
    """フェンスで囲んだコードを空行に置き換える。行番号は保つ。"""
    out: list[str] = []
    fence: tuple[str, int] | None = None
    for line in text.splitlines():
        m = FENCE_RE.match(line)
        if fence is None:
            if m:
                fence = (m.group(1)[0], len(m.group(1)))
                out.append("")
            else:
                out.append(line)
        else:
            closes = (
                m is not None
                and m.group(1)[0] == fence[0]
                and len(m.group(1)) >= fence[1]
                and line.strip() == m.group(1)
            )
            if closes:
                fence = None
            out.append("")
    return out


def prose_lines(text: str) -> list[str]:
    """コード（フェンスとインライン）を取り除いた行。行番号は保つ。"""
    return [INLINE_CODE_RE.sub("", line) for line in lines_without_fences(text)]


def iter_links(text: str):
    """(行番号, リンク先) を順に返す。コードの中のものは数えない。"""
    for lineno, line in enumerate(prose_lines(text), 1):
        for m in LINK_RE.finditer(line):
            yield lineno, m.group(1)
        m = REF_LINK_RE.match(line)
        if m:
            yield lineno, m.group(1)


def resolve_link(root: Path, source: Path, target: str) -> Path | None:
    """リポジトリ内のファイルを指すリンクなら、その場所を返す。外部へのリンクなどは None。"""
    t = target.strip()
    if t.startswith("<") and t.endswith(">"):
        t = t[1:-1].strip()
    if not t or t.startswith("#") or t.startswith("//") or SCHEME_RE.match(t):
        return None
    t = unquote(t.split("#", 1)[0].split("?", 1)[0])
    if not t:
        return None
    base = root if t.startswith("/") else source.parent
    return Path(os.path.normpath(base / t.lstrip("/")))


def front_matter(text: str) -> dict[str, str]:
    """先頭の --- で囲んだ部分から、`キー: 値` の行だけを読む。"""
    m = FRONT_MATTER_RE.match(text[1:] if text.startswith(BOM) else text)
    if not m:
        return {}
    out: dict[str, str] = {}
    for line in m.group(1).splitlines():
        if ":" in line and not line.startswith((" ", "\t", "#", "-")):
            key, value = line.split(":", 1)
            out[key.strip()] = value.strip().strip("\"'")
    return out


# ---- 1. AGENTS.md ----------------------------------------------------------


def check_agents(root: Path, texts: dict[Path, str], rep: Report) -> None:
    if not (root / "AGENTS.md").is_file():
        rep.error("AGENTS.md", "ありません。全エージェント共通の指示をここに置いてください")
    for path, text in texts.items():
        if path.name != "AGENTS.md":
            continue
        where = rel(root, path)
        lines = len(text.splitlines())
        size = len(text.encode("utf-8"))
        if size > AGENTS_MAX_BYTES:
            rep.error(where, f"{size} バイトあります。{AGENTS_MAX_BYTES} バイトを超えると、読み込まれない部分が出ます")
        if lines > AGENTS_MAX_LINES:
            rep.error(where, f"{lines} 行あります。{AGENTS_MAX_LINES} 行以内にし、詳細は docs/ に移してください")
        elif lines > AGENTS_WARN_LINES:
            rep.warn(where, f"{lines} 行あります。{AGENTS_WARN_LINES} 行を目安に、詳細は docs/ に移してください")


# ---- 2. CLAUDE.md ----------------------------------------------------------

IMPORT_RE = re.compile(r"(?<![\w`/])@(?:\./)?AGENTS\.md(?![\w/])")


def check_claude(root: Path, rep: Report) -> None:
    path = root / "CLAUDE.md"
    if not path.is_file():
        rep.warn(
            "CLAUDE.md",
            "ありません。`@AGENTS.md` とだけ書いた CLAUDE.md を置くと、Claude Code のどの版でも AGENTS.md が読まれます",
        )
        return
    text = read_text(path)
    if text is None:
        return  # 読めないことは load_texts が報告する
    lines = lines_without_fences(text)
    if not any(IMPORT_RE.search(line) for line in lines):
        rep.error(
            "CLAUDE.md",
            "AGENTS.md を読み込んでいません。`@AGENTS.md` の行を足してください"
            "（CLAUDE.md があると、Claude Code は AGENTS.md を自動では読みません）",
        )
    extra = [
        line for line in lines
        if line.strip() and not IMPORT_RE.search(line) and not line.lstrip().startswith(("#", "<!--"))
    ]
    if extra:
        rep.warn(
            "CLAUDE.md",
            f"独自の指示が {len(extra)} 行あります。ほかのエージェントには見えないので、AGENTS.md に移せないか確かめてください",
        )


# ---- 3. 目に見えない文字 ---------------------------------------------------

# 疑わしい文字の候補（コードポイントの範囲）。下の hidden_reason で絞り込む。
# このファイル自体に見えない文字を書かないよう、文字そのものではなく番号で持つ。
SUSPECT_RANGES = [
    (0x0000, 0x0008), (0x000B, 0x000C), (0x000E, 0x001F), (0x007F, 0x009F),
    (0x00AD, 0x00AD), (0x034F, 0x034F), (0x061C, 0x061C), (0x115F, 0x1160),
    (0x180E, 0x180E), (0x200B, 0x200F), (0x202A, 0x202E), (0x2060, 0x2064),
    (0x2066, 0x2069), (0x3164, 0x3164), (0xFE00, 0xFE0F), (0xFEFF, 0xFEFF),
    (0xFFA0, 0xFFA0), (0xFFF9, 0xFFFB), (0xE0000, 0xE007F), (0xE0100, 0xE01EF),
]
SUSPECT_RE = re.compile(
    "[" + "".join(f"{re.escape(chr(a))}-{re.escape(chr(b))}" for a, b in SUSPECT_RANGES) + "]"
)
ZERO_WIDTH = {0x00AD, 0x034F, 0x115F, 0x1160, 0x180E, 0x200B, 0x200C, 0x2060, 0x3164, 0xFFA0}
BIDI = {0x061C, 0x200E, 0x200F}
MAX_FINDINGS_PER_FILE = 5


def is_emoji_like(ch: str) -> bool:
    cp = ord(ch)
    return cp >= 0x1F000 or 0x2190 <= cp <= 0x27BF or 0x2B00 <= cp <= 0x2BFF or cp == 0xFE0F


def hidden_reason(text: str, i: int) -> str | None:
    """i 文字目が問題のある文字なら、その理由を返す。"""
    cp = ord(text[i])
    if cp < 0x20 or 0x7F <= cp <= 0x9F:
        return "制御文字"
    if cp == 0xFEFF:
        return None if i == 0 else "幅のない文字"  # 先頭の BOM は許す
    if cp == 0x200D:  # 絵文字をつなぐ使い方だけは許す
        joins_emoji = (
            0 < i < len(text) - 1 and is_emoji_like(text[i - 1]) and is_emoji_like(text[i + 1])
        )
        return None if joins_emoji else "幅のない文字"
    if cp in ZERO_WIDTH:
        return "幅のない文字"
    if cp in BIDI or 0x202A <= cp <= 0x202E or 0x2066 <= cp <= 0x2069:
        return "文字の並びを変える制御文字"
    if 0x2061 <= cp <= 0x2064:
        return "目に見えない演算子"
    if 0xE0000 <= cp <= 0xE007F:
        return "タグ文字"
    if 0xE0100 <= cp <= 0xE01EF or 0xFE00 <= cp <= 0xFE0E:
        return "異体字セレクタ"
    if cp == 0xFE0F:  # 絵文字や記号の直後に1つ付くのは普通。それ以外は疑う
        prev = text[i - 1] if i > 0 else ""
        after_symbol = prev != "" and ord(prev) >= 0xA0 and not SUSPECT_RE.match(prev)
        keycap = prev != "" and prev in "0123456789#*" and text[i + 1:i + 2] == chr(0x20E3)
        return None if after_symbol or keycap else "異体字セレクタ"
    if 0xFFF9 <= cp <= 0xFFFB:
        return "行間注釈の制御文字"
    return None


def check_hidden_characters(root: Path, texts: dict[Path, str], rep: Report) -> None:
    for path, text in texts.items():
        where = rel(root, path)
        found: dict[tuple[int, str], list[int]] = {}  # (行, 理由) ごとにまとめる
        for m in SUSPECT_RE.finditer(text):
            reason = hidden_reason(text, m.start())
            if reason is not None:
                line = text.count("\n", 0, m.start()) + 1
                found.setdefault((line, reason), []).append(ord(m.group()))
        groups = sorted(found.items())
        for (line, reason), points in groups[:MAX_FINDINGS_PER_FILE]:
            kinds = sorted(set(points))
            codes = "、".join(f"U+{cp:04X}" for cp in kinds[:3]) + (" ほか" if len(kinds) > 3 else "")
            rep.error(
                f"{where}:{line}",
                f"{reason}が {len(points)} 文字あります（{codes}）。"
                "見えない指示が埋め込まれていないかを確かめ、取り除いてください",
            )
        if len(groups) > MAX_FINDINGS_PER_FILE:
            rep.error(where, f"目に見えない文字が、ほかにも {len(groups) - MAX_FINDINGS_PER_FILE} 行にあります")


# ---- 4. リンク -------------------------------------------------------------

PATH_SPAN_RE = re.compile(r"`([^`\s<>*]+\.(?:md|mdc|json|py|sh|ya?ml|toml))`")


def check_links(root: Path, texts: dict[Path, str], rep: Report) -> None:
    for path, text in texts.items():
        if path.suffix.lower() not in (".md", ".mdc"):
            continue
        where = rel(root, path)
        for lineno, target in iter_links(text):
            dest = resolve_link(root, path, target)
            if dest is not None and not dest.exists():
                rep.error(f"{where}:{lineno}", f"リンク先がありません: {target}")
        if path.name != "AGENTS.md":
            continue
        # AGENTS.md は地図なので、`path/to/file.md` の形で書いたファイルも確かめる
        for lineno, line in enumerate(lines_without_fences(text), 1):
            for m in PATH_SPAN_RE.finditer(line):
                span = m.group(1)
                if SCHEME_RE.match(span):
                    continue
                candidates = [root / span.lstrip("/"), path.parent / span]
                if not any(c.exists() for c in candidates):
                    rep.warn(f"{where}:{lineno}", f"指しているファイルがありません: {span}")


# ---- 5. docs/ の索引 -------------------------------------------------------


def check_docs_index(root: Path, rep: Report) -> None:
    docs = root / "docs"
    index = docs / "index.md"
    if not index.is_file():
        rep.error("docs/index.md", "ありません。知識の索引を置いてください")
        return
    all_docs = {
        Path(os.path.normpath(p))
        for p in docs.rglob("*.md")
        if not SKIP_DIRS.intersection(p.relative_to(docs).parts)
    }
    reached: set[Path] = set()
    queue = [Path(os.path.normpath(index))]
    while queue:
        current = queue.pop()
        if current in reached:
            continue
        reached.add(current)
        text = read_text(current)
        if text is None:
            continue
        for _, target in iter_links(text):
            dest = resolve_link(root, current, target)
            if dest is None:
                continue
            if dest in all_docs:
                queue.append(dest)
            elif dest.is_dir():  # フォルダへのリンクは、その中の文書すべてに届いたとみなす
                queue.extend(d for d in all_docs if dest in d.parents)
    for path in sorted(all_docs - reached):
        rep.error(rel(root, path), "docs/index.md から辿れません。索引に1行足してください")


# ---- 6. state/tasks.json ---------------------------------------------------


def check_tasks(root: Path, rep: Report) -> None:
    name = "state/tasks.json"
    path = root / "state" / "tasks.json"
    if not path.is_file():
        rep.error(name, "ありません")
        return
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        rep.error(name, f"JSON として読めません: {exc}")
        return
    if not isinstance(data, dict) or not isinstance(data.get("tasks"), list):
        rep.error(name, '{"version": 1, "tasks": [...]} の形にしてください')
        return
    if data.get("version") != 1:
        rep.error(name, '"version" は 1 にしてください')

    seen: set[str] = set()
    doing = 0
    for number, task in enumerate(data["tasks"], 1):
        where = f"{name} の {number} 件目"
        if not isinstance(task, dict):
            rep.error(where, "タスクは { } で囲んだ形にしてください")
            continue
        task_id = task.get("id")
        if not isinstance(task_id, str) or not task_id.strip():
            rep.error(where, '"id" を書いてください')
        else:
            where = f"{name} [{task_id}]"
            if task_id in seen:
                rep.error(where, '"id" が重複しています')
            seen.add(task_id)
        for key in ("title", "verify"):
            if not isinstance(task.get(key), str) or not task[key].strip():
                rep.error(where, f'"{key}" を書いてください')
        for key, allowed in (("risk", TASK_RISKS), ("status", TASK_STATUSES), ("executor", TASK_EXECUTORS)):
            if task.get(key) not in allowed:
                rep.error(where, f'"{key}" は {"、".join(allowed)} のどれかにしてください')
        if task.get("risk") == "high" and task.get("executor") != "human":
            rep.error(where, 'risk が high のタスクは、executor を human にしてください')
        if "notes" in task and not isinstance(task["notes"], str):
            rep.error(where, '"notes" は文字列にしてください')
        unknown = sorted(set(task) - TASK_KEYS)
        if unknown:
            rep.warn(where, f"決められていない項目があります: {', '.join(unknown)}")
        if task.get("status") == "doing":
            doing += 1
    if doing > WIP_LIMIT:
        rep.warn(name, f"進行中（doing）のタスクが {doing} 件あります。レビューできる量を超えていないか確かめてください")


# ---- 7. 手順書 -------------------------------------------------------------


SKILL_NAME_RE = re.compile(r"^(?=.{1,64}$)[a-z0-9]+(?:-[a-z0-9]+)*$")


def check_skills(root: Path, rep: Report) -> None:
    base = root / ".agents" / "skills"
    if base.is_dir():
        for entry in sorted(base.iterdir()):
            if not entry.is_dir():
                continue
            skill = entry / "SKILL.md"
            if not skill.is_file():
                rep.error(rel(root, entry), "SKILL.md がありません")
                continue
            meta = front_matter(read_text(skill) or "")
            for key in ("name", "description"):
                if not meta.get(key):
                    rep.error(rel(root, skill), f"先頭の --- で囲んだ部分に {key} がありません")
            if meta.get("name") and meta["name"] != entry.name:
                rep.warn(rel(root, skill), f'name（{meta["name"]}）がフォルダ名（{entry.name}）と違います')
            if not SKILL_NAME_RE.match(entry.name):
                rep.warn(rel(root, entry), "フォルダ名は、小文字の英数字とハイフンだけ（64文字まで）にしてください")
    links = root / ".claude" / "skills"
    if links.is_dir():
        for entry in sorted(links.iterdir()):
            if entry.is_symlink() and not entry.exists():
                rep.error(rel(root, entry), "リンク先がありません。`sh scripts/link-skills.sh` を実行し直してください")


# ---- 8. 文書の鮮度 ---------------------------------------------------------


def check_freshness(root: Path, texts: dict[Path, str], rep: Report, today: dt.date) -> None:
    for path, text in texts.items():
        if path.suffix.lower() != ".md":
            continue
        where = rel(root, path)
        value = front_matter(text).get("last_reviewed")
        if value is None:
            if where.startswith("docs/") and not where.startswith("docs/decisions/"):
                rep.warn(where, "last_reviewed がありません。先頭に --- で囲んで `last_reviewed: 年-月-日` を書いてください")
            continue
        try:
            reviewed = dt.date.fromisoformat(value)
        except ValueError:
            rep.error(where, f"last_reviewed の日付が読めません: {value}（例: 2026-11-12）")
            continue
        age = (today - reviewed).days
        if age > STALE_DAYS:
            rep.warn(where, f"last_reviewed が {age} 日前です。内容を見直して、日付を更新してください")
        elif age < 0:
            rep.warn(where, "last_reviewed が未来の日付です")


# ---- 9. 記入もれ -----------------------------------------------------------


def check_placeholders(root: Path, rep: Report) -> None:
    for name in PLACEHOLDER_FILES:
        text = read_text(root / name)
        if text is None:
            continue
        for mark in PLACEHOLDERS:
            lines = [str(n) for n, line in enumerate(text.splitlines(), 1) if mark in line]
            if lines:
                rep.warn(name, f"{mark} が {len(lines)} か所残っています（{'、'.join(lines)} 行目）")


# ---- 実行 ------------------------------------------------------------------


def run(root: Path, today: dt.date | None = None) -> Report:
    rep = Report()
    texts = load_texts(root, collect_files(root), rep)
    check_agents(root, texts, rep)
    check_claude(root, rep)
    check_hidden_characters(root, texts, rep)
    check_links(root, texts, rep)
    check_docs_index(root, rep)
    check_tasks(root, rep)
    check_skills(root, rep)
    check_freshness(root, texts, rep, today or dt.date.today())
    check_placeholders(root, rep)
    return rep


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="ハーネスを検査する")
    parser.add_argument("--root", help="検査するリポジトリ（既定は、このスクリプトの1つ上のフォルダ）")
    parser.add_argument("--strict", action="store_true", help="警告もエラーとして扱う")
    args = parser.parse_args(argv)

    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(errors="replace")
        except (AttributeError, ValueError):
            pass

    root = Path(os.path.abspath(args.root)) if args.root else Path(__file__).resolve().parent.parent
    if not root.is_dir():
        print(f"フォルダがありません: {root}", file=sys.stderr)
        return 2

    rep = run(root)
    for where, message in rep.errors:
        print(f"エラー  {where}  {message}")
    for where, message in rep.warnings:
        print(f"警告    {where}  {message}")
    if rep.errors or rep.warnings:
        print()
    print(f"結果: エラー {len(rep.errors)} 件、警告 {len(rep.warnings)} 件")
    if args.strict and rep.warnings and not rep.errors:
        print("--strict のため、警告をエラーとして扱いました")
    return 1 if rep.errors or (args.strict and rep.warnings) else 0


if __name__ == "__main__":
    sys.exit(main())
