import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN])
 if (auth.response) return auth.response
 return NextResponse.json(await prisma.student.findMany({ orderBy: { createdAt: 'desc' } }))
}

export async function POST(req: Request) {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN])
 if (auth.response) return auth.response
 const b = await req.json()
 const student = await prisma.student.create({
  data: {
   firstName: b.firstName,
   lastName: b.lastName,
   dateOfBirth: new Date(b.dateOfBirth),
   studentCode: b.studentCode,
   level: b.level,
  },
 })
 return NextResponse.json(student)
}
