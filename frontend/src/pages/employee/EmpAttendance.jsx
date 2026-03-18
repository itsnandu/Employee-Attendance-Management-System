// // src/pages/employee/EmpAttendance.jsx
// import { useState, useMemo, useEffect, useRef } from "react";
// import { T, Card, SectionTitle, StatusBadge } from "../../components/employee/EmpUI";
// import {
//   buildMonthAttendanceFromAPI, getWeekDates, getHoliday,
//   dateStr, MONTH_NAMES, DAY_LABELS,
// } from "../../utils/EmployeeData";
// import useCurrentEmployee from "../../hooks/useCurrentEmployee";
// import attendanceService from "../../services/attendanceService";
// import holidayService from "../../services/holidayService";

// const TODAY_DATE = new Date();
// const TODAY_STR  = dateStr(TODAY_DATE);

// // ── Live Clock ────────────────────────────────────────────────
// function useLiveClock() {
//   const [now, setNow] = useState(new Date());
//   useEffect(() => {
//     const t = setInterval(() => setNow(new Date()), 1000);
//     return () => clearInterval(t);
//   }, []);
//   return now;
// }

// function formatTime(date) {
//   return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
// }

// function calcElapsed(checkInTime) {
//   if (!checkInTime) return null;
//   const [timePart, ampm] = checkInTime.split(" ");
//   let [h, m, s = 0] = timePart.split(":").map(Number);
//   if (ampm === "PM" && h !== 12) h += 12;
//   if (ampm === "AM" && h === 12) h = 0;
//   const start = new Date();
//   start.setHours(h, m, s, 0);
//   const diff = Math.max(0, Math.floor((new Date() - start) / 1000));
//   const hh = Math.floor(diff / 3600);
//   const mm = Math.floor((diff % 3600) / 60);
//   const ss = diff % 60;
//   return `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
// }

// // ── Check-In / Check-Out Action Card ─────────────────────────
// function AttendanceActionCard({ checkedIn, checkInTime, checkedOut, checkOutTime, onCheckIn, onCheckOut }) {
//   const now = useLiveClock();
//   const elapsed = checkedIn && !checkedOut ? calcElapsed(checkInTime) : null;

//   const statusLabel = !checkedIn ? "Not Checked In" : checkedOut ? "Checked Out" : "Currently Working";
//   const statusColor = !checkedIn ? T.muted : checkedOut ? T.success : "#4f46e5";
//   const statusBg    = !checkedIn ? T.surface2 : checkedOut ? "#d1fae5" : "#ede9fe";

//   return (
//     <Card style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
//       {/* Header gradient bar */}
//       <div style={{
//         background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
//         padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
//       }}>
//         <div>
//           <div style={{ color: "#c7d2fe", fontSize: 12, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 4 }}>
//             Today's Attendance
//           </div>
//           <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>
//             {formatTime(now)}
//           </div>
//           <div style={{ color: "#a5b4fc", fontSize: 13, marginTop: 2 }}>
//             {TODAY_DATE.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
//           </div>
//         </div>
//         <div style={{
//           background: "rgba(255,255,255,0.15)", borderRadius: 16,
//           padding: "10px 20px", textAlign: "center",
//         }}>
//           <div style={{ color: "#c7d2fe", fontSize: 11, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase" }}>Status</div>
//           <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginTop: 4 }}>{statusLabel}</div>
//         </div>
//       </div>

//       {/* Body */}
//       <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>

//         {/* Time info */}
//         <div style={{ display: "flex", gap: 16, flex: 1 }}>
//           <div style={{ padding: "12px 18px", borderRadius: 12, background: T.surface2, flex: 1, minWidth: 110 }}>
//             <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase", marginBottom: 6 }}>Check In</div>
//             <div style={{ fontSize: 18, fontWeight: 700, color: checkedIn ? T.success : T.muted }}>
//               {checkInTime || "—"}
//             </div>
//           </div>
//           <div style={{ padding: "12px 18px", borderRadius: 12, background: T.surface2, flex: 1, minWidth: 110 }}>
//             <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase", marginBottom: 6 }}>Check Out</div>
//             <div style={{ fontSize: 18, fontWeight: 700, color: checkedOut ? T.danger : T.muted }}>
//               {checkOutTime || "—"}
//             </div>
//           </div>
//           <div style={{ padding: "12px 18px", borderRadius: 12, background: T.surface2, flex: 1, minWidth: 110 }}>
//             <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase", marginBottom: 6 }}>
//               {checkedOut ? "Total Hours" : "Elapsed"}
//             </div>
//             <div style={{ fontSize: 18, fontWeight: 700, color: T.primary, fontVariantNumeric: "tabular-nums" }}>
//               {checkedOut ? checkOutTime ? calcTotalHours(checkInTime, checkOutTime) : "—" : elapsed || "—"}
//             </div>
//           </div>
//         </div>

//         {/* Action buttons */}
//         <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
//           <button
//             onClick={onCheckIn}
//             disabled={checkedIn}
//             style={{
//               padding: "12px 28px", borderRadius: 12, border: "none", cursor: checkedIn ? "not-allowed" : "pointer",
//               background: checkedIn ? "#e2e8f0" : "linear-gradient(135deg,#4f46e5,#7c3aed)",
//               color: checkedIn ? "#94a3b8" : "#fff",
//               fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
//               transition: "all .2s", boxShadow: checkedIn ? "none" : "0 4px 14px rgba(79,70,229,.35)",
//             }}
//           >
//             ✓ Check In
//           </button>
//           <button
//             onClick={onCheckOut}
//             disabled={!checkedIn || checkedOut}
//             style={{
//               padding: "12px 28px", borderRadius: 12, border: "none",
//               cursor: (!checkedIn || checkedOut) ? "not-allowed" : "pointer",
//               background: (!checkedIn || checkedOut) ? "#e2e8f0" : "linear-gradient(135deg,#ef4444,#dc2626)",
//               color: (!checkedIn || checkedOut) ? "#94a3b8" : "#fff",
//               fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
//               transition: "all .2s", boxShadow: (!checkedIn || checkedOut) ? "none" : "0 4px 14px rgba(239,68,68,.35)",
//             }}
//           >
//             ↩ Check Out
//           </button>
//         </div>
//       </div>

//       {/* Progress bar */}
//       {checkedIn && !checkedOut && (
//         <div style={{ padding: "0 24px 18px" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted, marginBottom: 6 }}>
//             <span>Work progress (8h target)</span>
//             <span style={{ fontWeight: 600, color: T.primary }}>{elapsed}</span>
//           </div>
//           <div style={{ height: 6, background: T.surface2, borderRadius: 99, overflow: "hidden" }}>
//             <div style={{
//               height: "100%", borderRadius: 99,
//               background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
//               width: `${Math.min(100, (parseElapsedSecs(elapsed) / (8*3600)) * 100)}%`,
//               transition: "width 1s linear",
//             }} />
//           </div>
//         </div>
//       )}
//     </Card>
//   );
// }

// function parseElapsedSecs(elapsed) {
//   if (!elapsed) return 0;
//   const [h, m, s] = elapsed.split(":").map(Number);
//   return h * 3600 + m * 60 + s;
// }

// function calcTotalHours(cin, cout) {
//   if (!cin || !cout) return "—";
//   const parse = t => {
//     const [time, ampm] = t.split(" ");
//     let [h, m, s = 0] = time.split(":").map(Number);
//     if (ampm === "PM" && h !== 12) h += 12;
//     if (ampm === "AM" && h === 12) h = 0;
//     return h * 3600 + m * 60 + s;
//   };
//   const diff = parse(cout) - parse(cin);
//   const hh = Math.floor(diff / 3600);
//   const mm = Math.floor((diff % 3600) / 60);
//   return `${hh}h ${mm}m`;
// }

