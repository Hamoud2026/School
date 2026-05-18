import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
 const body = await req.json()
 const link = await prisma.registrationLink.findFirst({
  where: {
   active: true,
   OR: [
    { expiresAt: null },
    { expiresAt: { gte: new Date() } },
   ],
  },
  orderBy: { createdAt: 'desc' },
 })
 if (!link) {
  return NextResponse.json({ error: 'Public registration is currently closed.' }, { status: 404 })
 }

 if (!body.parentName || !body.parentEmail || !body.studentFirstName || !body.studentLastName || !body.studentDateOfBirth) {
  return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
 }

 const request = await prisma.joinRequest.create({
  data: {
   registrationLinkId: link.id,
   parentName: String(body.parentName).trim(),
   parentEmail: String(body.parentEmail).trim().toLowerCase(),
   studentFirstName: String(body.studentFirstName).trim(),
   studentLastName: String(body.studentLastName).trim(),
   studentDateOfBirth: new Date(body.studentDateOfBirth),
   note: body.note ? String(body.note).trim() : null,
  },
 })

 return NextResponse.json({ ok: true, request })
}
