import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { readUsers, writeUsers } from '../../../../lib/users'

export async function POST(request){
  const body = await request.json()
  const { name, email, password } = body
  if(!name || !email || !password) return NextResponse.json({message:'Missing fields'},{status:400})

  const users = await readUsers()
  if(users.find(u=>u.email===email)) return NextResponse.json({message:'Email already exists'},{status:400})

  const hash = bcrypt.hashSync(password, 10)
  const newUser = {
    id: users.length ? Math.max(...users.map(u=>u.id)) + 1 : 1,
    name,
    email,
    passwordHash: hash,
    role: 'user',
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  await writeUsers(users)

  return NextResponse.json({message:'Registered', user:{id:newUser.id,name:newUser.name,email:newUser.email,role:newUser.role}})
}
