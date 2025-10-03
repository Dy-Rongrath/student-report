# 🛡️ Branch Protection Guide

## How to Protect Your Main Branch on GitHub

Branch protection prevents accidental code changes and enforces quality standards.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Go to Branch Settings

1. Visit your repository: https://github.com/Dy-Rongrath/student-report
2. Click **Settings** (top right)
3. In left sidebar, click **Branches**
4. Under "Branch protection rules", click **Add rule**

Direct link: https://github.com/Dy-Rongrath/student-report/settings/branches

---

## 🔒 Recommended Protection Rules

### Basic Protection (Minimum)

**Branch name pattern:** `main`

Then enable these:

#### ✅ Require a pull request before merging
- ☑️ Require approvals: `1`
- ☑️ Dismiss stale pull request approvals when new commits are pushed
- ☑️ Require review from Code Owners (optional)

#### ✅ Require status checks to pass before merging
- ☑️ Require branches to be up to date before merging
- Add status checks:
  - `lint` (from your CI/CD)
  - `build` (from your CI/CD)
  - `test` (from your CI/CD)

#### ✅ Require conversation resolution before merging
- Forces all review comments to be resolved

#### ✅ Require signed commits (optional)
- Ensures commits are cryptographically signed

#### ✅ Include administrators
- ☑️ Enforce rules for administrators too

#### ✅ Restrict who can push to matching branches (optional)
- Only specified users/teams can push directly

---

## 📋 Step-by-Step Setup

### Configuration Screen:

```
Branch name pattern: main

☑️ Require a pull request before merging
   ☑️ Require approvals: 1
   ☑️ Dismiss stale pull request approvals

☑️ Require status checks to pass
   ☑️ Require branches to be up to date
   Status checks to require:
   - lint
   - build
   - test
   - security-audit

☑️ Require conversation resolution before merging

☑️ Require linear history (optional)

☑️ Include administrators

☐ Allow force pushes (Keep UNCHECKED)
☐ Allow deletions (Keep UNCHECKED)
```

Click **Create** or **Save changes**

---

## 🎯 What Each Rule Does

### 1. Require Pull Request Before Merging
**What it does:**
- No direct commits to `main`
- All changes must go through pull requests
- Requires code review approval

**Benefit:**
- ✅ Prevents accidental commits
- ✅ Ensures code review
- ✅ Maintains code quality

### 2. Require Status Checks
**What it does:**
- CI/CD must pass before merging
- Runs tests, linting, and builds

**Benefit:**
- ✅ No broken code in main
- ✅ Automated quality checks
- ✅ Catches bugs early

### 3. Require Conversation Resolution
**What it does:**
- All review comments must be resolved
- Forces team communication

**Benefit:**
- ✅ No unaddressed feedback
- ✅ Better code quality
- ✅ Clear communication

### 4. Restrict Force Push
**What it does:**
- Prevents `git push --force`
- Maintains git history

**Benefit:**
- ✅ Can't overwrite history
- ✅ Prevents data loss
- ✅ Safe collaboration

### 5. Prevent Branch Deletion
**What it does:**
- Can't delete the `main` branch

**Benefit:**
- ✅ Prevents accidents
- ✅ Repository always has main

---

## 🔄 Workflow with Protected Branch

### Old Way (Unprotected):
```bash
git checkout main
git add .
git commit -m "changes"
git push origin main  # ✅ Works directly
```

### New Way (Protected):
```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
git add .
git commit -m "Add new feature"

# 3. Push feature branch
git push origin feature/my-feature

# 4. Create Pull Request on GitHub
# Go to: https://github.com/Dy-Rongrath/student-report/pulls
# Click "New Pull Request"

# 5. Wait for CI/CD checks to pass
# 6. Get approval from reviewer
# 7. Merge via GitHub UI
```

---

## 🌿 Working with Feature Branches

### Create Feature Branch:
```bash
# Start from main
git checkout main
git pull origin main

# Create new branch
git checkout -b feature/add-student-search
```

### Make Changes:
```bash
# Edit files
nano src/app/students/page.tsx

# Stage and commit
git add .
git commit -m "Add student search functionality"
```

### Push to GitHub:
```bash
git push origin feature/add-student-search
```

### Create Pull Request:
1. Go to: https://github.com/Dy-Rongrath/student-report
2. You'll see a yellow banner: "Compare & pull request"
3. Click it
4. Add description of changes
5. Click "Create pull request"

### Wait for Checks:
```
⏳ lint - Running...
⏳ build - Running...
⏳ test - Running...
⏳ security-audit - Running...

✅ lint - Passed
✅ build - Passed
✅ test - Passed
✅ security-audit - Passed
```

### Merge:
1. Click "Merge pull request"
2. Confirm merge
3. Delete feature branch (optional)

---

## 🚨 What Happens If Rules Are Violated?

### Direct Push to Main (Protected):
```bash
git push origin main

# Error:
# remote: error: GH006: Protected branch update failed
# remote: error: Required status check "build" has not passed
# remote: error: At least 1 approving review is required
```

