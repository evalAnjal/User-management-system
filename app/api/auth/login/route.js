import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { readUsers } from '../../../../lib/users'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

export async function POST(request){
  const { email, password } = await request.json()
  if(!email||!password) return NextResponse.json({message:'Missing fields'},{status:400})

  const users = await readUsers()
  const user = users.find(u=> u.email===email)
  if(!user) return NextResponse.json({message:'Invalid credentials'},{status:401})

  const ok = bcrypt.compareSync(password, user.passwordHash || '')
  if(!ok) return NextResponse.json({message:'Invalid credentials'},{status:401})

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

  const res = NextResponse.json({message:'Logged in'})
  res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60*60*24*7 })
  return res
}
