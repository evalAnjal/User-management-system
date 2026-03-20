"use client"
import React from 'react'
import Image from 'next/image'

function UserModal(props) {
    const {id,name,profileUrl,email,role,bg,handleDelete,handleEdit}=props

    function onDelete(){
      const ok = window.confirm(`Delete user ${name}?`)
      if(!ok) return
      if(typeof handleDelete === 'function') handleDelete(id)
      else window.alert(`Deleted ${id}`)
    }

    function onEdit(){
      if(typeof handleEdit === 'function') handleEdit(id)
    }

    const cardStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      padding: '16px',
      margin: '12px 0',
      background: bg || '#fff',
      borderRadius: '12px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
      maxWidth: '90%',
    }

    const infoStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      flex: 1,
      minWidth: 0,
    }

    const nameStyle = { margin: 0, fontSize: '1.05rem', fontWeight: 700 }
    const metaStyle = { margin: 0, color: '#555', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

    const roleChip = {
      display: 'inline-block',
      background: '#eef2ff',
      color: '#3730a3',
      padding: '4px 8px',
      borderRadius: '999px',
      fontSize: '0.8rem',
      marginTop: '6px'
    }

    const btnCommon = {
      height: '40px',
      minWidth: '88px',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      cursor: 'pointer',
      transition: 'transform .12s ease',
    }

    return (
      <div style={cardStyle}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:72,height:72,overflow:'hidden',borderRadius:999,flexShrink:0,border:'2px solid rgba(0,0,0,0.06)'}}>
            <Image src={profileUrl} alt={`${name} avatar`} width={72} height={72} style={{objectFit:'cover'}}/>
          </div>
          <div style={infoStyle}>
            <h3 style={nameStyle}>{name}</h3>
            <p style={metaStyle}>{email}</p>
            <span style={roleChip}>{role}</span>
          </div>
        </div>

        <div style={{display:'flex',gap:'10px'}}>
          <button onClick={onEdit} style={{...btnCommon,background:'#60a5fa'}} title="Edit">Edit</button>
          <button onClick={onDelete} style={{...btnCommon,background:'#ef4444'}} title="Delete">Delete</button>
        </div>
      </div>
    )
}

export default UserModal