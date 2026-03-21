// src/pages/Announcments.jsx
// src/pages/Announcments.jsx
import React, { useState, useMemo, useEffect } from 'react'
import announcementService from '../services/announcementService'

const T = {
  primary: '#0061f2', primaryLight: '#dbeafe', primaryDark: '#0052cc',
  success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
  bg: '#f8fafc', surface: '#fff', surface2: '#f1f5f9',
  border: '#e2e8f0', text: '#0f172a', muted: '#64748b',
}

const TAG_OPTIONS = ['HR','Holiday','Policy','Wellness','IT','Event','Finance','Operations']
const TAG_COLORS  = {
  HR:'#0061f2', Holiday:'#10b981', Policy:'#f59e0b',
  Wellness:'#06b6d4', IT:'#8b5cf6', Event:'#ec4899',
  Finance:'#0284c7', Operations:'#64748b',
}

function tagColor(tag) { return TAG_COLORS[tag] || '#64748b' }

function fmtDate(ds) {
  return new Date(ds + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
}

// ── SVG Icons ──────────────────────────────────────────────────
const IcoMegaphone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
  </svg>
)
const IcoClipboard = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
  </svg>
)
const IcoCalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IcoUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IcoFileText = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
)
const IcoPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IcoSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IcoEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const IcoEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IcoTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const IcoWarn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const IcoEmpty = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
  </svg>
)
const IcoX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

// ── Modal ──────────────────────────────────────────────────────
function Modal({ open, onClose, title, icon, iconBg, children, width=520 }) {
  if (!open) return null
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()} style={{
      position:'fixed', inset:0, background:'rgba(15,23,42,.45)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:1000, backdropFilter:'blur(3px)',
    }}>
      <div style={{
        background:T.surface, borderRadius:20, width, maxWidth:'92vw',
        maxHeight:'90vh', overflow:'auto',
        boxShadow:'0 24px 64px rgba(0,0,0,.2)',
      }}>
        {/* Header */}
        <div style={{
          background: iconBg || 'linear-gradient(135deg,#0061f2,#0052cc)',
          padding:'20px 24px', borderRadius:'20px 20px 0 0',
          display:'flex', alignItems:'center', gap:12,
        }}>
          {icon && (
            <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>
              {icon}
            </div>
          )}
          <div style={{ flex:1, fontWeight:800, fontSize:16, color:'#fff' }}>{title}</div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.15)', border:'none', cursor:'pointer', width:30, height:30, borderRadius:8, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <IcoX/>
          </button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  )
}

// ── Form ────────────────────────────────────────────────────────
function AnnouncementForm({ form, setForm }) {
  const c = tagColor(form.tag)
  const inputStyle = {
    border:`1.5px solid ${T.border}`, borderRadius:10, padding:'10px 14px',
    fontSize:14, outline:'none', color:T.text, fontFamily:"'DM Sans',sans-serif",
    transition:'border-color .2s', width:'100%', boxSizing:'border-box',
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        <label style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:'uppercase', letterSpacing:'.5px' }}>Title *</label>
        <input type="text" value={form.title} onChange={e => setForm(p => ({...p, title:e.target.value}))} placeholder="Announcement title"
          onFocus={e => e.target.style.borderColor='#0061f2'} onBlur={e => e.target.style.borderColor=T.border}
          style={inputStyle}
        />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          <label style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:'uppercase', letterSpacing:'.5px' }}>Date *</label>
          <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date:e.target.value}))}
            onFocus={e => e.target.style.borderColor='#0061f2'} onBlur={e => e.target.style.borderColor=T.border}
            style={inputStyle}
          />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          <label style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:'uppercase', letterSpacing:'.5px' }}>Category *</label>
          <select value={form.tag} onChange={e => setForm(p => ({...p, tag:e.target.value}))}
            onFocus={e => e.target.style.borderColor='#0061f2'} onBlur={e => e.target.style.borderColor=T.border}
            style={{...inputStyle, cursor:'pointer'}}
          >
            {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        <label style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:'uppercase', letterSpacing:'.5px' }}>Message *</label>
        <textarea rows={4} value={form.msg} onChange={e => setForm(p => ({...p, msg:e.target.value}))} placeholder="Write the announcement content here..."
          onFocus={e => e.target.style.borderColor='#0061f2'} onBlur={e => e.target.style.borderColor=T.border}
          style={{...inputStyle, resize:'vertical'}}
        />
      </div>
      {form.title && (
        <div style={{ borderRadius:12, padding:16, border:`1px solid ${T.border}`, background:T.surface2, borderLeft:`4px solid ${c}` }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:'uppercase', marginBottom:6 }}>Preview</div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <span style={{ padding:'2px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:`${c}18`, color:c }}>{form.tag}</span>
            <span style={{ fontSize:11, color:T.muted }}>{form.date ? fmtDate(form.date) : '—'}</span>
          </div>
          <div style={{ fontWeight:700, fontSize:14, color:T.text, marginBottom:4 }}>{form.title}</div>
          <div style={{ fontSize:13, color:T.muted, lineHeight:1.6 }}>{form.msg || 'No message yet...'}</div>
        </div>
      )}
    </div>
  )
}

