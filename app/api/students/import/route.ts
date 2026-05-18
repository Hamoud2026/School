import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import * as XLSX from 'xlsx'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN])
 if (auth.response) return auth.response

 const form = await req.formData()
 const file = form.get('file')
 if (!(file instanceof File)) {
  return NextResponse.json({ error: 'Upload an Excel file.' }, { status: 400 })
 }

 const buffer = Buffer.from(await file.arrayBuffer())
 const workbook = XLSX.read(buffer)
 const sheet = workbook.Sheets[workbook.SheetNames[0]]
 const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet)
 let imported = 0

 for (const row of rows) {
  const firstName = String(row.firstName || row['First Name'] || '').trim()
  const lastName = String(row.lastName || row['Last Name'] || '').trim()
  const dateOfBirth = row.dateOfBirth || row['Date Of Birth'] || row.dob || row.DOB
  const studentCode = String(row.studentCode || row['Student Code'] || '').trim()
  if (!firstName || !lastName || !dateOfBirth || !studentCode) continue

  await prisma.student.upsert({
   where: { studentCode },
   update: { firstName, lastName, level: row.level || row.Level || null },
   create: {
    firstName,
    lastName,
    dateOfBirth: new Date(dateOfBirth),
    studentCode,
    level: row.level || row.Level || null,
   },
  })
  imported += 1
 }

 return NextResponse.json({ ok: true, imported })
}
