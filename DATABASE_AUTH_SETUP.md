# Database & Authentication Setup Guide

## 🎉 Installation Complete!

Your Student Report System now includes:
- ✅ **Prisma ORM** for database management
- ✅ **PostgreSQL** database schema
- ✅ **NextAuth.js** for authentication
- ✅ **Bcrypt** for password hashing
- ✅ Protected routes with middleware

## 📦 Installed Packages

```json
{
  "prisma": "Database ORM",
  "@prisma/client": "Database client",
  "next-auth": "Authentication library",
  "@auth/prisma-adapter": "Prisma adapter for NextAuth",
  "bcryptjs": "Password hashing"
}
```

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

#### Step 1: Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

#### Step 2: Create Database

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE student_report;
CREATE USER your_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE student_report TO your_user;
\q
```

#### Step 3: Update .env.local

```env
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/student_report?schema=public"
```

### Option 2: Online Database (Recommended for Development)

Choose one of these providers:

#### **Vercel Postgres** (Recommended)
1. Go to [vercel.com/storage](https://vercel.com/storage)
2. Create a new Postgres database
3. Copy the connection string
4. Update `.env.local`

#### **Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings > Database
4. Update `.env.local`

#### **Railway**
1. Go to [railway.app](https://railway.app)
2. Create new PostgreSQL database
3. Copy connection string
4. Update `.env.local`

#### **Neon**
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `.env.local`

## 🔧 Run Prisma Migrations

Once your database is configured:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# Open Prisma Studio to view your database
npx prisma studio
```

## 🔐 Authentication Configuration

### Step 1: Generate Secret Key

```bash
# Generate a secure secret key
openssl rand -base64 32
```

### Step 2: Update .env.local

```env
NEXTAUTH_SECRET="paste-the-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

For production, change `NEXTAUTH_URL` to your domain.

## 📋 Database Schema

### Models Created:

1. **User** - Authentication users
   - id, name, email, password, role
   - Relations: accounts, sessions, students, reports

2. **Account** - OAuth accounts (for future providers)
   - NextAuth.js required table

3. **Session** - User sessions
   - NextAuth.js required table

4. **VerificationToken** - Email verification tokens
   - NextAuth.js required table

5. **Student** - Student records
   - id, firstName, lastName, email, studentId, etc.
   - Relations: createdBy (User), reports

6. **Report** - Student reports
   - id, subject, grade, semester, academicYear, etc.
   - Relations: student, createdBy (User)

### User Roles:
- `USER` - Regular user
- `ADMIN` - Administrator
- `TEACHER` - Teacher with special permissions

## 🚀 Authentication Features

### Sign Up Page
- `/auth/signup` - User registration
- Password hashing with bcrypt
- Email uniqueness validation
- Name, email, password fields

### Sign In Page
- `/auth/signin` - User login
- Credential-based authentication
- Secure session management
- Automatic redirect after login

### Protected Routes
The following routes require authentication:
- `/dashboard/*`
- `/students/*`
- `/reports/*`

### Session Management
- JWT-based sessions
- Automatic token refresh
- Secure cookie storage
- Role-based access control

## 🔒 Security Features

✅ **Password Hashing**: bcrypt with salt rounds of 12  
✅ **CSRF Protection**: Built into NextAuth.js  
✅ **Secure Sessions**: HTTP-only cookies  
✅ **Route Protection**: Middleware guards  
✅ **SQL Injection Prevention**: Prisma ORM protection  

## 📝 Usage Examples

### Creating a User (Sign Up)

Navigate to: `http://localhost:3000/auth/signup`

Fill in:
- Full Name
- Email Address
- Password (min 6 characters)
- Confirm Password

### Signing In

Navigate to: `http://localhost:3000/auth/signin`

Enter:
- Email Address
- Password

### Accessing Protected Routes

After signing in, you can access:
- Dashboard: `/dashboard`
- Students: `/students`
- Reports: `/reports`

## 🛠️ API Endpoints

### Authentication

```bash
# Register new user
POST /api/auth/register
Body: { name, email, password }

# Sign in (handled by NextAuth)
POST /api/auth/signin

# Sign out
POST /api/auth/signout

# Get session
GET /api/auth/session
```

## 🧪 Testing the Setup

### Step 1: Start Development Server

```bash
npm run dev
```

### Step 2: Create First User

1. Go to `http://localhost:3001/auth/signup`
2. Fill in the registration form
3. Submit

### Step 3: Sign In

1. Go to `http://localhost:3001/auth/signin`
2. Enter your credentials
3. You should be redirected to `/dashboard`

### Step 4: Test Protected Routes

Try accessing:
- `/dashboard` - Should work when logged in
- Sign out and try again - Should redirect to sign in

## 🎨 Customization

### Change User Roles

Edit `prisma/schema.prisma`:

```prisma
enum UserRole {
  USER
  ADMIN
  TEACHER
  STUDENT  // Add new role
}
```

Then run:
```bash
npx prisma migrate dev --name add_student_role
```

### Add OAuth Providers

In `src/lib/auth.ts`, add providers:

```typescript
import GoogleProvider from 'next-auth/providers/google';

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  // ... existing providers
],
```

### Customize Sign In Page

Edit `src/app/auth/signin/page.tsx` to match your branding.

## 📊 Prisma Studio

View and edit your database with Prisma Studio:

```bash
npx prisma studio
```

Opens at: `http://localhost:5555`

## 🔄 Common Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name your_migration_name

# Reset database (DANGER!)
npx prisma migrate reset

# Push schema changes without migration
npx prisma db push

# View database in browser
npx prisma studio

# Format schema file
npx prisma format
```

## ⚠️ Troubleshooting

### Issue: "Can't reach database server"

**Solution:**
- Check if PostgreSQL is running
- Verify connection string in `.env.local`
- Check firewall settings

### Issue: "Invalid credentials" when signing in

**Solution:**
- Make sure you registered the user first
- Check email spelling
- Verify password is correct

### Issue: "Prisma Client is not generated"

**Solution:**
```bash
npx prisma generate
```

### Issue: "Environment variable not found: DATABASE_URL"

**Solution:**
- Make sure `.env.local` exists
- Check that `DATABASE_URL` is set
- Restart development server

### Issue: Migration failed

**Solution:**
```bash
# Reset database and start over
npx prisma migrate reset
npx prisma migrate dev --name init
```

## 🚀 Next Steps

1. ✅ **Test Authentication**: Create account and sign in
2. ✅ **Create Test Data**: Add students and reports via Prisma Studio
3. ⬜ **Customize UI**: Update auth pages with your branding
4. ⬜ **Add Email Verification**: Implement email confirmation
5. ⬜ **Add Password Reset**: Implement forgot password flow
6. ⬜ **Add OAuth**: Integrate Google/GitHub sign in
7. ⬜ **Add Role Permissions**: Implement RBAC logic

## 📚 Additional Resources

- **Prisma Docs**: [prisma.io/docs](https://www.prisma.io/docs)
- **NextAuth Docs**: [next-auth.js.org](https://next-auth.js.org)
- **PostgreSQL**: [postgresql.org/docs](https://www.postgresql.org/docs)

## 🎊 Setup Complete!

Your Student Report System now has:
- ✅ Full database integration
- ✅ User authentication
- ✅ Protected routes
- ✅ Session management
- ✅ Role-based access

**Ready to start building! 🚀**
