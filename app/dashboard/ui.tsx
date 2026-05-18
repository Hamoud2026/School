'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { Baby, Ban, CalendarDays, ClipboardCheck, CreditCard, FileSpreadsheet, GraduationCap, Home, LinkIcon, LogOut, Megaphone, Receipt, ShieldCheck, Trash2, UserCog, Users } from 'lucide-react'

const roleMenus = {
 PRINCIPAL: ['dashboard', 'roles', 'accounts', 'links', 'students', 'classes', 'payments', 'announcements'],
 ADMIN: ['dashboard', 'students', 'classes', 'payments', 'announcements'],
 TEACHER: ['dashboard', 'classes', 'teacher', 'announcements'],
 PARENT: ['dashboard', 'parent', 'payments', 'announcements'],
 PENDING: ['dashboard'],
}

const menuItems = [
 ['dashboard', 'Dashboard', Home],
 ['roles', 'Assign Roles', UserCog],
 ['accounts', 'Accounts', ShieldCheck],
 ['links', 'Join Links', LinkIcon],
 ['parent', 'Parent Link', Baby],
 ['students', 'Students', Users],
 ['classes', 'Classes', GraduationCap],
 ['teacher', 'Teacher Tools', ClipboardCheck],
 ['payments', 'Payments', CreditCard],
 ['announcements', 'Announcements', Megaphone],
] as const

async function postJson(url: string, body: any, method = 'POST') {
 const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
 const result = await response.json().catch(() => ({}))
 if (!response.ok) alert(result.error || 'Action failed')
 return response.ok
}

export default function DashboardClient({ currentUser, users, students, classes, announcements, payments, registrationLinks, joinRequests, teachers }: any) {
 const allowedIds = roleMenus[currentUser.role as keyof typeof roleMenus] || roleMenus.PENDING
 const visibleMenu = useMemo(() => menuItems.filter(([id]) => allowedIds.includes(id)), [allowedIds])
 const [active, setActive] = useState(visibleMenu[0]?.[0] || 'dashboard')
 const [found, setFound] = useState<any>(null)

 async function refreshIfOk(ok: boolean) {
  if (ok) location.reload()
 }

 async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  location.href = '/login'
 }

 async function submitJson(event: FormEvent<HTMLFormElement>, url: string, method = 'POST') {
  event.preventDefault()
  await refreshIfOk(await postJson(url, Object.fromEntries(new FormData(event.currentTarget)), method))
 }

 async function importStudents(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const form = new FormData(event.currentTarget)
  const response = await fetch('/api/students/import', { method: 'POST', body: form })
  const result = await response.json().catch(() => ({}))
  alert(response.ok ? `Imported ${result.imported} students` : result.error || 'Import failed')
  if (response.ok) location.reload()
 }

 async function linkChild(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const response = await fetch('/api/students/link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) })
  setFound(await response.json())
 }

 return (
  <div className="min-h-screen bg-slate-50">
   <header className="bg-slate-950 p-5 text-white">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
     <div>
      <h1 className="text-2xl font-bold">Bright Future School Platform</h1>
      <p className="text-slate-300">{currentUser.name || currentUser.email} - {currentUser.role}</p>
     </div>
     <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-semibold hover:bg-white/20"><LogOut size={18} /> Log out</button>
    </div>
   </header>

   <div className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-[260px_1fr]">
    <aside className="rounded-lg bg-white p-4 shadow">
     <div className="mb-4 flex gap-2"><ShieldCheck /> <b>School Console</b></div>
     {visibleMenu.map(([id, label, Icon]) => (
      <button key={id} onClick={() => setActive(id)} className={`mb-1 flex w-full gap-2 rounded-lg p-3 text-left ${active === id ? 'bg-violet-50 text-violet-700' : 'hover:bg-slate-50'}`}>
       <Icon size={18} /> {label}
      </button>
     ))}
    </aside>

    <main className="space-y-5">
     <section className="rounded-lg bg-white p-5 shadow">
      <h2 className="text-xl font-bold capitalize">{active}</h2>
      <p className="text-sm text-slate-500">Actions and data are limited by role.</p>
     </section>

     {active === 'dashboard' && <DashboardSummary users={users} students={students} classes={classes} payments={payments} joinRequests={joinRequests} />}
     {active === 'roles' && <RolePanel users={users} currentUser={currentUser} />}
     {active === 'accounts' && <AccountsPanel users={users} currentUser={currentUser} />}
     {active === 'links' && <LinksPanel registrationLinks={registrationLinks} joinRequests={joinRequests} />}
     {active === 'students' && <StudentsPanel students={students} importStudents={importStudents} submitJson={submitJson} />}
     {active === 'classes' && <ClassesPanel classes={classes} teachers={teachers} submitJson={submitJson} />}
     {active === 'teacher' && <TeacherPanel classes={classes} students={students} submitJson={submitJson} />}
     {active === 'parent' && <ParentPanel found={found} linkChild={linkChild} students={students} />}
     {active === 'payments' && <PaymentsPanel payments={payments} students={students} role={currentUser.role} submitJson={submitJson} />}
     {active === 'announcements' && <AnnouncementsPanel announcements={announcements} role={currentUser.role} submitJson={submitJson} />}
    </main>
   </div>
  </div>
 )
}

