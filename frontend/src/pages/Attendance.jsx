import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import attendanceService from "../services/attendanceService";
import employeeService from "../services/employeeService";
import { getInitials } from "../utils/helpers";

const COLORS = ["#4f46e5", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6"];

// ── Reusable Employee Dropdown + Search ───────────────────────
function EmployeeDropdown({ employees = [], value, onChange, label = "All Employees" }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const selected = value ? employees.find(e => e.id === value) : null;
  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.dept.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 220 }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 14px", borderRadius: 10, cursor: "pointer",
          border: "1.5px solid", width: "100%",
          background: open ? "#fff" : "#fff",
          borderColor: open ? "#4f46e5" : "#e2e8f0",
          boxShadow: open ? "0 0 0 3px rgba(79,70,229,.12)" : "none",
          fontFamily: "'DM Sans',sans-serif", transition: "all .2s",
        }}
      >
        {selected ? (
          <>
            <div style={{
              width: 26, height: 26, borderRadius: 99, flexShrink: 0,
              background: selected.color, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700,
            }}>{selected.initials}</div>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#0f172a", textAlign: "left" }}>{selected.name}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, color: selected.color, background: selected.color + "18",
              borderRadius: 99, padding: "2px 8px",
            }}>{selected.dept}</span>
          </>
        ) : (
          <>
            <div style={{
              width: 26, height: 26, borderRadius: 99, flexShrink: 0,
              background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13,
            }}>👥</div>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "#94a3b8", textAlign: "left" }}>{label}</span>
          </>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {selected && (
            <div
              onClick={e => { e.stopPropagation(); onChange(null); }}
              style={{ padding: 2, borderRadius: 4, color: "#94a3b8", display: "flex", cursor: "pointer" }}
            >
              <X size={13} />
            </div>
          )}
          <ChevronDown size={15} color="#94a3b8" style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }} />
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#fff", borderRadius: 12, zIndex: 100,
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 8px 30px rgba(0,0,0,.12)",
          overflow: "hidden", animation: "dropIn .15s ease",
        }}>
          {/* Search inside dropdown */}
          <div style={{ padding: "8px 10px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search employee…"
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "7px 10px 7px 30px", border: "1.5px solid #e2e8f0",
                  borderRadius: 8, fontSize: 12, outline: "none",
                  fontFamily: "'DM Sans',sans-serif", color: "#0f172a", background: "#f8fafc",
                }}
                onFocus={e => e.target.style.borderColor = "#4f46e5"}
                onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
              />
              {query && (
                <button onClick={() => setQuery("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 0 }}>
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Option: All */}
          <div
            onClick={() => { onChange(null); setOpen(false); setQuery(""); }}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
              cursor: "pointer", background: !value ? "#f5f3ff" : "#fff",
              borderBottom: "1px solid #f8fafc",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
            onMouseLeave={e => e.currentTarget.style.background = !value ? "#f5f3ff" : "#fff"}
          >
            <div style={{ width: 28, height: 28, borderRadius: 99, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👥</div>
            <span style={{ fontSize: 13, fontWeight: !value ? 700 : 500, color: !value ? "#4f46e5" : "#0f172a" }}>All Employees</span>
            {!value && <span style={{ marginLeft: "auto", fontSize: 11, color: "#4f46e5", fontWeight: 700 }}>✓</span>}
          </div>

          {/* Employee options */}
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "14px 12px", fontSize: 13, color: "#94a3b8", textAlign: "center" }}>No employees found</div>
            ) : (
              filtered.map(e => (
                <div
                  key={e.id}
                  onClick={() => { onChange(e.id); setOpen(false); setQuery(""); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                    cursor: "pointer", background: value === e.id ? "#f5f3ff" : "#fff",
                    borderBottom: "1px solid #f8fafc",
                  }}
                  onMouseEnter={el => el.currentTarget.style.background = "#f5f3ff"}
                  onMouseLeave={el => el.currentTarget.style.background = value === e.id ? "#f5f3ff" : "#fff"}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 99, flexShrink: 0,
                    background: e.color, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700,
                  }}>{e.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: value === e.id ? 700 : 500, color: value === e.id ? "#4f46e5" : "#0f172a" }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{e.dept}</div>
                  </div>
                  {value === e.id && <span style={{ fontSize: 11, color: "#4f46e5", fontWeight: 700 }}>✓</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Reusable Search Bar ────────────────────────────────────────
function SearchBar({ value, onChange, placeholder = "Search employees…" }) {
  return (
    <div style={{ position: "relative", minWidth: 220 }}>
      <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: "8px 36px 8px 34px",
          border: "1.5px solid #e2e8f0", borderRadius: 10,
          fontSize: 13, outline: "none", background: "#fff",
          fontFamily: "'DM Sans',sans-serif", color: "#0f172a",
          transition: "border-color .2s, box-shadow .2s",
        }}
        onFocus={e => { e.target.style.borderColor = "#4f46e5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,.1)"; }}
        onBlur={e  => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
      />
      {value && (
        <button onClick={() => onChange("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 0 }}>
          <X size={13} />
        </button>
      )}
    </div>
  );
}

const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

function dateStr(d) { return d.toISOString().slice(0, 10); }

function getHours(cin, cout) {
  if (!cin || !cout) return null;
  const p = (s) => s.split(":").slice(0, 3).map(Number);
  const [h1, m1] = p(String(cin));
  const [h2, m2] = p(String(cout));
  return (((h2 || 0) * 60 + (m2 || 0) - (h1 || 0) * 60 - (m1 || 0)) / 60).toFixed(1) + "h";
}

function buildDayRecords(employees, attendanceData, ds) {
  const byEmp = (attendanceData || []).filter((a) => a.date === ds);
  const lookup = {};
  byEmp.forEach((a) => { lookup[a.employee_id] = a; });
  return (employees || []).map((e) => {
    const att = lookup[e.id];
    const status = att ? (att.status || "present").toLowerCase() : "absent";
    const cin = att?.check_in || null;
    const cout = att?.check_out || null;
    return {
      ...e,
      dept: e.dept || e.department || "",
      initials: e.initials || getInitials(e.name),
      color: e.color || COLORS[e.id % COLORS.length],
      status,
      checkIn: cin,
      checkOut: cout,
      hours: getHours(cin, cout),
    };
  });
}

function getWeekDates(date) {
  const d = new Date(date);
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => { const x = new Date(mon); x.setDate(mon.getDate() + i); return x; });
}

const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// ── Avatar ─────────────────────────────────────────────────────
function Avatar({ initials, color, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "18", color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
      border: `1.5px solid ${color}44`,
    }}>{initials}</div>
  );
}

// ── Status Badge ───────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    present: { bg: "#d1fae5", color: "#065f46" },
    late:    { bg: "#fef3c7", color: "#92400e" },
    absent:  { bg: "#fee2e2", color: "#991b1b" },
  };
  const s = map[status] || map.absent;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "3px 12px", borderRadius: 99,
      fontSize: 12, fontWeight: 600, letterSpacing: ".4px",
    }}>{status}</span>
  );
}

