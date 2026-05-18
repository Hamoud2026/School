import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request, { params }: { params: Promise<{ paymentId: string }> }) {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN])
 if (auth.response) return auth.response
 const { paymentId } = await params
 const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
 if (!payment) {
  return NextResponse.json({ error: 'Payment not found.' }, { status: 404 })
 }
 const updated = await prisma.payment.update({
  where: { id: paymentId },
  data: { reminderSentAt: new Date() },
 })
 return NextResponse.json({ ok: true, payment: updated })
}
