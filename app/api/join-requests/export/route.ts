import * as XLSX from 'xlsx'
import { Role } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
 const auth = await requireRole([Role.PRINCIPAL, Role.ADMIN])
 if (auth.response) return auth.response

 const requests = await prisma.joinRequest.findMany({
  orderBy: { createdAt: 'desc' },
  include: { registrationLink: true },
 })
 const rows = requests.map(request => ({
  'Parent name': request.parentName,
  'Parent email': request.parentEmail,
  'Student first name': request.studentFirstName,
  'Student last name': request.studentLastName,
  'Student birthdate': request.studentDateOfBirth.toISOString().split('T')[0],
  Note: request.note || '',
  Status: request.status,
  'Requested at': request.createdAt.toISOString(),
  'Link title': request.registrationLink.title,
 }))
 const worksheet = XLSX.utils.json_to_sheet(rows)
 const workbook = XLSX.utils.book_new()
 XLSX.utils.book_append_sheet(workbook, worksheet, 'Join requests')
 const data = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

 return new Response(data, {
  headers: {
   'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
   'Content-Disposition': 'attachment; filename="join-requests.xlsx"',
  },
 })
}