// ── MINI CALENDAR ──────────────────────────────────────────────
function MiniCalendar({ date, onChange, view }) {
  const [nav, setNav] = useState(new Date(date));
  const year = nav.getFullYear(), month = nav.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const today = new Date();
  const selWeekDates = view === "weekly" ? getWeekDates(date).map(d => dateStr(d)) : [];
  const isSelectedMonth = date.getFullYear() === year && date.getMonth() === month;

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid #e2e8f0", padding: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={() => { const d = new Date(nav); d.setMonth(d.getMonth()-1); setNav(d); }} style={navBtn}>‹</button>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{MONTH_NAMES[month]} {year}</span>
        <button onClick={() => { const d = new Date(nav); d.setMonth(d.getMonth()+1); setNav(d); }} style={navBtn}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#94a3b8", padding: "2px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const d = new Date(year, month, day);
          const ds = dateStr(d);
          const isToday = today.getFullYear()===year && today.getMonth()===month && today.getDate()===day;
          const isSel = isSelectedMonth && day === date.getDate() && view === "daily";
          const inWeek = view === "weekly" && selWeekDates.includes(ds);
          const inMonth = view === "monthly" && isSelectedMonth;
          const active = isSel || inWeek || inMonth;
          return (
            <button key={i} onClick={() => onChange(new Date(year, month, day))} style={{
              border: "none", cursor: "pointer", padding: "5px 0",
              borderRadius: 7, fontSize: 12, fontWeight: isToday ? 700 : 400,
              background: active ? "#4f46e5" : isToday ? "#e0e7ff" : "transparent",
              color: active ? "#fff" : isToday ? "#4f46e5" : "#374151",
            }}>{day}</button>
          );
        })}
      </div>
    </div>
  );
}

