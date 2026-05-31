#!/bin/bash
# Quaglio Scripts — Deploy
#
# Staging  = the .webflow.io site  → loads script.js  / styles.css   (live working files)
# Production = your custom domain   → loads script.prod.js / styles.prod.css (frozen snapshots)
#
# Usage:
#   ./deploy.sh                  Push everything. Updates STAGING only (.webflow.io).
#   ./deploy.sh prod <project>   Promote ONE project to PRODUCTION, then push.
#   ./deploy.sh prod             Promote ALL projects to PRODUCTION, then push.
#
# Day-to-day: edit script.js, run ./deploy.sh, test on the .webflow.io site.
# When happy:  run ./deploy.sh prod <project> to push that exact code live.

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

TARGET="${1:-staging}"
PROJECT="$2"

promote_one () {
  local p="$1"
  local dir="projects/$p"
  if [ ! -d "$dir" ]; then
    echo "✗ No project '$p' in projects/"
    exit 1
  fi
  [ -f "$dir/script.js" ]  && cp "$dir/script.js"  "$dir/script.prod.js"  && echo "  ↑ $p/script.prod.js"
  [ -f "$dir/styles.css" ] && cp "$dir/styles.css" "$dir/styles.prod.css" && echo "  ↑ $p/styles.prod.css"
}

if [ "$TARGET" = "prod" ] || [ "$TARGET" = "production" ]; then
  if [ -n "$PROJECT" ]; then
    echo "→ Promoting '$PROJECT' to PRODUCTION..."
    promote_one "$PROJECT"
  else
    echo "→ Promoting ALL projects to PRODUCTION..."
    for d in projects/*/; do
      promote_one "$(basename "$d")"
    done
  fi
  MESSAGE="deploy(prod): ${PROJECT:-all} — $(date '+%Y-%m-%d %H:%M:%S')"
else
  echo "→ Deploying to STAGING (.webflow.io)..."
  MESSAGE="deploy(staging): $(date '+%Y-%m-%d %H:%M:%S')"
fi

# ---- Git sync (local changes win on conflict) ----
if [ -d ".git/rebase-merge" ] || [ -d ".git/rebase-apply" ]; then
  echo "→ Aborting previous incomplete rebase..."
  git rebase --abort
fi

echo "→ Staging local changes..."
git add .

echo "→ Committing: $MESSAGE"
git commit -m "$MESSAGE" 2>/dev/null || echo "  Nothing new to commit."

echo "→ Rebasing on top of remote..."
git fetch origin main
git rebase -X theirs origin/main

echo "→ Pushing to GitHub..."
git push origin main

echo "✓ Done — Vercel will deploy automatically."
