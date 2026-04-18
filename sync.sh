#!/bin/bash
# Quaglio Scripts — Git Sync
# Usage: ./sync.sh "optional commit message"

MESSAGE=${1:-"sync: $(date '+%Y-%m-%d %H:%M:%S')"}

# Abort any stuck rebase from a previous failed run
if [ -d ".git/rebase-merge" ] || [ -d ".git/rebase-apply" ]; then
  echo "→ Aborting previous incomplete rebase..."
  git rebase --abort
fi

echo "→ Staging local changes..."
git add .

echo "→ Committing: $MESSAGE"
git commit -m "$MESSAGE" 2>/dev/null || echo "  Nothing new to commit."

echo "→ Rebasing on top of remote (local changes win on conflict)..."
git fetch origin main
git rebase -X theirs origin/main

echo "→ Pushing to GitHub..."
git push origin main

echo "✓ Done — Vercel will deploy automatically."