const navBtn = {
  border: "none", background: "#f1f5f9", cursor: "pointer",
  width: 26, height: 26, borderRadius: 7, fontSize: 14, color: "#64748b",
  display: "flex", alignItems: "center", justifyContent: "center",
};

// inject dropIn animation once
if (typeof document !== "undefined" && !document.getElementById("att-dropdown-anim")) {
  const s = document.createElement("style");
  s.id = "att-dropdown-anim";
  s.textContent = `@keyframes dropIn { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }`;
  document.head.appendChild(s);
}

// ── DAILY VIEW ─────────────────────────────────────────────────
function DailyView({ date, employees, attendanceData }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const ds = dateStr(date);
  const records = useMemo(() => buildDayRecords(employees, attendanceData, ds), [ds, employees, attendanceData]);
  const present = records.filter(r => r.status === "present").length;
  const absent  = records.filter(r => r.status === "absent").length;
  const late    = records.filter(r => r.status === "late").length;
  const filtered = records
    .filter(r => filter === "All" || r.status === filter.toLowerCase())
    .filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.dept.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Present", value: present, icon: "✓", iconBg: "#d1fae5", iconColor: "#10b981" },
          { label: "Absent",  value: absent,  icon: "✕", iconBg: "#fee2e2", iconColor: "#ef4444" },
          { label: "Late",    value: late,    icon: "⏰", iconBg: "#fef3c7", iconColor: "#f59e0b" },
        ].map(c => (
          <div key={c.label} style={{
            background: "#fff", borderRadius: 14, padding: "16px 20px",
            border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,.05)",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: c.iconBg, color: c.iconColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700,
            }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or department…" />
        <div style={{ display: "flex", gap: 6 }}>
          {["All","Present","Absent","Late"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "8px 16px", borderRadius: 99, border: "1.5px solid",
              cursor: "pointer", fontSize: 13, fontWeight: 500,
              background: filter === f ? "#4f46e5" : "#fff",
              color:      filter === f ? "#fff" : "#64748b",
              borderColor:filter === f ? "#4f46e5" : "#e2e8f0",
              transition: "all .2s",
            }}>{f}</button>
          ))}
        </div>
        {(search || filter !== "All") && (
          <span style={{ fontSize: 12, color: "#94a3b8" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["EMPLOYEE","DEPARTMENT","CHECK IN","CHECK OUT","HOURS","STATUS"].map(h => (
                <th key={h} style={{
                  padding: "12px 16px", textAlign: "left", fontSize: 11,
                  fontWeight: 700, color: "#64748b", letterSpacing: ".6px",
                  borderBottom: "1px solid #e2e8f0",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}
                style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafbfc"}
              >
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials={r.initials} color={r.color} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 14 }}>{r.dept}</td>
                <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500 }}>{r.checkIn || "—"}</td>
                <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500 }}>{r.checkOut || "—"}</td>
                <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700 }}>{r.hours || "—"}</td>
                <td style={{ padding: "12px 16px" }}><Badge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getStatusFromAttendance(attendanceData, empId, ds) {
  const att = (attendanceData || []).find((a) => a.employee_id === empId && a.date === ds);
  return att ? (att.status || "present").toLowerCase() : "absent";
}

