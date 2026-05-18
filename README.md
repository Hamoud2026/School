# School Platform Full Stack

Production-style full-stack starter for a school management platform.

## Included
- Next.js frontend and backend API routes
- Prisma database schema
- PostgreSQL database support for Neon/Vercel deployment
- Role system: PRINCIPAL, ADMIN, TEACHER, PARENT
- Principal role approval flow
- Student manual creation
- Excel student import API structure
- Classes and teacher assignments
- Teacher class update: homework, revision, score, attendance, stamps/points
- Parent account and child linking by first name + DOB + optional student code
- Parent child progress page data
- Announcements
- Payments and receipt upload record structure

## Demo accounts after seed
- principal@school.com / password123
- admin@school.com / password123
- teacher@school.com / password123
- parent@school.com / password123

## Run locally
```bash
npm install
cp .env.example .env.local
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```
Open http://localhost:3000

## Environment
Copy `.env.example` to `.env.local` for local development.

For Vercel, add these environment variables in Project Settings:
- `DATABASE_URL`: your Neon PostgreSQL connection string
- `NEXTAUTH_SECRET`: a long random secret
- `NEXTAUTH_URL`: your deployed Vercel URL, for example `https://your-app.vercel.app`

## Important production notes
- Do not commit `.env.local` or real database credentials.
- Run `npx prisma db push` after setting the production `DATABASE_URL`.
- Change `NEXTAUTH_SECRET` before deployment.
- Use cloud storage for receipts.
- Add email verification before public launch.
- For child linking, first name + DOB alone is not secure. This starter also supports student code.
