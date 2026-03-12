import React, { useState } from 'react'
import { Download, BarChart3, TrendingUp } from 'lucide-react'
import Button from '../components/common/Button'
import { currency } from '../utils/helpers'

const ATTENDANCE = [
  { month:'Oct', present:85, absent:15 },
  { month:'Nov', present:88, absent:12 },
  { month:'Dec', present:79, absent:21 },
  { month:'Jan', present:91, absent:9  },
  { month:'Feb', present:87, absent:13 },
  { month:'Mar', present:93, absent:7  },
]

const PAYROLL = [
  { dept:'Engineering', headcount:3, avgSal:90667, total:272000 },
  { dept:'HR',          headcount:1, avgSal:75000, total:75000  },
  { dept:'Design',      headcount:1, avgSal:70000, total:70000  },
  { dept:'Analytics',   headcount:1, avgSal:88000, total:88000  },
]

export default function Reports() {
  const [period, setPeriod] = useState('monthly')
  const maxVal = Math.max(...ATTENDANCE.map(a => a.present))

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