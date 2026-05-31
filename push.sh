#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:-}"

# ---- Project picker ----
pick_project() {
  local projects=()
  for d in "$ROOT/projects/"/*/; do
    [ -d "$d" ] && projects+=("$(basename "$d")")
  done

  if [ ${#projects[@]} -eq 0 ]; then
    echo "  ✗ No projects found in projects/" >&2
    exit 1
  fi

  echo "  Which project?" >&2
  local i=1
  for p in "${projects[@]}"; do
    echo "    $i) $p" >&2
    ((i++))
  done
  echo "    $i) all" >&2
  echo "" >&2
  read -r -p "  Enter number: " sel

  if [ "$sel" = "$i" ]; then
    echo "all"
  elif [[ "$sel" =~ ^[0-9]+$ ]] && [ "$sel" -ge 1 ] && [ "$sel" -lt "$i" ]; then
    echo "${projects[$((sel-1))]}"
  else
    echo "  ✗ Invalid selection. Aborted." >&2
    exit 1
  fi
}

# ---- Final confirmation (allows switching target) ----
# Usage: confirm_push <target> <project>
# Returns the confirmed target (staging or prod)
confirm_push() {
  local target="$1"
  local project="$2"

  echo ""
  echo "  ─────────────────────────────────────────────"
  echo "  Ready to push '$project' to $(echo "$target" | tr '[:lower:]' '[:upper:]')."
  echo "  ─────────────────────────────────────────────"
  echo ""
  echo "    y) Yes, push to $target"
  if [ "$target" = "staging" ]; then
    echo "    p) Switch to prod instead"
  else
    echo "    s) Switch to staging instead"
  fi
  echo "    n) Abort"
  echo ""
  read -r -p "  Choice: " ans

  case "$ans" in
    [yY]) echo "$target" ;;
    [pP]) echo "prod" ;;
    [sS]) echo "staging" ;;
    [nN]|*) echo "abort" ;;
  esac
}

# ---- Prod confirmation (requires typing name) ----
confirm_prod_name() {
  local project="$1"
  if [ "$project" = "all" ]; then
    read -r -p "  Type 'all' to confirm pushing ALL projects live: " ans
    [ "$ans" = "all" ] && return 0 || return 1
  else
    read -r -p "  Type the project name ('$project') to confirm: " ans
    [ "$ans" = "$project" ] && return 0 || return 1
  fi
}

# ---- Entry point ----
if [ "$TARGET" != "staging" ] && [ "$TARGET" != "prod" ]; then
  echo "  Usage: push staging"
  echo "         push prod"
  exit 1
fi

echo ""
if [ "$TARGET" = "staging" ]; then
  echo "  ┌─────────────────────────────────────────────┐"
  echo "  │  PUSH TO STAGING (.webflow.io)               │"
  echo "  └─────────────────────────────────────────────┘"
else
  echo "  ┌─────────────────────────────────────────────┐"
  echo "  │  PUSH TO PRODUCTION (LIVE DOMAIN)            │"
  echo "  └─────────────────────────────────────────────┘"
fi
echo ""

PROJECT="$(pick_project)"

# Show git status for staging context
if [ "$TARGET" = "staging" ]; then
  echo ""
  git -C "$ROOT" status --short
fi

# Final confirmation — user can switch target here
CONFIRMED="$(confirm_push "$TARGET" "$PROJECT")"

if [ "$CONFIRMED" = "abort" ]; then
  echo "  Aborted. Nothing was pushed."
  exit 1
fi

# If target switched to prod, do the name confirmation
if [ "$CONFIRMED" = "prod" ]; then
  echo ""
  echo "  Switching to PRODUCTION. This will make '$PROJECT' LIVE."
  echo "  Make sure you've tested on the .webflow.io site first."
  echo ""
  if ! confirm_prod_name "$PROJECT"; then
    echo "  ✗ Did not match. Aborted — nothing went live."
    exit 1
  fi
  "$ROOT/deploy.sh" prod "$PROJECT"

elif [ "$CONFIRMED" = "staging" ]; then
  "$ROOT/deploy.sh" staging "$PROJECT"
fi
