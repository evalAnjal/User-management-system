export async function getUsers(){
const response = await fetch('http://localhost:3000/api/users')
const data = await response.json()
console.log(data)
const users = Array(data)? data: []


return users;
}