function DashboardSummary({ users, students, classes, payments, joinRequests }: any) {
 const cards = [[Users, 'Students', students.length], [GraduationCap, 'Classes', classes.length], [Receipt, 'Payments', payments.length], [UserCog, 'Waiting', users.filter((u: any) => u.role === 'PENDING').length + joinRequests.filter((r: any) => r.status === 'WAITING').length]]
 return <div className="grid gap-4 md:grid-cols-4">{cards.map(([Icon, label, value]: any) => <div key={label} className="rounded-lg bg-white p-5 shadow"><Icon className="text-violet-700" /><p className="mt-3 text-sm text-slate-500">{label}</p><p className="text-3xl font-bold">{value}</p></div>)}</div>
}

function RolePanel({ users, currentUser }: any) {
 const roles = ['PENDING', 'PARENT', 'TEACHER', 'ADMIN']
 return <section className="rounded-lg bg-white p-5 shadow"><h3 className="font-bold">Manage user roles</h3><p className="mt-2 text-sm text-slate-500">Principal can assign or change roles at any time.</p><div className="mt-4 grid gap-3 md:grid-cols-3">{users.filter((u: any) => u.id !== currentUser.id).map((u: any) => <div key={u.id} className="rounded-lg border p-4"><b>{u.name || 'Unnamed'}</b><p className="text-sm">{u.email}</p><p className="text-sm">{u.role} - {u.status}</p><div className="mt-3 flex flex-wrap gap-2">{roles.map(role => <button key={role} onClick={() => postJson('/api/roles/approve', { userId: u.id, role }).then(ok => ok && location.reload())} disabled={u.role === role} className={`rounded-lg px-3 py-2 text-sm text-white ${u.role === role ? 'bg-slate-300 text-slate-700 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-700'}`}>{role}</button>)}</div></div>)}</div></section>
}

function AccountsPanel({ users, currentUser }: any) {
 return <section className="rounded-lg bg-white p-5 shadow"><h3 className="font-bold">Block or delete accounts</h3><div className="mt-4 grid gap-3 md:grid-cols-2">{users.filter((u: any) => u.id !== currentUser.id).map((u: any) => <div key={u.id} className="rounded-lg border p-4"><b>{u.name || 'Unnamed'}</b><p className="text-sm">{u.email}</p><p className="text-sm">{u.role} - {u.status}</p><div className="mt-3 flex gap-2"><button onClick={() => postJson('/api/accounts', { userId: u.id, action: u.status === 'BLOCKED' ? 'unblock' : 'block' }, 'PATCH').then(ok => ok && location.reload())} className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-2 text-sm text-white"><Ban size={15} />{u.status === 'BLOCKED' ? 'Unblock' : 'Block'}</button><button onClick={() => confirm('Delete this account?') && postJson('/api/accounts', { userId: u.id }, 'DELETE').then(ok => ok && location.reload())} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm text-white"><Trash2 size={15} />Delete</button></div></div>)}</div></section>
}

