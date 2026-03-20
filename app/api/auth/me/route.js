import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { readAccounts } from '../../../../lib/accounts'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

export async function GET(){
  const cookieJar = await cookies()
  const token = cookieJar.get('token')?.value
  if(!token) return NextResponse.json({authenticated:false})
  try{
    const decoded = jwt.verify(token, JWT_SECRET)
    const accounts = await readAccounts()
    const account = accounts.find(a=> a.id === decoded.id)
    if(!account) return NextResponse.json({authenticated:false})
    return NextResponse.json({authenticated:true,user:{id:account.id,name:account.name,email:account.email,role:account.role}})
  }catch(e){
    return NextResponse.json({authenticated:false})
  }
}
