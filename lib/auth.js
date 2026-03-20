import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

export function verifyTokenFromRequest(request){
  try{
    const token = request.cookies?.get('token')?.value
    if(!token) return null
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  }catch(e){
    return null
  }
}

export function signPayload(payload){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}
