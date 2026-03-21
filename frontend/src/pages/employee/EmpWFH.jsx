// // src/pages/employee/EmpWFH.jsx
// import { useState, useMemo, useEffect } from "react";
// import { T, Card, SectionTitle, Badge, Modal, Btn } from "../../components/employee/EmpUI";
// import { MONTH_NAMES } from "../../utils/EmployeeData";
// import wfhService from "../../services/wfhService";
// import useCurrentEmployee from "../../hooks/useCurrentEmployee";

// const TODAY = new Date();

// const STATUS_META = {
//   approved: { label: "Approved", dot: "#10b981", bg: "#d1fae5", color: "#065f46" },
//   pending:  { label: "Pending",  dot: "#f59e0b", bg: "#fef3c7", color: "#92400e" },
//   rejected: { label: "Rejected", dot: "#ef4444", bg: "#fee2e2", color: "#991b1b" },
// };

// function fmt(ds) {
//   return new Date(ds + "T00:00:00").toLocaleDateString("en-IN", {
//     weekday: "short", day: "numeric", month: "short", year: "numeric",
//   });
// }

// function daysUntil(ds) {
//   return Math.ceil((new Date(ds + "T00:00:00") - TODAY) / 86400000);
// }

// // ── Mini Month Calendar ──────────────────────────────────────────
// function MonthCalendar({ year, month, wfhDates }) {
//   const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const offset = (firstDay + 6) % 7; // Mon-start
//   const cells = [];
//   for (let i = 0; i < offset; i++) cells.push(null);
//   for (let d = 1; d <= daysInMonth; d++) cells.push(d);

//   return (
//     <div>
//       {/* Day headers */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
//         {["M","T","W","T","F","S","S"].map((d, i) => (
//           <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: i >= 5 ? "#cbd5e1" : T.muted, padding: "3px 0" }}>{d}</div>
//         ))}
//       </div>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
//         {cells.map((d, i) => {
//           if (!d) return <div key={i} />;
//           const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
//           const wfh = wfhDates[ds];
//           const isToday = ds === TODAY.toISOString().slice(0, 10);
//           const dow = (i) % 7;
//           const isWeekend = dow >= 5;
//           return (
//             <div key={i} title={wfh ? `WFH – ${wfh.reason}` : ""} style={{
//               textAlign: "center", padding: "5px 2px", borderRadius: 6, fontSize: 11, fontWeight: wfh || isToday ? 700 : 400,
//               background: wfh ? (wfh.status === "approved" ? "#d1fae5" : wfh.status === "pending" ? "#fef3c7" : "#fee2e2")
//                                : isToday ? T.primaryLight : "transparent",
//               color: wfh ? STATUS_META[wfh.status].color : isToday ? T.primary : isWeekend ? "#cbd5e1" : T.text,
//               cursor: wfh ? "help" : "default",
//               border: isToday ? `1.5px solid ${T.primary}` : "1.5px solid transparent",
//             }}>{d}</div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ── Main page ────────────────────────────────────────────────────
// export default function EmpWFH() {
//   const { employeeId, loading: empLoading } = useCurrentEmployee();
//   const [wfhList, setWfhList] = useState([]);
//   const [viewMonth, setViewMonth] = useState(TODAY.getMonth());
//   const [viewYear]  = useState(TODAY.getFullYear());
//   const [filter, setFilter]     = useState("all");
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm]           = useState({ date: "", reason: "" });
//   const [formError, setFormError] = useState("");
//   const [success, setSuccess]     = useState(false);
//   const [detail, setDetail]       = useState(null);

//   useEffect(() => {
//     wfhService.getWFH(employeeId).then((data) => setWfhList(Array.isArray(data) ? data : []));
//   }, [employeeId]);

//   // Build a date->wfh map for calendar
//   const wfhDates = useMemo(() => {
//     const m = {};
//     wfhList.forEach(w => { m[w.date] = w; });
//     return m;
//   }, [wfhList]);

//   // Stats
//   const approved = wfhList.filter(w => w.status === "approved").length;
//   const pending  = wfhList.filter(w => w.status === "pending").length;
//   const rejected = wfhList.filter(w => w.status === "rejected").length;

