import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
export async function POST(req:Request){
 const body=await req.json(); const hash=await bcrypt.hash(body.password || 'password123',10)
 const requestedRole=body.requestedRole || 'PARENT'
 const role=requestedRole==='PARENT'?'PARENT':'PENDING'
 const user=await prisma.user.create({data:{name:body.name,email:body.email,passwordHash:hash,role,requestedRole}})
 return NextResponse.json({ok:true,user:{id:user.id,email:user.email,role:user.role}})
}
