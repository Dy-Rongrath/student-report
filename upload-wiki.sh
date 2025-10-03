#!/bin/bash

# Wiki Upload Script for Student Report System
# This script automatically uploads all wiki content to GitHub Wiki

set -e  # Exit on error

echo "🚀 Starting Wiki Upload Process..."
echo ""

# Configuration
WIKI_REPO="https://github.com/Dy-Rongrath/student-report.wiki.git"
WIKI_DIR="student-report.wiki"
SOURCE_DIR="wiki-content"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if wiki-content directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}❌ Error: wiki-content directory not found!${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Found wiki-content directory with $(ls -1 $SOURCE_DIR/*.md | wc -l) files${NC}"
echo ""

# Step 2: Clean up any existing wiki clone
if [ -d "$WIKI_DIR" ]; then
    echo -e "${YELLOW}🗑️  Removing existing wiki directory...${NC}"
    rm -rf "$WIKI_DIR"
fi

# Step 3: Clone the wiki repository
echo -e "${BLUE}📥 Cloning wiki repository...${NC}"
if git clone "$WIKI_REPO" 2>/dev/null; then
    echo -e "${GREEN}✅ Wiki repository cloned successfully${NC}"
else
    echo -e "${RED}❌ Error: Failed to clone wiki repository${NC}"
    echo -e "${YELLOW}⚠️  Make sure you:${NC}"
    echo "   1. Enabled Wiki in repository settings"
    echo "   2. Created the first wiki page on GitHub"
    echo "   3. Have write access to the repository"
    exit 1
fi
echo ""

# Step 4: Copy all wiki files
echo -e "${BLUE}📋 Copying wiki files...${NC}"
cd "$WIKI_DIR"

# Copy all markdown files
cp ../$SOURCE_DIR/*.md .

echo -e "${GREEN}✅ Copied $(ls -1 *.md | wc -l) files:${NC}"
ls -1 *.md | sed 's/^/   - /'
echo ""

# Step 5: Commit and push
echo -e "${BLUE}📤 Committing and pushing to GitHub...${NC}"

git add .
git commit -m "Add comprehensive wiki documentation

- Home page with project overview
- Getting Started guide
- User Guide for end users
- Admin Guide for administrators
- Developer Guide with technical details
- API Documentation with complete reference
- Database Schema documentation
- Troubleshooting guide
- FAQ with 40+ questions
- Sidebar navigation
- Footer with links

Total: 11 pages, 6000+ lines of documentation"

if git push origin master 2>/dev/null || git push origin main 2>/dev/null; then
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
else
    echo -e "${RED}❌ Error: Failed to push to GitHub${NC}"
    echo -e "${YELLOW}⚠️  You may need to authenticate or check permissions${NC}"
    cd ..
    exit 1
fi

# Step 6: Cleanup
cd ..
echo ""
echo -e "${BLUE}🧹 Cleaning up...${NC}"
rm -rf "$WIKI_DIR"

# Success message
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Wiki Upload Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📚 Your wiki is now live at:${NC}"
echo -e "   ${YELLOW}https://github.com/Dy-Rongrath/student-report/wiki${NC}"
echo ""
echo -e "${BLUE}📄 Pages uploaded:${NC}"
echo "   ✅ Home (Landing page)"
echo "   ✅ Getting Started (Installation guide)"
echo "   ✅ User Guide (End-user features)"
echo "   ✅ Admin Guide (Administrator features)"
echo "   ✅ Developer Guide (Technical docs)"
echo "   ✅ API Documentation (API reference)"
echo "   ✅ Database Schema (Database docs)"
echo "   ✅ Troubleshooting (Common issues)"
echo "   ✅ FAQ (40+ questions)"
echo "   ✅ _Sidebar (Navigation menu)"
echo "   ✅ _Footer (Footer links)"
echo ""
echo -e "${GREEN}✨ Visit your wiki to see the professional documentation!${NC}"
echo ""
