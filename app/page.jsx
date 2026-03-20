"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import UserModal from "@/_components/UserModal";
import AddUserModal from '@/_components/AddUserModal'
import EditUserModal from '@/_components/EditUserModal'

export default function Home() {

  const [users, setUsers] = useState([]); 
  const [query, setQuery] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [auth, setAuth] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadUsers() {
      const response = await fetch("/api/users");
      const data = await response.json();

      const safeUsers = Array.isArray(data) ? data : [];

      setUsers(safeUsers); 
    }

    async function loadAuth(){
      try{
        const res = await fetch('/api/auth/me',{credentials:'include'})
        const data = await res.json()
        if(data?.authenticated) setAuth(data.user)
        else setAuth(null)
      }catch(e){ setAuth(null) }
      finally{ setAuthChecked(true) }
    }

    loadUsers();
    loadAuth();
  }, []);

  useEffect(()=>{
    // after auth check completed, if not authenticated redirect to login
    if(authChecked && !auth){
      router.replace('/login')
    }
  },[authChecked, auth, router])

  async function handleLogout(){
    try{
      await fetch('/api/auth/logout',{method:'POST',credentials:'include'})
      setAuth(null)
      // refresh users from server
      const r = await fetch('/api/users')
      const d = await r.json()
      setUsers(Array.isArray(d)?d:[])
    }catch(e){ console.error(e) }
  }

  async function handleDelete(id){
    try{
      const response = await fetch(`/api/users/${id}`,{method:'DELETE', credentials: 'include'})
      const body = await response.json()
      if (!response.ok) {
        window.alert(body.message || 'Failed to delete user')
        return
      }
      // remove locally for immediate UI feedback
      setUsers(prev => prev.filter(u=> u.id !== id))
    } catch(err) {
      console.error(err)
      window.alert('Failed to delete user')
    }
  }

  function handleCreate(newUser){
    if(!newUser) return
    setUsers(prev => [newUser, ...prev])
  }

  function handleEdit(id){
    const user = users.find(u=> u.id === id)
    setEditing(user || null)
  }

  function handleSave(updated){
    setUsers(prev => prev.map(u=> u.id === updated.id ? updated : u))
  }

  const filtered = users.filter(u => u.name?.toLowerCase().includes(query.toLowerCase()) || u.email?.toLowerCase().includes(query.toLowerCase()))

  if(!authChecked) return null // still checking
  // if authChecked && !auth we already redirected; avoid rendering
  if(!auth) return null

  return (
    <div style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', padding: 24, display:'flex', justifyContent:'center'}}>
      <div style={{width: 'min(1100px, 96%)'}}>
        <header style={{background:'#fff', padding:20, borderRadius:12, boxShadow:'0 8px 30px rgba(2,6,23,0.08)', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div>
            <h1 style={{margin:0, fontSize:20, fontWeight:700}}>User management System</h1>
            <p style={{margin: '6px 0 0', color:'#4b5563'}}>Manage users — view, edit and remove entries</p>
          </div>
          <div style={{textAlign:'right', display:'flex', gap:12, alignItems:'center'}}>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:12, color:'#6b7280'}}>Total</div>
              <div style={{fontWeight:700, fontSize:18}}>{users.length}</div>
            </div>
            {auth ? (
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:12,color:'#6b7280'}}>Signed in</div>
                <div style={{fontWeight:700}}>{auth.name}</div>
                <button onClick={handleLogout} style={{marginLeft:8, padding:'6px 10px', borderRadius:8, border:'none', background:'#ef4444', color:'#fff', cursor:'pointer'}}>Logout</button>
              </div>
            ) : null}
          </div>
        </header>

        <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:18}}>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="Search by name or email..."
            style={{flex:1, padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', outline:'none', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.5)'}}
          />
          {auth ? (
            <button onClick={()=>setShowAdd(true)} style={{padding:'10px 14px', background:'#2563eb', color:'#fff', border:'none', borderRadius:10, cursor:'pointer'}}>Add user</button>
          ) : null}
        </div>

        <main>
          {filtered.length === 0 ? (
            <div style={{padding:40, borderRadius:10, textAlign:'center', color:'#6b7280', background:'#fbfcfe'}}>No users found.</div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:14, paddingBottom:8}}>
              {filtered.map(user => (
                <UserModal key={user.id} {...user} bg="#fafafa" handleDelete={auth && auth.role==='admin' ? handleDelete : undefined} handleEdit={auth ? handleEdit : undefined} />
              ))}
            </div>
          )}
        </main>
      </div>

      {showAdd && <AddUserModal onClose={()=>setShowAdd(false)} onCreate={handleCreate} />}
      {editing && <EditUserModal user={editing} onClose={()=>setEditing(null)} onSave={handleSave} />}
    </div>
  );
}