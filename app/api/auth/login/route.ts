import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { createSession } from '@/lib/auth'

export async function POST(req: Request) {
 try {
  const body = await req.json()
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
   return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash)
  if (!validPassword) {
   return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  await createSession(user.id)
  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } })
 } catch (error) {
  const message = error instanceof Error ? error.message : 'Login failed.'
  return NextResponse.json({ error: message }, { status: 500 })
 }
}
