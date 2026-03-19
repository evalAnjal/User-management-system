import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { readUsers } from '../../../../lib/users'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

export async function GET(request){
  const token = request.cookies.get('token')?.value
  if(!token) return NextResponse.json({authenticated:false})
  try{
    const decoded = jwt.verify(token, JWT_SECRET)
    const users = await readUsers()
    const user = users.find(u=> u.id===decoded.id)
    if(!user) return NextResponse.json({authenticated:false})
    return NextResponse.json({authenticated:true,user:{id:user.id,name:user.name,email:user.email,role:user.role}})
  }catch(e){
    return NextResponse.json({authenticated:false})
  }
}
