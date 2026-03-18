"use client";

import { useEffect, useState } from "react";
import UserModal from "@/_components/UserModal";

export default function Home() {

  const [users, setUsers] = useState([]); 
  const [query, setQuery] = useState('')

  useEffect(() => {
    async function loadUsers() {
      const response = await fetch("/api/users");
      const data = await response.json();

      const safeUsers = Array.isArray(data) ? data : [];

      setUsers(safeUsers); 
    }

    loadUsers();
  }, []);

  function handleDelete(id){
    
    
  }

  const filtered = users.filter(u => u.name?.toLowerCase().includes(query.toLowerCase()) || u.email?.toLowerCase().includes(query.toLowerCase()))

  return (
    <div style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif', padding: 24, display:'flex', justifyContent:'center'}}>
      <div style={{width: 'min(1100px, 96%)'}}>
        <header style={{background:'#fff', padding:20, borderRadius:12, boxShadow:'0 8px 30px rgba(2,6,23,0.08)', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div>
            <h1 style={{margin:0, fontSize:20, fontWeight:700}}>User management System</h1>
            <p style={{margin: '6px 0 0', color:'#4b5563'}}>Manage users — view, edit and remove entries</p>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:12, color:'#6b7280'}}>Total</div>
            <div style={{fontWeight:700, fontSize:18}}>{users.length}</div>
          </div>
        </header>

        <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:18}}>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="Search by name or email..."
            style={{flex:1, padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', outline:'none', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.5)'}}
          />
          <button style={{padding:'10px 14px', background:'#2563eb', color:'#fff', border:'none', borderRadius:10, cursor:'pointer'}}>Add user</button>
        </div>

        <main>
          {filtered.length === 0 ? (
            <div style={{padding:40, borderRadius:10, textAlign:'center', color:'#6b7280', background:'#fbfcfe'}}>No users found.</div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:14, paddingBottom:8}}>
              {filtered.map(user => (
                <UserModal key={user.id} {...user} bg="#fafafa" handleDelete={handleDelete} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}