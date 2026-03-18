import React, { useEffect, useState, useMemo } from 'react'
import { Users, Clock, UserCheck, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import attendanceService from '../services/attendanceService'
import employeeService from '../services/employeeService'
import leaveService from '../services/leaveService'

const Card = ({ icon, label, value, sub, color='var(--primary)' }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{
      background:'var(--surface)',
      borderRadius:16,
      padding: isMobile ? '16px' : '24px',
      boxShadow:'var(--shadow)',
      border:'1px solid var(--border)',
      display:'flex',
      alignItems:'flex-start',
      gap: isMobile ? '12px' : '16px',
      transition: 'all 0.2s',
      cursor: 'pointer',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
      e.currentTarget.style.borderColor = color
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow)'
      e.currentTarget.style.borderColor = 'var(--border)'
    }}
    >
      <div style={{
        width: isMobile ? 40 : 48,
        height: isMobile ? 40 : 48,
        minWidth: isMobile ? 40 : 48,
        borderRadius:12,
        background:`${color}18`,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        color,
      }}>{icon}</div>
      <div>
        <div style={{
          fontSize: isMobile ? '22px' : '28px',
          fontWeight:800,
          fontFamily:'Syne,sans-serif',
          lineHeight:1.2,
          color: 'var(--text)',
        }}>{value}</div>
        <div style={{
          fontSize: isMobile ? '12px' : '13px',
          fontWeight:600,
          color:'var(--text-muted)',
          marginTop:2,
        }}>{label}</div>
        {sub && <div style={{
          fontSize: isMobile ? '11px' : '12px',
          color:'var(--text-muted)',
          marginTop:4,
        }}>{sub}</div>}
      </div>
    </div>
  )
}

