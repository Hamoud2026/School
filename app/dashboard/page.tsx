import { prisma } from '@/lib/db'
import DashboardClient from './ui'

export const dynamic = 'force-dynamic'

export default async function Dashboard(){
 const [users,students,classes,announcements,payments]=await Promise.all([
  prisma.user.findMany({orderBy:{createdAt:'desc'}}),
  prisma.student.findMany({include:{classUpdates:{orderBy:{date:'desc'},take:1},payments:true}}),
  prisma.class.findMany({include:{teacher:true,enrollments:true}}),
  prisma.announcement.findMany({orderBy:{createdAt:'desc'},take:5}),
  prisma.payment.findMany({include:{student:true},orderBy:{dueDate:'desc'}})
 ])
 return <DashboardClient users={users as any} students={students as any} classes={classes as any} announcements={announcements as any} payments={payments as any}/>
}
