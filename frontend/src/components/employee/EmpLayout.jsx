
// // src/components/employee/EmpLayout.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { T, Avatar } from "./EmpUI";
// import useAuth from "../../hooks/useAuth";
// import useCurrentEmployee from "../../hooks/useCurrentEmployee";

// // ── Sample notifications ───────────────────────────────────────
// const NOTIFICATIONS = [
//   { id:1, icon:"🎉", title:"Holi Holiday",       msg:"Office closed on March 25th for Holi.",          time:"2h ago", unread:true  },
//   { id:2, icon:"✅", title:"Leave Approved",      msg:"Your casual leave for Mar 20–21 was approved.",  time:"1d ago", unread:true  },
//   { id:3, icon:"💰", title:"Payslip Available",   msg:"Your February 2026 payslip is ready.",           time:"3d ago", unread:false },
//   { id:4, icon:"📋", title:"Policy Update",       msg:"New WFH policy is now in effect.",               time:"5d ago", unread:false },
//   { id:5, icon:"📅", title:"Q1 Review Reminder",  msg:"Self-assessment due by March 28.",               time:"1w ago", unread:false },
// ];

// // ── Click-outside hook ─────────────────────────────────────────
// function useClickOutside(ref, handler) {
//   useEffect(() => {
//     const fn = e => { if (ref.current && !ref.current.contains(e.target)) handler(); };
//     document.addEventListener("mousedown", fn);
//     return () => document.removeEventListener("mousedown", fn);
//   }, []);
// }


// // ── Searchable pages & content ────────────────────────────────
// const SEARCH_INDEX = [
//   { label:"Dashboard",          page:"dashboard",  desc:"Overview of your attendance, leaves and tasks"   },
//   { label:"My Attendance",      page:"attendance", desc:"View and mark your daily attendance"              },
//   { label:"Check In / Out",     page:"attendance", desc:"Mark your check-in or check-out for today"        },
//   { label:"My Leaves",          page:"leaves",     desc:"Apply for leave or view leave balance"            },
//   { label:"Leave Balance",      page:"leaves",     desc:"Remaining casual, sick and earned leaves"         },
//   { label:"Holidays",           page:"holidays",   desc:"View public and company holidays for 2026"        },
//   { label:"Payroll",            page:"payroll",    desc:"View payslips and salary breakdown"               },
//   { label:"My Profile",         page:"profile",    desc:"View and edit your personal information"          },
//   { label:"Notices",            page:"notices",    desc:"Company announcements and HR notices"             },
// ];

// function SearchBar({ setPage }) {
//   const [query, setQuery]   = React.useState("");
//   const [open,  setOpen]    = React.useState(false);
//   const [idx,   setIdx]     = React.useState(0);
//   const ref   = useRef(null);
//   const input = useRef(null);

//   useClickOutside(ref, () => { setOpen(false); setQuery(""); });

//   const results = query.trim().length > 0
//     ? SEARCH_INDEX.filter(r =>
//         r.label.toLowerCase().includes(query.toLowerCase()) ||
//         r.desc.toLowerCase().includes(query.toLowerCase())
//       )
//     : [];

//   function go(item) {
//     setPage(item.page);
//     setQuery("");
//     setOpen(false);
//   }

//   function onKey(e) {
//     if (!results.length) return;
//     if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(i+1, results.length-1)); }
//     if (e.key === "ArrowUp")   { e.preventDefault(); setIdx(i => Math.max(i-1, 0)); }
//     if (e.key === "Enter")     { go(results[idx]); }
//     if (e.key === "Escape")    { setOpen(false); setQuery(""); }
//   }

//   return (
//     <div ref={ref} style={{ position:"relative" }}>
//       <div style={{
//         display:"flex", alignItems:"center", gap:8,
//         background: open ? T.surface : T.surface2,
//         border: `1.5px solid ${open ? T.primary : T.border}`,
//         borderRadius:10, padding:"0 14px", width:220,
//         transition:"all .2s",
//       }}>
//         <span style={{ fontSize:14, flexShrink:0 }}>🔍</span>
//         <input
//           ref={input}
//           value={query}
//           onChange={e => { setQuery(e.target.value); setOpen(true); setIdx(0); }}
//           onFocus={() => setOpen(true)}
//           onKeyDown={onKey}
//           placeholder="Search..."
//           style={{
//             border:"none", outline:"none", background:"transparent",
//             fontSize:13, color:T.text, fontFamily:"'DM Sans',sans-serif",
//             width:"100%", padding:"8px 0",
//           }}
//         />
//         {query && (
//           <button onClick={() => { setQuery(""); input.current?.focus(); }} style={{
//             background:"none", border:"none", cursor:"pointer",
//             color:T.muted, fontSize:16, padding:"0 2px", lineHeight:1,
//           }}>×</button>
//         )}
//       </div>

