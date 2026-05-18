import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN, Role.TEACHER, Role.PARENT])
 if (auth.response) return auth.response
 return NextResponse.json(await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } }))
}

export async function POST(req: Request) {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN])
 if (auth.response) return auth.response
 const b = await req.json()
 const announcement = await prisma.announcement.create({
  data: { title: b.title, body: b.body, audience: b.audience || 'ALL', authorId: auth.user!.id },
 })
 return NextResponse.json(announcement)
}
