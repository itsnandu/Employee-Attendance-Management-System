import React from 'react'

const variants = {
  primary:   'background:var(--primary);color:#fff;border:none;',
  secondary: 'background:transparent;color:var(--primary);border:2px solid var(--primary);',
  danger:    'background:var(--danger);color:#fff;border:none;',
  ghost:     'background:transparent;color:var(--text-muted);border:1px solid var(--border);',
  success:   'background:var(--success);color:#fff;border:none;',
}

const sizes = {
  sm: 'padding:6px 14px;font-size:13px;',
  md: 'padding:10px 20px;font-size:14px;',
  lg: 'padding:13px 28px;font-size:15px;',
}

export default function Button({
  children, variant='primary', size='md',
  onClick, disabled, loading, icon, style={}, className='', type='button'
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      style={{
        display:'inline-flex', alignItems:'center', gap:8,
        borderRadius:10, fontFamily:'DM Sans, sans-serif',
        fontWeight:600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .6 : 1,
        transition:'all .2s', letterSpacing:'.01em',
        ...(Object.fromEntries(
          variants[variant].split(';').filter(Boolean)
            .map(r => { const [k,v]=r.split(':'); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v.trim()] })
        )),
        ...(Object.fromEntries(
          sizes[size].split(';').filter(Boolean)
            .map(r => { const [k,v]=r.split(':'); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v.trim()] })
        )),
        ...style,
      }}
    >
      {loading ? (
        <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.4)',
          borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite',
          display:'inline-block' }} />
      ) : icon}
      {children}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </button>
  )
}