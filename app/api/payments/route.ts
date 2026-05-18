import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN, Role.PARENT])
 if (auth.response) return auth.response
 const where = auth.user!.role === Role.PARENT ? { student: { parentLinks: { some: { parentId: auth.user!.id } } } } : {}
 return NextResponse.json(await prisma.payment.findMany({ where, include: { student: true } }))
}

export async function POST(req: Request) {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN, Role.PARENT])
 if (auth.response) return auth.response
 const b = await req.json()

 if (auth.user!.role === Role.PARENT) {
  const belongsToParent = await prisma.payment.findFirst({
   where: { id: b.paymentId, student: { parentLinks: { some: { parentId: auth.user!.id } } } },
  })
  if (!belongsToParent) {
   return NextResponse.json({ error: 'Payment not found for your children.' }, { status: 404 })
  }

  const payment = await prisma.payment.update({
   where: { id: b.paymentId },
   data: { receiptUrl: b.receiptUrl, evidenceNote: b.evidenceNote, status: 'PENDING' },
  })
  return NextResponse.json(payment)
 }

 const payment = await prisma.payment.create({
  data: { studentId: b.studentId, amount: Number(b.amount), dueDate: new Date(b.dueDate), status: b.status || 'DUE', receiptUrl: b.receiptUrl },
 })
 return NextResponse.json(payment)
}
