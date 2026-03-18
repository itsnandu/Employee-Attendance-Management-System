// // src/components/layout/Sidebar.jsx
// import React from 'react'
// import {
//   LayoutDashboard, Users, Clock, Calendar, BarChart3,
//   ChevronLeft, ChevronRight, LogOut, Building2, Megaphone, ShieldCheck,
// } from 'lucide-react'
// import { getInitials } from '../../utils/helpers'
// import useAuth from '../../hooks/useAuth'

// const NAV = [
//   { key:'dashboard',      label:'Dashboard',        icon:LayoutDashboard },
//   { key:'employees',      label:'Employees',         icon:Users           },
//   { key:'attendance',     label:'Attendance',        icon:Clock           },
//   { key:'leave',          label:'Leave Management',  icon:Calendar        },
//   { key:'reports',        label:'Reports',           icon:BarChart3       },
//   { key:'holidays',       label:'Allocate Holidays', icon:Building2       },
//   { key:'announcements',  label:'Announcements',     icon:Megaphone       },
//   { key:'users',          label:'User Management',   icon:ShieldCheck     },
// ]

// export default function Sidebar({ page, setPage, collapsed, setCollapsed }) {
//   const { user, logout } = useAuth()

//   return (
//     <aside style={{
//       width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)',
//       minHeight:'100vh', background:'#0f172a',
//       display:'flex', flexDirection:'column',
//       transition:'width .3s cubic-bezier(.4,0,.2,1)',
//       position:'fixed', left:0, top:0, zIndex:200, overflow:'hidden',
//     }}>
//       {/* Logo */}
//       <div style={{
//         height:'var(--navbar-h)', display:'flex', alignItems:'center',
//         padding: collapsed ? '0 20px' : '0 24px', gap:12,
//         borderBottom:'1px solid rgba(255,255,255,.06)',
//         whiteSpace:'nowrap', overflow:'hidden',
//       }}>
//         <div style={{
//           width:36, height:36, minWidth:36, borderRadius:10,
//           background:'linear-gradient(135deg,var(--primary),var(--accent))',
//           display:'flex', alignItems:'center', justifyContent:'center',
//           fontFamily:'Syne,sans-serif', fontWeight:800, color:'#fff', fontSize:16,
//         }}>E</div>
//         {!collapsed && (
//           <div>
//             <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#fff', fontSize:17, lineHeight:1.2 }}>EA<span style={{color:'var(--accent)'}}>MS</span></div>
//             <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', letterSpacing:'.08em' }}>ENTERPRISE</div>
//           </div>
//         )}
//       </div>

//       {/* Nav */}
//       <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4, overflowY:'auto', overflowX:'hidden' }}>
//         {NAV.map(({ key, label, icon: Icon }) => {
//           const active = page === key
//           return (
//             <button key={key} onClick={() => setPage(key)} title={collapsed ? label : ''} style={{
//               display:'flex', alignItems:'center', gap:12,
//               padding: collapsed ? '11px 0' : '11px 14px',
//               justifyContent: collapsed ? 'center' : 'flex-start',
//               background: active ? 'rgba(99,102,241,.25)' : 'transparent',
//               border: active ? '1px solid rgba(99,102,241,.4)' : '1px solid transparent',
//               borderRadius:10, cursor:'pointer', color: active ? '#a5b4fc' : 'rgba(255,255,255,.55)',
//               fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight: active ? 600 : 400,
//               transition:'all .2s', whiteSpace:'nowrap', overflow:'hidden', width:'100%',
//             }}
//             onMouseEnter={e => { if(!active) { e.currentTarget.style.background='rgba(255,255,255,.06)'; e.currentTarget.style.color='#fff' }}}
//             onMouseLeave={e => { if(!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,.55)' }}}
//             >
//               <Icon size={19} style={{ minWidth:19 }}/>
//               {!collapsed && <span>{label}</span>}
//             </button>
//           )
//         })}
//       </nav>

