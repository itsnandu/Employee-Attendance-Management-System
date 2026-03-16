// src/pages/employee/EmpDashboard.jsx
import { useState, useRef, useEffect } from "react";
import { T, Card, SectionTitle, Badge, Avatar, Btn } from "../../components/employee/EmpUI";
import {
  buildMonthAttendanceFromAPI, dateStr, MONTH_NAMES, DAY_LABELS,
} from "../../utils/EmployeeData";
import useCurrentEmployee from "../../hooks/useCurrentEmployee";
import attendanceService from "../../services/attendanceService";
import holidayService from "../../services/holidayService";
import announcementService from "../../services/announcementService";
import leaveService from "../../services/leaveService";

const PRIORITIES  = ["high", "medium", "low"];

// ─────────────────────────────────────────────────────────────────
// Inline Calendar Picker Component
// ─────────────────────────────────────────────────────────────────
function CalendarPicker({ value, onChange }) {
  const [viewYear,  setViewYear]  = useState(value ? value.getFullYear()  : TODAY.getFullYear());
  const [viewMonth, setViewMonth] = useState(value ? value.getMonth()     : TODAY.getMonth());

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const isSelected = (d) =>
    d && value &&
    d === value.getDate() &&
    viewMonth === value.getMonth() &&
    viewYear  === value.getFullYear();

  const isToday = (d) =>
    d &&
    d === TODAY.getDate() &&
    viewMonth === TODAY.getMonth() &&
    viewYear  === TODAY.getFullYear();

  const isPast = (d) => {
    if (!d) return false;
    return new Date(viewYear, viewMonth, d) < new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
  };

  return (
    <div style={{
      border: `1.5px solid ${T.border}`, borderRadius: 14,
      overflow: "hidden", background: "#fff",
      boxShadow: "0 6px 20px rgba(0,0,0,.08)",
    }}>
      {/* Month navigation header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "13px 16px 11px",
        background: `linear-gradient(120deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
      }}>
        <button onClick={prevMonth} style={{
          background: "rgba(255,255,255,.2)", border: "none", borderRadius: 8,
          width: 30, height: 30, cursor: "pointer", color: "#fff", fontSize: 17,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.32)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.2)"}
        >‹</button>

        <div style={{
          fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14,
          color: "#fff", letterSpacing: ".4px",
        }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </div>

        <button onClick={nextMonth} style={{
          background: "rgba(255,255,255,.2)", border: "none", borderRadius: 8,
          width: 30, height: 30, cursor: "pointer", color: "#fff", fontSize: 17,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.32)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.2)"}
        >›</button>
      </div>

      {/* Day-of-week labels */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7,1fr)",
        background: T.surface2, padding: "7px 10px 5px",
      }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{
            textAlign: "center", fontSize: 10, fontWeight: 700,
            color: d === "Su" || d === "Sa" ? "#c4cfe0" : T.muted,
            textTransform: "uppercase", letterSpacing: ".3px",
          }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7,1fr)",
        padding: "8px 10px 12px", gap: 3,
      }}>
        {cells.map((d, i) => {
          const past     = isPast(d);
          const selected = isSelected(d);
          const today    = isToday(d);
          const colIdx   = i % 7;
          const weekend  = colIdx === 0 || colIdx === 6;

          let bg    = "transparent";
          let color = T.text;
          let border = "2px solid transparent";
          let cursor = d && !past ? "pointer" : "default";

          if (selected)       { bg = T.primary;     color = "#fff"; }
          else if (today)     { bg = T.primaryLight; color = T.primary; border = `2px solid ${T.primary}`; }
          else if (past && d) { color = "#d1d5db"; }
          else if (weekend && d) { color = "#94a3b8"; }

          return (
            <div
              key={i}
              onClick={() => { if (d && !past) onChange(new Date(viewYear, viewMonth, d)); }}
              style={{
                textAlign: "center", lineHeight: "32px", height: 32,
                borderRadius: 8, fontSize: 13,
                fontWeight: selected ? 700 : today ? 600 : 400,
                background: bg, color, border, cursor,
                transition: "all .12s", userSelect: "none",
              }}
              onMouseEnter={e => {
                if (d && !past && !selected) {
                  e.currentTarget.style.background = `${T.primary}18`;
                  e.currentTarget.style.color = T.primary;
                }
              }}
              onMouseLeave={e => {
                if (d && !past && !selected) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = today ? T.primary : weekend ? "#94a3b8" : T.text;
                }
              }}
            >
              {d || ""}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${T.border}`,
        padding: "8px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: T.surface2,
      }}>
        <button
          onClick={() => { setViewMonth(TODAY.getMonth()); setViewYear(TODAY.getFullYear()); }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 12, color: T.primary, fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
          }}
        >↩ Current month</button>
        {value && (
          <button
            onClick={() => onChange(null)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12, color: T.danger, fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
            }}
          >✕ Clear</button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
function fmtFull(d)  { return d ? d.toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" }) : ""; }
function fmtShort(d) { return d ? d.toLocaleDateString("en-IN", { day:"numeric", month:"short" }) : ""; }

// ─────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────
export default function EmpDashboard({ setPage }) {
  const today  = new Date();
  const { employee } = useCurrentEmployee();
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ title: "", dueDate: null, priority: "medium" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    attendanceService.getAttendance().then((d) => setAttendance(Array.isArray(d) ? d : []));
    holidayService.getHolidays().then((d) => setHolidays(Array.isArray(d) ? d : []));
    announcementService.getAnnouncements().then((d) => setAnnouncements(Array.isArray(d) ? d : []));
    leaveService.getLeaves().then((d) => setLeaves(Array.isArray(d) ? d : []));
  }, []);

  const openModal  = () => { setForm({ title: "", dueDate: null, priority: "medium" }); setFormError(""); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setFormError(""); };

  const handleAddTask = () => {
    if (!form.title.trim()) { setFormError("Task name is required."); return; }
    if (!form.dueDate)      { setFormError("Please pick a due date from the calendar."); return; }
    setTasks(prev => [...prev, {
      id: Date.now(),
      title: form.title.trim(),
      due: fmtShort(form.dueDate),
      done: false,
      priority: form.priority,
    }]);
    closeModal();
  };

  const holidaysMap = {};
  holidays.forEach(h => { holidaysMap[h.date || h.holiday_date || ""] = { name: h.name || h.title, type: h.type || "public" }; });
  const myAttendance = (employee?.id ? attendance.filter(a => a.employee_id === employee.id) : attendance);
  const monthData = buildMonthAttendanceFromAPI(today.getFullYear(), today.getMonth(), myAttendance, holidaysMap);
  const todayRec = monthData.find(d => d.day === today.getDate());
  const status = todayRec?.type || "absent";
  const workdays  = monthData.filter(d => d.type !== "weekend" && d.type !== "future");
  const present   = workdays.filter(d => d.type === "present").length;
  const late      = workdays.filter(d => d.type === "late").length;
  const absent    = workdays.filter(d => d.type === "absent").length;
  const attRate   = workdays.length ? Math.round(((present + late) / workdays.length) * 100) : 0;

  const statusMap = {
    present: { label: "Checked In",    color: T.success, msg: "You're checked in today. Have a productive day!" },
    late:    { label: "Late Check-in",  color: T.warning, msg: "You checked in late today."                      },
    absent:  { label: "Not Checked In", color: T.danger,  msg: "You haven't checked in yet today."               },
  };
  const tod = statusMap[status];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Welcome banner */}
      <div style={{
        background: `linear-gradient(120deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
        borderRadius: 16, padding: "28px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 4px 24px rgba(79,70,229,.28)", position: "relative", overflow: "hidden",
      }}>
        {[["-30px","-30px",200],["80px","-70px",140]].map(([r,t,s],i)=>(
          <div key={i} style={{ position:"absolute", right:r, top:t, width:s, height:s,
            borderRadius:"50%", background:"rgba(255,255,255,.06)" }}/>
        ))}
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginBottom: 4 }}>{today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, color: "#fff", marginBottom: 6 }}>
            Good {today.getHours() < 12 ? "morning" : today.getHours() < 17 ? "afternoon" : "evening"}, {(employee?.name || "Employee").split(" ")[0]}! 👋
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,.8)" }}>{tod.msg}</div>
        </div>
        <div style={{
          background: "rgba(255,255,255,.14)", borderRadius: 14,
          padding: "18px 26px", textAlign: "center",
          backdropFilter: "blur(6px)", position: "relative", minWidth: 140,
        }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", marginBottom: 4, letterSpacing: ".5px", textTransform: "uppercase" }}>Today's Status</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{tod.label}</div>
          {status !== "absent" && <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 4 }}>Check-in: 09:00</div>}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {[
          { label: "Attendance Rate",  value: `${attRate}%`, icon: "📈", color: T.primary,  bg: T.primaryLight, sub: "This month" },
          { label: "Days Present",     value: present,        icon: "✓",  color: T.success,  bg: "#d1fae5",      sub: "March 2026" },
          { label: "Leaves Remaining", value: [12,10,15,4].reduce((a,b)=>a+b,0) - (employee?.id ? leaves.filter(l=>l.employee_id===employee.id&&l.status==="approved").reduce((a,l)=>a+(l.days||0),0) : 0),
                                                              icon: "🗓", color: T.accent,   bg: "#cffafe",      sub: "All types" },
          { label: "Pending Tasks",    value: tasks.filter(t=>!t.done).length,
                                                              icon: "📋", color: T.warning,  bg: "#fef3c7",      sub: "Action needed" },
        ].map(s => (
          <Card key={s.label} style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 30, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.text, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{s.sub}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* 2-col grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Attendance summary */}
        <Card style={{ padding: 20 }}>
          <SectionTitle>{MONTH_NAMES[today.getMonth()]} {today.getFullYear()} — Attendance</SectionTitle>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {[
              { label:"Present", val:present, color:T.success },
              { label:"Late",    val:late,    color:T.warning },
              { label:"Absent",  val:absent,  color:T.danger  },
            ].map(s => (
              <div key={s.label} style={{ flex:1, background:`${s.color}10`, borderRadius:10, padding:"10px 0", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background:T.surface2, borderRadius:99, height:8, overflow:"hidden", marginBottom:6 }}>
            <div style={{ height:"100%", borderRadius:99, width:`${attRate}%`, background:`linear-gradient(90deg,${T.primary},${T.accent})` }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:T.muted }}>
            <span>Attendance rate</span>
            <strong style={{ color:T.primary }}>{attRate}%</strong>
          </div>
          <Btn onClick={()=>setPage("attendance")} variant="ghost" style={{ marginTop:14, width:"100%" }}>
            View Full Attendance →
          </Btn>
        </Card>

        {/* Leave balance */}
        <Card style={{ padding: 20 }}>
          <SectionTitle>Leave Balance</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { type: "Casual Leave",  total: 12, used: employee?.id ? leaves.filter(l=>l.employee_id===employee.id&&l.leave_type==="Casual Leave"&&l.status==="approved").reduce((a,l)=>a+(l.days||0),0) : 0, color: "#4f46e5" },
              { type: "Sick Leave",    total: 10, used: employee?.id ? leaves.filter(l=>l.employee_id===employee.id&&l.leave_type==="Sick Leave"&&l.status==="approved").reduce((a,l)=>a+(l.days||0),0) : 0, color: "#06b6d4" },
              { type: "Earned Leave", total: 15, used: employee?.id ? leaves.filter(l=>l.employee_id===employee.id&&l.leave_type==="Earned Leave"&&l.status==="approved").reduce((a,l)=>a+(l.days||0),0) : 0, color: "#10b981" },
              { type: "Comp Off",     total: 4,  used: employee?.id ? leaves.filter(l=>l.employee_id===employee.id&&l.leave_type==="Comp Off"&&l.status==="approved").reduce((a,l)=>a+(l.days||0),0) : 0, color: "#f59e0b" },
            ].map(l => {
              const pct = Math.round(((l.total - l.used) / l.total) * 100);
              return (
                <div key={l.type}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
                    <span style={{ fontWeight:500 }}>{l.type}</span>
                    <span style={{ color:T.muted, fontSize:12 }}>{l.total - l.used} / {l.total} left</span>
                  </div>
                  <div style={{ background:T.surface2, borderRadius:99, height:7, overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:99, width:`${pct}%`, background:l.color }}/>
                  </div>
                </div>
              );
            })}
          </div>
          <Btn onClick={()=>setPage("leaves")} variant="ghost" style={{ marginTop:14, width:"100%" }}>
            Apply for Leave →
          </Btn>
        </Card>

        {/* Announcements */}
        <Card style={{ padding: 20 }}>
          <SectionTitle>Announcements</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {(announcements.length ? announcements : []).slice(0,3).map(a => {
              const tag = a.tag || "HR";
              const color = { HR:"#4f46e5", Holiday:"#10b981", Policy:"#f59e0b", Wellness:"#06b6d4", IT:"#8b5cf6", Event:"#ec4899" }[tag] || "#4f46e5";
              return (
              <div key={a.id} style={{
                padding:"10px 14px", borderRadius:10, background:T.surface2,
                borderLeft:`3px solid ${color}`,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontWeight:600, fontSize:13 }}>{a.title}</span>
                  <Badge label={tag} color={color} bg={`${color}18`}/>
                </div>
                <div style={{ fontSize:12, color:T.muted, lineHeight:1.5 }}>{a.msg||a.message}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>{a.date ? new Date(a.date).toLocaleDateString("en-IN") : ""}</div>
              </div>
            );})}
            {!announcements.length && <div style={{ fontSize:13, color:T.muted }}>No announcements</div>}
          </div>
        </Card>

        {/* Tasks */}
        <Card style={{ padding: 20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <SectionTitle style={{ margin: 0 }}>My Tasks</SectionTitle>
            <button onClick={openModal} style={{
              display:"flex", alignItems:"center", gap:5,
              background:T.primary, color:"#fff",
              border:"none", borderRadius:8,
              padding:"6px 14px", fontSize:13, fontWeight:600,
              cursor:"pointer", lineHeight:1,
            }}>
              <span style={{ fontSize:18, lineHeight:1, marginTop:-1 }}>+</span> Add Task
            </button>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {tasks.map(t => (
              <div key={t.id} style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"10px 14px", borderRadius:10,
                background:t.done?T.surface2:T.surface,
                border:`1px solid ${T.border}`, opacity:t.done?.6:1,
              }}>
                <input type="checkbox" checked={t.done}
                  onChange={()=>setTasks(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))}
                  style={{ width:16, height:16, accentColor:T.primary, cursor:"pointer" }}
                />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, textDecoration:t.done?"line-through":"none", color:t.done?T.muted:T.text }}>{t.title}</div>
                  <div style={{ fontSize:11, color:T.muted }}>Due {t.due}</div>
                </div>
                <span style={{
                  fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99,
                  background:t.priority==="high"?"#fee2e2":t.priority==="medium"?"#fef3c7":"#f1f5f9",
                  color:t.priority==="high"?T.danger:t.priority==="medium"?T.warning:T.muted,
                }}>{t.priority}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Add Task Modal ── */}
      {showModal && (
        <div
          onClick={closeModal}
          style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,0.42)",
            display:"flex", alignItems:"center", justifyContent:"center",
            zIndex:1000, padding:16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background:"#fff", borderRadius:20,
              padding:"26px 24px 22px",
              width:"100%", maxWidth:420,
              boxShadow:"0 16px 56px rgba(0,0,0,.22)",
              display:"flex", flexDirection:"column", gap:16,
              maxHeight:"90vh", overflowY:"auto",
            }}
          >
            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:18, fontWeight:800, color:T.text, fontFamily:"'Syne',sans-serif" }}>Add New Task</span>
              <button onClick={closeModal} style={{
                background:T.surface2, border:"none", fontSize:16, color:T.muted,
                cursor:"pointer", width:30, height:30, borderRadius:8,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>✕</button>
            </div>

            {/* Task name */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".4px" }}>Task Name *</label>
              <input
                autoFocus
                placeholder="Enter task name"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleAddTask()}
                style={{
                  border:`1.5px solid ${T.border}`, borderRadius:9,
                  padding:"10px 13px", fontSize:14, outline:"none", color:T.text,
                  fontFamily:"'DM Sans',sans-serif", transition:"border-color .2s",
                }}
                onFocus={e => e.target.style.borderColor = T.primary}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>

            {/* Due date — calendar */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <label style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".4px" }}>Due Date *</label>
                {form.dueDate && (
                  <span style={{
                    fontSize:12, fontWeight:700, color:T.primary,
                    background:T.primaryLight, borderRadius:6,
                    padding:"3px 10px",
                  }}>📅 {fmtFull(form.dueDate)}</span>
                )}
              </div>
              <CalendarPicker
                value={form.dueDate}
                onChange={d => setForm(f => ({ ...f, dueDate: d }))}
              />
            </div>

            {/* Priority */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".4px" }}>Priority</label>
              <div style={{ display:"flex", gap:8 }}>
                {PRIORITIES.map(p => {
                  const sel   = form.priority === p;
                  const bg    = p==="high"?"#fee2e2":p==="medium"?"#fef3c7":"#f1f5f9";
                  const color = p==="high"?T.danger:p==="medium"?T.warning:T.muted;
                  return (
                    <button key={p} onClick={() => setForm({ ...form, priority: p })} style={{
                      flex:1, padding:"9px 0", borderRadius:9, cursor:"pointer", fontSize:13,
                      background: sel ? bg    : "#f9f9f9",
                      color:      sel ? color : T.muted,
                      border:     sel ? `2px solid ${color}` : `1.5px solid ${T.border}`,
                      fontWeight: sel ? 700 : 500,
                      fontFamily:"'DM Sans',sans-serif", transition:"all .15s",
                    }}>{p}</button>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            {formError && (
              <div style={{ fontSize:13, color:T.danger, background:"#fff0f0", borderRadius:8, padding:"8px 12px" }}>
                {formError}
              </div>
            )}

            {/* Footer */}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
              <button onClick={closeModal} style={{
                background:"#f1f5f9", color:T.muted, border:"none", borderRadius:9,
                padding:"10px 22px", fontSize:14, fontWeight:600, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",
              }}>Cancel</button>
              <button onClick={handleAddTask} style={{
                background:T.primary, color:"#fff", border:"none", borderRadius:9,
                padding:"10px 24px", fontSize:14, fontWeight:700, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",
                boxShadow:`0 4px 14px ${T.primary}44`,
              }}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}