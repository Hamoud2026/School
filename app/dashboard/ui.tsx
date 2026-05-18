'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { Baby, BadgeCheck, CalendarDays, ClipboardCheck, CreditCard, GraduationCap, Home, LogOut, Megaphone, Receipt, ShieldCheck, UserCog, Users } from 'lucide-react'

const roleMenus = {
 PRINCIPAL: ['dashboard', 'roles', 'students', 'classes', 'teacher', 'payments', 'announcements'],
 ADMIN: ['dashboard', 'students', 'classes', 'payments', 'announcements'],
 TEACHER: ['dashboard', 'classes', 'teacher', 'announcements'],
 PARENT: ['dashboard', 'parent', 'payments', 'announcements'],
 PENDING: ['dashboard'],
}

const menuItems = [
 ['dashboard', 'Dashboard', Home],
 ['roles', 'Assign Roles', UserCog],
 ['parent', 'Parent Link', Baby],
 ['students', 'Students', Users],
 ['classes', 'Classes', GraduationCap],
 ['teacher', 'Teacher Update', ClipboardCheck],
 ['payments', 'Payments', CreditCard],
 ['announcements', 'Announcements', Megaphone],
] as const

export default function DashboardClient({ currentUser, users, students, classes, announcements, payments }: any) {
 const allowedIds = roleMenus[currentUser.role as keyof typeof roleMenus] || roleMenus.PENDING
 const visibleMenu = useMemo(() => menuItems.filter(([id]) => allowedIds.includes(id)), [allowedIds])
 const [active, setActive] = useState(visibleMenu[0]?.[0] || 'dashboard')
 const [found, setFound] = useState<any>(null)

 async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  location.href = '/login'
 }

 async function approve(id: string, role: string) {
  const response = await fetch('/api/roles/approve', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ userId: id, role }),
  })
  if (response.ok) location.reload()
 }

 async function link(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.currentTarget))
  const response = await fetch('/api/students/link', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(data),
  })
  setFound(await response.json())
 }

 async function teacherUpdate(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.currentTarget))
  await fetch('/api/class-update', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(data),
  })
  location.reload()
 }

 return (
  <div className="min-h-screen bg-slate-50">
   <header className="bg-gradient-to-r from-violet-700 to-blue-700 p-5 text-white">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
     <div>
      <h1 className="text-2xl font-bold">Bright Future School Platform</h1>
      <p className="text-violet-100">{currentUser.name || currentUser.email} · {currentUser.role}</p>
     </div>
     <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 font-semibold hover:bg-white/20">
      <LogOut size={18} /> Log out
     </button>
    </div>
   </header>

   <div className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-[260px_1fr]">
    <aside className="rounded-2xl bg-white p-4 shadow">
     <div className="mb-4 flex gap-2"><ShieldCheck /> <b>School Console</b></div>
     {visibleMenu.map(([id, label, Icon]) => (
      <button key={id} onClick={() => setActive(id)} className={`mb-1 flex w-full gap-2 rounded-xl p-3 text-left ${active === id ? 'bg-violet-50 text-violet-700' : 'hover:bg-slate-50'}`}>
       <Icon size={18} /> {label}
      </button>
     ))}
    </aside>

    <main className="space-y-5">
     <section className="rounded-2xl bg-white p-5 shadow">
      <h2 className="text-xl font-bold capitalize">{active}</h2>
      <p className="text-sm text-slate-500">This view is limited to your assigned role.</p>
     </section>

     {active === 'dashboard' && (
      <div className="grid gap-4 md:grid-cols-4">
       {[[Users, 'Students', students.length], [GraduationCap, 'Classes', classes.length], [UserCog, 'Pending roles', users.filter((u: any) => u.role === 'PENDING').length], [Receipt, 'Payments', payments.length]].map(([Icon, label, value]: any) => (
        <div key={label} className="rounded-2xl bg-white p-5 shadow">
         <Icon className="text-violet-700" />
         <p className="mt-3 text-sm text-slate-500">{label}</p>
         <p className="text-3xl font-bold">{value}</p>
        </div>
       ))}
      </div>
     )}

     {active === 'roles' && (
      <section className="rounded-2xl bg-white p-5 shadow">
       <h3 className="font-bold">Principal assigns account roles</h3>
       <div className="mt-4 grid gap-3 md:grid-cols-3">
        {users.filter((u: any) => u.role === 'PENDING').map((u: any) => (
         <div key={u.id} className="rounded-2xl border p-4">
          <b>{u.name}</b>
          <p className="text-sm">{u.email}</p>
          <div className="mt-3 flex flex-wrap gap-2">
           <button onClick={() => approve(u.id, 'PARENT')} className="rounded-xl bg-violet-600 px-3 py-2 text-white">Parent</button>
           <button onClick={() => approve(u.id, 'TEACHER')} className="rounded-xl bg-emerald-600 px-3 py-2 text-white">Teacher</button>
           <button onClick={() => approve(u.id, 'ADMIN')} className="rounded-xl bg-blue-600 px-3 py-2 text-white">Admin</button>
          </div>
         </div>
        ))}
       </div>
      </section>
     )}

     {active === 'parent' && (
      <section className="grid gap-5 md:grid-cols-2">
       <form onSubmit={link} className="space-y-3 rounded-2xl bg-white p-5 shadow">
        <h3 className="font-bold">Parent link child</h3>
        <input name="firstName" placeholder="First name e.g. Lina" className="w-full rounded-xl border p-3" />
        <input name="dateOfBirth" placeholder="DOB YYYY-MM-DD" className="w-full rounded-xl border p-3" />
        <input name="studentCode" placeholder="Student code" className="w-full rounded-xl border p-3" />
        <button className="w-full rounded-xl bg-violet-600 p-3 text-white">Find child</button>
       </form>
       <div className="rounded-2xl bg-white p-5 shadow">
        {found?.student ? <><BadgeCheck className="text-emerald-600" /><h3 className="text-xl font-bold">{found.student.firstName} {found.student.lastName}</h3><p>Progress: {found.latest?.score ?? 0}%</p><p>Points: {found.latest?.points ?? 0}</p><p>Homework: {found.latest?.homework ?? 'No homework'}</p></> : <p>Search result will appear here.</p>}
       </div>
      </section>
     )}

     {active === 'students' && <section className="rounded-2xl bg-white p-5 shadow"><h3 className="font-bold">Students</h3>{students.map((s: any) => <div key={s.id} className="mt-3 rounded-2xl border p-4"><b>{s.firstName} {s.lastName}</b><p>{s.studentCode} · {new Date(s.dateOfBirth).toLocaleDateString()}</p><p>Latest homework: {s.classUpdates[0]?.homework || 'None'}</p></div>)}</section>}
     {active === 'classes' && <section className="rounded-2xl bg-white p-5 shadow"><h3 className="font-bold">Classes</h3>{classes.map((c: any) => <div key={c.id} className="mt-3 rounded-2xl border p-4"><CalendarDays /><b>{c.name}</b><p>{c.level} · {c.schedule}</p><p>Teacher: {c.teacher?.name || 'Not assigned'} · Students: {c.enrollments.length}</p></div>)}</section>}
     {active === 'teacher' && <form onSubmit={teacherUpdate} className="space-y-3 rounded-2xl bg-white p-5 shadow"><h3 className="font-bold">Teacher class update</h3><select name="classId" className="w-full rounded-xl border p-3">{classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><select name="studentId" className="w-full rounded-xl border p-3">{students.map((s: any) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}</select><input name="homework" placeholder="Homework" className="w-full rounded-xl border p-3" /><input name="revision" placeholder="Revision" className="w-full rounded-xl border p-3" /><input name="score" placeholder="Score" className="w-full rounded-xl border p-3" /><input name="points" placeholder="Points" className="w-full rounded-xl border p-3" /><button className="w-full rounded-xl bg-violet-600 p-3 text-white">Save update</button></form>}
     {active === 'payments' && <section className="rounded-2xl bg-white p-5 shadow"><h3 className="font-bold">Payments</h3>{payments.map((p: any) => <div key={p.id} className="mt-3 rounded-2xl border p-4"><b>{p.student.firstName} {p.student.lastName}</b><p>Amount: ${(p.amount / 100).toFixed(2)} · Status: {p.status}</p></div>)}</section>}
     {active === 'announcements' && <section className="rounded-2xl bg-white p-5 shadow"><h3 className="font-bold">Announcements</h3>{announcements.map((a: any) => <div key={a.id} className="mt-3 rounded-2xl border p-4"><b>{a.title}</b><p>{a.body}</p></div>)}</section>}
    </main>
   </div>
  </div>
 )
}
