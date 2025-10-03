#!/bin/bash
# Quick verification script for auto-merge setup

echo "🔍 Checking Auto-Merge Setup..."
echo ""

# Check if workflow file exists
if [ -f ".github/workflows/auto-merge-dependabot.yml" ]; then
    echo "✅ Workflow file exists"
else
    echo "❌ Workflow file missing"
    exit 1
fi

# Check if we're in a git repo
if [ -d ".git" ]; then
    echo "✅ Git repository detected"
else
    echo "❌ Not in a git repository"
    exit 1
fi

# Check remote
REMOTE=$(git remote get-url origin 2>/dev/null)
if [[ $REMOTE == *"student-report"* ]]; then
    echo "✅ Correct repository: $REMOTE"
else
    echo "⚠️  Repository: $REMOTE"
fi

# Check if workflow is pushed
WORKFLOW_IN_REMOTE=$(git ls-remote --heads origin main | grep -c "main")
if [ $WORKFLOW_IN_REMOTE -eq 1 ]; then
    echo "✅ Workflow pushed to GitHub"
else
    echo "⚠️  Unable to verify remote status"
fi

echo ""
echo "📋 TODO: Manual GitHub Settings"
echo ""
echo "You still need to enable in GitHub web interface:"
echo ""
echo "1️⃣  Enable Auto-Merge:"
echo "   → https://github.com/Dy-Rongrath/student-report/settings"
echo "   → Check: ☑️ 'Allow auto-merge'"
echo ""
echo "2️⃣  Enable Workflow Permissions:"
echo "   → https://github.com/Dy-Rongrath/student-report/settings/actions"
echo "   → Select: ⦿ 'Read and write permissions'"
echo "   → Check: ☑️ 'Allow GitHub Actions to create and approve pull requests'"
echo ""
echo "3️⃣  Verify in Actions:"
echo "   → https://github.com/Dy-Rongrath/student-report/actions"
echo "   → Should see: 'Auto-merge Dependabot PRs' workflow"
echo ""
echo "⏰ Next Dependabot run: Monday, October 7, 2025 at 6:00 AM UTC"
echo ""
echo "📖 Full guide: AUTO_MERGE_GUIDE.md"
echo "🚀 Quick start: ENABLE_AUTO_MERGE_NOW.md"
