import React, { useEffect, useState, useMemo } from 'react'
import { Users, Clock, UserCheck, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import attendanceService from '../services/attendanceService'
import employeeService from '../services/employeeService'
import leaveService from '../services/leaveService'

const Card = ({ icon, label, value, sub, color='var(--primary)' }) => (
  <div style={{
    background:'var(--surface)', borderRadius:16, padding:24,
    boxShadow:'var(--shadow)', border:'1px solid var(--border)',
    display:'flex', alignItems:'flex-start', gap:16,
  }}>
    <div style={{
      width:48, height:48, borderRadius:12,
      background:`${color}18`, display:'flex',
      alignItems:'center', justifyContent:'center', color,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize:28, fontWeight:800, fontFamily:'Syne,sans-serif', lineHeight:1.2 }}>{value}</div>
      <div style={{ fontSize:13, fontWeight:600, color:'var(--text-muted)', marginTop:2 }}>{label}</div>
      {sub && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{sub}</div>}
    </div>
  </div>
)

export default function Dashboard({ setPage }) {
  const { user } = useAuth()
  const [stats, setStats] = useState({ present:0, absent:0, late:0, total:0 })
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [leaves, setLeaves] = useState([])

  useEffect(() => {
    attendanceService.getStats().then((s) => s && setStats(s));
    employeeService.getAll().then((e) => e && setEmployees(Array.isArray(e) ? e : []));
    attendanceService.getAttendance().then((a) => a && setAttendance(Array.isArray(a) ? a : []));
    leaveService.getLeaves().then((l) => l && setLeaves(Array.isArray(l) ? l : []));
  }, []);

  const empMap = useMemo(() => {
    const m = {};
    employees.forEach(e => { m[e.id] = e.name || [e.first_name, e.last_name].filter(Boolean).join(' ') || 'Employee'; });
    return m;
  }, [employees]);

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))].sort()
  const activity = useMemo(() => {
    const items = [];
    const today = new Date().toISOString().slice(0, 10);
    attendance.filter(a => (a.date || '').startsWith(today.slice(0, 7))).slice(0, 5).forEach(a => {
      items.push({ msg: `${empMap[a.employee_id] || 'Someone'} checked in at ${(a.check_in || a.check_in_time || '—').slice(0, 5)}`, time: 'Today', type: 'success' });
    });
    leaves.filter(l => l.status === 'pending').slice(0, 3).forEach(l => {
      items.push({ msg: `${l.name || empMap[l.employee_id]} applied for ${l.leave_type || 'leave'}`, time: 'Pending', type: 'info' });
    });
    return items.slice(0, 5).length ? items.slice(0, 5) : [{ msg: 'No recent activity', time: '—', type: 'info' }];
  }, [attendance, leaves, empMap])

  return (
    <div className="page-enter" style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Greeting */}
      <div style={{
        background:'linear-gradient(135deg,var(--primary) 0%,var(--accent) 100%)',
        borderRadius:20, padding:'28px 32px', color:'#fff',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        boxShadow:'0 8px 32px rgba(79,70,229,.35)',
      }}>
        <div>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:26, fontWeight:800, marginBottom:6 }}>
            Good {new Date().getHours()<12?'Morning':new Date().getHours()<17?'Afternoon':'Evening'}, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Admin'} 👋
          </h2>
          <p style={{ opacity:.8, fontSize:14 }}>Here's what's happening across your organization today.</p>
        </div>
        <div style={{ textAlign:'right', opacity:.8, fontSize:13 }}>
          <div style={{ fontWeight:700, fontSize:22 }}>{stats.total}</div>
          <div>Total Employees</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
        <Card icon={<UserCheck size={22}/>} label="Present Today"   value={stats.present} color="var(--success)" sub={`${Math.round(stats.present/stats.total*100)||0}% attendance rate`}/>
        <Card icon={<AlertCircle size={22}/>} label="Absent Today"  value={stats.absent}  color="var(--danger)"  sub="Notified via email"/>
        <Card icon={<Clock size={22}/>}       label="Late Arrivals" value={stats.late}    color="var(--warning)" sub="After 9:30 AM"/>
        <Card icon={<TrendingUp size={22}/>}  label="Active Staff"  value={employees.filter(e=>e.status==='active').length} color="var(--primary)" sub="Across all departments"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Dept breakdown */}
        <div style={{ background:'var(--surface)', borderRadius:16, padding:24, boxShadow:'var(--shadow)', border:'1px solid var(--border)' }}>
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Department Overview</h3>
          {(departments.length ? departments : ['Engineering','HR','Design','Analytics']).map(dept => {
            const count = employees.filter(e=>e.department===dept).length
            const pct = employees.length ? Math.round(count/employees.length*100) : 0
            return (
              <div key={dept} style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:500, marginBottom:6 }}>
                  <span>{dept}</span><span style={{ color:'var(--text-muted)' }}>{count} employees</span>
                </div>
                <div style={{ height:8, background:'var(--surface2)', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,var(--primary),var(--accent))', borderRadius:99, transition:'width .6s' }}/>
                </div>
              </div>
            )
          })}
        </div>

        {/* Activity feed */}
        <div style={{ background:'var(--surface)', borderRadius:16, padding:24, boxShadow:'var(--shadow)', border:'1px solid var(--border)' }}>
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Recent Activity</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {activity.map((a, i) => (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{
                  width:8, height:8, minWidth:8, borderRadius:'50%', marginTop:6,
                  background: a.type==='success'?'var(--success)':a.type==='danger'?'var(--danger)':a.type==='warning'?'var(--warning)':'var(--accent)',
                }}/>
                <div>
                  <div style={{ fontSize:13 }}>{a.msg}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ background:'var(--surface)', borderRadius:16, padding:24, boxShadow:'var(--shadow)', border:'1px solid var(--border)' }}>
        <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Quick Actions</h3>
        <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
          {[
            { label:'Add Employee',    page:'employees', color:'var(--primary)' },
            { label:'Mark Attendance', page:'attendance', color:'var(--success)' },
            { label:'Approve Leaves',  page:'leave', color:'var(--warning)'  },
            { label:'View Reports',    page:'reports', color:'var(--accent)'   },
          ].map(q => (
            <button key={q.label} onClick={()=>setPage(q.page)} style={{
              padding:'10px 20px', borderRadius:10, border:`2px solid ${q.color}20`,
              background:`${q.color}10`, color:q.color, fontFamily:'DM Sans,sans-serif',
              fontSize:14, fontWeight:600, cursor:'pointer', transition:'all .2s',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background=q.color; e.currentTarget.style.color='#fff' }}
            onMouseLeave={e=>{ e.currentTarget.style.background=`${q.color}10`; e.currentTarget.style.color=q.color }}
            >{q.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}