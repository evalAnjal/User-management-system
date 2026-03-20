import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getAccountByEmail } from '../../../../lib/accounts'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

export async function POST(request){
  try{
    const body = await request.json()
    const email = (body?.email || '').toString().trim().toLowerCase()
    const password = (body?.password || '').toString()

    if(!email||!password) return NextResponse.json({message:'Missing fields'},{status:400})

    const account = await getAccountByEmail(email)
    if(!account) return NextResponse.json({message:'Invalid credentials'},{status:401})

    const ok = bcrypt.compareSync(password, account.passwordHash || '')
    if(!ok) return NextResponse.json({message:'Invalid credentials'},{status:401})

    const token = jwt.sign({ id: account.id, email: account.email, role: account.role }, JWT_SECRET, { expiresIn: '7d' })

    // debug log
    console.log('Login successful for account id=', account.id)

    const res = NextResponse.json({message:'Logged in', user:{id:account.id, name: account.name, email: account.email}, token})
    // set cookie with sensible attributes
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60*60*24*7, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
    return res
  }catch(e){
    console.error('Login error', e)
    return NextResponse.json({message:'Internal error'},{status:500})
  }
}
