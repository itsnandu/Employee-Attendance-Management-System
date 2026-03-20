// import React from 'react'
// import {
//   LayoutDashboard, Users, Clock, Calendar, BarChart3, ShieldCheck,
//   ChevronLeft, ChevronRight, LogOut, Building2, Megaphone, X, Home,
// } from 'lucide-react'
// import { getInitials } from '../../utils/helpers'
// import useAuth from '../../hooks/useAuth'

// const NAV = [
//   { key:'dashboard',       label:'Dashboard',        icon:LayoutDashboard },
//   { key:'employees',       label:'Employees',         icon:Users           },
//   { key:'attendance',      label:'Attendance',        icon:Clock           },
//   { key:'leave',           label:'Leave Management',  icon:Calendar        },
//   { key:'wfh',             label:'Work from Home',    icon:Home            },
//   { key:'reports',         label:'Reports',           icon:BarChart3       },
//   { key:'holidays',        label:'Holidays',          icon:Building2       },
//   { key:'announcements',   label:'Announcements',     icon:Megaphone       },
//   { key:'usermanagement',  label:'User Management',   icon:ShieldCheck     },
// ]

// export default function Sidebar({ page, setPage, collapsed, setCollapsed, isMobile, onClose }) {
//   const { user, logout } = useAuth()

//   const handleLogout = () => {
//     logout()
//     if (isMobile) onClose?.()
//   }

//   return (
//     <aside style={{
//       width: isMobile ? '100%' : (collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)'),
//       minHeight:'100vh', 
//       background:'linear-gradient(135deg, #0f172a 0%, #1a2a4a 100%)',
//       display:'flex', 
//       flexDirection:'column',
//       transition:'width .3s cubic-bezier(.4,0,.2,1)',
//       position: isMobile ? 'relative' : 'fixed',
//       left: isMobile ? 'auto' : 0,
//       top: isMobile ? 'auto' : 0,
//       zIndex: isMobile ? 'auto' : 200,
//       overflow:'hidden',
//       boxShadow: isMobile ? '0 4px 24px rgba(0,0,0,.2)' : 'none',
//     }}>
//       {/* Logo + Close Button */}
//       <div style={{
//         height:'var(--navbar-h)',
//         display:'flex',
//         alignItems:'center',
//         justifyContent:'space-between',
//         padding: collapsed ? '0 20px' : '0 24px',
//         borderBottom:'1px solid rgba(255,255,255,.06)',
//         gap: 12,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <div style={{
//             width:36,
//             height:36,
//             minWidth:36,
//             borderRadius:10,
//             background:'linear-gradient(135deg,var(--primary),var(--accent))',
//             display:'flex',
//             alignItems:'center',
//             justifyContent:'center',
//             fontFamily:'Syne,sans-serif',
//             fontWeight:800,
//             color:'#fff',
//             fontSize:16,
//           }}>E</div>
//           {!collapsed && (
//             <div>
//               <div style={{
//                 fontFamily:'Syne,sans-serif',
//                 fontWeight:800,
//                 color:'#fff',
//                 fontSize:17,
//                 lineHeight:1.2,
//               }}>EA<span style={{color:'var(--accent)'}}>MS</span></div>
//               <div style={{
//                 fontSize:10,
//                 color:'rgba(255,255,255,.4)',
//                 letterSpacing:'.08em',
//               }}>ENTERPRISE</div>
//             </div>
//           )}
//         </div>
//         {isMobile && (
//           <button
//             onClick={onClose}
//             style={{
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               color: 'rgba(255,255,255,.6)',
//               padding: '4px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//           >
//             <X size={20} />
//           </button>
//         )}
//       </div>

