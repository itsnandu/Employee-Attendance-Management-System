import React, { useEffect, useState, useMemo } from 'react'
import useAuth from '../hooks/useAuth'
import attendanceService from '../services/attendanceService'
import employeeService from '../services/employeeService'
import leaveService from '../services/leaveService'

// ── SVG Icons ──────────────────────────────────────────────────
const IcoUserCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <polyline points="16 11 18 13 22 9"/>
  </svg>
)
const IcoUserX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="17" y1="11" x2="23" y2="17"/>
    <line x1="23" y1="11" x2="17" y2="17"/>
  </svg>
)
const IcoClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IcoTrending = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)
const IcoUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IcoCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IcoClipboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1"/>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
  </svg>
)
const IcoBarChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
)

// ── Stat Card ──────────────────────────────────────────────────
const Card = ({ icon, label, value, sub, color='#0061f2' }) => {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background:'#fff', borderRadius:16, padding:'20px 22px',
        border:`1px solid ${hover ? color : '#e2e8f0'}`,
        boxShadow: hover ? `0 8px 28px ${color}22` : '0 1px 4px rgba(0,0,0,.06)',
        display:'flex', alignItems:'flex-start', gap:16,
        transition:'all .2s', cursor:'pointer',
      }}
    >
      <div style={{
        width:50, height:50, minWidth:50, borderRadius:14, flexShrink:0,
        background:`${color}15`, color,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>{icon}</div>
      <div>
        <div style={{ fontSize:30, fontWeight:800, lineHeight:1.1, color:'#0f172a' }}>{value}</div>
        <div style={{ fontSize:13, fontWeight:600, color:'#64748b', marginTop:3 }}>{label}</div>
        {sub && <div style={{ fontSize:12, color:'#94a3b8', marginTop:4 }}>{sub}</div>}
      </div>
    </div>
  )
}

