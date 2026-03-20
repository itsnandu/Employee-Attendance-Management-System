// // src/pages/employee/EmpHolidays.jsx
// import { useState, useMemo, useEffect } from "react";
// import { T, Card, SectionTitle } from "../../components/employee/EmpUI";
// import { MONTH_NAMES } from "../../utils/EmployeeData";
// import holidayService from "../../services/holidayService";

// const TODAY = new Date();

// function parseDate(ds) { return new Date((ds || "") + "T00:00:00"); }

// function formatDisplayDate(ds) {
//   const d = parseDate(ds);
//   return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
// }

// function getDaysUntil(ds) {
//   const d = parseDate(ds);
//   const diff = Math.ceil((d - TODAY) / (1000 * 60 * 60 * 24));
//   return diff;
// }

// const TYPE_META = {
//   public:  { label: "Public Holiday",  bg: "#ede9fe", color: "#4f46e5", dot: "#4f46e5" },
//   company: { label: "Company Holiday", bg: "#cffafe", color: "#155e75", dot: "#06b6d4" },
// };

// export default function EmpHolidays() {
//   const [holidays, setHolidays] = useState([]);
//   const [monthFilter, setMonthFilter] = useState("all");
//   const [typeFilter,  setTypeFilter]  = useState("all");

//   useEffect(() => {
//     holidayService.getHolidays().then((data) => setHolidays(Array.isArray(data) ? data : []));
//   }, []);

//   const VISIBLE_HOLIDAYS = useMemo(() =>
//     holidays.filter(h => (h.type || "public") !== "restricted").map(h => ({
//       ...h,
//       date: h.date || h.holiday_date || "",
//       name: h.name || h.title || "",
//     })),
//     [holidays]
//   );

//   const upcoming = VISIBLE_HOLIDAYS.filter(h => getDaysUntil(h.date) > 0);
//   const nextHoliday = upcoming.sort((a,b)=>a.date.localeCompare(b.date))[0];

//   const filtered = useMemo(() => {
//     return VISIBLE_HOLIDAYS.filter(h => {
//       const d = parseDate(h.date);
//       const matchMonth = monthFilter === "all" || d.getMonth() === parseInt(monthFilter);
//       const matchType  = typeFilter  === "all" || h.type === typeFilter;
//       return matchMonth && matchType;
//     }).sort((a,b) => a.date.localeCompare(b.date));
//   }, [monthFilter, typeFilter]);

//   const totalHolidays = VISIBLE_HOLIDAYS.length;
//   const upcomingCount = upcoming.length;
//   const publicCount   = VISIBLE_HOLIDAYS.filter(h=>h.type==="public").length;
//   const companyCount  = VISIBLE_HOLIDAYS.filter(h=>h.type==="company").length;

//   // Months that actually have holidays
//   const monthsWithHolidays = [...new Set(VISIBLE_HOLIDAYS.map(h => parseDate(h.date).getMonth()))].sort((a,b)=>a-b);