//       {/* Nav */}
//       <nav style={{
//         flex:1,
//         padding: isMobile ? '12px 12px' : '16px 12px',
//         display:'flex',
//         flexDirection:'column',
//         gap:4,
//         overflowY:'auto',
//         overflowX:'hidden',
//       }}>
//         {NAV.map(({ key, label, icon: Icon }) => {
//           const active = page === key
//           return (
//             <button
//               key={key}
//               onClick={() => {
//                 setPage(key)
//                 if (isMobile) onClose?.()
//               }}
//               title={collapsed && !isMobile ? label : ''}
//               style={{
//                 display:'flex',
//                 alignItems:'center',
//                 gap:12,
//                 padding: collapsed && !isMobile ? '11px 0' : '12px 14px',
//                 justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
//                 background: active ? 'rgba(8, 101, 240, 0.25)' : 'transparent',
//                 border: active ? '1.5px solid rgba(8, 101, 240, 0.5)' : '1px solid transparent',
//                 borderRadius:10,
//                 cursor:'pointer',
//                 color: active ? '#60a5fa' : 'rgba(255,255,255,.55)',
//                 fontFamily:'DM Sans,sans-serif',
//                 fontSize: isMobile ? '15px' : '14px',
//                 fontWeight: active ? 600 : 500,
//                 transition:'all .2s',
//                 whiteSpace:'nowrap',
//                 overflow:'hidden',
//                 width:'100%',
//               }}
//               onMouseEnter={e => {
//                 if(!active && !isMobile) {
//                   e.currentTarget.style.background='rgba(255,255,255,.06)'
//                   e.currentTarget.style.color='#fff'
//                 }
//               }}
//               onMouseLeave={e => {
//                 if(!active && !isMobile) {
//                   e.currentTarget.style.background='transparent'
//                   e.currentTarget.style.color='rgba(255,255,255,.55)'
//                 }
//               }}
//             >
//               <Icon size={19} style={{ minWidth:19 }}/>
//               {!collapsed && <span>{label}</span>}
//             </button>
//           )
//         })}
//       </nav>

//       {/* User + Collapse */}
//       <div style={{
//         padding: isMobile ? '16px' : '12px',
//         borderTop:'1px solid rgba(255,255,255,.06)',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '12px',
//       }}>
//         {!collapsed && (
//           <div style={{
//             display:'flex',
//             alignItems:'center',
//             gap:10,
//             padding:'12px 12px',
//             background:'rgba(255,255,255,.05)',
//             borderRadius:10,
//             overflow:'hidden',
//           }}>
//             <div style={{
//               width:34,
//               height:34,
//               minWidth:34,
//               borderRadius:8,
//               background:'linear-gradient(135deg,var(--primary),var(--accent))',
//               display:'flex',
//               alignItems:'center',
//               justifyContent:'center',
//               color:'#fff',
//               fontWeight:700,
//               fontSize:13,
//             }}>{getInitials(user?.name || 'Admin')}</div>
//             <div style={{ overflow:'hidden' }}>
//               <div style={{
//                 fontSize:13,
//                 fontWeight:600,
//                 color:'#fff',
//                 whiteSpace:'nowrap',
//                 overflow:'hidden',
//                 textOverflow:'ellipsis',
//               }}>{user?.name}</div>
//               <div style={{
//                 fontSize:11,
//                 color:'rgba(255,255,255,.4)',
//               }}>{user?.role}</div>
//             </div>
//           </div>
//         )}
//         <div style={{
//           display:'flex',
//           gap:8,
//           flexDirection: isMobile && !collapsed ? 'column' : 'row',
//         }}>
//           <button
//             onClick={handleLogout}
//             title="Logout"
//             style={{
//               flex:1,
//               display:'flex',
//               alignItems:'center',
//               justifyContent:'center',
//               gap:8,
//               padding: isMobile && !collapsed ? '12px 14px' : '9px 0',
//               background:'rgba(239,68,68,.12)',
//               border:'1px solid rgba(239,68,68,.25)',
//               borderRadius:10,
//               color:'#f87171',
//               cursor:'pointer',
//               fontSize: isMobile ? '14px' : '13px',
//               fontWeight:600,
//               fontFamily:'DM Sans,sans-serif',
//               transition:'all .2s',
//             }}
//           >
//             <LogOut size={16}/>{!collapsed && 'Logout'}
//           </button>
//           {!isMobile && (
//             <button
//               onClick={() => setCollapsed(c => !c)}
//               style={{
//                 width:38,
//                 display:'flex',
//                 alignItems:'center',
//                 justifyContent:'center',
//                 background:'rgba(255,255,255,.06)',
//                 border:'1px solid rgba(255,255,255,.1)',
//                 borderRadius:10,
//                 color:'rgba(255,255,255,.5)',
//                 cursor:'pointer',
//               }}
//             >{collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}</button>
//           )}
//         </div>
//       </div>
//     </aside>
//   )
// }

