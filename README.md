Student Report App (Next.js + Prisma + Postgres)

## Overview
Build, list, view, print A4 student reports with a clean MUI UI. Data is persisted in Postgres via Prisma.

Key routes:
- /reports/create – create/update reports, print preview
- /reports – list with sort/pagination, actions
- /reports/[id] – print-friendly view
- /api/reports – list API
- /api/reports/[id] – get/save/delete API
- /api/health – DB health check

## Setup
1) Environment
- Copy `.env.example` to `.env` and set a Postgres URL:
	- `DATABASE_URL="postgres://USER:PASS@HOST:5432/DB?sslmode=require"`
	- Optional: `DIRECT_URL` (used by migrations). If not set differently, you can set it equal to `DATABASE_URL`.

2) Install and generate
```bash
npm install
npm run prisma:generate
```

3) Apply migrations
```bash
npx prisma migrate deploy
```

4) Run dev server
```bash
npm run dev
```
Open the printed URL (e.g., http://localhost:3000 or :3001) and go to /reports (list) or /reports/create (builder).

## Scripts
- prisma:generate – regenerate Prisma Client
- prisma:migrate – create a new migration in dev
- prisma:deploy – apply existing migrations (CI/prod)
- prisma:studio – open Prisma Studio
- prisma:seed – insert 20 sample reports

Optional helpers
```bash
node scripts/check-count.js     # show current Report rows
node scripts/check-indexes.js   # list current DB indexes on Report
```

## Notes
- This app uses standard Prisma Client (Node runtime), not Accelerate.
- Keep your `.env` out of version control.
 - If connection fails on managed Postgres, add `sslmode=require` to your DATABASE_URL.
