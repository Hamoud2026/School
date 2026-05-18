import { Role } from '@prisma/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHmac, timingSafeEqual } from 'crypto'
import { prisma } from './db'

const COOKIE_NAME = 'school_session'
const maxAge = 60 * 60 * 24 * 7

function secret() {
 return process.env.NEXTAUTH_SECRET || 'dev-only-change-this-secret'
}

function sign(value: string) {
 return createHmac('sha256', secret()).update(value).digest('base64url')
}

function verify(value: string, signature: string) {
 const expected = sign(value)
 const a = Buffer.from(signature)
 const b = Buffer.from(expected)
 return a.length === b.length && timingSafeEqual(a, b)
}

export async function createSession(userId: string) {
 const value = `${userId}.${Date.now()}`
 const token = `${value}.${sign(value)}`
 const cookieStore = await cookies()
 cookieStore.set(COOKIE_NAME, token, {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge,
 })
}

export async function clearSession() {
 const cookieStore = await cookies()
 cookieStore.delete(COOKIE_NAME)
}

export async function getCurrentUser() {
 const cookieStore = await cookies()
 const token = cookieStore.get(COOKIE_NAME)?.value
 if (!token) return null

 const parts = token.split('.')
 if (parts.length !== 3) return null

 const [userId, issuedAt, signature] = parts
 if (!verify(`${userId}.${issuedAt}`, signature)) return null

 return prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, name: true, email: true, role: true, approvedAt: true, createdAt: true },
 })
}

export async function requireUser() {
 const user = await getCurrentUser()
 if (!user) redirect('/login')
 return user
}

export async function requireRole(roles: Role[]) {
 const user = await getCurrentUser()
 if (!user) return { user: null, response: Response.json({ error: 'Login required.' }, { status: 401 }) }
 if (!roles.includes(user.role)) return { user, response: Response.json({ error: 'You do not have permission for this action.' }, { status: 403 }) }
 return { user, response: null }
}
