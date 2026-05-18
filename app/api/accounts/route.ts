import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(req: Request) {
 const auth = await requireRole([Role.PRINCIPAL])
 if (auth.response) return auth.response

 const { userId, action } = await req.json()
 if (userId === auth.user!.id) {
  return NextResponse.json({ error: 'You cannot change your own principal account from here.' }, { status: 400 })
 }

 const data = action === 'block'
  ? { status: 'BLOCKED' as const, blockedAt: new Date() }
  : { status: 'ACTIVE' as const, blockedAt: null }

 const user = await prisma.user.update({ where: { id: userId }, data })
 return NextResponse.json({ ok: true, user })
}

export async function DELETE(req: Request) {
 const auth = await requireRole([Role.PRINCIPAL])
 if (auth.response) return auth.response

 const { userId } = await req.json()
 if (userId === auth.user!.id) {
  return NextResponse.json({ error: 'You cannot delete your own principal account.' }, { status: 400 })
 }

 await prisma.user.delete({ where: { id: userId } })
 return NextResponse.json({ ok: true })
}
