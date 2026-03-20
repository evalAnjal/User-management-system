"use client"
import { useState } from 'react'

export default function AddUserModal({ onClose, onCreate }){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [profileUrl,setProfileUrl] = useState('')
  const [role,setRole] = useState('user')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    if(!name || !email || !profileUrl) { setError('Please fill all fields'); return }
    setLoading(true)
    try{
      const res = await fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name, email, profileUrl, role}), credentials: 'include'})
      const data = await res.json()
      if(!res.ok){ setError(data.message || 'Failed to add user'); setLoading(false); return }
      // API returns users array; find created user by email
      const created = data.users ? data.users.find(u=>u.email===email) : null
      onCreate(created || { id: Date.now(), name, email, profileUrl, role })
      onClose()
    }catch(err){
      console.error(err)
      setError('Failed to add user')
    }finally{ setLoading(false) }
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000}}>
      <form onSubmit={handleSubmit} style={{background:'#fff',padding:20,borderRadius:12,width:420,boxShadow:'0 10px 40px rgba(2,6,23,0.2)'}}>
        <h3 style={{marginTop:0}}>Add user</h3>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{width:'100%',padding:10,marginBottom:8,borderRadius:8,border:'1px solid #e5e7eb'}} />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:'100%',padding:10,marginBottom:8,borderRadius:8,border:'1px solid #e5e7eb'}} />
        <input value={profileUrl} onChange={e=>setProfileUrl(e.target.value)} placeholder="Profile image URL" style={{width:'100%',padding:10,marginBottom:8,borderRadius:8,border:'1px solid #e5e7eb'}} />
        <select value={role} onChange={e=>setRole(e.target.value)} style={{width:'100%',padding:10,marginBottom:12,borderRadius:8,border:'1px solid #e5e7eb'}}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {error && <div style={{color:'red',marginBottom:8}}>{error}</div>}
        <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
          <button type="button" onClick={onClose} style={{padding:'8px 12px',borderRadius:8,border:'1px solid #e5e7eb',background:'#fff'}}>Cancel</button>
          <button type="submit" disabled={loading} style={{padding:'8px 12px',borderRadius:8,border:'none',background:'#2563eb',color:'#fff'}}>{loading? 'Adding...':'Add user'}</button>
        </div>
      </form>
    </div>
  )
}
