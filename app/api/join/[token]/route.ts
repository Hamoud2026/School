import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
 const { token } = await params
 const link = await prisma.registrationLink.findUnique({ where: { token } })
 if (!link || !link.active || (link.expiresAt && link.expiresAt < new Date())) {
  return NextResponse.json({ error: 'Registration link is not available.' }, { status: 404 })
 }

 const body = await req.json()
 const request = await prisma.joinRequest.create({
  data: {
   registrationLinkId: link.id,
   parentName: body.parentName,
   parentEmail: body.parentEmail,
   studentFirstName: body.studentFirstName,
   studentLastName: body.studentLastName,
   studentDateOfBirth: new Date(body.studentDateOfBirth),
   note: body.note,
  },
 })
 return NextResponse.json({ ok: true, request })
}
