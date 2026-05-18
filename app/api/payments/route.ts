import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
export async function GET(){return NextResponse.json(await prisma.payment.findMany({include:{student:true}}))}
export async function POST(req:Request){const b=await req.json();const p=await prisma.payment.create({data:{studentId:b.studentId,amount:Number(b.amount),dueDate:new Date(b.dueDate),status:b.status||'DUE',receiptUrl:b.receiptUrl}});return NextResponse.json(p)}
