import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
 const auth = await requireRole([Role.PRINCIPAL])
 if (auth.response) return auth.response
 return NextResponse.json(await prisma.registrationLink.findMany({ include: { requests: true }, orderBy: { createdAt: 'desc' } }))
}

export async function POST(req: Request) {
 const auth = await requireRole([Role.PRINCIPAL])
 if (auth.response) return auth.response
 const body = await req.json()
 const token = randomBytes(12).toString('hex')
 const link = await prisma.registrationLink.create({
  data: {
   token,
   title: body.title || 'School public registration',
   expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
   createdById: auth.user!.id,
  },
 })
 return NextResponse.json({ ...link, url: `/join/${token}` })
}
