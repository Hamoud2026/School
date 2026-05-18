import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
export async function POST(req:Request){const b=await req.json();const teacher=await prisma.user.findFirst({where:{role:'TEACHER'}});if(!teacher)return NextResponse.json({error:'No teacher'},{status:400});const update=await prisma.classUpdate.create({data:{classId:b.classId,studentId:b.studentId,teacherId:teacher.id,homework:b.homework,revision:b.revision,score:b.score?Number(b.score):undefined,points:b.points?Number(b.points):0,stamps:b.stamps?Number(b.stamps):0}});return NextResponse.json(update)}
