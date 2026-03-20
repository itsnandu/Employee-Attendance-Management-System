// import React, { useState, useEffect } from 'react'
// import { Download, BarChart3, TrendingUp } from 'lucide-react'
// import Button from '../components/common/Button'
// import { currency } from '../utils/helpers'
// import reportService from '../services/reportService'
// import employeeService from '../services/employeeService'

// const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// export default function Reports() {
//   const [period, setPeriod] = useState('monthly')
//   const [attendance, setAttendance] = useState([])
//   const [payroll, setPayroll] = useState([])
//   const [employees, setEmployees] = useState([])

//   useEffect(() => {
//     reportService.getAttendanceReport().then((a) => a && setAttendance(Array.isArray(a) ? a : []))
//     reportService.getPayrollReport().then((p) => p && setPayroll(Array.isArray(p) ? p : []))
//     employeeService.getAll().then((e) => e && setEmployees(Array.isArray(e) ? e : []))
//   }, [])

//   // Aggregate attendance by month
//   const attendanceByMonth = MONTHS.map((m, i) => {
//     const monthStr = `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`
//     const records = attendance.filter((a) => a.date && a.date.startsWith(monthStr))
//     const present = records.filter((a) => a.status && a.status.toLowerCase() !== 'absent').length
//     const total = employees.length || 1
//     const daysInMonth = new Date(new Date().getFullYear(), i + 1, 0).getDate()
//     const expected = total * Math.min(daysInMonth, new Date().getDate())
//     const absent = Math.max(0, (total * 20) - present)
//     return { month: m, present: present || 0, absent: absent || 0 }
//   }).slice(-6)

//   // Aggregate payroll by department
//   const payrollByDept = Object.entries(
//     (employees || []).reduce((acc, emp) => {
//       const dept = emp.department || 'Other'
//       if (!acc[dept]) acc[dept] = { headcount: 0, total: 0 }
//       acc[dept].headcount++
//       const sal = payroll.find((p) => p.employee_id === emp.id)?.salary || emp.salary || 0
//       acc[dept].total += Number(sal)
//       return acc
//     }, {})
//   ).map(([dept, v]) => ({
//     dept,
//     headcount: v.headcount,
//     avgSal: v.headcount ? Math.round(v.total / v.headcount) : 0,
//     total: v.total,
//   }))

//   const ATTENDANCE = attendanceByMonth.length ? attendanceByMonth : [
//     { month: 'Jan', present: 0, absent: 0 },
//     { month: 'Feb', present: 0, absent: 0 },
//     { month: 'Mar', present: 0, absent: 0 },
//   ]
//   const PAYROLL = payrollByDept.length ? payrollByDept : [{ dept: 'No data', headcount: 0, avgSal: 0, total: 0 }]
//   const maxVal = Math.max(...ATTENDANCE.map((a) => a.present), 1)

//   return (
//     <div className="page-enter" style={{ display:'flex', flexDirection:'column', gap:20 }}>
//       <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
//         <div style={{ display:'flex', gap:8 }}>
//           {['monthly','quarterly','yearly'].map(p => (
//             <button key={p} onClick={()=>setPeriod(p)} style={{
//               padding:'8px 16px', borderRadius:10, fontSize:13, fontWeight:600,
//               cursor:'pointer', fontFamily:'DM Sans,sans-serif', transition:'all .2s',
//               background: period===p ? 'var(--primary)' : 'var(--surface)',
//               color: period===p ? '#fff' : 'var(--text-muted)',
//               border: period===p ? 'none' : '1.5px solid var(--border)',
//             }}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>
//           ))}
//         </div>
//         <Button variant="secondary" size="sm" icon={<Download size={14}/>}>Export CSV</Button>
//       </div>

