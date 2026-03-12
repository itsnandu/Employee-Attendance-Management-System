// src/pages/AdminAnnouncements.jsx
import React, { useState, useMemo } from 'react'

const T = {
  primary: '#4f46e5', primaryLight: '#e0e7ff', accent: '#06b6d4',
  success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
  bg: '#f8fafc', surface: '#fff', surface2: '#f1f5f9',
  border: '#e2e8f0', text: '#0f172a', muted: '#64748b',
}

const TAG_OPTIONS = ['HR', 'Holiday', 'Policy', 'Wellness', 'IT', 'Event', 'Finance', 'Operations']
const TAG_COLORS  = {
  HR:         '#4f46e5', Holiday:    '#10b981', Policy:     '#f59e0b',
  Wellness:   '#06b6d4', IT:         '#8b5cf6', Event:      '#ec4899',
  Finance:    '#0891b2', Operations: '#64748b',
}

function tagColor(tag) { return TAG_COLORS[tag] || '#64748b' }

const INITIAL = [
  { id:1, title:'Q1 Performance Reviews',   date:'2026-03-01', tag:'HR',       msg:'Q1 appraisal cycle begins April 1st. Please complete self-assessments by March 28.' },
  { id:2, title:'Office Closed – Holi',     date:'2026-03-14', tag:'Holiday',  msg:'Office will remain closed on March 14th for Holi. Enjoy the festival!' },
  { id:3, title:'New WFH Policy',           date:'2026-02-20', tag:'Policy',   msg:'Updated WFH policy allows 2 days per week for senior staff. Refer to HR portal for details.' },
  { id:4, title:'Health Checkup Camp',      date:'2026-02-10', tag:'Wellness', msg:'Free health checkup camp on Feb 15th in the cafeteria, 10am–2pm.' },
  { id:5, title:'Diwali Bonus Announcement',date:'2026-10-20', tag:'HR',       msg:'All employees are eligible for a Diwali bonus equivalent to 1 months basic salary, credited by November 1st.' },
  { id:6, title:'IT Infrastructure Upgrade',date:'2025-10-10', tag:'IT',       msg:'Scheduled maintenance on Oct 12th 11pm–2am. Systems will be briefly unavailable. Save your work beforehand.' },
  { id:7, title:'Annual Sports Day',        date:'2025-09-28', tag:'Event',    msg:'Annual company sports day on October 5th at the corporate grounds. Register your team by Oct 1st.' },
  { id:8, title:'Updated Code of Conduct',  date:'2025-09-15', tag:'Policy',   msg:'Please review the updated Code of Conduct on the HR portal. Acknowledgment required by Sep 30.' },
]