//       {/* Results dropdown */}
//       {open && results.length > 0 && (
//         <div style={{
//           position:"absolute", top:44, left:0, width:280,
//           background:T.surface, border:`1px solid ${T.border}`,
//           borderRadius:12, boxShadow:"0 12px 36px rgba(0,0,0,.12)",
//           zIndex:300, overflow:"hidden", animation:"dropIn .15s ease",
//         }}>
//           {results.map((r, i) => (
//             <div key={r.label} onClick={() => go(r)}
//               onMouseEnter={() => setIdx(i)}
//               style={{
//                 display:"flex", alignItems:"center", gap:12,
//                 padding:"10px 14px", cursor:"pointer",
//                 background: i===idx ? T.primaryLight : "transparent",
//                 borderBottom:`1px solid ${T.border}`,
//                 transition:"background .1s",
//               }}
//             >
//               <div style={{
//                 width:32, height:32, borderRadius:8, flexShrink:0,
//                 background: i===idx ? T.primary : T.surface2,
//                 display:"flex", alignItems:"center", justifyContent:"center",
//                 fontSize:15,
//               }}>
//                 {NAV.find(n=>n.key===r.page)?.icon || "📄"}
//               </div>
//               <div>
//                 <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{r.label}</div>
//                 <div style={{ fontSize:11, color:T.muted }}>{r.desc}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* No results */}
//       {open && query.trim().length > 0 && results.length === 0 && (
//         <div style={{
//           position:"absolute", top:44, left:0, width:280,
//           background:T.surface, border:`1px solid ${T.border}`,
//           borderRadius:12, boxShadow:"0 12px 36px rgba(0,0,0,.12)",
//           zIndex:300, padding:"20px 14px", textAlign:"center",
//         }}>
//           <div style={{ fontSize:20, marginBottom:6 }}>🔍</div>
//           <div style={{ fontSize:13, color:T.muted }}>No results for "<strong>{query}</strong>"</div>
//         </div>
//       )}
//     </div>
//   );
// }

// const NAV = [
//   { key: "dashboard",  icon: "⊞",  label: "Dashboard"    },
//   { key: "attendance", icon: "⏱",  label: "My Attendance" },
//   { key: "wfh",        icon: "🏠",  label: "Work from Home" },
//   { key: "leaves",     icon: "🗓", label: "My Leaves"     },
//   { key: "holidays",   icon: "🎉",  label: "Holidays"      },
//   { key: "payroll",    icon: "💰",  label: "Payroll"       },
//   { key: "profile",    icon: "👤",  label: "My Profile"    },
//   { key: "notices",    icon: "📢",  label: "Notices"       },
// ];

// export default function EmpLayout({ page, setPage, children }) {
//   const [collapsed, setCollapsed]   = useState(false);
//   const [notifOpen, setNotifOpen]   = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [notifs, setNotifs]         = useState(NOTIFICATIONS);
//   const { logout, user } = useAuth();
//   const { employee } = useCurrentEmployee();
//   const me = employee ? { name: employee.name, initials: (employee.name || "?").slice(0,2).toUpperCase(), color: "#4f46e5", role: employee.role || employee.position } : { name: user?.email?.split("@")[0] || "User", initials: "?", color: "#4f46e5", role: "" };
//   const w = collapsed ? 72 : 260;

//   const notifRef   = useRef(null);
//   const profileRef = useRef(null);

//   useClickOutside(notifRef,   () => setNotifOpen(false));
//   useClickOutside(profileRef, () => setProfileOpen(false));

//   const unreadCount = notifs.filter(n => n.unread).length;

