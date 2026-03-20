"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      const res = await fetch('/api/auth/register',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name,email,password}),
        credentials: 'include'
      })
      const data = await res.json()
      if(!res.ok){ setError(data.message || 'Register failed'); setLoading(false); return }
      // after register, navigate to login
      router.push('/login')
    }catch(err){
      console.error(err)
      setError('Register failed')
    }finally{ setLoading(false) }
  }

  return (
    <div style={{display:'flex',justifyContent:'center',padding:40}}>
      <form onSubmit={handleSubmit} style={{width:420,background:'#fff',padding:20,borderRadius:12,boxShadow:'0 10px 30px rgba(2,6,23,0.08)'}}>
        <h2 style={{marginTop:0}}>Create account</h2>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{width:'100%',padding:10,marginBottom:8,borderRadius:8,border:'1px solid #e5e7eb'}} />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:'100%',padding:10,marginBottom:8,borderRadius:8,border:'1px solid #e5e7eb'}} />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={{width:'100%',padding:10,marginBottom:8,borderRadius:8,border:'1px solid #e5e7eb'}} />
        {error && <div style={{color:'red',marginBottom:8}}>{error}</div>}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <a href="/login" style={{fontSize:13,color:'#2563eb'}}>Already have an account?</a>
          <button type="submit" disabled={loading} style={{padding:'8px 12px',background:'#2563eb',color:'#fff',border:'none',borderRadius:8}}>
            {loading? 'Creating...':'Create account'}
          </button>
        </div>
      </form>
    </div>
  )
}
