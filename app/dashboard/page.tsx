import { prisma } from '@/lib/db'
import DashboardClient from './ui'

export const dynamic = 'force-dynamic'

function DashboardSetupError({ message }: { message: string }) {
 return (
  <main className="min-h-screen bg-slate-50 p-6">
   <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">
    <h1 className="text-2xl font-bold text-slate-900">Database setup needed</h1>
    <p className="mt-3 text-slate-600">
     The dashboard needs a working PostgreSQL database before it can load school data.
    </p>
    <pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">{message}</pre>
    <div className="mt-5 space-y-2 text-sm text-slate-700">
     <p>Add `DATABASE_URL` in `.env.local` for local development.</p>
     <p>In Vercel, add `DATABASE_URL` in Project Settings, then run `npx prisma db push` once.</p>
    </div>
   </section>
  </main>
 )
}

export default async function Dashboard() {
 try {
  const [users, students, classes, announcements, payments] = await Promise.all([
   prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
   prisma.student.findMany({ include: { classUpdates: { orderBy: { date: 'desc' }, take: 1 }, payments: true } }),
   prisma.class.findMany({ include: { teacher: true, enrollments: true } }),
   prisma.announcement.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
   prisma.payment.findMany({ include: { student: true }, orderBy: { dueDate: 'desc' } }),
  ])

  return <DashboardClient users={users as any} students={students as any} classes={classes as any} announcements={announcements as any} payments={payments as any} />
 } catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown database error'
  return <DashboardSetupError message={message} />
 }
}