//   // This month's count
//   const thisMonthApproved = wfhList.filter(w => {
//     const d = new Date((w.date || "") + "T00:00:00");
//     return d.getFullYear() === viewYear && d.getMonth() === viewMonth && (w.status || "").toLowerCase() === "approved";
//   }).length;

//   // Filtered list sorted newest first
//   const filtered = useMemo(() => {
//     const list = filter === "all" ? wfhList : wfhList.filter(w => w.status === filter);
//     return [...list].sort((a, b) => b.date.localeCompare(a.date));
//   }, [wfhList, filter]);

//   function openModal()  { setForm({ date: "", reason: "" }); setFormError(""); setSuccess(false); setShowModal(true); }
//   function closeModal() { setShowModal(false); }

//   async function handleSubmit() {
//     if (!form.date)              { setFormError("Please select a date."); return; }
//     if (!form.reason.trim())     { setFormError("Please provide a reason."); return; }
//     if (!employeeId) {
//       setFormError("Your employee profile could not be loaded. Please try refreshing or contact HR.");
//       return;
//     }
//     const chosen = new Date(form.date + "T00:00:00");
//     if (chosen <= TODAY)         { setFormError("Date must be in the future."); return; }
//     const dow = chosen.getDay();
//     if (dow === 0 || dow === 6)  { setFormError("Cannot apply WFH on weekends."); return; }
//     if (wfhDates[form.date])     { setFormError("You already have a WFH request for this date."); return; }
//     try {
//       await wfhService.requestWFH({ employee_id: employeeId, date: form.date, reason: form.reason.trim() });
//       setWfhList(prev => [...prev, { id: Date.now(), date: form.date, reason: form.reason.trim(), status: "pending" }]);
//       setSuccess(true);
//       setTimeout(() => { closeModal(); wfhService.getWFH(employeeId).then(d => setWfhList(Array.isArray(d) ? d : [])); }, 1600);
//     } catch (err) {
//       setFormError(err.message || "Failed to submit");
//     }
//   }

//   function cancelRequest(id) {
//     setWfhList(prev => prev.filter(w => w.id !== id));
//   }

//   const minDate = new Date(TODAY.getTime() + 86400000).toISOString().split("T")[0];

//   // calendar months to show (prev, current, next)
//   const calMonths = [
//     { year: viewYear, month: ((viewMonth - 1 + 12) % 12), label: MONTH_NAMES[(viewMonth - 1 + 12) % 12] },
//     { year: viewYear, month: viewMonth,                    label: MONTH_NAMES[viewMonth] },
//     { year: viewYear, month: (viewMonth + 1) % 12,        label: MONTH_NAMES[(viewMonth + 1) % 12] },
//   ];

