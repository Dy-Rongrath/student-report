# 🚀 Vercel Deployment & CI/CD Guide

## 📋 Prerequisites

Before deploying, make sure you have:
- ✅ GitHub repository (you have this!)
- ✅ Vercel Postgres database (you have this!)
- ✅ Working local application (you have this!)

---

## 🌐 Part 1: Deploy to Vercel (5 minutes)

### Step 1: Sign Up / Log In to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Repository

1. Click **"Add New..."** → **"Project"**
2. Find your repository: **`Dy-Rongrath/student-report`**
3. Click **"Import"**

### Step 3: Configure Your Project

Vercel will auto-detect Next.js settings:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

✅ **Don't change these** - they're correct!

### Step 4: Add Environment Variables

**CRITICAL:** Click **"Environment Variables"** and add:

#### Required Variables:

1. **DATABASE_URL**
   ```
   postgres://bce591a8339f02efde41f33c6af2bf06719fd1612e679f94af840de94cf35f6e:sk_s18HEzVSdGkQUOeD7Lohs@db.prisma.io:5432/postgres?sslmode=require
   ```
   - Environment: Production, Preview, Development (check all)

2. **NEXTAUTH_SECRET** (⚠️ Generate a NEW one for production!)
   ```bash
   # Run this command locally to generate:
   openssl rand -base64 32
   ```
   - Copy the output
   - Paste as value
   - Environment: Production, Preview, Development

3. **NEXTAUTH_URL**
   ```
   https://your-project-name.vercel.app
   ```
   - ⚠️ You'll update this AFTER deployment
   - For now, just add a placeholder
   - Environment: Production only

4. **NEXT_PUBLIC_APP_URL**
   ```
   https://your-project-name.vercel.app
   ```
   - Same as NEXTAUTH_URL
   - Environment: Production

5. **NEXT_PUBLIC_API_URL**
   ```
   https://your-project-name.vercel.app
   ```
   - Same as above
   - Environment: Production

### Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes while Vercel builds your app
3. ✅ You'll see "Congratulations" when done!

### Step 6: Update NEXTAUTH_URL

