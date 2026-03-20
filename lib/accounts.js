import { promises as fs } from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'accounts.json')

export async function readAccounts(){
  try{
    const raw = await fs.readFile(dataFile,'utf8')
    return JSON.parse(raw)
  }catch(e){
    if(e.code === 'ENOENT') return []
    throw e
  }
}

export async function writeAccounts(accounts){
  await fs.mkdir(path.dirname(dataFile), { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(accounts, null, 2), 'utf8')
}

export async function addAccount(account){
  const accounts = await readAccounts()
  accounts.push(account)
  await writeAccounts(accounts)
  return account
}

export async function getAccountByEmail(email){
  const accounts = await readAccounts()
  return accounts.find(a=> a.email === email) || null
}
