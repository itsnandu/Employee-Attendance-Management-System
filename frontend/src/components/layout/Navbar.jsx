// import React, { useState } from 'react'
// import { Bell, Search, Menu, X } from 'lucide-react'
// import useAuth from '../../hooks/useAuth'
// import { getInitials } from '../../utils/helpers'

// const PAGE_TITLES = {
//   dashboard:'Dashboard',
//   employees:'Employees',
//   attendance:'Attendance',
//   leave:'Leave Management',
//   reports:'Reports',
//   usermanagement:'User Management',
//   holidays:'Holidays',
//   announcements:'Announcements',
// }

// export default function Navbar({ page, collapsed, setCollapsed, isMobile, sidebarOpen, setSidebarOpen }) {
//   const { user } = useAuth()
//   const [q, setQ] = useState('')
//   const today = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })

//   return (
//     <header style={{
//       height:'var(--navbar-h)',
//       background:'var(--surface)',
//       borderBottom:'1px solid var(--border)',
//       display:'flex',
//       alignItems:'center',
//       justifyContent:'space-between',
//       padding: isMobile ? '0 12px' : '0 24px',
//       gap:16,
//       position:'sticky',
//       top:0,
//       zIndex:100,
//       boxShadow: 'var(--shadow)',
//     }}>
//       {/* Left Section */}
//       <div style={{
//         display:'flex',
//         alignItems:'center',
//         gap: isMobile ? '12px' : '16px',
//         flex: isMobile ? 1 : 'auto',
//       }}>
//         {isMobile ? (
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             style={{
//               background:'none',
//               border:'none',
//               cursor:'pointer',
//               color:'var(--text)',
//               display:'flex',
//               padding:4,
//               alignItems:'center',
//               justifyContent:'center',
//             }}
//           >
//             {sidebarOpen ? <X size={20} /> : <Menu size={20}/>}
//           </button>
//         ) : (
//           <button
//             onClick={() => setCollapsed(c => !c)}
//             style={{
//               background:'none',
//               border:'none',
//               cursor:'pointer',
//               color:'var(--text-muted)',
//               display:'flex',
//               padding:4,
//               alignItems:'center',
//               justifyContent:'center',
//               transition: 'all 0.2s',
//             }}
//             onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
//             onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
//           >
//             <Menu size={20}/>
//           </button>
//         )}
//         <div>
//           <h1 style={{
//             fontSize: isMobile ? '18px' : '20px',
//             fontWeight:800,
//             lineHeight:1.2,
//             color: 'var(--text)',
//           }}>{PAGE_TITLES[page]}</h1>
//           <p style={{
//             fontSize: isMobile ? '11px' : '12px',
//             color:'var(--text-muted)',
//             marginTop: '2px',
//           }}>{today}</p>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div style={{
//         display:'flex',
//         alignItems:'center',
//         gap: isMobile ? '8px' : '12px',
//         flexDirection: isMobile ? 'row-reverse' : 'row',
//       }}>
//         {/* Search - Hidden on Mobile */}
//         {!isMobile && (
//           <div style={{
//             position:'relative',
//             display:'flex',
//             alignItems:'center',
//             width: 200,
//           }}>
//             <Search size={16} style={{
//               position:'absolute',
//               left:12,
//               color:'var(--text-muted)',
//               pointerEvents: 'none',
//             }}/>
//             <input
//               value={q}
//               onChange={e=>setQ(e.target.value)}
//               placeholder="Search…"
//               style={{
//                 paddingLeft:36,
//                 paddingRight:14,
//                 paddingTop:8,
//                 paddingBottom:8,
//                 border:'1.5px solid var(--border)',
//                 borderRadius:10,
//                 fontSize:14,
//                 fontFamily:'DM Sans,sans-serif',
//                 width:'100%',
//                 outline:'none',
//                 background:'var(--surface2)',
//                 color:'var(--text)',
//                 transition: 'all 0.2s',
//               }}
//               onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
//               onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
//             />
//           </div>
//         )}

//         {/* Notifications */}
//         <button style={{
//           position:'relative',
//           background:'var(--surface2)',
//           border:'1.5px solid var(--border)',
//           borderRadius:10,
//           padding:8,
//           cursor:'pointer',
//           display:'flex',
//           alignItems:'center',
//           justifyContent:'center',
//           color:'var(--text-muted)',
//           transition: 'all 0.2s',
//         }}
//         onMouseEnter={e => {
//           e.currentTarget.style.borderColor = 'var(--primary)'
//           e.currentTarget.style.color = 'var(--primary)'
//         }}
//         onMouseLeave={e => {
//           e.currentTarget.style.borderColor = 'var(--border)'
//           e.currentTarget.style.color = 'var(--text-muted)'
//         }}
//         >
//           <Bell size={18}/>
//           <span style={{
//             position:'absolute',
//             top:6,
//             right:6,
//             width:8,
//             height:8,
//             background:'var(--danger)',
//             borderRadius:'50%',
//             border:'2px solid var(--surface)',
//           }}/>
//         </button>

//         {/* User Avatar */}
//         <div style={{
//           width: isMobile ? 32 : 36,
//           height: isMobile ? 32 : 36,
//           borderRadius:10,
//           background:'linear-gradient(135deg,var(--primary),var(--accent))',
//           display:'flex',
//           alignItems:'center',
//           justifyContent:'center',
//           color:'#fff',
//           fontWeight:700,
//           fontSize: isMobile ? '12px' : '14px',
//           cursor:'pointer',
//           transition: 'all 0.2s',
//           boxShadow: '0 2px 8px rgba(8, 101, 240, 0.2)',
//         }}
//         onMouseEnter={e => {
//           e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 101, 240, 0.3)'
//           e.currentTarget.style.transform = 'scale(1.05)'
//         }}
//         onMouseLeave={e => {
//           e.currentTarget.style.boxShadow = '0 2px 8px rgba(8, 101, 240, 0.2)'
//           e.currentTarget.style.transform = 'scale(1)'
//         }}
//         >{getInitials(user?.name||'A')}</div>
//       </div>
//     </header>
//   )
// }




import React, { useState, useEffect, useRef } from 'react'
import { Bell, Search, Menu, X, LogOut, User, Settings, ChevronRight } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import { getInitials } from '../../utils/helpers'
import { getAnnouncements } from '../../services/announcementService'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  attendance: 'Attendance',
  leave: 'Leave Management',
  reports: 'Reports',
  usermanagement: 'User Management',
  holidays: 'Holidays',
  announcements: 'Announcements',
}

export default function Navbar({ page, collapsed, setCollapsed, isMobile, sidebarOpen, setSidebarOpen, setPage }) {
  const { user, logout } = useAuth()
  const [q, setQ] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const notifRef = useRef(null)
  const profileRef = useRef(null)
  const searchRef = useRef(null)

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  useEffect(() => {
    getAnnouncements()
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.announcements || [])
        const sorted = [...list].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
        setNotifications(sorted.slice(0, 6))
        setUnreadCount(Math.min(sorted.length, 3))
      })
      .catch(() => setNotifications([]))
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleBellClick = () => {
    setShowNotifications(v => !v)
    setShowProfile(false)
    setShowSearch(false)
    setUnreadCount(0)
  }

  const handleProfileClick = () => {
    setShowProfile(v => !v)
    setShowNotifications(false)
    setShowSearch(false)
  }

  const handleMobileSearchClick = () => {
    setShowSearch(v => !v)
    setShowNotifications(false)
    setShowProfile(false)
  }

  const handleLogout = () => {
    logout()
    setShowProfile(false)
  }

  const dropdownBase = {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 14,
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    zIndex: 300,
    animation: 'fadeSlideDown 0.18s ease',
  }

  const TAG_COLORS = {
    HR: { bg: 'rgba(8,101,240,0.1)', color: 'var(--primary)' },
    IT: { bg: 'rgba(0,200,150,0.1)', color: '#00c896' },
    Finance: { bg: 'rgba(255,165,0,0.1)', color: 'orange' },
    General: { bg: 'rgba(120,120,120,0.1)', color: 'var(--text-muted)' },
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header style={{
        height: 'var(--navbar-h)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 12px' : '0 24px',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow)',
      }}>

        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px', flex: isMobile ? 1 : 'auto' }}>
          {isMobile ? (
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', padding: 4, alignItems: 'center', justifyContent: 'center' }}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          ) : (
            <button onClick={() => setCollapsed(c => !c)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4, alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              <Menu size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 800, lineHeight: 1.2, color: 'var(--text)' }}>
              {PAGE_TITLES[page]}
            </h1>
            <p style={{ fontSize: isMobile ? '11px' : '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{today}</p>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', flexDirection: isMobile ? 'row-reverse' : 'row' }}>

          {/* Search Desktop */}
          {!isMobile && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search…"
                style={{
                  paddingLeft: 36, paddingRight: 14, paddingTop: 8, paddingBottom: 8,
                  border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14,
                  fontFamily: 'DM Sans,sans-serif', width: '100%', outline: 'none',
                  background: 'var(--surface2)', color: 'var(--text)', transition: 'all 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>
          )}

          {/* Search Mobile */}
          {isMobile && (
            <div ref={searchRef} style={{ position: 'relative' }}>
              <button onClick={handleMobileSearchClick}
                style={{
                  background: showSearch ? 'var(--primary)' : 'var(--surface2)',
                  border: '1.5px solid var(--border)', borderRadius: 10, padding: 8, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: showSearch ? '#fff' : 'var(--text-muted)', transition: 'all 0.2s',
                }}>
                <Search size={18} />
              </button>
              {showSearch && (
                <div style={{ ...dropdownBase, right: 0, width: 260, padding: 12 }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search…"
                      style={{
                        paddingLeft: 32, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
                        border: '1.5px solid var(--primary)', borderRadius: 9, fontSize: 14,
                        fontFamily: 'DM Sans,sans-serif', width: '100%', outline: 'none',
                        background: 'var(--surface2)', color: 'var(--text)', boxSizing: 'border-box',
                      }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bell */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button onClick={handleBellClick}
              style={{
                position: 'relative', background: showNotifications ? 'var(--primary)' : 'var(--surface2)',
                border: '1.5px solid var(--border)', borderRadius: 10, padding: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: showNotifications ? '#fff' : 'var(--text-muted)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!showNotifications) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' } }}
              onMouseLeave={e => { if (!showNotifications) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' } }}>
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%', border: '2px solid var(--surface)' }} />
              )}
            </button>

            {showNotifications && (
              <div style={{ ...dropdownBase, width: 340, maxHeight: 420, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Notifications</span>
                  {notifications.length > 0 && (
                    <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
                      {notifications.length} announcement{notifications.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                      <Bell size={28} style={{ margin: '0 auto 8px', opacity: 0.3, display: 'block' }} />
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((n, i) => {
                      const tagStyle = TAG_COLORS[n.tag] || TAG_COLORS.General
                      return (
                        <div key={n._id || i}
                          style={{ padding: '12px 16px', borderBottom: i < notifications.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'default', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: tagStyle.color, marginTop: 6, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {n.title}
                                </span>
                                <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 20, background: tagStyle.bg, color: tagStyle.color, fontWeight: 600, flexShrink: 0 }}>
                                  {n.tag || 'HR'}
                                </span>
                              </div>
                              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {n.message || n.msg}
                              </p>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, display: 'block' }}>
                                {n.date ? new Date(n.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
                {notifications.length > 0 && setPage && (
                  <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={() => { setPage('announcements'); setShowNotifications(false) }}
                      style={{
                        width: '100%', padding: '8px 0', border: 'none', borderRadius: 8,
                        background: 'rgba(8,101,240,0.08)', color: 'var(--primary)',
                        fontWeight: 600, fontSize: 13, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                        transition: 'background 0.15s', fontFamily: 'DM Sans, sans-serif',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(8,101,240,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(8,101,240,0.08)'}>
                      View all announcements <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <div onClick={handleProfileClick}
              style={{
                width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: 10,
                background: 'linear-gradient(135deg,var(--primary),var(--accent))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: isMobile ? '12px' : '14px',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: showProfile ? '0 4px 14px rgba(8,101,240,0.35)' : '0 2px 8px rgba(8,101,240,0.2)',
                transform: showProfile ? 'scale(1.05)' : 'scale(1)',
                outline: showProfile ? '2px solid var(--primary)' : 'none',
                outlineOffset: 2,
              }}
              onMouseEnter={e => { if (!showProfile) { e.currentTarget.style.boxShadow = '0 4px 12px rgba(8,101,240,0.3)'; e.currentTarget.style.transform = 'scale(1.05)' } }}
              onMouseLeave={e => { if (!showProfile) { e.currentTarget.style.boxShadow = '0 2px 8px rgba(8,101,240,0.2)'; e.currentTarget.style.transform = 'scale(1)' } }}>
              {getInitials(user?.name || 'A')}
            </div>

            {showProfile && (
              <div style={{ ...dropdownBase, width: 240, padding: 0, overflow: 'hidden' }}>
                <div style={{
                  padding: '16px', display: 'flex', alignItems: 'center', gap: 12,
                  background: 'linear-gradient(135deg, rgba(8,101,240,0.08), rgba(0,200,200,0.06))',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 11,
                    background: 'linear-gradient(135deg,var(--primary),var(--accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(8,101,240,0.25)',
                  }}>
                    {getInitials(user?.name || 'A')}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.name || 'Admin'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.email || ''}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 20, background: 'rgba(8,101,240,0.12)', color: 'var(--primary)', fontWeight: 600 }}>
                        {user?.role || 'admin'}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '6px 0' }}>
                  {[
                    { icon: <User size={15} />, label: 'My Profile', action: () => setShowProfile(false) },
                    { icon: <Settings size={15} />, label: 'Settings', action: () => setShowProfile(false) },
                  ].map((item, i) => (
                    <button key={i} onClick={item.action}
                      style={{
                        width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text)', fontSize: 14,
                        fontFamily: 'DM Sans, sans-serif', transition: 'background 0.15s', textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                  <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
                  <button onClick={handleLogout}
                    style={{
                      width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10, color: 'var(--danger)', fontSize: 14,
                      fontFamily: 'DM Sans, sans-serif', fontWeight: 600, transition: 'background 0.15s', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,59,48,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>
    </>
  )
}
