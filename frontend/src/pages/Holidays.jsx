// src/pages/Holidays.jsx
// src/pages/Holidays.jsx
import React, { useState, useMemo, useEffect } from 'react'
import holidayService from '../services/holidayService'

const T = {
  primary: '#0061f2', primaryLight: '#dbeafe', primaryDark: '#0052cc',
  success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
  bg: '#f8fafc', surface: '#fff', surface2: '#f1f5f9',
  border: '#e2e8f0', text: '#0f172a', muted: '#64748b',
}

const TYPE_META = {
  public:    { label: 'Public',     bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  company:   { label: 'Company',    bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
  restricted:{ label: 'Restricted', bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function fmt(ds) {
  const d = new Date(ds + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })
}

// ── SVG Icons ────────────────────────────────────────────────────
const IcoCalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
  </svg>
)
const IcoGlobe = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
const IcoBuilding = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
    <path d="M9 21V9"/><path d="M3 3h18"/>
  </svg>
)
const IcoLock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IcoSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IcoPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IcoEmpty = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
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
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

// ── Reusable Modal ───────────────────────────────────────────────
function Modal({ open, onClose, title, icon, iconBg, iconColor, children }) {
  if (!open) return null
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position:'fixed', inset:0, background:'rgba(15,23,42,.45)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:1000, backdropFilter:'blur(3px)',
    }}>
      <div style={{
        background:T.surface, borderRadius:20, width:480, maxWidth:'92vw',
        maxHeight:'90vh', overflow:'auto',
        boxShadow:'0 24px 64px rgba(0,0,0,.2)',
      }}>
        {/* Modal header */}
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
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.15)', border:'none', cursor:'pointer', width:30, height:30, borderRadius:8, color:'#fff', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  )
}