// // ── Mini Calendar ─────────────────────────────────────────────
// function MiniCalendar({ date, onChange, view, holidaysMap = {} }) {
//   const [nav, setNav] = useState(new Date(date));
//   const year = nav.getFullYear(), month = nav.getMonth();
//   const firstDay = new Date(year, month, 1);
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const startOffset = (firstDay.getDay() + 6) % 7;
//   const cells = [];
//   for (let i = 0; i < startOffset; i++) cells.push(null);
//   for (let d = 1; d <= daysInMonth; d++) cells.push(d);

//   const selWeek = view === "weekly" ? getWeekDates(date).map(d => dateStr(d)) : [];
//   const isSelMonth = date.getFullYear() === year && date.getMonth() === month;

//   return (
//     <Card style={{ padding: 16 }}>
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
//         <button onClick={()=>{ const d=new Date(nav); d.setMonth(d.getMonth()-1); setNav(d); }} style={nb}>‹</button>
//         <span style={{ fontSize:13, fontWeight:700 }}>{MONTH_NAMES[month]} {year}</span>
//         <button onClick={()=>{ const d=new Date(nav); d.setMonth(d.getMonth()+1); setNav(d); }} style={nb}>›</button>
//       </div>
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:4 }}>
//         {["M","T","W","T","F","S","S"].map((d,i)=>(
//           <div key={i} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:"#94a3b8" }}>{d}</div>
//         ))}
//       </div>
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
//         {cells.map((day,i)=>{
//           if (!day) return <div key={i}/>;
//           const d = new Date(year, month, day);
//           const ds = dateStr(d);
//           const isToday = ds === TODAY_STR;
//           const isSel   = isSelMonth && day===date.getDate() && view==="daily";
//           const inWeek  = view==="weekly" && selWeek.includes(ds);
//           const inMonth = view==="monthly" && isSelMonth;
//           const active  = isSel || inWeek || inMonth;
//           const holiday = getHoliday(ds, holidaysMap);
//           return (
//             <button key={i} onClick={()=>onChange(new Date(year,month,day))} style={{
//               border:"none", cursor:"pointer", padding:"5px 0", borderRadius:7,
//               fontSize:12, fontWeight: isToday?700:400,
//               background: active?T.primary:isToday?T.primaryLight:holiday?"#fef9c3":"transparent",
//               color:       active?"#fff":isToday?T.primary:holiday?"#854d0e":"#374151",
//             }}>{day}</button>
//           );
//         })}
//       </div>
//       {/* Legend */}
//       <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:10, fontSize:11, color:T.muted }}>
//         <div style={{ width:10, height:10, borderRadius:3, background:"#fef9c3", border:"1px solid #ca8a04" }}/>
//         <span>Holiday</span>
//       </div>
//     </Card>
//   );
// }
// const nb = {
//   border:"none", background:T.surface2, cursor:"pointer",
//   width:26, height:26, borderRadius:7, fontSize:14, color:T.muted,
// };

// // ── Summary Cards ─────────────────────────────────────────────
// function SummaryCards({ present, absent, late }) {
//   return (
//     <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
//       {[
//         { label:"Present", value:present, icon:"✓",  iconBg:"#d1fae5", iconColor:T.success },
//         { label:"Absent",  value:absent,  icon:"✕",  iconBg:"#fee2e2", iconColor:T.danger  },
//         { label:"Late",    value:late,    icon:"⏰", iconBg:"#fef3c7", iconColor:T.warning },
//       ].map(c=>(
//         <Card key={c.label} style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
//           <div style={{ width:44, height:44, borderRadius:12, background:c.iconBg, color:c.iconColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700 }}>{c.icon}</div>
//           <div>
//             <div style={{ fontSize:28, fontWeight:700, lineHeight:1 }}>{c.value}</div>
//             <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{c.label}</div>
//           </div>
//         </Card>
//       ))}
//     </div>
//   );
// }

// // ── Daily View ────────────────────────────────────────────────
// function DailyView({ date, checkedIn, checkInTime, checkedOut, checkOutTime, onCheckIn, onCheckOut, monthData, rec }) {
//   const ds  = dateStr(date);
//   const isToday = ds === TODAY_STR;

//   if (!rec) {
//     return (
//       <Card style={{ padding:40, textAlign:"center" }}>
//         <div style={{ fontSize:40, marginBottom:12 }}>📅</div>
//         <div style={{ fontWeight:700, fontSize:16 }}>Loading...</div>
//       </Card>
//     );
//   }
//   if (rec.type === "weekend") {
//     return (
//       <Card style={{ padding:40, textAlign:"center" }}>
//         <div style={{ fontSize:40, marginBottom:12 }}>🏖️</div>
//         <div style={{ fontWeight:700, fontSize:16 }}>Weekend</div>
//         <div style={{ color:T.muted, fontSize:13, marginTop:4 }}>No attendance record for this day.</div>
//       </Card>
//     );
//   }

//   if (rec.type === "holiday") {
//     const typeColor = rec.holidayType === "public" ? "#4f46e5" : rec.holidayType === "restricted" ? "#f59e0b" : "#06b6d4";
//     const typeBg    = rec.holidayType === "public" ? "#ede9fe" : rec.holidayType === "restricted" ? "#fef3c7" : "#cffafe";
//     return (
//       <Card style={{ padding:40, textAlign:"center" }}>
//         <div style={{ fontSize:44, marginBottom:12 }}>🎉</div>
//         <div style={{ fontWeight:800, fontSize:18, fontFamily:"'Syne',sans-serif" }}>{rec.holidayName}</div>
//         <div style={{ marginTop:8, display:"inline-block", padding:"4px 16px", borderRadius:99, background:typeBg, color:typeColor, fontSize:13, fontWeight:600, textTransform:"capitalize" }}>
//           {rec.holidayType} Holiday
//         </div>
//         <div style={{ color:T.muted, fontSize:13, marginTop:12 }}>Office is closed. Enjoy your day off!</div>
//       </Card>
//     );
//   }

//   if (rec.type === "future") {
//     return (
//       <Card style={{ padding:40, textAlign:"center" }}>
//         <div style={{ fontSize:40, marginBottom:12 }}>📅</div>
//         <div style={{ fontWeight:700, fontSize:16 }}>Future Date</div>
//         <div style={{ color:T.muted, fontSize:13, marginTop:4 }}>Attendance not yet recorded.</div>
//       </Card>
//     );
//   }

//   const wkdays  = (monthData || []).filter(d=>d.type!=="weekend"&&d.type!=="future"&&d.type!=="holiday");
//   const present = wkdays.filter(d=>d.type==="present").length;
//   const absent  = wkdays.filter(d=>d.type==="absent").length;
//   const late    = wkdays.filter(d=>d.type==="late").length;

//   // For today, use live check-in/out; for past days use mock data
//   const displayCheckIn  = isToday ? checkInTime  : rec.checkIn;
//   const displayCheckOut = isToday ? checkOutTime : rec.checkOut;
//   const displayStatus   = isToday
//     ? (checkedOut ? "present" : checkedIn ? "present" : "absent")
//     : rec.type;

//   return (
//     <div>
//       {/* Show action card only for today */}
//       {isToday && (
//         <AttendanceActionCard
//           checkedIn={checkedIn}
//           checkInTime={checkInTime}
//           checkedOut={checkedOut}
//           checkOutTime={checkOutTime}
//           onCheckIn={onCheckIn}
//           onCheckOut={onCheckOut}
//         />
//       )}

//       <SummaryCards present={present} absent={absent} late={late}/>

//       <Card style={{ padding:24 }}>
//         <SectionTitle>Attendance Detail — {date.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</SectionTitle>
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
//           {[
//             { label:"Status",     value:<StatusBadge status={displayStatus}/> },
//             { label:"Check In",   value: displayCheckIn  || "—" },
//             { label:"Check Out",  value: displayCheckOut || "—" },
//             { label:"Work Hours", value: isToday && checkedOut ? calcTotalHours(checkInTime, checkOutTime) : rec.hours || "—" },
//             { label:"Department", value: "Engineering" },
//             { label:"Employee ID",value: "EMP-0042" },
//           ].map(r=>(
//             <div key={r.label} style={{ padding:"14px 18px", borderRadius:10, background:T.surface2 }}>
//               <div style={{ fontSize:11, color:T.muted, fontWeight:600, letterSpacing:".4px", textTransform:"uppercase", marginBottom:6 }}>{r.label}</div>
//               <div style={{ fontSize:16, fontWeight:600 }}>{r.value}</div>
//             </div>
//           ))}
//         </div>
//       </Card>
//     </div>
//   );
// }

