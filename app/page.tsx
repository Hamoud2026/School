import Link from 'next/link'

export default function Home() {
 return (
  <main className="min-h-screen bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700 p-6 text-white">
   <div className="mx-auto max-w-5xl py-20">
    <h1 className="text-5xl font-bold">Bright Future School Platform</h1>
    <p className="mt-4 max-w-2xl text-lg text-violet-100">Manage students, teachers, parents, homework, payments, announcements and class progress from one full-stack platform.</p>
    <div className="mt-8 flex flex-wrap gap-3">
     <Link href="/login" className="rounded-xl bg-white px-5 py-3 font-semibold text-violet-700">Log in</Link>
     <Link href="/register" className="rounded-xl bg-white/10 px-5 py-3 font-semibold">Register</Link>
    </div>
   </div>
  </main>
 )
}