//       {/* Attendance bar chart */}
//       <div style={{ background:'var(--surface)', borderRadius:16, padding:24, boxShadow:'var(--shadow)', border:'1px solid var(--border)' }}>
//         <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
//           <h3 style={{ fontSize:16, fontWeight:700 }}>Attendance Overview</h3>
//           <div style={{ display:'flex', gap:16, fontSize:12 }}>
//             <span style={{ display:'flex', gap:6, alignItems:'center' }}>
//               <span style={{ width:12, height:12, borderRadius:3, background:'var(--primary)', display:'inline-block' }}/> Present
//             </span>
//             <span style={{ display:'flex', gap:6, alignItems:'center' }}>
//               <span style={{ width:12, height:12, borderRadius:3, background:'var(--danger)', display:'inline-block' }}/> Absent
//             </span>
//           </div>
//         </div>
//         <div style={{ display:'flex', gap:16, alignItems:'flex-end', height:200, justifyContent:'space-around' }}>
//           {ATTENDANCE.map(a => (
//             <div key={a.month} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, flex:1 }}>
//               <div style={{ display:'flex', gap:4, alignItems:'flex-end', height:160 }}>
//                 <div title={`${a.present}% present`} style={{
//                   width:28, borderRadius:'6px 6px 0 0',
//                   height:`${a.present/maxVal*140}px`,
//                   background:'linear-gradient(180deg,var(--primary),var(--accent))',
//                   transition:'height .6s cubic-bezier(.4,0,.2,1)',
//                 }}/>
//                 <div title={`${a.absent}% absent`} style={{
//                   width:28, borderRadius:'6px 6px 0 0',
//                   height:`${a.absent/maxVal*140}px`,
//                   background:'var(--danger)',
//                   transition:'height .6s cubic-bezier(.4,0,.2,1)',
//                 }}/>
//               </div>
//               <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600 }}>{a.month}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Payroll summary */}
//       <div style={{ background:'var(--surface)', borderRadius:16, boxShadow:'var(--shadow)', border:'1px solid var(--border)', overflow:'hidden' }}>
//         <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
//           <h3 style={{ fontSize:16, fontWeight:700 }}>Payroll Summary by Department</h3>
//           <div style={{ fontWeight:800, fontSize:18, fontFamily:'Syne,sans-serif', color:'var(--success)' }}>
//             {currency(PAYROLL.reduce((s,r)=>s+r.total,0))}/mo
//           </div>
//         </div>
//         <table style={{ width:'100%', borderCollapse:'collapse' }}>
//           <thead>
//             <tr style={{ background:'var(--surface2)' }}>
//               {['Department','Headcount','Avg Salary','Monthly Total'].map(h => (
//                 <th key={h} style={{ padding:'12px 20px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--text-muted)', letterSpacing:'.05em' }}>{h.toUpperCase()}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {PAYROLL.map((r, i) => (
//               <tr key={r.dept} style={{ borderTop:'1px solid var(--border)' }}
//                 onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
//                 onMouseLeave={e=>e.currentTarget.style.background=''}
//               >
//                 <td style={{ padding:'14px 20px', fontWeight:600 }}>{r.dept}</td>
//                 <td style={{ padding:'14px 20px', color:'var(--text-muted)' }}>{r.headcount}</td>
//                 <td style={{ padding:'14px 20px' }}>{currency(r.avgSal)}</td>
//                 <td style={{ padding:'14px 20px', fontWeight:700, color:'var(--success)' }}>{currency(r.total)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }


import React, { useState, useEffect, useMemo } from 'react'
import { Download } from 'lucide-react'
import Button from '../components/common/Button'
import { currency } from '../utils/helpers'
import reportService from '../services/reportService'
import employeeService from '../services/employeeService'
import attendanceService from '../services/attendanceService'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ── Helpers ──────────────────────────────────────────────────
function normDateToMonth(d) {
  if (!d) return ''
  // Always slice to avoid UTC timezone shifting (same fix as Attendance.jsx)
  return String(d).trim().slice(0, 7) // "YYYY-MM"
}

function normDateToDay(d) {
  if (!d) return ''
  return String(d).trim().slice(0, 10) // "YYYY-MM-DD"
}