//   function markAllRead() {
//     setNotifs(n => n.map(x => ({ ...x, unread: false })));
//   }

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
//                 onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.color = "#fff"; }}}
//                 onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}}
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
//               <Avatar initials={me.initials} color={me.color} size={32} />
//               <div style={{ overflow: "hidden" }}>
//                 <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{me.name}</div>
//                 <div style={{ fontSize: 11, color: "#64748b" }}>Employee</div>
//               </div>
//             </div>
//           )}
//           <button onClick={() => setCollapsed(c => !c)} style={{
//             width: "100%", padding: "8px 0", border: "none",
//             borderRadius: 10, background: "#1e293b", color: "#64748b",
//             cursor: "pointer", fontSize: 16, transition: "all .2s",
//           }}>{collapsed ? "→" : "← Collapse"}</button>
//           <button onClick={logout} style={{
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
//           padding: "0 28px", flexShrink: 0, position: "sticky", top: 0, zIndex: 100,
//         }}>
//           {/* Page title */}
//           <div>
//             <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: T.text }}>
//               {NAV.find(n => n.key === page)?.label || "Dashboard"}
//             </div>
//             <div style={{ fontSize: 12, color: T.muted }}>Thursday, 5 March 2026</div>
//           </div>

//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             {/* ── Search ── */}
//             <SearchBar setPage={setPage} onClose={() => {}} />

//             {/* ── Notification Bell ── */}
//             <div ref={notifRef} style={{ position: "relative" }}>
//               <button
//                 onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
//                 style={{
//                   width: 38, height: 38, borderRadius: 10,
//                   background: notifOpen ? T.primaryLight : T.surface2,
//                   border: `1px solid ${notifOpen ? T.primary : T.border}`,
//                   cursor: "pointer", fontSize: 18, display: "flex",
//                   alignItems: "center", justifyContent: "center", position: "relative",
//                   transition: "all .2s",
//                 }}
//               >🔔</button>
//               {/* Unread dot */}
//               {unreadCount > 0 && (
//                 <div style={{
//                   position: "absolute", top: -4, right: -4,
//                   minWidth: 18, height: 18, borderRadius: 99,
//                   background: T.danger, border: `2px solid ${T.surface}`,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontSize: 10, fontWeight: 700, color: "#fff", padding: "0 4px",
//                 }}>{unreadCount}</div>
//               )}

//               {/* Notification Dropdown */}
//               {notifOpen && (
//                 <div style={{
//                   position: "absolute", top: 46, right: 0,
//                   width: 340, background: T.surface,
//                   border: `1px solid ${T.border}`, borderRadius: 16,
//                   boxShadow: "0 16px 48px rgba(0,0,0,.14)",
//                   zIndex: 200, overflow: "hidden",
//                   animation: "dropIn .15s ease",
//                 }}>
//                   {/* Header */}
//                   <div style={{
//                     display: "flex", alignItems: "center", justifyContent: "space-between",
//                     padding: "14px 18px", borderBottom: `1px solid ${T.border}`,
//                   }}>
//                     <div style={{ fontWeight: 700, fontSize: 15 }}>Notifications</div>
//                     {unreadCount > 0 && (
//                       <button onClick={markAllRead} style={{
//                         background: "none", border: "none", cursor: "pointer",
//                         fontSize: 12, color: T.primary, fontWeight: 600,
//                         fontFamily: "'DM Sans',sans-serif",
//                       }}>Mark all as read</button>
//                     )}
//                   </div>

//                   {/* List */}
//                   <div style={{ maxHeight: 340, overflowY: "auto" }}>
//                     {notifs.map(n => (
//                       <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id===n.id ? {...x,unread:false} : x))} style={{
//                         display: "flex", gap: 12, padding: "13px 18px",
//                         borderBottom: `1px solid ${T.border}`,
//                         background: n.unread ? T.primaryLight : "transparent",
//                         cursor: "pointer", transition: "background .15s",
//                       }}
//                         onMouseEnter={e => e.currentTarget.style.background = T.surface2}
//                         onMouseLeave={e => e.currentTarget.style.background = n.unread ? T.primaryLight : "transparent"}
//                       >
//                         {/* Icon */}
//                         <div style={{
//                           width: 38, height: 38, borderRadius: 10, flexShrink: 0,
//                           background: T.surface2, display: "flex",
//                           alignItems: "center", justifyContent: "center", fontSize: 18,
//                         }}>{n.icon}</div>
//                         {/* Content */}
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between" }}>
//                             <span style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</span>
//                             {n.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.primary, flexShrink: 0 }} />}
//                           </div>
//                           <div style={{ fontSize: 12, color: T.muted, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.msg}</div>
//                           <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{n.time}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Footer */}
//                   <div style={{ padding: "11px 18px", textAlign: "center", borderTop: `1px solid ${T.border}` }}>
//                     <button style={{
//                       background: "none", border: "none", cursor: "pointer",
//                       fontSize: 13, color: T.primary, fontWeight: 600,
//                       fontFamily: "'DM Sans',sans-serif",
//                     }}>View all notifications</button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* ── Profile Avatar + Dropdown ── */}
//             <div ref={profileRef} style={{ position: "relative" }}>
//               <button
//                 onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
//                 style={{
//                   width: 38, height: 38, borderRadius: 10, border: "none",
//                   cursor: "pointer", padding: 0, background: "transparent",
//                   outline: profileOpen ? `2px solid ${T.primary}` : "none",
//                   outlineOffset: 2, transition: "outline .15s",
//                 }}
//               >
//                 <Avatar initials={me.initials} color={me.color} size={38} />
//               </button>

