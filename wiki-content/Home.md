# Student Report System Wiki

Welcome to the **Student Report System** documentation! 🎓

A modern, full-stack student report management system built with Next.js 15, React 19, and TypeScript.

---

## 🚀 Quick Links

### For Users
- **[Getting Started](Getting-Started)** - Install and run the application
- **[User Guide](User-Guide)** - Learn how to use all features
- **[Admin Guide](Admin-Guide)** - Administrator features and settings

### For Developers
- **[Developer Guide](Developer-Guide)** - Architecture and code structure
- **[API Documentation](API-Documentation)** - Complete API reference
- **[Database Schema](Database-Schema)** - Database structure and relationships

### Deployment & Configuration
- **[Deployment Guide](Deployment-Guide)** - Deploy to Vercel
- **[Environment Setup](Environment-Setup)** - Configure environment variables
- **[CI/CD Pipeline](CI-CD-Pipeline)** - Continuous integration and deployment

### Help & Support
- **[Troubleshooting](Troubleshooting)** - Common issues and solutions
- **[FAQ](FAQ)** - Frequently asked questions

---

## 🎯 Project Overview

### What is Student Report System?

A comprehensive web application for managing student records and academic reports with features including:

- ✅ **User Authentication** - Secure login with NextAuth.js
- ✅ **Student Management** - Add, edit, view, and delete students
- ✅ **Report Generation** - Create and manage academic reports
- ✅ **Role-Based Access** - Admin, Teacher, and User roles
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Real-time Updates** - Dynamic data loading and updates

### Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Backend** | Next.js API Routes |
| **Database** | Vercel Postgres |
| **ORM** | Prisma 6 |
| **Authentication** | NextAuth.js 4 |
| **Deployment** | Vercel (Singapore region) |

---

## 🔗 Live Application

**Production URL:** https://student-report-ruby.vercel.app

**Demo Credentials:**
```
Email: admin@example.com
Password: admin123
Role: ADMIN
```

⚠️ **Note:** This is a demo account with full access. Please don't delete sample data!

---

## 📊 Key Features

### 1. Authentication System
- User registration and login
- Password hashing with bcrypt
- JWT-based sessions
- Protected routes with middleware

### 2. Student Management
- Create new student profiles
- View all students in a grid/list
- Edit student information
- Delete students (admin only)
- Search and filter students

### 3. Report Management
- Generate academic reports
- Assign reports to students
- View report history
- Edit and update reports
- Grade tracking

### 4. Dashboard
- Overview statistics
- Recent activities
- Quick actions
- User profile management

### 5. Role-Based Access Control
- **ADMIN** - Full access to all features
- **TEACHER** - Manage students and reports
- **USER** - View-only access

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/Dy-Rongrath/student-report.git

# Navigate to directory
cd student-report

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Visit: http://localhost:3000

For detailed instructions, see **[Getting Started](Getting-Started)**

---

## 📖 Documentation Structure

### Getting Started
Complete installation and setup guide for new users.

### User Guide
Step-by-step instructions for using all features with screenshots.

### Admin Guide
Administrator-specific features, settings, and management tools.

### Developer Guide
Technical documentation for developers contributing to the project.

### API Documentation
Complete reference for all API endpoints with examples.

### Database Schema
Database structure, relationships, and data models.

### Deployment Guide
How to deploy the application to production (Vercel).

### Environment Setup
Configuration of environment variables and secrets.

### CI/CD Pipeline
Automated testing and deployment with GitHub Actions.

### Troubleshooting
Solutions to common issues and error messages.

### FAQ
Answers to frequently asked questions.

---

## 📈 Latest Updates

| Date | Update |
|------|--------|
| **2025-10-04** | ✅ Successfully deployed to Vercel |
| **2025-10-04** | ✅ Fixed redirect loop authentication issue |
| **2025-10-04** | ✅ Configured CI/CD pipeline with GitHub Actions |
| **2025-10-03** | ✅ Database setup with Vercel Postgres |
| **2025-10-03** | ✅ Seeded database with sample data |

---

## 🤝 Contributing

We welcome contributions! Please see:
- [Contributing Guidelines](../blob/main/CONTRIBUTING.md) (if exists)
- [Developer Guide](Developer-Guide)
- [Branch Protection Guide](../blob/main/BRANCH_PROTECTION_GUIDE.md)

---

## 🐛 Report Issues

Found a bug or have a suggestion?

- **GitHub Issues:** https://github.com/Dy-Rongrath/student-report/issues
- **Troubleshooting:** See [Troubleshooting](Troubleshooting) page

---

## 📞 Support

Need help? Check these resources:

1. **[FAQ](FAQ)** - Quick answers to common questions
2. **[Troubleshooting](Troubleshooting)** - Solutions to common issues
3. **[GitHub Issues](https://github.com/Dy-Rongrath/student-report/issues)** - Report bugs or request features

---

## 📚 Additional Resources

- **GitHub Repository:** https://github.com/Dy-Rongrath/student-report
- **Live Demo:** https://student-report-ruby.vercel.app
- **Vercel Dashboard:** https://vercel.com/rongraths-projects/student-report
- **Documentation Files:** Check the repository for additional `.md` files

---

## 📄 License

This project is open source. See the [LICENSE](../blob/main/LICENSE) file for details.

---

## 🎉 Getting Help

**New to the project?** Start with [Getting Started](Getting-Started)

**Need to deploy?** Check [Deployment Guide](Deployment-Guide)

**Found a bug?** See [Troubleshooting](Troubleshooting) or [report it](https://github.com/Dy-Rongrath/student-report/issues)

**Have questions?** Check the [FAQ](FAQ)

---

*Last updated: October 4, 2025*

*Maintained by: Dy-Rongrath*
