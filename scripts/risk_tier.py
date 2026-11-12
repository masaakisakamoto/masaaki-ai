#!/usr/bin/env python3
"""変更されたファイルから、リスク区分（low / medium / high）を判定する。

使い方:
    python3 scripts/risk_tier.py                     既定のブランチとの差分を判定する
    python3 scripts/risk_tier.py --base origin/main  比較先を指定する
    python3 scripts/risk_tier.py --files a.sql b.md  ファイルを直接指定する（git を使わない）
    python3 scripts/risk_tier.py --json              JSON で出力する

判定の決まり（ルールは scripts/risk-rules.json）:
    - high のルールに当たるファイルは high
    - そうでなく、low のルールに当たるファイルは low
    - どちらにも当たらないファイルは medium
    - 変更全体の区分は、ファイルごとの区分のうち最も高いもの
    - state/tasks.json は、status 以外が変わっていれば medium（--files のときは見ない）

パスだけで判定するので、結果は下限。内容から見て高いと思ったら、高いほうにする。
標準ライブラリだけで動く。Python 3.8 以上。
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_RULES = Path(__file__).resolve().parent / "risk-rules.json"
TASKS_PATH = "state/tasks.json"
ORDER = {"low": 0, "medium": 1, "high": 2}
MEANING = {
    "low": "検査が通れば自動でマージしてよい。",
    "medium": "人がレビューしてからマージする。",
    "high": "エージェントは下書きまで。実行とマージは人が自分の手で行う。",
}
NO_RULE = "どのルールにも当たらない"
TASKS_CHANGED = "status 以外が変わっている"


class GitError(Exception):
    pass


# ---- ルール ----------------------------------------------------------------


def glob_to_regex(pattern: str) -> re.Pattern[str]:
    """`**` はフォルダをまたぐ。`*` と `?` はフォルダをまたがない。大文字と小文字は区別しない。"""
    out: list[str] = []
    i = 0
    while i < len(pattern):
        if pattern.startswith("**/", i):
            out.append("(?:.*/)?")
            i += 3
        elif pattern.startswith("**", i):
            out.append(".*")
            i += 2
        elif pattern[i] == "*":
            out.append("[^/]*")
            i += 1
        elif pattern[i] == "?":
            out.append("[^/]")
            i += 1
        else:
            out.append(re.escape(pattern[i]))
            i += 1
    return re.compile("".join(out), re.IGNORECASE)


def load_rules(path: Path) -> dict[str, list[tuple[str, re.Pattern[str]]]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("ルールは { } で囲んだ形にしてください")
    rules: dict[str, list[tuple[str, re.Pattern[str]]]] = {}
    for tier in ("high", "low"):
        patterns = data.get(tier, [])
        if not isinstance(patterns, list) or not all(isinstance(p, str) for p in patterns):
            raise ValueError(f'"{tier}" は文字列の並びにしてください')
        rules[tier] = [(p, glob_to_regex(p)) for p in patterns]
    return rules


def normalize(path: str) -> str:
    path = path.strip().replace("\\", "/")
    while path.startswith("./"):
        path = path[2:]
    return path


def classify(path: str, rules: dict[str, list[tuple[str, re.Pattern[str]]]]) -> tuple[str, str]:
    """(区分, 当たったルール) を返す。"""
    for tier in ("high", "low"):
        for pattern, regex in rules[tier]:
            if regex.fullmatch(path):
                return tier, pattern
    return "medium", NO_RULE


# ---- git -------------------------------------------------------------------


def git(*args: str) -> subprocess.CompletedProcess[str]:
    try:
        return subprocess.run(
            ["git", "-c", "core.quotepath=off", *args],
            cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace",
        )
    except OSError as exc:
        raise GitError(f"git を実行できません: {exc}") from exc


def commit_of(ref: str) -> str | None:
    result = git("rev-parse", "--verify", "--quiet", f"{ref}^{{commit}}")
    return result.stdout.strip() if result.returncode == 0 and result.stdout.strip() else None


def find_base(explicit: str | None) -> tuple[str, str]:
    """(比較先の名前, 差分の起点になるコミット) を返す。"""
    if git("rev-parse", "--is-inside-work-tree").returncode != 0:
        raise GitError("git のリポジトリではありません。--files でファイルを指定してください")
    if explicit:
        candidates = [explicit]
    else:
        candidates = []
        base_ref = os.environ.get("GITHUB_BASE_REF")
        if base_ref:
            candidates.append(f"origin/{base_ref}")
        head = git("symbolic-ref", "--quiet", "--short", "refs/remotes/origin/HEAD")
        if head.returncode == 0 and head.stdout.strip():
            candidates.append(head.stdout.strip())
        candidates += ["origin/main", "origin/master", "main", "master"]
    for ref in candidates:
        commit = commit_of(ref)
        if commit is None:
            continue
        merge_base = git("merge-base", ref, "HEAD")
        if merge_base.returncode == 0 and merge_base.stdout.strip():
            return ref, merge_base.stdout.strip()
        return ref, commit  # 共通の祖先がないときは、比較先そのものと比べる
    if explicit:
        raise GitError(f"比較先が見つかりません: {explicit}")
    raise GitError("比較先のブランチが見つかりません。--base か --files を指定してください")


def changed_files(base_commit: str) -> list[str]:
    """起点のコミットから作業中の状態までに変わったファイル（未追跡のものを含む）。"""
    diff = git("diff", "--relative", "--name-only", "--no-renames", "-z", base_commit, "--")
    if diff.returncode != 0:
        raise GitError(f"差分を取れません: {diff.stderr.strip()}")
    untracked = git("ls-files", "--others", "--exclude-standard", "-z")
    if untracked.returncode != 0:
        raise GitError(f"未追跡のファイルを調べられません: {untracked.stderr.strip()}")
    names = diff.stdout.split("\0") + untracked.stdout.split("\0")
    return sorted({normalize(n) for n in names if n})


def without_status(data: object) -> object:
    if not isinstance(data, dict) or not isinstance(data.get("tasks"), list):
        return data
    copy = dict(data)
    copy["tasks"] = [
        {k: v for k, v in task.items() if k != "status"} if isinstance(task, dict) else task
        for task in data["tasks"]
    ]
    return copy


def tasks_definition_changed(base_commit: str) -> bool:
    """state/tasks.json で status 以外が変わっていれば True。判断できないときも True。"""
    before = git("show", f"{base_commit}:./{TASKS_PATH}")
    if before.returncode != 0:
        return True
    try:
        old = json.loads(before.stdout)
        new = json.loads((ROOT / TASKS_PATH).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return True
    return without_status(old) != without_status(new)


# ---- 実行 ------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="変更のリスク区分を判定する")
    parser.add_argument("--files", nargs="*", metavar="PATH", help="判定するファイル（指定すると git を使わない）")
    parser.add_argument("--base", help="比較先のブランチやコミット（既定は origin の既定のブランチ）")
    parser.add_argument("--rules", default=str(DEFAULT_RULES), help="ルールのファイル")
    parser.add_argument("--json", action="store_true", help="JSON で出力する")
    args = parser.parse_args(argv)

    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(errors="replace")
        except (AttributeError, ValueError):
            pass

    try:
        rules = load_rules(Path(args.rules))
    except (OSError, ValueError) as exc:
        print(f"ルールを読めません（{args.rules}）: {exc}", file=sys.stderr)
        return 2

    base_name = None
    base_commit = None
    if args.files is not None:
        paths = sorted({normalize(p) for p in args.files if p.strip()})
    else:
        try:
            base_name, base_commit = find_base(args.base)
            paths = changed_files(base_commit)
        except GitError as exc:
            print(str(exc), file=sys.stderr)
            return 2

    files = []
    for path in paths:
        tier, rule = classify(path, rules)
        if path == TASKS_PATH and tier == "low" and base_commit and tasks_definition_changed(base_commit):
            tier, rule = "medium", TASKS_CHANGED
        files.append({"path": path, "tier": tier, "rule": rule})
    files.sort(key=lambda f: (-ORDER[f["tier"]], f["path"]))
    overall = max((f["tier"] for f in files), key=ORDER.__getitem__, default="low")

    output = os.environ.get("GITHUB_OUTPUT")
    if output:
        try:
            with open(output, "a", encoding="utf-8") as handle:
                handle.write(f"tier={overall}\n")
        except OSError:
            pass

    if args.json:
        print(json.dumps({"tier": overall, "base": base_name, "files": files}, ensure_ascii=False, indent=2))
        return 0

    print(f"リスク区分: {overall}")
    if base_name:
        print(f"比較先: {base_name}")
    print()
    if not files:
        print("変更されたファイルはありません。")
        return 0
    width = max(len(f["path"]) for f in files)
    for f in files:
        print(f"  {f['tier']:<6}  {f['path']:<{width}}  {f['rule']}")
    print()
    print(f"{overall}: {MEANING[overall]}")
    print("パスだけで判定しているので、結果は下限です。内容から見て高いと思ったら、高いほうにしてください。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
