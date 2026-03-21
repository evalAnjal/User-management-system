import jwt from 'jsonwebtoken'
import { cookies as nextCookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

export function verifyTokenFromRequest(request){
  try{
    let token
    // If request has cookies (Edge/NextRequest), use it
    if(request && typeof request.cookies?.get === 'function'){
      token = request.cookies.get('token')?.value
    } else {
      // Fallback to next/headers cookies() in app routes
      token = nextCookies().get('token')?.value
    }
    if(!token) return null
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  }catch(e){
    console.error('verifyTokenFromRequest error', e)
    return null
  }
}

export function signPayload(payload){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}
