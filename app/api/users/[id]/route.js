import { NextResponse } from "next/server";
import { readUsers, writeUsers } from '../../../../lib/users'
import { verifyTokenFromRequest } from '../../../../lib/auth'

export  async  function GET(request, { params }){
    const id = Number(params.id)

    const authed = verifyTokenFromRequest(request)
    const ownerId = authed ? authed.id : null

    const users = await readUsers(ownerId)
    const userByID= users.find(user=> user.id===id)

    if (!userByID) return NextResponse.json({message:`User with ID ${id} does not exist`},{status:400})

    return NextResponse.json(userByID)

}

export async function PATCH(request,props){

    try{
        const params = await props.params;
         
    const authed = verifyTokenFromRequest(request)
    if(!authed) return NextResponse.json({message:'Unauthorized'},{status:401})

    const id = Number(params.id);
    if (Number.isNaN(id)) return NextResponse.json({message:'Invalid id'},{status:400})

    const body = await request.json()

    const users = await readUsers(authed.id)

    const userIndex = users.findIndex(user=> user.id===id);

    if (userIndex === -1) return NextResponse.json({message:'user does not exist'},{status:404})

    // optional: prevent duplicate email in same owner's list
    if(body.email){
      const dup = users.find(u => u.email === body.email && u.id !== id)
      if(dup) return NextResponse.json({message:'Email already in use'},{status:400})
    }

    const updatedUser = {
        ...users[userIndex],
        ...body,
        id: id,
        updatedAt: new Date().toISOString()
    }

    users[userIndex] = updatedUser

    await writeUsers(users, authed.id)

    return NextResponse.json({message:'user Modified successfully', user: updatedUser, users})
    }

    catch(e){
        console.error('PATCH error', e)
        return NextResponse.json({error:String(e)})
    }


}

export async function DELETE(request,props){

    try{
        // props.params is a plain object; no need to await
        const params = props?.params || {}
        const rawId = params.id

    const authed = verifyTokenFromRequest(request)
    if(!authed) return NextResponse.json({message:'Unauthorized'},{status:401})

    const ownerId = authed.id
    const id = Number(rawId);
    if (Number.isNaN(id)) return NextResponse.json({message:'Invalid id'},{status:400})

    console.debug(`DELETE request for owner=${ownerId} id=${id}`)

    const users = await readUsers(ownerId)

    console.debug(`Users before delete (owner=${ownerId}): count=${users.length} ids=[${users.map(u=>u.id).join(',')}]`)

    const userIndex = users.findIndex(user=> user.id===id)
    console.log(users+''+userIndex)

    if (userIndex==-1) {
      console.warn(`DELETE: user id ${id} not found for owner ${ownerId}`)
      return NextResponse.json({message:'user does not exist'},{status:404})
    }

    // remove the user
    const removed = users.splice(userIndex,1)

    await writeUsers(users, ownerId)

    // read back to verify
    const usersAfter = await readUsers(ownerId)
    console.debug(`Users after delete (owner=${ownerId}): count=${usersAfter.length} ids=[${usersAfter.map(u=>u.id).join(',')}]`, { removed })

    console.log(`DELETE: owner=${ownerId} removed user id=${id}`, { removed, remainingCount: usersAfter.length })

    return NextResponse.json({message:`user with id ${id} deleted successfully`, users: usersAfter})

}
catch(e){
    console.error('DELETE error', e)
    return NextResponse.json({error:String(e)})
}
}
