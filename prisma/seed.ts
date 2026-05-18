import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
async function main(){
  const passwordHash = await bcrypt.hash('password123', 10)
  const principal = await prisma.user.upsert({where:{email:'principal@school.com'}, update:{}, create:{name:'School Principal',email:'principal@school.com',passwordHash,role:Role.PRINCIPAL,approvedAt:new Date()}})
  const teacher = await prisma.user.upsert({where:{email:'teacher@school.com'}, update:{}, create:{name:'Ms Sarah',email:'teacher@school.com',passwordHash,role:Role.TEACHER,approvedAt:new Date()}})
  await prisma.user.upsert({where:{email:'admin@school.com'}, update:{}, create:{name:'Admin User',email:'admin@school.com',passwordHash,role:Role.ADMIN,approvedAt:new Date()}})
  const parent = await prisma.user.upsert({where:{email:'parent@school.com'}, update:{}, create:{name:'Parent User',email:'parent@school.com',passwordHash,role:Role.PARENT,approvedAt:new Date()}})
  await prisma.user.upsert({where:{email:'mona@example.com'}, update:{}, create:{name:'Mona Ali',email:'mona@example.com',passwordHash,role:Role.PENDING,requestedRole:Role.TEACHER}})
  const cls = await prisma.class.create({data:{name:'Quran Level 1',level:'Level 1',schedule:'Saturday 10:00 AM',teacherId:teacher.id}}).catch(async()=> prisma.class.findFirstOrThrow({where:{name:'Quran Level 1'}}))
  const dob = new Date('2018-07-10')
  const student = await prisma.student.upsert({where:{studentCode:'STU-2044'}, update:{}, create:{firstName:'Lina',lastName:'Mohamed',dateOfBirth:dob,studentCode:'STU-2044',level:'Arabic Level 2'}})
  await prisma.parentStudent.upsert({where:{parentId_studentId:{parentId:parent.id,studentId:student.id}},update:{},create:{parentId:parent.id,studentId:student.id}})
  await prisma.classEnrollment.upsert({where:{classId_studentId:{classId:cls.id,studentId:student.id}},update:{},create:{classId:cls.id,studentId:student.id}})
  await prisma.classUpdate.create({data:{classId:cls.id,studentId:student.id,teacherId:teacher.id,homework:'Arabic letters worksheet',revision:'Reviewed Al-Fatiha',score:92,points:5,stamps:2,attendance:'PRESENT'}})
  await prisma.payment.create({data:{studentId:student.id,amount:12000,dueDate:new Date(),status:'DUE'}})
  await prisma.announcement.create({data:{title:'Welcome to the new term',body:'Classes start this Saturday. Please check homework weekly.',authorId:principal.id}})
}
main().finally(()=>prisma.$disconnect())