export default function Dashboard({ setPage }) {
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)
  const [stats, setStats]         = useState({ present:0, absent:0, late:0, total:0 })
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [leaves, setLeaves]       = useState([])

  useEffect(() => {
    const h = () => { setIsMobile(window.innerWidth < 768); setIsTablet(window.innerWidth < 1024) }
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  useEffect(() => {
    attendanceService.getStats().then(s => s && setStats(s))
    employeeService.getAll().then(e => e && setEmployees(Array.isArray(e) ? e : []))
    attendanceService.getAttendance().then(a => a && setAttendance(Array.isArray(a) ? a : []))
    leaveService.getLeaves().then(l => l && setLeaves(Array.isArray(l) ? l : []))
  }, [])

  const empMap = useMemo(() => {
    const m = {}
    employees.forEach(e => { m[e.id] = e.name || [e.first_name, e.last_name].filter(Boolean).join(' ') || 'Employee' })
    return m
  }, [employees])

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))].sort()

  const activity = useMemo(() => {
    const items = []
    const today = new Date().toISOString().slice(0, 10)
    attendance.filter(a => (a.date || '').startsWith(today.slice(0, 7))).slice(0, 5).forEach(a => {
      items.push({ msg:`${empMap[a.employee_id] || 'Someone'} checked in at ${(a.check_in || a.check_in_time || a.mark_attendance || '—').slice(0, 5)}`, time:'Today', type:'success' })
    })
    leaves.filter(l => l.status === 'pending').slice(0, 3).forEach(l => {
      items.push({ msg:`${l.name || empMap[l.employee_id]} applied for ${l.leave_type || 'leave'}`, time:'Pending', type:'info' })
    })
    const r = items.slice(0, 5)
    return r.length ? r : [{ msg:'No recent activity', time:'—', type:'info' }]
  }, [attendance, leaves, empMap])

  const greeting = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'
  const name     = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Admin'

  const QUICK_ACTIONS = [
    { label:'Add Employee',    page:'employees', color:'#0061f2', Ico:IcoUsers    },
    { label:'Mark Attendance', page:'attendance', color:'#10b981', Ico:IcoCalendar },
    { label:'Approve Leaves',  page:'leave',      color:'#f59e0b', Ico:IcoClipboard},
    { label:'View Reports',    page:'reports',    color:'#0284c7', Ico:IcoBarChart },
  ]

  const gap = isMobile ? 16 : 24

  return (
    <div style={{ display:'flex', flexDirection:'column', gap }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background:'linear-gradient(135deg, #0061f2 0%, #0052cc 55%, #0284c7 100%)',
        borderRadius:20, padding: isMobile ? '20px 18px' : '28px 36px',
        color:'#fff', position:'relative', overflow:'hidden',
        display:'flex', justifyContent:'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 12 : 0,
        boxShadow:'0 8px 32px rgba(0,97,242,.30)',
      }}>
        {[[-30,-30,220],[80,-70,150],[210,50,100]].map(([r,t,s],i) => (
          <div key={i} style={{ position:'absolute', right:r, top:t, width:s, height:s, borderRadius:'50%', background:'rgba(255,255,255,.06)', pointerEvents:'none' }}/>
        ))}
        <div style={{ position:'relative' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.65)', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginBottom:6 }}>
            Dashboard · Overview
          </div>
          <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight:800, marginBottom:6, lineHeight:1.2 }}>
            Good {greeting}, {name} 👋
          </h2>
          <p style={{ opacity:.8, fontSize: isMobile ? 13 : 14, margin:0 }}>
            Here's what's happening across your organization today.
          </p>
        </div>
        <div style={{ position:'relative', textAlign:'right', opacity:.9 }}>
          <div style={{ fontWeight:800, fontSize: isMobile ? 20 : 28, lineHeight:1, color:'#fff' }}>{stats.total}</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,.75)', marginTop:4 }}>Total Employees</div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        gap: isMobile ? 12 : 16,
      }}>
        <Card icon={<IcoUserCheck/>} label="Present Today"   value={stats.present} color="#10b981" sub={`${Math.round(stats.present/(stats.total||1)*100)||0}% attendance rate`}/>
        <Card icon={<IcoUserX/>}     label="Absent Today"    value={stats.absent}  color="#ef4444" sub="Notified via email"/>
        <Card icon={<IcoClock/>}      label="Late Arrivals"   value={stats.late}    color="#f59e0b" sub="After 9:30 AM"/>
        <Card icon={<IcoTrending/>}   label="Active Staff"    value={employees.filter(e=>e.status==='active').length} color="#0061f2" sub="Across all departments"/>
      </div>

      {/* ── Two Column ── */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 16 }}>

        {/* Department Overview */}
        <div style={{ background:'#fff', borderRadius:16, padding: isMobile ? 16 : 24, border:'1px solid #e2e8f0', boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
          <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight:700, marginBottom: isMobile ? 16 : 20, color:'#0f172a' }}>Department Overview</h3>
          <div style={{ maxHeight:300, overflowY:'auto' }}>
            {(departments.length ? departments : ['Engineering','HR','Design','Analytics']).map(dept => {
              const count = employees.filter(e => e.department===dept).length
              const pct   = employees.length ? Math.round(count/employees.length*100) : 0
              return (
                <div key={dept} style={{ marginBottom: isMobile ? 12 : 16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize: isMobile ? 12 : 13, fontWeight:500, marginBottom:6, color:'#0f172a' }}>
                    <span>{dept}</span>
                    <span style={{ color:'#64748b' }}>{count} emp.</span>
                  </div>
                  <div style={{ height:8, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                    <div style={{
                      width:`${pct}%`, height:'100%', borderRadius:99,
                      background:'linear-gradient(90deg,#0061f2,#0284c7)',
                      transition:'width .6s',
                    }}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background:'#fff', borderRadius:16, padding: isMobile ? 16 : 24, border:'1px solid #e2e8f0', boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
          <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight:700, marginBottom: isMobile ? 16 : 20, color:'#0f172a' }}>Recent Activity</h3>
          <div style={{ display:'flex', flexDirection:'column', gap: isMobile ? 10 : 12, maxHeight:300, overflowY:'auto' }}>
            {activity.map((a, i) => (
              <div key={i}
                onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
                style={{ display:'flex', gap: isMobile ? 10 : 12, alignItems:'flex-start', padding: isMobile ? '8px' : '6px 8px', borderRadius:8, transition:'background .15s' }}
              >
                <div style={{
                  width:8, height:8, minWidth:8, borderRadius:'50%', marginTop:6,
                  background: a.type==='success' ? '#10b981' : a.type==='danger' ? '#ef4444' : a.type==='warning' ? '#f59e0b' : '#0061f2',
                }}/>
                <div style={{ overflow:'hidden' }}>
                  <div style={{ fontSize: isMobile ? 12 : 13, lineHeight:1.4, color:'#0f172a', wordBreak:'break-word' }}>{a.msg}</div>
                  <div style={{ fontSize: isMobile ? 10 : 11, color:'#94a3b8', marginTop:2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ background:'#fff', borderRadius:16, padding: isMobile ? 16 : 24, border:'1px solid #e2e8f0', boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
        <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight:700, marginBottom: isMobile ? 12 : 16, color:'#0f172a' }}>Quick Actions</h3>
        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          gap: isMobile ? 10 : 12,
        }}>
          {QUICK_ACTIONS.map(q => (
            <button key={q.label} onClick={() => setPage(q.page)}
              onMouseEnter={e => { e.currentTarget.style.background=q.color; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 6px 18px ${q.color}44` }}
              onMouseLeave={e => { e.currentTarget.style.background=`${q.color}10`; e.currentTarget.style.color=q.color; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
              style={{
                padding: isMobile ? '12px 16px' : '12px 20px', borderRadius:12,
                border:`1.5px solid ${q.color}30`, background:`${q.color}10`, color:q.color,
                fontFamily:'DM Sans,sans-serif', fontSize: isMobile ? 13 : 14, fontWeight:700,
                cursor:'pointer', transition:'all .2s',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              }}
            >
              <q.Ico/>{q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}