import React from 'react'
import {
  LayoutDashboard, Users, Clock, Calendar, BarChart3, ShieldCheck,
  ChevronLeft, ChevronRight, LogOut, Building2, Megaphone, X, Home,
} from 'lucide-react'
import { getInitials } from '../../utils/helpers'
import useAuth from '../../hooks/useAuth'

// ── Brand colours (matching reference image) ────────────────
const S = {
  bg:          '#0061f2',           // main sidebar blue
  bgDark:      '#0052cc',           // slightly darker for depth
  activeBg:    '#ffffff',              // active item — solid white card
  activeBorder:'#ffffff',
  hoverBg:     'rgba(255,255,255,.10)',
  textPrimary: '#ffffff',
  textMuted:   'rgba(255,255,255,.60)',
  textSubtle:  'rgba(255,255,255,.40)',
  divider:     'rgba(255,255,255,.12)',
  logoutBg:    'rgba(255,80,80,.18)',
  logoutBorder:'rgba(255,100,100,.30)',
  logoutColor: '#ffa3a3',
  collapseBg:  'rgba(255,255,255,.10)',
  collapseBorder:'rgba(255,255,255,.18)',
}

const NAV = [
  { key: 'dashboard',      label: 'Dashboard',        icon: LayoutDashboard },
  { key: 'employees',      label: 'Employees',        icon: Users           },
  { key: 'attendance',     label: 'Attendance',       icon: Clock           },
  { key: 'leave',          label: 'Leave Management', icon: Calendar        },
  { key: 'wfh',            label: 'Work from Home',   icon: Home            },
  { key: 'reports',        label: 'Reports',          icon: BarChart3       },
  { key: 'holidays',       label: 'Holidays',         icon: Building2       },
  { key: 'announcements',  label: 'Announcements',    icon: Megaphone       },
  { key: 'usermanagement', label: 'User Management',  icon: ShieldCheck     },
]