### Force Push:
```bash
git push --force origin main

# Error:
# remote: error: GH006: Protected branch update failed
# remote: error: Cannot force-push to a protected branch
```

---

## 👥 Team Collaboration

### For Team Members:
1. Clone repository
2. Create feature branch
3. Make changes
4. Push feature branch
5. Create pull request
6. Wait for review
7. Address feedback
8. Get approval
9. Merge

### For Reviewers:
1. Get notification of pull request
2. Review code changes
3. Leave comments/suggestions
4. Approve or request changes
5. PR creator addresses feedback
6. Approve when ready
7. PR creator merges

---

## 🎯 Best Practices

### Branch Naming Convention:
```
feature/description  - New features
fix/description      - Bug fixes
hotfix/description   - Urgent fixes
docs/description     - Documentation
refactor/description - Code refactoring
test/description     - Test additions
```

**Examples:**
```
feature/student-search
fix/login-redirect-loop
hotfix/database-connection
docs/api-documentation
refactor/auth-middleware
test/student-api-tests
```

### Commit Messages:
```
✅ Good:
- "Add student search functionality"
- "Fix redirect loop in authentication"
- "Update API documentation"

❌ Bad:
- "update"
- "fix stuff"
- "asdfasdf"
```

---

## 📊 Protection Levels

### Level 1: Basic (Minimum)
- ✅ Require pull request
- ✅ Require 1 approval

**Good for:** Solo projects, learning

### Level 2: Standard (Recommended)
- ✅ Require pull request
- ✅ Require 1 approval
- ✅ Require status checks
- ✅ Require conversation resolution

**Good for:** Small teams, production apps

### Level 3: Strict (Enterprise)
- ✅ Everything from Level 2
- ✅ Require 2+ approvals
- ✅ Require code owner review
- ✅ Require signed commits
- ✅ Restrict push to specific users

**Good for:** Large teams, critical systems

---

## 🔧 Your Current Setup

### Repository Info:
- **Name:** student-report
- **Owner:** Dy-Rongrath
- **Current Branch:** main
- **Protection:** ⚠️ Not configured yet

### Recommended Setup:
```
Branch: main

Protection Rules:
✅ Require pull request (1 approval)
✅ Require status checks:
   - lint
   - build
   - test
   - security-audit
✅ Require conversation resolution
✅ Include administrators
❌ No force push
❌ No deletion
```

---

## 🚀 Quick Setup Script

### Option 1: Via GitHub UI (Recommended)
1. https://github.com/Dy-Rongrath/student-report/settings/branches
2. Click "Add rule"
3. Branch name: `main`
4. Enable recommended rules above
5. Click "Create"

### Option 2: Via GitHub CLI (Advanced)
```bash
# Install GitHub CLI first
gh auth login

# Create protection rule
gh api repos/Dy-Rongrath/student-report/branches/main/protection \
  -X PUT \
  -f required_status_checks='{"strict":true,"contexts":["lint","build","test"]}' \
  -f enforce_admins=true \
  -f required_pull_request_reviews='{"required_approving_review_count":1}'
```

---

## ⚠️ Important Notes

### For Solo Development:
- ✅ Still use pull requests (good practice)
- ✅ You can approve your own PRs (GitHub allows this)
- ✅ Keeps code history clean

### Emergency Override:
If you're an admin and need to bypass rules:
1. Go to Settings → Branches
2. Temporarily disable protection
3. Make urgent fix
4. Re-enable protection

**Better approach:**
1. Create `hotfix/` branch
2. Fast-track review
3. Merge via PR

---

## 📚 Additional Resources

- **GitHub Docs:** https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- **Your Repository:** https://github.com/Dy-Rongrath/student-report
- **Branch Settings:** https://github.com/Dy-Rongrath/student-report/settings/branches

---

## ✅ Summary

| Action | Without Protection | With Protection |
|--------|-------------------|-----------------|
| Direct push to main | ✅ Allowed | ❌ Blocked |
| Force push | ✅ Allowed | ❌ Blocked |
| Delete branch | ✅ Allowed | ❌ Blocked |
| Merge without review | ✅ Allowed | ❌ Blocked |
| Merge failing CI | ✅ Allowed | ❌ Blocked |

---

## 🎉 Benefits of Branch Protection

1. ✅ **Code Quality** - All code reviewed
2. ✅ **Prevent Accidents** - Can't accidentally break main
3. ✅ **Team Collaboration** - Structured code review process
4. ✅ **CI/CD Integration** - Automated quality checks
5. ✅ **Git History** - Clean, linear history
6. ✅ **Rollback Safety** - Easy to revert if needed
7. ✅ **Professional** - Industry standard practice

---

**Ready to protect your branch?**

👉 Go to: https://github.com/Dy-Rongrath/student-report/settings/branches

👉 Click "Add rule" and follow the guide above!