//               {/* Profile Dropdown */}
//               {profileOpen && (
//                 <div style={{
//                   position: "absolute", top: 46, right: 0,
//                   width: 220, background: T.surface,
//                   border: `1px solid ${T.border}`, borderRadius: 14,
//                   boxShadow: "0 16px 48px rgba(0,0,0,.14)",
//                   zIndex: 200, overflow: "hidden",
//                   animation: "dropIn .15s ease",
//                 }}>
//                   {/* User info */}
//                   <div style={{
//                     padding: "16px 16px 12px",
//                     borderBottom: `1px solid ${T.border}`,
//                     display: "flex", alignItems: "center", gap: 10,
//                   }}>
//                     <Avatar initials={me.initials} color={me.color} size={38} />
//                     <div>
//                       <div style={{ fontWeight: 700, fontSize: 14 }}>{me.name}</div>
//                       <div style={{ fontSize: 11, color: T.muted }}>{me.role}</div>
//                     </div>
//                   </div>

//                   {/* Menu items */}
//                   <div style={{ padding: "6px 0" }}>
//                     {[
//                       { icon: "👤", label: "My Profile",   action: () => { setPage("profile");    setProfileOpen(false); } },
//                       { icon: "⏱",  label: "Attendance",   action: () => { setPage("attendance"); setProfileOpen(false); } },
//                       { icon: "🗓", label: "My Leaves",    action: () => { setPage("leaves");     setProfileOpen(false); } },
//                       { icon: "⚙️", label: "Settings",     action: () => {                        setProfileOpen(false); } },
//                     ].map(item => (
//                       <button key={item.label} onClick={item.action} style={{
//                         width: "100%", display: "flex", alignItems: "center", gap: 10,
//                         padding: "9px 16px", border: "none", background: "transparent",
//                         cursor: "pointer", fontSize: 13, fontWeight: 500, color: T.text,
//                         fontFamily: "'DM Sans',sans-serif", textAlign: "left",
//                         transition: "background .15s",
//                       }}
//                         onMouseEnter={e => e.currentTarget.style.background = T.surface2}
//                         onMouseLeave={e => e.currentTarget.style.background = "transparent"}
//                       >
//                         <span style={{ fontSize: 15 }}>{item.icon}</span>
//                         {item.label}
//                       </button>
//                     ))}
//                   </div>

//                   {/* Divider + Logout */}
//                   <div style={{ borderTop: `1px solid ${T.border}`, padding: "6px 0 8px" }}>
//                     <button onClick={() => { setProfileOpen(false); logout(); }} style={{
//                       width: "100%", display: "flex", alignItems: "center", gap: 10,
//                       padding: "9px 16px", border: "none", background: "transparent",
//                       cursor: "pointer", fontSize: 13, fontWeight: 600, color: T.danger,
//                       fontFamily: "'DM Sans',sans-serif", textAlign: "left",
//                       transition: "background .15s",
//                     }}
//                       onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
//                       onMouseLeave={e => e.currentTarget.style.background = "transparent"}
//                     >
//                       <span style={{ fontSize: 15 }}>↪</span>
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Page content */}
//         <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
//           {children}
//         </div>
//       </div>

//       <style>{`
//         @keyframes dropIn {
//           from { opacity:0; transform:translateY(-8px); }
//           to   { opacity:1; transform:translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }

