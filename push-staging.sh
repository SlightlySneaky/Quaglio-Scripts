#!/bin/bash
# Push to STAGING (.webflow.io) — asks for confirmation first.
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  ┌─────────────────────────────────────────────┐"
echo "  │  PUSH TO STAGING (.webflow.io)               │"
echo "  └─────────────────────────────────────────────┘"
echo "  Commits ALL current changes and updates the staging site."
echo "  Production (live domain) is NOT affected."
echo ""

git -C "$ROOT" status --short

echo ""
read -r -p "  Proceed with staging push? (y/N) " ans
case "$ans" in
  [yY]|[yY][eE][sS]) ;;
  *) echo "  Aborted. Nothing was committed or pushed."; exit 1 ;;
esac

"$ROOT/deploy.sh"
