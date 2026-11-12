# 手順書（Agent Skills）の置き場所

繰り返し行う作業の手順を、1つにつき1フォルダで置きます。

```
.agents/skills/
  release/
    SKILL.md
```

## 決まり

- 人が書く。実際に2回以上やった作業だけを手順書にする。AIに手順書を自動生成させない。
- 外部から持ってきたスキルは、中身をすべて読んでから入れる。スクリプトを含むものは特に注意する。
- 追加と変更は high として扱う。定義は `docs/risk-tiers.md`。
- 必ず守らせたいことは、スキルではなく `AGENTS.md` に書く。スキルは呼ばれないことがある。

## SKILL.md の最小の形

````markdown
---
name: release
description: 本番リリースの手順。リリース、デプロイ、切り戻しを頼まれたときに使う。
---

1. …
2. …
````

`name` はフォルダ名と同じにします。`description` には、何をするかと、いつ使うかを書きます。エージェントはこの1行を見て、読むかどうかを決めます。

## Claude Code から使う

Codex などは `.agents/skills/` を読み、Claude Code は `.claude/skills/` を読みます。次を実行すると、`.claude/skills/` からここへのリンクが作られます。スキルを足したり消したりしたら、もう一度実行します。

```
sh scripts/link-skills.sh
```

Windows でシンボリックリンクを使うには、開発者モードを有効にする必要があります。