// ── Inline Bar Chart ─────────────────────────────────────────
function AttendanceBarChart({ data }) {
  const [hovered, setHovered] = useState(null)

  const maxVal = Math.max(...data.map(d => Math.max(d.present, d.absent)), 1)
  const yMax   = Math.ceil(maxVal / 5) * 5 || 5
  const yTicks = [0, Math.round(yMax * 0.25), Math.round(yMax * 0.5), Math.round(yMax * 0.75), yMax]

  const CHART_H = 200
  const toH = (v) => Math.max(v > 0 ? 4 : 0, Math.round((v / yMax) * CHART_H))

  return (
    <div style={{ position: 'relative', userSelect: 'none' }}>
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Y-axis labels */}
        <div style={{
          display: 'flex', flexDirection: 'column-reverse',
          justifyContent: 'space-between', height: CHART_H,
          marginRight: 10, flexShrink: 0, width: 28,
        }}>
          {yTicks.map(t => (
            <span key={t} style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1, textAlign: 'right' }}>
              {t}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div style={{ flex: 1, position: 'relative' }}>
          {/* Gridlines */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', pointerEvents: 'none' }}>
            {yTicks.map(t => (
              <div key={t} style={{ borderTop: '1px dashed var(--border)', width: '100%' }} />
            ))}
          </div>

          {/* Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', height: CHART_H, gap: 6, position: 'relative', zIndex: 1 }}>
            {data.map((d, i) => {
              const isHov = hovered === i
              return (
                <div
                  key={d.month}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'flex-end',
                    height: '100%', gap: 3, position: 'relative',
                    cursor: 'default',
                  }}
                >
                  {/* Tooltip */}
                  {isHov && (
                    <div style={{
                      position: 'absolute', bottom: '100%', left: '50%',
                      transform: 'translateX(-50%)', marginBottom: 8,
                      background: 'var(--text)', color: 'var(--surface)',
                      borderRadius: 8, padding: '6px 10px', fontSize: 12,
                      fontWeight: 600, whiteSpace: 'nowrap', zIndex: 10,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      pointerEvents: 'none',
                    }}>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 2 }}>{d.month} {d.year || ''}</div>
                      <div style={{ color: '#93c5fd' }}>✓ Present: {d.present}</div>
                      <div style={{ color: '#fca5a5' }}>✕ Absent: {d.absent}</div>
                      {d.present + d.absent > 0 && (
                        <div style={{ color: '#86efac', marginTop: 2 }}>
                          Rate: {Math.round((d.present / (d.present + d.absent)) * 100)}%
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bar group */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, width: '100%', justifyContent: 'center' }}>
                    {/* Present bar */}
                    <div style={{
                      width: 'clamp(10px, 38%, 26px)',
                      height: `${toH(d.present)}px`,
                      borderRadius: '5px 5px 0 0',
                      background: isHov
                        ? 'linear-gradient(180deg, #3b82f6 0%, #06b6d4 100%)'
                        : 'linear-gradient(180deg, var(--primary) 0%, var(--accent) 100%)',
                      transition: 'height 0.5s cubic-bezier(.4,0,.2,1), background 0.2s',
                      boxShadow: isHov ? '0 0 0 2px rgba(8,101,240,0.3)' : 'none',
                    }} />
                    {/* Absent bar */}
                    <div style={{
                      width: 'clamp(10px, 38%, 26px)',
                      height: `${toH(d.absent)}px`,
                      borderRadius: '5px 5px 0 0',
                      background: isHov ? '#ef4444' : 'var(--danger)',
                      opacity: isHov ? 1 : 0.7,
                      transition: 'height 0.5s cubic-bezier(.4,0,.2,1), opacity 0.2s',
                      boxShadow: isHov ? '0 0 0 2px rgba(239,68,68,0.3)' : 'none',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div style={{ display: 'flex', marginLeft: 38, marginTop: 8, gap: 6 }}>
        {data.map((d, i) => (
          <div key={d.month + i} style={{
            flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 600,
            color: hovered === i ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'color 0.2s',
          }}>
            {d.month}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────
export default function Reports() {
  const [period, setPeriod]     = useState('monthly')
  const [attendance, setAttendance] = useState([])
  const [payroll, setPayroll]   = useState([])
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    // Use raw attendance data (same endpoint as Attendance page) for accurate counts
    attendanceService.getAttendance()
      .then(a => a && setAttendance(Array.isArray(a) ? a : []))
      .catch(() => {
        // Fallback to report endpoint
        reportService.getAttendanceReport().then(a => a && setAttendance(Array.isArray(a) ? a : []))
      })
    reportService.getPayrollReport().then(p => p && setPayroll(Array.isArray(p) ? p : []))
    employeeService.getAll().then(e => e && setEmployees(Array.isArray(e) ? e : []))
  }, [])

  const now          = new Date()
  const currentYear  = now.getFullYear()
  const currentMonth = now.getMonth() // 0-based (March = 2)

  // ── Build per-month attendance aggregates ────────────────
  const attendanceByMonth = useMemo(() => {
    const totalEmployees = employees.length || 0

    return MONTHS.map((m, i) => {
      const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`

      // All records for this month
      const monthRecords = attendance.filter(a => normDateToMonth(a.date) === monthKey)

      if (monthRecords.length === 0) {
        return { month: m, present: 0, absent: 0, monthKey, year: currentYear }
      }

      // Count unique working days that have ANY record this month
      const uniqueDays = new Set(monthRecords.map(a => normDateToDay(a.date))).size

      // Present = records where status is present or late (not absent)
      const present = monthRecords.filter(a => {
        const s = (a.status || 'present').toLowerCase()
        return s === 'present' || s === 'late'
      }).length

      // Absent employees per day = employees with no record on that day
      // Total expected = employees × uniqueDays; absent = expected - present
      const expected = totalEmployees > 0 ? totalEmployees * uniqueDays : monthRecords.length
      const absent   = Math.max(0, expected - present)

      return { month: m, present, absent, monthKey, year: currentYear }
    })
  }, [attendance, employees, currentYear])

  // ── Slice chart data by period ───────────────────────────
  const chartData = useMemo(() => {
    if (period === 'quarterly') {
      // Last 3 months including current
      const start = Math.max(0, currentMonth - 2)
      return attendanceByMonth.slice(start, currentMonth + 1)
    }
    if (period === 'monthly') {
      // Last 6 months including current
      const start = Math.max(0, currentMonth - 5)
      return attendanceByMonth.slice(start, currentMonth + 1)
    }
    // Yearly: all 12 months of current year (show up to current month)
    return attendanceByMonth.slice(0, currentMonth + 1)
  }, [attendanceByMonth, period, currentMonth])

  // ── Summary stats ────────────────────────────────────────
  const totalPresent = chartData.reduce((s, d) => s + d.present, 0)
  const totalAbsent  = chartData.reduce((s, d) => s + d.absent,  0)
  const attendanceRate = totalPresent + totalAbsent > 0
    ? Math.round((totalPresent / (totalPresent + totalAbsent)) * 100)
    : 0

  // ── Payroll by department ────────────────────────────────
  const payrollByDept = useMemo(() => {
    return Object.entries(
      (employees || []).reduce((acc, emp) => {
        const dept = emp.department || emp.dept || 'Other'
        if (!acc[dept]) acc[dept] = { headcount: 0, total: 0 }
        acc[dept].headcount++
        const sal = payroll.find(p => p.employee_id === emp.id)?.salary || emp.salary || 0
        acc[dept].total += Number(sal)
        return acc
      }, {})
    ).map(([dept, v]) => ({
      dept,
      headcount: v.headcount,
      avgSal: v.headcount ? Math.round(v.total / v.headcount) : 0,
      total: v.total,
    }))
  }, [employees, payroll])

  const PAYROLL = payrollByDept.length
    ? payrollByDept
    : [{ dept: 'No data', headcount: 0, avgSal: 0, total: 0 }]

  const hasAnyData = chartData.some(d => d.present > 0 || d.absent > 0)

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['monthly', 'quarterly', 'yearly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all .2s',
              background: period === p ? 'var(--primary)' : 'var(--surface)',
              color:      period === p ? '#fff' : 'var(--text-muted)',
              border:     period === p ? 'none' : '1.5px solid var(--border)',
            }}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
          ))}
        </div>
        <Button variant="secondary" size="sm" icon={<Download size={14}/>}>Export CSV</Button>
      </div>

      {/* Summary stat pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Present',    value: totalPresent,      color: 'var(--primary)', bg: 'rgba(8,101,240,0.08)'   },
          { label: 'Total Absent',     value: totalAbsent,       color: 'var(--danger)',  bg: 'rgba(239,68,68,0.08)'   },
          { label: 'Attendance Rate',  value: `${attendanceRate}%`, color: 'var(--success)', bg: 'rgba(16,185,129,0.08)' },
        ].map(s => (
          <div key={s.label} style={{
            background: s.bg, borderRadius: 14, padding: '16px 20px',
            border: `1.5px solid ${s.color}22`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Bar Chart */}
      <div style={{
        background: 'var(--surface)', borderRadius: 16, padding: 24,
        boxShadow: 'var(--shadow)', border: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>Attendance Overview</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
              {period === 'monthly' ? 'Last 6 months' : period === 'quarterly' ? 'Last 3 months' : `Jan – ${MONTHS[currentMonth]} ${currentYear}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--primary)', display: 'inline-block' }}/>
              Present
            </span>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--danger)', display: 'inline-block' }}/>
              Absent
            </span>
          </div>
        </div>

        {!hasAnyData ? (
          <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: 10 }}>
            <span style={{ fontSize: 36 }}>📊</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>No attendance data for this period</span>
            <span style={{ fontSize: 12 }}>Attendance records will appear here once employees check in</span>
          </div>
        ) : (
          <AttendanceBarChart data={chartData} />
        )}
      </div>

      {/* Payroll Summary */}
      <div style={{
        background: 'var(--surface)', borderRadius: 16,
        boxShadow: 'var(--shadow)', border: '1px solid var(--border)', overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Payroll Summary by Department</h3>
          <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--success)' }}>
            {currency(PAYROLL.reduce((s, r) => s + r.total, 0))}/mo
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface2)' }}>
              {['Department', 'Headcount', 'Avg Salary', 'Monthly Total'].map(h => (
                <th key={h} style={{
                  padding: '12px 20px', textAlign: 'left', fontSize: 12,
                  fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.05em',
                }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYROLL.map(r => (
              <tr key={r.dept} style={{ borderTop: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <td style={{ padding: '14px 20px', fontWeight: 600 }}>{r.dept}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{r.headcount}</td>
                <td style={{ padding: '14px 20px' }}>{currency(r.avgSal)}</td>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--success)' }}>{currency(r.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}



