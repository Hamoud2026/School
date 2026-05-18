import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN, Role.TEACHER])
 if (auth.response) return auth.response

 const b = await req.json()
 const teacherId = auth.user!.role === Role.TEACHER ? auth.user!.id : b.teacherId || auth.user!.id
 const update = await prisma.classUpdate.create({
  data: {
   classId: b.classId,
   studentId: b.studentId,
   teacherId,
   homework: b.homework,
   revision: b.revision,
   score: b.score ? Number(b.score) : undefined,
   points: b.points ? Number(b.points) : 0,
   stamps: b.stamps ? Number(b.stamps) : 0,
  },
 })
 return NextResponse.json(update)
}