export default function Sidebar({ page, setPage, collapsed, setCollapsed, isMobile, onClose }) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    if (isMobile) onClose?.()
  }

  const sidebarW = collapsed && !isMobile ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)'

  return (
    <aside style={{
      width: isMobile ? '100%' : sidebarW,
      minHeight: '100vh',
      background: S.bg,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width .3s cubic-bezier(.4,0,.2,1)',
      position: isMobile ? 'relative' : 'fixed',
      left: isMobile ? 'auto' : 0,
      top: isMobile ? 'auto' : 0,
      zIndex: isMobile ? 'auto' : 200,
      overflow: 'hidden',
      boxShadow: '4px 0 24px rgba(0,0,0,.18)',
    }}>

      {/* ── Logo row ── */}
      <div style={{
        height: 'var(--navbar-h)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: collapsed && !isMobile ? '0 18px' : '0 20px',
        borderBottom: `1px solid ${S.divider}`,
        flexShrink: 0,
        gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, overflow: 'hidden' }}>
          {/* Icon square */}
          <div style={{
            width: 36, height: 36, minWidth: 36, borderRadius: 10,
            background: 'rgba(255,255,255,.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#fff', fontSize: 17,
            letterSpacing: '-1px', border: '1.5px solid rgba(255,255,255,.3)',
            flexShrink: 0,
          }}>E</div>

          {(!collapsed || isMobile) && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{
              fontWeight: 800, color: '#fff',
                fontSize: 18, lineHeight: 1.15, letterSpacing: '-.3px',
                whiteSpace: 'nowrap',
              }}>
                EA<span style={{ color: '#a5d8ff' }}>MS</span>
              </div>
              <div style={{
                fontSize: 9.5, color: S.textSubtle, letterSpacing: '.1em',
                textTransform: 'uppercase', marginTop: 1,
              }}>ENTERPRISE</div>
            </div>
          )}
        </div>

        {/* Mobile close */}
        {isMobile && (
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: S.textMuted, padding: 4, display: 'flex', alignItems: 'center',
            borderRadius: 6, transition: 'color .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = S.textMuted}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* ── Nav items ── */}
      <nav style={{
        flex: 1,
        padding: '12px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {NAV.map(({ key, label, icon: Icon }) => {
          const active = page === key
          return (
            <button
              key={key}
              onClick={() => { setPage(key); if (isMobile) onClose?.() }}
              title={collapsed && !isMobile ? label : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: collapsed && !isMobile ? '11px 0' : '10px 13px',
                justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                background: active ? S.activeBg : 'transparent',
                border: active
                  ? `1px solid ${S.activeBorder}`
                  : '1px solid transparent',
                boxShadow: active ? '0 4px 16px rgba(0,0,0,.15)' : 'none',
                borderRadius: 10,
                cursor: 'pointer',
                color: active ? '#0061f2' : S.textMuted,
                fontFamily: 'DM Sans,sans-serif',
                fontSize: isMobile ? '14.5px' : '13.5px',
                fontWeight: active ? 700 : 500,
                transition: 'all .18s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: '100%',
                textAlign: 'left',
                letterSpacing: active ? '-.1px' : 'normal',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = S.hoverBg
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = S.textMuted
                }
              }}
            >
              <Icon
                size={18}
                style={{ minWidth: 18, opacity: active ? 1 : 0.75, color: active ? '#0061f2' : 'inherit' }}
              />
              {(!collapsed || isMobile) && <span>{label}</span>}
            </button>
          )
        })}
      </nav>

      {/* ── Footer: user card + logout + collapse ── */}
      <div style={{
        padding: isMobile ? '14px' : '10px',
        borderTop: `1px solid ${S.divider}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexShrink: 0,
      }}>
        {/* User info card — only when expanded */}
        {(!collapsed || isMobile) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            background: 'rgba(255,255,255,.10)',
            borderRadius: 11,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,.12)',
          }}>
            <div style={{
              width: 34, height: 34, minWidth: 34, borderRadius: 9,
              background: 'rgba(255,255,255,.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 13,
              border: '1.5px solid rgba(255,255,255,.35)',
              flexShrink: 0,
            }}>{getInitials(user?.name || 'Admin')}</div>
            <div style={{ overflow: 'hidden', minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: '#fff',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{user?.name || 'Admin'}</div>
              <div style={{
                fontSize: 11, color: S.textSubtle,
                textTransform: 'capitalize',
              }}>{user?.role || 'admin'}</div>
            </div>
          </div>
        )}

        {/* Logout + collapse row */}
        <div style={{ display: 'flex', gap: 7 }}>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: collapsed && !isMobile ? '10px 0' : '9px 12px',
              background: S.logoutBg,
              border: `1px solid ${S.logoutBorder}`,
              borderRadius: 10,
              color: S.logoutColor,
              cursor: 'pointer',
              fontSize: 13, fontWeight: 700,
              fontFamily: 'DM Sans,sans-serif',
              transition: 'all .2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,.28)'
              e.currentTarget.style.color = '#ffc0c0'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = S.logoutBg
              e.currentTarget.style.color = S.logoutColor
            }}
          >
            <LogOut size={15} />
            {(!collapsed || isMobile) && 'Logout'}
          </button>

          {/* Collapse toggle — desktop only */}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(c => !c)}
              title={collapsed ? 'Expand' : 'Collapse'}
              style={{
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: S.collapseBg,
                border: `1px solid ${S.collapseBorder}`,
                borderRadius: 10,
                color: S.textMuted,
                cursor: 'pointer',
                transition: 'all .2s',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = S.hoverBg
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = S.collapseBg
                e.currentTarget.style.color = S.textMuted
              }}
            >
              {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
