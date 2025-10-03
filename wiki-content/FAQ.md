# FAQ (Frequently Asked Questions)

Answers to common questions about the Student Report System.

---

## 📖 Table of Contents

1. [General Questions](#general-questions)
2. [Installation & Setup](#installation--setup)
3. [Usage Questions](#usage-questions)
4. [Technical Questions](#technical-questions)
5. [Deployment Questions](#deployment-questions)
6. [Contributing](#contributing)

---

## 🌐 General Questions

### What is the Student Report System?

The Student Report System is a web application built with Next.js that allows schools to manage student information and generate academic reports. It features authentication, student management, and report generation capabilities.

### Who is this system for?

- **Schools & Educational Institutions** - Manage students and reports
- **Teachers** - Create and view academic reports
- **Administrators** - Full system management
- **Developers** - Learn Next.js, Prisma, NextAuth

### Is this system free to use?

Yes! This is an open-source project available under the MIT license. You can use, modify, and distribute it freely.

### What features does it include?

- ✅ User authentication (NextAuth.js)
- ✅ Student management (CRUD operations)
- ✅ Report generation and management
- ✅ Responsive design (mobile-friendly)
- ✅ RESTful API
- ✅ PostgreSQL database with Prisma ORM
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling

### Can I use this for my school?

Absolutely! This system is designed for educational institutions. You can customize it to fit your school's needs.

---

## 🛠️ Installation & Setup

### What do I need to install before starting?

You need:
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** 2.0.0 or higher
- **PostgreSQL database** (or Vercel Postgres)

See [Getting Started](Getting-Started) for detailed instructions.

### Do I need to know coding to use this?

For **using** the deployed application: No coding knowledge required.

For **installing/customizing**: Basic knowledge of:
- JavaScript/TypeScript
- Command line
- Git

### How long does installation take?

Approximately **15-30 minutes** for:
- Cloning repository (2 min)
- Installing dependencies (5 min)
- Database setup (5 min)
- Configuration (5 min)
- Testing (5 min)

### What database can I use?

**Recommended:**
- Vercel Postgres (easiest, cloud-hosted)
- PostgreSQL (self-hosted)

**Not supported:**
- MySQL
- MongoDB
- SQLite

### Can I use this without a database?

No, the application requires PostgreSQL. However, you can use:
- **Vercel Postgres** - Free tier available
- **Railway** - Free tier with PostgreSQL
- **Supabase** - Free PostgreSQL hosting
- **Local PostgreSQL** - Free, self-hosted

---

## 👥 Usage Questions

### How do I create the first admin account?

Run the database seed script:
```bash
npm run db:seed
```

This creates:
- **Email:** admin@example.com
- **Password:** admin123

⚠️ **Change the password immediately after first login!**

### How do I add new students?

1. Log in as admin
2. Go to Students page
3. Click "Add New Student"
4. Fill in the form
5. Click "Save"

See [Admin Guide](Admin-Guide) for details.

### How do I generate reports?

1. Log in as admin/teacher
2. Go to Reports page
3. Click "Generate New Report"
4. Select student
5. Fill in report details
6. Click "Generate"

### Can students log in and view their reports?

In the current version, only admins and teachers can log in. Student access can be added as a custom feature.

### How do I export data?

**Students:**
- Go to Students page
- Click "Export"
- Choose format (CSV, Excel, PDF)

**Reports:**
- Go to Reports page
- Click on a report
- Click "Download PDF"

### Can I import existing student data?

Yes! Use bulk import:
1. Go to Students page
2. Click "Import Students"
3. Download CSV template
4. Fill in student data
5. Upload file

See [Admin Guide](Admin-Guide#bulk-operations) for details.

---

## 🔧 Technical Questions

### What technologies are used?

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.5.4 | React framework |
| React | 19.0.0 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Prisma | 6.16.3 | Database ORM |
| NextAuth.js | 4.24.11 | Authentication |
| PostgreSQL | Latest | Database |
| Tailwind CSS | 4.0.1 | Styling |

### Why Next.js instead of React?

Next.js provides:
- Server-side rendering
- API routes (no separate backend needed)
- File-based routing
- Better SEO
- Built-in optimization

### Can I use a different database?

The current version uses PostgreSQL via Prisma. Switching databases requires:
1. Update Prisma schema
2. Change database provider
3. Test migrations
4. Update connection string

### Can I add more features?

Yes! The codebase is modular and easy to extend. Common additions:
- Email notifications
- PDF report templates
- Attendance tracking
- Grade calculations
- Parent portal
- Mobile app

See [Developer Guide](Developer-Guide) for technical details.

### Is the code well-documented?

Yes! We provide:
- Inline code comments
- TypeScript types
- API documentation
- User guides
- Developer guides
- Architecture documentation

### Can I use this commercially?

Yes! This project is under the MIT license, which allows:
- Commercial use
- Modification
- Distribution
- Private use

### How do I update to the latest version?

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build
```

---

## 🚀 Deployment Questions

### Where can I deploy this?

**Recommended:**
- **Vercel** (easiest, optimized for Next.js)
- Netlify
- Railway
- AWS
- DigitalOcean
- Heroku (discontinued)

### Is deployment free?

**Vercel:**
- Free tier: Yes, sufficient for small schools
- Paid: For larger scale ($20/month+)

**Database:**
- Vercel Postgres free tier: 60 hours compute time
- Self-hosted: Free (you pay for hosting)

### How long does deployment take?

**Vercel Deployment:**
- First time: 10-15 minutes
- Subsequent: 2-5 minutes (automatic)

### Do I need a domain name?

No, Vercel provides:
- Free subdomain: `your-app.vercel.app`
- Custom domain: Optional (you purchase separately)

### How do I set up environment variables?

**Vercel:**
1. Go to Project Settings
2. Environment Variables tab
3. Add:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `AUTH_TRUST_HOST`

See [Deployment Guide](Deployment-Guide) for details.

### Can I deploy to my own server?

Yes! You need:
- Node.js 18+ installed
- PostgreSQL database
- Reverse proxy (nginx)
- Process manager (PM2)

```bash
npm run build
npm start
```

### How do I enable HTTPS?

**Vercel:** Automatic HTTPS (free)

**Self-hosted:**
- Use nginx with Let's Encrypt
- Or Cloudflare proxy

---

## 🤝 Contributing

### Can I contribute to this project?

Yes! Contributions are welcome:
- Bug reports
- Feature requests
- Code contributions
- Documentation improvements

### How do I report a bug?

1. Check existing [GitHub Issues](https://github.com/Dy-Rongrath/student-report/issues)
2. Create new issue if not found
3. Include:
   - Description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)

### How do I suggest a feature?

1. Go to [GitHub Issues](https://github.com/Dy-Rongrath/student-report/issues)
2. Click "New Issue"
3. Select "Feature Request"
4. Describe the feature and use case

### How do I contribute code?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests (if applicable)
5. Submit a pull request

See [Developer Guide](Developer-Guide) for coding standards.

### What's the development roadmap?

**Planned Features:**
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Attendance tracking
- [ ] Grade calculations
- [ ] Parent portal
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Dark mode

### How do I get help?

**Quick Help:**
1. Check [Troubleshooting](Troubleshooting)
2. Read this FAQ
3. Search [GitHub Issues](https://github.com/Dy-Rongrath/student-report/issues)

**Need More Help:**
1. Create GitHub Issue
2. Join community discussions
3. Contact: admin@example.com

---

## 🔒 Security Questions

### Is the system secure?

Yes, we implement:
- Password hashing (bcrypt)
- JWT session tokens
- CSRF protection (NextAuth)
- SQL injection prevention (Prisma)
- XSS protection (React)
- HTTPS in production

### How are passwords stored?

Passwords are hashed using **bcrypt** with 10 salt rounds before storing in the database. Plain-text passwords are never stored.

### Should I change the default admin password?

**YES!** Change it immediately after first login:
1. Log in with admin@example.com / admin123
2. Go to Profile → Change Password
3. Use strong password (12+ characters)

### Can I enable two-factor authentication?

Currently not built-in, but can be added using:
- NextAuth with 2FA provider
- Custom 2FA implementation
- Third-party services

### How do I secure my database?

1. Use strong database password
2. Restrict database access by IP
3. Enable SSL/TLS for connections
4. Regular backups
5. Keep Prisma updated

---

## 💰 Cost Questions

### Is there a monthly cost?

**Development:** Free
- Run locally on your computer

**Production:**

**Free Tier (Vercel):**
- Hosting: Free
- Database: 60 hours/month compute time
- Bandwidth: 100GB/month

**Paid (if you exceed free tier):**
- Vercel Pro: $20/month
- Database: $10-50/month (depending on usage)

**Custom Domain:**
- $10-15/year (optional)

### Can I run this completely free?

Yes! Options:
1. **Local only** - Run on your computer (free)
2. **Vercel free tier** - For small schools (<1000 students)
3. **Self-host** - Use your own server (you pay for hosting)

### What happens if I exceed Vercel free tier?

You'll get email notification. Options:
1. Upgrade to Pro plan ($20/month)
2. Optimize to reduce usage
3. Switch to self-hosting

---

## 📱 Mobile Questions

### Does it work on mobile?

Yes! The interface is fully responsive and works on:
- Smartphones (iOS, Android)
- Tablets
- Desktop browsers

### Is there a mobile app?

Not currently. The web app works well on mobile browsers. A native app could be added in the future.

---

## 🎓 Learning Questions

### Can I use this to learn Next.js?

Absolutely! This project demonstrates:
- Next.js App Router
- Server/Client Components
- API Routes
- Authentication
- Database integration
- TypeScript
- Tailwind CSS

### Where can I learn more?

**Official Documentation:**
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)

**This Project:**
- [Developer Guide](Developer-Guide)
- [Architecture](Architecture)
- [API Documentation](API-Documentation)

---

## ❓ Still Have Questions?

### Quick Links

- **[Getting Started](Getting-Started)** - Installation guide
- **[User Guide](User-Guide)** - How to use the system
- **[Admin Guide](Admin-Guide)** - Administrator features
- **[Developer Guide](Developer-Guide)** - Technical details
- **[Troubleshooting](Troubleshooting)** - Common issues

### Contact

- **GitHub Issues:** [Report an issue](https://github.com/Dy-Rongrath/student-report/issues)
- **Email:** admin@example.com
- **Demo:** https://student-report-ruby.vercel.app

---

*Don't see your question? [Create an issue](https://github.com/Dy-Rongrath/student-report/issues/new) and we'll add it!*
