// src/pages/employee/EmpWFH.jsx
import { useState, useMemo } from "react";
import { T, Card, SectionTitle, Badge, Modal, Btn } from "../../components/employee/EmpUI";
import { MONTH_NAMES } from "../../utils/EmployeeData";

const TODAY = new Date(2026, 2, 5); // 5 March 2026

// ── Initial WFH records ─────────────────────────────────────────
const INITIAL_WFH = [
  { id: 1,  date: "2026-01-07", reason: "Deep focus sprint",                  status: "approved" },
  { id: 2,  date: "2026-01-14", reason: "Home internet maintenance at office", status: "approved" },
  { id: 3,  date: "2026-01-21", reason: "Dentist appointment morning",         status: "approved" },
  { id: 4,  date: "2026-02-04", reason: "Team sync via video call",            status: "approved" },
  { id: 5,  date: "2026-02-11", reason: "Personal errand in afternoon",        status: "rejected" },
  { id: 6,  date: "2026-02-18", reason: "Project milestone delivery",          status: "approved" },
  { id: 7,  date: "2026-02-25", reason: "Focus on quarterly report",           status: "approved" },
  { id: 8,  date: "2026-03-04", reason: "Avoid commute during rally",          status: "approved" },
  { id: 9,  date: "2026-03-11", reason: "Standup remote + deliverable",        status: "pending"  },
  { id: 10, date: "2026-03-18", reason: "Design review session online",        status: "pending"  },
];

const STATUS_META = {
  approved: { label: "Approved", dot: "#10b981", bg: "#d1fae5", color: "#065f46" },
  pending:  { label: "Pending",  dot: "#f59e0b", bg: "#fef3c7", color: "#92400e" },
  rejected: { label: "Rejected", dot: "#ef4444", bg: "#fee2e2", color: "#991b1b" },
};