// ── WEEKLY VIEW ────────────────────────────────────────────────
function WeeklyView({ date, employees, attendanceData }) {
  const weekDates = useMemo(() => getWeekDates(date), [date]);
  const today = dateStr(new Date());
  const [search, setSearch] = useState("");

  const empList = (employees || []).map((e) => ({
    ...e,
    dept: e.dept || e.department || "",
    initials: e.initials || getInitials(e.name),
    color: e.color || COLORS[e.id % COLORS.length],
  }));

  const data = useMemo(() => empList.map((e) => ({
    ...e,
    days: weekDates.map((d) => ({ date: d, status: getStatusFromAttendance(attendanceData, e.id, dateStr(d)) })),
  })), [weekDates, empList, attendanceData]);

  const filteredData = data.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.dept.toLowerCase().includes(search.toLowerCase())
  );

  const allStatuses = data.flatMap(e => e.days.map(d => d.status));
  const totalPresent = allStatuses.filter(s => s === "present").length;
  const totalLate    = allStatuses.filter(s => s === "late").length;
  const totalAbsent  = allStatuses.filter(s => s === "absent").length;

  const statusBg    = { present: "#d1fae5", late: "#fef3c7", absent: "#fee2e2" };
  const statusColor = { present: "#065f46", late: "#92400e", absent: "#991b1b" };

  return (
    <div>
      {/* Week summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Present", value: totalPresent, icon: "✓", iconBg: "#d1fae5", iconColor: "#10b981" },
          { label: "Absent",  value: totalAbsent,  icon: "✕", iconBg: "#fee2e2", iconColor: "#ef4444" },
          { label: "Late",    value: totalLate,    icon: "⏰", iconBg: "#fef3c7", iconColor: "#f59e0b" },
        ].map(c => (
          <div key={c.label} style={{
            background: "#fff", borderRadius: 14, padding: "16px 20px",
            border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,.05)",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: c.iconBg, color: c.iconColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700,
            }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{c.label} this week</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or department…" />
        {search && (
          <span style={{ fontSize: 12, color: "#94a3b8" }}>
            {filteredData.length} of {data.length} employees
          </span>
        )}
      </div>

      {/* Grid */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".6px", borderBottom: "1px solid #e2e8f0", minWidth: 160 }}>EMPLOYEE</th>
              {weekDates.map((d, i) => {
                const isToday = dateStr(d) === today;
                return (
                  <th key={i} style={{ padding: "10px 8px", textAlign: "center", borderBottom: "1px solid #e2e8f0", minWidth: 72 }}>
                    <div style={{
                      display: "inline-flex", flexDirection: "column", alignItems: "center",
                      background: isToday ? "#4f46e5" : "transparent",
                      color: isToday ? "#fff" : "#64748b",
                      borderRadius: 8, padding: "4px 10px",
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px" }}>{DAY_LABELS[i]}</span>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{d.getDate()}</span>
                    </div>
                  </th>
                );
              })}
              <th style={{ padding: "12px 12px", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".6px", borderBottom: "1px solid #e2e8f0" }}>RATE</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((emp, ei) => {
              const presentDays = emp.days.filter(d => d.status !== "absent").length;
              const rate = Math.round((presentDays / 7) * 100);
              return (
                <tr key={emp.id}
                  style={{ borderBottom: "1px solid #f1f5f9", background: ei % 2 === 0 ? "#fff" : "#fafbfc" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
                  onMouseLeave={e => e.currentTarget.style.background = ei % 2 === 0 ? "#fff" : "#fafbfc"}
                >
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar initials={emp.initials} color={emp.color} size={32} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</span>
                    </div>
                  </td>
                  {emp.days.map((d, di) => (
                    <td key={di} style={{ padding: "10px 8px", textAlign: "center" }}>
                      <div style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 32, height: 32, borderRadius: 8,
                        background: statusBg[d.status], color: statusColor[d.status],
                        fontSize: 12, fontWeight: 700,
                      }}>
                        {d.status === "present" ? "P" : d.status === "late" ? "L" : "A"}
                      </div>
                    </td>
                  ))}
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                      <div style={{ height: 6, width: 48, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 99, width: `${rate}%`,
                          background: rate >= 80 ? "#10b981" : rate >= 60 ? "#f59e0b" : "#ef4444",
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: rate >= 80 ? "#10b981" : rate >= 60 ? "#f59e0b" : "#ef4444" }}>{rate}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12, color: "#64748b" }}>
        {[["P","present","#d1fae5","#065f46"],["L","late","#fef3c7","#92400e"],["A","absent","#fee2e2","#991b1b"]].map(([code,label,bg,col]) => (
          <div key={code} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: bg, color: col, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11 }}>{code}</div>
            <span style={{ textTransform: "capitalize" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MONTHLY VIEW ───────────────────────────────────────────────
function MonthlyView({ date, employees, attendanceData }) {
  const year = date.getFullYear(), month = date.getMonth();
  const today = new Date();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const empList = (employees || []).map((e) => ({
    ...e,
    dept: e.dept || e.department || "",
    initials: e.initials || getInitials(e.name),
    color: e.color || COLORS[e.id % COLORS.length],
  }));

  const [selEmp, setSelEmp] = useState(empList[0]?.id || null);
  const emp = empList.find((e) => e.id === selEmp);

  const stats = useMemo(() => {
    let present = 0, late = 0, absent = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(year, month, d).getDay();
      if (dow === 0 || dow === 6) continue;
      const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const s = getStatusFromAttendance(attendanceData, selEmp, ds);
      if (s === "present") present++;
      else if (s === "late") late++;
      else absent++;
    }
    return { present, late, absent };
  }, [selEmp, year, month, daysInMonth, attendanceData]);

  function getCellStatus(day) {
    if (!day) return null;
    const d = new Date(year, month, day);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) return "weekend";
    if (d > today) return "future";
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return getStatusFromAttendance(attendanceData, selEmp, ds);
  }

  const cellBg    = { present: "#d1fae5", late: "#fef3c7", absent: "#fee2e2", weekend: "#f8fafc", future: "#f8fafc" };
  const cellColor = { present: "#065f46", late: "#92400e", absent: "#991b1b", weekend: "#cbd5e1", future: "#94a3b8" };

  return (
    <div>
      {/* Employee dropdown selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <EmployeeDropdown
          employees={empList}
          value={selEmp}
          onChange={(id) => id !== null && setSelEmp(id)}
          label="Select Employee"
        />
        {emp && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 99,
              background: emp.color, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700,
            }}>{emp.initials}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{emp.name}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{emp.dept}</div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Days Present", value: stats.present, icon: "✓", iconBg: "#d1fae5", iconColor: "#10b981" },
          { label: "Absent Days",  value: stats.absent,  icon: "✕", iconBg: "#fee2e2", iconColor: "#ef4444" },
          { label: "Late Arrivals",value: stats.late,    icon: "⏰", iconBg: "#fef3c7", iconColor: "#f59e0b" },
        ].map(c => (
          <div key={c.label} style={{
            background: "#fff", borderRadius: 14, padding: "14px 18px",
            border: "1px solid #e2e8f0",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: c.iconBg, color: c.iconColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 700,
            }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 6 }}>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: ".4px", textTransform: "uppercase", padding: "2px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {cells.map((day, i) => {
            const status = getCellStatus(day);
            const isToday = day && year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
            return (
              <div key={i} style={{
                aspectRatio: "1", borderRadius: 9,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", fontSize: 12, fontWeight: 600,
                background: day ? cellBg[status] || "#f8fafc" : "transparent",
                color: day ? cellColor[status] || "#94a3b8" : "transparent",
                outline: isToday ? `2px solid #4f46e5` : "none",
                outlineOffset: 1,
                border: status === "future" ? "1px dashed #e2e8f0" : "none",
              }}>
                {day && <span>{day}</span>}
                {day && status !== "weekend" && status !== "future" && (
                  <span style={{ fontSize: 9, opacity: .75, textTransform: "uppercase", letterSpacing: ".3px" }}>
                    {status === "present" ? "P" : status === "late" ? "L" : "A"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "#64748b", flexWrap: "wrap" }}>
        {[["#d1fae5","#065f46","Present"],["#fef3c7","#92400e","Late"],["#fee2e2","#991b1b","Absent"],["#f8fafc","#cbd5e1","Weekend"]].map(([bg,col,label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: bg, border: `1px solid ${col}44` }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN EXPORT ────────────────────────────────────────────────
export default function AttendanceContent() {
  const [view, setView] = useState("daily");
  const [date, setDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    employeeService.getAll().then((e) => e && setEmployees(Array.isArray(e) ? e : []));
    attendanceService.getAttendance().then((a) => a && setAttendanceData(Array.isArray(a) ? a : []));
  }, []);

  const empList = (employees || []).map((e) => ({
    ...e,
    dept: e.department || e.dept || "",
    initials: getInitials(e.name),
    color: COLORS[e.id % COLORS.length],
  }));

  function prevPeriod() {
    const d = new Date(date);
    if (view === "daily")   d.setDate(d.getDate() - 1);
    if (view === "weekly")  d.setDate(d.getDate() - 7);
    if (view === "monthly") d.setMonth(d.getMonth() - 1);
    setDate(d);
  }
  function nextPeriod() {
    const d = new Date(date);
    if (view === "daily")   d.setDate(d.getDate() + 1);
    if (view === "weekly")  d.setDate(d.getDate() + 7);
    if (view === "monthly") d.setMonth(d.getMonth() + 1);
    setDate(d);
  }
  function periodLabel() {
    if (view === "daily")   return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (view === "weekly") {
      const wd = getWeekDates(date);
      return `${wd[0].toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${wd[6].toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}`;
    }
    return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  }

  return (
    <div style={{ display: "flex", gap: 20, padding: 24, fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Left: Mini Calendar */}
      <div style={{ width: 220, flexShrink: 0 }}>
        <MiniCalendar date={date} onChange={setDate} view={view} />
      </div>

      {/* Right: Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* View switcher + period nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 4, gap: 2 }}>
            {["daily","weekly","monthly"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "7px 22px", borderRadius: 9, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600,
                background: view === v ? "#4f46e5" : "transparent",
                color:      view === v ? "#fff" : "#64748b",
                textTransform: "capitalize",
              }}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
            ))}
          </div>

          {/* Period nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={prevPeriod} style={{ ...navBtn, width: 32, height: 32, borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff" }}>‹</button>
            <div style={{
              padding: "6px 18px", borderRadius: 9, background: "#fff",
              border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 600,
              color: "#0f172a", minWidth: 220, textAlign: "center",
            }}>{periodLabel()}</div>
            <button onClick={nextPeriod} style={{ ...navBtn, width: 32, height: 32, borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff" }}>›</button>
            <button onClick={() => setDate(new Date())} style={{
              padding: "6px 14px", borderRadius: 9,
              border: "1.5px solid #4f46e5", background: "#ede9fe",
              color: "#4f46e5", cursor: "pointer", fontSize: 12, fontWeight: 700,
            }}>Today</button>
          </div>
        </div>

        {view === "daily"   && <DailyView   date={date} employees={empList} attendanceData={attendanceData} />}
        {view === "weekly"  && <WeeklyView  date={date} employees={empList} attendanceData={attendanceData} />}
        {view === "monthly" && <MonthlyView date={date} employees={empList} attendanceData={attendanceData} />}
      </div>
    </div>
  );
}