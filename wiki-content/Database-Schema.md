# Database Schema

Complete database schema documentation for the Student Report System using Prisma ORM and PostgreSQL.

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Database Models](#database-models)
3. [Relationships](#relationships)
4. [Schema Definition](#schema-definition)
5. [Migrations](#migrations)
6. [Seeding](#seeding)

---

## 🗄️ Overview

### Database Technology

- **Database:** PostgreSQL (Vercel Postgres)
- **ORM:** Prisma 6.16.3
- **Connection:** Connection pooling via Prisma
- **Schema File:** `prisma/schema.prisma`

### Connection String Format

```
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

**Vercel Postgres Example:**
```
DATABASE_URL="postgres://default:xxx@xxx-pooler.xxx.vercel-storage.com:5432/verceldb"
```

---

## 📊 Database Models

### Overview of Tables

| Model | Description | Key Fields |
|-------|-------------|------------|
| **User** | System users (admins, teachers) | email, name, password |
| **Account** | OAuth accounts (NextAuth) | provider, providerAccountId |
| **Session** | User sessions (NextAuth) | sessionToken, expires |
| **VerificationToken** | Email verification tokens | token, expires |
| **Student** | Student profiles | firstName, lastName, email |
| **Report** | Academic reports | title, content, term, year |

---

## 📋 Model Details

### 1. User Model

Stores system users (administrators, teachers).

**Fields:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | String | Yes | cuid() | Unique identifier |
| `name` | String | No | - | Full name |
| `email` | String | Yes | - | Email (unique) |
| `emailVerified` | DateTime | No | - | Email verification timestamp |
| `image` | String | No | - | Profile image URL |
| `password` | String | No | - | Hashed password |
| `createdAt` | DateTime | Yes | now() | Creation timestamp |
| `updatedAt` | DateTime | Yes | auto | Last update timestamp |

**Relations:**
- One-to-many with `Account`
- One-to-many with `Session`

**Indexes:**
- Unique index on `email`

**Example:**
```typescript
{
  id: "clx123abc",
  name: "Admin User",
  email: "admin@example.com",
  emailVerified: null,
  image: null,
  password: "$2a$10$...", // bcrypt hash
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

### 2. Account Model

OAuth provider accounts (NextAuth.js integration).

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | Yes | Unique identifier |
| `userId` | String | Yes | Foreign key to User |
| `type` | String | Yes | Account type (oauth, email) |
| `provider` | String | Yes | Provider name (google, github) |
| `providerAccountId` | String | Yes | Provider's user ID |
| `refresh_token` | String | No | OAuth refresh token |
| `access_token` | String | No | OAuth access token |
| `expires_at` | Int | No | Token expiration timestamp |
| `token_type` | String | No | Token type (Bearer) |
| `scope` | String | No | OAuth scopes |
| `id_token` | String | No | OpenID Connect ID token |
| `session_state` | String | No | OAuth session state |

**Relations:**
- Many-to-one with `User`

**Indexes:**
- Unique index on `provider` + `providerAccountId`

### 3. Session Model

User session storage (NextAuth.js).

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | Yes | Unique identifier |
| `sessionToken` | String | Yes | Session token (unique) |
| `userId` | String | Yes | Foreign key to User |
| `expires` | DateTime | Yes | Session expiration |

**Relations:**
- Many-to-one with `User`

**Indexes:**
- Unique index on `sessionToken`

### 4. VerificationToken Model

Email verification and password reset tokens.

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `identifier` | String | Yes | Email or user identifier |
| `token` | String | Yes | Verification token (unique) |
| `expires` | DateTime | Yes | Token expiration |

**Indexes:**
- Unique index on `token`
- Unique index on `identifier` + `token`

### 5. Student Model

Student profiles and information.

**Fields:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | String | Yes | cuid() | Unique identifier |
| `firstName` | String | Yes | - | First name |
| `lastName` | String | Yes | - | Last name |
| `email` | String | Yes | - | Email (unique) |
| `gradeLevel` | Int | Yes | - | Grade level (1-12) |
| `status` | String | Yes | "ACTIVE" | Student status |
| `createdAt` | DateTime | Yes | now() | Creation timestamp |
| `updatedAt` | DateTime | Yes | auto | Last update timestamp |

**Status Values:**
- `ACTIVE` - Currently enrolled
- `INACTIVE` - Temporarily not attending
- `GRADUATED` - Completed program

**Relations:**
- One-to-many with `Report`

**Indexes:**
- Unique index on `email`
- Index on `status`

**Example:**
```typescript
{
  id: "clx123abc",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  gradeLevel: 10,
  status: "ACTIVE",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

### 6. Report Model

Academic reports for students.

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | Yes | Unique identifier |
| `title` | String | Yes | Report title |
| `content` | String | Yes | Report content (text) |
| `term` | String | Yes | Academic term (Fall/Spring/Summer) |
| `year` | Int | Yes | Academic year |
| `studentId` | String | Yes | Foreign key to Student |
| `createdAt` | DateTime | Yes | Creation timestamp |
| `updatedAt` | DateTime | Yes | Last update timestamp |

**Relations:**
- Many-to-one with `Student` (cascade delete)

**Indexes:**
- Index on `studentId`
- Index on `term` + `year`

**Example:**
```typescript
{
  id: "clx789ghi",
  title: "Fall 2024 Report",
  content: "John showed excellent progress in Mathematics...",
  term: "Fall",
  year: 2024,
  studentId: "clx123abc",
  createdAt: "2024-01-20T09:00:00Z",
  updatedAt: "2024-01-20T09:00:00Z"
}
```

---

## 🔗 Relationships

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│─────────────│
│ id (PK)     │
│ email       │
│ name        │
│ password    │
└──────┬──────┘
       │
       │ 1:N
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐ ┌─────────────┐
│   Account   │ │   Session   │
│─────────────│ │─────────────│
│ id (PK)     │ │ id (PK)     │
│ userId (FK) │ │ userId (FK) │
│ provider    │ │ sessionToken│
└─────────────┘ └─────────────┘


┌─────────────┐
│   Student   │
│─────────────│
│ id (PK)     │
│ firstName   │
│ lastName    │
│ email       │
│ gradeLevel  │
│ status      │
└──────┬──────┘
       │
       │ 1:N
       │
       ▼
┌─────────────┐
│   Report    │
│─────────────│
│ id (PK)     │
│ title       │
│ content     │
│ term        │
│ year        │
│ studentId(FK)│ ──┐
└─────────────┘    │
                   │ CASCADE DELETE
                   └────────────────┘
```

### Relationship Details

**User ↔ Account (1:N)**
- One user can have multiple OAuth accounts
- Deleting user cascades to accounts

**User ↔ Session (1:N)**
- One user can have multiple active sessions
- Deleting user cascades to sessions

**Student ↔ Report (1:N)**
- One student can have multiple reports
- Deleting student cascades to reports (all deleted)

---

## 📝 Schema Definition

### Complete Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// NextAuth.js Models
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Application Models
model Student {
  id         String   @id @default(cuid())
  firstName  String
  lastName   String
  email      String   @unique
  gradeLevel Int
  status     String   @default("ACTIVE")
  reports    Report[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([email])
  @@index([status])
}

model Report {
  id        String   @id @default(cuid())
  title     String
  content   String
  term      String
  year      Int
  studentId String
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([studentId])
  @@index([term, year])
}
```

---

## 🔄 Migrations

### Migration Commands

```bash
# Create a new migration after schema changes
npx prisma migrate dev --name descriptive_name

# Apply migrations in production
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset database (development only!)
npx prisma migrate reset
```

### Migration History

**Initial Migration:**
```bash
npx prisma migrate dev --name init
```

Creates all tables with initial schema.

**Example Migration:**
```bash
npx prisma migrate dev --name add_student_status
```

Adds `status` field to Student model.

### Migration Files

Located in `prisma/migrations/`:

```
prisma/migrations/
├── 20240115_init/
│   └── migration.sql
├── 20240120_add_student_status/
│   └── migration.sql
└── migration_lock.toml
```

---

## 🌱 Seeding

### Seed Script

Located at `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create sample students
  const students = await Promise.all([
    prisma.student.upsert({
      where: { email: 'john.doe@example.com' },
      update: {},
      create: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        gradeLevel: 10,
        status: 'ACTIVE',
      },
    }),
    prisma.student.upsert({
      where: { email: 'jane.smith@example.com' },
      update: {},
      create: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        gradeLevel: 11,
        status: 'ACTIVE',
      },
    }),
    prisma.student.upsert({
      where: { email: 'bob.johnson@example.com' },
      update: {},
      create: {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        gradeLevel: 9,
        status: 'ACTIVE',
      },
    }),
  ])
  console.log('✅ Sample students created:', students.length)

  // Create sample reports
  for (const student of students) {
    await prisma.report.create({
      data: {
        title: `Fall 2024 Report - ${student.firstName} ${student.lastName}`,
        content: `Academic report for ${student.firstName} ${student.lastName} for Fall 2024 term.`,
        term: 'Fall',
        year: 2024,
        studentId: student.id,
      },
    })
  }
  console.log('✅ Sample reports created')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### Running Seed

```bash
# Add to package.json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}

# Run seed
npm run db:seed
# or
npx prisma db seed
```

---

## 🔍 Database Queries

### Common Queries

**Get all students with reports:**
```typescript
const students = await prisma.student.findMany({
  include: {
    reports: true
  }
})
```

**Get student by email:**
```typescript
const student = await prisma.student.findUnique({
  where: { email: 'john.doe@example.com' }
})
```

**Get reports for a student:**
```typescript
const reports = await prisma.report.findMany({
  where: { studentId: 'clx123abc' },
  include: { student: true },
  orderBy: { createdAt: 'desc' }
})
```

**Search students by name:**
```typescript
const students = await prisma.student.findMany({
  where: {
    OR: [
      { firstName: { contains: 'John', mode: 'insensitive' } },
      { lastName: { contains: 'John', mode: 'insensitive' } }
    ]
  }
})
```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Getting Started](Getting-Started) - Setup guide
- [API Documentation](API-Documentation) - API endpoints

---

*Need help? Check [Troubleshooting](Troubleshooting) or [FAQ](FAQ)*
