// // src/components/employee/EmpLayout.jsx
// import { useState } from "react";
// import { T, Avatar } from "./EmpUI";
// import { ME } from "../../utils/EmployeeData";

// const NAV = [
//   { key: "dashboard",  icon: "⊞",  label: "Dashboard"    },
//   { key: "attendance", icon: "⏱",  label: "My Attendance" },
//   { key: "leaves",     icon: "🗓", label: "My Leaves"     },
//   { key: "holidays",   icon: "🎉",  label: "Holidays"      },
//   { key: "payroll",    icon: "💰",  label: "Payroll"       },
//   { key: "profile",    icon: "👤",  label: "My Profile"    },
//   { key: "notices",    icon: "📢",  label: "Notices"       },
// ];

// export default function EmpLayout({ page, setPage, children }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const w = collapsed ? 72 : 260;

//   return (
//     <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: T.bg }}>

//       {/* ── Sidebar ── */}
//       <div style={{
//         width: w, background: T.sidebarBg, color: "#fff",
//         display: "flex", flexDirection: "column",
//         transition: "width .25s ease", flexShrink: 0,
//         position: "sticky", top: 0, height: "100vh", overflow: "hidden",
//       }}>

//         {/* Logo */}
//         <div style={{
//           padding: collapsed ? "20px 0" : "20px 20px 16px",
//           borderBottom: "1px solid #1e293b",
//           display: "flex", alignItems: "center",
//           justifyContent: collapsed ? "center" : "space-between",
//         }}>
//           {!collapsed && (
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{
//                 width: 38, height: 38, borderRadius: 10, background: T.primary,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, flexShrink: 0,
//               }}>H</div>
//               <div>
//                 <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: ".5px" }}>HRMS</div>
//                 <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase" }}>Employee</div>
//               </div>
//             </div>
//           )}
//           {collapsed && (
//             <div style={{
//               width: 38, height: 38, borderRadius: 10, background: T.primary,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16,
//             }}>H</div>
//           )}
//         </div>

//         {/* Nav */}
//         <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
//           {NAV.map(item => {
//             const active = page === item.key;
//             return (
//               <button key={item.key} onClick={() => setPage(item.key)} title={collapsed ? item.label : ""} style={{
//                 width: "100%", display: "flex", alignItems: "center",
//                 gap: collapsed ? 0 : 12,
//                 justifyContent: collapsed ? "center" : "flex-start",
//                 padding: collapsed ? "10px 0" : "10px 12px",
//                 borderRadius: 10, marginBottom: 2, cursor: "pointer",
//                 background: active ? T.primary : "transparent",
//                 color: active ? "#fff" : "#94a3b8",
//                 border: "none", transition: "all .2s",
//                 fontSize: 14, fontWeight: active ? 600 : 400,
//                 fontFamily: "'DM Sans', sans-serif",
//               }}
//                 onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.color = "#fff"; }}
//                 onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; } }}
//               >
//                 <span style={{ fontSize: 17, lineHeight: 1 }}>{item.icon}</span>
//                 {!collapsed && item.label}
//               </button>
//             );
//           })}
//         </nav>

//         {/* User + Collapse */}
//         <div style={{ padding: "12px 8px 16px", borderTop: "1px solid #1e293b" }}>
//           {!collapsed && (
//             <div style={{
//               display: "flex", alignItems: "center", gap: 10,
//               padding: "10px 12px", borderRadius: 10, background: "#1e293b", marginBottom: 8,
//             }}>
//               <Avatar initials={ME.initials} color={ME.color} size={32} />
//               <div style={{ overflow: "hidden" }}>
//                 <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ME.name}</div>
//                 <div style={{ fontSize: 11, color: "#64748b" }}>Employee</div>
//               </div>
//             </div>
//           )}
//           <button onClick={() => setCollapsed(c => !c)} style={{
//             width: "100%", padding: "8px 0", border: "none",
//             borderRadius: 10, background: "#1e293b", color: "#64748b",
//             cursor: "pointer", fontSize: 16, transition: "all .2s",
//           }}>{collapsed ? "→" : "← Collapse"}</button>
//           <button style={{
//             width: "100%", marginTop: 6, padding: "9px", border: "none",
//             borderRadius: 10, background: "#1e293b", color: T.danger,
//             fontSize: 13, fontWeight: 600, cursor: "pointer",
//             display: "flex", alignItems: "center", justifyContent: "center", gap: collapsed ? 0 : 8,
//             fontFamily: "'DM Sans', sans-serif",
//           }}>
//             <span>↪</span>
//             {!collapsed && "Logout"}
//           </button>
//         </div>
//       </div>

//       {/* ── Main ── */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

//         {/* Topbar */}
//         <div style={{
//           height: 64, background: T.surface, borderBottom: `1px solid ${T.border}`,
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           padding: "0 28px", flexShrink: 0, position: "sticky", top: 0, zIndex: 50,
//         }}>
//           <div>
//             <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: T.text }}>
//               {NAV.find(n => n.key === page)?.label || "Dashboard"}
//             </div>
//             <div style={{ fontSize: 12, color: T.muted }}>Thursday, 5 March 2026</div>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{
//               display: "flex", alignItems: "center", gap: 8,
//               background: T.surface2, borderRadius: 10,
//               padding: "8px 14px", fontSize: 13, color: T.muted, width: 220,
//             }}>
//               <span>🔍</span><span>Search...</span>
//             </div>
//             <div style={{ position: "relative" }}>
//               <button style={{
//                 width: 38, height: 38, borderRadius: 10, background: T.surface2,
//                 border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 18,
//               }}>🔔</button>
//               <div style={{
//                 position: "absolute", top: 6, right: 6, width: 8, height: 8,
//                 borderRadius: "50%", background: T.danger, border: `2px solid ${T.surface}`,
//               }} />
//             </div>
//             <Avatar initials={ME.initials} color={ME.color} size={38} />
//           </div>
//         </div>

//         {/* Page content */}
//         <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/employee/EmpLayout.jsx
import React, { useState, useRef, useEffect } from "react";
import { T, Avatar } from "./EmpUI";
import { ME } from "../../utils/EmployeeData";
import useAuth from "../../hooks/useAuth";

// ── Sample notifications ───────────────────────────────────────
const NOTIFICATIONS = [
  { id:1, icon:"🎉", title:"Holi Holiday",       msg:"Office closed on March 25th for Holi.",          time:"2h ago", unread:true  },
  { id:2, icon:"✅", title:"Leave Approved",      msg:"Your casual leave for Mar 20–21 was approved.",  time:"1d ago", unread:true  },
  { id:3, icon:"💰", title:"Payslip Available",   msg:"Your February 2026 payslip is ready.",           time:"3d ago", unread:false },
  { id:4, icon:"📋", title:"Policy Update",       msg:"New WFH policy is now in effect.",               time:"5d ago", unread:false },
  { id:5, icon:"📅", title:"Q1 Review Reminder",  msg:"Self-assessment due by March 28.",               time:"1w ago", unread:false },
];

// ── Click-outside hook ─────────────────────────────────────────
function useClickOutside(ref, handler) {
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
}

const NAV = [
  { key: "dashboard",  icon: "⊞",  label: "Dashboard"      },
  { key: "attendance", icon: "⏱",  label: "My Attendance"  },
  { key: "leaves",     icon: "🗓", label: "My Leaves"      },
  { key: "wfh",        icon: "🏠",  label: "Work From Home" },
  { key: "holidays",   icon: "🎉",  label: "Holidays"       },
  { key: "payroll",    icon: "💰",  label: "Payroll"        },
  { key: "profile",    icon: "👤",  label: "My Profile"     },
  { key: "notices",    icon: "📢",  label: "Notices"        },
];

// ── Searchable pages & content ────────────────────────────────
const SEARCH_INDEX = [
  { label:"Dashboard",          page:"dashboard",  desc:"Overview of your attendance, leaves and tasks"   },
  { label:"My Attendance",      page:"attendance", desc:"View and mark your daily attendance"              },
  { label:"Check In / Out",     page:"attendance", desc:"Mark your check-in or check-out for today"        },
  { label:"My Leaves",          page:"leaves",     desc:"Apply for leave or view leave balance"            },
  { label:"Leave Balance",      page:"leaves",     desc:"Remaining casual, sick and earned leaves"         },
  { label:"Work From Home",     page:"wfh",        desc:"Apply and track your WFH requests"               },
  { label:"WFH Calendar",       page:"wfh",        desc:"Monthly calendar view of WFH days"               },
  { label:"Holidays",           page:"holidays",   desc:"View public and company holidays for 2026"        },
  { label:"Payroll",            page:"payroll",    desc:"View payslips and salary breakdown"               },
  { label:"My Profile",         page:"profile",    desc:"View and edit your personal information"          },
  { label:"Notices",            page:"notices",    desc:"Company announcements and HR notices"             },
];

function SearchBar({ setPage }) {
  const [query, setQuery]   = React.useState("");
  const [open,  setOpen]    = React.useState(false);
  const [idx,   setIdx]     = React.useState(0);
  const ref   = useRef(null);
  const input = useRef(null);

  useClickOutside(ref, () => { setOpen(false); setQuery(""); });

  const results = query.trim().length > 0
    ? SEARCH_INDEX.filter(r =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.desc.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  function go(item) {
    setPage(item.page);
    setQuery("");
    setOpen(false);
  }

  function onKey(e) {
    if (!results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(i+1, results.length-1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setIdx(i => Math.max(i-1, 0)); }
    if (e.key === "Enter")     { go(results[idx]); }
    if (e.key === "Escape")    { setOpen(false); setQuery(""); }
  }

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div style={{
        display:"flex", alignItems:"center", gap:8,
        background: open ? T.surface : T.surface2,
        border: `1.5px solid ${open ? T.primary : T.border}`,
        borderRadius:10, padding:"0 14px", width:220,
        transition:"all .2s",
      }}>
        <span style={{ fontSize:14, flexShrink:0 }}>🔍</span>
        <input
          ref={input}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setIdx(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search..."
          style={{
            border:"none", outline:"none", background:"transparent",
            fontSize:13, color:T.text, fontFamily:"'DM Sans',sans-serif",
            width:"100%", padding:"8px 0",
          }}
        />
        {query && (
          <button onClick={() => { setQuery(""); input.current?.focus(); }} style={{
            background:"none", border:"none", cursor:"pointer",
            color:T.muted, fontSize:16, padding:"0 2px", lineHeight:1,
          }}>×</button>
        )}
      </div>

      {open && results.length > 0 && (
        <div style={{
          position:"absolute", top:44, left:0, width:280,
          background:T.surface, border:`1px solid ${T.border}`,
          borderRadius:12, boxShadow:"0 12px 36px rgba(0,0,0,.12)",
          zIndex:300, overflow:"hidden", animation:"dropIn .15s ease",
        }}>
          {results.map((r, i) => (
            <div key={r.label} onClick={() => go(r)}
              onMouseEnter={() => setIdx(i)}
              style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"10px 14px", cursor:"pointer",
                background: i===idx ? T.primaryLight : "transparent",
                borderBottom:`1px solid ${T.border}`,
                transition:"background .1s",
              }}
            >
              <div style={{
                width:32, height:32, borderRadius:8, flexShrink:0,
                background: i===idx ? T.primary : T.surface2,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:15,
              }}>
                {NAV.find(n=>n.key===r.page)?.icon || "📄"}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{r.label}</div>
                <div style={{ fontSize:11, color:T.muted }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && query.trim().length > 0 && results.length === 0 && (
        <div style={{
          position:"absolute", top:44, left:0, width:280,
          background:T.surface, border:`1px solid ${T.border}`,
          borderRadius:12, boxShadow:"0 12px 36px rgba(0,0,0,.12)",
          zIndex:300, padding:"20px 14px", textAlign:"center",
        }}>
          <div style={{ fontSize:20, marginBottom:6 }}>🔍</div>
          <div style={{ fontSize:13, color:T.muted }}>No results for "<strong>{query}</strong>"</div>
        </div>
      )}
    </div>
  );
}

export default function EmpLayout({ page, setPage, children }) {
  const [collapsed, setCollapsed]     = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs]           = useState(NOTIFICATIONS);
  const { logout } = useAuth();
  const w = collapsed ? 72 : 260;

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  useClickOutside(notifRef,   () => setNotifOpen(false));
  useClickOutside(profileRef, () => setProfileOpen(false));

  const unreadCount = notifs.filter(n => n.unread).length;

  function markAllRead() {
    setNotifs(n => n.map(x => ({ ...x, unread: false })));
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: T.bg }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: w, background: T.sidebarBg, color: "#fff",
        display: "flex", flexDirection: "column",
        transition: "width .25s ease", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? "20px 0" : "20px 20px 16px",
          borderBottom: "1px solid #1e293b",
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: T.primary,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, flexShrink: 0,
              }}>H</div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: ".5px" }}>HRMS</div>
                <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase" }}>Employee</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: T.primary,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16,
            }}>H</div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {NAV.map(item => {
            const active = page === item.key;
            return (
              <button key={item.key} onClick={() => setPage(item.key)} title={collapsed ? item.label : ""} style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: collapsed ? 0 : 12,
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "10px 0" : "10px 12px",
                borderRadius: 10, marginBottom: 2, cursor: "pointer",
                background: active ? T.primary : "transparent",
                color: active ? "#fff" : "#94a3b8",
                border: "none", transition: "all .2s",
                fontSize: 14, fontWeight: active ? 600 : 400,
                fontFamily: "'DM Sans', sans-serif",
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.color = "#fff"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}}
              >
                <span style={{ fontSize: 17, lineHeight: 1 }}>{item.icon}</span>
                {!collapsed && item.label}
              </button>
            );
          })}
        </nav>

        {/* User + Collapse */}
        <div style={{ padding: "12px 8px 16px", borderTop: "1px solid #1e293b" }}>
          {!collapsed && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10, background: "#1e293b", marginBottom: 8,
            }}>
              <Avatar initials={ME.initials} color={ME.color} size={32} />
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ME.name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Employee</div>
              </div>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{
            width: "100%", padding: "8px 0", border: "none",
            borderRadius: 10, background: "#1e293b", color: "#64748b",
            cursor: "pointer", fontSize: 16, transition: "all .2s",
          }}>{collapsed ? "→" : "← Collapse"}</button>
          <button onClick={logout} style={{
            width: "100%", marginTop: 6, padding: "9px", border: "none",
            borderRadius: 10, background: "#1e293b", color: T.danger,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: collapsed ? 0 : 8,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            <span>↪</span>
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Topbar */}
        <div style={{
          height: 64, background: T.surface, borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 28px", flexShrink: 0, position: "sticky", top: 0, zIndex: 100,
        }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: T.text }}>
              {NAV.find(n => n.key === page)?.label || "Dashboard"}
            </div>
            <div style={{ fontSize: 12, color: T.muted }}>Thursday, 5 March 2026</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SearchBar setPage={setPage} />

            {/* Notification Bell */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: notifOpen ? T.primaryLight : T.surface2,
                  border: `1px solid ${notifOpen ? T.primary : T.border}`,
                  cursor: "pointer", fontSize: 18, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  transition: "all .2s",
                }}
              >🔔</button>
              {unreadCount > 0 && (
                <div style={{
                  position: "absolute", top: -4, right: -4,
                  minWidth: 18, height: 18, borderRadius: 99,
                  background: T.danger, border: `2px solid ${T.surface}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "#fff", padding: "0 4px",
                }}>{unreadCount}</div>
              )}
              {notifOpen && (
                <div style={{
                  position: "absolute", top: 46, right: 0,
                  width: 340, background: T.surface,
                  border: `1px solid ${T.border}`, borderRadius: 16,
                  boxShadow: "0 16px 48px rgba(0,0,0,.14)",
                  zIndex: 200, overflow: "hidden", animation: "dropIn .15s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Notifications</div>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: T.primary, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>Mark all as read</button>
                    )}
                  </div>
                  <div style={{ maxHeight: 340, overflowY: "auto" }}>
                    {notifs.map(n => (
                      <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id===n.id ? {...x,unread:false} : x))} style={{
                        display: "flex", gap: 12, padding: "13px 18px",
                        borderBottom: `1px solid ${T.border}`,
                        background: n.unread ? T.primaryLight : "transparent",
                        cursor: "pointer", transition: "background .15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = T.surface2}
                        onMouseLeave={e => e.currentTarget.style.background = n.unread ? T.primaryLight : "transparent"}
                      >
                        <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{n.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between" }}>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</span>
                            {n.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.primary, flexShrink: 0 }} />}
                          </div>
                          <div style={{ fontSize: 12, color: T.muted, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.msg}</div>
                          <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "11px 18px", textAlign: "center", borderTop: `1px solid ${T.border}` }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: T.primary, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div ref={profileRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
                style={{
                  width: 38, height: 38, borderRadius: 10, border: "none",
                  cursor: "pointer", padding: 0, background: "transparent",
                  outline: profileOpen ? `2px solid ${T.primary}` : "none",
                  outlineOffset: 2, transition: "outline .15s",
                }}
              >
                <Avatar initials={ME.initials} color={ME.color} size={38} />
              </button>
              {profileOpen && (
                <div style={{
                  position: "absolute", top: 46, right: 0,
                  width: 220, background: T.surface,
                  border: `1px solid ${T.border}`, borderRadius: 14,
                  boxShadow: "0 16px 48px rgba(0,0,0,.14)",
                  zIndex: 200, overflow: "hidden", animation: "dropIn .15s ease",
                }}>
                  <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials={ME.initials} color={ME.color} size={38} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{ME.name}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>{ME.role}</div>
                    </div>
                  </div>
                  <div style={{ padding: "6px 0" }}>
                    {[
                      { icon: "👤", label: "My Profile",     action: () => { setPage("profile");    setProfileOpen(false); } },
                      { icon: "⏱",  label: "Attendance",     action: () => { setPage("attendance"); setProfileOpen(false); } },
                      { icon: "🗓", label: "My Leaves",      action: () => { setPage("leaves");     setProfileOpen(false); } },
                      { icon: "🏠",  label: "Work From Home", action: () => { setPage("wfh");        setProfileOpen(false); } },
                    ].map(item => (
                      <button key={item.label} onClick={item.action} style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 16px", border: "none", background: "transparent",
                        cursor: "pointer", fontSize: 13, fontWeight: 500, color: T.text,
                        fontFamily: "'DM Sans',sans-serif", textAlign: "left", transition: "background .15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = T.surface2}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ fontSize: 15 }}>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ borderTop: `1px solid ${T.border}`, padding: "6px 0 8px" }}>
                    <button onClick={() => { setProfileOpen(false); logout(); }} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 16px", border: "none", background: "transparent",
                      cursor: "pointer", fontSize: 13, fontWeight: 600, color: T.danger,
                      fontFamily: "'DM Sans',sans-serif", textAlign: "left", transition: "background .15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: 15 }}>↪</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}