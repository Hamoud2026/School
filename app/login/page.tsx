'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
 const router = useRouter()
 const [message, setMessage] = useState('')
 const [loading, setLoading] = useState(false)

 async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  setLoading(true)
  setMessage('')

  const data = Object.fromEntries(new FormData(event.currentTarget))
  const response = await fetch('/api/auth/login', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(data),
  })
  const result = await response.json().catch(() => ({}))

  setLoading(false)
  if (!response.ok) {
   setMessage(result.error || 'Login failed.')
   return
  }

  router.push('/dashboard')
  router.refresh()
 }

 return (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
   <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
    <h1 className="text-3xl font-bold text-slate-900">Log in</h1>
    <p className="mt-2 text-sm text-slate-600">Use the email and password you registered with.</p>
    <form onSubmit={submit} className="mt-6 space-y-3">
     <input name="email" placeholder="Email" type="email" className="w-full rounded-xl border p-3" required />
     <input name="password" placeholder="Password" type="password" className="w-full rounded-xl border p-3" required />
     <button disabled={loading} className="w-full rounded-xl bg-violet-600 p-3 font-semibold text-white disabled:bg-violet-300">
      {loading ? 'Logging in...' : 'Log in'}
     </button>
     {message && <p className="text-sm text-red-600">{message}</p>}
    </form>
    <p className="mt-4 text-sm text-slate-600">
     No account yet? <Link href="/register" className="font-semibold text-violet-700">Register</Link>
    </p>
   </section>
  </main>
 )
}
