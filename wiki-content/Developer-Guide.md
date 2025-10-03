# Developer Guide

Technical documentation for developers working on the Student Report System. Learn about architecture, code structure, development workflow, and best practices.

---

## 📖 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Development Setup](#development-setup)
5. [Code Standards](#code-standards)
6. [Component Guide](#component-guide)
7. [API Development](#api-development)
8. [Database Management](#database-management)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client Layer                  │
│  ┌──────────────────────────────────────────┐  │
│  │      Next.js App (React Components)      │  │
│  │  ┌────────────┐      ┌────────────────┐ │  │
│  │  │   Pages    │      │   Components   │ │  │
│  │  └────────────┘      └────────────────┘ │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────┐
│                Middleware Layer                 │
│  ┌──────────────────────────────────────────┐  │
│  │    NextAuth.js Authentication            │  │
│  │    Route Protection (middleware.ts)      │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────┐
│                   API Layer                     │
│  ┌──────────────────────────────────────────┐  │
│  │      Next.js API Routes (App Router)     │  │
│  │  /api/auth/*  /api/students  /api/reports│  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────┐
│                Database Layer                   │
│  ┌──────────────────────────────────────────┐  │
│  │        Prisma ORM + Vercel Postgres      │  │
│  │   6 Models: User, Account, Session,      │  │
│  │   VerificationToken, Student, Report     │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Technology Decisions

**Why Next.js 15?**
- Server-side rendering for better SEO
- App Router for improved routing
- API routes for backend logic
- Turbopack for faster builds

**Why Prisma?**
- Type-safe database client
- Database migrations
- Intuitive schema definition
- Auto-generated TypeScript types

**Why NextAuth.js?**
- Built for Next.js
- Multiple authentication providers
- Session management
- JWT token support

**Why Vercel Postgres?**
- Integrated with Vercel deployment
- Auto-scaling
- Low latency
- Easy setup

---

## 📁 Project Structure

```
student-report/
│
├── src/                          # Source code
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Home page (/)
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Global styles
│   │   │
│   │   ├── auth/                # Authentication pages
│   │   │   ├── signin/
│   │   │   │   └── page.tsx    # Sign in page
│   │   │   └── signup/
│   │   │       └── page.tsx    # Sign up page
│   │   │
│   │   ├── dashboard/           # Dashboard pages
│   │   │   └── page.tsx        # Dashboard (protected)
│   │   │
│   │   ├── students/            # Student pages
│   │   │   └── page.tsx        # Student list (protected)
│   │   │
│   │   ├── reports/             # Report pages
│   │   │   └── page.tsx        # Report list (protected)
│   │   │
│   │   └── api/                 # API Routes
│   │       ├── auth/
│   │       │   ├── [...nextauth]/
│   │       │   │   └── route.ts # NextAuth handler
│   │       │   └── register/
│   │       │       └── route.ts # Registration
│   │       ├── students/
│   │       │   └── route.ts    # Student CRUD API
│   │       └── reports/
│   │           └── route.ts    # Report CRUD API
│   │
│   ├── components/              # React components
│   │   ├── features/           # Feature-specific components
│   │   │   └── StudentCard.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── providers/          # Context providers
│   │   │   └── AuthProvider.tsx
│   │   └── ui/                 # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── api.ts             # API client utilities
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client instance
│   │   └── utils.ts           # General utilities
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useFetch.ts        # Data fetching hook
│   │   └── useLocalStorage.ts # Local storage hook
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── index.ts           # Shared types
│   │   └── next-auth.d.ts     # NextAuth type extensions
│   │
│   ├── constants/              # Constants and configs
│   │   └── index.ts
│   │
│   ├── utils/                  # Utility functions
│   │   └── (utility files)
│   │
│   └── middleware.ts           # Next.js middleware (auth)
│
├── prisma/                      # Prisma ORM
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeding script
│
├── public/                      # Static assets
│   ├── images/
│   └── icons/
│
├── .github/                     # GitHub configuration
│   └── workflows/
│       └── ci-cd.yml           # CI/CD pipeline
│
├── .vscode/                     # VS Code settings
│   └── settings.json
│
├── .env.local                   # Environment variables (local)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.ts               # Next.js config
├── tailwind.config.ts           # Tailwind CSS config
├── postcss.config.mjs           # PostCSS config
├── eslint.config.mjs            # ESLint config
└── README.md                    # Project documentation
```

### File Naming Conventions

```
Pages:       page.tsx, layout.tsx
Components:  PascalCase.tsx (e.g., StudentCard.tsx)
Utilities:   camelCase.ts (e.g., formatDate.ts)
API Routes:  route.ts
Types:       camelCase.ts or PascalCase.ts
Constants:   UPPER_SNAKE_CASE or camelCase
Hooks:       useCamelCase.ts (e.g., useFetch.ts)
```

---

## 🛠️ Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.4 | React framework |
| **React** | 19.0.0 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **Tailwind CSS** | 4.0.1 | Styling |
| **Prisma** | 6.16.3 | ORM |
| **NextAuth.js** | 4.24.11 | Authentication |
| **PostgreSQL** | Latest | Database |

### Development Tools

```json
{
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.5.4",
    "typescript": "^5"
  }
}
```

### Key Libraries

**Authentication:**
- `next-auth` - Authentication
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens

**Database:**
- `@prisma/client` - Prisma client
- `prisma` - Prisma CLI

**UI:**
- `tailwindcss` - Utility-first CSS
- `postcss` - CSS processing
- `autoprefixer` - CSS vendor prefixes

---

## 💻 Development Setup

### Prerequisites

```bash
# Check versions
node --version    # Should be 18.0.0+
npm --version     # Should be 9.0.0+
git --version     # Should be 2.0.0+
```

### Environment Configuration

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/studentreport"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"

# Optional: Development
NODE_ENV="development"
```

### Running Development Server

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

**Development server runs at:**
- Local: http://localhost:3000
- Network: http://192.168.x.x:3000

### Development Workflow

```mermaid
graph LR
    A[Create Branch] --> B[Write Code]
    B --> C[Test Locally]
    C --> D[Commit]
    D --> E[Push]
    E --> F[Create PR]
    F --> G[Code Review]
    G --> H[Merge]
```

**Branch Naming:**
```
feature/add-student-search
bugfix/fix-login-redirect
hotfix/security-patch
refactor/optimize-queries
```

**Commit Messages:**
```
feat: Add student search functionality
fix: Fix login redirect loop
docs: Update API documentation
style: Format code with Prettier
refactor: Optimize database queries
test: Add unit tests for auth
chore: Update dependencies
```

---

## 📐 Code Standards

### TypeScript Guidelines

**Always use types:**
```typescript
// ❌ Bad
const getStudent = (id) => {
  return fetch(`/api/students/${id}`)
}

// ✅ Good
const getStudent = async (id: string): Promise<Student> => {
  const response = await fetch(`/api/students/${id}`)
  return response.json()
}
```

**Define interfaces:**
```typescript
// src/types/index.ts
export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  gradeLevel: number
  status: StudentStatus
  createdAt: Date
  updatedAt: Date
}

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED'
}
```

### React Best Practices

**Component Structure:**
```typescript
// src/components/features/StudentCard.tsx
'use client' // If using client-side features

import { Student } from '@/types'

interface StudentCardProps {
  student: Student
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function StudentCard({ 
  student, 
  onEdit, 
  onDelete 
}: StudentCardProps) {
  // Hooks at top
  const [isLoading, setIsLoading] = useState(false)
  
  // Event handlers
  const handleEdit = () => {
    onEdit?.(student.id)
  }
  
  // Render
  return (
    <div className="card">
      <h3>{student.firstName} {student.lastName}</h3>
      {/* ... */}
    </div>
  )
}
```

**Server vs Client Components:**

```typescript
// Server Component (default in App Router)
// No 'use client' directive
// Can directly query database
export default async function StudentsPage() {
  const students = await prisma.student.findMany()
  return <StudentList students={students} />
}

// Client Component
// Needs 'use client' directive
// Can use hooks, event handlers
'use client'
export default function StudentCard({ student }: Props) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div onClick={() => setExpanded(!expanded)}>
      {/* ... */}
    </div>
  )
}
```

### API Route Patterns

```typescript
// src/app/api/students/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/students
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Query database
    const students = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Return response
    return NextResponse.json(students)
  } catch (error) {
    console.error('GET /api/students error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/students
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input
    if (!body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        gradeLevel: body.gradeLevel,
        status: body.status || 'ACTIVE'
      }
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('POST /api/students error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Error Handling

```typescript
// Centralized error handler
// src/lib/errorHandler.ts
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }
  
  console.error('Unexpected error:', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}

// Usage in API routes
throw new APIError(404, 'Student not found', 'STUDENT_NOT_FOUND')
```

---

## 🧩 Component Guide

### UI Components

**Button Component:**
```typescript
// src/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded font-medium transition-colors'
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

**Card Component:**
```typescript
// src/components/ui/Card.tsx
interface CardProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export default function Card({ title, children, footer, className }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  )
}
```

### Custom Hooks

**useFetch Hook:**
```typescript
// src/hooks/useFetch.ts
import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const json = await response.json()
      setData(json)
      setError(null)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { data, loading, error, refetch: fetchData }
}

// Usage
const { data: students, loading, error, refetch } = useFetch<Student[]>('/api/students')
```

---

## 🗄️ Database Management

### Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Student {
  id         String   @id @default(cuid())
  firstName  String
  lastName   String
  email      String   @unique
  gradeLevel Int
  status     String   @default("ACTIVE")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  reports    Report[]

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

### Database Operations

**Creating records:**
```typescript
const student = await prisma.student.create({
  data: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    gradeLevel: 10
  }
})
```

**Querying with relations:**
```typescript
const studentWithReports = await prisma.student.findUnique({
  where: { id: 'student-id' },
  include: {
    reports: {
      orderBy: { createdAt: 'desc' }
    }
  }
})
```

**Updating records:**
```typescript
const updated = await prisma.student.update({
  where: { id: 'student-id' },
  data: { status: 'GRADUATED' }
})
```

**Deleting records:**
```typescript
await prisma.student.delete({
  where: { id: 'student-id' }
})
```

### Migrations

```bash
# Create migration after schema changes
npx prisma migrate dev --name add_student_status

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

---

## 🧪 Testing

### Unit Testing

```typescript
// __tests__/utils/formatDate.test.ts
import { formatDate } from '@/utils/formatDate'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date)).toBe('January 15, 2024')
  })

  it('handles invalid date', () => {
    expect(formatDate(null)).toBe('Invalid date')
  })
})
```

### Integration Testing

```typescript
// __tests__/api/students.test.ts
import { GET, POST } from '@/app/api/students/route'

describe('/api/students', () => {
  it('returns list of students', async () => {
    const response = await GET(new Request('http://localhost'))
    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('creates new student', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'Student',
        email: 'test@example.com',
        gradeLevel: 10
      })
    })
    const response = await POST(request)
    expect(response.status).toBe(201)
  })
})
```

---

## 🚀 Deployment

See [Deployment Guide](Deployment-Guide) for complete deployment instructions.

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

*Need help? Check [Troubleshooting](Troubleshooting) or create a GitHub issue.*
