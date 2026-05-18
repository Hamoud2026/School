import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth'
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
 const currentUser = await requireUser()

 try {
  if (currentUser.role === 'PENDING') {
   return (
    <main className="min-h-screen bg-slate-50 p-6">
     <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-slate-900">Waiting for principal approval</h1>
      <p className="mt-3 text-slate-600">Your account is registered, but the principal still needs to assign your role before you can use the dashboard.</p>
      <form action="/api/auth/logout" method="post" className="mt-5">
       <button className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white">Log out</button>
      </form>
     </section>
    </main>
   )
  }

  const canManageSchool = currentUser.role === 'PRINCIPAL' || currentUser.role === 'ADMIN'

  const [users, students, classes, announcements, payments, registrationLinks, joinRequests, teachers] = await Promise.all([
   currentUser.role === 'PRINCIPAL' ? prisma.user.findMany({ orderBy: { createdAt: 'desc' } }) : Promise.resolve([]),
   canManageSchool
    ? prisma.student.findMany({ include: { classUpdates: { orderBy: { date: 'desc' }, take: 1 }, payments: true } })
    : currentUser.role === 'PARENT'
     ? prisma.student.findMany({ where: { parentLinks: { some: { parentId: currentUser.id } } }, include: { classUpdates: { orderBy: { date: 'desc' }, take: 1 }, payments: true } })
     : prisma.student.findMany({ where: { enrollments: { some: { class: { teacherId: currentUser.id } } } }, include: { classUpdates: { orderBy: { date: 'desc' }, take: 1 }, payments: true } }),
   canManageSchool
    ? prisma.class.findMany({ include: { teacher: true, enrollments: true } })
    : currentUser.role === 'TEACHER'
     ? prisma.class.findMany({ where: { teacherId: currentUser.id }, include: { teacher: true, enrollments: true } })
     : prisma.class.findMany({ where: { enrollments: { some: { student: { parentLinks: { some: { parentId: currentUser.id } } } } } }, include: { teacher: true, enrollments: true } }),
   prisma.announcement.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
   canManageSchool
    ? prisma.payment.findMany({ include: { student: true }, orderBy: { dueDate: 'desc' } })
    : currentUser.role === 'PARENT'
     ? prisma.payment.findMany({ where: { student: { parentLinks: { some: { parentId: currentUser.id } } } }, include: { student: true }, orderBy: { dueDate: 'desc' } })
     : Promise.resolve([]),
   currentUser.role === 'PRINCIPAL' ? prisma.registrationLink.findMany({ include: { requests: true }, orderBy: { createdAt: 'desc' } }) : Promise.resolve([]),
   currentUser.role === 'PRINCIPAL' ? prisma.joinRequest.findMany({ include: { registrationLink: true }, orderBy: { createdAt: 'desc' } }) : Promise.resolve([]),
   canManageSchool ? prisma.user.findMany({ where: { role: 'TEACHER', status: 'ACTIVE' }, orderBy: { name: 'asc' } }) : Promise.resolve([]),
  ])

  return <DashboardClient currentUser={currentUser as any} users={users as any} students={students as any} classes={classes as any} announcements={announcements as any} payments={payments as any} registrationLinks={registrationLinks as any} joinRequests={joinRequests as any} teachers={teachers as any} />
 } catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown database error'
  return <DashboardSetupError message={message} />
 }
}
