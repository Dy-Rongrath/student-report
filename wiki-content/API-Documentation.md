# API Documentation

Complete API reference for the Student Report System. All endpoints, request/response formats, authentication, and examples.

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Auth Endpoints](#auth-endpoints)
4. [Student Endpoints](#student-endpoints)
5. [Report Endpoints](#report-endpoints)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Examples](#examples)

---

## 🌐 Overview

### Base URL

**Production:**
```
https://student-report-ruby.vercel.app
```

**Development:**
```
http://localhost:3000
```

### API Version

Current version: **v1** (no versioning prefix in URLs)

### Content Type

All requests and responses use JSON:
```
Content-Type: application/json
```

### Response Format

**Success Response:**
```json
{
  "data": { ... },
  "message": "Success message"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

---

## 🔐 Authentication

### Authentication Methods

The API uses **NextAuth.js** with session-based authentication.

### Session Cookie

After successful login, a session cookie is set:
```
Cookie: next-auth.session-token=<token>
```

### Getting Session Token

**Login to get session:**
```bash
curl -X POST https://student-report-ruby.vercel.app/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Protected Routes

Routes requiring authentication:
- `/api/students` (GET, POST, PUT, DELETE)
- `/api/reports` (GET, POST, PUT, DELETE)
- `/dashboard`
- `/students`
- `/reports`

### Checking Authentication

```typescript
// In API route
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Continue with authenticated request
}
```

---

## 🔑 Auth Endpoints

### POST /api/auth/register

Create a new user account.

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "clx123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "User registered successfully"
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters

**Error Responses:**
```json
// 400 Bad Request - Missing fields
{
  "error": "Name, email, and password are required"
}

// 409 Conflict - Email exists
{
  "error": "User with this email already exists",
  "code": "EMAIL_EXISTS"
}

// 400 Bad Request - Weak password
{
  "error": "Password must be at least 8 characters"
}
```

### POST /api/auth/signin

Sign in with credentials (handled by NextAuth).

**Endpoint:** Handled by NextAuth at `/api/auth/callback/credentials`

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
Sets session cookie and redirects to `/dashboard`

### POST /api/auth/signout

Sign out current user.

**Request:**
```http
POST /api/auth/signout
```

**Response:**
Clears session cookie and redirects to home page

### GET /api/auth/session

Get current session information.

**Request:**
```http
GET /api/auth/session
```

**Response (Authenticated):**
```json
{
  "user": {
    "name": "Admin User",
    "email": "admin@example.com",
    "image": null
  },
  "expires": "2024-02-15T10:30:00Z"
}
```

**Response (Not Authenticated):**
```json
{}
```

---

## 👨‍🎓 Student Endpoints

### GET /api/students

Get list of all students.

**Request:**
```http
GET /api/students
Cookie: next-auth.session-token=<token>
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search by name or email | `?search=john` |
| `status` | string | Filter by status | `?status=ACTIVE` |
| `gradeLevel` | number | Filter by grade | `?gradeLevel=10` |
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 20) | `?limit=50` |
| `sort` | string | Sort field | `?sort=firstName` |
| `order` | string | Sort order (asc/desc) | `?order=desc` |

**Response (200 OK):**
```json
{
  "students": [
    {
      "id": "clx123abc",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "gradeLevel": 10,
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "clx456def",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "gradeLevel": 11,
      "status": "ACTIVE",
      "createdAt": "2024-01-16T14:20:00Z",
      "updatedAt": "2024-01-16T14:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "pages": 1
  }
}
```

**Example with filters:**
```bash
curl "https://student-report-ruby.vercel.app/api/students?status=ACTIVE&gradeLevel=10&sort=firstName&order=asc" \
  -H "Cookie: next-auth.session-token=<token>"
```

### GET /api/students/:id

Get a specific student by ID.

**Request:**
```http
GET /api/students/clx123abc
Cookie: next-auth.session-token=<token>
```

**Response (200 OK):**
```json
{
  "id": "clx123abc",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "gradeLevel": 10,
  "status": "ACTIVE",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "reports": [
    {
      "id": "clx789ghi",
      "title": "Fall 2024 Report",
      "term": "Fall",
      "year": 2024,
      "createdAt": "2024-01-20T09:00:00Z"
    }
  ]
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Student not found",
  "code": "STUDENT_NOT_FOUND"
}
```

### POST /api/students

Create a new student.

**Request:**
```http
POST /api/students
Content-Type: application/json
Cookie: next-auth.session-token=<token>

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "gradeLevel": 10,
  "status": "ACTIVE"
}
```

**Required Fields:**
- `firstName` (string, 1-100 chars)
- `lastName` (string, 1-100 chars)
- `email` (string, valid email, unique)
- `gradeLevel` (number, 1-12)

**Optional Fields:**
- `status` (string, default: "ACTIVE")
  - Values: "ACTIVE", "INACTIVE", "GRADUATED"

**Response (201 Created):**
```json
{
  "id": "clx123abc",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "gradeLevel": 10,
  "status": "ACTIVE",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
```json
// 400 Bad Request - Missing fields
{
  "error": "Missing required fields: firstName, lastName, email, gradeLevel"
}

// 400 Bad Request - Invalid email
{
  "error": "Invalid email format"
}

// 409 Conflict - Email exists
{
  "error": "Student with this email already exists",
  "code": "EMAIL_EXISTS"
}

// 400 Bad Request - Invalid grade level
{
  "error": "Grade level must be between 1 and 12"
}
```

### PUT /api/students/:id

Update an existing student.

**Request:**
```http
PUT /api/students/clx123abc
Content-Type: application/json
Cookie: next-auth.session-token=<token>

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "gradeLevel": 11,
  "status": "ACTIVE"
}
```

**Response (200 OK):**
```json
{
  "id": "clx123abc",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "gradeLevel": 11,
  "status": "ACTIVE",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T15:45:00Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Student not found",
  "code": "STUDENT_NOT_FOUND"
}
```

### DELETE /api/students/:id

Delete a student (and all associated reports).

**Request:**
```http
DELETE /api/students/clx123abc
Cookie: next-auth.session-token=<token>
```

**Response (200 OK):**
```json
{
  "message": "Student deleted successfully",
  "deletedId": "clx123abc"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Student not found",
  "code": "STUDENT_NOT_FOUND"
}
```

---

## 📝 Report Endpoints

### GET /api/reports

Get list of all reports.

**Request:**
```http
GET /api/reports
Cookie: next-auth.session-token=<token>
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `studentId` | string | Filter by student ID | `?studentId=clx123abc` |
| `term` | string | Filter by term | `?term=Fall` |
| `year` | number | Filter by year | `?year=2024` |
| `page` | number | Page number | `?page=1` |
| `limit` | number | Items per page | `?limit=20` |
| `sort` | string | Sort field | `?sort=createdAt` |
| `order` | string | Sort order | `?order=desc` |

**Response (200 OK):**
```json
{
  "reports": [
    {
      "id": "clx789ghi",
      "title": "Fall 2024 Report",
      "content": "Student performance report...",
      "term": "Fall",
      "year": 2024,
      "studentId": "clx123abc",
      "student": {
        "id": "clx123abc",
        "firstName": "John",
        "lastName": "Doe",
        "gradeLevel": 10
      },
      "createdAt": "2024-01-20T09:00:00Z",
      "updatedAt": "2024-01-20T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### GET /api/reports/:id

Get a specific report by ID.

**Request:**
```http
GET /api/reports/clx789ghi
Cookie: next-auth.session-token=<token>
```

**Response (200 OK):**
```json
{
  "id": "clx789ghi",
  "title": "Fall 2024 Report",
  "content": "Student performance report for Fall 2024...",
  "term": "Fall",
  "year": 2024,
  "studentId": "clx123abc",
  "student": {
    "id": "clx123abc",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "gradeLevel": 10,
    "status": "ACTIVE"
  },
  "createdAt": "2024-01-20T09:00:00Z",
  "updatedAt": "2024-01-20T09:00:00Z"
}
```

### POST /api/reports

Create a new report.

**Request:**
```http
POST /api/reports
Content-Type: application/json
Cookie: next-auth.session-token=<token>

{
  "title": "Fall 2024 Report",
  "content": "Student performance report...",
  "term": "Fall",
  "year": 2024,
  "studentId": "clx123abc"
}
```

**Required Fields:**
- `title` (string, 1-200 chars)
- `content` (string)
- `term` (string: "Fall", "Spring", "Summer")
- `year` (number, 2000-2100)
- `studentId` (string, valid student ID)

**Response (201 Created):**
```json
{
  "id": "clx789ghi",
  "title": "Fall 2024 Report",
  "content": "Student performance report...",
  "term": "Fall",
  "year": 2024,
  "studentId": "clx123abc",
  "createdAt": "2024-01-20T09:00:00Z",
  "updatedAt": "2024-01-20T09:00:00Z"
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "error": "Missing required fields: title, content, term, year, studentId"
}

// 404 Not Found
{
  "error": "Student not found",
  "code": "STUDENT_NOT_FOUND"
}

// 400 Bad Request - Invalid term
{
  "error": "Term must be one of: Fall, Spring, Summer"
}
```

### PUT /api/reports/:id

Update an existing report.

**Request:**
```http
PUT /api/reports/clx789ghi
Content-Type: application/json
Cookie: next-auth.session-token=<token>

{
  "title": "Fall 2024 Report - Updated",
  "content": "Updated content...",
  "term": "Fall",
  "year": 2024
}
```

**Response (200 OK):**
```json
{
  "id": "clx789ghi",
  "title": "Fall 2024 Report - Updated",
  "content": "Updated content...",
  "term": "Fall",
  "year": 2024,
  "studentId": "clx123abc",
  "createdAt": "2024-01-20T09:00:00Z",
  "updatedAt": "2024-01-21T10:15:00Z"
}
```

### DELETE /api/reports/:id

Delete a report.

**Request:**
```http
DELETE /api/reports/clx789ghi
Cookie: next-auth.session-token=<token>
```

**Response (200 OK):**
```json
{
  "message": "Report deleted successfully",
  "deletedId": "clx789ghi"
}
```

---

## ❌ Error Handling

### HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| **200** | OK | Successful GET, PUT, DELETE |
| **201** | Created | Successful POST |
| **400** | Bad Request | Invalid input, validation error |
| **401** | Unauthorized | Not authenticated |
| **403** | Forbidden | Authenticated but not authorized |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Duplicate resource (e.g., email) |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server error |

### Error Response Format

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional context"
  }
}
```

### Common Error Codes

```
AUTH_REQUIRED          - Authentication required
AUTH_INVALID           - Invalid credentials
SESSION_EXPIRED        - Session has expired
STUDENT_NOT_FOUND      - Student doesn't exist
REPORT_NOT_FOUND       - Report doesn't exist
EMAIL_EXISTS           - Email already in use
INVALID_INPUT          - Input validation failed
PERMISSION_DENIED      - Insufficient permissions
RATE_LIMIT_EXCEEDED    - Too many requests
SERVER_ERROR           - Internal server error
```

### Error Examples

**401 Unauthorized:**
```json
{
  "error": "You must be logged in to access this resource",
  "code": "AUTH_REQUIRED"
}
```

**400 Bad Request:**
```json
{
  "error": "Validation failed",
  "code": "INVALID_INPUT",
  "details": {
    "email": "Invalid email format",
    "gradeLevel": "Must be between 1 and 12"
  }
}
```

**404 Not Found:**
```json
{
  "error": "Student not found",
  "code": "STUDENT_NOT_FOUND",
  "details": {
    "studentId": "clx123abc"
  }
}
```

**500 Internal Server Error:**
```json
{
  "error": "An unexpected error occurred",
  "code": "SERVER_ERROR"
}
```

---

## ⏱️ Rate Limiting

### Current Limits

**Authenticated Users:**
- 100 requests per minute per user
- 5,000 requests per hour per user

**Unauthenticated Users:**
- 20 requests per minute per IP
- 100 requests per hour per IP

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

### Rate Limit Exceeded Response

**429 Too Many Requests:**
```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 100,
    "resetAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 💡 Examples

### Complete Student CRUD Example

```javascript
// 1. Create Student
const createStudent = async () => {
  const response = await fetch('/api/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', // Include session cookie
    body: JSON.stringify({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      gradeLevel: 10,
      status: 'ACTIVE'
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }
  
  const student = await response.json()
  console.log('Created student:', student)
  return student
}

// 2. Get All Students
const getStudents = async () => {
  const response = await fetch('/api/students?status=ACTIVE&sort=firstName&order=asc', {
    credentials: 'include'
  })
  
  const data = await response.json()
  console.log('Students:', data.students)
  console.log('Pagination:', data.pagination)
  return data
}

// 3. Get Single Student
const getStudent = async (id) => {
  const response = await fetch(`/api/students/${id}`, {
    credentials: 'include'
  })
  
  if (!response.ok) {
    throw new Error('Student not found')
  }
  
  const student = await response.json()
  console.log('Student details:', student)
  return student
}

// 4. Update Student
const updateStudent = async (id, updates) => {
  const response = await fetch(`/api/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(updates)
  })
  
  const updated = await response.json()
  console.log('Updated student:', updated)
  return updated
}

// 5. Delete Student
const deleteStudent = async (id) => {
  const response = await fetch(`/api/students/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  
  const result = await response.json()
  console.log('Deleted:', result)
  return result
}
```

### TypeScript Example with Types

```typescript
// types/api.ts
interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  gradeLevel: number
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED'
  createdAt: string
  updatedAt: string
}

interface Report {
  id: string
  title: string
  content: string
  term: 'Fall' | 'Spring' | 'Summer'
  year: number
  studentId: string
  student?: Student
  createdAt: string
  updatedAt: string
}

interface APIResponse<T> {
  data?: T
  error?: string
  code?: string
  details?: Record<string, any>
}

// lib/api-client.ts
class APIClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || ''

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'API request failed')
    }

    return response.json()
  }

  // Students
  async getStudents(params?: Record<string, string>) {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request<{ students: Student[]; pagination: any }>(
      `/api/students${query}`
    )
  }

  async getStudent(id: string) {
    return this.request<Student>(`/api/students/${id}`)
  }

  async createStudent(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.request<Student>('/api/students', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateStudent(id: string, data: Partial<Student>) {
    return this.request<Student>(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteStudent(id: string) {
    return this.request<{ message: string }>(`/api/students/${id}`, {
      method: 'DELETE'
    })
  }

  // Reports
  async getReports(params?: Record<string, string>) {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request<{ reports: Report[]; pagination: any }>(
      `/api/reports${query}`
    )
  }

  async createReport(data: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'student'>) {
    return this.request<Report>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

export const apiClient = new APIClient()

// Usage
const students = await apiClient.getStudents({ status: 'ACTIVE' })
const student = await apiClient.getStudent('clx123abc')
const newStudent = await apiClient.createStudent({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  gradeLevel: 10,
  status: 'ACTIVE'
})
```

### React Hook Example

```typescript
// hooks/useStudents.ts
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import type { Student } from '@/types/api'

export function useStudents(filters?: Record<string, string>) {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true)
        const data = await apiClient.getStudents(filters)
        setStudents(data.students)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch students')
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [JSON.stringify(filters)])

  const refetch = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getStudents(filters)
      setStudents(data.students)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  return { students, loading, error, refetch }
}

// Usage in component
function StudentList() {
  const { students, loading, error, refetch } = useStudents({ status: 'ACTIVE' })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {students.map(student => (
        <div key={student.id}>{student.firstName} {student.lastName}</div>
      ))}
    </div>
  )
}
```

---

## 📚 Additional Resources

- [Getting Started](Getting-Started) - Setup guide
- [Developer Guide](Developer-Guide) - Technical documentation
- [Database Schema](Database-Schema) - Database structure
- [Troubleshooting](Troubleshooting) - Common issues

---

*Need help? Check [FAQ](FAQ) or create a GitHub issue.*
