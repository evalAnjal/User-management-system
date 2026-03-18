import { NextResponse } from "next/server";
import { users } from "../route";

export  async  function GET(request,props){
    const params = await props.params;
    const id = params.id

    const userByID= users.find(user=> user.id==id)

    if (!userByID) return NextResponse.json({message:`User with ID ${id} does not exist`},{status:400})

    return NextResponse.json(userByID)

}

export async function PATCH(request,props){

    try{
    
    const params = await props.params;
    const id = params.id;
    const body = await request.json()

    const userIndex = users.findIndex(user=> user.id==id);

    users[userIndex]={
        ...users[userIndex],
        ...body,
        id:id
    }
    return NextResponse.json({message:'user created suscessfully',user:users});
    }

    catch(e){
        return NextResponse.json({error:e})
    }


}

export async function DELETE(request,props){
    const params = await props.params;
    const id = params.id;


    const userIndex = users.findIndex(user=> user.id==id)

    if (userIndex==-1) return NextResponse.json({message:'user does not exist'})

    users.splice(userIndex)

    return NextResponse.json({message:`user with id ${id} deleted suscessfully`},{users:users})

}