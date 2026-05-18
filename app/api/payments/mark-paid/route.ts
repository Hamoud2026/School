import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN])
 if (auth.response) return auth.response
 const body = await req.json().catch(() => ({}))
 if (body.paymentId) {
  const payment = await prisma.payment.findUnique({ where: { id: body.paymentId } })
  if (!payment) {
   return NextResponse.json({ error: 'Payment not found.' }, { status: 404 })
  }
  const updated = await prisma.payment.update({
   where: { id: body.paymentId },
   data: { status: 'PAID', confirmedAt: new Date() },
  })
  return NextResponse.json({ ok: true, payment: updated })
 }
 const result = await prisma.payment.updateMany({
  where: { status: { in: ['DUE', 'OVERDUE', 'PENDING'] } },
  data: { status: 'PAID', confirmedAt: new Date() },
 })
 return NextResponse.json({ ok: true, updated: result.count })
}
