# Student Report System

A modern, comprehensive student reporting and management system built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

- **🔐 Authentication**: Secure user authentication with NextAuth.js
- **🗄️ Database**: PostgreSQL database with Prisma ORM
- **👥 Student Management**: Manage student information, profiles, and enrollment details
- **📊 Report Generation**: Create and manage comprehensive academic reports
- **📈 Performance Analytics**: Track and analyze student performance
- **🔒 Protected Routes**: Middleware-based route protection
- **👤 User Roles**: Role-based access control (USER, ADMIN, TEACHER)
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **✨ Type-Safe**: Built with TypeScript for better development experience
- **🎨 Modern UI**: Clean and intuitive interface with Tailwind CSS

## 📁 Project Structure

```
student-report/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── reports/       # Reports API endpoints
│   │   │   └── students/      # Students API endpoints
│   │   ├── dashboard/         # Dashboard page
│   │   ├── reports/           # Reports pages
│   │   ├── students/          # Students pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── features/          # Feature-specific components
│   │   ├── layout/            # Layout components (Header, Footer)
│   │   └── ui/                # Reusable UI components
│   ├── constants/             # Application constants
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and API client
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper utilities
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── .env.example              # Environment variables example
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Password Hashing**: Bcrypt
- **State Management**: React Hooks + NextAuth Session
- **API**: Next.js API Routes
- **Build Tool**: Turbopack

## 📦 Installation & Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup Database**:
   - See [DATABASE_AUTH_SETUP.md](./DATABASE_AUTH_SETUP.md) for detailed instructions
   - Quick setup: Use online database (Vercel Postgres, Supabase, etc.)
   - Update `.env.local` with your database URL

3. **Run Prisma Migrations**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Create your account**:
   - Go to `/auth/signup`
   - Register a new user
   - Sign in at `/auth/signin`

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Architecture

### Component Organization

- **`/components/ui`**: Reusable UI components (Button, Card, Input, etc.)
- **`/components/layout`**: Layout components (Header, Footer)
- **`/components/features`**: Feature-specific components (StudentCard, etc.)

### State Management

- Custom hooks for data fetching (`useFetch`)
- Local storage hook for client-side persistence (`useLocalStorage`)

### API Structure

- RESTful API routes under `/app/api`
- Type-safe responses with TypeScript interfaces
- Pagination support for list endpoints

### Type Safety

- Comprehensive TypeScript types in `/src/types`
- Strict type checking enabled
- Type-safe API client

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Custom global styles in `globals.css`
- Responsive design with mobile-first approach

## 🔒 Environment Variables

Environment variables are already set up in `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📖 Usage

### Navigating the Application

- **Home**: Landing page with feature overview
- **Dashboard**: Overview statistics and quick actions
- **Students**: View and search all students
- **Reports**: View and manage academic reports

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