export default function AdminHolidays() {
  const [holidays, setHolidays]   = useState([])
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')
  const [showAdd, setShowAdd]     = useState(false)
  const [editItem, setEditItem]   = useState(null)
  const [deleteId, setDeleteId]   = useState(null)
  const [form, setForm]           = useState({ date:'', name:'', type:'public' })
  const [formError, setFormError] = useState('')
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    holidayService.getHolidays().then(data => data && setHolidays(Array.isArray(data) ? data : []))
  }, [])

  const filtered = useMemo(() => {
    let list = filter === 'all' ? holidays : holidays.filter(h => h.type === filter)
    const nameOrTitle = h => (h.name || h.title || '').toLowerCase()
    if (search.trim()) list = list.filter(h => nameOrTitle(h).includes(search.toLowerCase()))
    return [...list].sort((a,b) => (a.date||a.holiday_date||'').localeCompare(b.date||b.holiday_date||''))
  }, [holidays, filter, search])

  const byMonth = useMemo(() => {
    const m = {}
    filtered.forEach(h => {
      const d = h.date || h.holiday_date || ''
      const mo = d.slice(0,7)
      if (!m[mo]) m[mo] = []
      m[mo].push({ ...h, date:d, name:h.name||h.title })
    })
    return m
  }, [filtered])

  function openAdd()  { setForm({ date:'', name:'', type:'public' }); setFormError(''); setShowAdd(true) }
  function closeAdd() { setShowAdd(false); setFormError('') }
  function openEdit(h) { setForm({ date:h.date||h.holiday_date||'', name:h.name||h.title||'', type:h.type||'public' }); setFormError(''); setEditItem(h) }
  function closeEdit() { setEditItem(null); setFormError('') }

  function validate() {
    if (!form.date)        { setFormError('Date is required.');         return false }
    if (!form.name.trim()) { setFormError('Holiday name is required.'); return false }
    return true
  }

  async function handleAdd() {
    if (!validate()) return
    setLoading(true)
    try {
      await holidayService.createHoliday({ date:form.date, name:form.name.trim(), type:form.type })
      const data = await holidayService.getHolidays()
      setHolidays(Array.isArray(data) ? data : [])
      closeAdd()
    } catch (err) { setFormError(err.message || 'Failed to add holiday') }
    finally { setLoading(false) }
  }

  async function handleEdit() {
    if (!validate()) return
    setLoading(true)
    try {
      await holidayService.updateHoliday(editItem.id, { date:form.date, name:form.name.trim(), type:form.type })
      setHolidays(prev => prev.map(h => h.id === editItem.id ? { ...h, date:form.date, name:form.name.trim(), type:form.type } : h))
      closeEdit()
    } catch (err) { setFormError(err.message || 'Failed to update') }
    finally { setLoading(false) }
  }

  async function handleDelete() {
    setLoading(true)
    try {
      await holidayService.deleteHoliday(deleteId)
      setHolidays(prev => prev.filter(h => h.id !== deleteId))
      setDeleteId(null)
    } catch (err) { alert(err.message || 'Failed to delete') }
    finally { setLoading(false) }
  }

  const total = holidays.length
  const pub   = holidays.filter(h => (h.type||'public') === 'public').length
  const comp  = holidays.filter(h => h.type === 'company').length
  const restr = holidays.filter(h => h.type === 'restricted').length

  const STATS = [
    { label:'Total Holidays', value:total, Ico:IcoCalendar, iconBg:'#dbeafe', iconColor:'#0061f2' },
    { label:'Public',         value:pub,   Ico:IcoGlobe,    iconBg:'#dbeafe', iconColor:'#1d4ed8' },
    { label:'Company',        value:comp,  Ico:IcoBuilding, iconBg:'#dcfce7', iconColor:'#15803d' },
    { label:'Restricted',     value:restr, Ico:IcoLock,     iconBg:'#fef9c3', iconColor:'#a16207' },
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
            <IcoCalendar/>
          </div>
          <div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.65)', marginBottom:5, fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' }}>Admin · HR Management</div>
            <div style={{ fontWeight:800, fontSize:26, color:'#fff', marginBottom:6, lineHeight:1.1 }}>Allocate Holidays</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.8)' }}>Manage public, company, and restricted holidays for 2026.</div>
          </div>
        </div>
        <button onClick={openAdd}
          onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
          style={{
            background:'#fff', color:'#0061f2', border:'none', borderRadius:12,
            padding:'13px 24px', fontSize:14, fontWeight:700, cursor:'pointer',
            flexShrink:0, position:'relative', display:'flex', alignItems:'center', gap:8,
            boxShadow:'0 4px 16px rgba(0,0,0,.12)', transition:'transform .2s',
          }}>
          <IcoPlus/>
          Add Holiday
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
        {/* Filter tabs */}
        <div style={{ display:'flex', background:'#f1f5f9', borderRadius:10, padding:3, gap:2 }}>
          {[['all','All'],['public','Public'],['company','Company'],['restricted','Restricted']].map(([val,lbl]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              padding:'7px 16px', borderRadius:8, border:'none',
              cursor:'pointer', fontSize:13, fontWeight:600,
              background:  filter===val ? '#0061f2' : 'transparent',
              color:       filter===val ? '#fff'    : T.muted,
              fontFamily:"'DM Sans',sans-serif", transition:'all .15s',
            }}>{lbl}</button>
          ))}
        </div>
        {/* Search */}
        <div style={{ display:'flex', alignItems:'center', gap:8, background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:10, padding:'0 14px', width:240, transition:'border-color .2s' }}
          onFocusCapture={e => e.currentTarget.style.borderColor='#0061f2'}
          onBlurCapture={e  => e.currentTarget.style.borderColor=T.border}
        >
          <span style={{ color:T.muted, display:'flex' }}><IcoSearch/></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search holiday..."
            style={{ border:'none', outline:'none', background:'transparent', fontSize:13, color:T.text, fontFamily:"'DM Sans',sans-serif", padding:'9px 0', width:'100%' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:T.muted, fontSize:16, lineHeight:1 }}>×</button>}
        </div>
      </div>

      {/* ── Holiday list by month ── */}
      {Object.keys(byMonth).length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 0', color:T.muted }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:12, color:'#cbd5e1' }}><IcoEmpty/></div>
          <div style={{ fontWeight:700, fontSize:15 }}>No holidays found</div>
          <div style={{ fontSize:13, marginTop:4 }}>Try adjusting your search or filter.</div>
        </div>
      ) : (
        Object.entries(byMonth).map(([mo, list]) => {
          const [y, m] = mo.split('-')
          return (
            <div key={mo}>
              <div style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:'uppercase', letterSpacing:'.6px', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:3, height:14, borderRadius:99, background:'#0061f2', display:'inline-block' }}/>
                {MONTH_NAMES[parseInt(m)-1]} {y} · {list.length} holiday{list.length>1?'s':''}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {list.map(h => {
                  const meta = TYPE_META[h.type || 'public']
                  return (
                    <div key={h.id}
                      onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 16px rgba(0,97,242,.10)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,.04)'}
                      style={{
                        display:'flex', alignItems:'center', gap:16,
                        padding:'14px 18px', borderRadius:14,
                        border:`1px solid ${T.border}`, background:T.surface,
                        borderLeft:`4px solid ${meta.dot}`,
                        boxShadow:'0 1px 3px rgba(0,0,0,.04)', transition:'box-shadow .2s',
                      }}>
                      {/* Date badge */}
                      <div style={{ minWidth:54, textAlign:'center', padding:'8px 4px', borderRadius:12, background:meta.bg, color:meta.color, flexShrink:0 }}>
                        <div style={{ fontSize:22, fontWeight:800, lineHeight:1 }}>{new Date((h.date||h.holiday_date||'')+'T00:00:00').getDate()}</div>
                        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', marginTop:2 }}>{MONTH_NAMES[parseInt((h.date||h.holiday_date||'0000-01').slice(5,7))-1]}</div>
                      </div>
                      {/* Name + day */}
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:3 }}>{h.name}</div>
                        <div style={{ fontSize:12, color:T.muted }}>{fmt(h.date||h.holiday_date)}</div>
                      </div>
                      {/* Type badge */}
                      <span style={{ padding:'4px 12px', borderRadius:99, fontSize:12, fontWeight:600, background:meta.bg, color:meta.color, whiteSpace:'nowrap' }}>{meta.label}</span>
                      {/* Actions */}
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => openEdit(h)}
                          onMouseEnter={e => { e.currentTarget.style.background='#0061f2'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#0061f2' }}
                          onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#0061f2'; e.currentTarget.style.borderColor=T.border }}
                          style={{ padding:'6px 12px', borderRadius:8, border:`1px solid ${T.border}`, background:'#fff', color:'#0061f2', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', gap:5, transition:'all .15s' }}>
                          <IcoEdit/> Edit
                        </button>
                        <button onClick={() => setDeleteId(h.id)}
                          onMouseEnter={e => { e.currentTarget.style.background=T.danger; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor=T.danger }}
                          onMouseLeave={e => { e.currentTarget.style.background='#fff0f0'; e.currentTarget.style.color=T.danger; e.currentTarget.style.borderColor='#fca5a5' }}
                          style={{ padding:'6px 12px', borderRadius:8, border:'1px solid #fca5a5', background:'#fff0f0', color:T.danger, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', gap:5, transition:'all .15s' }}>
                          <IcoTrash/> Delete
                        </button>
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
      <Modal open={showAdd} onClose={closeAdd} title="Add Holiday" icon={<IcoCalendar/>}>
        <HolidayForm form={form} setForm={setForm}/>
        {formError && <div style={{ fontSize:13, color:T.danger, background:'#fff0f0', border:'1px solid #fca5a5', borderRadius:9, padding:'9px 12px', marginTop:8 }}>{formError}</div>}
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
          <button onClick={closeAdd} style={{ padding:'9px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:T.surface2, color:T.muted, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleAdd} disabled={loading} style={{ padding:'9px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#0061f2,#0052cc)', color:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 12px rgba(0,97,242,.3)', display:'flex', alignItems:'center', gap:8 }}>
            <IcoPlus/> Add Holiday
          </button>
        </div>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal open={!!editItem} onClose={closeEdit} title="Edit Holiday" icon={<IcoEdit/>}>
        <HolidayForm form={form} setForm={setForm}/>
        {formError && <div style={{ fontSize:13, color:T.danger, background:'#fff0f0', border:'1px solid #fca5a5', borderRadius:9, padding:'9px 12px', marginTop:8 }}>{formError}</div>}
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
          <button onClick={closeEdit} style={{ padding:'9px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:T.surface2, color:T.muted, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleEdit} disabled={loading} style={{ padding:'9px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#0061f2,#0052cc)', color:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 12px rgba(0,97,242,.3)' }}>Save Changes</button>
        </div>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" icon={<IcoWarn/>} iconBg="linear-gradient(135deg,#ef4444,#dc2626)">
        <div style={{ fontSize:14, color:T.text, marginBottom:20, lineHeight:1.7 }}>
          Are you sure you want to remove <strong>{holidays.find(h => h.id===deleteId)?.name}</strong>? This will also remove it from the employee holiday calendar.
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={() => setDeleteId(null)} style={{ padding:'9px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:T.surface2, color:T.muted, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleDelete} disabled={loading} style={{ padding:'9px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#ef4444,#dc2626)', color:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 12px rgba(239,68,68,.3)', display:'flex', alignItems:'center', gap:8 }}>
            <IcoTrash/> Delete Holiday
          </button>
        </div>
      </Modal>
    </div>
  )
}

function HolidayForm({ form, setForm }) {
  const T2 = { border:'#e2e8f0', text:'#0f172a', muted:'#64748b' }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        <label style={{ fontSize:12, fontWeight:700, color:T2.muted, textTransform:'uppercase', letterSpacing:'.5px' }}>Date *</label>
        <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date:e.target.value}))}
          onFocus={e => e.target.style.borderColor='#0061f2'}
          onBlur={e  => e.target.style.borderColor=T2.border}
          style={{ border:`1.5px solid ${T2.border}`, borderRadius:10, padding:'10px 14px', fontSize:14, outline:'none', color:T2.text, fontFamily:"'DM Sans',sans-serif", transition:'border-color .2s' }}
        />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        <label style={{ fontSize:12, fontWeight:700, color:T2.muted, textTransform:'uppercase', letterSpacing:'.5px' }}>Holiday Name *</label>
        <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name:e.target.value}))} placeholder="e.g. New Year's Day"
          onFocus={e => e.target.style.borderColor='#0061f2'}
          onBlur={e  => e.target.style.borderColor=T2.border}
          style={{ border:`1.5px solid ${T2.border}`, borderRadius:10, padding:'10px 14px', fontSize:14, outline:'none', color:T2.text, fontFamily:"'DM Sans',sans-serif", transition:'border-color .2s' }}
        />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        <label style={{ fontSize:12, fontWeight:700, color:T2.muted, textTransform:'uppercase', letterSpacing:'.5px' }}>Type *</label>
        <select value={form.type} onChange={e => setForm(p => ({...p, type:e.target.value}))}
          onFocus={e => e.target.style.borderColor='#0061f2'}
          onBlur={e  => e.target.style.borderColor=T2.border}
          style={{ border:`1.5px solid ${T2.border}`, borderRadius:10, padding:'10px 14px', fontSize:14, outline:'none', color:T2.text, fontFamily:"'DM Sans',sans-serif", cursor:'pointer', transition:'border-color .2s' }}
        >
          <option value="public">Public Holiday</option>
          <option value="company">Company Holiday</option>
          <option value="restricted">Restricted Holiday</option>
        </select>
      </div>
    </div>
  )
}