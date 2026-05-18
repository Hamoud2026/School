import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
export async function GET(){return NextResponse.json(await prisma.announcement.findMany({orderBy:{createdAt:'desc'}}))}
export async function POST(req:Request){const b=await req.json();const principal=await prisma.user.findFirst({where:{role:'PRINCIPAL'}});const a=await prisma.announcement.create({data:{title:b.title,body:b.body,audience:b.audience||'ALL',authorId:principal!.id}});return NextResponse.json(a)}
