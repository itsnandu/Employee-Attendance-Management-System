import React from 'react'

export default function Input({
  label, name, type='text', value, onChange,
  placeholder, error, icon, required, disabled, style={}
}) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6, ...style }}>
      {label && (
        <label style={{ fontSize:13, fontWeight:600, color:'var(--text-muted)', letterSpacing:'.03em' }}>
          {label}{required && <span style={{ color:'var(--danger)' }}> *</span>}
        </label>
      )}
      <div style={{ position:'relative' }}>
        {icon && (
          <span style={{
            position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
            color:'var(--text-muted)', display:'flex', pointerEvents:'none'
          }}>{icon}</span>
        )}
        <input
          name={name} type={type} value={value} onChange={onChange}
          placeholder={placeholder} required={required} disabled={disabled}
          style={{
            width:'100%', padding: icon ? '10px 14px 10px 40px' : '10px 14px',
            border:`1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius:10, fontSize:14, fontFamily:'DM Sans, sans-serif',
            color:'var(--text)', background:'var(--surface)',
            outline:'none', transition:'border-color .2s',
          }}
          onFocus={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--primary)'}
          onBlur={e  => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
        />
      </div>
      {error && <span style={{ fontSize:12, color:'var(--danger)' }}>{error}</span>}
    </div>
  )
}