//   const cannotSubmit = !employeeId || empLoading;

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       {!empLoading && !employeeId && (
//         <div style={{
//           background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 12,
//           padding: "14px 20px", color: "#92400e", fontSize: 14, fontWeight: 600,
//         }}>
//           ⚠️ Your employee profile could not be loaded. Please refresh the page or contact HR to link your account.
//         </div>
//       )}

//       {/* ── Banner ── */}
//       <div style={{
//         background: "linear-gradient(120deg, #0891b2 0%, #0e7490 100%)",
//         borderRadius: 16, padding: "24px 32px",
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         boxShadow: "0 4px 24px rgba(8,145,178,.28)", position: "relative", overflow: "hidden",
//       }}>
//         {[[-20,-20,180],[60,-60,120]].map(([r,t,s],i)=>(
//           <div key={i} style={{ position:"absolute", right:r, top:t, width:s, height:s, borderRadius:"50%", background:"rgba(255,255,255,.07)" }}/>
//         ))}
//         <div style={{ position: "relative" }}>
//           <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", marginBottom: 4, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase" }}>Work From Home</div>
//           <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 6 }}>🏠 WFH Management</div>
//           <div style={{ fontSize: 14, color: "rgba(255,255,255,.8)" }}>
//             This month: <strong style={{ color: "#fff" }}>{thisMonthApproved} approved</strong> WFH days · Policy allows <strong style={{ color:"#fff" }}>2 days/week</strong>
//           </div>
//         </div>
//         <button
//           onClick={openModal}
//           disabled={!employeeId || empLoading}
//           style={{
//             background: (!employeeId || empLoading) ? "#94a3b8" : "#fff",
//             color: (!employeeId || empLoading) ? "#64748b" : "#0891b2",
//             border: "none", borderRadius: 10,
//             padding: "12px 24px", fontSize: 14, fontWeight: 700,
//             cursor: (!employeeId || empLoading) ? "not-allowed" : "pointer",
//             flexShrink: 0, position: "relative", opacity: (!employeeId || empLoading) ? 0.8 : 1,
//           }}
//         >
//           {empLoading ? "Loading..." : "+ New WFH Request"}
//         </button>
//       </div>

//       {/* ── Stats ── */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
//         {[
//           { label: "Total Requests", value: wfhList.length, icon: "📋", iconBg: "#ede9fe", iconColor: "#4f46e5" },
//           { label: "Approved",       value: approved,        icon: "✅", iconBg: "#d1fae5", iconColor: "#10b981" },
//           { label: "Pending",        value: pending,         icon: "⏳", iconBg: "#fef3c7", iconColor: "#f59e0b" },
//           { label: "Rejected",       value: rejected,        icon: "❌", iconBg: "#fee2e2", iconColor: "#ef4444" },
//         ].map(c => (
//           <Card key={c.label} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
//             <div style={{ width: 44, height: 44, borderRadius: 12, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
//             <div>
//               <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>{c.value}</div>
//               <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{c.label}</div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* ── Monthly Calendars ── */}
//       <Card style={{ padding: 20 }}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
//           <SectionTitle style={{ margin: 0 }}>Monthly WFH Calendar</SectionTitle>
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             {/* Legend */}
//             {[["Approved","#10b981","#d1fae5"],["Pending","#f59e0b","#fef3c7"],["Rejected","#ef4444","#fee2e2"]].map(([l,c,bg]) => (
//               <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:T.muted }}>
//                 <div style={{ width:10, height:10, borderRadius:3, background:bg, border:`1px solid ${c}` }}/>
//                 {l}
//               </div>
//             ))}
//           </div>
//         </div>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
//           {calMonths.map(({ year, month, label }) => (
//             <div key={label}>
//               <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10, textAlign: "center" }}>
//                 {label} {year}
//               </div>
//               <MonthCalendar year={year} month={month} wfhDates={wfhDates} />
//             </div>
//           ))}
//         </div>
//       </Card>

//       {/* ── Request List ── */}
//       <Card style={{ padding: 20 }}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
//           <SectionTitle style={{ margin: 0 }}>My WFH Requests</SectionTitle>
//           <div style={{ display: "flex", gap: 6 }}>
//             {[["all","All"],["approved","Approved"],["pending","Pending"],["rejected","Rejected"]].map(([val, lbl]) => (
//               <button key={val} onClick={() => setFilter(val)} style={{
//                 padding: "6px 14px", borderRadius: 8, border: "1.5px solid",
//                 cursor: "pointer", fontSize: 12, fontWeight: 600,
//                 background:  filter === val ? T.primary : T.surface,
//                 color:       filter === val ? "#fff"    : T.muted,
//                 borderColor: filter === val ? T.primary : T.border,
//               }}>{lbl}</button>
//             ))}
//           </div>
//         </div>

//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {filtered.length === 0 && (
//             <div style={{ textAlign: "center", padding: "40px 0", color: T.muted }}>
//               <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
//               <div style={{ fontWeight: 600 }}>No requests found</div>
//             </div>
//           )}
//           {filtered.map(w => {
//             const meta = STATUS_META[w.status];
//             const du   = daysUntil(w.date);
//             const isPast  = du < 0;
//             const isToday = du === 0;
//             return (
//               <div key={w.id} style={{
//                 display: "flex", alignItems: "center", gap: 16,
//                 padding: "14px 16px", borderRadius: 12,
//                 border: `1px solid ${T.border}`, background: T.surface,
//                 borderLeft: `4px solid ${meta.dot}`,
//                 opacity: isPast && w.status === "rejected" ? .55 : 1,
//               }}>
//                 {/* Date badge */}
//                 <div style={{
//                   minWidth: 56, textAlign: "center", padding: "8px 4px", borderRadius: 10,
//                   background: meta.bg, color: meta.color, flexShrink: 0,
//                 }}>
//                   <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>
//                     {new Date(w.date + "T00:00:00").getDate()}
//                   </div>
//                   <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
//                     {new Date(w.date + "T00:00:00").toLocaleString("en-IN", { month: "short" })}
//                   </div>
//                 </div>
//                 {/* Details */}
//                 <div style={{ flex: 1 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
//                     <span style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{fmt(w.date)}</span>
//                     <span style={{ padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: meta.bg, color: meta.color }}>{meta.label}</span>
//                     {isToday && <span style={{ padding:"2px 10px", borderRadius:99, fontSize:11, fontWeight:600, background:"#d1fae5", color:"#065f46" }}>Today</span>}
//                   </div>
//                   <div style={{ fontSize: 13, color: T.muted }}>{w.reason}</div>
//                 </div>
//                 {/* Right */}
//                 <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
//                   {isToday ? <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>Today</span>
//                   : isPast  ? <span style={{ fontSize: 12, color: T.muted }}>{Math.abs(du)}d ago</span>
//                   : <div style={{ textAlign: "center" }}>
//                       <div style={{ fontSize: 18, fontWeight: 800, color: "#0891b2", lineHeight: 1 }}>{du}</div>
//                       <div style={{ fontSize: 10, color: T.muted }}>days away</div>
//                     </div>
//                   }
//                   {w.status === "pending" && !isPast && (
//                     <button onClick={() => cancelRequest(w.id)} style={{
//                       fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
//                       border: `1px solid ${T.border}`, background: "#fff", color: T.danger, cursor: "pointer",
//                     }}>Cancel</button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </Card>

//       {/* ── New WFH Request Modal ── */}
//       <Modal open={showModal} onClose={closeModal} title="🏠 New WFH Request">
//         {success ? (
//           <div style={{ textAlign: "center", padding: "24px 0" }}>
//             <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
//             <div style={{ fontWeight: 700, fontSize: 16, color: T.success }}>Request submitted!</div>
//             <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>Awaiting manager approval.</div>
//           </div>
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//             <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//               <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: ".4px" }}>WFH Date *</label>
//               <input type="date" value={form.date} min={minDate}
//                 onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
//                 style={{ border: `1.5px solid ${T.border}`, borderRadius: 9, padding: "10px 12px", fontSize: 14, outline: "none", color: T.text, fontFamily: "'DM Sans',sans-serif" }}
//               />
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//               <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: ".4px" }}>Reason *</label>
//               <textarea value={form.reason} rows={3}
//                 onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
//                 placeholder="Why do you need to work from home?"
//                 style={{ border: `1.5px solid ${T.border}`, borderRadius: 9, padding: "10px 12px", fontSize: 14, outline: "none", color: T.text, resize: "vertical", fontFamily: "'DM Sans',sans-serif" }}
//               />
//             </div>
//             {formError && (
//               <div style={{ fontSize: 13, color: T.danger, background: "#fff0f0", borderRadius: 8, padding: "8px 12px" }}>{formError}</div>
//             )}
//             <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//               <Btn variant="ghost" onClick={closeModal}>Cancel</Btn>
//               <button onClick={handleSubmit} style={{
//                 padding: "10px 24px", borderRadius: 10, border: "none",
//                 background: "#0891b2", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
//               }}>Submit Request</button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }


// src/pages/employee/EmpWFH.jsx
// src/pages/employee/EmpWFH.jsx
import { useState, useMemo, useEffect } from "react";
import { T, Card, SectionTitle, Badge, Modal, Btn } from "../../components/employee/EmpUI";
import { MONTH_NAMES } from "../../utils/EmployeeData";
import wfhService from "../../services/wfhService";
import useCurrentEmployee from "../../hooks/useCurrentEmployee";

const TODAY = new Date();

const STATUS_META = {
  approved: { label: "Approved", dot: "#10b981", bg: "#d1fae5", color: "#065f46" },
  pending:  { label: "Pending",  dot: "#f59e0b", bg: "#fef3c7", color: "#92400e" },
  rejected: { label: "Rejected", dot: "#ef4444", bg: "#fee2e2", color: "#991b1b" },
};

// ── Professional SVG Icons ──────────────────────────────────────
const IcoClipboard = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
  </svg>
);
const IcoCheckCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
);
const IcoClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoXCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
  </svg>
);
const IcoHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IcoPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IcoCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcoSearch = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