// src/components/employee/EmpLayout.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Clock, Home, Calendar, Gift,
  Wallet, User, Bell, ChevronLeft, ChevronRight, LogOut, Megaphone,
} from "lucide-react";
import { T, Avatar } from "./EmpUI";
import useAuth from "../../hooks/useAuth";
import useCurrentEmployee from "../../hooks/useCurrentEmployee";

// ── Brand colours (mirrors admin Sidebar) ──────────────────────
const S = {
  bg:           '#0061f2',
  hoverBg:      'rgba(255,255,255,.10)',
  activeBg:     '#ffffff',
  activeBorder: '#ffffff',
  activeColor:  '#0061f2',
  textPrimary:  '#ffffff',
  textMuted:    'rgba(255,255,255,.60)',
  textSubtle:   'rgba(255,255,255,.40)',
  divider:      'rgba(255,255,255,.12)',
  logoutBg:     'rgba(255,80,80,.18)',
  logoutBorder: 'rgba(255,100,100,.30)',
  logoutColor:  '#ffa3a3',
  collapseBg:   'rgba(255,255,255,.10)',
}

// ── Nav items (lucide icons, same style as admin) ───────────────
const NAV = [
  { key: "dashboard",  icon: LayoutDashboard, label: "Dashboard"     },
  { key: "attendance", icon: Clock,           label: "My Attendance"  },
  { key: "wfh",        icon: Home,            label: "Work from Home" },
  { key: "leaves",     icon: Calendar,        label: "My Leaves"      },
  { key: "holidays",   icon: Gift,            label: "Holidays"       },
  { key: "payroll",    icon: Wallet,          label: "Payroll"        },
  { key: "profile",    icon: User,            label: "My Profile"     },
  { key: "notices",    icon: Megaphone,       label: "Notices"        },
];

// ── Sample notifications ────────────────────────────────────────
const NOTIFICATIONS = [
  { id:1, icon:"🎉", title:"Holi Holiday",      msg:"Office closed on March 25th for Holi.",         time:"2h ago", unread:true  },
  { id:2, icon:"✅", title:"Leave Approved",     msg:"Your casual leave for Mar 20–21 was approved.", time:"1d ago", unread:true  },
  { id:3, icon:"💰", title:"Payslip Available",  msg:"Your February 2026 payslip is ready.",          time:"3d ago", unread:false },
  { id:4, icon:"📋", title:"Policy Update",      msg:"New WFH policy is now in effect.",              time:"5d ago", unread:false },
];

// ── Click-outside hook ──────────────────────────────────────────
function useClickOutside(ref, handler) {
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
}

