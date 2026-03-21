// // src/pages/employee/EmpNotices.jsx
// import { useState, useEffect } from "react";
// import { T, Card, Badge, Modal } from "../../components/employee/EmpUI";
// import announcementService from "../../services/announcementService";

// const TAG_COLORS = { HR: "#4f46e5", Holiday: "#10b981", Policy: "#f59e0b", Wellness: "#06b6d4", IT: "#8b5cf6", Event: "#ec4899", Finance: "#0891b2", Operations: "#64748b" };

// function fmtDate(ds) {
//   if (!ds) return "—";
//   return new Date((ds + "").slice(0, 10) + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
// }

// export default function EmpNotices() {
//   const [items, setItems] = useState([]);
//   const [tagFilter, setTagFilter] = useState("All");
//   const [selected,  setSelected]  = useState(null);
//   const [read,      setRead]      = useState(new Set());

//   useEffect(() => {
//     announcementService.getAnnouncements().then((data) => setItems(Array.isArray(data) ? data : []));
//   }, []);

//   const ALL_NOTICES = items.map(a => ({
//     id: a.id,
//     title: a.title || "",
//     date: fmtDate(a.date || a.created_at),
//     tag: a.tag || "HR",
//     color: TAG_COLORS[a.tag] || "#4f46e5",
//     msg: a.msg || a.message || "",
//   }));

//   const tags = ["All", ...new Set(ALL_NOTICES.map(n => n.tag).filter(Boolean))];
//   const filtered = tagFilter === "All"
//     ? ALL_NOTICES
//     : ALL_NOTICES.filter(n => n.tag === tagFilter);

//   function open(n) {
//     setSelected(n);
//     setRead(r => new Set([...r, n.id]));
//   }

//   return (
//     <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

//       {/* Stats row */}
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
//         {[
//           { label:"Total Notices",  value:ALL_NOTICES.length,                                  icon:"📢", color:T.primary,  bg:T.primaryLight },
//           { label:"Unread",         value:ALL_NOTICES.length - read.size,                       icon:"🔴", color:T.danger,   bg:"#fee2e2"      },
//           { label:"Read",           value:read.size,                                            icon:"✓",  color:T.success,  bg:"#d1fae5"      },
//         ].map(s=>(
//           <Card key={s.label} style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
//             <div style={{ width:44, height:44, borderRadius:12, background:s.bg, color:s.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
//             <div>
//               <div style={{ fontSize:28, fontWeight:800, fontFamily:"'Syne',sans-serif", color:T.text, lineHeight:1 }}>{s.value}</div>
//               <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{s.label}</div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Tag filters */}
//       <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
//         {tags.map(tag => (
//           <button key={tag} onClick={()=>setTagFilter(tag)} style={{
//             padding:"6px 18px", borderRadius:99, border:"1.5px solid",
//             cursor:"pointer", fontSize:13, fontWeight:500,
//             background: tagFilter===tag ? T.primary : T.surface,
//             color:       tagFilter===tag ? "#fff"    : T.muted,
//             borderColor: tagFilter===tag ? T.primary : T.border,
//             fontFamily:"'DM Sans',sans-serif",
//           }}>{tag}</button>
//         ))}
//       </div>

//       {/* Notices grid */}
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
//         {filtered.map(n => {
//           const isRead = read.has(n.id);
//           return (
//             <Card key={n.id} onClick={()=>open(n)} style={{
//               padding:20, cursor:"pointer", transition:"all .2s",
//               borderLeft:`4px solid ${n.color}`,
//               opacity: isRead ? .75 : 1,
//             }}
//               onMouseEnter={e=>{ e.currentTarget.style.background="#f5f3ff"; e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 4px 12px rgba(79,70,229,.1)"; }}
//               onMouseLeave={e=>{ e.currentTarget.style.background=T.surface; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.06)"; }}
//             >
//               <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
//                 <Badge label={n.tag} color={n.color} bg={`${n.color}18`}/>
//                 <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//                   {!isRead && <div style={{ width:8, height:8, borderRadius:"50%", background:T.danger }}/>}
//                   <span style={{ fontSize:11, color:T.muted }}>{n.date}</span>
//                 </div>
//               </div>
//               <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:6, lineHeight:1.3 }}>{n.title}</div>
//               <div style={{ fontSize:13, color:T.muted, lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{n.msg}</div>
//               <div style={{ marginTop:12, fontSize:12, color:n.color, fontWeight:600 }}>Read more →</div>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Notice detail modal */}
//       <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.title}>
//         {selected && (
//           <div>
//             <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
//               <Badge label={selected.tag} color={selected.color} bg={`${selected.color}18`}/>
//               <span style={{ fontSize:13, color:T.muted }}>{selected.date}</span>
//             </div>
//             <div style={{
//               padding:20, borderRadius:12, background:T.surface2,
//               borderLeft:`4px solid ${selected.color}`,
//               fontSize:14, color:T.text, lineHeight:1.8,
//             }}>{selected.msg}</div>
//             <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
//               <button onClick={()=>setSelected(null)} style={{
//                 padding:"8px 24px", borderRadius:9, border:"none",
//                 background:T.primary, color:"#fff", cursor:"pointer",
//                 fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
//               }}>Close</button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }

