// src/pages/AdminHolidays.jsx
import React, { useState, useMemo } from 'react'

const T = {
  primary: '#4f46e5', primaryLight: '#e0e7ff', accent: '#06b6d4',
  success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
  bg: '#f8fafc', surface: '#fff', surface2: '#f1f5f9',
  border: '#e2e8f0', text: '#0f172a', muted: '#64748b',
}

const TYPE_META = {
  public:    { label: 'Public',    bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  company:   { label: 'Company',   bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
  restricted:{ label: 'Restricted',bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const INITIAL_HOLIDAYS = [
  { id:1,  date:'2026-01-01', name:"New Year's Day",       type:'public'     },
  { id:2,  date:'2026-01-14', name:'Makar Sankranti',       type:'public'     },
  { id:3,  date:'2026-01-26', name:'Republic Day',          type:'public'     },
  { id:4,  date:'2026-03-25', name:'Holi',                  type:'public'     },
  { id:5,  date:'2026-04-02', name:'Ram Navami',            type:'restricted' },
  { id:6,  date:'2026-04-03', name:'Good Friday',           type:'public'     },
  { id:7,  date:'2026-04-14', name:'Ambedkar Jayanti',      type:'public'     },
  { id:8,  date:'2026-05-01', name:'Maharashtra Day',       type:'public'     },
  { id:9,  date:'2026-05-23', name:'Buddha Purnima',        type:'restricted' },
  { id:10, date:'2026-06-19', name:'Eid ul-Adha',           type:'public'     },
  { id:11, date:'2026-07-17', name:'Muharram',              type:'restricted' },
  { id:12, date:'2026-08-15', name:'Independence Day',      type:'public'     },
  { id:13, date:'2026-08-26', name:'Ganesh Chaturthi',      type:'public'     },
  { id:14, date:'2026-09-15', name:'Milad-un-Nabi',         type:'restricted' },
  { id:15, date:'2026-10-02', name:'Gandhi Jayanti',        type:'public'     },
  { id:16, date:'2026-10-20', name:'Dussehra',              type:'public'     },
  { id:17, date:'2026-10-28', name:'Diwali (Lakshmi Puja)', type:'public'     },
  { id:18, date:'2026-10-29', name:'Diwali (Padwa)',        type:'public'     },
  { id:19, date:'2026-10-30', name:'Bhai Dooj',             type:'restricted' },
  { id:20, date:'2026-11-15', name:'Guru Nanak Jayanti',    type:'public'     },
  { id:21, date:'2026-12-25', name:'Christmas',             type:'public'     },
  { id:22, date:'2026-12-31', name:'Year-End Closure',      type:'company'    },
]

function fmt(ds) {
  const d = new Date(ds + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })
}

// ── Reusable Modal ───────────────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position:'fixed', inset:0, background:'rgba(15,23,42,.45)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:1000, backdropFilter:'blur(3px)',
    }}>
      <div style={{
        background:T.surface, borderRadius:16, width:480, maxWidth:'92vw',
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

export default function AdminHolidays() {
  const [holidays, setHolidays] = useState(INITIAL_HOLIDAYS)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [showAdd, setShowAdd]   = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [form, setForm]         = useState({ date:'', name:'', type:'public' })
  const [formError, setFormError] = useState('')

  const filtered = useMemo(() => {
    let list = filter === 'all' ? holidays : holidays.filter(h => h.type === filter)
    if (search.trim()) list = list.filter(h => h.name.toLowerCase().includes(search.toLowerCase()))
    return [...list].sort((a,b) => a.date.localeCompare(b.date))
  }, [holidays, filter, search])

  // Group by month
  const byMonth = useMemo(() => {
    const m = {}
    filtered.forEach(h => {
      const mo = h.date.slice(0,7)
      if (!m[mo]) m[mo] = []
      m[mo].push(h)
    })
    return m
  }, [filtered])

  function openAdd()  { setForm({ date:'', name:'', type:'public' }); setFormError(''); setShowAdd(true) }
  function closeAdd() { setShowAdd(false); setFormError('') }

  function openEdit(h) { setForm({ date:h.date, name:h.name, type:h.type }); setFormError(''); setEditItem(h) }
  function closeEdit() { setEditItem(null); setFormError('') }

  function validate() {
    if (!form.date)       { setFormError('Date is required.'); return false }
    if (!form.name.trim()) { setFormError('Holiday name is required.'); return false }
    return true
  }

  function handleAdd() {
    if (!validate()) return
    setHolidays(prev => [...prev, { id: Date.now(), date:form.date, name:form.name.trim(), type:form.type }])
    closeAdd()
  }

  function handleEdit() {
    if (!validate()) return
    setHolidays(prev => prev.map(h => h.id === editItem.id ? { ...h, date:form.date, name:form.name.trim(), type:form.type } : h))
    closeEdit()
  }

  function handleDelete() {
    setHolidays(prev => prev.filter(h => h.id !== deleteId))
    setDeleteId(null)
  }

  const total   = holidays.length
  const pub     = holidays.filter(h => h.type === 'public').length
  const comp    = holidays.filter(h => h.type === 'company').length
  const restr   = holidays.filter(h => h.type === 'restricted').length

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Header banner ── */}
      <div style={{
        background:'linear-gradient(120deg, #4f46e5 0%, #3730a3 100%)',
        borderRadius:16, padding:'24px 32px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        boxShadow:'0 4px 24px rgba(79,70,229,.28)', position:'relative', overflow:'hidden',
      }}>
        {[[-20,-20,180],[60,-60,100]].map(([r,t,s],i) => (
          <div key={i} style={{ position:'absolute', right:r, top:t, width:s, height:s, borderRadius:'50%', background:'rgba(255,255,255,.07)' }}/>
        ))}
        <div style={{ position:'relative' }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.65)', marginBottom:4, fontWeight:600, letterSpacing:'.5px', textTransform:'uppercase' }}>Admin · HR Management</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, color:'#fff', marginBottom:6 }}>🗓 Allocate Holidays</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,.8)' }}>Manage public, company, and restricted holidays for 2026.</div>
        </div>
        <button onClick={openAdd} style={{
          background:'#fff', color:'#4f46e5', border:'none', borderRadius:10,
          padding:'12px 24px', fontSize:14, fontWeight:700, cursor:'pointer', flexShrink:0, position:'relative',
        }}>+ Add Holiday</button>
      </div>

      {/* ── Stats ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {[
          { label:'Total Holidays', value:total, icon:'📅', iconBg:'#ede9fe', iconColor:'#4f46e5' },
          { label:'Public',         value:pub,   icon:'🏛', iconBg:'#dbeafe', iconColor:'#1d4ed8' },
          { label:'Company',        value:comp,  icon:'🏢', iconBg:'#dcfce7', iconColor:'#15803d' },
          { label:'Restricted',     value:restr, icon:'📌', iconBg:'#fef9c3', iconColor:'#a16207' },
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
        <div style={{ display:'flex', gap:6 }}>
          {[['all','All'],['public','Public'],['company','Company'],['restricted','Restricted']].map(([val, lbl]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              padding:'7px 16px', borderRadius:8, border:'1.5px solid',
              cursor:'pointer', fontSize:13, fontWeight:600,
              background:  filter===val ? T.primary : T.surface,
              color:       filter===val ? '#fff'    : T.muted,
              borderColor: filter===val ? T.primary : T.border,
              fontFamily:"'DM Sans',sans-serif",
            }}>{lbl}</button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:T.surface2, border:`1.5px solid ${T.border}`, borderRadius:10, padding:'0 14px', width:240 }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search holiday..."
            style={{ border:'none', outline:'none', background:'transparent', fontSize:13, color:T.text, fontFamily:"'DM Sans',sans-serif", padding:'9px 0', width:'100%' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:T.muted, fontSize:16 }}>×</button>}
        </div>
      </div>

      {/* ── Holiday list by month ── */}
      {Object.keys(byMonth).length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 0', color:T.muted }}>
          <div style={{ fontSize:40, marginBottom:10 }}>🔍</div>
          <div style={{ fontWeight:700 }}>No holidays found</div>
        </div>
      ) : (
        Object.entries(byMonth).map(([mo, list]) => {
          const [y, m] = mo.split('-')
          return (
            <div key={mo}>
              <div style={{ fontSize:13, fontWeight:700, color:T.muted, textTransform:'uppercase', letterSpacing:'.6px', marginBottom:10 }}>
                {MONTH_NAMES[parseInt(m)-1]} {y}  ·  {list.length} holiday{list.length>1?'s':''}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {list.map(h => {
                  const meta = TYPE_META[h.type]
                  return (
                    <div key={h.id} style={{
                      display:'flex', alignItems:'center', gap:16,
                      padding:'14px 18px', borderRadius:12,
                      border:`1px solid ${T.border}`, background:T.surface,
                      borderLeft:`4px solid ${meta.dot}`,
                    }}>
                      {/* Date badge */}
                      <div style={{ minWidth:54, textAlign:'center', padding:'8px 4px', borderRadius:10, background:meta.bg, color:meta.color, flexShrink:0 }}>
                        <div style={{ fontSize:20, fontWeight:800, lineHeight:1 }}>{new Date(h.date+'T00:00:00').getDate()}</div>
                        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase' }}>{MONTH_NAMES[parseInt(h.date.slice(5,7))-1]}</div>
                      </div>
                      {/* Name + day */}
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:4 }}>{h.name}</div>
                        <div style={{ fontSize:12, color:T.muted }}>{fmt(h.date)}</div>
                      </div>
                      {/* Type badge */}
                      <span style={{ padding:'4px 12px', borderRadius:99, fontSize:12, fontWeight:600, background:meta.bg, color:meta.color }}>{meta.label}</span>
                      {/* Actions */}
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => openEdit(h)} style={{
                          padding:'6px 14px', borderRadius:8, border:`1px solid ${T.border}`, background:'#fff',
                          color:T.primary, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                        }}>Edit</button>
                        <button onClick={() => setDeleteId(h.id)} style={{
                          padding:'6px 12px', borderRadius:8, border:`1px solid #fca5a5`, background:'#fff',
                          color:T.danger, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                        }}>Delete</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      )}

      {/* ── Add Holiday Modal ── */}
      <Modal open={showAdd} onClose={closeAdd} title="🗓 Add Holiday">
        <HolidayForm form={form} setForm={setForm} error={formError} />
        {formError && <div style={{ fontSize:13, color:T.danger, background:'#fff0f0', borderRadius:8, padding:'8px 12px', marginTop:4 }}>{formError}</div>}
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
          <button onClick={closeAdd} style={{ padding:'9px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:T.surface2, color:T.muted, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleAdd} style={{ padding:'9px 24px', borderRadius:10, border:'none', background:T.primary, color:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Add Holiday</button>
        </div>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal open={!!editItem} onClose={closeEdit} title="✏️ Edit Holiday">
        <HolidayForm form={form} setForm={setForm} error={formError} />
        {formError && <div style={{ fontSize:13, color:T.danger, background:'#fff0f0', borderRadius:8, padding:'8px 12px', marginTop:4 }}>{formError}</div>}
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
          <button onClick={closeEdit} style={{ padding:'9px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:T.surface2, color:T.muted, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleEdit} style={{ padding:'9px 24px', borderRadius:10, border:'none', background:T.primary, color:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Save Changes</button>
        </div>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="⚠️ Confirm Delete">
        <div style={{ fontSize:14, color:T.text, marginBottom:20, lineHeight:1.7 }}>
          Are you sure you want to remove <strong>{holidays.find(h=>h.id===deleteId)?.name}</strong>? This will also remove it from the employee holiday calendar.
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={() => setDeleteId(null)} style={{ padding:'9px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:T.surface2, color:T.muted, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleDelete} style={{ padding:'9px 24px', borderRadius:10, border:'none', background:T.danger, color:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Delete Holiday</button>
        </div>
      </Modal>
    </div>
  )
}

function HolidayForm({ form, setForm }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        <label style={{ fontSize:12, fontWeight:600, color:T.muted, textTransform:'uppercase', letterSpacing:'.4px' }}>Date *</label>
        <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date:e.target.value}))}
          style={{ border:`1.5px solid ${T.border}`, borderRadius:9, padding:'10px 12px', fontSize:14, outline:'none', color:T.text, fontFamily:"'DM Sans',sans-serif" }}
        />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        <label style={{ fontSize:12, fontWeight:600, color:T.muted, textTransform:'uppercase', letterSpacing:'.4px' }}>Holiday Name *</label>
        <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name:e.target.value}))} placeholder="e.g. New Year's Day"
          style={{ border:`1.5px solid ${T.border}`, borderRadius:9, padding:'10px 12px', fontSize:14, outline:'none', color:T.text, fontFamily:"'DM Sans',sans-serif" }}
        />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        <label style={{ fontSize:12, fontWeight:600, color:T.muted, textTransform:'uppercase', letterSpacing:'.4px' }}>Type *</label>
        <select value={form.type} onChange={e => setForm(p => ({...p, type:e.target.value}))}
          style={{ border:`1.5px solid ${T.border}`, borderRadius:9, padding:'10px 12px', fontSize:14, outline:'none', color:T.text, fontFamily:"'DM Sans',sans-serif", cursor:'pointer' }}
        >
          <option value="public">Public Holiday</option>
          <option value="company">Company Holiday</option>
          <option value="restricted">Restricted Holiday</option>
        </select>
      </div>
    </div>
  )
}