function LinksPanel({ registrationLinks, joinRequests }: any) {
 return <section className="space-y-5"><form onSubmit={(event) => { event.preventDefault(); postJson('/api/registration-links', Object.fromEntries(new FormData(event.currentTarget))).then(ok => ok && location.reload()) }} className="grid gap-3 rounded-lg bg-white p-5 shadow md:grid-cols-3"><h3 className="font-bold md:col-span-3">Create public registration link</h3><input name="title" placeholder="Link title" className="rounded-lg border p-3 md:col-span-2" /><input name="expiresAt" type="date" className="rounded-lg border p-3" /><button className="rounded-lg bg-violet-600 p-3 font-semibold text-white md:col-span-3">Create link</button></form><section className="rounded-lg bg-white p-5 shadow"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold">Registration links</h3><a href="/join-requests/export" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Export join requests</a></div>{registrationLinks.map((l: any) => <div key={l.id} className="mt-3 rounded-lg border p-4"><b>{l.title}</b><p className="break-all text-sm text-slate-600">/join/{l.token}</p><p className="text-sm">{l.requests.length} requests</p></div>)}</section><section className="rounded-lg bg-white p-5 shadow"><h3 className="font-bold">Waiting list</h3>{joinRequests.map((r: any) => <div key={r.id} className="mt-3 rounded-lg border p-4"><b>{r.studentFirstName} {r.studentLastName}</b><p className="text-sm">Parent: {r.parentName} - {r.parentEmail}</p><p className="text-sm">Status: {r.status}</p></div>)}</section></section>
}

function StudentsPanel({ students, importStudents, submitJson }: any) {
 return <section className="space-y-5"><form onSubmit={(event) => submitJson(event, '/api/students')} className="grid gap-3 rounded-lg bg-white p-5 shadow md:grid-cols-2"><h3 className="font-bold md:col-span-2">Add student</h3><input name="firstName" placeholder="First name" className="rounded-lg border p-3" required /><input name="lastName" placeholder="Last name" className="rounded-lg border p-3" required /><input name="dateOfBirth" type="date" className="rounded-lg border p-3" required /><input name="studentCode" placeholder="Student code" className="rounded-lg border p-3" required /><input name="level" placeholder="Level" className="rounded-lg border p-3 md:col-span-2" /><button className="rounded-lg bg-violet-600 p-3 font-semibold text-white md:col-span-2">Add student</button></form><form onSubmit={importStudents} className="rounded-lg bg-white p-5 shadow"><h3 className="flex items-center gap-2 font-bold"><FileSpreadsheet size={18} /> Import Excel</h3><p className="mt-1 text-sm text-slate-500">Columns: firstName, lastName, dateOfBirth, studentCode, level</p><input name="file" type="file" accept=".xlsx,.xls" className="mt-4 w-full rounded-lg border p-3" required /><button className="mt-3 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white">Import students</button></form><section className="rounded-lg bg-white p-5 shadow"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold">Students</h3><a href="/api/students/export" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Export students</a></div>{students.map((s: any) => <div key={s.id} className="mt-3 rounded-lg border p-4"><b>{s.firstName} {s.lastName}</b><p className="text-sm">{s.studentCode} - {s.level || 'No level'}</p><p className="text-sm">Latest homework: {s.classUpdates[0]?.homework || 'None'}</p></div>)}</section></section>
}

function ClassesPanel({ classes, teachers, submitJson }: any) {
 return <section className="space-y-5"><form onSubmit={(event) => submitJson(event, '/api/classes')} className="grid gap-3 rounded-lg bg-white p-5 shadow md:grid-cols-2"><h3 className="font-bold md:col-span-2">Create class</h3><input name="name" placeholder="Class name" className="rounded-lg border p-3" required /><input name="level" placeholder="Level" className="rounded-lg border p-3" required /><input name="schedule" placeholder="Schedule" className="rounded-lg border p-3" /><select name="teacherId" className="rounded-lg border p-3"><option value="">Assign teacher later</option>{teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name || t.email}</option>)}</select><button className="rounded-lg bg-violet-600 p-3 font-semibold text-white md:col-span-2">Create class</button></form><section className="rounded-lg bg-white p-5 shadow"><h3 className="font-bold">Classes</h3>{classes.map((c: any) => <div key={c.id} className="mt-3 rounded-lg border p-4"><CalendarDays /><b>{c.name}</b><p>{c.level} - {c.schedule}</p><p>Teacher: {c.teacher?.name || 'Not assigned'} - Students: {c.enrollments.length}</p></div>)}</section></section>
}