//   return (
//     <div>
//       {/* ── Stat Cards ── */}
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
//         {[
//           { label:"Total Holidays", value:totalHolidays, icon:"📅", iconBg:"#ede9fe", iconColor:"#4f46e5" },
//           { label:"Upcoming",       value:upcomingCount, icon:"🔜", iconBg:"#d1fae5", iconColor:"#10b981" },
//           { label:"Public",         value:publicCount,   icon:"🏛️", iconBg:"#dbeafe", iconColor:"#2563eb" },
//           { label:"Company",        value:companyCount,  icon:"🏢", iconBg:"#cffafe", iconColor:"#0891b2" },
//         ].map(c=>(
//           <Card key={c.label} style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
//             <div style={{ width:44, height:44, borderRadius:12, background:c.iconBg, color:c.iconColor,
//               display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{c.icon}</div>
//             <div>
//               <div style={{ fontSize:26, fontWeight:800, lineHeight:1, fontFamily:"'Syne',sans-serif" }}>{c.value}</div>
//               <div style={{ fontSize:12, color:T.muted, marginTop:3 }}>{c.label}</div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* ── Next Holiday Banner ── */}
//       {nextHoliday && (
//         <Card style={{ padding:0, overflow:"hidden", marginBottom:24 }}>
//           <div style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", padding:"20px 28px",
//             display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
//             <div>
//               <div style={{ color:"#c7d2fe", fontSize:12, fontWeight:600, letterSpacing:".5px", textTransform:"uppercase", marginBottom:6 }}>
//                 Next Holiday
//               </div>
//               <div style={{ color:"#fff", fontSize:22, fontWeight:800, fontFamily:"'Syne',sans-serif" }}>
//                 🎉 {nextHoliday.name}
//               </div>
//               <div style={{ color:"#a5b4fc", fontSize:13, marginTop:4 }}>
//                 {formatDisplayDate(nextHoliday.date)}
//               </div>
//             </div>
//             <div style={{ background:"rgba(255,255,255,.15)", borderRadius:16, padding:"14px 24px", textAlign:"center" }}>
//               <div style={{ color:"#c7d2fe", fontSize:12, fontWeight:600, letterSpacing:".5px", textTransform:"uppercase" }}>Days Away</div>
//               <div style={{ color:"#fff", fontSize:34, fontWeight:800, lineHeight:1.1, marginTop:4 }}>
//                 {getDaysUntil(nextHoliday.date)}
//               </div>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* ── Filters ── */}
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:12 }}>
//         {/* Month filter */}
//         <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
//           <button onClick={()=>setMonthFilter("all")} style={filterBtn(monthFilter==="all")}>All Months</button>
//           {monthsWithHolidays.map(m=>(
//             <button key={m} onClick={()=>setMonthFilter(String(m))} style={filterBtn(monthFilter===String(m))}>
//               {MONTH_NAMES[m].slice(0,3)}
//             </button>
//           ))}
//         </div>
//         {/* Type filter — restricted option removed */}
//         <div style={{ display:"flex", gap:6 }}>
//           {[["all","All"],["public","Public"],["company","Company"]].map(([val,label])=>(
//             <button key={val} onClick={()=>setTypeFilter(val)} style={{
//               padding:"6px 14px", borderRadius:8, border:"1.5px solid",
//               cursor:"pointer", fontSize:12, fontWeight:600,
//               background: typeFilter===val ? T.primary : T.surface,
//               color:      typeFilter===val ? "#fff"    : T.muted,
//               borderColor:typeFilter===val ? T.primary : T.border,
//             }}>{label}</button>
//           ))}
//         </div>
//       </div>

//       {/* ── Holiday List ── */}
//       <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
//         {filtered.length === 0 && (
//           <Card style={{ padding:40, textAlign:"center" }}>
//             <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
//             <div style={{ fontWeight:700, fontSize:15 }}>No holidays found</div>
//             <div style={{ color:T.muted, fontSize:13, marginTop:4 }}>Try adjusting your filters.</div>
//           </Card>
//         )}
//         {filtered.map(h => {
//           const meta      = TYPE_META[h.type] || TYPE_META.public;
//           const daysUntil = getDaysUntil(h.date);
//           const isPast    = daysUntil < 0;
//           const isToday   = daysUntil === 0;

//           return (
//             <Card key={h.date} style={{
//               padding:"16px 20px",
//               display:"flex", alignItems:"center", gap:16,
//               opacity: isPast ? 0.55 : 1,
//               borderLeft: `4px solid ${meta.dot}`,
//             }}>
//               {/* Date badge */}
//               <div style={{
//                 minWidth:60, textAlign:"center", padding:"8px 4px", borderRadius:12,
//                 background:meta.bg, color:meta.color, flexShrink:0,
//               }}>
//                 <div style={{ fontSize:22, fontWeight:800, lineHeight:1 }}>
//                   {parseDate(h.date).getDate()}
//                 </div>
//                 <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".5px" }}>
//                   {MONTH_NAMES[parseDate(h.date).getMonth()].slice(0,3)}
//                 </div>
//               </div>

