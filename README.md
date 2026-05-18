# School Management Platform Starter

A working local starter for a school platform with:

- Principal / Admin / Teacher / Parent role dashboards
- Students and classes
- Manual student entry
- Excel student import UI
- Homework and revision by class/date
- Scores, points, stamps and attendance
- Public enrolment form
- Parent portal with child linking
- Announcements
- Payment reminders and receipt upload UI

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Demo login

Use the role switcher on the home page. This starter uses browser localStorage so it works without database setup.

## Next production steps

1. Add Auth.js / NextAuth.
2. Add Prisma + PostgreSQL.
3. Move localStorage functions from `lib/store.ts` to API routes.
4. Add real receipt uploads using UploadThing/S3.
5. Add email/SMS reminders using Resend/Twilio.
