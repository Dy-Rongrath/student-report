# Quick Wiki Upload Guide

Upload all 11 Wiki pages in under 2 minutes! 🚀

---

## ✅ Prerequisites (Do These First!)

### 1. Enable Wiki on GitHub

**Go to:** https://github.com/Dy-Rongrath/student-report/settings

1. Click **"Settings"** tab
2. Scroll to **"Features"** section
3. Check ✅ **"Wikis"** checkbox
4. Click **"Save changes"**

### 2. Create First Wiki Page

**Go to:** https://github.com/Dy-Rongrath/student-report/wiki

1. Click **"Create the first page"**
2. Title: `Home`
3. Content: Type anything (e.g., "Initial page")
4. Click **"Save Page"**

> ⚠️ **Important:** GitHub requires at least one page before you can clone the wiki repository!

---

## 🚀 Fast Upload Method

### Option 1: Using the Upload Script (Easiest!)

Run this single command:

```bash
./upload-wiki.sh
```

**That's it!** The script will:
- Clone the wiki repository
- Copy all 11 wiki files
- Commit with descriptive message
- Push to GitHub
- Clean up temporary files
- Show success message

**Time:** ~30 seconds ⚡

---

### Option 2: Manual Git Commands

If you prefer manual control:

```bash
# 1. Clone wiki repository
git clone https://github.com/Dy-Rongrath/student-report.wiki.git

# 2. Copy all wiki files
cp wiki-content/*.md student-report.wiki/

# 3. Commit and push
cd student-report.wiki
git add .
git commit -m "Add comprehensive wiki documentation"
git push origin master

# 4. Clean up
cd ..
rm -rf student-report.wiki
```

**Time:** ~1 minute ⚡

---

## 🎯 After Upload

### 1. View Your Wiki

**URL:** https://github.com/Dy-Rongrath/student-report/wiki

### 2. Verify Pages

Check that all pages are visible:
- ✅ Home
- ✅ Getting Started
- ✅ User Guide
- ✅ Admin Guide
- ✅ Developer Guide
- ✅ API Documentation
- ✅ Database Schema
- ✅ Troubleshooting
- ✅ FAQ
- ✅ _Sidebar (appears on right side)
- ✅ _Footer (appears at bottom)

### 3. Test Navigation

- Click links in sidebar
- Click internal links in pages
- Try the search feature
- Check code formatting
- Verify tables render correctly

---

## 🔧 Troubleshooting

### Error: "Failed to clone wiki repository"

**Solution:**
1. Make sure you enabled Wiki in settings
2. Create the first page on GitHub (see step 2 above)
3. Check you have write access to the repository

### Error: "Authentication failed"

**Solution:**
```bash
# Configure Git credentials
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Or use SSH instead of HTTPS
git clone git@github.com:Dy-Rongrath/student-report.wiki.git
```

### Error: "Permission denied"

**Solution:**
- Make sure you're logged into GitHub
- Check you have write permissions
- Try using SSH key authentication

---

## 📱 Add Wiki Link to README

After upload, add this to your `README.md`:

```markdown
## 📚 Documentation

Complete documentation is available in our [Wiki](https://github.com/Dy-Rongrath/student-report/wiki):

- [Getting Started](https://github.com/Dy-Rongrath/student-report/wiki/Getting-Started) - Installation & setup
- [User Guide](https://github.com/Dy-Rongrath/student-report/wiki/User-Guide) - How to use the system
- [Admin Guide](https://github.com/Dy-Rongrath/student-report/wiki/Admin-Guide) - Administrator features
- [Developer Guide](https://github.com/Dy-Rongrath/student-report/wiki/Developer-Guide) - Technical documentation
- [API Documentation](https://github.com/Dy-Rongrath/student-report/wiki/API-Documentation) - API reference
- [Troubleshooting](https://github.com/Dy-Rongrath/student-report/wiki/Troubleshooting) - Common issues
- [FAQ](https://github.com/Dy-Rongrath/student-report/wiki/FAQ) - Frequently asked questions
```

---

## 🎉 Success!

Once uploaded, you'll have:
- ✅ 11 professional Wiki pages
- ✅ 6,000+ lines of documentation
- ✅ Navigation sidebar
- ✅ Footer with links
- ✅ Searchable content
- ✅ Code examples with syntax highlighting
- ✅ Organized tables and diagrams

**Your wiki URL:**
```
https://github.com/Dy-Rongrath/student-report/wiki
```

Share this link with your team, users, and contributors! 🚀

---

## 📝 Updating Wiki Later

To update any page:

```bash
# Clone wiki
git clone https://github.com/Dy-Rongrath/student-report.wiki.git

# Edit files
cd student-report.wiki
nano Home.md  # or use your editor

# Commit and push
git add .
git commit -m "Update Home page"
git push

# Clean up
cd ..
rm -rf student-report.wiki
```

---

## 💡 Tips

1. **Bookmark your wiki** - Add to browser favorites
2. **Pin important pages** - GitHub allows pinning pages
3. **Enable wiki history** - Track changes over time
4. **Allow collaborators** - Let team members contribute
5. **Use search** - Built-in GitHub wiki search is powerful

---

**Ready?** Run `./upload-wiki.sh` and watch the magic happen! ✨
