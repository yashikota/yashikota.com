---
title: GitHub Actionsを延命したい
pubDate: 2026-05-19
updDate: 
isUnlisted: false
category: tech
tags: ["GitHub Actions"]
showToc: false
---

あんまり褒められた使い方ではないですが、GitHub Actionsを使えばcron代わりにバッチ処理とかができます。  
なんですけど、単に動かしているだけでは60日後に自動停止します。  

https://docs.github.com/ja/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows

これを解消するために定期的に起床してはリポジトリになにか書き込む必要があります。  
普通にmainとかでやってもいいんですけど、不必要な履歴が入り込むのが秒妙でした。  

そこで、Gitの Orphan ブランチという親を持たないやつを活用します。  
こうすればmainには不要な履歴が残りませんし、まあ普通にswitchしてもいいんですけど、ややこしいのでこっちのほうがいいのかなーと。  

https://git-scm.com/docs/user-manual.html#Documentation/user-manual.txt-orphan

こんな感じになると思います。  

```yaml
name: Keep Alive

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 */30 * *'

env:
  ORPHAN_BRANCH: keep-alive

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
        with:
          fetch-depth: 0

      - name: Update orphan branch
        run: |
          set -e

          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

          if git ls-remote --exit-code --heads origin "$ORPHAN_BRANCH"; then
            git fetch origin "$ORPHAN_BRANCH"
            git switch -C "$ORPHAN_BRANCH" "origin/$ORPHAN_BRANCH"
          else
            git switch --orphan "$ORPHAN_BRANCH"
            git rm -rf . || true
          fi

          mkdir -p .github
          echo "Last run: $(date -u +'%Y-%m-%d %H:%M:%S UTC')" > .github/keep-alive.txt
          echo "This file is automatically updated to keep the repository active and prevent GitHub Actions from disabling scheduled workflows." >> .github/keep-alive.txt

          git add .github/keep-alive.txt

          if git diff --staged --quiet; then
            echo "No changes to commit"
          else
            git commit -m "chore: update keep-alive timestamp [skip ci]"
            git push origin HEAD:"$ORPHAN_BRANCH"
          fi
```

それでは良きGitHub Actionsライフを！  
