import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

const assignableRoles = [Role.ADMIN, Role.TEACHER, Role.PARENT]

export async function POST(req: Request) {
 const auth = await requireRole([Role.PRINCIPAL])
 if (auth.response) return auth.response

 const { userId, role } = await req.json()
 if (!assignableRoles.includes(role)) {
  return NextResponse.json({ error: 'Principal can assign Admin, Teacher, or Parent roles.' }, { status: 400 })
 }

 const user = await prisma.user.update({
  where: { id: userId },
  data: { role, requestedRole: null, approvedAt: new Date() },
 })
 return NextResponse.json({ ok: true, user })
}
