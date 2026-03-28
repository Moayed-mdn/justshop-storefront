#!/bin/bash

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <file_or_path> ..."
  exit 1
fi

ROOT_DIR=$(pwd)
EXCLUDE_DIRS=("node_modules" ".git" "dist" "build" ".nuxt" "vendor")

# Build prune expression
PRUNE_EXPR=""
for dir in "${EXCLUDE_DIRS[@]}"; do
  PRUNE_EXPR="$PRUNE_EXPR -name $dir -o"
done
PRUNE_EXPR="${PRUNE_EXPR% -o}"

FINAL_SELECTION=()

for keyword in "$@"; do
  # 🔥 Flexible pattern (handles paths)
  pattern=$(echo "$keyword" | sed 's#/#*#g')

  matches=$(find "$ROOT_DIR" \
    \( $PRUNE_EXPR \) -type d -prune -false -o \
    -type f -ipath "*$pattern*" 2>/dev/null)

  count=$(echo "$matches" | sed '/^$/d' | wc -l)

  if [ "$count" -eq 0 ]; then
    echo "❌ No match for: $keyword"
    continue
  fi

  if [ "$count" -eq 1 ]; then
    FINAL_SELECTION+=("$matches")
  else
    echo ""
    echo "========================================"
    echo "⚠️  Conflict for keyword: $keyword"
    echo "👉 Multiple files found. Select one or more (TAB + ENTER)"
    echo "----------------------------------------"
    echo "$matches" | sed 's/^/📄 File: /'
    echo "----------------------------------------"
    #sleep 10;
    if command -v fzf >/dev/null 2>&1; then
      selected=$(echo "$matches" | fzf \
  --multi \
  --header="⚠️ Conflict for keyword: $keyword (TAB to select, ENTER to confirm)" \
  --preview 'bat --style=numbers --color=always {} 2>/dev/null || cat {}')
    else
      echo "⚠️ fzf not installed, selecting all"
      selected="$matches"
    fi

    for file in $selected; do
      FINAL_SELECTION+=("$file")
    done
  fi
done

# Remove duplicates
UNIQUE_SELECTION=$(printf "%s\n" "${FINAL_SELECTION[@]}" | sort -u)

# Print results
for file in $UNIQUE_SELECTION; do
  echo "========================================"
  echo "📄 File: $file"
  echo "----------------------------------------"

  if command -v bat >/dev/null 2>&1; then
    bat "$file"
  else
    cat "$file"
  fi

  echo -e "\n"
done