// src/pages/employee/EmpNotices.jsx
// src/pages/employee/EmpNotices.jsx
import { useState, useEffect } from "react";
import { T, Card, Badge, Modal } from "../../components/employee/EmpUI";
import announcementService from "../../services/announcementService";

const TAG_COLORS = {
  HR: "#0061f2", Holiday: "#10b981", Policy: "#f59e0b",
  Wellness: "#06b6d4", IT: "#8b5cf6", Event: "#ec4899",
  Finance: "#0284c7", Operations: "#64748b",
};

function fmtDate(ds) {
  if (!ds) return "—";
  return new Date((ds + "").slice(0, 10) + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ── SVG Icons ──────────────────────────────────────────────────
const IcoMegaphone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
  </svg>
);
const IcoBell = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IcoCheckCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
);
const IcoEmpty = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
  </svg>
);
const IcoArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function EmpNotices() {
  const [items,     setItems]     = useState([]);
  const [tagFilter, setTagFilter] = useState("All");
  const [selected,  setSelected]  = useState(null);
  const [read,      setRead]      = useState(new Set());

  useEffect(() => {
    announcementService.getAnnouncements().then(data => setItems(Array.isArray(data) ? data : []));
  }, []);

  const ALL_NOTICES = items.map(a => ({
    id:    a.id,
    title: a.title || "",
    date:  fmtDate(a.date || a.created_at),
    tag:   a.tag || "HR",
    color: TAG_COLORS[a.tag] || "#0061f2",
    msg:   a.msg || a.message || "",
  }));

  const tags     = ["All", ...new Set(ALL_NOTICES.map(n => n.tag).filter(Boolean))];
  const filtered = tagFilter === "All" ? ALL_NOTICES : ALL_NOTICES.filter(n => n.tag === tagFilter);
  const unread   = ALL_NOTICES.length - read.size;

  function open(n) {
    setSelected(n);
    setRead(r => new Set([...r, n.id]));
  }

  const STATS = [
    { label: "Total Notices", value: ALL_NOTICES.length, Ico: IcoMegaphone, color: "#0061f2", bg: "#dbeafe" },
    { label: "Unread",        value: unread,              Ico: IcoBell,      color: "#ef4444", bg: "#fee2e2" },
    { label: "Read",          value: read.size,           Ico: IcoCheckCircle, color: "#10b981", bg: "#d1fae5" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {STATS.map(s => (
          <Card key={s.label} style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14, background: s.bg, color: s.color,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <s.Ico/>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: T.text, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Tag filters ── */}
      <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 10, padding: 3, gap: 2, flexWrap: "wrap", width: "fit-content" }}>
        {tags.map(tag => (
          <button key={tag} onClick={() => setTagFilter(tag)} style={{
            padding: "7px 18px", borderRadius: 8, border: "none",
            cursor: "pointer", fontSize: 13, fontWeight: 600,
            background:  tagFilter === tag ? "#0061f2" : "transparent",
            color:       tagFilter === tag ? "#fff"    : T.muted,
            fontFamily: "'DM Sans',sans-serif", transition: "all .15s",
          }}>{tag}</button>
        ))}
      </div>

      {/* ── Notices grid ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "56px 0", color: T.muted }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: "#cbd5e1" }}><IcoEmpty/></div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>No notices found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Check back later for updates.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          {filtered.map(n => {
            const isRead = read.has(n.id);
            return (
              <Card key={n.id} onClick={() => open(n)}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#f0f7ff";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,97,242,.12)`;
                  e.currentTarget.style.borderColor = n.color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = T.surface;
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.06)";
                  e.currentTarget.style.borderColor = T.border;
                }}
                style={{
                  padding: 20, cursor: "pointer", transition: "all .2s",
                  borderLeft: `4px solid ${n.color}`,
                  opacity: isRead ? .7 : 1,
                }}
              >
                {/* Top row: tag + date + unread dot */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{
                    padding: "3px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                    background: `${n.color}18`, color: n.color,
                  }}>{n.tag}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    {!isRead && (
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 0 2px #fee2e2" }}/>
                    )}
                    <span style={{ fontSize: 11, color: T.muted }}>{n.date}</span>
                  </div>
                </div>

                {/* Title */}
                <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 6, lineHeight: 1.3 }}>{n.title}</div>

                {/* Preview */}
                <div style={{
                  fontSize: 13, color: T.muted, lineHeight: 1.6,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>{n.msg}</div>

                {/* Read more link */}
                <div style={{ marginTop: 12, fontSize: 12, color: "#0061f2", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                  Read more <IcoArrow/>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Notice detail modal ── */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title || ""}>
        {selected && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{
                padding: "3px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                background: `${selected.color}18`, color: selected.color,
              }}>{selected.tag}</span>
              <span style={{ fontSize: 13, color: T.muted }}>{selected.date}</span>
            </div>
            <div style={{
              padding: 20, borderRadius: 12, background: T.surface2,
              borderLeft: `4px solid ${selected.color}`,
              fontSize: 14, color: T.text, lineHeight: 1.8,
            }}>
              {selected.msg}
            </div>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setSelected(null)} style={{
                padding: "9px 28px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg,#0061f2,#0052cc)",
                color: "#fff", cursor: "pointer",
                fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
                boxShadow: "0 4px 12px rgba(0,97,242,.3)",
              }}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