function TeacherPanel({ classes, students, submitJson }: any) {
 return <form onSubmit={(event) => submitJson(event, '/api/class-update')} className="grid gap-3 rounded-lg bg-white p-5 shadow md:grid-cols-2"><h3 className="font-bold md:col-span-2">Attendance, homework, score, stamps, and parent note</h3><select name="classId" className="rounded-lg border p-3">{classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><select name="studentId" className="rounded-lg border p-3">{students.map((s: any) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}</select><select name="attendance" className="rounded-lg border p-3"><option>PRESENT</option><option>ABSENT</option><option>LATE</option><option>EXCUSED</option></select><input name="score" placeholder="Score" className="rounded-lg border p-3" /><input name="points" placeholder="Points" className="rounded-lg border p-3" /><input name="stamps" placeholder="Stamps" className="rounded-lg border p-3" /><input name="homeworkPhotoUrl" placeholder="Homework photo URL" className="rounded-lg border p-3 md:col-span-2" /><textarea name="homework" placeholder="Homework" className="rounded-lg border p-3 md:col-span-2" /><textarea name="revision" placeholder="Revision" className="rounded-lg border p-3 md:col-span-2" /><textarea name="privateNote" placeholder="Message or note for parent" className="rounded-lg border p-3 md:col-span-2" /><button className="rounded-lg bg-violet-600 p-3 font-semibold text-white md:col-span-2">Save class update</button></form>
}

function ParentPanel({ found, linkChild, students }: any) {
 return <section className="space-y-5"><form onSubmit={linkChild} className="grid gap-3 rounded-lg bg-white p-5 shadow md:grid-cols-3"><h3 className="font-bold md:col-span-3">Link child</h3><input name="firstName" placeholder="First name" className="rounded-lg border p-3" /><input name="dateOfBirth" type="date" className="rounded-lg border p-3" /><input name="studentCode" placeholder="Student code" className="rounded-lg border p-3" /><button className="rounded-lg bg-violet-600 p-3 font-semibold text-white md:col-span-3">Find child</button></form>{found?.student && <div className="rounded-lg bg-white p-5 shadow"><b>{found.student.firstName} {found.student.lastName}</b><p>Homework: {found.latest?.homework || 'No homework'}</p><p>Revision: {found.latest?.revision || 'No revision'}</p><p>Points: {found.latest?.points || 0}</p></div>}<section className="rounded-lg bg-white p-5 shadow"><h3 className="font-bold">My children</h3>{students.map((s: any) => <div key={s.id} className="mt-3 rounded-lg border p-4"><b>{s.firstName} {s.lastName}</b><p>Homework: {s.classUpdates[0]?.homework || 'No homework'}</p><p>Revision: {s.classUpdates[0]?.revision || 'No revision'}</p></div>)}</section></section>
}

function PaymentsPanel({ payments, students, role, submitJson }: any) {
 return <section className="space-y-5"><div className="rounded-lg bg-white p-5 shadow">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div>
    <h3 className="font-bold">Payments</h3>
    <p className="text-sm text-slate-500">Parents can upload evidence, and admins can approve or mark payments paid.</p>
   </div>
   {role !== 'PARENT' && <div className="flex flex-wrap gap-2">
    <button onClick={() => postJson('/api/payments/remind', {}).then(ok => ok && location.reload())} className="rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white">Remind all due payments</button>
    <button onClick={() => postJson('/api/payments/mark-paid', {}).then(ok => ok && location.reload())} className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white">Mark due/overdue paid</button>
   </div>}
  </div>
 </div>
 {role !== 'PARENT' && <form onSubmit={(event) => submitJson(event, '/api/payments')} className="grid gap-3 rounded-lg bg-white p-5 shadow md:grid-cols-2"><h3 className="font-bold md:col-span-2">Create payment</h3><select name="studentId" className="rounded-lg border p-3">{students.map((s: any) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}</select><input name="amount" placeholder="Amount in cents" className="rounded-lg border p-3" /><input name="dueDate" type="date" className="rounded-lg border p-3" /><select name="status" className="rounded-lg border p-3"><option>DUE</option><option>PAID</option><option>OVERDUE</option></select><button className="rounded-lg bg-violet-600 p-3 font-semibold text-white md:col-span-2">Create payment</button></form>}
 {payments.map((p: any) => <div key={p.id} className="rounded-lg bg-white p-5 shadow"><div className="flex flex-wrap items-center justify-between gap-3"><div><b>{p.student.firstName} {p.student.lastName}</b><p className="text-sm text-slate-500">Amount: ${(p.amount / 100).toFixed(2)} · Status: {p.status} · Due: {new Date(p.dueDate).toLocaleDateString()}</p></div><div className="flex flex-wrap gap-2">{role !== 'PARENT' && p.status !== 'PAID' && <button onClick={() => postJson('/api/payments/mark-paid', { paymentId: p.id }).then(ok => ok && location.reload())} className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white">Mark paid</button>}{role !== 'PARENT' && <button onClick={() => postJson(`/api/payments/remind/${p.id}`, {}).then(ok => ok && location.reload())} className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white">Send reminder</button>}{role !== 'PARENT' && p.status === 'PENDING' && <button onClick={() => postJson('/api/payments/approve', { paymentId: p.id }).then(ok => ok && location.reload())} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Approve evidence</button>}</div></div>
  {p.receiptUrl ? <p className="mt-3 text-sm">Evidence: <a href={p.receiptUrl} target="_blank" className="text-violet-700 hover:underline">View receipt</a></p> : <p className="mt-3 text-sm text-slate-500">No receipt uploaded yet.</p>}
  {p.evidenceNote && <p className="mt-2 text-sm">Note: {p.evidenceNote}</p>}
  {p.confirmedAt && <p className="mt-2 text-sm text-slate-500">Confirmed: {new Date(p.confirmedAt).toLocaleDateString()}</p>}
  {p.reminderSentAt && <p className="mt-2 text-sm text-slate-500">Reminder sent: {new Date(p.reminderSentAt).toLocaleDateString()}</p>}
  {role === 'PARENT' && p.status !== 'PAID' && <form onSubmit={(event) => submitJson(event, '/api/payments')} className="mt-4 grid gap-2"><input type="hidden" name="paymentId" value={p.id} /><input name="receiptUrl" placeholder="Evidence URL" className="rounded-lg border p-3" /><textarea name="evidenceNote" placeholder="Evidence note" className="rounded-lg border p-3" /><button className="rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white">Upload payment evidence</button></form>}
  {role === 'PARENT' && p.status === 'PENDING' && <p className="mt-3 text-sm text-amber-700">Evidence submitted — waiting for admin approval.</p>}
  {role === 'PARENT' && p.status === 'PAID' && <p className="mt-3 text-sm text-emerald-700">Payment completed.</p>}
 </div>)}
 </section>
}

function AnnouncementsPanel({ announcements, role, submitJson }: any) {
 const canPost = role === 'PRINCIPAL' || role === 'ADMIN'
 return <section className="space-y-5">{canPost && <form onSubmit={(event) => submitJson(event, '/api/announcements')} className="grid gap-3 rounded-lg bg-white p-5 shadow"><h3 className="font-bold">Announce to users</h3><input name="title" placeholder="Title" className="rounded-lg border p-3" required /><textarea name="body" placeholder="Announcement" className="rounded-lg border p-3" required /><select name="audience" className="rounded-lg border p-3"><option>ALL</option><option>PARENTS</option><option>TEACHERS</option></select><button className="rounded-lg bg-violet-600 p-3 font-semibold text-white">Publish</button></form>}<section className="rounded-lg bg-white p-5 shadow"><h3 className="font-bold">Announcements</h3>{announcements.map((a: any) => <div key={a.id} className="mt-3 rounded-lg border p-4"><b>{a.title}</b><p>{a.body}</p><p className="text-sm text-slate-500">{a.audience}</p></div>)}</section></section>
}
