import { promises as fs } from 'fs'
import path from 'path'

const defaultDataFile = path.join(process.cwd(), 'data', 'users.json')

async function dataPathForOwner(ownerId){
  if(!ownerId) return defaultDataFile
  const dir = path.join(process.cwd(), 'data')
  const preferred = path.join(dir, `user_${ownerId}.json`)
  const legacy = path.join(dir, `users_${ownerId}.json`)
  try{
    // prefer existing legacy filename if present
    await fs.access(preferred)
    return preferred
  }catch(e){
    try{
      await fs.access(legacy)
      return legacy
    }catch(e2){
      // neither exists, return preferred so writes create it
      return preferred
    }
  }
}

export async function readUsers(ownerId){
  const dataFile = await dataPathForOwner(ownerId)
  try {
    const raw = await fs.readFile(dataFile, 'utf8')
    const parsed = JSON.parse(raw)
    console.debug(`[lib/users] readUsers owner=${ownerId} file=${dataFile} count=${Array.isArray(parsed)?parsed.length:'?'} `)
    return parsed
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.debug(`[lib/users] readUsers owner=${ownerId} file not found, returning [] -> ${dataFile}`)
      return []
    }
    console.error('[lib/users] readUsers error', e)
    throw e
  }
}

export async function writeUsers(users, ownerId) {
  const dataFile = await dataPathForOwner(ownerId)
  try{
    await fs.mkdir(path.dirname(dataFile), { recursive: true })
    await fs.writeFile(dataFile, JSON.stringify(users, null, 2), 'utf8')
    console.debug(`[lib/users] writeUsers owner=${ownerId} file=${dataFile} count=${Array.isArray(users)?users.length:'?'} `)
  }catch(e){
    console.error('[lib/users] writeUsers error', e)
    throw e
  }
}
