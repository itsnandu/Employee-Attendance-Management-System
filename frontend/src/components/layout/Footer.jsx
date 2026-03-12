import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      borderTop:'1px solid var(--border)', padding:'14px 24px',
      display:'flex', justifyContent:'space-between', alignItems:'center',
      fontSize:12, color:'var(--text-muted)', background:'var(--surface)',
    }}>
      <span>© 2026 HRMS Enterprise · All rights reserved</span>
      <span>v1.0.0 · Built with React + Vite</span>
    </footer>
  )
}