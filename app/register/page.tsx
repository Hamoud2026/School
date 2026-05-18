'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'

export default function Register() {
 const [message, setMessage] = useState('')
 const [saving, setSaving] = useState(false)

 async function submit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setSaving(true)
  setMessage('')

  const data = Object.fromEntries(new FormData(e.currentTarget))
  const response = await fetch('/api/auth/register', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(data),
  })
  const result = await response.json().catch(() => ({}))

  setSaving(false)
  setMessage(response.ok ? 'Registered. You can log in now, but the principal must assign your role before your dashboard opens.' : result.error || 'Error registering')
 }

 return (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
   <section className="w-full max-w-xl rounded-2xl bg-white p-6 shadow">
   <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
   <p className="mt-2 text-sm text-slate-600">The principal assigns your role after registration.</p>
   <form onSubmit={submit} className="mt-6 space-y-3 rounded-3xl bg-white p-6 shadow">
    <input name="name" placeholder="Full name" className="w-full rounded-xl border p-3" required />
    <input name="email" placeholder="Email" type="email" className="w-full rounded-xl border p-3" required />
    <input name="password" placeholder="Password" type="password" className="w-full rounded-xl border p-3" required minLength={6} />
    <button disabled={saving} className="w-full rounded-xl bg-violet-600 p-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-violet-300">
     {saving ? 'Registering...' : 'Register'}
    </button>
    {message && <p className="text-sm text-slate-700">{message}</p>}
   </form>
   <p className="mt-4 text-sm text-slate-600">
    Already registered? <Link href="/login" className="font-semibold text-violet-700">Log in</Link>
   </p>
   </section>
  </main>
 )
}
