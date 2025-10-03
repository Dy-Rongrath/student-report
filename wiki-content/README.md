# Wiki Content Files

This folder contains all the Markdown content files ready to be uploaded to GitHub Wiki.

## 📁 Files Overview

| File | Purpose | Status |
|------|---------|--------|
| `Home.md` | Wiki home page with project overview | ✅ Ready |
| `Getting-Started.md` | Installation and setup guide | ✅ Ready |
| `User-Guide.md` | End-user documentation | ✅ Ready |
| `Admin-Guide.md` | Administrator features | ✅ Ready |
| `Developer-Guide.md` | Technical developer docs | ✅ Ready |
| `API-Documentation.md` | Complete API reference | ✅ Ready |
| `Database-Schema.md` | Database structure docs | ✅ Ready |
| `Troubleshooting.md` | Common issues and solutions | ✅ Ready |
| `FAQ.md` | Frequently asked questions | ✅ Ready |
| `_Sidebar.md` | Wiki sidebar navigation | ✅ Ready |
| `_Footer.md` | Wiki footer | ✅ Ready |

## 🚀 How to Upload to GitHub Wiki

### Method 1: Using GitHub Web Interface (Easiest)

1. **Enable Wiki on GitHub:**
   - Go to your repository: https://github.com/Dy-Rongrath/student-report
   - Click **"Settings"** tab
   - Scroll down to **"Features"** section
   - Check ✅ **"Wikis"**
   - Click **"Save"**

2. **Access Wiki:**
   - Go to repository homepage
   - Click **"Wiki"** tab at the top
   - Click **"Create the first page"** or **"New Page"**

3. **Create Each Page:**
   
   **For Home Page:**
   - Title: `Home`
   - Copy content from `wiki-content/Home.md`
   - Paste into editor
   - Click **"Save Page"**
   
   **For Other Pages:**
   - Click **"New Page"**
   - Title: `Getting Started` (match the file name)
   - Copy content from respective `.md` file
   - Click **"Save Page"**
   - Repeat for all pages

4. **Add Sidebar & Footer:**
   - Create new page titled `_Sidebar`
   - Copy content from `_Sidebar.md`
   - Create new page titled `_Footer`
   - Copy content from `_Footer.md`

### Method 2: Using Git (Advanced)

```bash
# 1. Clone the wiki repository
git clone https://github.com/Dy-Rongrath/student-report.wiki.git

# 2. Copy all wiki content files
cp wiki-content/*.md student-report.wiki/

# 3. Commit and push
cd student-report.wiki
git add .
git commit -m "Add comprehensive wiki documentation"
git push origin master
```

### Method 3: Using GitHub CLI

```bash
# Upload files using gh CLI
gh repo clone Dy-Rongrath/student-report.wiki
cd student-report.wiki
cp ../wiki-content/*.md .
git add .
git commit -m "Add wiki pages"
git push
```

## 📝 Page Titles on GitHub

When creating pages on GitHub Wiki, use these exact titles:

```
Home                  (from Home.md)
Getting Started       (from Getting-Started.md)
User Guide           (from User-Guide.md)
Admin Guide          (from Admin-Guide.md)
Developer Guide      (from Developer-Guide.md)
API Documentation    (from API-Documentation.md)
Database Schema      (from Database-Schema.md)
Troubleshooting      (from Troubleshooting.md)
FAQ                  (from FAQ.md)
_Sidebar             (from _Sidebar.md)
_Footer              (from _Footer.md)
```

**Note:** GitHub automatically converts page titles to URLs:
- `Getting Started` → `/Getting-Started`
- `User Guide` → `/User-Guide`

## 🔗 Internal Links

All internal links in the wiki files use the format:
```markdown
[Link Text](Page-Name)
```

Examples:
```markdown
[Getting Started](Getting-Started)
[User Guide](User-Guide)
[API Documentation](API-Documentation)
```

These will work automatically once all pages are uploaded to GitHub Wiki.

## ✅ Verification Checklist

After uploading all pages:

- [ ] All 9 main pages are created
- [ ] Sidebar appears on all pages
- [ ] Footer appears on all pages
- [ ] All internal links work
- [ ] Images display correctly (if any)
- [ ] Code blocks are formatted
- [ ] Tables render properly
- [ ] Navigation is smooth

## 📚 Wiki Structure

```
GitHub Wiki
├── Home                    (Landing page)
├── Getting Started         (Installation)
├── User Guide             (End users)
├── Admin Guide            (Administrators)
├── Developer Guide        (Developers)
├── API Documentation      (API reference)
├── Database Schema        (Database docs)
├── Troubleshooting        (Common issues)
├── FAQ                    (Questions)
├── _Sidebar               (Navigation menu)
└── _Footer                (Footer links)
```

## 🎨 Wiki Features

Your wiki will have:
- ✅ Professional navigation sidebar
- ✅ Consistent footer on all pages
- ✅ Comprehensive documentation (9 pages)
- ✅ Internal cross-references
- ✅ Code examples with syntax highlighting
- ✅ Tables and diagrams
- ✅ Quick links and shortcuts
- ✅ Search functionality (built-in GitHub Wiki)

## 🔄 Updating Wiki

To update any page:

**Web Interface:**
1. Go to Wiki → Select page
2. Click **"Edit"**
3. Make changes
4. Click **"Save Page"**

**Git:**
```bash
cd student-report.wiki
# Edit files
git add .
git commit -m "Update wiki documentation"
git push
```

## 📱 Accessing Wiki

**Direct URL:**
```
https://github.com/Dy-Rongrath/student-report/wiki
```

**From Repository:**
- Click **"Wiki"** tab at the top

**From README:**
Add link to your README.md:
```markdown
📚 [View Wiki Documentation](https://github.com/Dy-Rongrath/student-report/wiki)
```

## 🎉 Benefits

Your wiki provides:
- Complete documentation for users, admins, and developers
- Easy navigation with sidebar
- Searchable content
- Version-controlled documentation
- Professional appearance
- Community contributions enabled

## 💡 Tips

1. **Upload in order:** Start with Home, then other pages
2. **Check links:** After each upload, test internal links
3. **Preview:** Use GitHub's preview before saving
4. **Backup:** Keep these files in your repo under `/wiki-content`
5. **Update:** Keep wiki in sync with code changes

## 🆘 Need Help?

If you encounter issues:
1. Check GitHub Wiki documentation
2. Verify all files uploaded correctly
3. Test internal links
4. Check for typos in page titles

---

**Ready to upload!** Follow Method 1 (easiest) to get your comprehensive wiki live in minutes! 🚀