//               {/* Name + details */}
//               <div style={{ flex:1 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
//                   <span style={{ fontWeight:700, fontSize:15 }}>{h.name}</span>
//                   <span style={{
//                     padding:"2px 10px", borderRadius:99, fontSize:11, fontWeight:600,
//                     background:meta.bg, color:meta.color,
//                   }}>{meta.label}</span>
//                   {isToday && <span style={{ padding:"2px 10px", borderRadius:99, fontSize:11, fontWeight:600, background:"#d1fae5", color:"#065f46" }}>Today!</span>}
//                 </div>
//                 <div style={{ fontSize:13, color:T.muted, marginTop:4 }}>
//                   {formatDisplayDate(h.date)}
//                 </div>
//               </div>

//               {/* Days away / ago */}
//               <div style={{ textAlign:"right", flexShrink:0 }}>
//                 {isToday ? (
//                   <span style={{ fontSize:13, fontWeight:700, color:"#10b981" }}>Today</span>
//                 ) : isPast ? (
//                   <span style={{ fontSize:13, color:T.muted }}>{Math.abs(daysUntil)} days ago</span>
//                 ) : (
//                   <div>
//                     <div style={{ fontSize:20, fontWeight:800, color:T.primary, lineHeight:1 }}>{daysUntil}</div>
//                     <div style={{ fontSize:11, color:T.muted }}>days away</div>
//                   </div>
//                 )}
//               </div>
//             </Card>
//           );
//         })}
//       </div>

//       {/* ── Type Legend ── */}
//       <Card style={{ padding:"14px 20px", marginTop:20, display:"flex", gap:20, flexWrap:"wrap", alignItems:"center" }}>
//         <span style={{ fontSize:12, fontWeight:600, color:T.muted }}>Legend:</span>
//         {Object.entries(TYPE_META).map(([key, meta])=>(
//           <div key={key} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13 }}>
//             <div style={{ width:12, height:12, borderRadius:"50%", background:meta.dot }}/>
//             <span style={{ color:T.text, fontWeight:500 }}>{meta.label}</span>
//           </div>
//         ))}
//       </Card>
//     </div>
//   );
// }

// function filterBtn(active) {
//   return {
//     padding:"6px 14px", borderRadius:8, border:"1.5px solid",
//     cursor:"pointer", fontSize:12, fontWeight:600,
//     background: active ? T.primary : T.surface,
//     color:      active ? "#fff"    : T.muted,
//     borderColor:active ? T.primary : T.border,
//   };
// }

// src/pages/employee/EmpHolidays.jsx
import { useState, useMemo, useEffect } from "react";
import { T, Card, SectionTitle } from "../../components/employee/EmpUI";
import { MONTH_NAMES } from "../../utils/EmployeeData";
import holidayService from "../../services/holidayService";

const TODAY = new Date();

function parseDate(ds) { return new Date((ds || "") + "T00:00:00"); }