//       {/* User + Collapse */}
//       <div style={{ padding:'12px', borderTop:'1px solid rgba(255,255,255,.06)' }}>
//         {!collapsed && (
//           <div style={{
//             display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
//             background:'rgba(255,255,255,.05)', borderRadius:10, marginBottom:8, overflow:'hidden',
//           }}>
//             <div style={{
//               width:34, height:34, minWidth:34, borderRadius:8,
//               background:'linear-gradient(135deg,var(--primary),var(--accent))',
//               display:'flex', alignItems:'center', justifyContent:'center',
//               color:'#fff', fontWeight:700, fontSize:13,
//             }}>{getInitials(user?.name || 'Admin')}</div>
//             <div style={{ overflow:'hidden' }}>
//               <div style={{ fontSize:13, fontWeight:600, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
//               <div style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>{user?.role}</div>
//             </div>
//           </div>
//         )}
//         <div style={{ display:'flex', gap:8 }}>
//           <button onClick={logout} title="Logout" style={{
//             flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
//             padding:'9px 0', background:'rgba(239,68,68,.12)', border:'1px solid rgba(239,68,68,.25)',
//             borderRadius:10, color:'#f87171', cursor:'pointer', fontSize:13, fontWeight:600,
//             fontFamily:'DM Sans,sans-serif', transition:'all .2s',
//           }}>
//             <LogOut size={16}/>{!collapsed && 'Logout'}
//           </button>
//           <button onClick={() => setCollapsed(c => !c)} style={{
//             width:38, display:'flex', alignItems:'center', justifyContent:'center',
//             background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)',
//             borderRadius:10, color:'rgba(255,255,255,.5)', cursor:'pointer',
//           }}>{collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}</button>
//         </div>
//       </div>
//     </aside>
//   )
// }

import React from 'react'
import {
  LayoutDashboard, Users, Clock, Calendar, BarChart3, ShieldCheck,
  ChevronLeft, ChevronRight, LogOut, Building2, Megaphone, X,
} from 'lucide-react'
import { getInitials } from '../../utils/helpers'
import useAuth from '../../hooks/useAuth'

const NAV = [
  { key:'dashboard',       label:'Dashboard',        icon:LayoutDashboard },
  { key:'employees',       label:'Employees',         icon:Users           },
  { key:'attendance',      label:'Attendance',        icon:Clock           },
  { key:'leave',           label:'Leave Management',  icon:Calendar        },
  { key:'reports',         label:'Reports',           icon:BarChart3       },
  { key:'holidays',        label:'Holidays',          icon:Building2       },
  { key:'announcements',   label:'Announcements',     icon:Megaphone       },
  { key:'usermanagement',  label:'User Management',   icon:ShieldCheck     },
]

