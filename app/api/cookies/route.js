import { headers } from "next/headers"
import { cookies } from "next/headers"

export async function GET(req){
    //
    const cookieStore={
        gg:'ss',ss:'gg'
    }
    const cookie = await cookies()
   
    cookie.set("ss","gg");
    cookie.set("gg",`${JSON.stringify(cookieStore)}`);

    console.log (cookie.getAll())
    console.log ( cookie.get('gg').value)
   
    return new Response("Cookie set suscessfully");
       
}