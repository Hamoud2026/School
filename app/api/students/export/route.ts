import * as XLSX from 'xlsx'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN])
 if (auth.response) return auth.response

 const students = await prisma.student.findMany({ orderBy: { createdAt: 'desc' } })
 const rows = students.map(student => ({
  'First name': student.firstName,
  'Last name': student.lastName,
  'Date of birth': student.dateOfBirth.toISOString().split('T')[0],
  'Student code': student.studentCode,
  Level: student.level || '',
  Created: student.createdAt.toISOString(),
 }))
 const worksheet = XLSX.utils.json_to_sheet(rows)
 const workbook = XLSX.utils.book_new()
 XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
 const data = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

 return new Response(data, {
  headers: {
   'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
   'Content-Disposition': 'attachment; filename="students.xlsx"',
  },
 })
}
