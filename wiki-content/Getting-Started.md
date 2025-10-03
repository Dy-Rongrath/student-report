# Getting Started

Welcome! This guide will help you install and run the Student Report System on your local machine.

---

## 📋 Prerequisites

Before you begin, make sure you have these installed:

### Required Software

| Software | Minimum Version | Check Version | Download |
|----------|----------------|---------------|----------|
| **Node.js** | 18.0.0 or higher | `node --version` | [nodejs.org](https://nodejs.org) |
| **npm** | 9.0.0 or higher | `npm --version` | Included with Node.js |
| **Git** | 2.0.0 or higher | `git --version` | [git-scm.com](https://git-scm.com) |

### Optional (But Recommended)
- **VS Code** - [Download](https://code.visualstudio.com/)
- **GitHub Desktop** - [Download](https://desktop.github.com/)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/Dy-Rongrath/student-report.git

# Or using SSH
git clone git@github.com:Dy-Rongrath/student-report.git

# Navigate to directory
cd student-report
```

### Step 2: Install Dependencies

```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

**Expected output:**
```
added 608 packages in 15s
```

### Step 3: Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Database - Vercel Postgres
DATABASE_URL="your-postgres-connection-string"

# Authentication - NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Additional configuration
AUTH_TRUST_HOST="true"
```

**Where to get these values:**
- `DATABASE_URL`: See [Database Setup Guide](Database-Schema#setup)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Use `http://localhost:3000` for development

### Step 4: Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push database schema (creates tables)
npx prisma db push

# Seed database with sample data (optional)
npm run db:seed
```

**Expected output:**
```
✅ Database schema pushed
✅ Admin account created: admin@example.com
✅ 3 sample students added
✅ 3 sample reports added
```

### Step 5: Run Development Server

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 15.5.4
  - Local:        http://localhost:3000
  - Turbopack:    enabled

 ✓ Ready in 2.5s
```

### Step 6: Open in Browser

Visit: **http://localhost:3000**

You should see the home page! 🎉

---

## 🔐 First Login

### Default Admin Account

After seeding the database, you can log in with:

```
Email: admin@example.com
Password: admin123
```

⚠️ **Security Note:** Change the admin password immediately in production!

### Accessing the Dashboard

1. Click **"Sign In"** in the header
2. Enter the admin credentials above
3. You'll be redirected to `/dashboard`
4. Explore Students and Reports pages

---

## 🧪 Verify Installation

### Check if Everything Works

#### 1. Home Page
- URL: http://localhost:3000
- Should show: Features list and navigation

#### 2. Sign In Page
- URL: http://localhost:3000/auth/signin
- Should show: Login form

#### 3. Dashboard (After Login)
- URL: http://localhost:3000/dashboard
- Should show: Dashboard overview

#### 4. Students Page
- URL: http://localhost:3000/students
- Should show: List of 3 sample students

#### 5. Reports Page
- URL: http://localhost:3000/reports
- Should show: List of 3 sample reports

#### 6. API Endpoints
- URL: http://localhost:3000/api/students
- Should return: JSON array of students

---

## 📂 Project Structure

After installation, your project structure:

```
student-report/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Home page
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── students/          # Student pages
│   │   ├── reports/           # Report pages
│   │   ├── auth/              # Auth pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── lib/                   # Utilities and configs
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Route protection
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── public/                    # Static files
├── .env.local                 # Environment variables (you created this)
├── package.json               # Dependencies
└── README.md                  # Project overview
```

---

## 🎯 Available Scripts

After installation, you can run:

### Development
```bash
# Start development server with hot reload
npm run dev
```

### Building
```bash
# Build for production
npm run build

# Start production server (after build)
npm start
```

### Database
```bash
# Open Prisma Studio (visual database editor)
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Seed database with sample data
npm run db:seed
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🐛 Common Issues

### Issue 1: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Issue 2: "Cannot find module 'next'"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: "Database connection error"

**Solution:**
- Check `DATABASE_URL` in `.env.local`
- Ensure database is accessible
- Verify connection string format
- See: [Troubleshooting](Troubleshooting#database-errors)

### Issue 4: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

---

## 📝 Next Steps

Now that you have the project running:

1. ✅ **Explore the Application**
   - Try signing in with admin account
   - Browse students and reports
   - Test creating new records

2. ✅ **Read Documentation**
   - [User Guide](User-Guide) - Learn all features
   - [Admin Guide](Admin-Guide) - Admin-specific features
   - [Developer Guide](Developer-Guide) - Code structure

3. ✅ **Configure for Development**
   - Set up your IDE
   - Install recommended extensions
   - Configure debugging

4. ✅ **Prepare for Deployment**
   - [Deployment Guide](Deployment-Guide)
   - [Environment Setup](Environment-Setup)

---

## 🎓 Learning Resources

### New to Next.js?
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)

### New to React?
- [React Documentation](https://react.dev)
- [React Tutorial](https://react.dev/learn)

### New to TypeScript?
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### New to Prisma?
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)

---

## ✅ Checklist

Before moving forward, make sure:

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Database seeded (`npm run db:seed`)
- [ ] Development server running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can log in with admin account
- [ ] Dashboard displays correctly

---

## 🆘 Need Help?

If you're stuck:

1. **Check [Troubleshooting](Troubleshooting)** - Common solutions
2. **Check [FAQ](FAQ)** - Frequently asked questions
3. **Search [GitHub Issues](https://github.com/Dy-Rongrath/student-report/issues)** - Others may have same issue
4. **Create New Issue** - If problem persists

---

## 🎉 Success!

If you see the application running at http://localhost:3000 and can log in, you're all set!

**Next:** Learn how to use the application in the [User Guide](User-Guide)

---

*Having trouble? See [Troubleshooting](Troubleshooting) or [report an issue](https://github.com/Dy-Rongrath/student-report/issues)*
