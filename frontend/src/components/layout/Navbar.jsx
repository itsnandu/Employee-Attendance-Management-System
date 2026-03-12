import React, { useState } from 'react'
import { Bell, Search, Menu } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import { getInitials } from '../../utils/helpers'

const PAGE_TITLES = {
  dashboard:'Dashboard', employees:'Employees',
  attendance:'Attendance', leave:'Leave Management', reports:'Reports', usermanagement:'User Management',
}

export default function Navbar({ page, collapsed, setCollapsed }) {
  const { user } = useAuth()
  const [q, setQ] = useState('')
  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })

  return (
    <header style={{
      height:'var(--navbar-h)', background:'var(--surface)',
      borderBottom:'1px solid var(--border)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 24px', gap:16, position:'sticky', top:0, zIndex:100,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <button onClick={() => setCollapsed(c => !c)} style={{
          background:'none', border:'none', cursor:'pointer',
          color:'var(--text-muted)', display:'flex', padding:4,
        }}><Menu size={20}/></button>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, lineHeight:1.2 }}>{PAGE_TITLES[page]}</h1>
          <p style={{ fontSize:12, color:'var(--text-muted)' }}>{today}</p>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
          <Search size={16} style={{ position:'absolute', left:12, color:'var(--text-muted)' }}/>
          <input value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Search…"
            style={{
              paddingLeft:36, paddingRight:14, paddingTop:8, paddingBottom:8,
              border:'1.5px solid var(--border)', borderRadius:10, fontSize:14,
              fontFamily:'DM Sans,sans-serif', width:200, outline:'none',
              background:'var(--surface2)', color:'var(--text)',
            }}
          />
        </div>
        <button style={{
          position:'relative', background:'var(--surface2)', border:'1.5px solid var(--border)',
          borderRadius:10, padding:8, cursor:'pointer', display:'flex', color:'var(--text-muted)',
        }}>
          <Bell size={18}/>
          <span style={{
            position:'absolute', top:6, right:6, width:8, height:8,
            background:'var(--danger)', borderRadius:'50%', border:'2px solid var(--surface)',
          }}/>
        </button>
        <div style={{
          width:36, height:36, borderRadius:10,
          background:'linear-gradient(135deg,var(--primary),var(--accent))',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer',
        }}>{getInitials(user?.name||'A')}</div>
      </div>
    </header>
  )
}