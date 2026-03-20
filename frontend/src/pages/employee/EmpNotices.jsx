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
import { useState, useEffect } from "react";
import { T, Card, Badge, Modal } from "../../components/employee/EmpUI";
import announcementService from "../../services/announcementService";

const TAG_COLORS = { HR: "#0061f2", Holiday: "#10b981", Policy: "#f59e0b", Wellness: "#06b6d4", IT: "#8b5cf6", Event: "#ec4899", Finance: "#0891b2", Operations: "#64748b" };

function fmtDate(ds) {
  if (!ds) return "—";
  return new Date((ds + "").slice(0, 10) + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function EmpNotices() {
  const [items, setItems] = useState([]);
  const [tagFilter, setTagFilter] = useState("All");
  const [selected,  setSelected]  = useState(null);
  const [read,      setRead]      = useState(new Set());

  useEffect(() => {
    announcementService.getAnnouncements().then((data) => setItems(Array.isArray(data) ? data : []));
  }, []);

  const ALL_NOTICES = items.map(a => ({
    id: a.id,
    title: a.title || "",
    date: fmtDate(a.date || a.created_at),
    tag: a.tag || "HR",
    color: TAG_COLORS[a.tag] || "#0061f2",
    msg: a.msg || a.message || "",
  }));

  const tags = ["All", ...new Set(ALL_NOTICES.map(n => n.tag).filter(Boolean))];
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
              <div style={{ fontSize:28, fontWeight:800, color:T.text, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tag filters */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {tags.map(tag => (
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