// // ── Weekly View ───────────────────────────────────────────────
// function WeeklyView({ date, checkedIn, checkInTime, checkedOut, checkOutTime, attByDate, holidaysMap }) {
//   const weekDates = useMemo(()=>getWeekDates(date),[date]);
//   const days = useMemo(()=>weekDates.map(d=>{
//     const ds = dateStr(d);
//     const dow = d.getDay();
//     if (dow===0||dow===6) return { date:d, type:"weekend" };
//     const holiday = getHoliday(ds, holidaysMap);
//     if (holiday) return { date:d, type:"holiday", holidayName:holiday.name || holiday.title };
//     if (d > TODAY_DATE) return { date:d, type:"future" };
//     if (ds === TODAY_STR) {
//       const st = checkedOut ? "present" : checkedIn ? "present" : "absent";
//       return { date:d, type:st, checkIn:checkInTime||null, checkOut:checkOutTime||null,
//         hours: checkedOut ? calcTotalHours(checkInTime, checkOutTime) : null };
//     }
//     const rec = attByDate[ds];
//     if (!rec) return { date:d, type:"absent", checkIn:null, checkOut:null, hours:null };
//     const cin = rec.check_in || rec.check_in_time;
//     const cout = rec.check_out || rec.check_out_time;
//     return { date:d, type:(rec.status||"present").toLowerCase().includes("late")?"late":"present", checkIn:cin?String(cin).slice(0,5):null, checkOut:cout?String(cout).slice(0,5):null, hours:cin&&cout?"9.2h":null };
//   }),[weekDates, checkedIn, checkInTime, checkedOut, checkOutTime, attByDate, holidaysMap]);

//   const workdays = days.filter(d=>d.type!=="weekend"&&d.type!=="future"&&d.type!=="holiday");
//   const present  = workdays.filter(d=>d.type==="present").length;
//   const absent   = workdays.filter(d=>d.type==="absent").length;
//   const late     = workdays.filter(d=>d.type==="late").length;

//   const bgMap    = { present:"#d1fae5", late:"#fef3c7", absent:"#fee2e2", weekend:"#f8fafc", future:"#f8fafc", holiday:"#fef9c3" };
//   const colorMap = { present:"#065f46", late:"#92400e", absent:"#991b1b", weekend:T.muted,   future:T.muted,   holiday:"#854d0e" };

//   return (
//     <div>
//       <SummaryCards present={present} absent={absent} late={late}/>
//       <Card style={{ overflow:"hidden" }}>
//         <table style={{ width:"100%", borderCollapse:"collapse" }}>
//           <thead>
//             <tr style={{ background:T.surface2 }}>
//               {["Day","Date","Check In","Check Out","Hours","Status"].map(h=>(
//                 <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:T.muted, letterSpacing:".5px", borderBottom:`1px solid ${T.border}` }}>{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {days.map((d,i)=>(
//               <tr key={i} style={{ borderBottom:`1px solid #f1f5f9`, background:dateStr(d.date)===TODAY_STR?"#f5f3ff":i%2===0?T.surface:T.surface2 }}>
//                 <td style={{ padding:"12px 16px", fontWeight:600, fontSize:14 }}>{DAY_LABELS[i]}</td>
//                 <td style={{ padding:"12px 16px", fontSize:14, color:T.muted }}>{d.date.getDate()} {MONTH_NAMES[d.date.getMonth()].slice(0,3)}</td>
//                 <td style={{ padding:"12px 16px", fontSize:14, fontWeight:500 }}>{d.checkIn||"—"}</td>
//                 <td style={{ padding:"12px 16px", fontSize:14, fontWeight:500 }}>{d.checkOut||"—"}</td>
//                 <td style={{ padding:"12px 16px", fontSize:14, fontWeight:700 }}>{d.hours||"—"}</td>
//                 <td style={{ padding:"12px 16px" }}>
//                   {d.type==="weekend"||d.type==="future"
//                     ? <span style={{ fontSize:12, color:T.muted, fontStyle:"italic" }}>{d.type}</span>
//                     : d.type==="holiday"
//                     ? <span style={{ fontSize:12, background:"#fef9c3", color:"#854d0e", padding:"3px 10px", borderRadius:99, fontWeight:600 }}>🎉 {d.holidayName}</span>
//                     : <StatusBadge status={d.type}/>
//                   }
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </Card>
//     </div>
//   );
// }

// // ── Monthly View ──────────────────────────────────────────────
// function MonthlyView({ date, checkedIn, checkedOut, monthData }) {
//   const data = monthData || [];

//   const firstDay = new Date(year, month, 1);
//   const startOffset = (firstDay.getDay() + 6) % 7;
//   const cells = [];
//   for (let i=0;i<startOffset;i++) cells.push(null);
//   data.forEach(d=>cells.push(d));
//   while (cells.length%7!==0) cells.push(null);

//   const workdays = data.filter(d=>d.type!=="weekend"&&d.type!=="future"&&d.type!=="holiday");
//   const present  = workdays.filter(d=>d.type==="present").length;
//   const absent   = workdays.filter(d=>d.type==="absent").length;
//   const late     = workdays.filter(d=>d.type==="late").length;
//   const rate     = workdays.length ? Math.round(((present+late)/workdays.length)*100) : 0;

//   const bgMap    = { present:"#d1fae5", late:"#fef3c7", absent:"#fee2e2", weekend:"#f8fafc", future:"#f8fafc", holiday:"#fef9c3" };
//   const colorMap = { present:"#065f46", late:"#92400e", absent:"#991b1b", weekend:"#cbd5e1", future:"#94a3b8", holiday:"#854d0e" };
//   const labelMap = { present:"P", late:"L", absent:"A", holiday:"H" };

//   return (
//     <div>
//       <SummaryCards present={present} absent={absent} late={late}/>
//       <Card style={{ padding:"14px 20px", marginBottom:16, display:"flex", alignItems:"center", gap:16 }}>
//         <div style={{ fontSize:13, fontWeight:600, color:T.muted, whiteSpace:"nowrap" }}>Monthly Attendance Rate</div>
//         <div style={{ flex:1, background:T.surface2, borderRadius:99, height:9, overflow:"hidden" }}>
//           <div style={{ height:"100%", borderRadius:99, width:`${rate}%`, background:`linear-gradient(90deg,${T.primary},${T.accent})`, transition:"width .5s ease" }}/>
//         </div>
//         <div style={{ fontSize:16, fontWeight:800, color:T.primary, minWidth:48 }}>{rate}%</div>
//       </Card>

//       <Card style={{ padding:20 }}>
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6, marginBottom:8 }}>
//           {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
//             <div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".4px" }}>{d}</div>
//           ))}
//         </div>
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
//           {cells.map((cell,i)=>{
//             if (!cell) return <div key={i}/>;
//             const isToday = cell.date && year===TODAY_DATE.getFullYear() && month===TODAY_DATE.getMonth() && cell.day===TODAY_DATE.getDate();
//             return (
//               <div key={i} style={{
//                 aspectRatio:"1", borderRadius:10,
//                 display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
//                 background: bgMap[cell.type]||"#f8fafc",
//                 color:      colorMap[cell.type]||"#94a3b8",
//                 fontSize:12, fontWeight:600,
//                 outline: isToday?`2px solid ${T.primary}`:"none", outlineOffset:1,
//                 border: cell.type==="future"?"1px dashed #e2e8f0":"none",
//               }}>
//                 <span>{cell.day}</span>
//                 {cell.type!=="weekend"&&cell.type!=="future"&&(
//                   <span style={{ fontSize:9, opacity:.75, textTransform:"uppercase" }}>
//                     {labelMap[cell.type]}
//                   </span>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//         {/* Legend */}
//         <div style={{ display:"flex", gap:16, marginTop:14, fontSize:12, color:T.muted, flexWrap:"wrap" }}>
//           {[
//             ["#d1fae5","#065f46","Present"],
//             ["#fef3c7","#92400e","Late"],
//             ["#fee2e2","#991b1b","Absent"],
//             ["#fef9c3","#854d0e","Holiday"],
//             ["#f8fafc","#cbd5e1","Weekend"],
//           ].map(([bg,col,label])=>(
//             <div key={label} style={{ display:"flex", alignItems:"center", gap:6 }}>
//               <div style={{ width:14, height:14, borderRadius:4, background:bg, border:`1px solid ${col}44` }}/>
//               {label}
//             </div>
//           ))}
//         </div>
//       </Card>
//     </div>
//   );
// }

