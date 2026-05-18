'use client'
import { useState } from 'react'

export default function Register() {
 const [message, setMessage] = useState('')
 const [saving, setSaving] = useState(false)

 async function submit(e: React.FormEvent<HTMLFormElement>) {
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
  setMessage(response.ok ? 'Registered. Staff wait for principal approval. Parents can link child after login.' : result.error || 'Error registering')
 }

 return (
  <main className="mx-auto max-w-xl p-6">
   <h1 className="text-3xl font-bold">Create account</h1>
   <form onSubmit={submit} className="mt-6 space-y-3 rounded-3xl bg-white p-6 shadow">
    <input name="name" placeholder="Full name" className="w-full rounded-xl border p-3" required />
    <input name="email" placeholder="Email" type="email" className="w-full rounded-xl border p-3" required />
    <input name="password" placeholder="Password" type="password" className="w-full rounded-xl border p-3" required minLength={6} />
    <select name="requestedRole" className="w-full rounded-xl border p-3" defaultValue="PARENT">
     <option value="PARENT">Parent</option>
     <option value="TEACHER">Teacher</option>
     <option value="ADMIN">Admin</option>
    </select>
    <button disabled={saving} className="w-full rounded-xl bg-violet-600 p-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-violet-300">
     {saving ? 'Registering...' : 'Register'}
    </button>
    {message && <p className="text-sm text-slate-700">{message}</p>}
   </form>
  </main>
 )
}
