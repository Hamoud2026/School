import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
 try {
  const body = await req.json()
  const email = String(body.email || '').trim().toLowerCase()
  const name = String(body.name || '').trim()
  const password = String(body.password || '')

  if (!name || !email || password.length < 6) {
   return NextResponse.json({ error: 'Enter a name, valid email, and password with at least 6 characters.' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
   return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, passwordHash: hash, role: 'PENDING', status: 'ACTIVE' } })

  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } })
 } catch (error) {
  const message = error instanceof Error ? error.message : 'Registration failed'
  return NextResponse.json({ error: message }, { status: 500 })
 }
}
