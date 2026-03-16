import React, { useState, useEffect } from 'react'
import { Download, BarChart3, TrendingUp } from 'lucide-react'
import Button from '../components/common/Button'
import { currency } from '../utils/helpers'
import reportService from '../services/reportService'
import employeeService from '../services/employeeService'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Reports() {
  const [period, setPeriod] = useState('monthly')
  const [attendance, setAttendance] = useState([])
  const [payroll, setPayroll] = useState([])
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    reportService.getAttendanceReport().then((a) => a && setAttendance(Array.isArray(a) ? a : []))
    reportService.getPayrollReport().then((p) => p && setPayroll(Array.isArray(p) ? p : []))
    employeeService.getAll().then((e) => e && setEmployees(Array.isArray(e) ? e : []))
  }, [])

  // Aggregate attendance by month
  const attendanceByMonth = MONTHS.map((m, i) => {
    const monthStr = `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`
    const records = attendance.filter((a) => a.date && a.date.startsWith(monthStr))
    const present = records.filter((a) => a.status && a.status.toLowerCase() !== 'absent').length
    const total = employees.length || 1
    const daysInMonth = new Date(new Date().getFullYear(), i + 1, 0).getDate()
    const expected = total * Math.min(daysInMonth, new Date().getDate())
    const absent = Math.max(0, (total * 20) - present)
    return { month: m, present: present || 0, absent: absent || 0 }
  }).slice(-6)

  // Aggregate payroll by department
  const payrollByDept = Object.entries(
    (employees || []).reduce((acc, emp) => {
      const dept = emp.department || 'Other'
      if (!acc[dept]) acc[dept] = { headcount: 0, total: 0 }
      acc[dept].headcount++
      const sal = payroll.find((p) => p.employee_id === emp.id)?.salary || emp.salary || 0
      acc[dept].total += Number(sal)
      return acc
    }, {})
  ).map(([dept, v]) => ({
    dept,
    headcount: v.headcount,
    avgSal: v.headcount ? Math.round(v.total / v.headcount) : 0,
    total: v.total,
  }))

  const ATTENDANCE = attendanceByMonth.length ? attendanceByMonth : [
    { month: 'Jan', present: 0, absent: 0 },
    { month: 'Feb', present: 0, absent: 0 },
    { month: 'Mar', present: 0, absent: 0 },
  ]
  const PAYROLL = payrollByDept.length ? payrollByDept : [{ dept: 'No data', headcount: 0, avgSal: 0, total: 0 }]
  const maxVal = Math.max(...ATTENDANCE.map((a) => a.present), 1)

  return (
    <div className="page-enter" style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', gap:8 }}>
          {['monthly','quarterly','yearly'].map(p => (
            <button key={p} onClick={()=>setPeriod(p)} style={{
              padding:'8px 16px', borderRadius:10, fontSize:13, fontWeight:600,
              cursor:'pointer', fontFamily:'DM Sans,sans-serif', transition:'all .2s',
              background: period===p ? 'var(--primary)' : 'var(--surface)',
              color: period===p ? '#fff' : 'var(--text-muted)',
              border: period===p ? 'none' : '1.5px solid var(--border)',
            }}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>
          ))}
        </div>
        <Button variant="secondary" size="sm" icon={<Download size={14}/>}>Export CSV</Button>
      </div>

      {/* Attendance bar chart */}
      <div style={{ background:'var(--surface)', borderRadius:16, padding:24, boxShadow:'var(--shadow)', border:'1px solid var(--border)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h3 style={{ fontSize:16, fontWeight:700 }}>Attendance Overview</h3>
          <div style={{ display:'flex', gap:16, fontSize:12 }}>
            <span style={{ display:'flex', gap:6, alignItems:'center' }}>
              <span style={{ width:12, height:12, borderRadius:3, background:'var(--primary)', display:'inline-block' }}/> Present
            </span>
            <span style={{ display:'flex', gap:6, alignItems:'center' }}>
              <span style={{ width:12, height:12, borderRadius:3, background:'var(--danger)', display:'inline-block' }}/> Absent
            </span>
          </div>
        </div>
        <div style={{ display:'flex', gap:16, alignItems:'flex-end', height:200, justifyContent:'space-around' }}>
          {ATTENDANCE.map(a => (
            <div key={a.month} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, flex:1 }}>
              <div style={{ display:'flex', gap:4, alignItems:'flex-end', height:160 }}>
                <div title={`${a.present}% present`} style={{
                  width:28, borderRadius:'6px 6px 0 0',
                  height:`${a.present/maxVal*140}px`,
                  background:'linear-gradient(180deg,var(--primary),var(--accent))',
                  transition:'height .6s cubic-bezier(.4,0,.2,1)',
                }}/>
                <div title={`${a.absent}% absent`} style={{
                  width:28, borderRadius:'6px 6px 0 0',
                  height:`${a.absent/maxVal*140}px`,
                  background:'var(--danger)',
                  transition:'height .6s cubic-bezier(.4,0,.2,1)',
                }}/>
              </div>
              <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600 }}>{a.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payroll summary */}
      <div style={{ background:'var(--surface)', borderRadius:16, boxShadow:'var(--shadow)', border:'1px solid var(--border)', overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ fontSize:16, fontWeight:700 }}>Payroll Summary by Department</h3>
          <div style={{ fontWeight:800, fontSize:18, fontFamily:'Syne,sans-serif', color:'var(--success)' }}>
            {currency(PAYROLL.reduce((s,r)=>s+r.total,0))}/mo
          </div>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--surface2)' }}>
              {['Department','Headcount','Avg Salary','Monthly Total'].map(h => (
                <th key={h} style={{ padding:'12px 20px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--text-muted)', letterSpacing:'.05em' }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYROLL.map((r, i) => (
              <tr key={r.dept} style={{ borderTop:'1px solid var(--border)' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                onMouseLeave={e=>e.currentTarget.style.background=''}
              >
                <td style={{ padding:'14px 20px', fontWeight:600 }}>{r.dept}</td>
                <td style={{ padding:'14px 20px', color:'var(--text-muted)' }}>{r.headcount}</td>
                <td style={{ padding:'14px 20px' }}>{currency(r.avgSal)}</td>
                <td style={{ padding:'14px 20px', fontWeight:700, color:'var(--success)' }}>{currency(r.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}