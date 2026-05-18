import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN])
 if (auth.response) return auth.response

 const body = await req.json()
 const schoolClass = await prisma.class.create({
  data: {
   name: body.name,
   level: body.level,
   schedule: body.schedule,
   teacherId: body.teacherId || null,
  },
 })
 return NextResponse.json(schoolClass)
}
