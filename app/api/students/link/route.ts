import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
 const auth = await requireRole([Role.PARENT])
 if (auth.response) return auth.response

 const b = await req.json()
 const dob = new Date(b.dateOfBirth)
 const where: any = { firstName: { equals: b.firstName }, dateOfBirth: dob }
 if (b.studentCode) where.studentCode = b.studentCode

 const student = await prisma.student.findFirst({ where, include: { classUpdates: { orderBy: { date: 'desc' }, take: 1 }, payments: true } })
 if (!student) return NextResponse.json({ error: 'No child found' }, { status: 404 })

 await prisma.parentStudent.upsert({
  where: { parentId_studentId: { parentId: auth.user!.id, studentId: student.id } },
  update: {},
  create: { parentId: auth.user!.id, studentId: student.id },
 })

 return NextResponse.json({ student, latest: student.classUpdates[0] })
}