function fmt(ds) {
  return new Date(ds + "T00:00:00").toLocaleDateString("en-IN", {
    weekday:"short", day:"numeric", month:"short", year:"numeric",
  });
}
function daysUntil(ds) {
  return Math.ceil((new Date(ds + "T00:00:00") - TODAY) / 86400000);
}

// ── Mini Month Calendar ──────────────────────────────────────────
function MonthCalendar({ year, month, wfhDates }) {
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset      = (firstDay + 6) % 7;
  const cells       = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:4 }}>
        {["M","T","W","T","F","S","S"].map((d,i) => (
          <div key={i} style={{ textAlign:"center", fontSize:10, fontWeight:700, color: i===6 ? "#cbd5e1" : "#94a3b8", padding:"3px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
        {cells.map((d,i) => {
          if (!d) return <div key={i}/>;
          const ds      = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const wfh     = wfhDates[ds];
          const isToday = ds === TODAY.toISOString().slice(0,10);
          const isSun   = i % 7 === 6;
          return (
            <div key={i} title={wfh ? `WFH – ${wfh.reason}` : ""} style={{
              textAlign:"center", padding:"5px 2px", borderRadius:6,
              fontSize:11, fontWeight: wfh||isToday ? 700 : 400,
              background: wfh
                ? (wfh.status==="approved" ? "#d1fae5" : wfh.status==="pending" ? "#fef3c7" : "#fee2e2")
                : isToday ? "#dbeafe" : "transparent",
              color: wfh
                ? STATUS_META[wfh.status].color
                : isToday ? "#0061f2" : isSun ? "#cbd5e1" : "#374151",
              cursor: wfh ? "help" : "default",
              border: isToday ? "1.5px solid #0061f2" : "1.5px solid transparent",
            }}>{d}</div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────
export default function EmpWFH() {
  const { employeeId, loading: empLoading } = useCurrentEmployee();
  const [wfhList,   setWfhList]   = useState([]);
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth());
  const [viewYear]                = useState(TODAY.getFullYear());
  const [filter,    setFilter]    = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState({ date:"", reason:"" });
  const [formError, setFormError] = useState("");
  const [success,   setSuccess]   = useState(false);

  useEffect(() => {
    wfhService.getWFH(employeeId).then(data => setWfhList(Array.isArray(data) ? data : []));
  }, [employeeId]);

  const wfhDates = useMemo(() => {
    const m = {}; wfhList.forEach(w => { m[w.date] = w; }); return m;
  }, [wfhList]);

  const approved          = wfhList.filter(w => w.status === "approved").length;
  const pending           = wfhList.filter(w => w.status === "pending").length;
  const rejected          = wfhList.filter(w => w.status === "rejected").length;
  const thisMonthApproved = wfhList.filter(w => {
    const d = new Date((w.date||"") + "T00:00:00");
    return d.getFullYear()===viewYear && d.getMonth()===viewMonth && (w.status||"").toLowerCase()==="approved";
  }).length;

  const filtered = useMemo(() => {
    const list = filter==="all" ? wfhList : wfhList.filter(w => w.status===filter);
    return [...list].sort((a,b) => b.date.localeCompare(a.date));
  }, [wfhList, filter]);

  function openModal()  { setForm({ date:"", reason:"" }); setFormError(""); setSuccess(false); setShowModal(true); }
  function closeModal() { setShowModal(false); }

  async function handleSubmit() {
    if (!form.date)          { setFormError("Please select a date."); return; }
    if (!form.reason.trim()) { setFormError("Please provide a reason."); return; }
    if (!employeeId)         { setFormError("Employee profile not loaded. Please refresh."); return; }
    const chosen = new Date(form.date + "T00:00:00");
    if (chosen <= TODAY)     { setFormError("Date must be in the future."); return; }
    if (chosen.getDay()===0) { setFormError("Cannot apply WFH on Sundays."); return; }
    if (wfhDates[form.date]) { setFormError("You already have a WFH request for this date."); return; }
    try {
      await wfhService.requestWFH({ employee_id: employeeId, date: form.date, reason: form.reason.trim() });
      setWfhList(prev => [...prev, { id: Date.now(), date: form.date, reason: form.reason.trim(), status: "pending" }]);
      setSuccess(true);
      setTimeout(() => { closeModal(); wfhService.getWFH(employeeId).then(d => setWfhList(Array.isArray(d) ? d : [])); }, 1600);
    } catch (err) {
      setFormError(err.message || "Failed to submit");
    }
  }

  function cancelRequest(id) { setWfhList(prev => prev.filter(w => w.id !== id)); }

  const minDate   = new Date(TODAY.getTime() + 86400000).toISOString().split("T")[0];
  const calMonths = [
    { year:viewYear, month:((viewMonth-1+12)%12), label:MONTH_NAMES[(viewMonth-1+12)%12] },
    { year:viewYear, month:viewMonth,              label:MONTH_NAMES[viewMonth]           },
    { year:viewYear, month:(viewMonth+1)%12,       label:MONTH_NAMES[(viewMonth+1)%12]   },
  ];

  const STATS = [
    { label:"Total Requests", value:wfhList.length, Ico:IcoClipboard,   iconBg:"#dbeafe", iconColor:"#0061f2" },
    { label:"Approved",       value:approved,        Ico:IcoCheckCircle, iconBg:"#d1fae5", iconColor:"#10b981" },
    { label:"Pending",        value:pending,         Ico:IcoClock,       iconBg:"#fef3c7", iconColor:"#f59e0b" },
    { label:"Rejected",       value:rejected,        Ico:IcoXCircle,     iconBg:"#fee2e2", iconColor:"#ef4444" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {!empLoading && !employeeId && (
        <div style={{ background:"#fef3c7", border:"1px solid #f59e0b", borderRadius:12, padding:"14px 20px", color:"#92400e", fontSize:14, fontWeight:600 }}>
          ⚠️ Employee profile not loaded. Please refresh the page or contact HR.
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div style={{
        background:"linear-gradient(135deg, #0061f2 0%, #0052cc 55%, #0284c7 100%)",
        borderRadius:18, padding:"28px 36px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        boxShadow:"0 8px 32px rgba(0,97,242,.30)", position:"relative", overflow:"hidden",
      }}>
        {/* Decorative bg circles */}
        {[[-30,-30,220],[80,-70,150],[210,50,100]].map(([r,t,s],i)=>(
          <div key={i} style={{ position:"absolute", right:r, top:t, width:s, height:s, borderRadius:"50%", background:"rgba(255,255,255,.06)", pointerEvents:"none" }}/>
        ))}
        <div style={{ position:"relative", display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ width:58, height:58, borderRadius:16, background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 }}>
            <IcoHome/>
          </div>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.65)", marginBottom:5, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>Work From Home</div>
            <div style={{ fontWeight:800, fontSize:26, color:"#fff", marginBottom:7, lineHeight:1.1 }}>WFH Management</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,.8)" }}>
              This month:&nbsp;<strong style={{ color:"#fff" }}>{thisMonthApproved} approved</strong>&nbsp;WFH days · Policy allows&nbsp;<strong style={{ color:"#fff" }}>2 days/week</strong>
            </div>
          </div>
        </div>
        <button
          onClick={openModal}
          disabled={empLoading||!employeeId}
          onMouseEnter={e=>{ if(!empLoading&&employeeId) e.currentTarget.style.transform="scale(1.04)"; }}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
          style={{
            background:(empLoading||!employeeId)?"rgba(255,255,255,.25)":"#fff",
            color:(empLoading||!employeeId)?"rgba(255,255,255,.55)":"#0061f2",
            border:"none", borderRadius:12, padding:"13px 24px", fontSize:14, fontWeight:700,
            cursor:(empLoading||!employeeId)?"not-allowed":"pointer",
            flexShrink:0, position:"relative",
            display:"flex", alignItems:"center", gap:8,
            boxShadow:"0 4px 16px rgba(0,0,0,.12)", transition:"transform .2s",
          }}
        >
          <IcoPlus/>
          {empLoading ? "Loading…" : "New WFH Request"}
        </button>
      </div>

      {/* ── Stats ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {STATS.map(({ label, value, Ico, iconBg, iconColor }) => (
          <Card key={label} style={{ padding:"18px 20px", display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:50, height:50, borderRadius:14, background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", color:iconColor, flexShrink:0 }}>
              <Ico/>
            </div>
            <div>
              <div style={{ fontSize:28, fontWeight:800, lineHeight:1, color:"#0f172a" }}>{value}</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:4, fontWeight:500 }}>{label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Monthly Calendars ── */}
      <Card style={{ padding:22 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", color:"#0061f2" }}>
              <IcoCalendar/>
            </div>
            <SectionTitle style={{ margin:0 }}>Monthly WFH Calendar</SectionTitle>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {[["Approved","#10b981","#d1fae5"],["Pending","#f59e0b","#fef3c7"],["Rejected","#ef4444","#fee2e2"]].map(([l,c,bg])=>(
              <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:T.muted }}>
                <div style={{ width:11, height:11, borderRadius:3, background:bg, border:`1.5px solid ${c}` }}/>
                {l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
          {calMonths.map(({ year, month, label })=>(
            <div key={label}>
              <div style={{ fontSize:13, fontWeight:700, color:"#0f172a", marginBottom:12, textAlign:"center", paddingBottom:10, borderBottom:`1px solid ${T.border}` }}>
                {label} {year}
              </div>
              <MonthCalendar year={year} month={month} wfhDates={wfhDates}/>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Request List ── */}
      <Card style={{ padding:22 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
          <SectionTitle style={{ margin:0 }}>My WFH Requests</SectionTitle>
          <div style={{ display:"flex", background:"#f1f5f9", borderRadius:10, padding:3, gap:2 }}>
            {[["all","All"],["approved","Approved"],["pending","Pending"],["rejected","Rejected"]].map(([val,lbl])=>(
              <button key={val} onClick={()=>setFilter(val)} style={{
                padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer",
                fontSize:12, fontWeight:600,
                background: filter===val ? "#0061f2" : "transparent",
                color:       filter===val ? "#fff"    : T.muted,
                transition:"all .15s",
              }}>{lbl}</button>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.length===0 && (
            <div style={{ textAlign:"center", padding:"48px 0", color:T.muted }}>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:12, color:"#cbd5e1" }}><IcoSearch/></div>
              <div style={{ fontWeight:600, fontSize:15 }}>No requests found</div>
              <div style={{ fontSize:12, marginTop:4 }}>Try changing the filter above</div>
            </div>
          )}
          {filtered.map(w => {
            const meta   = STATUS_META[w.status] || STATUS_META.pending;
            const du     = daysUntil(w.date);
            const isPast = du < 0;
            const isToday= du === 0;
            return (
              <div key={w.id}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,97,242,.10)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.04)"}
                style={{
                  display:"flex", alignItems:"center", gap:16,
                  padding:"14px 18px", borderRadius:14,
                  border:`1px solid ${T.border}`, background:"#fff",
                  borderLeft:`4px solid ${meta.dot}`,
                  opacity: isPast&&w.status==="rejected" ? .5 : 1,
                  boxShadow:"0 1px 4px rgba(0,0,0,.04)", transition:"box-shadow .2s",
                }}>
                {/* Date badge */}
                <div style={{ minWidth:54, textAlign:"center", padding:"8px 6px", borderRadius:12, background:meta.bg, color:meta.color, flexShrink:0 }}>
                  <div style={{ fontSize:22, fontWeight:800, lineHeight:1 }}>{new Date(w.date+"T00:00:00").getDate()}</div>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", marginTop:2 }}>
                    {new Date(w.date+"T00:00:00").toLocaleString("en-IN",{ month:"short" })}
                  </div>
                </div>
                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:600, fontSize:14, color:"#0f172a" }}>{fmt(w.date)}</span>
                    <span style={{ padding:"2px 10px", borderRadius:99, fontSize:11, fontWeight:700, background:meta.bg, color:meta.color }}>{meta.label}</span>
                    {isToday && <span style={{ padding:"2px 10px", borderRadius:99, fontSize:11, fontWeight:700, background:"#dbeafe", color:"#0061f2" }}>Today</span>}
                  </div>
                  <div style={{ fontSize:13, color:T.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{w.reason}</div>
                </div>
                {/* Right */}
                <div style={{ textAlign:"right", flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                  {isToday
                    ? <span style={{ fontSize:12, fontWeight:700, color:"#10b981" }}>Today</span>
                    : isPast
                    ? <span style={{ fontSize:12, color:T.muted }}>{Math.abs(du)}d ago</span>
                    : <div style={{ background:"#dbeafe", borderRadius:10, padding:"6px 12px", textAlign:"center" }}>
                        <div style={{ fontSize:18, fontWeight:800, color:"#0061f2", lineHeight:1 }}>{du}</div>
                        <div style={{ fontSize:10, color:"#0061f2", opacity:.7, fontWeight:600 }}>days away</div>
                      </div>
                  }
                  {w.status==="pending" && !isPast && (
                    <button onClick={()=>cancelRequest(w.id)} style={{ fontSize:11, fontWeight:600, padding:"4px 12px", borderRadius:7, border:"1px solid #fca5a5", background:"#fff0f0", color:"#ef4444", cursor:"pointer" }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Modal ── */}
      <Modal open={showModal} onClose={closeModal} title="New WFH Request">
        {success ? (
          <div style={{ textAlign:"center", padding:"28px 0" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"#d1fae5", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", color:"#10b981" }}>
              <IcoCheckCircle/>
            </div>
            <div style={{ fontWeight:700, fontSize:17, color:"#065f46" }}>Request submitted!</div>
            <div style={{ fontSize:13, color:T.muted, marginTop:6 }}>Awaiting manager approval.</div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".5px" }}>WFH Date *</label>
              <input type="date" value={form.date} min={minDate}
                onChange={e=>setForm(p=>({...p, date:e.target.value}))}
                onFocus={e=>e.target.style.borderColor="#0061f2"}
                onBlur={e=>e.target.style.borderColor=T.border}
                style={{ border:`1.5px solid ${T.border}`, borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", color:"#0f172a", fontFamily:"'DM Sans',sans-serif", transition:"border-color .2s" }}
              />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".5px" }}>Reason *</label>
              <textarea value={form.reason} rows={3}
                onChange={e=>setForm(p=>({...p, reason:e.target.value}))}
                placeholder="Why do you need to work from home?"
                onFocus={e=>e.target.style.borderColor="#0061f2"}
                onBlur={e=>e.target.style.borderColor=T.border}
                style={{ border:`1.5px solid ${T.border}`, borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", color:"#0f172a", resize:"vertical", fontFamily:"'DM Sans',sans-serif", transition:"border-color .2s" }}
              />
            </div>
            {formError && (
              <div style={{ fontSize:13, color:"#991b1b", background:"#fff0f0", border:"1px solid #fca5a5", borderRadius:9, padding:"10px 14px" }}>{formError}</div>
            )}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", paddingTop:4 }}>
              <button onClick={closeModal} style={{ padding:"10px 20px", borderRadius:10, border:`1.5px solid ${T.border}`, background:"#fff", color:T.muted, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                Cancel
              </button>
              <button onClick={handleSubmit} style={{ padding:"10px 24px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#0061f2,#0052cc)", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", boxShadow:"0 4px 12px rgba(0,97,242,.3)", display:"flex", alignItems:"center", gap:8 }}>
                <IcoPlus/>
                Submit Request
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}


