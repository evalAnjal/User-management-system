import { promises as fs } from 'fs'
import path from 'path'

const defaultDataFile = path.join(process.cwd(), 'data', 'users.json')

function dataPathForOwner(ownerId){
  if(!ownerId) return defaultDataFile
  return path.join(process.cwd(), 'data', `users_${ownerId}.json`)
}

export async function readUsers(ownerId){
  const dataFile = dataPathForOwner(ownerId)
  try {
    const raw = await fs.readFile(dataFile, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    if (e.code === 'ENOENT') return []
    throw e
  }
}

export async function writeUsers(users, ownerId) {
  const dataFile = dataPathForOwner(ownerId)
  await fs.mkdir(path.dirname(dataFile), { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2), 'utf8')
}
