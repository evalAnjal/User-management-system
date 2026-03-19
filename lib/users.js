import { promises as fs } from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'users.json')

export async function readUsers() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    if (e.code === 'ENOENT') return []
    throw e
  }
}

export async function writeUsers(users) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2), 'utf8')
}
