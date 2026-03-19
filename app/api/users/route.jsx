import { NextResponse } from "next/server"
import { readUsers, writeUsers } from '../../../lib/users'

export async function GET(request){
    const users = await readUsers()
    return NextResponse.json(users)
}

export async function POST(request){
    const body = await request.json();
    const {name,profileUrl,email,role}= body;

    if (!name||!profileUrl||!email||!role) return NextResponse.json({message:"Missing Paramaters"},{status:400})

    const users = await readUsers()

    const newUser={
        id: users.length ? Math.max(...users.map(u=>u.id)) + 1 : 1,
        name:name,
        profileUrl:profileUrl,
        email:email,
        role:role

    }

    users.push(newUser)

    await writeUsers(users)

    return NextResponse.json({message:'User Added suscessfully',users:users})
}