function formatDisplayDate(ds) {
  const d = parseDate(ds);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

function getDaysUntil(ds) {
  const d = parseDate(ds);
  const diff = Math.ceil((d - TODAY) / (1000 * 60 * 60 * 24));
  return diff;
}

const TYPE_META = {
  public:  { label: "Public Holiday",  bg: "#dbeafe", color: "#0061f2", dot: "#0061f2" },
  company: { label: "Company Holiday", bg: "#cffafe", color: "#155e75", dot: "#06b6d4" },
};

export default function EmpHolidays() {
  const [holidays, setHolidays] = useState([]);
  const [monthFilter, setMonthFilter] = useState("all");
  const [typeFilter,  setTypeFilter]  = useState("all");

  useEffect(() => {
    holidayService.getHolidays().then((data) => setHolidays(Array.isArray(data) ? data : []));
  }, []);

  const VISIBLE_HOLIDAYS = useMemo(() =>
    holidays.filter(h => (h.type || "public") !== "restricted").map(h => ({
      ...h,
      date: h.date || h.holiday_date || "",
      name: h.name || h.title || "",
    })),
    [holidays]
  );

  const upcoming = VISIBLE_HOLIDAYS.filter(h => getDaysUntil(h.date) > 0);
  const nextHoliday = upcoming.sort((a,b)=>a.date.localeCompare(b.date))[0];

  const filtered = useMemo(() => {
    return VISIBLE_HOLIDAYS.filter(h => {
      const d = parseDate(h.date);
      const matchMonth = monthFilter === "all" || d.getMonth() === parseInt(monthFilter);
      const matchType  = typeFilter  === "all" || h.type === typeFilter;
      return matchMonth && matchType;
    }).sort((a,b) => a.date.localeCompare(b.date));
  }, [monthFilter, typeFilter]);

  const totalHolidays = VISIBLE_HOLIDAYS.length;
  const upcomingCount = upcoming.length;
  const publicCount   = VISIBLE_HOLIDAYS.filter(h=>h.type==="public").length;
  const companyCount  = VISIBLE_HOLIDAYS.filter(h=>h.type==="company").length;

  // Months that actually have holidays
  const monthsWithHolidays = [...new Set(VISIBLE_HOLIDAYS.map(h => parseDate(h.date).getMonth()))].sort((a,b)=>a-b);

  return (
    <div>
      {/* ── Stat Cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[
          { label:"Total Holidays", value:totalHolidays, icon:"📅", iconBg:"#dbeafe", iconColor:"#0061f2" },
          { label:"Upcoming",       value:upcomingCount, icon:"🔜", iconBg:"#d1fae5", iconColor:"#10b981" },
          { label:"Public",         value:publicCount,   icon:"🏛️", iconBg:"#dbeafe", iconColor:"#2563eb" },
          { label:"Company",        value:companyCount,  icon:"🏢", iconBg:"#cffafe", iconColor:"#0891b2" },
        ].map(c=>(
          <Card key={c.label} style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:c.iconBg, color:c.iconColor,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize:26, fontWeight:800, lineHeight:1 }}>{c.value}</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:3 }}>{c.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Next Holiday Banner ── */}
      {nextHoliday && (
        <Card style={{ padding:0, overflow:"hidden", marginBottom:24 }}>
          <div style={{ background:"linear-gradient(135deg,#0061f2,#0ea5e9)", padding:"20px 28px",
            display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ color:"#c7d2fe", fontSize:12, fontWeight:600, letterSpacing:".5px", textTransform:"uppercase", marginBottom:6 }}>
                Next Holiday
              </div>
              <div style={{ color:"#fff", fontSize:22, fontWeight:800 }}>
                🎉 {nextHoliday.name}
              </div>
              <div style={{ color:"#93c5fd", fontSize:13, marginTop:4 }}>
                {formatDisplayDate(nextHoliday.date)}
              </div>
            </div>
            <div style={{ background:"rgba(255,255,255,.15)", borderRadius:16, padding:"14px 24px", textAlign:"center" }}>
              <div style={{ color:"#c7d2fe", fontSize:12, fontWeight:600, letterSpacing:".5px", textTransform:"uppercase" }}>Days Away</div>
              <div style={{ color:"#fff", fontSize:34, fontWeight:800, lineHeight:1.1, marginTop:4 }}>
                {getDaysUntil(nextHoliday.date)}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ── Filters ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:12 }}>
        {/* Month filter */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <button onClick={()=>setMonthFilter("all")} style={filterBtn(monthFilter==="all")}>All Months</button>
          {monthsWithHolidays.map(m=>(
            <button key={m} onClick={()=>setMonthFilter(String(m))} style={filterBtn(monthFilter===String(m))}>
              {MONTH_NAMES[m].slice(0,3)}
            </button>
          ))}
        </div>
        {/* Type filter — restricted option removed */}
        <div style={{ display:"flex", gap:6 }}>
          {[["all","All"],["public","Public"],["company","Company"]].map(([val,label])=>(
            <button key={val} onClick={()=>setTypeFilter(val)} style={{
              padding:"6px 14px", borderRadius:8, border:"1.5px solid",
              cursor:"pointer", fontSize:12, fontWeight:600,
              background: typeFilter===val ? T.primary : T.surface,
              color:      typeFilter===val ? "#fff"    : T.muted,
              borderColor:typeFilter===val ? T.primary : T.border,
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── Holiday List ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.length === 0 && (
          <Card style={{ padding:40, textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
            <div style={{ fontWeight:700, fontSize:15 }}>No holidays found</div>
            <div style={{ color:T.muted, fontSize:13, marginTop:4 }}>Try adjusting your filters.</div>
          </Card>
        )}
        {filtered.map(h => {
          const meta      = TYPE_META[h.type] || TYPE_META.public;
          const daysUntil = getDaysUntil(h.date);
          const isPast    = daysUntil < 0;
          const isToday   = daysUntil === 0;

          return (
            <Card key={h.date} style={{
              padding:"16px 20px",
              display:"flex", alignItems:"center", gap:16,
              opacity: isPast ? 0.55 : 1,
              borderLeft: `4px solid ${meta.dot}`,
            }}>
              {/* Date badge */}
              <div style={{
                minWidth:60, textAlign:"center", padding:"8px 4px", borderRadius:12,
                background:meta.bg, color:meta.color, flexShrink:0,
              }}>
                <div style={{ fontSize:22, fontWeight:800, lineHeight:1 }}>
                  {parseDate(h.date).getDate()}
                </div>
                <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".5px" }}>
                  {MONTH_NAMES[parseDate(h.date).getMonth()].slice(0,3)}
                </div>
              </div>

              {/* Name + details */}
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontWeight:700, fontSize:15 }}>{h.name}</span>
                  <span style={{
                    padding:"2px 10px", borderRadius:99, fontSize:11, fontWeight:600,
                    background:meta.bg, color:meta.color,
                  }}>{meta.label}</span>
                  {isToday && <span style={{ padding:"2px 10px", borderRadius:99, fontSize:11, fontWeight:600, background:"#d1fae5", color:"#065f46" }}>Today!</span>}
                </div>
                <div style={{ fontSize:13, color:T.muted, marginTop:4 }}>
                  {formatDisplayDate(h.date)}
                </div>
              </div>

              {/* Days away / ago */}
              <div style={{ textAlign:"right", flexShrink:0 }}>
                {isToday ? (
                  <span style={{ fontSize:13, fontWeight:700, color:"#10b981" }}>Today</span>
                ) : isPast ? (
                  <span style={{ fontSize:13, color:T.muted }}>{Math.abs(daysUntil)} days ago</span>
                ) : (
                  <div>
                    <div style={{ fontSize:20, fontWeight:800, color:T.primary, lineHeight:1 }}>{daysUntil}</div>
                    <div style={{ fontSize:11, color:T.muted }}>days away</div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Type Legend ── */}
      <Card style={{ padding:"14px 20px", marginTop:20, display:"flex", gap:20, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:12, fontWeight:600, color:T.muted }}>Legend:</span>
        {Object.entries(TYPE_META).map(([key, meta])=>(
          <div key={key} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13 }}>
            <div style={{ width:12, height:12, borderRadius:"50%", background:meta.dot }}/>
            <span style={{ color:T.text, fontWeight:500 }}>{meta.label}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function filterBtn(active) {
  return {
    padding:"6px 14px", borderRadius:8, border:"1.5px solid",
    cursor:"pointer", fontSize:12, fontWeight:600,
    background: active ? T.primary : T.surface,
    color:      active ? "#fff"    : T.muted,
    borderColor:active ? T.primary : T.border,
  };
}