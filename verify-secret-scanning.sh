#!/bin/bash
# Verification script for Secret Scanning setup

echo "🔐 Verifying Secret Scanning Setup..."
echo "======================================"
echo ""

# Check if we're in the right repo
if [ -d ".git" ]; then
    REPO_URL=$(git remote get-url origin 2>/dev/null)
    if [[ $REPO_URL == *"student-report"* ]]; then
        echo "✅ Correct repository: student-report"
    else
        echo "⚠️  Repository: $REPO_URL"
    fi
else
    echo "❌ Not in a git repository"
    exit 1
fi

echo ""
echo "📊 Local Security Check Results:"
echo ""

# Check .gitignore for env protection
if grep -q "^\.env" .gitignore 2>/dev/null; then
    echo "✅ .env files protected in .gitignore"
else
    echo "⚠️  .env protection not found in .gitignore"
fi

# Check for .env files in git history
ENV_IN_HISTORY=$(git log --all --full-history --source -- .env 2>/dev/null | wc -l)
if [ "$ENV_IN_HISTORY" -eq 0 ]; then
    echo "✅ No .env files in git history"
else
    echo "⚠️  Found $ENV_IN_HISTORY commit(s) with .env file"
fi

# Check for environment variable usage in code
if grep -r "process\.env\." src/ --include="*.ts" --include="*.tsx" > /dev/null 2>&1; then
    echo "✅ Using environment variables correctly"
else
    echo "⚠️  No environment variables found (unusual)"
fi

# Check for potential hardcoded secrets (basic patterns)
echo ""
echo "🔍 Scanning for potential secrets..."

# Check for common secret patterns
POTENTIAL_SECRETS=$(grep -r -E "(api[_-]?key|secret[_-]?key|password|token)\s*=\s*['\"][^'\"]{20,}" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)

if [ "$POTENTIAL_SECRETS" -eq 0 ]; then
    echo "✅ No hardcoded secrets detected in source code"
else
    echo "⚠️  Found $POTENTIAL_SECRETS potential secret pattern(s)"
    echo "   (May be false positives - review manually)"
fi

echo ""
echo "🌐 GitHub Settings to Enable:"
echo ""
echo "You need to enable these manually on GitHub:"
echo ""
echo "1️⃣  Secret Scanning"
echo "   → https://github.com/Dy-Rongrath/student-report/settings/security_analysis"
echo "   → Click [Enable] under 'Secret scanning'"
echo ""
echo "2️⃣  Push Protection"
echo "   → Same page, click [Enable] under 'Push protection'"
echo ""
echo "3️⃣  Private Vulnerability Reporting"
echo "   → Same page, click [Enable] under 'Private vulnerability reporting'"
echo ""
echo "📋 After Enabling, Verify Here:"
echo ""
echo "Secret Scanning Results:"
echo "→ https://github.com/Dy-Rongrath/student-report/security/secret-scanning"
echo ""
echo "Security Overview:"
echo "→ https://github.com/Dy-Rongrath/student-report/security"
echo ""
echo "🎯 Expected Results After Enabling:"
echo ""
echo "✅ Secret scanning: Enabled"
echo "✅ Push protection: Enabled"
echo "✅ Private reporting: Enabled"
echo "✅ Scan result: No secrets detected"
echo ""
echo "⏰ Time required: 2 minutes to click Enable buttons"
echo "📖 Full guide: ENABLE_SECRET_SCANNING_NOW.md"
echo ""
echo "🎉 Once enabled, your repository will have maximum security protection!"