// // ── Main Export ───────────────────────────────────────────────
// export default function EmpAttendance() {
//   const { employeeId } = useCurrentEmployee();
//   const [view, setView] = useState("daily");
//   const [date, setDate] = useState(new Date(TODAY_DATE));
//   const [attendance, setAttendance] = useState([]);
//   const [holidays, setHolidays] = useState([]);

//   const [checkedIn,    setCheckedIn]    = useState(false);
//   const [checkInTime,  setCheckInTime]  = useState(null);
//   const [checkedOut,   setCheckedOut]   = useState(false);
//   const [checkOutTime, setCheckOutTime] = useState(null);
//   const [toast,        setToast]        = useState(null);

//   const now = useLiveClock();

//   useEffect(() => {
//     attendanceService.getAttendance().then((d) => setAttendance(Array.isArray(d) ? d : []));
//     holidayService.getHolidays().then((d) => setHolidays(Array.isArray(d) ? d : []));
//   }, []);

//   const holidaysMap = useMemo(() => {
//     const m = {};
//     holidays.forEach(h => { m[h.date || h.holiday_date || ""] = { name: h.name || h.title, type: h.type || "public" }; });
//     return m;
//   }, [holidays]);

//   const myAttendance = useMemo(() =>
//     employeeId ? attendance.filter(a => a.employee_id === employeeId) : attendance,
//   [attendance, employeeId]);

//   const monthData = useMemo(() =>
//     buildMonthAttendanceFromAPI(date.getFullYear(), date.getMonth(), myAttendance, holidaysMap),
//   [date, myAttendance, holidaysMap]);

//   const rec = monthData.find(d => d.day === date.getDate());
//   const attByDate = useMemo(() => {
//     const m = {};
//     myAttendance.forEach(a => { m[(a.date||"").slice(0,10)] = a; });
//     return m;
//   }, [myAttendance]);

//   const todayAtt = myAttendance.find(a => (a.date||"").slice(0,10) === TODAY_STR);
//   useEffect(() => {
//     if (todayAtt) {
//       setCheckedIn(true);
//       setCheckInTime(todayAtt.check_in || todayAtt.check_in_time || null);
//       setCheckedOut(!!(todayAtt.check_out || todayAtt.check_out_time));
//       setCheckOutTime(todayAtt.check_out || todayAtt.check_out_time || null);
//     }
//   }, [todayAtt?.id, todayAtt?.check_in_time, todayAtt?.check_out_time]);

//   async function handleCheckIn() {
//     if (!employeeId) return;
//     const t = formatTime(now);
//     try {
//       await attendanceService.checkIn({ employee_id: employeeId, date: TODAY_STR, check_in: t });
//       setCheckedIn(true);
//       setCheckInTime(t);
//       showToast("✓ Checked in at " + t, "success");
//       attendanceService.getAttendance().then((d) => setAttendance(Array.isArray(d) ? d : []));
//     } catch (err) {
//       showToast(err.message || "Check-in failed", "error");
//     }
//   }

//   async function handleCheckOut() {
//     if (!employeeId) return;
//     const t = formatTime(now);
//     try {
//       await attendanceService.checkOut({ employee_id: employeeId, date: TODAY_STR, check_out: t });
//       setCheckedOut(true);
//       setCheckOutTime(t);
//       showToast("↩ Checked out at " + t, "info");
//       attendanceService.getAttendance().then((d) => setAttendance(Array.isArray(d) ? d : []));
//     } catch (err) {
//       showToast(err.message || "Check-out failed", "error");
//     }
//   }

//   function showToast(msg, type) {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   }

//   function shift(dir) {
//     const d = new Date(date);
//     if (view==="daily")   d.setDate(d.getDate()  + dir);
//     if (view==="weekly")  d.setDate(d.getDate()  + dir*7);
//     if (view==="monthly") d.setMonth(d.getMonth()+ dir);
//     setDate(d);
//   }

//   function periodLabel() {
//     if (view==="daily")   return date.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
//     if (view==="weekly") {
//       const wd = getWeekDates(date);
//       return `${wd[0].toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${wd[6].toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}`;
//     }
//     return date.toLocaleDateString("en-GB",{month:"long",year:"numeric"});
//   }

//   return (
//     <div style={{ display:"flex", gap:20, position:"relative" }}>

//       {/* Toast */}
//       {toast && (
//         <div style={{
//           position:"fixed", top:80, right:28, zIndex:999,
//           padding:"12px 22px", borderRadius:12,
//           background: toast.type==="success" ? "#d1fae5" : "#dbeafe",
//           color:       toast.type==="success" ? "#065f46"  : "#1e40af",
//           fontWeight:600, fontSize:14, boxShadow:"0 4px 16px rgba(0,0,0,.12)",
//           animation:"fadeIn .2s ease",
//         }}>{toast.msg}</div>
//       )}

//       {/* Mini calendar */}
//       <div style={{ width:220, flexShrink:0 }}>
//         <MiniCalendar date={date} onChange={setDate} view={view} holidaysMap={holidaysMap}/>
//       </div>

//       {/* Content */}
//       <div style={{ flex:1, minWidth:0 }}>
//         {/* Controls */}
//         <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:12 }}>
//           {/* View tabs */}
//           <div style={{ display:"flex", background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:4, gap:2 }}>
//             {["daily","weekly","monthly"].map(v=>(
//               <button key={v} onClick={()=>setView(v)} style={{
//                 padding:"7px 22px", borderRadius:9, border:"none", cursor:"pointer",
//                 fontSize:13, fontWeight:600,
//                 background: view===v?T.primary:"transparent",
//                 color:      view===v?"#fff":T.muted,
//                 textTransform:"capitalize", fontFamily:"'DM Sans',sans-serif",
//               }}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>
//             ))}
//           </div>
//           {/* Period nav */}
//           <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//             <button onClick={()=>shift(-1)} style={navBtn}>‹</button>
//             <div style={{ padding:"6px 18px", borderRadius:9, background:T.surface, border:`1px solid ${T.border}`, fontSize:13, fontWeight:600, color:T.text, minWidth:240, textAlign:"center" }}>{periodLabel()}</div>
//             <button onClick={()=>shift(1)}  style={navBtn}>›</button>
//             <button onClick={()=>setDate(new Date(TODAY_DATE))} style={{ padding:"6px 14px", borderRadius:9, border:`1.5px solid ${T.primary}`, background:T.primaryLight, color:T.primary, cursor:"pointer", fontSize:12, fontWeight:700 }}>Today</button>
//           </div>
//         </div>

//         {view==="daily"   && <DailyView   date={date} checkedIn={checkedIn} checkInTime={checkInTime} checkedOut={checkedOut} checkOutTime={checkOutTime} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} monthData={monthData} rec={rec}/>}
//         {view==="weekly"  && <WeeklyView  date={date} checkedIn={checkedIn} checkInTime={checkInTime} checkedOut={checkedOut} checkOutTime={checkOutTime} attByDate={attByDate} holidaysMap={holidaysMap}/>}
//         {view==="monthly" && <MonthlyView date={date} checkedIn={checkedIn} checkedOut={checkedOut} monthData={monthData}/>}
//       </div>
//     </div>
//   );
// }

