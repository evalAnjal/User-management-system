"use client"
import { useState, useEffect } from 'react'

export default function EditUserModal({ user, onClose, onSave }){
  const [name,setName] = useState(user?.name || '')
  const [email,setEmail] = useState(user?.email || '')
  const [profileUrl,setProfileUrl] = useState(user?.profileUrl || '')
  const [role,setRole] = useState(user?.role || 'user')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')

  useEffect(()=>{
    setName(user?.name||'')
    setEmail(user?.email||'')
    setProfileUrl(user?.profileUrl||'')
    setRole(user?.role||'user')
  },[user])

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    if(!name || !email || !profileUrl) { setError('Please fill all fields'); return }
    setLoading(true)
    try{
      const res = await fetch(`/api/users/${user.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({name, email, profileUrl, role}), credentials: 'include'})
      const data = await res.json()
      if(!res.ok){ setError(data.message || 'Failed to update user'); setLoading(false); return }
      onSave(data.user || { ...user, name, email, profileUrl, role })
      onClose()
    }catch(err){
      console.error(err)
      setError('Failed to update user')
    }finally{ setLoading(false) }
  }

  if(!user) return null

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000}}>
      <form onSubmit={handleSubmit} style={{background:'#fff',padding:20,borderRadius:12,width:420,boxShadow:'0 10px 40px rgba(2,6,23,0.2)'}}>
        <h3 style={{marginTop:0}}>Edit user</h3>
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
          <button type="submit" disabled={loading} style={{padding:'8px 12px',borderRadius:8,border:'none',background:'#2563eb',color:'#fff'}}>{loading? 'Saving...':'Save'}</button>
        </div>
      </form>
    </div>
  )
}