export default function Sidebar({ page, setPage, collapsed, setCollapsed, isMobile, onClose }) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    if (isMobile) onClose?.()
  }

  return (
    <aside style={{
      width: isMobile ? '100%' : (collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)'),
      minHeight:'100vh', 
      background:'linear-gradient(135deg, #0f172a 0%, #1a2a4a 100%)',
      display:'flex', 
      flexDirection:'column',
      transition:'width .3s cubic-bezier(.4,0,.2,1)',
      position: isMobile ? 'relative' : 'fixed',
      left: isMobile ? 'auto' : 0,
      top: isMobile ? 'auto' : 0,
      zIndex: isMobile ? 'auto' : 200,
      overflow:'hidden',
      boxShadow: isMobile ? '0 4px 24px rgba(0,0,0,.2)' : 'none',
    }}>
      {/* Logo + Close Button */}
      <div style={{
        height:'var(--navbar-h)',
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        padding: collapsed ? '0 20px' : '0 24px',
        borderBottom:'1px solid rgba(255,255,255,.06)',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width:36,
            height:36,
            minWidth:36,
            borderRadius:10,
            background:'linear-gradient(135deg,var(--primary),var(--accent))',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontFamily:'Syne,sans-serif',
            fontWeight:800,
            color:'#fff',
            fontSize:16,
          }}>E</div>
          {!collapsed && (
            <div>
              <div style={{
                fontFamily:'Syne,sans-serif',
                fontWeight:800,
                color:'#fff',
                fontSize:17,
                lineHeight:1.2,
              }}>EA<span style={{color:'var(--accent)'}}>MS</span></div>
              <div style={{
                fontSize:10,
                color:'rgba(255,255,255,.4)',
                letterSpacing:'.08em',
              }}>ENTERPRISE</div>
            </div>
          )}
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,.6)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{
        flex:1,
        padding: isMobile ? '12px 12px' : '16px 12px',
        display:'flex',
        flexDirection:'column',
        gap:4,
        overflowY:'auto',
        overflowX:'hidden',
      }}>
        {NAV.map(({ key, label, icon: Icon }) => {
          const active = page === key
          return (
            <button
              key={key}
              onClick={() => {
                setPage(key)
                if (isMobile) onClose?.()
              }}
              title={collapsed && !isMobile ? label : ''}
              style={{
                display:'flex',
                alignItems:'center',
                gap:12,
                padding: collapsed && !isMobile ? '11px 0' : '12px 14px',
                justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                background: active ? 'rgba(8, 101, 240, 0.25)' : 'transparent',
                border: active ? '1.5px solid rgba(8, 101, 240, 0.5)' : '1px solid transparent',
                borderRadius:10,
                cursor:'pointer',
                color: active ? '#60a5fa' : 'rgba(255,255,255,.55)',
                fontFamily:'DM Sans,sans-serif',
                fontSize: isMobile ? '15px' : '14px',
                fontWeight: active ? 600 : 500,
                transition:'all .2s',
                whiteSpace:'nowrap',
                overflow:'hidden',
                width:'100%',
              }}
              onMouseEnter={e => {
                if(!active && !isMobile) {
                  e.currentTarget.style.background='rgba(255,255,255,.06)'
                  e.currentTarget.style.color='#fff'
                }
              }}
              onMouseLeave={e => {
                if(!active && !isMobile) {
                  e.currentTarget.style.background='transparent'
                  e.currentTarget.style.color='rgba(255,255,255,.55)'
                }
              }}
            >
              <Icon size={19} style={{ minWidth:19 }}/>
              {!collapsed && <span>{label}</span>}
            </button>
          )
        })}
      </nav>

      {/* User + Collapse */}
      <div style={{
        padding: isMobile ? '16px' : '12px',
        borderTop:'1px solid rgba(255,255,255,.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {!collapsed && (
          <div style={{
            display:'flex',
            alignItems:'center',
            gap:10,
            padding:'12px 12px',
            background:'rgba(255,255,255,.05)',
            borderRadius:10,
            overflow:'hidden',
          }}>
            <div style={{
              width:34,
              height:34,
              minWidth:34,
              borderRadius:8,
              background:'linear-gradient(135deg,var(--primary),var(--accent))',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              color:'#fff',
              fontWeight:700,
              fontSize:13,
            }}>{getInitials(user?.name || 'Admin')}</div>
            <div style={{ overflow:'hidden' }}>
              <div style={{
                fontSize:13,
                fontWeight:600,
                color:'#fff',
                whiteSpace:'nowrap',
                overflow:'hidden',
                textOverflow:'ellipsis',
              }}>{user?.name}</div>
              <div style={{
                fontSize:11,
                color:'rgba(255,255,255,.4)',
              }}>{user?.role}</div>
            </div>
          </div>
        )}
        <div style={{
          display:'flex',
          gap:8,
          flexDirection: isMobile && !collapsed ? 'column' : 'row',
        }}>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              flex:1,
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              gap:8,
              padding: isMobile && !collapsed ? '12px 14px' : '9px 0',
              background:'rgba(239,68,68,.12)',
              border:'1px solid rgba(239,68,68,.25)',
              borderRadius:10,
              color:'#f87171',
              cursor:'pointer',
              fontSize: isMobile ? '14px' : '13px',
              fontWeight:600,
              fontFamily:'DM Sans,sans-serif',
              transition:'all .2s',
            }}
          >
            <LogOut size={16}/>{!collapsed && 'Logout'}
          </button>
          {!isMobile && (
            <button
              onClick={() => setCollapsed(c => !c)}
              style={{
                width:38,
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                background:'rgba(255,255,255,.06)',
                border:'1px solid rgba(255,255,255,.1)',
                borderRadius:10,
                color:'rgba(255,255,255,.5)',
                cursor:'pointer',
              }}
            >{collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}</button>
          )}
        </div>
      </div>
    </aside>
  )
}