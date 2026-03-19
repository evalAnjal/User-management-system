import { NextResponse } from "next/server";
import { readUsers, writeUsers } from '../../../../lib/users'

export  async  function GET(request, { params }){
    const id = Number(params.id)

    const users = await readUsers()
    const userByID= users.find(user=> user.id===id)

    if (!userByID) return NextResponse.json({message:`User with ID ${id} does not exist`},{status:400})

    return NextResponse.json(userByID)

}

export async function PATCH(request,{ params }){

    try{
    const id = Number(params.id);
    const body = await request.json()

    const users = await readUsers()

    const userIndex = users.findIndex(user=> user.id===id);

    if (userIndex === -1) return NextResponse.json({message:'user does not exist'},{status:404})

    users[userIndex]={
        ...users[userIndex],
        ...body,
        id:id
    }

    await writeUsers(users)

    return NextResponse.json({message:'user Modified suscessfully',user:users[userIndex]});
    }

    catch(e){
        return NextResponse.json({error:String(e)})
    }


}

export async function DELETE(request,{ params }){

    try{
    const id = Number(params.id);

    const users = await readUsers()

    const userIndex = users.findIndex(user=> user.id===id)

    if (userIndex==-1) return NextResponse.json({message:'user does not exist'},{status:404})

    users.splice(userIndex,1)

    await writeUsers(users)

    return NextResponse.json({message:`user with id ${id} deleted suscessfully`})

}
catch(e){
    return NextResponse.json({error:String(e)})
}
}
