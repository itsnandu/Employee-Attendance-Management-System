// src/pages/employee/EmpNotices.jsx
import { useState } from "react";
import { T, Card, Badge, Modal } from "../../components/employee/EmpUI";
import { ANNOUNCEMENTS } from "../../utils/EmployeeData";

const ALL_NOTICES = [
  ...ANNOUNCEMENTS,
  { id: 5, title: "Diwali Bonus Announcement",    date: "Oct 20, 2025", tag: "HR",      color: "#4f46e5", msg: "All employees are eligible for a Diwali bonus equivalent to 1 month's basic salary, credited by November 1st." },
  { id: 6, title: "IT Infrastructure Upgrade",    date: "Oct 10, 2025", tag: "IT",      color: "#8b5cf6", msg: "Scheduled maintenance on Oct 12th 11pm–2am. Systems will be briefly unavailable. Save your work beforehand." },
  { id: 7, title: "Annual Sports Day",            date: "Sep 28, 2025", tag: "Event",   color: "#ec4899", msg: "Annual company sports day on October 5th at the corporate grounds. Register your team by Oct 1st." },
  { id: 8, title: "Updated Code of Conduct",      date: "Sep 15, 2025", tag: "Policy",  color: "#f59e0b", msg: "Please review the updated Code of Conduct available on the HR portal. Acknowledgment required by Sep 30." },
];

const TAGS = ["All", "HR", "Holiday", "Policy", "Wellness", "IT", "Event"];

export default function EmpNotices() {
  const [tagFilter, setTagFilter] = useState("All");
  const [selected,  setSelected]  = useState(null);
  const [read,      setRead]      = useState(new Set());

  const filtered = tagFilter === "All"
    ? ALL_NOTICES
    : ALL_NOTICES.filter(n => n.tag === tagFilter);

  function open(n) {
    setSelected(n);
    setRead(r => new Set([...r, n.id]));
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {[
          { label:"Total Notices",  value:ALL_NOTICES.length,                                  icon:"📢", color:T.primary,  bg:T.primaryLight },
          { label:"Unread",         value:ALL_NOTICES.length - read.size,                       icon:"🔴", color:T.danger,   bg:"#fee2e2"      },
          { label:"Read",           value:read.size,                                            icon:"✓",  color:T.success,  bg:"#d1fae5"      },
        ].map(s=>(
          <Card key={s.label} style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:s.bg, color:s.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:28, fontWeight:800, fontFamily:"'Syne',sans-serif", color:T.text, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tag filters */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {TAGS.map(tag => (
          <button key={tag} onClick={()=>setTagFilter(tag)} style={{
            padding:"6px 18px", borderRadius:99, border:"1.5px solid",
            cursor:"pointer", fontSize:13, fontWeight:500,
            background: tagFilter===tag ? T.primary : T.surface,
            color:       tagFilter===tag ? "#fff"    : T.muted,
            borderColor: tagFilter===tag ? T.primary : T.border,
            fontFamily:"'DM Sans',sans-serif",
          }}>{tag}</button>
        ))}
      </div>

      {/* Notices grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
        {filtered.map(n => {
          const isRead = read.has(n.id);
          return (
            <Card key={n.id} onClick={()=>open(n)} style={{
              padding:20, cursor:"pointer", transition:"all .2s",
              borderLeft:`4px solid ${n.color}`,
              opacity: isRead ? .75 : 1,
            }}
              onMouseEnter={e=>{ e.currentTarget.style.background="#f5f3ff"; e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 4px 12px rgba(79,70,229,.1)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=T.surface; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.06)"; }}
            >
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                <Badge label={n.tag} color={n.color} bg={`${n.color}18`}/>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {!isRead && <div style={{ width:8, height:8, borderRadius:"50%", background:T.danger }}/>}
                  <span style={{ fontSize:11, color:T.muted }}>{n.date}</span>
                </div>
              </div>
              <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:6, lineHeight:1.3 }}>{n.title}</div>
              <div style={{ fontSize:13, color:T.muted, lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{n.msg}</div>
              <div style={{ marginTop:12, fontSize:12, color:n.color, fontWeight:600 }}>Read more →</div>
            </Card>
          );
        })}
      </div>

      {/* Notice detail modal */}
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.title}>
        {selected && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <Badge label={selected.tag} color={selected.color} bg={`${selected.color}18`}/>
              <span style={{ fontSize:13, color:T.muted }}>{selected.date}</span>
            </div>
            <div style={{
              padding:20, borderRadius:12, background:T.surface2,
              borderLeft:`4px solid ${selected.color}`,
              fontSize:14, color:T.text, lineHeight:1.8,
            }}>{selected.msg}</div>
            <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
              <button onClick={()=>setSelected(null)} style={{
                padding:"8px 24px", borderRadius:9, border:"none",
                background:T.primary, color:"#fff", cursor:"pointer",
                fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
              }}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}