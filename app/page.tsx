import Link from 'next/link'
import { ArrowRight, BookOpenCheck, CalendarDays, GraduationCap, ShieldCheck, Sparkles, UsersRound, type LucideIcon } from 'lucide-react'

type Metric = {
 label: string
 value: string
 Icon: LucideIcon
 color: string
}

const metrics: Metric[] = [
 { label: 'Students', value: '248', Icon: UsersRound, color: 'text-teal-600' },
 { label: 'Classes', value: '18', Icon: GraduationCap, color: 'text-blue-600' },
 { label: 'Updates', value: '96%', Icon: BookOpenCheck, color: 'text-emerald-600' },
]

const activity = [
 { title: 'Quran Level 1', note: 'Homework posted', time: '2 min ago' },
 { title: 'Arabic Level 2', note: 'Attendance complete', time: '18 min ago' },
 { title: 'Parent Portal', note: 'Payment reminder sent', time: 'Today' },
]

export default function Home() {
 return (
  <main className="min-h-screen overflow-hidden bg-[#f7f4ec] text-slate-950">
   <section className="relative min-h-screen px-6 py-6">
    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(14,116,144,0.12),rgba(245,158,11,0.12),rgba(16,185,129,0.12))]" />
    <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_30%_0%,rgba(8,145,178,0.26),transparent_34%),radial-gradient(circle_at_82%_10%,rgba(245,158,11,0.24),transparent_32%)]" />

    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between py-2">
     <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-normal text-slate-950">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-white"><Sparkles size={20} /></span>
      Bright Future
     </Link>
     <div className="flex items-center gap-2">
      <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/70">Log in</Link>
      <Link href="/register" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800">Register</Link>
     </div>
    </nav>

    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 pb-10 pt-12 lg:grid-cols-[1fr_520px] lg:pt-20">
     <div>
      <div className="home-fade-up inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/75 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
       <ShieldCheck size={17} className="text-teal-600" />
       Role-based school operations
      </div>
      <h1 className="home-fade-up mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-normal text-slate-950 md:text-7xl">
       Bright Future School Platform
      </h1>
      <p className="home-fade-up mt-6 max-w-2xl text-lg leading-8 text-slate-700">
       A focused dashboard for principals, admins, teachers, and parents to manage classes, student progress, announcements, payments, and daily learning updates.
      </p>
      <div className="home-fade-up mt-8 flex flex-wrap gap-3">
       <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800">
        Open dashboard <ArrowRight size={18} />
       </Link>
       <Link href="/register" className="rounded-lg border border-slate-300 bg-white/80 px-5 py-3 font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white">
        Create account
       </Link>
       <Link href="/join" className="rounded-lg border border-slate-300 bg-white/80 px-5 py-3 font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white">
        Student registration
       </Link>
      </div>
      <div className="home-fade-up mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
       {metrics.map(({ label, value, Icon, color }) => (
        <div key={label} className="rounded-lg border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
         <Icon className={color} size={22} />
         <p className="mt-3 text-2xl font-black">{value}</p>
         <p className="text-sm text-slate-600">{label}</p>
        </div>
       ))}
      </div>
     </div>

     <div className="home-preview relative">
      <div className="rounded-lg border border-white/80 bg-white/85 p-4 shadow-2xl shadow-slate-900/18 backdrop-blur">
       <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
         <p className="text-sm font-semibold text-slate-500">Live console</p>
         <h2 className="text-2xl font-black">Today at school</h2>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-600 text-white">
         <CalendarDays size={22} />
        </div>
       </div>

       <div className="mt-4 grid gap-3">
        {activity.map(({ title, note, time }, index) => (
         <div key={title} className="home-activity rounded-lg border border-slate-200 bg-white p-4 shadow-sm" style={{ animationDelay: `${index * 140}ms` }}>
          <div className="flex items-center justify-between gap-3">
           <div>
            <p className="font-bold">{title}</p>
            <p className="text-sm text-slate-600">{note}</p>
           </div>
           <span className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">{time}</span>
          </div>
         </div>
        ))}
       </div>

       <div className="mt-4 rounded-lg bg-slate-950 p-4 text-white">
        <div className="flex items-center justify-between">
         <p className="font-bold">Teacher update</p>
         <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/15">
         <div className="home-progress h-2 rounded-full bg-emerald-400" />
        </div>
        <p className="mt-3 text-sm text-slate-300">Homework, revision, points, and attendance synced.</p>
       </div>
      </div>
     </div>
    </div>
   </section>
  </main>
 )
}
