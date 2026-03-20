import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { readAccounts, addAccount } from '../../../../lib/accounts'
import { writeUsers } from '../../../../lib/users'

export async function POST(request){
  const body = await request.json()
  const { name, email, password } = body
  if(!name || !email || !password) return NextResponse.json({message:'Missing fields'},{status:400})

  const accounts = await readAccounts()
  if(accounts.find(a=> a.email === email)) return NextResponse.json({message:'Email already exists'},{status:400})

  const id = accounts.length ? Math.max(...accounts.map(a=>a.id)) + 1 : 1
  const hash = bcrypt.hashSync(password, 10)
  const newAccount = {
    id,
    name,
    email,
    passwordHash: hash,
    role: 'user',
    createdAt: new Date().toISOString()
  }

  await addAccount(newAccount)
  // ensure empty per-account users file
  await writeUsers([], id)

  return NextResponse.json({message:'Registered', account:{id:newAccount.id,name:newAccount.name,email:newAccount.email,role:newAccount.role}})
}
