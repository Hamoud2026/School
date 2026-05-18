import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
export async function POST(req:Request){const {userId,role}=await req.json();const user=await prisma.user.update({where:{id:userId},data:{role,approvedAt:new Date()}});return NextResponse.json({ok:true,user})}
