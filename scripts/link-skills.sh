#!/bin/sh
# .agents/skills/ の各スキルを、.claude/skills/ からシンボリックリンクで参照できるようにする。
#
# 正本は .agents/skills/ に置く（Codex などはここを読む）。
# Claude Code は .claude/skills/ を読むので、コピーではなくリンクでつなぐ。
# スキルを足したり消したりしたら、もう一度実行する。
#
# 使い方: sh scripts/link-skills.sh

set -eu

root=$(cd "$(dirname "$0")/.." && pwd)
src="$root/.agents/skills"
dst="$root/.claude/skills"

if [ ! -d "$src" ]; then
  echo "見つかりません: $src" >&2
  exit 1
fi

mkdir -p "$dst"

# 行き先がなくなったリンクを片づける
for link in "$dst"/*; do
  if [ -L "$link" ] && [ ! -e "$link" ]; then
    rm "$link"
    echo "削除: .claude/skills/$(basename "$link")（リンク先がなくなった）"
  fi
done

count=0
for dir in "$src"/*/; do
  [ -f "${dir}SKILL.md" ] || continue
  name=$(basename "$dir")
  link="$dst/$name"
  if [ -L "$link" ]; then
    rm "$link"
  elif [ -e "$link" ]; then
    echo "スキップ: .claude/skills/$name はリンクではない実体なので、そのままにした" >&2
    continue
  fi
  ln -s "../../.agents/skills/$name" "$link"
  echo "リンク: .claude/skills/$name -> .agents/skills/$name"
  count=$((count + 1))
done

echo "$count 件のスキルをリンクした"
