import { NextResponse } from "next/server"

export var users = [
    {
        id:1,
        name:'hari sharma acharya',
        profileUrl:'https://images.pexels.com/photos/36597902/pexels-photo-36597902.jpeg',
        email:'hari@email.com',
        role:'admin'
    },
    {
        id:2,
        name:'gagan kumar thapa',
        profileUrl:'https://images.pexels.com/photos/36612578/pexels-photo-36612578.jpeg',
        email:'gagan@email.com',
        role:'user'
    },
    {
        id:3,
        name:'Roshan basnet',
        profileUrl:'https://images.pexels.com/photos/36606986/pexels-photo-36606986.jpeg',
        email:'roshan@email.com',
        role:'user'
    }
]

export async function GET(request){

    return NextResponse.json(users)
}

export async function POST(request){
    const body = await request.json();
    const {name,profileUrl,email,role}= body;

    if (!name||!profileUrl||!email||!role) return NextResponse.json({message:"Missing Paramaters"},{status:400})

    const newUser={
        id:users.length+1,
        name:name,
        profileUrl:profileUrl,
        email:email,
        role:role

    }


    users.push(newUser)

    return NextResponse.json({message:'User Added suscessfully',users:users})
}