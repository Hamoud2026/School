'use client'

import { useState, type FormEvent } from 'react'

export default function JoinSchool({ params }: { params: { token: string } }) {
 const [message, setMessage] = useState('')
 const [loading, setLoading] = useState(false)

 async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  setLoading(true)
  setMessage('')
  const body = Object.fromEntries(new FormData(event.currentTarget))
  const response = await fetch(`/api/join/${params.token}`, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(body),
  })
  const result = await response.json().catch(() => ({}))
  setLoading(false)
  setMessage(response.ok ? 'Registration request sent. The school will review it.' : result.error || 'Could not send request.')
 }

 return (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
   <section className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow">
    <h1 className="text-3xl font-bold text-slate-900">Join Bright Future School</h1>
    <p className="mt-2 text-sm text-slate-600">Submit the student details and the school will place the request on the waiting list.</p>
    <form onSubmit={submit} className="mt-6 grid gap-3 md:grid-cols-2">
     <input name="parentName" placeholder="Parent full name" className="rounded-xl border p-3" required />
     <input name="parentEmail" placeholder="Parent email" type="email" className="rounded-xl border p-3" required />
     <input name="studentFirstName" placeholder="Student first name" className="rounded-xl border p-3" required />
     <input name="studentLastName" placeholder="Student last name" className="rounded-xl border p-3" required />
     <input name="studentDateOfBirth" type="date" className="rounded-xl border p-3" required />
     <textarea name="note" placeholder="Notes" className="rounded-xl border p-3 md:col-span-2" />
     <button disabled={loading} className="rounded-xl bg-violet-600 p-3 font-semibold text-white disabled:bg-violet-300 md:col-span-2">
      {loading ? 'Sending...' : 'Join waiting list'}
     </button>
     {message && <p className="text-sm text-slate-700 md:col-span-2">{message}</p>}
    </form>
   </section>
  </main>
 )
}
