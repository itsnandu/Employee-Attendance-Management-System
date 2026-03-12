import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, size='md', footer }) {
  const widths = { sm:400, md:560, lg:760, xl:960 }

  useEffect(() => {
    const handler = (e) => e.key==='Escape' && onClose?.()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <div
      onClick={e => e.target===e.currentTarget && onClose?.()}
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,.45)',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:1000, backdropFilter:'blur(4px)', padding:20,
        animation:'fadeIn .2s ease',
      }}
    >
      <div style={{
        background:'var(--surface)', borderRadius:16, width:'100%',
        maxWidth:widths[size], maxHeight:'90vh', overflow:'auto',
        boxShadow:'0 24px 80px rgba(0,0,0,.2)',
        animation:'slideUp .25s ease',
      }}>
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 24px', borderBottom:'1px solid var(--border)',
          position:'sticky', top:0, background:'var(--surface)', zIndex:1,
        }}>
          <h3 style={{ fontSize:18, fontWeight:700 }}>{title}</h3>
          <button onClick={onClose} style={{
            background:'var(--surface2)', border:'none', borderRadius:8,
            padding:6, cursor:'pointer', display:'flex', color:'var(--text-muted)',
          }}><X size={18}/></button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
        {footer && (
          <div style={{
            padding:'16px 24px', borderTop:'1px solid var(--border)',
            display:'flex', gap:10, justifyContent:'flex-end',
            position:'sticky', bottom:0, background:'var(--surface)',
          }}>{footer}</div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  )
}