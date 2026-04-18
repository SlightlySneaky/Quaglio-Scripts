#!/bin/bash
# Quaglio Scripts — Git Sync
# Usage: ./sync.sh "optional commit message"

MESSAGE=${1:-"sync: $(date '+%Y-%m-%d %H:%M:%S')"}

# Stash any local changes so pull can proceed cleanly
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "→ Stashing local changes..."
  git stash push -m "sync-stash"
  STASHED=1
fi

echo "→ Pulling latest changes..."
git pull origin main

# Restore stashed changes on top of the pulled state
if [ "$STASHED" = "1" ]; then
  echo "→ Restoring local changes..."
  git stash pop
fi

echo "→ Staging local changes..."
git add .

echo "→ Committing: $MESSAGE"
git commit -m "$MESSAGE" 2>/dev/null || echo "  Nothing new to commit."

echo "→ Pushing to GitHub..."
git push origin main

echo "✓ Done — Vercel will deploy automatically."