function fmt(ds) {
  return new Date(ds + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

function daysUntil(ds) {
  return Math.ceil((new Date(ds + "T00:00:00") - TODAY) / 86400000);
}

// ── Mini Month Calendar ──────────────────────────────────────────
function MonthCalendar({ year, month, wfhDates }) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay + 6) % 7; // Mon-start
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: i >= 5 ? "#cbd5e1" : T.muted, padding: "3px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const wfh = wfhDates[ds];
          const isToday = ds === "2026-03-05";
          const dow = (i) % 7;
          const isWeekend = dow >= 5;
          return (
            <div key={i} title={wfh ? `WFH – ${wfh.reason}` : ""} style={{
              textAlign: "center", padding: "5px 2px", borderRadius: 6, fontSize: 11, fontWeight: wfh || isToday ? 700 : 400,
              background: wfh ? (wfh.status === "approved" ? "#d1fae5" : wfh.status === "pending" ? "#fef3c7" : "#fee2e2")
                               : isToday ? T.primaryLight : "transparent",
              color: wfh ? STATUS_META[wfh.status].color : isToday ? T.primary : isWeekend ? "#cbd5e1" : T.text,
              cursor: wfh ? "help" : "default",
              border: isToday ? `1.5px solid ${T.primary}` : "1.5px solid transparent",
            }}>{d}</div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default function EmpWFH() {
  const [wfhList, setWfhList] = useState(INITIAL_WFH);
  const [viewMonth, setViewMonth] = useState(2); // 0-indexed, March = 2
  const [viewYear]  = useState(2026);
  const [filter, setFilter]     = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ date: "", reason: "" });
  const [formError, setFormError] = useState("");
  const [success, setSuccess]     = useState(false);
  const [detail, setDetail]       = useState(null);

  // Build a date->wfh map for calendar
  const wfhDates = useMemo(() => {
    const m = {};
    wfhList.forEach(w => { m[w.date] = w; });
    return m;
  }, [wfhList]);

  // Stats
  const approved = wfhList.filter(w => w.status === "approved").length;
  const pending  = wfhList.filter(w => w.status === "pending").length;
  const rejected = wfhList.filter(w => w.status === "rejected").length;

  // This month's count
  const thisMonthApproved = wfhList.filter(w => {
    const d = new Date(w.date + "T00:00:00");
    return d.getFullYear() === 2026 && d.getMonth() === 2 && w.status === "approved";
  }).length;

  // Filtered list sorted newest first
  const filtered = useMemo(() => {
    const list = filter === "all" ? wfhList : wfhList.filter(w => w.status === filter);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [wfhList, filter]);

  function openModal()  { setForm({ date: "", reason: "" }); setFormError(""); setSuccess(false); setShowModal(true); }
  function closeModal() { setShowModal(false); }

  function handleSubmit() {
    if (!form.date)              { setFormError("Please select a date."); return; }
    if (!form.reason.trim())     { setFormError("Please provide a reason."); return; }
    const chosen = new Date(form.date + "T00:00:00");
    if (chosen <= TODAY)         { setFormError("Date must be in the future."); return; }
    const dow = chosen.getDay();
    if (dow === 0 || dow === 6)  { setFormError("Cannot apply WFH on weekends."); return; }
    if (wfhDates[form.date])     { setFormError("You already have a WFH request for this date."); return; }
    setWfhList(prev => [...prev, { id: Date.now(), date: form.date, reason: form.reason.trim(), status: "pending" }]);
    setSuccess(true);
    setTimeout(closeModal, 1600);
  }

  function cancelRequest(id) {
    setWfhList(prev => prev.filter(w => w.id !== id));
  }

  const minDate = new Date(TODAY.getTime() + 86400000).toISOString().split("T")[0];

  // calendar months to show (prev, current, next)
  const calMonths = [
    { year: viewYear, month: ((viewMonth - 1 + 12) % 12), label: MONTH_NAMES[(viewMonth - 1 + 12) % 12] },
    { year: viewYear, month: viewMonth,                    label: MONTH_NAMES[viewMonth] },
    { year: viewYear, month: (viewMonth + 1) % 12,        label: MONTH_NAMES[(viewMonth + 1) % 12] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Banner ── */}
      <div style={{
        background: "linear-gradient(120deg, #0891b2 0%, #0e7490 100%)",
        borderRadius: 16, padding: "24px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 4px 24px rgba(8,145,178,.28)", position: "relative", overflow: "hidden",
      }}>
        {[[-20,-20,180],[60,-60,120]].map(([r,t,s],i)=>(
          <div key={i} style={{ position:"absolute", right:r, top:t, width:s, height:s, borderRadius:"50%", background:"rgba(255,255,255,.07)" }}/>
        ))}
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", marginBottom: 4, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase" }}>Work From Home</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 6 }}>🏠 WFH Management</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,.8)" }}>
            This month: <strong style={{ color: "#fff" }}>{thisMonthApproved} approved</strong> WFH days · Policy allows <strong style={{ color:"#fff" }}>2 days/week</strong>
          </div>
        </div>
        <button onClick={openModal} style={{
          background: "#fff", color: "#0891b2", border: "none", borderRadius: 10,
          padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", flexShrink: 0, position: "relative",
        }}>+ New WFH Request</button>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {[
          { label: "Total Requests", value: wfhList.length, icon: "📋", iconBg: "#ede9fe", iconColor: "#4f46e5" },
          { label: "Approved",       value: approved,        icon: "✅", iconBg: "#d1fae5", iconColor: "#10b981" },
          { label: "Pending",        value: pending,         icon: "⏳", iconBg: "#fef3c7", iconColor: "#f59e0b" },
          { label: "Rejected",       value: rejected,        icon: "❌", iconBg: "#fee2e2", iconColor: "#ef4444" },
        ].map(c => (
          <Card key={c.label} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{c.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Monthly Calendars ── */}
      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <SectionTitle style={{ margin: 0 }}>Monthly WFH Calendar</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Legend */}
            {[["Approved","#10b981","#d1fae5"],["Pending","#f59e0b","#fef3c7"],["Rejected","#ef4444","#fee2e2"]].map(([l,c,bg]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:T.muted }}>
                <div style={{ width:10, height:10, borderRadius:3, background:bg, border:`1px solid ${c}` }}/>
                {l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {calMonths.map(({ year, month, label }) => (
            <div key={label}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10, textAlign: "center" }}>
                {label} {year}
              </div>
              <MonthCalendar year={year} month={month} wfhDates={wfhDates} />
            </div>
          ))}
        </div>
      </Card>

      {/* ── Request List ── */}
      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <SectionTitle style={{ margin: 0 }}>My WFH Requests</SectionTitle>
          <div style={{ display: "flex", gap: 6 }}>
            {[["all","All"],["approved","Approved"],["pending","Pending"],["rejected","Rejected"]].map(([val, lbl]) => (
              <button key={val} onClick={() => setFilter(val)} style={{
                padding: "6px 14px", borderRadius: 8, border: "1.5px solid",
                cursor: "pointer", fontSize: 12, fontWeight: 600,
                background:  filter === val ? T.primary : T.surface,
                color:       filter === val ? "#fff"    : T.muted,
                borderColor: filter === val ? T.primary : T.border,
              }}>{lbl}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: T.muted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <div style={{ fontWeight: 600 }}>No requests found</div>
            </div>
          )}
          {filtered.map(w => {
            const meta = STATUS_META[w.status];
            const du   = daysUntil(w.date);
            const isPast  = du < 0;
            const isToday = du === 0;
            return (
              <div key={w.id} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "14px 16px", borderRadius: 12,
                border: `1px solid ${T.border}`, background: T.surface,
                borderLeft: `4px solid ${meta.dot}`,
                opacity: isPast && w.status === "rejected" ? .55 : 1,
              }}>
                {/* Date badge */}
                <div style={{
                  minWidth: 56, textAlign: "center", padding: "8px 4px", borderRadius: 10,
                  background: meta.bg, color: meta.color, flexShrink: 0,
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>
                    {new Date(w.date + "T00:00:00").getDate()}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                    {new Date(w.date + "T00:00:00").toLocaleString("en-IN", { month: "short" })}
                  </div>
                </div>
                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{fmt(w.date)}</span>
                    <span style={{ padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: meta.bg, color: meta.color }}>{meta.label}</span>
                    {isToday && <span style={{ padding:"2px 10px", borderRadius:99, fontSize:11, fontWeight:600, background:"#d1fae5", color:"#065f46" }}>Today</span>}
                  </div>
                  <div style={{ fontSize: 13, color: T.muted }}>{w.reason}</div>
                </div>
                {/* Right */}
                <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  {isToday ? <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>Today</span>
                  : isPast  ? <span style={{ fontSize: 12, color: T.muted }}>{Math.abs(du)}d ago</span>
                  : <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#0891b2", lineHeight: 1 }}>{du}</div>
                      <div style={{ fontSize: 10, color: T.muted }}>days away</div>
                    </div>
                  }
                  {w.status === "pending" && !isPast && (
                    <button onClick={() => cancelRequest(w.id)} style={{
                      fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
                      border: `1px solid ${T.border}`, background: "#fff", color: T.danger, cursor: "pointer",
                    }}>Cancel</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── New WFH Request Modal ── */}
      <Modal open={showModal} onClose={closeModal} title="🏠 New WFH Request">
        {success ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: T.success }}>Request submitted!</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>Awaiting manager approval.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: ".4px" }}>WFH Date *</label>
              <input type="date" value={form.date} min={minDate}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                style={{ border: `1.5px solid ${T.border}`, borderRadius: 9, padding: "10px 12px", fontSize: 14, outline: "none", color: T.text, fontFamily: "'DM Sans',sans-serif" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: ".4px" }}>Reason *</label>
              <textarea value={form.reason} rows={3}
                onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                placeholder="Why do you need to work from home?"
                style={{ border: `1.5px solid ${T.border}`, borderRadius: 9, padding: "10px 12px", fontSize: 14, outline: "none", color: T.text, resize: "vertical", fontFamily: "'DM Sans',sans-serif" }}
              />
            </div>
            {formError && (
              <div style={{ fontSize: 13, color: T.danger, background: "#fff0f0", borderRadius: 8, padding: "8px 12px" }}>{formError}</div>
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={closeModal}>Cancel</Btn>
              <button onClick={handleSubmit} style={{
                padding: "10px 24px", borderRadius: 10, border: "none",
                background: "#0891b2", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              }}>Submit Request</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}