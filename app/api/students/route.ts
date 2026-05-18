import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
export async function GET(){return NextResponse.json(await prisma.student.findMany())}
export async function POST(req:Request){const b=await req.json();const s=await prisma.student.create({data:{firstName:b.firstName,lastName:b.lastName,dateOfBirth:new Date(b.dateOfBirth),studentCode:b.studentCode,level:b.level}});return NextResponse.json(s)}