// ── Sidebar ─────────────────────────────────────────────────────
function EmpSidebar({ page, setPage, collapsed, setCollapsed, me, logout }) {
  return (
    <aside style={{
      width: collapsed ? 72 : 260,
      minHeight: "100vh",
      background: S.bg,
      display: "flex",
      flexDirection: "column",
      transition: "width .28s cubic-bezier(.4,0,.2,1)",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      height: "100vh",
      overflow: "hidden",
      boxShadow: "4px 0 24px rgba(0,0,0,.15)",
      zIndex: 50,
    }}>

      {/* ── Logo ── */}
      <div style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        padding: collapsed ? "0 18px" : "0 20px",
        borderBottom: `1px solid ${S.divider}`,
        gap: 11,
        flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, minWidth: 36, borderRadius: 10,
          background: "rgba(255,255,255,.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, color: "#fff", fontSize: 17,
          border: "1.5px solid rgba(255,255,255,.30)",
          flexShrink: 0,
        }}>H</div>

        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{
              fontWeight: 800,
              color: "#fff", fontSize: 18, lineHeight: 1.15,
              letterSpacing: "-.3px", whiteSpace: "nowrap",
            }}>
              HRM<span style={{ color: "#a5d8ff" }}>S</span>
            </div>
            <div style={{
              fontSize: 9.5, color: S.textSubtle,
              letterSpacing: ".1em", textTransform: "uppercase", marginTop: 1,
            }}>EMPLOYEE</div>
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav style={{
        flex: 1,
        padding: "12px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "auto",
        overflowX: "hidden",
      }}>
        {NAV.map(({ key, icon: Icon, label }) => {
          const active = page === key;
          return (
            <button
              key={key}
              onClick={() => setPage(key)}
              title={collapsed ? label : ""}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: collapsed ? "11px 0" : "10px 13px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: active ? S.activeBg : "transparent",
                border: active
                  ? `1px solid ${S.activeBorder}`
                  : "1px solid transparent",
                borderRadius: 10,
                cursor: "pointer",
                color: active ? S.activeColor : S.textMuted,
                fontFamily: "DM Sans,sans-serif",
                fontSize: "13.5px",
                fontWeight: active ? 700 : 500,
                transition: "all .18s",
                whiteSpace: "nowrap",
                overflow: "hidden",
                width: "100%",
                textAlign: "left",
                boxShadow: active ? "0 4px 16px rgba(0,0,0,.15)" : "none",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = S.hoverBg;
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = S.textMuted;
                }
              }}
            >
              <Icon
                size={18}
                style={{
                  minWidth: 18,
                  opacity: active ? 1 : 0.75,
                  color: active ? S.activeColor : "inherit",
                }}
              />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div style={{
        padding: "10px",
        borderTop: `1px solid ${S.divider}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        flexShrink: 0,
      }}>
        {/* User card */}
        {!collapsed && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            background: "rgba(255,255,255,.10)",
            borderRadius: 11,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.12)",
          }}>
            <div style={{
              width: 34, height: 34, minWidth: 34, borderRadius: 9,
              background: "rgba(255,255,255,.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 12,
              border: "1.5px solid rgba(255,255,255,.35)",
              flexShrink: 0,
            }}>
              {(me.name || "?").slice(0, 2).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden", minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: "#fff",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{me.name || "Employee"}</div>
              <div style={{ fontSize: 11, color: S.textSubtle }}>Employee</div>
            </div>
          </div>
        )}

        {/* Logout + collapse */}
        <div style={{ display: "flex", gap: 7 }}>
          <button
            onClick={logout}
            title="Logout"
            style={{
              flex: 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: collapsed ? "10px 0" : "9px 12px",
              background: S.logoutBg,
              border: `1px solid ${S.logoutBorder}`,
              borderRadius: 10,
              color: S.logoutColor,
              cursor: "pointer",
              fontSize: 13, fontWeight: 700,
              fontFamily: "DM Sans,sans-serif",
              transition: "all .2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(239,68,68,.28)";
              e.currentTarget.style.color = "#ffc0c0";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = S.logoutBg;
              e.currentTarget.style.color = S.logoutColor;
            }}
          >
            <LogOut size={15} />
            {!collapsed && "Logout"}
          </button>

          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand" : "Collapse"}
            style={{
              width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: S.collapseBg,
              border: "1px solid rgba(255,255,255,.18)",
              borderRadius: 10,
              color: S.textMuted,
              cursor: "pointer",
              transition: "all .2s",
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = S.hoverBg;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = S.collapseBg;
              e.currentTarget.style.color = S.textMuted;
            }}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>
      </div>
    </aside>
  );
}

// ── Main layout export ──────────────────────────────────────────
export default function EmpLayout({ page, setPage, children }) {
  const [collapsed, setCollapsed]     = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs]           = useState(NOTIFICATIONS);
  const { logout, user } = useAuth();
  const { employee } = useCurrentEmployee();

  const me = employee
    ? { name: employee.name, role: employee.role || employee.position || "Employee" }
    : { name: user?.email?.split("@")[0] || "User", role: "Employee" };

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  useClickOutside(notifRef,   () => setNotifOpen(false));
  useClickOutside(profileRef, () => setProfileOpen(false));

  const unreadCount = notifs.filter(n => n.unread).length;

  function markAllRead() {
    setNotifs(n => n.map(x => ({ ...x, unread: false })));
  }

  const currentLabel = NAV.find(n => n.key === page)?.label || "Dashboard";

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: T.bg }}>

      {/* Sidebar */}
      <EmpSidebar
        page={page}
        setPage={setPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        me={me}
        logout={logout}
      />

      {/* Main content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          height: 64,
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "var(--shadow)",
        }}>
          {/* Page title */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 21, color: T.text, lineHeight: 1.2 }}>
              {currentLabel}
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>

          {/* Right: bell + avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            {/* Notification bell */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); setNotifs(n => n.map(x => ({ ...x, unread: false }))); }}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: notifOpen ? "rgba(0,97,242,.12)" : T.surface2,
                  border: `1.5px solid ${notifOpen ? "#0061f2" : T.border}`,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", transition: "all .2s", color: notifOpen ? "#0061f2" : T.muted,
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <div style={{
                    position: "absolute", top: 4, right: 4,
                    width: 8, height: 8, borderRadius: "50%",
                    background: T.danger, border: `2px solid ${T.surface}`,
                  }} />
                )}
              </button>

              {notifOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  width: 340, background: T.surface,
                  border: `1.5px solid ${T.border}`, borderRadius: 14,
                  boxShadow: "0 8px 32px rgba(0,0,0,.12)",
                  zIndex: 200, overflow: "hidden",
                  animation: "dropIn .15s ease",
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 18px", borderBottom: `1px solid ${T.border}`,
                  }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: T.text }}>Notifications</span>
                    <button onClick={markAllRead} style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 12, color: "#0061f2", fontWeight: 600,
                      fontFamily: "'DM Sans',sans-serif",
                    }}>Mark all read</button>
                  </div>
                  <div style={{ maxHeight: 320, overflowY: "auto" }}>
                    {notifs.map(n => (
                      <div key={n.id} style={{
                        display: "flex", gap: 12, padding: "12px 18px",
                        borderBottom: `1px solid ${T.border}`,
                        background: n.unread ? "rgba(0,97,242,.05)" : "transparent",
                        cursor: "pointer", transition: "background .15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = T.surface2}
                        onMouseLeave={e => e.currentTarget.style.background = n.unread ? "rgba(0,97,242,.05)" : "transparent"}
                      >
                        <div style={{
                          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                          background: T.surface2, display: "flex",
                          alignItems: "center", justifyContent: "center", fontSize: 17,
                        }}>{n.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{n.title}</div>
                          <div style={{ fontSize: 12, color: T.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.msg}</div>
                          <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div ref={profileRef} style={{ position: "relative" }}>
              <div
                onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg,#0061f2,#0ea5e9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 13,
                  cursor: "pointer", transition: "all .2s",
                  boxShadow: profileOpen ? "0 4px 14px rgba(0,97,242,.35)" : "0 2px 8px rgba(0,97,242,.2)",
                  outline: profileOpen ? "2px solid #0061f2" : "none",
                  outlineOffset: 2,
                }}
              >
                {(me.name || "U").slice(0, 2).toUpperCase()}
              </div>

              {profileOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  width: 230, background: T.surface,
                  border: `1.5px solid ${T.border}`, borderRadius: 14,
                  boxShadow: "0 8px 32px rgba(0,0,0,.12)",
                  zIndex: 200, overflow: "hidden",
                  animation: "dropIn .15s ease",
                }}>
                  <div style={{
                    padding: "14px 16px",
                    borderBottom: `1px solid ${T.border}`,
                    background: "linear-gradient(135deg,rgba(0,97,242,.08),rgba(14,165,233,.06))",
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: "linear-gradient(135deg,#0061f2,#0ea5e9)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0,
                    }}>{(me.name || "U").slice(0, 2).toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{me.name}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>Employee</div>
                    </div>
                  </div>

                  <div style={{ padding: "6px 0" }}>
                    {[
                      { icon: "👤", label: "My Profile",  action: () => { setPage("profile");    setProfileOpen(false); } },
                      { icon: "⏱",  label: "Attendance",  action: () => { setPage("attendance"); setProfileOpen(false); } },
                      { icon: "🗓", label: "My Leaves",   action: () => { setPage("leaves");     setProfileOpen(false); } },
                    ].map(item => (
                      <button key={item.label} onClick={item.action} style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 16px", border: "none", background: "transparent",
                        cursor: "pointer", fontSize: 13, fontWeight: 500, color: T.text,
                        fontFamily: "'DM Sans',sans-serif", textAlign: "left",
                        transition: "background .15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = T.surface2}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ fontSize: 14 }}>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ borderTop: `1px solid ${T.border}`, padding: "6px 0 8px" }}>
                    <button onClick={() => { setProfileOpen(false); logout(); }} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 16px", border: "none", background: "transparent",
                      cursor: "pointer", fontSize: 13, fontWeight: 600, color: T.danger,
                      fontFamily: "'DM Sans',sans-serif", textAlign: "left",
                      transition: "background .15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
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

