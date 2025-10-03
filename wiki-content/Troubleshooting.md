# Troubleshooting

Common issues and solutions for the Student Report System.

---

## 📖 Table of Contents

1. [Installation Issues](#installation-issues)
2. [Database Issues](#database-issues)
3. [Authentication Issues](#authentication-issues)
4. [Build & Deployment Issues](#build--deployment-issues)
5. [Runtime Errors](#runtime-errors)
6. [Performance Issues](#performance-issues)

---

## 🔧 Installation Issues

### Issue: "Cannot find module 'next'"

**Symptoms:**
```bash
Error: Cannot find module 'next'
```

**Solutions:**
```bash
# Solution 1: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Solution 2: Clear npm cache
npm cache clean --force
npm install

# Solution 3: Use correct Node version
node --version  # Should be 18+
nvm use 18     # If using nvm
```

### Issue: "Port 3000 already in use"

**Symptoms:**
```bash
Error: Port 3000 is already in use
```

**Solutions:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Issue: TypeScript errors during installation

**Symptoms:**
```bash
Type error: Cannot find type definition file
```

**Solutions:**
```bash
# Install type definitions
npm install --save-dev @types/node @types/react @types/react-dom

# Or regenerate tsconfig
rm tsconfig.json
npx tsc --init
```

---

## 🗄️ Database Issues

### Issue: "Cannot connect to database"

**Symptoms:**
```bash
Error: Can't reach database server
PrismaClientInitializationError
```

**Solutions:**

**1. Check DATABASE_URL:**
```bash
# Verify .env.local exists and has correct URL
cat .env.local | grep DATABASE_URL

# Format should be:
DATABASE_URL="postgresql://user:pass@host:port/db"
```

**2. Test database connection:**
```bash
# Try connecting with psql
psql "$DATABASE_URL"

# Or use Prisma Studio
npx prisma studio
```

**3. Check firewall/network:**
```bash
# Ping database host
ping your-db-host.com

# Check if port is open
telnet your-db-host.com 5432
```

**4. Verify Vercel Postgres:**
- Go to Vercel Dashboard
- Check database is running
- Copy fresh connection string
- Update `.env.local`

### Issue: "Prisma Client not generated"

**Symptoms:**
```bash
Error: @prisma/client did not initialize yet
```

**Solutions:**
```bash
# Generate Prisma Client
npx prisma generate

# If still failing, reinstall
npm uninstall @prisma/client
npm install @prisma/client
npx prisma generate
```

### Issue: "Migration failed"

**Symptoms:**
```bash
Error: Migration failed to apply
```

**Solutions:**
```bash
# Check migration status
npx prisma migrate status

# Reset database (DEVELOPMENT ONLY!)
npx prisma migrate reset

# Or manually apply migrations
npx prisma migrate deploy

# If schema drift detected
npx prisma db push --accept-data-loss
```

### Issue: Database seeding fails

**Symptoms:**
```bash
Error during database seed
```

**Solutions:**
```bash
# Check seed script
cat prisma/seed.ts

# Run with verbose logging
npx prisma db seed --preview-feature

# Or run manually
npx ts-node prisma/seed.ts
```

---

## 🔐 Authentication Issues

### Issue: Redirect loop on login

**Symptoms:**
- Browser shows "Too many redirects"
- Cannot access protected pages
- Stuck in signin loop

**Solutions:**

**1. Check middleware configuration:**
```typescript
// src/middleware.ts
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  // Ensure this logic is correct
  if (!token && protectedRoute) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
}
```

**2. Verify environment variables:**
```bash
# Check all auth variables are set
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL
echo $AUTH_TRUST_HOST

# Should be:
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"  # or production URL
AUTH_TRUST_HOST="true"
```

**3. Clear cookies:**
```javascript
// In browser console
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
// Reload page
```

**4. Check NextAuth configuration:**
```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Ensure credentials provider is configured
    })
  ],
  pages: {
    signIn: '/auth/signin',  // Correct path
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',  // Important!
  },
  // Add this
  trustHost: true,
}
```

### Issue: "Invalid credentials" on correct password

**Symptoms:**
- Login fails with correct email/password
- "Invalid credentials" error

**Solutions:**

**1. Check password hashing:**
```typescript
// Ensure bcrypt is comparing correctly
import bcrypt from 'bcryptjs'

const isValid = await bcrypt.compare(password, user.password)
```

**2. Verify user exists:**
```bash
# Use Prisma Studio
npx prisma studio

# Check User table for your email
```

**3. Re-hash password:**
```typescript
// In Prisma Studio or seed script
const hashedPassword = await bcrypt.hash('admin123', 10)
// Update user with new hash
```

### Issue: Session expires too quickly

**Symptoms:**
- Logged out after few minutes
- Session doesn't persist

**Solutions:**
```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}
```

---

## 🚀 Build & Deployment Issues

### Issue: Build fails on Vercel

**Symptoms:**
```bash
Error: Build failed
npm ERR! code ELIFECYCLE
```

**Solutions:**

**1. Check build locally:**
```bash
npm run build

# If successful, check for warnings
```

**2. Verify environment variables on Vercel:**
- Go to Vercel Dashboard
- Project → Settings → Environment Variables
- Ensure all variables are set:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `AUTH_TRUST_HOST`

**3. Check Prisma generation:**
```json
// package.json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

**4. Clear Vercel cache:**
- Go to Vercel Dashboard
- Deployments → (three dots) → Redeploy
- Check "Clear cache and redeploy"

### Issue: "Module not found" in production

**Symptoms:**
```bash
Module not found: Can't resolve '@/components/...'
```

**Solutions:**

**1. Check tsconfig paths:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**2. Check imports:**
```typescript
// Use @/ prefix for src files
import { Button } from '@/components/ui/Button'

// Not relative paths in src
// ❌ import { Button } from '../components/ui/Button'
```

### Issue: API routes return 404 in production

**Symptoms:**
- API works locally
- 404 in production

**Solutions:**

**1. Check file structure:**
```
src/app/api/students/route.ts  ✅
src/app/api/students.ts        ❌
```

**2. Verify exports:**
```typescript
// Must export GET, POST, etc. directly
export async function GET(request: Request) { }
export async function POST(request: Request) { }
```

**3. Check Vercel logs:**
```bash
# In Vercel Dashboard
Deployments → Click deployment → Runtime Logs
```

---

## 💥 Runtime Errors

### Issue: "Hydration mismatch" error

**Symptoms:**
```bash
Warning: Text content did not match. Server: "X" Client: "Y"
```

**Solutions:**

**1. Check for client-only code in server components:**
```typescript
// ❌ Bad - using localStorage in server component
export default function Page() {
  const value = localStorage.getItem('key')  // Error!
}

// ✅ Good - use client component
'use client'
export default function Page() {
  const value = localStorage.getItem('key')  // OK
}
```

**2. Avoid random values without seeds:**
```typescript
// ❌ Bad
<div id={Math.random()}>

// ✅ Good
<div id={useId()}>  // React's useId hook
```

### Issue: "Headers already sent" error

**Symptoms:**
```bash
Error: Cannot set headers after they are sent
```

**Solutions:**
```typescript
// ❌ Bad - multiple returns
export async function GET(request: Request) {
  const data = await getData()
  return NextResponse.json(data)
  return NextResponse.json({ error: 'Error' })  // Never reached!
}

// ✅ Good - single return path
export async function GET(request: Request) {
  try {
    const data = await getData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
```

### Issue: Infinite loop in useEffect

**Symptoms:**
- Browser freezes
- Memory usage spikes
- "Maximum update depth exceeded"

**Solutions:**
```typescript
// ❌ Bad - missing dependency array
useEffect(() => {
  fetchData()
})  // Runs on every render!

// ❌ Bad - object in dependency
useEffect(() => {
  fetchData()
}, [{ key: 'value' }])  // New object every render!

// ✅ Good - proper dependencies
useEffect(() => {
  fetchData()
}, [])  // Only once

// ✅ Good - primitive dependencies
useEffect(() => {
  fetchData(id)
}, [id])  // Only when id changes
```

---

## ⚡ Performance Issues

### Issue: Slow page load times

**Solutions:**

**1. Use Server Components:**
```typescript
// Default in App Router - no 'use client'
export default async function Page() {
  const data = await fetchData()  // Server-side
  return <div>{data}</div>
}
```

**2. Implement loading states:**
```typescript
// app/students/loading.tsx
export default function Loading() {
  return <div>Loading students...</div>
}
```

**3. Use dynamic imports:**
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})
```

### Issue: Large bundle size

**Solutions:**
```bash
# Analyze bundle
npm run build
# Check .next/analyze output

# Remove unused dependencies
npm uninstall <unused-package>

# Use dynamic imports for heavy libraries
```

---

## 🆘 Getting More Help

### Check Logs

**Development:**
```bash
# Terminal logs
npm run dev

# Browser console
F12 → Console tab
```

**Production (Vercel):**
```
Dashboard → Deployments → Runtime Logs
```

### Enable Debug Mode

```bash
# .env.local
NODE_ENV=development
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

### Common Commands

```bash
# Clear everything and restart
rm -rf node_modules .next package-lock.json
npm install
npx prisma generate
npm run dev

# Database reset (DEVELOPMENT ONLY!)
npx prisma migrate reset
npm run db:seed

# Check for issues
npm run lint
npx tsc --noEmit
```

---

## 📚 Additional Resources

- [Getting Started](Getting-Started)
- [Developer Guide](Developer-Guide)
- [FAQ](FAQ)
- [GitHub Issues](https://github.com/Dy-Rongrath/student-report/issues)

---

*Still stuck? [Create an issue on GitHub](https://github.com/Dy-Rongrath/student-report/issues/new)*
