import { NextResponse } from "next/server"
import { readUsers, writeUsers } from '../../../lib/users'
import { verifyTokenFromRequest } from '../../../lib/auth'

export async function GET(request){
    const authed = verifyTokenFromRequest(request)
    if(authed){
      const users = await readUsers(authed.id)
      return NextResponse.json(users)
    }
    const users = await readUsers()
    return NextResponse.json(users)
}

export async function POST(request){
    const authed = verifyTokenFromRequest(request)

    if(!authed) return NextResponse.json({message:'Unauthorized'},{status:401})

    const body = await request.json();
    const {name,profileUrl,email,role}= body;

    if (!name||!profileUrl||!email||!role) return NextResponse.json({message:"Missing Paramaters"},{status:400})

    const users = await readUsers(authed.id)

    const newUser={
        id: users.length ? Math.max(...users.map(u=>u.id)) + 1 : 1,
        name:name,
        profileUrl:profileUrl,
        email:email,
        role:role

    }

    users.push(newUser)

    await writeUsers(users, authed.id)

    return NextResponse.json({message:'User Added suscessfully',users:users})
}