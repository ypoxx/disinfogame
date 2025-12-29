#!/bin/bash
# Skript zum Force-Push aller gemergten Branches

echo "🔄 Pushing all resolved branches to GitHub..."
echo ""

branches=(
  "claude/analyze-game-architecture-01QQANagFPqB9yCjDCqR6HHC"
  "claude/fix-cluster-category-error-01L3nzsY5VG8pWuN1cEnmrH6"
  "claude/fix-game-update-issues-01XLamZvRP3SBMy3YBD4C2Ba"
  "claude/fix-network-map-ui-018p9XWUMLA2kvPo2Aw9t3cV"
  "claude/game-concept-discussion-01DZ4W41WoQULbUefNnSeXvF"
  "claude/improve-game-mechanics-012BYXSgcWpX2p8YDZrDY7rF"
  "claude/network-game-ux-research-01HvQi6jxX91cuJFSZMFib93"
  "claude/research-game-improvements-0193LHJNzeCV1uiyNqqBcuir"
  "claude/ui-ux-redesign-01HEtKJEE4Q5kSKjrSiospaT"
  "codex/define-room-states-and-control-with-variables"
)

for branch in "${branches[@]}"; do
  echo "📤 Pushing $branch..."
  git push -f origin "$branch" 2>&1
  if [ $? -eq 0 ]; then
    echo "✅ $branch pushed successfully"
  else
    echo "❌ Failed to push $branch"
  fi
  echo ""
done

echo "✨ Done!"