export default function Dashboard({ setPage }) {
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)
  const [stats, setStats] = useState({ present:0, absent:0, late:0, total:0 })
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [leaves, setLeaves] = useState([])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    <div className="page-enter" style={{
      display:'flex',
      flexDirection:'column',
      gap: isMobile ? '16px' : '24px',
    }}>
      {/* Greeting */}
      <div style={{
        background:'linear-gradient(135deg,var(--primary) 0%,var(--accent) 100%)',
        borderRadius:20,
        padding: isMobile ? '20px 16px' : '28px 32px',
        color:'#fff',
        display:'flex',
        justifyContent:'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '12px' : '0',
        boxShadow:'0 8px 32px rgba(79,70,229,.35)',
      }}>
        <div>
          <h2 style={{
            fontFamily:'Syne,sans-serif',
            fontSize: isMobile ? '22px' : '26px',
            fontWeight:800,
            marginBottom: isMobile ? '4px' : '6px',
            lineHeight: 1.2,
          }}>
            Good {new Date().getHours()<12?'Morning':new Date().getHours()<17?'Afternoon':'Evening'}, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Admin'} 👋
          </h2>
          <p style={{
            opacity:.8,
            fontSize: isMobile ? '13px' : '14px',
          }}>Here's what's happening across your organization today.</p>
        </div>
        <div style={{
          textAlign:'right',
          opacity:.8,
          fontSize: isMobile ? '12px' : '13px',
        }}>
          <div style={{
            fontWeight:700,
            fontSize: isMobile ? '18px' : '22px',
          }}>{stats.total}</div>
          <div>Total Employees</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '12px' : '16px',
      }}>
        <Card icon={<UserCheck size={22}/>} label="Present Today"   value={stats.present} color="var(--success)" sub={`${Math.round(stats.present/stats.total*100)||0}% attendance rate`}/>
        <Card icon={<AlertCircle size={22}/>} label="Absent Today"  value={stats.absent}  color="var(--danger)"  sub="Notified via email"/>
        <Card icon={<Clock size={22}/>}       label="Late Arrivals" value={stats.late}    color="var(--warning)" sub="After 9:30 AM"/>
        <Card icon={<TrendingUp size={22}/>}  label="Active Staff"  value={employees.filter(e=>e.status==='active').length} color="var(--primary)" sub="Across all departments"/>
      </div>

      {/* Two Column Section */}
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '16px' : '16px',
      }}>
        {/* Dept breakdown */}
        <div style={{
          background:'var(--surface)',
          borderRadius:16,
          padding: isMobile ? '16px' : '24px',
          boxShadow:'var(--shadow)',
          border:'1px solid var(--border)',
        }}>
          <h3 style={{
            fontSize: isMobile ? '15px' : '16px',
            fontWeight:700,
            marginBottom: isMobile ? '16px' : '20px',
          }}>Department Overview</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {(departments.length ? departments : ['Engineering','HR','Design','Analytics']).map(dept => {
              const count = employees.filter(e=>e.department===dept).length
              const pct = employees.length ? Math.round(count/employees.length*100) : 0
              return (
                <div key={dept} style={{ marginBottom: isMobile ? '12px' : '16px' }}>
                  <div style={{
                    display:'flex',
                    justifyContent:'space-between',
                    fontSize: isMobile ? '12px' : '13px',
                    fontWeight:500,
                    marginBottom:6,
                  }}>
                    <span>{dept}</span><span style={{ color:'var(--text-muted)' }}>{count} emp.</span>
                  </div>
                  <div style={{
                    height:8,
                    background:'var(--surface2)',
                    borderRadius:99,
                    overflow:'hidden',
                  }}>
                    <div style={{
                      width:`${pct}%`,
                      height:'100%',
                      background:'linear-gradient(90deg,var(--primary),var(--accent))',
                      borderRadius:99,
                      transition:'width .6s',
                    }}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Activity feed */}
        <div style={{
          background:'var(--surface)',
          borderRadius:16,
          padding: isMobile ? '16px' : '24px',
          boxShadow:'var(--shadow)',
          border:'1px solid var(--border)',
        }}>
          <h3 style={{
            fontSize: isMobile ? '15px' : '16px',
            fontWeight:700,
            marginBottom: isMobile ? '16px' : '20px',
          }}>Recent Activity</h3>
          <div style={{
            display:'flex',
            flexDirection:'column',
            gap: isMobile ? '10px' : '12px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}>
            {activity.map((a, i) => (
              <div key={i} style={{
                display:'flex',
                gap: isMobile ? '10px' : '12px',
                alignItems:'flex-start',
                padding: isMobile ? '8px' : '0',
                borderRadius: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--surface2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
              }}
              >
                <div style={{
                  width:8,
                  height:8,
                  minWidth:8,
                  borderRadius:'50%',
                  marginTop:6,
                  background: a.type==='success'?'var(--success)':a.type==='danger'?'var(--danger)':a.type==='warning'?'var(--warning)':'var(--accent)',
                }}/>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    fontSize: isMobile ? '12px' : '13px',
                    lineHeight: '1.4',
                    wordBreak: 'break-word',
                  }}>{a.msg}</div>
                  <div style={{
                    fontSize: isMobile ? '10px' : '11px',
                    color:'var(--text-muted)',
                    marginTop:2,
                  }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{
        background:'var(--surface)',
        borderRadius:16,
        padding: isMobile ? '16px' : '24px',
        boxShadow:'var(--shadow)',
        border:'1px solid var(--border)',
      }}>
        <h3 style={{
          fontSize: isMobile ? '15px' : '16px',
          fontWeight:700,
          marginBottom: isMobile ? '12px' : '16px',
        }}>Quick Actions</h3>
        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '10px' : '12px',
        }}>
          {[
            { label:'Add Employee',    page:'employees', color:'var(--primary)' },
            { label:'Mark Attendance', page:'attendance', color:'var(--success)' },
            { label:'Approve Leaves',  page:'leave', color:'var(--warning)'  },
            { label:'View Reports',    page:'reports', color:'var(--accent)'   },
          ].map(q => (
            <button key={q.label} onClick={()=>setPage(q.page)} style={{
              padding: isMobile ? '12px 16px' : '10px 20px',
              borderRadius:10,
              border:`2px solid ${q.color}20`,
              background:`${q.color}10`,
              color:q.color,
              fontFamily:'DM Sans,sans-serif',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight:600,
              cursor:'pointer',
              transition:'all .2s',
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.background=q.color
              e.currentTarget.style.color='#fff'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background=`${q.color}10`
              e.currentTarget.style.color=q.color
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            >{q.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}