function fmtDate(ds) {
  return new Date(ds + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
}

// ── Modal ──────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width=520 }) {
  if (!open) return null
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()} style={{
      position:'fixed', inset:0, background:'rgba(15,23,42,.45)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:1000, backdropFilter:'blur(3px)',
    }}>
      <div style={{
        background:T.surface, borderRadius:16, width, maxWidth:'92vw',
        maxHeight:'90vh', overflow:'auto', padding:28,
        boxShadow:'0 20px 60px rgba(0,0,0,.2)',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:T.text }}>{title}</div>
          <button onClick={onClose} style={{ border:'none', background:T.surface2, cursor:'pointer', width:32, height:32, borderRadius:8, fontSize:16, color:T.muted }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Form ────────────────────────────────────────────────────────
function AnnouncementForm({ form, setForm }) {
  const color = tagColor(form.tag)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        <label style={{ fontSize:12, fontWeight:600, color:T.muted, textTransform:'uppercase', letterSpacing:'.4px' }}>Title *</label>
        <input type="text" value={form.title} onChange={e => setForm(p => ({...p, title:e.target.value}))} placeholder="Announcement title"
          style={{ border:`1.5px solid ${T.border}`, borderRadius:9, padding:'10px 12px', fontSize:14, outline:'none', color:T.text, fontFamily:"'DM Sans',sans-serif" }}
        />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          <label style={{ fontSize:12, fontWeight:600, color:T.muted, textTransform:'uppercase', letterSpacing:'.4px' }}>Date *</label>
          <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date:e.target.value}))}
            style={{ border:`1.5px solid ${T.border}`, borderRadius:9, padding:'10px 12px', fontSize:14, outline:'none', color:T.text, fontFamily:"'DM Sans',sans-serif" }}
          />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          <label style={{ fontSize:12, fontWeight:600, color:T.muted, textTransform:'uppercase', letterSpacing:'.4px' }}>Category *</label>
          <select value={form.tag} onChange={e => setForm(p => ({...p, tag:e.target.value}))}
            style={{ border:`1.5px solid ${T.border}`, borderRadius:9, padding:'10px 12px', fontSize:14, outline:'none', color:T.text, fontFamily:"'DM Sans',sans-serif", cursor:'pointer' }}
          >
            {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        <label style={{ fontSize:12, fontWeight:600, color:T.muted, textTransform:'uppercase', letterSpacing:'.4px' }}>Message *</label>
        <textarea rows={4} value={form.msg} onChange={e => setForm(p => ({...p, msg:e.target.value}))} placeholder="Write the announcement content here..."
          style={{ border:`1.5px solid ${T.border}`, borderRadius:9, padding:'10px 12px', fontSize:14, outline:'none', color:T.text, resize:'vertical', fontFamily:"'DM Sans',sans-serif" }}
        />
      </div>
      {/* Preview */}
      {form.title && (
        <div style={{ borderRadius:12, padding:16, border:`1px solid ${T.border}`, background:T.surface2, borderLeft:`4px solid ${color}` }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:'uppercase', marginBottom:6 }}>Preview</div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <span style={{ padding:'2px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:`${color}18`, color }}>{form.tag}</span>
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
  const [items, setItems]       = useState(INITIAL)
  const [tagFilter, setTagFilter] = useState('All')
  const [search, setSearch]     = useState('')
  const [showAdd, setShowAdd]   = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [form, setForm]         = useState({ title:'', date:'', tag:'HR', msg:'' })
  const [formError, setFormError] = useState('')

  const filtered = useMemo(() => {
    let list = tagFilter === 'All' ? items : items.filter(i => i.tag === tagFilter)
    if (search.trim()) list = list.filter(i =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.msg.toLowerCase().includes(search.toLowerCase())
    )
    return [...list].sort((a,b) => b.date.localeCompare(a.date))
  }, [items, tagFilter, search])

  function openAdd()  { setForm({ title:'', date:'', tag:'HR', msg:'' }); setFormError(''); setShowAdd(true) }
  function closeAdd() { setShowAdd(false); setFormError('') }
  function openEdit(it) { setForm({ title:it.title, date:it.date, tag:it.tag, msg:it.msg }); setFormError(''); setEditItem(it) }
  function closeEdit() { setEditItem(null); setFormError('') }

  function validate() {
    if (!form.title.trim()) { setFormError('Title is required.'); return false }
    if (!form.date)         { setFormError('Date is required.'); return false }
    if (!form.msg.trim())   { setFormError('Message is required.'); return false }
    return true
  }

  function handleAdd() {
    if (!validate()) return
    setItems(prev => [{ id:Date.now(), title:form.title.trim(), date:form.date, tag:form.tag, msg:form.msg.trim() }, ...prev])
    closeAdd()
  }

  function handleEdit() {
    if (!validate()) return
    setItems(prev => prev.map(i => i.id===editItem.id ? {...i, title:form.title.trim(), date:form.date, tag:form.tag, msg:form.msg.trim()} : i))
    closeEdit()
  }

  function handleDelete() {
    setItems(prev => prev.filter(i => i.id !== deleteId))
    setDeleteId(null)
  }

  const allTags = ['All', ...TAG_OPTIONS.filter(t => items.some(i => i.tag === t))]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Header ── */}
      <div style={{
        background:'linear-gradient(120deg, #0891b2 0%, #0e7490 100%)',
        borderRadius:16, padding:'24px 32px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        boxShadow:'0 4px 24px rgba(8,145,178,.28)', position:'relative', overflow:'hidden',
      }}>
        {[[-20,-20,180],[60,-60,100]].map(([r,t,s],i) => (
          <div key={i} style={{ position:'absolute', right:r, top:t, width:s, height:s, borderRadius:'50%', background:'rgba(255,255,255,.07)' }}/>
        ))}
        <div style={{ position:'relative' }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.65)', marginBottom:4, fontWeight:600, letterSpacing:'.5px', textTransform:'uppercase' }}>Admin · Communication</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, color:'#fff', marginBottom:6 }}>📢 Announcements</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,.8)' }}>Publish company-wide notices and updates for all employees.</div>
        </div>
        <button onClick={openAdd} style={{
          background:'#fff', color:'#0891b2', border:'none', borderRadius:10,
          padding:'12px 24px', fontSize:14, fontWeight:700, cursor:'pointer', flexShrink:0, position:'relative',
        }}>+ New Announcement</button>
      </div>

      {/* ── Stats ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {[
          { label:'Total',    value:items.length,                                     icon:'📋', iconBg:'#ede9fe', iconColor:'#4f46e5' },
          { label:'This Month', value:items.filter(i=>i.date.startsWith('2026-03')).length, icon:'📅', iconBg:'#dbeafe', iconColor:'#1d4ed8' },
          { label:'HR',       value:items.filter(i=>i.tag==='HR').length,             icon:'👔', iconBg:'#d1fae5', iconColor:'#10b981' },
          { label:'Policy',   value:items.filter(i=>i.tag==='Policy').length,         icon:'📜', iconBg:'#fef3c7', iconColor:'#f59e0b' },
        ].map(c => (
          <div key={c.label} style={{
            background:T.surface, borderRadius:14, border:`1px solid ${T.border}`,
            boxShadow:'0 1px 3px rgba(0,0,0,.06)', padding:'16px 20px',
            display:'flex', alignItems:'center', gap:14,
          }}>
            <div style={{ width:44, height:44, borderRadius:12, background:c.iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize:26, fontWeight:800, fontFamily:"'Syne',sans-serif", lineHeight:1 }}>{c.value}</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:3 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters + Search ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setTagFilter(tag)} style={{
              padding:'7px 16px', borderRadius:8, border:'1.5px solid',
              cursor:'pointer', fontSize:13, fontWeight:600,
              background:  tagFilter===tag ? T.primary : T.surface,
              color:       tagFilter===tag ? '#fff'    : T.muted,
              borderColor: tagFilter===tag ? T.primary : T.border,
              fontFamily:"'DM Sans',sans-serif",
            }}>{tag}</button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:T.surface2, border:`1.5px solid ${T.border}`, borderRadius:10, padding:'0 14px', width:250 }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search announcements..."
            style={{ border:'none', outline:'none', background:'transparent', fontSize:13, color:T.text, fontFamily:"'DM Sans',sans-serif", padding:'9px 0', width:'100%' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:T.muted, fontSize:16 }}>×</button>}
        </div>
      </div>

      {/* ── Announcements Grid ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 0', color:T.muted }}>
          <div style={{ fontSize:40, marginBottom:10 }}>📢</div>
          <div style={{ fontWeight:700 }}>No announcements found</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
          {filtered.map(it => {
            const c = tagColor(it.tag)
            return (
              <div key={it.id} style={{
                background:T.surface, borderRadius:14,
                border:`1px solid ${T.border}`,
                boxShadow:'0 1px 3px rgba(0,0,0,.06)',
                padding:20, display:'flex', flexDirection:'column', gap:12,
                borderLeft:`4px solid ${c}`,
                transition:'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 6px 20px rgba(0,0,0,.1)` }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,.06)' }}
              >
                {/* Header */}
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                  <div>
                    <span style={{ padding:'3px 12px', borderRadius:99, fontSize:11, fontWeight:600, background:`${c}18`, color:c }}>{it.tag}</span>
                  </div>
                  <span style={{ fontSize:12, color:T.muted, flexShrink:0 }}>{fmtDate(it.date)}</span>
                </div>
                {/* Title + msg */}
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:6, lineHeight:1.3 }}>{it.title}</div>
                  <div style={{ fontSize:13, color:T.muted, lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{it.msg}</div>
                </div>
                {/* Actions */}
                <div style={{ display:'flex', gap:6, marginTop:'auto', paddingTop:8, borderTop:`1px solid ${T.border}` }}>
                  <button onClick={() => setViewItem(it)} style={{ flex:1, padding:'7px', borderRadius:8, border:`1px solid ${T.border}`, background:'#fff', color:T.muted, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>View</button>
                  <button onClick={() => openEdit(it)} style={{ flex:1, padding:'7px', borderRadius:8, border:`1px solid ${T.border}`, background:'#fff', color:T.primary, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Edit</button>
                  <button onClick={() => setDeleteId(it.id)} style={{ flex:1, padding:'7px', borderRadius:8, border:'1px solid #fca5a5', background:'#fff', color:T.danger, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Add Modal ── */}
      <Modal open={showAdd} onClose={closeAdd} title="📢 New Announcement">
        <AnnouncementForm form={form} setForm={setForm} />
        {formError && <div style={{ fontSize:13, color:T.danger, background:'#fff0f0', borderRadius:8, padding:'8px 12px', marginTop:8 }}>{formError}</div>}
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
          <button onClick={closeAdd} style={{ padding:'9px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:T.surface2, color:T.muted, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleAdd} style={{ padding:'9px 24px', borderRadius:10, border:'none', background:'#0891b2', color:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Publish</button>
        </div>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal open={!!editItem} onClose={closeEdit} title="✏️ Edit Announcement">
        <AnnouncementForm form={form} setForm={setForm} />
        {formError && <div style={{ fontSize:13, color:T.danger, background:'#fff0f0', borderRadius:8, padding:'8px 12px', marginTop:8 }}>{formError}</div>}
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
          <button onClick={closeEdit} style={{ padding:'9px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:T.surface2, color:T.muted, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleEdit} style={{ padding:'9px 24px', borderRadius:10, border:'none', background:T.primary, color:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Save Changes</button>
        </div>
      </Modal>

      {/* ── View Modal ── */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.title || ''}>
        {viewItem && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <span style={{ padding:'3px 12px', borderRadius:99, fontSize:12, fontWeight:600, background:`${tagColor(viewItem.tag)}18`, color:tagColor(viewItem.tag) }}>{viewItem.tag}</span>
              <span style={{ fontSize:13, color:T.muted }}>{fmtDate(viewItem.date)}</span>
            </div>
            <div style={{ padding:20, borderRadius:12, background:T.surface2, borderLeft:`4px solid ${tagColor(viewItem.tag)}`, fontSize:14, color:T.text, lineHeight:1.8 }}>
              {viewItem.msg}
            </div>
            <div style={{ marginTop:20, display:'flex', justifyContent:'flex-end', gap:8 }}>
              <button onClick={() => { setViewItem(null); openEdit(viewItem) }} style={{ padding:'8px 20px', borderRadius:9, border:`1px solid ${T.border}`, background:T.surface, color:T.primary, cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>Edit</button>
              <button onClick={() => setViewItem(null)} style={{ padding:'8px 24px', borderRadius:9, border:'none', background:T.primary, color:'#fff', cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirm ── */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="⚠️ Confirm Delete">
        <div style={{ fontSize:14, color:T.text, marginBottom:20, lineHeight:1.7 }}>
          Are you sure you want to delete <strong>"{items.find(i=>i.id===deleteId)?.title}"</strong>? Employees will no longer see this announcement.
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={() => setDeleteId(null)} style={{ padding:'9px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:T.surface2, color:T.muted, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleDelete} style={{ padding:'9px 24px', borderRadius:10, border:'none', background:T.danger, color:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Delete</button>
        </div>
      </Modal>
    </div>
  )
}