1. Copy your deployment URL (e.g., `student-report-abc123.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Edit **NEXTAUTH_URL** and **NEXT_PUBLIC_APP_URL**
4. Replace with your actual URL: `https://student-report-abc123.vercel.app`
5. Click **Save**
6. **Redeploy**: Go to Deployments → Click ⋯ → Redeploy

---

## 🔄 Part 2: CI/CD Setup (Automatic Deployments)

### ✅ Already Enabled by Default!

Vercel automatically sets up CI/CD when you connect GitHub. Here's what happens:

### Automatic Deployments:

1. **Push to `main` branch** → Deploys to Production
2. **Push to other branches** → Creates Preview deployment
3. **Pull Request** → Automatic preview with unique URL
4. **Merge PR** → Deploys to Production

### How It Works:

```
┌─────────────┐
│ Push Code   │
│ to GitHub   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Vercel      │
│ Detects     │
│ Changes     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Auto Build  │
│ & Test      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Deploy to   │
│ Production  │
└─────────────┘
```

---

## 🎯 Part 3: Advanced CI/CD with GitHub Actions

Want more control? Add GitHub Actions:

### Create Workflow File:

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Type check
        run: npx tsc --noEmit
      
      - name: Build project
        run: npm run build

  deploy:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to Vercel
        run: echo "Vercel handles deployment automatically"
```

### Add This File:

```bash
# Create the directory
mkdir -p .github/workflows

# Create the file (use the content above)
# Then commit and push
git add .github/workflows/ci.yml
git commit -m "Add CI/CD pipeline"
git push
```

---

## 🔧 Part 4: Environment Variables Management

### For Different Environments:

| Environment | When Used | Example URL |
|------------|-----------|-------------|
| **Production** | `main` branch | `yourapp.vercel.app` |
| **Preview** | PR/branches | `yourapp-git-feature.vercel.app` |
| **Development** | Local | `localhost:3000` |

### Best Practices:

1. **Production Variables:**
   - Use strong secrets
   - Enable only for Production
   
2. **Preview Variables:**
   - Use test database (optional)
   - Can share Production variables
   
3. **Development Variables:**
   - Keep in `.env.local`
   - Never commit to Git

---

## 📊 Part 5: Database Migrations on Deploy

Your Vercel Postgres is already set up! But for migrations:

### Option 1: Automatic Migrations (Recommended)

Update `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma db push && next build --turbopack"
  }
}
```

### Option 2: Separate Migration Step

Add `vercel.json`:

```json
{
  "buildCommand": "prisma generate && prisma db push && npm run build",
  "installCommand": "npm install"
}
```

---

## 🎨 Part 6: Custom Domain (Optional)

### Add Your Own Domain:

1. Go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `myapp.com`)
4. Follow DNS instructions:
   - Add A record: `76.76.21.21`
   - Or CNAME: `cname.vercel-dns.com`
5. Wait for DNS propagation (up to 24 hours)
6. Update environment variables with new domain

---

## 📈 Part 7: Monitor Your Deployments

### Vercel Dashboard:

1. **Deployments**: View all deployments
2. **Analytics**: Traffic and performance
3. **Logs**: Runtime and build logs
4. **Speed Insights**: Core Web Vitals
5. **Alerts**: Get notified of issues

### Key Metrics to Watch:

- ✅ Build time
- ✅ Response time
- ✅ Error rate
- ✅ Page load speed
- ✅ API performance

---

## 🔒 Part 8: Security Checklist

Before going live:

- [ ] Generate NEW `NEXTAUTH_SECRET` for production
- [ ] Update all environment variables
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Add domain to CORS if needed
- [ ] Review database access rules
- [ ] Change default admin password
- [ ] Enable rate limiting
- [ ] Add security headers

---

## 🚨 Troubleshooting

### Build Fails?

1. **Check build logs** in Vercel dashboard
2. **Verify environment variables** are set
3. **Test build locally**:
   ```bash
   npm run build
   npm start
   ```

### Database Connection Issues?

1. Check `DATABASE_URL` is correct
2. Verify Vercel Postgres is active
3. Check IP whitelist (Vercel IPs)

### Authentication Not Working?

1. Verify `NEXTAUTH_URL` matches your domain
2. Check `NEXTAUTH_SECRET` is set
3. Clear browser cookies

---

## 📝 Complete Deployment Checklist

### Pre-Deployment:
- [x] Code pushed to GitHub
- [x] Database created (Vercel Postgres)
- [x] Local testing complete
- [x] Environment variables documented

### During Deployment:
- [ ] Sign up for Vercel
- [ ] Import GitHub repository
- [ ] Add all environment variables
- [ ] Deploy application
- [ ] Update NEXTAUTH_URL
- [ ] Redeploy with correct URL

### Post-Deployment:
- [ ] Test production site
- [ ] Sign in with admin account
- [ ] Verify database connection
- [ ] Check all pages load
- [ ] Test authentication flow
- [ ] Monitor for errors
- [ ] Set up custom domain (optional)

---

## 🎯 Quick Start Commands

```bash
# Generate production secret
openssl rand -base64 32

# Test build locally
npm run build
npm start

# Check for issues
npm run lint

# Push to deploy
git add .
git commit -m "Deploy to production"
git push
```

---

## 📚 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Vercel CLI**: https://vercel.com/docs/cli
- **GitHub Actions**: https://docs.github.com/actions
- **Next.js Deploy**: https://nextjs.org/docs/deployment

---

## 🎊 Success!

Once deployed, you'll have:
- ✅ Production URL (e.g., `yourapp.vercel.app`)
- ✅ Automatic deployments on push
- ✅ Preview deployments for PRs
- ✅ SSL certificate (HTTPS)
- ✅ Global CDN
- ✅ Analytics and monitoring
- ✅ Automatic scaling

**Your Student Report System is now live! 🚀**

---

**Need Help?**
- Vercel Support: https://vercel.com/support
- Discord: https://vercel.com/discord
- Documentation: https://vercel.com/docs

**Last Updated:** October 3, 2025
