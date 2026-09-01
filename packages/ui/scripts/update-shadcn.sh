#!/usr/bin/env bash
set -euo pipefail

COMPONENTS_DIR="src/components/ui"

if [ ! -d "$COMPONENTS_DIR" ]; then
  echo "❌ Components directory not found: $COMPONENTS_DIR"
  exit 1
fi

# Detect installed components (strip .tsx extension)
components=()
while IFS= read -r line; do
  [ -n "$line" ] && components+=("$line")
done <<COMPONENTS_EOF
$(find "$COMPONENTS_DIR" -maxdepth 1 -name '*.tsx' -exec basename {} .tsx \; | sort)
COMPONENTS_EOF

if [ ${#components[@]} -eq 0 ]; then
  echo "⚠️  No components found in $COMPONENTS_DIR"
  exit 0
fi

echo "🔄 Found ${#components[@]} component(s) to update:"
echo "   ${components[*]}"
echo ""

failed=()
for component in "${components[@]}"; do
  echo "⬆️  Updating $component..."
  if npx shadcn@latest add "$component" --overwrite --yes; then
    echo "   ✅ $component updated"
  else
    echo "   ❌ Failed to update $component"
    failed+=("$component")
  fi
  echo ""
done

if [ ${#failed[@]} -gt 0 ]; then
  echo "⚠️  ${#failed[@]} component(s) failed to update:"
  for component in "${failed[@]}"; do
    echo "   - $component"
  done
  exit 1
fi

echo "🎉 All components updated successfully!"
