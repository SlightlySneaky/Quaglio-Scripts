#!/bin/bash
# Push to PRODUCTION (live domain) — strong confirmation: you must type the project name.
# Usage: ./push-prod.sh [project]   (defaults to studio-quaglio)
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
PROJECT="${1:-studio-quaglio}"

if [ ! -d "$ROOT/projects/$PROJECT" ]; then
  echo "  ✗ No project '$PROJECT' in projects/"
  exit 1
fi

echo ""
echo "  ┌─────────────────────────────────────────────┐"
echo "  │  PUSH TO PRODUCTION (LIVE DOMAIN)            │"
echo "  └─────────────────────────────────────────────┘"
echo "  Project: $PROJECT"
echo "  This snapshots script.js → script.prod.js and makes it LIVE."
echo "  Make sure you've tested it on the .webflow.io site first."
echo ""
read -r -p "  Type the project name ('$PROJECT') to confirm: " ans

if [ "$ans" != "$PROJECT" ]; then
  echo "  ✗ Name did not match. Aborted — nothing went live."
  exit 1
fi

"$ROOT/deploy.sh" prod "$PROJECT"
