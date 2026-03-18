#!/bin/bash
# Quaglio Scripts — Git Sync
# Usage: ./sync.sh "optional commit message"

MESSAGE=${1:-"sync: $(date '+%Y-%m-%d %H:%M:%S')"}

echo "→ Pulling latest changes..."
git pull origin main

echo "→ Staging local changes..."
git add .

echo "→ Committing: $MESSAGE"
git commit -m "$MESSAGE" 2>/dev/null || echo "  Nothing new to commit."

echo "→ Pushing to GitHub..."
git push origin main

echo "✓ Done — Vercel will deploy automatically."