// const navBtn = {
//   border:`1px solid ${T.border}`, background:T.surface, cursor:"pointer",
//   width:34, height:34, borderRadius:9, fontSize:16, color:T.muted,
//   display:"flex", alignItems:"center", justifyContent:"center",
// };

// src/pages/employee/EmpAttendance.jsx
// src/pages/employee/EmpAttendance.jsx
import { useState, useMemo, useEffect, useRef } from "react";
import { T, Card, SectionTitle, StatusBadge } from "../../components/employee/EmpUI";
import {
  buildMonthAttendanceFromAPI, getWeekDates, getHoliday,
  dateStr, MONTH_NAMES, DAY_LABELS,
} from "../../utils/EmployeeData";
import useCurrentEmployee from "../../hooks/useCurrentEmployee";
import attendanceService from "../../services/attendanceService";
import holidayService from "../../services/holidayService";

const TODAY_DATE = new Date();
const TODAY_STR  = dateStr(TODAY_DATE);

// ── Live Clock ────────────────────────────────────────────────
function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function formatTime(date) {
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
}

function formatTime24(date) {
  return date.toTimeString().slice(0, 8); // HH:MM:SS for backend
}

function calcElapsed(checkInTime) {
  if (!checkInTime) return null;
  const [timePart, ampm] = checkInTime.split(" ");
  let [h, m, s = 0] = timePart.split(":").map(Number);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  const start = new Date();
  start.setHours(h, m, s, 0);
  const diff = Math.max(0, Math.floor((new Date() - start) / 1000));
  const hh = Math.floor(diff / 3600);
  const mm = Math.floor((diff % 3600) / 60);
  const ss = diff % 60;
  return `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
}

function parseElapsedSecs(elapsed) {
  if (!elapsed) return 0;
  const [h, m, s] = elapsed.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

function calcTotalHours(cin, cout) {
  if (!cin || !cout) return "—";
  const parse = t => {
    const [time, ampm] = t.split(" ");
    let [h, m, s = 0] = time.split(":").map(Number);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return h * 3600 + m * 60 + s;
  };
  const diff = Math.max(0, parse(cout) - parse(cin));
  const hh = Math.floor(diff / 3600);
  const mm = Math.floor((diff % 3600) / 60);
  return `${hh}h ${mm}m`;
}

// ── Session list display ──────────────────────────────────────
function SessionList({ sessions }) {
  if (!sessions || sessions.length === 0) return null;
  return (
    <div style={{ padding: "0 24px 18px" }}>
      <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 8 }}>
        Today's Sessions
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sessions.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px", borderRadius: 9,
            background: T.surface2, fontSize: 13,
          }}>
            <span style={{ fontWeight: 700, color: T.muted, minWidth: 22 }}>#{i + 1}</span>
            <span style={{ color: T.success, fontWeight: 600 }}>In: {s.in}</span>
            {s.out && (
              <>
                <span style={{ color: T.muted }}>→</span>
                <span style={{ color: T.danger, fontWeight: 600 }}>Out: {s.out}</span>
                <span style={{ marginLeft: "auto", color: T.primary, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {calcTotalHours(s.in, s.out)}
                </span>
              </>
            )}
            {!s.out && (
              <span style={{ marginLeft: "auto", padding: "2px 10px", borderRadius: 99, background: "#ede9fe", color: "#4f46e5", fontWeight: 600, fontSize: 11 }}>
                Active
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Check-In / Check-Out Action Card ─────────────────────────
function AttendanceActionCard({ sessions, onCheckIn, onCheckOut }) {
  const now = useLiveClock();

  const lastSession = sessions[sessions.length - 1];
  const isCurrentlyIn = lastSession && !lastSession.out;
  const firstCheckIn = sessions.length > 0 ? sessions[0].in : null;
  const lastCheckOut = sessions.length > 0 && sessions[sessions.length - 1].out
    ? sessions[sessions.length - 1].out : null;

  const elapsed = isCurrentlyIn ? calcElapsed(lastSession.in) : null;

  const statusLabel = sessions.length === 0
    ? "Not Checked In"
    : isCurrentlyIn
    ? "Currently Working"
    : "Checked Out";
  
  // Both buttons always enabled — Check In enabled when not currently in, Check Out enabled when currently in
  const canCheckIn  = !isCurrentlyIn;
  const canCheckOut = isCurrentlyIn;

  return (
    <Card style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
      {/* Header gradient bar */}
      <div style={{
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ color: "#c7d2fe", fontSize: 12, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 4 }}>
            Today's Attendance
          </div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>
            {formatTime(now)}
          </div>
          <div style={{ color: "#a5b4fc", fontSize: 13, marginTop: 2 }}>
            {TODAY_DATE.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.15)", borderRadius: 16,
          padding: "10px 20px", textAlign: "center",
        }}>
          <div style={{ color: "#c7d2fe", fontSize: 11, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase" }}>Status</div>
          <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginTop: 4 }}>{statusLabel}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>

        {/* Time info — shows FIRST check-in and LAST check-out */}
        <div style={{ display: "flex", gap: 16, flex: 1 }}>
          <div style={{ padding: "12px 18px", borderRadius: 12, background: T.surface2, flex: 1, minWidth: 110 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase", marginBottom: 6 }}>First Check In</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: firstCheckIn ? T.success : T.muted }}>
              {firstCheckIn || "—"}
            </div>
          </div>
          <div style={{ padding: "12px 18px", borderRadius: 12, background: T.surface2, flex: 1, minWidth: 110 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase", marginBottom: 6 }}>Last Check Out</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: lastCheckOut ? T.danger : T.muted }}>
              {lastCheckOut || "—"}
            </div>
          </div>
          <div style={{ padding: "12px 18px", borderRadius: 12, background: T.surface2, flex: 1, minWidth: 110 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase", marginBottom: 6 }}>
              {isCurrentlyIn ? "Elapsed" : sessions.length > 0 ? "Total Hours" : "Elapsed"}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.primary, fontVariantNumeric: "tabular-nums" }}>
              {isCurrentlyIn
                ? elapsed || "—"
                : firstCheckIn && lastCheckOut
                ? calcTotalHours(firstCheckIn, lastCheckOut)
                : "—"}
            </div>
          </div>
        </div>

        {/* Action buttons — both always interactive based on current state */}
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={onCheckIn}
            disabled={!canCheckIn}
            style={{
              padding: "12px 28px", borderRadius: 12, border: "none",
              cursor: canCheckIn ? "pointer" : "not-allowed",
              background: canCheckIn ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "#e2e8f0",
              color: canCheckIn ? "#fff" : "#94a3b8",
              fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
              transition: "all .2s",
              boxShadow: canCheckIn ? "0 4px 14px rgba(79,70,229,.35)" : "none",
              opacity: canCheckIn ? 1 : 0.6,
            }}
          >
            ✓ Check In
          </button>
          <button
            onClick={onCheckOut}
            disabled={!canCheckOut}
            style={{
              padding: "12px 28px", borderRadius: 12, border: "none",
              cursor: canCheckOut ? "pointer" : "not-allowed",
              background: canCheckOut ? "linear-gradient(135deg,#ef4444,#dc2626)" : "#e2e8f0",
              color: canCheckOut ? "#fff" : "#94a3b8",
              fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
              transition: "all .2s",
              boxShadow: canCheckOut ? "0 4px 14px rgba(239,68,68,.35)" : "none",
              opacity: canCheckOut ? 1 : 0.6,
            }}
          >
            ↩ Check Out
          </button>
        </div>
      </div>

      {/* Session list */}
      <SessionList sessions={sessions} />

      {/* Progress bar — shows while currently checked in */}
      {isCurrentlyIn && (
        <div style={{ padding: "0 24px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted, marginBottom: 6 }}>
            <span>Work progress (8h target)</span>
            <span style={{ fontWeight: 600, color: T.primary }}>{elapsed}</span>
          </div>
          <div style={{ height: 6, background: T.surface2, borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99,
              background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
              width: `${Math.min(100, (parseElapsedSecs(elapsed) / (8*3600)) * 100)}%`,
              transition: "width 1s linear",
            }} />
          </div>
        </div>
      )}
    </Card>
  );
}

// ── Mini Calendar ─────────────────────────────────────────────
function MiniCalendar({ date, onChange, view, holidaysMap = {} }) {
  const [nav, setNav] = useState(new Date(date));
  const year = nav.getFullYear(), month = nav.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selWeek = view === "weekly" ? getWeekDates(date).map(d => dateStr(d)) : [];
  const isSelMonth = date.getFullYear() === year && date.getMonth() === month;

  return (
    <Card style={{ padding: 16 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <button onClick={()=>{ const d=new Date(nav); d.setMonth(d.getMonth()-1); setNav(d); }} style={nb}>‹</button>
        <span style={{ fontSize:13, fontWeight:700 }}>{MONTH_NAMES[month]} {year}</span>
        <button onClick={()=>{ const d=new Date(nav); d.setMonth(d.getMonth()+1); setNav(d); }} style={nb}>›</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:4 }}>
        {["M","T","W","T","F","S","S"].map((d,i)=>(
          <div key={i} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:"#94a3b8" }}>{d}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
        {cells.map((day,i)=>{
          if (!day) return <div key={i}/>;
          const d = new Date(year, month, day);
          const ds = dateStr(d);
          const isToday = ds === TODAY_STR;
          const isSel   = isSelMonth && day===date.getDate() && view==="daily";
          const inWeek  = view==="weekly" && selWeek.includes(ds);
          const inMonth = view==="monthly" && isSelMonth;
          const active  = isSel || inWeek || inMonth;
          const holiday = getHoliday(ds, holidaysMap);
          return (
            <button key={i} onClick={()=>onChange(new Date(year,month,day))} style={{
              border:"none", cursor:"pointer", padding:"5px 0", borderRadius:7,
              fontSize:12, fontWeight: isToday?700:400,
              background: active?T.primary:isToday?T.primaryLight:holiday?"#fef9c3":"transparent",
              color:       active?"#fff":isToday?T.primary:holiday?"#854d0e":"#374151",
            }}>{day}</button>
          );
        })}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:10, fontSize:11, color:T.muted }}>
        <div style={{ width:10, height:10, borderRadius:3, background:"#fef9c3", border:"1px solid #ca8a04" }}/>
        <span>Holiday</span>
      </div>
    </Card>
  );
}
const nb = {
  border:"none", background:T.surface2, cursor:"pointer",
  width:26, height:26, borderRadius:7, fontSize:14, color:T.muted,
};

// ── Summary Cards ─────────────────────────────────────────────
function SummaryCards({ present, absent, late }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
      {[
        { label:"Present", value:present, icon:"✓",  iconBg:"#d1fae5", iconColor:T.success },
        { label:"Absent",  value:absent,  icon:"✕",  iconBg:"#fee2e2", iconColor:T.danger  },
        { label:"Late",    value:late,    icon:"⏰", iconBg:"#fef3c7", iconColor:T.warning },
      ].map(c=>(
        <Card key={c.label} style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:c.iconBg, color:c.iconColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700 }}>{c.icon}</div>
          <div>
            <div style={{ fontSize:28, fontWeight:700, lineHeight:1 }}>{c.value}</div>
            <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{c.label}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── Daily View ────────────────────────────────────────────────
function DailyView({ date, sessions, onCheckIn, onCheckOut, monthData, rec }) {
  const ds  = dateStr(date);
  const isToday = ds === TODAY_STR;

  const firstCheckIn  = sessions.length > 0 ? sessions[0].in : null;
  const lastCheckOut  = sessions.length > 0 && sessions[sessions.length-1].out ? sessions[sessions.length-1].out : null;
  const isCurrentlyIn = sessions.length > 0 && !sessions[sessions.length-1].out;

  if (!rec) {
    return (
      <Card style={{ padding:40, textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>📅</div>
        <div style={{ fontWeight:700, fontSize:16 }}>Loading...</div>
      </Card>
    );
  }
  if (rec.type === "weekend") {
    return (
      <Card style={{ padding:40, textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🏖️</div>
        <div style={{ fontWeight:700, fontSize:16 }}>Weekend</div>
        <div style={{ color:T.muted, fontSize:13, marginTop:4 }}>No attendance record for this day.</div>
      </Card>
    );
  }

  if (rec.type === "holiday") {
    const typeColor = rec.holidayType === "public" ? "#4f46e5" : rec.holidayType === "restricted" ? "#f59e0b" : "#06b6d4";
    const typeBg    = rec.holidayType === "public" ? "#ede9fe" : rec.holidayType === "restricted" ? "#fef3c7" : "#cffafe";
    return (
      <Card style={{ padding:40, textAlign:"center" }}>
        <div style={{ fontSize:44, marginBottom:12 }}>🎉</div>
        <div style={{ fontWeight:800, fontSize:18, fontFamily:"'Syne',sans-serif" }}>{rec.holidayName}</div>
        <div style={{ marginTop:8, display:"inline-block", padding:"4px 16px", borderRadius:99, background:typeBg, color:typeColor, fontSize:13, fontWeight:600, textTransform:"capitalize" }}>
          {rec.holidayType} Holiday
        </div>
        <div style={{ color:T.muted, fontSize:13, marginTop:12 }}>Office is closed. Enjoy your day off!</div>
      </Card>
    );
  }

  if (rec.type === "future") {
    return (
      <Card style={{ padding:40, textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>📅</div>
        <div style={{ fontWeight:700, fontSize:16 }}>Future Date</div>
        <div style={{ color:T.muted, fontSize:13, marginTop:4 }}>Attendance not yet recorded.</div>
      </Card>
    );
  }

  const wkdays  = (monthData || []).filter(d=>d.type!=="weekend"&&d.type!=="future"&&d.type!=="holiday");
  const present = wkdays.filter(d=>d.type==="present").length;
  const absent  = wkdays.filter(d=>d.type==="absent").length;
  const late    = wkdays.filter(d=>d.type==="late").length;

  const displayCheckIn  = isToday ? firstCheckIn  : rec.checkIn;
  const displayCheckOut = isToday ? lastCheckOut  : rec.checkOut;
  const displayStatus   = isToday
    ? (sessions.length > 0 ? "present" : "absent")
    : rec.type;

  return (
    <div>
      {isToday && (
        <AttendanceActionCard
          sessions={sessions}
          onCheckIn={onCheckIn}
          onCheckOut={onCheckOut}
        />
      )}

      <SummaryCards present={present} absent={absent} late={late}/>

      <Card style={{ padding:24 }}>
        <SectionTitle>Attendance Detail — {date.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</SectionTitle>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
          {[
            { label:"Status",     value:<StatusBadge status={displayStatus}/> },
            { label:"First Check In",   value: displayCheckIn  || "—" },
            { label:"Last Check Out",  value: displayCheckOut || "—" },
            { label:"Total Hours", value: isToday ? (firstCheckIn && lastCheckOut ? calcTotalHours(firstCheckIn, lastCheckOut) : "—") : rec.hours || "—" },
            { label:"Sessions Today", value: isToday ? `${sessions.length} session${sessions.length !== 1 ? "s" : ""}` : "—" },
            { label:"Department", value: "Engineering" },
          ].map(r=>(
            <div key={r.label} style={{ padding:"14px 18px", borderRadius:10, background:T.surface2 }}>
              <div style={{ fontSize:11, color:T.muted, fontWeight:600, letterSpacing:".4px", textTransform:"uppercase", marginBottom:6 }}>{r.label}</div>
              <div style={{ fontSize:16, fontWeight:600 }}>{r.value}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Weekly View ───────────────────────────────────────────────
function WeeklyView({ date, sessions, attByDate, holidaysMap }) {
  const firstCheckIn = sessions.length > 0 ? sessions[0].in : null;
  const lastCheckOut = sessions.length > 0 && sessions[sessions.length-1].out ? sessions[sessions.length-1].out : null;
  const isCurrentlyIn = sessions.length > 0 && !sessions[sessions.length-1].out;
  const checkedIn = sessions.length > 0;
  const checkedOut = !!lastCheckOut;

  const weekDates = useMemo(()=>getWeekDates(date),[date]);
  const days = useMemo(()=>weekDates.map(d=>{
    const ds = dateStr(d);
    const dow = d.getDay();
    if (dow===0||dow===6) return { date:d, type:"weekend" };
    const holiday = getHoliday(ds, holidaysMap);
    if (holiday) return { date:d, type:"holiday", holidayName:holiday.name || holiday.title };
    if (d > TODAY_DATE) return { date:d, type:"future" };
    if (ds === TODAY_STR) {
      const st = checkedOut ? "present" : checkedIn ? "present" : "absent";
      return { date:d, type:st, checkIn:firstCheckIn||null, checkOut:lastCheckOut||null,
        hours: lastCheckOut ? calcTotalHours(firstCheckIn, lastCheckOut) : null };
    }
    const rec = attByDate[ds];
    if (!rec) return { date:d, type:"absent", checkIn:null, checkOut:null, hours:null };
    const cin = rec.check_in || rec.check_in_time;
    const cout = rec.check_out || rec.check_out_time;
    return { date:d, type:(rec.status||"present").toLowerCase().includes("late")?"late":"present", checkIn:cin?String(cin).slice(0,5):null, checkOut:cout?String(cout).slice(0,5):null, hours:cin&&cout?"9.2h":null };
  }),[weekDates, checkedIn, firstCheckIn, checkedOut, lastCheckOut, attByDate, holidaysMap]);

  const workdays = days.filter(d=>d.type!=="weekend"&&d.type!=="future"&&d.type!=="holiday");
  const present  = workdays.filter(d=>d.type==="present").length;
  const absent   = workdays.filter(d=>d.type==="absent").length;
  const late     = workdays.filter(d=>d.type==="late").length;

  return (
    <div>
      <SummaryCards present={present} absent={absent} late={late}/>
      <Card style={{ overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:T.surface2 }}>
              {["Day","Date","Check In","Check Out","Hours","Status"].map(h=>(
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:T.muted, letterSpacing:".5px", borderBottom:`1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((d,i)=>(
              <tr key={i} style={{ borderBottom:`1px solid #f1f5f9`, background:dateStr(d.date)===TODAY_STR?"#f5f3ff":i%2===0?T.surface:T.surface2 }}>
                <td style={{ padding:"12px 16px", fontWeight:600, fontSize:14 }}>{DAY_LABELS[i]}</td>
                <td style={{ padding:"12px 16px", fontSize:14, color:T.muted }}>{d.date.getDate()} {MONTH_NAMES[d.date.getMonth()].slice(0,3)}</td>
                <td style={{ padding:"12px 16px", fontSize:14, fontWeight:500 }}>{d.checkIn||"—"}</td>
                <td style={{ padding:"12px 16px", fontSize:14, fontWeight:500 }}>{d.checkOut||"—"}</td>
                <td style={{ padding:"12px 16px", fontSize:14, fontWeight:700 }}>{d.hours||"—"}</td>
                <td style={{ padding:"12px 16px" }}>
                  {d.type==="weekend"||d.type==="future"
                    ? <span style={{ fontSize:12, color:T.muted, fontStyle:"italic" }}>{d.type}</span>
                    : d.type==="holiday"
                    ? <span style={{ fontSize:12, background:"#fef9c3", color:"#854d0e", padding:"3px 10px", borderRadius:99, fontWeight:600 }}>🎉 {d.holidayName}</span>
                    : <StatusBadge status={d.type}/>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Monthly View ──────────────────────────────────────────────
function MonthlyView({ date, sessions, monthData }) {
  const checkedIn = sessions.length > 0;
  const checkedOut = sessions.length > 0 && !!sessions[sessions.length-1].out;
  const data = monthData || [];
  const year = date.getFullYear(), month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells = [];
  for (let i=0;i<startOffset;i++) cells.push(null);
  data.forEach(d=>cells.push(d));
  while (cells.length%7!==0) cells.push(null);

  const workdays = data.filter(d=>d.type!=="weekend"&&d.type!=="future"&&d.type!=="holiday");
  const present  = workdays.filter(d=>d.type==="present").length;
  const absent   = workdays.filter(d=>d.type==="absent").length;
  const late     = workdays.filter(d=>d.type==="late").length;
  const rate     = workdays.length ? Math.round(((present+late)/workdays.length)*100) : 0;

  const bgMap    = { present:"#d1fae5", late:"#fef3c7", absent:"#fee2e2", weekend:"#f8fafc", future:"#f8fafc", holiday:"#fef9c3" };
  const colorMap = { present:"#065f46", late:"#92400e", absent:"#991b1b", weekend:"#cbd5e1", future:"#94a3b8", holiday:"#854d0e" };
  const labelMap = { present:"P", late:"L", absent:"A", holiday:"H" };

  return (
    <div>
      <SummaryCards present={present} absent={absent} late={late}/>
      <Card style={{ padding:"14px 20px", marginBottom:16, display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:T.muted, whiteSpace:"nowrap" }}>Monthly Attendance Rate</div>
        <div style={{ flex:1, background:T.surface2, borderRadius:99, height:9, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:99, width:`${rate}%`, background:`linear-gradient(90deg,${T.primary},${T.accent})`, transition:"width .5s ease" }}/>
        </div>
        <div style={{ fontSize:16, fontWeight:800, color:T.primary, minWidth:48 }}>{rate}%</div>
      </Card>

      <Card style={{ padding:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6, marginBottom:8 }}>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
            <div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".4px" }}>{d}</div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
          {cells.map((cell,i)=>{
            if (!cell) return <div key={i}/>;
            const isToday = cell.date && year===TODAY_DATE.getFullYear() && month===TODAY_DATE.getMonth() && cell.day===TODAY_DATE.getDate();
            return (
              <div key={i} style={{
                aspectRatio:"1", borderRadius:10,
                display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
                background: bgMap[cell.type]||"#f8fafc",
                color:      colorMap[cell.type]||"#94a3b8",
                fontSize:12, fontWeight:600,
                outline: isToday?`2px solid ${T.primary}`:"none", outlineOffset:1,
                border: cell.type==="future"?"1px dashed #e2e8f0":"none",
              }}>
                <span>{cell.day}</span>
                {cell.type!=="weekend"&&cell.type!=="future"&&(
                  <span style={{ fontSize:9, opacity:.75, textTransform:"uppercase" }}>
                    {labelMap[cell.type]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:16, marginTop:14, fontSize:12, color:T.muted, flexWrap:"wrap" }}>
          {[
            ["#d1fae5","#065f46","Present"],
            ["#fef3c7","#92400e","Late"],
            ["#fee2e2","#991b1b","Absent"],
            ["#fef9c3","#854d0e","Holiday"],
            ["#f8fafc","#cbd5e1","Weekend"],
          ].map(([bg,col,label])=>(
            <div key={label} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:14, height:14, borderRadius:4, background:bg, border:`1px solid ${col}44` }}/>
              {label}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────
export default function EmpAttendance() {
  const { employeeId } = useCurrentEmployee();
  const [view, setView] = useState("daily");
  const [date, setDate] = useState(new Date(TODAY_DATE));
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);

  // Sessions = [{in: "HH:MM:SS AM/PM", out: "HH:MM:SS AM/PM" | null}, ...]
  // - first session's `in` = first check-in (what admin sees as check_in)
  // - last completed session's `out` = last check-out (what admin sees as check_out)
  const [sessions, setSessions] = useState(() => {
    // Restore sessions from sessionStorage so tab switches don't lose live state
    try {
      const saved = sessionStorage.getItem("emp_sessions_today");
      const savedDate = sessionStorage.getItem("emp_sessions_date");
      if (saved && savedDate === TODAY_STR) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [toast, setToast] = useState(null);
  // hydratedRef: once set, backend data never overwrites local sessions
  const hydratedRef = useRef(false);

  // Persist sessions to sessionStorage on every change
  useEffect(() => {
    try {
      sessionStorage.setItem("emp_sessions_today", JSON.stringify(sessions));
      sessionStorage.setItem("emp_sessions_date", TODAY_STR);
    } catch {}
  }, [sessions]);

  // Clear stale sessionStorage if it's from a previous day
  useEffect(() => {
    try {
      const savedDate = sessionStorage.getItem("emp_sessions_date");
      if (savedDate && savedDate !== TODAY_STR) {
        sessionStorage.removeItem("emp_sessions_today");
        sessionStorage.removeItem("emp_sessions_date");
        setSessions([]);
        hydratedRef.current = false;
      }
    } catch {}
  }, []);

  const now = useLiveClock();

  useEffect(() => {
    attendanceService.getAttendance().then((d) => setAttendance(Array.isArray(d) ? d : []));
    holidayService.getHolidays().then((d) => setHolidays(Array.isArray(d) ? d : []));
  }, []);

  const holidaysMap = useMemo(() => {
    const m = {};
    holidays.forEach(h => { m[h.date || h.holiday_date || ""] = { name: h.name || h.title, type: h.type || "public" }; });
    return m;
  }, [holidays]);

  const myAttendance = useMemo(() =>
    employeeId ? attendance.filter(a => a.employee_id === employeeId) : attendance,
  [attendance, employeeId]);

  const monthData = useMemo(() =>
    buildMonthAttendanceFromAPI(date.getFullYear(), date.getMonth(), myAttendance, holidaysMap),
  [date, myAttendance, holidaysMap]);

  const rec = monthData.find(d => d.day === date.getDate());
  const attByDate = useMemo(() => {
    const m = {};
    myAttendance.forEach(a => { m[(a.date||"").slice(0,10)] = a; });
    return m;
  }, [myAttendance]);

  // Hydrate sessions from today's existing attendance record (runs only once)
  const todayAtt = myAttendance.find(a => (a.date||"").slice(0,10) === TODAY_STR);
  useEffect(() => {
    // Only hydrate if we have not done so yet AND there are no sessions in storage
    if (hydratedRef.current) return;
    if (!todayAtt) return;
    // Mark as hydrated immediately so subsequent getAttendance refreshes don't overwrite
    hydratedRef.current = true;
    // If sessionStorage already restored sessions, don't overwrite them
    const hasStoredSessions = sessions.length > 0;
    if (hasStoredSessions) return;
    const cin  = todayAtt.check_in  || todayAtt.check_in_time  || null;
    const cout = todayAtt.check_out || todayAtt.check_out_time || null;
    if (cin) {
      setSessions([{ in: cin, out: cout || null }]);
    }
  }, [todayAtt?.id]);

  const isCurrentlyIn = sessions.length > 0 && !sessions[sessions.length - 1].out;

  async function handleCheckIn() {
    if (!employeeId || isCurrentlyIn) return;
    const t = formatTime(now);
    try {
      if (sessions.length === 0) {
        // First check-in of the day — create the attendance record
        await attendanceService.checkIn({ employee_id: employeeId, date: TODAY_STR, check_in: t });
      } else {
        // Re-check-in (returning from break) — backend check_in stays as first time
        // Silently attempt; backend may reject a duplicate, that's acceptable
        try {
          await attendanceService.checkIn({ employee_id: employeeId, date: TODAY_STR, check_in: sessions[0].in });
        } catch (_) {}
      }
      // Mark hydrated so getAttendance refresh won't overwrite this new open session
      hydratedRef.current = true;
      setSessions(prev => [...prev, { in: t, out: null }]);
      showToast("✓ Checked in at " + t, "success");
      // Refresh in background — hydration guard prevents stomping
      attendanceService.getAttendance().then((d) => setAttendance(Array.isArray(d) ? d : []));
    } catch (err) {
      showToast(err.message || "Check-in failed", "error");
    }
  }

  async function handleCheckOut() {
    if (!employeeId || !isCurrentlyIn) return;
    const t = formatTime(now);
    try {
      // Always send checkout — backend stores/overwrites check_out so last checkout wins
      await attendanceService.checkOut({ employee_id: employeeId, date: TODAY_STR, check_out: t });
      setSessions(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], out: t };
        // Immediately persist to sessionStorage so tab-switch sees checkout
        try {
          sessionStorage.setItem("emp_sessions_today", JSON.stringify(updated));
          sessionStorage.setItem("emp_sessions_date", TODAY_STR);
        } catch {}
        return updated;
      });
      hydratedRef.current = true;
      showToast("↩ Checked out at " + t, "info");
      attendanceService.getAttendance().then((d) => setAttendance(Array.isArray(d) ? d : []));
    } catch (err) {
      showToast(err.message || "Check-out failed", "error");
    }
  }

  function showToast(msg, type) {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function shift(dir) {
    const d = new Date(date);
    if (view==="daily")   d.setDate(d.getDate()  + dir);
    if (view==="weekly")  d.setDate(d.getDate()  + dir*7);
    if (view==="monthly") d.setMonth(d.getMonth()+ dir);
    setDate(d);
  }

  function periodLabel() {
    if (view==="daily")   return date.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
    if (view==="weekly") {
      const wd = getWeekDates(date);
      return `${wd[0].toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${wd[6].toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}`;
    }
    return date.toLocaleDateString("en-GB",{month:"long",year:"numeric"});
  }

  return (
    <div style={{ display:"flex", gap:20, position:"relative" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", top:80, right:28, zIndex:999,
          padding:"12px 22px", borderRadius:12,
          background: toast.type==="success" ? "#d1fae5" : toast.type==="error" ? "#fee2e2" : "#dbeafe",
          color:       toast.type==="success" ? "#065f46"  : toast.type==="error" ? "#991b1b" : "#1e40af",
          fontWeight:600, fontSize:14, boxShadow:"0 4px 16px rgba(0,0,0,.12)",
          animation:"fadeIn .2s ease",
        }}>{toast.msg}</div>
      )}

      {/* Mini calendar */}
      <div style={{ width:220, flexShrink:0 }}>
        <MiniCalendar date={date} onChange={setDate} view={view} holidaysMap={holidaysMap}/>
      </div>

      {/* Content */}
      <div style={{ flex:1, minWidth:0 }}>
        {/* Controls */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:4, gap:2 }}>
            {["daily","weekly","monthly"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{
                padding:"7px 22px", borderRadius:9, border:"none", cursor:"pointer",
                fontSize:13, fontWeight:600,
                background: view===v?T.primary:"transparent",
                color:      view===v?"#fff":T.muted,
                textTransform:"capitalize", fontFamily:"'DM Sans',sans-serif",
              }}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={()=>shift(-1)} style={navBtn}>‹</button>
            <div style={{ padding:"6px 18px", borderRadius:9, background:T.surface, border:`1px solid ${T.border}`, fontSize:13, fontWeight:600, color:T.text, minWidth:240, textAlign:"center" }}>{periodLabel()}</div>
            <button onClick={()=>shift(1)}  style={navBtn}>›</button>
            <button onClick={()=>setDate(new Date(TODAY_DATE))} style={{ padding:"6px 14px", borderRadius:9, border:`1.5px solid ${T.primary}`, background:T.primaryLight, color:T.primary, cursor:"pointer", fontSize:12, fontWeight:700 }}>Today</button>
          </div>
        </div>

        {view==="daily"   && <DailyView   date={date} sessions={sessions} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} monthData={monthData} rec={rec}/>}
        {view==="weekly"  && <WeeklyView  date={date} sessions={sessions} attByDate={attByDate} holidaysMap={holidaysMap}/>}
        {view==="monthly" && <MonthlyView date={date} sessions={sessions} monthData={monthData}/>}
      </div>
    </div>
  );
}

const navBtn = {
  border:`1px solid ${T.border}`, background:T.surface, cursor:"pointer",
  width:34, height:34, borderRadius:9, fontSize:16, color:T.muted,
  display:"flex", alignItems:"center", justifyContent:"center",
};
