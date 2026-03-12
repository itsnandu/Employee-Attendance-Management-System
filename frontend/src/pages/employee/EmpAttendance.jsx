// src/pages/employee/EmpAttendance.jsx
import { useState, useMemo, useEffect, useRef } from "react";
import { T, Card, SectionTitle, StatusBadge } from "../../components/employee/EmpUI";
import {
  buildMonthAttendance, getWeekDates, getMyStatus, getHoliday,
  dateStr, MONTH_NAMES, DAY_LABELS,
} from "../../utils/EmployeeData";

// ── Today's date string (fixed to app date for demo) ──────────
const TODAY_DATE = new Date(2026, 2, 5); // March 5, 2026
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

// ── Check-In / Check-Out Action Card ─────────────────────────
function AttendanceActionCard({ checkedIn, checkInTime, checkedOut, checkOutTime, onCheckIn, onCheckOut }) {
  const now = useLiveClock();
  const elapsed = checkedIn && !checkedOut ? calcElapsed(checkInTime) : null;

  const statusLabel = !checkedIn ? "Not Checked In" : checkedOut ? "Checked Out" : "Currently Working";
  const statusColor = !checkedIn ? T.muted : checkedOut ? T.success : "#4f46e5";
  const statusBg    = !checkedIn ? T.surface2 : checkedOut ? "#d1fae5" : "#ede9fe";

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

        {/* Time info */}
        <div style={{ display: "flex", gap: 16, flex: 1 }}>
          <div style={{ padding: "12px 18px", borderRadius: 12, background: T.surface2, flex: 1, minWidth: 110 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase", marginBottom: 6 }}>Check In</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: checkedIn ? T.success : T.muted }}>
              {checkInTime || "—"}
            </div>
          </div>
          <div style={{ padding: "12px 18px", borderRadius: 12, background: T.surface2, flex: 1, minWidth: 110 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase", marginBottom: 6 }}>Check Out</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: checkedOut ? T.danger : T.muted }}>
              {checkOutTime || "—"}
            </div>
          </div>
          <div style={{ padding: "12px 18px", borderRadius: 12, background: T.surface2, flex: 1, minWidth: 110 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase", marginBottom: 6 }}>
              {checkedOut ? "Total Hours" : "Elapsed"}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.primary, fontVariantNumeric: "tabular-nums" }}>
              {checkedOut ? checkOutTime ? calcTotalHours(checkInTime, checkOutTime) : "—" : elapsed || "—"}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={onCheckIn}
            disabled={checkedIn}
            style={{
              padding: "12px 28px", borderRadius: 12, border: "none", cursor: checkedIn ? "not-allowed" : "pointer",
              background: checkedIn ? "#e2e8f0" : "linear-gradient(135deg,#4f46e5,#7c3aed)",
              color: checkedIn ? "#94a3b8" : "#fff",
              fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
              transition: "all .2s", boxShadow: checkedIn ? "none" : "0 4px 14px rgba(79,70,229,.35)",
            }}
          >
            ✓ Check In
          </button>
          <button
            onClick={onCheckOut}
            disabled={!checkedIn || checkedOut}
            style={{
              padding: "12px 28px", borderRadius: 12, border: "none",
              cursor: (!checkedIn || checkedOut) ? "not-allowed" : "pointer",
              background: (!checkedIn || checkedOut) ? "#e2e8f0" : "linear-gradient(135deg,#ef4444,#dc2626)",
              color: (!checkedIn || checkedOut) ? "#94a3b8" : "#fff",
              fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
              transition: "all .2s", boxShadow: (!checkedIn || checkedOut) ? "none" : "0 4px 14px rgba(239,68,68,.35)",
            }}
          >
            ↩ Check Out
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {checkedIn && !checkedOut && (
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
  const diff = parse(cout) - parse(cin);
  const hh = Math.floor(diff / 3600);
  const mm = Math.floor((diff % 3600) / 60);
  return `${hh}h ${mm}m`;
}

// ── Mini Calendar ─────────────────────────────────────────────
function MiniCalendar({ date, onChange, view }) {
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
          const holiday = getHoliday(ds);
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
      {/* Legend */}
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
function DailyView({ date, checkedIn, checkInTime, checkedOut, checkOutTime, onCheckIn, onCheckOut }) {
  const ds  = dateStr(date);
  const isToday = ds === TODAY_STR;

  const data = buildMonthAttendance(date.getFullYear(), date.getMonth());
  const rec  = data.find(d => d.day === date.getDate());

  if (!rec || rec.type === "weekend") {
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

  const month = buildMonthAttendance(date.getFullYear(), date.getMonth());
  const wkdays  = month.filter(d=>d.type!=="weekend"&&d.type!=="future"&&d.type!=="holiday");
  const present = wkdays.filter(d=>d.type==="present").length;
  const absent  = wkdays.filter(d=>d.type==="absent").length;
  const late    = wkdays.filter(d=>d.type==="late").length;

  // For today, use live check-in/out; for past days use mock data
  const displayCheckIn  = isToday ? checkInTime  : rec.checkIn;
  const displayCheckOut = isToday ? checkOutTime : rec.checkOut;
  const displayStatus   = isToday
    ? (checkedOut ? "present" : checkedIn ? "present" : "absent")
    : rec.type;

  return (
    <div>
      {/* Show action card only for today */}
      {isToday && (
        <AttendanceActionCard
          checkedIn={checkedIn}
          checkInTime={checkInTime}
          checkedOut={checkedOut}
          checkOutTime={checkOutTime}
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
            { label:"Check In",   value: displayCheckIn  || "—" },
            { label:"Check Out",  value: displayCheckOut || "—" },
            { label:"Work Hours", value: isToday && checkedOut ? calcTotalHours(checkInTime, checkOutTime) : rec.hours || "—" },
            { label:"Department", value: "Engineering" },
            { label:"Employee ID",value: "EMP-0042" },
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
function WeeklyView({ date, checkedIn, checkInTime, checkedOut, checkOutTime }) {
  const weekDates = useMemo(()=>getWeekDates(date),[date]);
  const days = useMemo(()=>weekDates.map(d=>{
    const ds = dateStr(d);
    const dow = d.getDay();
    if (dow===0||dow===6) return { date:d, type:"weekend" };
    const holiday = getHoliday(ds);
    if (holiday) return { date:d, type:"holiday", holidayName:holiday.name };
    if (d > TODAY_DATE) return { date:d, type:"future" };
    if (ds === TODAY_STR) {
      const st = checkedOut ? "present" : checkedIn ? "present" : "absent";
      return { date:d, type:st, checkIn:checkInTime||null, checkOut:checkOutTime||null,
        hours: checkedOut ? calcTotalHours(checkInTime, checkOutTime) : null };
    }
    const st = getMyStatus(ds);
    return { date:d, type:st, checkIn:st==="absent"?null:st==="late"?"09:45":"09:00", checkOut:st==="absent"?null:"18:10", hours:st==="absent"?null:"9.2h" };
  }),[weekDates, checkedIn, checkInTime, checkedOut, checkOutTime]);

  const workdays = days.filter(d=>d.type!=="weekend"&&d.type!=="future"&&d.type!=="holiday");
  const present  = workdays.filter(d=>d.type==="present").length;
  const absent   = workdays.filter(d=>d.type==="absent").length;
  const late     = workdays.filter(d=>d.type==="late").length;

  const bgMap    = { present:"#d1fae5", late:"#fef3c7", absent:"#fee2e2", weekend:"#f8fafc", future:"#f8fafc", holiday:"#fef9c3" };
  const colorMap = { present:"#065f46", late:"#92400e", absent:"#991b1b", weekend:T.muted,   future:T.muted,   holiday:"#854d0e" };

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
function MonthlyView({ date, checkedIn, checkedOut }) {
  const year = date.getFullYear(), month = date.getMonth();
  const data = useMemo(()=>buildMonthAttendance(year, month),[year, month]);

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
        {/* Legend */}
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
  const [view, setView] = useState("daily");
  const [date, setDate] = useState(new Date(TODAY_DATE));

  // Check-in / check-out state
  const [checkedIn,    setCheckedIn]    = useState(false);
  const [checkInTime,  setCheckInTime]  = useState(null);
  const [checkedOut,   setCheckedOut]   = useState(false);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [toast,        setToast]        = useState(null);

  const now = useLiveClock();

  function handleCheckIn() {
    const t = formatTime(now);
    setCheckedIn(true);
    setCheckInTime(t);
    showToast("✓ Checked in at " + t, "success");
  }

  function handleCheckOut() {
    const t = formatTime(now);
    setCheckedOut(true);
    setCheckOutTime(t);
    showToast("↩ Checked out at " + t, "info");
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
          background: toast.type==="success" ? "#d1fae5" : "#dbeafe",
          color:       toast.type==="success" ? "#065f46"  : "#1e40af",
          fontWeight:600, fontSize:14, boxShadow:"0 4px 16px rgba(0,0,0,.12)",
          animation:"fadeIn .2s ease",
        }}>{toast.msg}</div>
      )}

      {/* Mini calendar */}
      <div style={{ width:220, flexShrink:0 }}>
        <MiniCalendar date={date} onChange={setDate} view={view}/>
      </div>

      {/* Content */}
      <div style={{ flex:1, minWidth:0 }}>
        {/* Controls */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:12 }}>
          {/* View tabs */}
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
          {/* Period nav */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={()=>shift(-1)} style={navBtn}>‹</button>
            <div style={{ padding:"6px 18px", borderRadius:9, background:T.surface, border:`1px solid ${T.border}`, fontSize:13, fontWeight:600, color:T.text, minWidth:240, textAlign:"center" }}>{periodLabel()}</div>
            <button onClick={()=>shift(1)}  style={navBtn}>›</button>
            <button onClick={()=>setDate(new Date(TODAY_DATE))} style={{ padding:"6px 14px", borderRadius:9, border:`1.5px solid ${T.primary}`, background:T.primaryLight, color:T.primary, cursor:"pointer", fontSize:12, fontWeight:700 }}>Today</button>
          </div>
        </div>

        {view==="daily"   && <DailyView   date={date} checkedIn={checkedIn} checkInTime={checkInTime} checkedOut={checkedOut} checkOutTime={checkOutTime} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut}/>}
        {view==="weekly"  && <WeeklyView  date={date} checkedIn={checkedIn} checkInTime={checkInTime} checkedOut={checkedOut} checkOutTime={checkOutTime}/>}
        {view==="monthly" && <MonthlyView date={date} checkedIn={checkedIn} checkedOut={checkedOut}/>}
      </div>
    </div>
  );
}

const navBtn = {
  border:`1px solid ${T.border}`, background:T.surface, cursor:"pointer",
  width:34, height:34, borderRadius:9, fontSize:16, color:T.muted,
  display:"flex", alignItems:"center", justifyContent:"center",
};