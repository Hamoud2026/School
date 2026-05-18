import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST() {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN])
 if (auth.response) return auth.response

 const result = await prisma.payment.updateMany({
  where: { status: { in: ['DUE', 'OVERDUE'] } },
  data: { reminderSentAt: new Date() },
 })
 return NextResponse.json({ ok: true, reminded: result.count })
}
