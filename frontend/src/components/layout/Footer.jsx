import React, { useState, useEffect } from 'react'

export default function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <footer style={{
      borderTop:'1px solid var(--border)',
      padding: isMobile ? '12px 16px' : '14px 24px',
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '8px' : '0',
      fontSize: isMobile ? '11px' : '12px',
      color:'var(--text-muted)',
      background:'var(--surface)',
      textAlign: isMobile ? 'center' : 'left',
    }}>
      <span>© 2026 HRMS Enterprise · All rights reserved</span>
      <span>v1.0.0 · Built with React + Vite</span>
    </footer>
  )
}