# 🔐 Admin Account & Test Credentials

## Admin Account (Default)

**Email:** `admin@example.com`  
**Password:** `admin123`  
**Role:** ADMIN

---

## 🌱 Sample Data Created

### Students (3 total)
1. **John Doe**
   - Student ID: STU001
   - Email: john.doe@school.com
   - Class: Grade 10A
   - Date of Birth: May 15, 2008

2. **Jane Smith**
   - Student ID: STU002
   - Email: jane.smith@school.com
   - Class: Grade 11B
   - Date of Birth: August 22, 2007

3. **Bob Johnson**
   - Student ID: STU003
   - Email: bob.johnson@school.com
   - Class: Grade 9A
   - Date of Birth: March 10, 2009

### Reports (3 total)
1. **John Doe - Mathematics**
   - Grade: A
   - Teacher: Mr. Johnson
   - Semester: Fall 2024-2025
   - Comments: Excellent performance in algebra and geometry

2. **John Doe - English**
   - Grade: B+
   - Teacher: Ms. Williams
   - Semester: Fall 2024-2025
   - Comments: Good writing skills, needs improvement in grammar

3. **Jane Smith - Science**
   - Grade: A-
   - Teacher: Dr. Smith
   - Semester: Fall 2024-2025
   - Comments: Excellent laboratory work

---

## 🚀 Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Sign In
Go to: http://localhost:3001/auth/signin

Enter:
- **Email:** admin@example.com
- **Password:** admin123

### 3. Explore the Dashboard
After signing in, you'll have access to:
- Dashboard with stats
- Students list (3 sample students)
- Reports list (3 sample reports)

---

## 🛠️ Database Commands

### View Database in Browser
```bash
npx prisma studio
```
Opens at: http://localhost:5555

### Re-seed Database (Add more data)
```bash
npm run db:seed
```

### Reset Database (⚠️ Deletes all data)
```bash
npx prisma db push --force-reset
npm run db:seed
```

---

## 🔑 Change Admin Password

To change the admin password, you can:

### Option 1: Via Prisma Studio
1. Run: `npx prisma studio`
2. Open Users table
3. Click on admin@example.com
4. Edit the password field (needs to be bcrypt hashed)

### Option 2: Via Sign Up Page
Create a new admin account:
1. Go to: http://localhost:3001/auth/signup
2. Create a new account with ADMIN role
3. Sign in with the new account

### Option 3: Run a Script
Create a file `change-password.ts` in prisma folder:
```typescript
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash('your-new-password', 12);
  
  await prisma.user.update({
    where: { email: 'admin@example.com' },
    data: { password: hashedPassword },
  });
  
  console.log('Password updated!');
}

main().finally(() => prisma.$disconnect());
```

Then run: `tsx prisma/change-password.ts`

---

## 📊 User Roles

The system supports three roles:

### ADMIN
- Full access to everything
- Can manage users, students, and reports
- Can view all data

### TEACHER
- Can manage students and reports
- Can create and edit reports
- Limited administrative access

### USER
- Read-only access
- Can view students and reports
- Cannot create or edit data

---

## 🔒 Security Notes

⚠️ **Important for Production:**

1. **Change the default admin password immediately**
2. **Update NEXTAUTH_SECRET in .env.local:**
   ```bash
   # Generate a secure secret:
   openssl rand -base64 32
   ```
3. **Never commit credentials to Git**
4. **Use strong passwords for all accounts**
5. **Enable two-factor authentication in production**

---

## 🆘 Troubleshooting

### Can't sign in?
- Make sure you ran `npm run db:seed`
- Check that the email is: `admin@example.com`
- Check that the password is: `admin123`
- Try clearing browser cookies

### Seed script fails?
- Run: `npx prisma generate`
- Make sure DATABASE_URL is set in .env
- Check database connection

### Admin already exists error?
The seed script checks if admin exists and skips creation if found. This is normal if you've already run the seed.

---

**Last Updated:** October 3, 2025  
**Status:** ✅ Admin account and sample data ready!