export default function AdminAnnouncements() {
  const [items, setItems]           = useState([])
  const [tagFilter, setTagFilter]   = useState('All')
  const [search, setSearch]         = useState('')
  const [showAdd, setShowAdd]       = useState(false)
  const [editItem, setEditItem]     = useState(null)
  const [deleteId, setDeleteId]     = useState(null)
  const [viewItem, setViewItem]     = useState(null)
  const [form, setForm]             = useState({ title:'', date:'', tag:'HR', msg:'' })
  const [formError, setFormError]   = useState('')
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    announcementService.getAnnouncements().then(data => data && setItems(Array.isArray(data) ? data : []))
  }, [])

  const filtered = useMemo(() => {
    let list = tagFilter === 'All' ? items : items.filter(i => (i.tag||'HR') === tagFilter)
    const d   = i => i.date || i.created_at?.slice(0,10) || ''
    const txt = i => ((i.title||'') + ' ' + (i.msg||i.message||'')).toLowerCase()
    if (search.trim()) list = list.filter(i => txt(i).includes(search.toLowerCase()))
    return [...list].sort((a,b) => (d(b)||'').localeCompare(d(a)||''))
  }, [items, tagFilter, search])

  function openAdd()   { setForm({ title:'', date:'', tag:'HR', msg:'' }); setFormError(''); setShowAdd(true) }
  function closeAdd()  { setShowAdd(false); setFormError('') }
  function openEdit(it){ setForm({ title:it.title, date:it.date, tag:it.tag, msg:it.msg }); setFormError(''); setEditItem(it) }
  function closeEdit() { setEditItem(null); setFormError('') }

  function validate() {
    if (!form.title.trim()) { setFormError('Title is required.');   return false }
    if (!form.date)         { setFormError('Date is required.');     return false }
    if (!form.msg.trim())   { setFormError('Message is required.'); return false }
    return true
  }

  async function handleAdd() {
    if (!validate()) return
    setLoading(true)
    try {
      await announcementService.createAnnouncement({ title:form.title.trim(), date:form.date, tag:form.tag, msg:form.msg.trim() })
      const data = await announcementService.getAnnouncements()
      setItems(Array.isArray(data) ? data : [])
      closeAdd()
    } catch (err) { setFormError(err.message || 'Failed to create') }
    finally { setLoading(false) }
  }

  async function handleEdit() {
    if (!validate()) return
    setLoading(true)
    try {
      await announcementService.updateAnnouncement(editItem.id, { title:form.title.trim(), date:form.date, tag:form.tag, msg:form.msg.trim() })
      setItems(prev => prev.map(i => i.id===editItem.id ? {...i, title:form.title.trim(), date:form.date, tag:form.tag, msg:form.msg.trim()} : i))
      closeEdit()
    } catch (err) { setFormError(err.message || 'Failed to update') }
    finally { setLoading(false) }
  }

  async function handleDelete() {
    setLoading(true)
    try {
      await announcementService.deleteAnnouncement(deleteId)
      setItems(prev => prev.filter(i => i.id !== deleteId))
      setDeleteId(null)
    } catch (err) { alert(err.message || 'Failed to delete') }
    finally { setLoading(false) }
  }

  const allTags = ['All', ...TAG_OPTIONS.filter(t => items.some(i => (i.tag||'HR') === t))]
  const thisMonth = new Date().toISOString().slice(0,7)

  const STATS = [
    { label:'Total',      value:items.length,                                   Ico:IcoClipboard, iconBg:'#dbeafe', iconColor:'#0061f2' },
    { label:'This Month', value:items.filter(i=>(i.date||'').startsWith(thisMonth)).length, Ico:IcoCalendar, iconBg:'#d1fae5', iconColor:'#10b981' },
    { label:'HR',         value:items.filter(i=>i.tag==='HR').length,           Ico:IcoUsers,     iconBg:'#dbeafe', iconColor:'#1d4ed8' },
    { label:'Policy',     value:items.filter(i=>i.tag==='Policy').length,       Ico:IcoFileText,  iconBg:'#fef3c7', iconColor:'#f59e0b' },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background:'linear-gradient(135deg, #0061f2 0%, #0052cc 55%, #0284c7 100%)',
        borderRadius:18, padding:'28px 36px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        boxShadow:'0 8px 32px rgba(0,97,242,.28)', position:'relative', overflow:'hidden',
      }}>
        {[[-30,-30,220],[80,-70,150],[220,50,100]].map(([r,t,s],i) => (
          <div key={i} style={{ position:'absolute', right:r, top:t, width:s, height:s, borderRadius:'50%', background:'rgba(255,255,255,.06)', pointerEvents:'none' }}/>
        ))}
        <div style={{ position:'relative', display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>
            <IcoMegaphone/>
          </div>
          <div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.65)', marginBottom:5, fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' }}>Admin · Communication</div>
            <div style={{ fontWeight:800, fontSize:26, color:'#fff', marginBottom:6, lineHeight:1.1 }}>Announcements</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.8)' }}>Publish company-wide notices and updates for all employees.</div>
          </div>
        </div>
        <button onClick={openAdd}
          onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
          style={{
            background:'#fff', color:'#0061f2', border:'none', borderRadius:12,
            padding:'13px 24px', fontSize:14, fontWeight:700, cursor:'pointer',
            flexShrink:0, display:'flex', alignItems:'center', gap:8,
            boxShadow:'0 4px 16px rgba(0,0,0,.12)', transition:'transform .2s',
          }}>
          <IcoPlus/> New Announcement
        </button>
      </div>

      {/* ── Stats ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {STATS.map(({ label, value, Ico, iconBg, iconColor }) => (
          <div key={label} style={{
            background:T.surface, borderRadius:14, border:`1px solid ${T.border}`,
            boxShadow:'0 1px 3px rgba(0,0,0,.06)', padding:'18px 20px',
            display:'flex', alignItems:'center', gap:16,
          }}>
            <div style={{ width:50, height:50, borderRadius:14, background:iconBg, color:iconColor, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Ico/>
            </div>
            <div>
              <div style={{ fontSize:28, fontWeight:800, lineHeight:1, color:T.text }}>{value}</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:4, fontWeight:500 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters + Search ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', background:'#f1f5f9', borderRadius:10, padding:3, gap:2, flexWrap:'wrap' }}>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setTagFilter(tag)} style={{
              padding:'7px 16px', borderRadius:8, border:'none',
              cursor:'pointer', fontSize:13, fontWeight:600,
              background:  tagFilter===tag ? '#0061f2' : 'transparent',
              color:       tagFilter===tag ? '#fff'    : T.muted,
              fontFamily:"'DM Sans',sans-serif", transition:'all .15s',
            }}>{tag}</button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:10, padding:'0 14px', width:250, transition:'border-color .2s' }}
          onFocusCapture={e => e.currentTarget.style.borderColor='#0061f2'}
          onBlurCapture={e  => e.currentTarget.style.borderColor=T.border}
        >
          <span style={{ color:T.muted, display:'flex' }}><IcoSearch/></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search announcements..."
            style={{ border:'none', outline:'none', background:'transparent', fontSize:13, color:T.text, fontFamily:"'DM Sans',sans-serif", padding:'9px 0', width:'100%' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:T.muted, display:'flex' }}><IcoX/></button>}
        </div>
      </div>

      {/* ── Announcements Grid ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 0', color:T.muted }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:12, color:'#cbd5e1' }}><IcoEmpty/></div>
          <div style={{ fontWeight:700, fontSize:15 }}>No announcements found</div>
          <div style={{ fontSize:13, marginTop:4 }}>Try adjusting your search or filter.</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
          {filtered.map(it => {
            const c = tagColor(it.tag||'HR')
            return (
              <div key={it.id}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 24px rgba(0,97,242,.12)` }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,.06)' }}
                style={{
                  background:T.surface, borderRadius:14, border:`1px solid ${T.border}`,
                  boxShadow:'0 1px 3px rgba(0,0,0,.06)', padding:20,
                  display:'flex', flexDirection:'column', gap:12,
                  borderLeft:`4px solid ${c}`, transition:'all .2s',
                }}>
                {/* Header row */}
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                  <span style={{ padding:'3px 12px', borderRadius:99, fontSize:11, fontWeight:700, background:`${c}18`, color:c }}>{it.tag||'HR'}</span>
                  <span style={{ fontSize:12, color:T.muted, flexShrink:0 }}>{fmtDate(it.date||it.created_at?.slice(0,10)||'')}</span>
                </div>
                {/* Title + preview */}
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:6, lineHeight:1.3 }}>{it.title}</div>
                  <div style={{ fontSize:13, color:T.muted, lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{it.msg||it.message}</div>
                </div>
                {/* Actions */}
                <div style={{ display:'flex', gap:6, marginTop:'auto', paddingTop:8, borderTop:`1px solid ${T.border}` }}>
                  <button onClick={() => setViewItem(it)}
                    onMouseEnter={e => { e.currentTarget.style.background=T.surface2; e.currentTarget.style.borderColor='#94a3b8' }}
                    onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor=T.border }}
                    style={{ flex:1, padding:'7px', borderRadius:8, border:`1px solid ${T.border}`, background:'#fff', color:T.muted, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:5, transition:'all .15s' }}>
                    <IcoEye/> View
                  </button>
                  <button onClick={() => openEdit(it)}
                    onMouseEnter={e => { e.currentTarget.style.background='#0061f2'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#0061f2' }}
                    onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#0061f2'; e.currentTarget.style.borderColor=T.border }}
                    style={{ flex:1, padding:'7px', borderRadius:8, border:`1px solid ${T.border}`, background:'#fff', color:'#0061f2', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:5, transition:'all .15s' }}>
                    <IcoEdit/> Edit
                  </button>
                  <button onClick={() => setDeleteId(it.id)}
                    onMouseEnter={e => { e.currentTarget.style.background=T.danger; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor=T.danger }}
                    onMouseLeave={e => { e.currentTarget.style.background='#fff0f0'; e.currentTarget.style.color=T.danger; e.currentTarget.style.borderColor='#fca5a5' }}
                    style={{ flex:1, padding:'7px', borderRadius:8, border:'1px solid #fca5a5', background:'#fff0f0', color:T.danger, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:5, transition:'all .15s' }}>
                    <IcoTrash/> Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Add Modal ── */}
      <Modal open={showAdd} onClose={closeAdd} title="New Announcement" icon={<IcoMegaphone/>}>
        <AnnouncementForm form={form} setForm={setForm}/>
        {formError && <div style={{ fontSize:13, color:T.danger, background:'#fff0f0', border:'1px solid #fca5a5', borderRadius:9, padding:'9px 12px', marginTop:8 }}>{formError}</div>}
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
          <button onClick={closeAdd} style={{ padding:'9px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:T.surface2, color:T.muted, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleAdd} disabled={loading} style={{ padding:'9px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#0061f2,#0052cc)', color:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 12px rgba(0,97,242,.3)', display:'flex', alignItems:'center', gap:8 }}>
            <IcoPlus/> Publish
          </button>
        </div>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal open={!!editItem} onClose={closeEdit} title="Edit Announcement" icon={<IcoEdit/>}>
        <AnnouncementForm form={form} setForm={setForm}/>
        {formError && <div style={{ fontSize:13, color:T.danger, background:'#fff0f0', border:'1px solid #fca5a5', borderRadius:9, padding:'9px 12px', marginTop:8 }}>{formError}</div>}
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
          <button onClick={closeEdit} style={{ padding:'9px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:T.surface2, color:T.muted, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleEdit} disabled={loading} style={{ padding:'9px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#0061f2,#0052cc)', color:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 12px rgba(0,97,242,.3)' }}>Save Changes</button>
        </div>
      </Modal>

      {/* ── View Modal ── */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.title || 'Announcement'} icon={<IcoEye/>}>
        {viewItem && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <span style={{ padding:'3px 12px', borderRadius:99, fontSize:12, fontWeight:700, background:`${tagColor(viewItem.tag||'HR')}18`, color:tagColor(viewItem.tag||'HR') }}>{viewItem.tag||'HR'}</span>
              <span style={{ fontSize:13, color:T.muted }}>{fmtDate(viewItem.date||viewItem.created_at?.slice(0,10)||'')}</span>
            </div>
            <div style={{ padding:20, borderRadius:12, background:T.surface2, borderLeft:`4px solid ${tagColor(viewItem.tag||'HR')}`, fontSize:14, color:T.text, lineHeight:1.8 }}>
              {viewItem.msg||viewItem.message}
            </div>
            <div style={{ marginTop:20, display:'flex', justifyContent:'flex-end', gap:8 }}>
              <button onClick={() => { setViewItem(null); openEdit(viewItem) }}
                style={{ padding:'8px 20px', borderRadius:9, border:`1px solid ${T.border}`, background:T.surface, color:'#0061f2', cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', gap:6 }}>
                <IcoEdit/> Edit
              </button>
              <button onClick={() => setViewItem(null)}
                style={{ padding:'8px 24px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#0061f2,#0052cc)', color:'#fff', cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirm ── */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" icon={<IcoWarn/>} iconBg="linear-gradient(135deg,#ef4444,#dc2626)">
        <div style={{ fontSize:14, color:T.text, marginBottom:20, lineHeight:1.7 }}>
          Are you sure you want to delete <strong>"{items.find(i=>i.id===deleteId)?.title}"</strong>? Employees will no longer see this announcement.
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={() => setDeleteId(null)} style={{ padding:'9px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:T.surface2, color:T.muted, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleDelete} disabled={loading} style={{ padding:'9px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#ef4444,#dc2626)', color:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 12px rgba(239,68,68,.3)', display:'flex', alignItems:'center', gap:8 }}>
            <IcoTrash/> Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}