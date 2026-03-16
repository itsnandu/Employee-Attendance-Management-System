// src/pages/employee/EmpLeaves.jsx
import { useState, useEffect } from "react";
import { T, Card, SectionTitle, StatusBadge, Btn, Modal, Input, Select } from "../../components/employee/EmpUI";
import leaveService from "../../services/leaveService";
import useCurrentEmployee from "../../hooks/useCurrentEmployee";

const LEAVE_TYPES = ["Casual Leave", "Sick Leave", "Earned Leave", "Comp Off"];
const LEAVE_BALANCE_DEFAULTS = [
  { type: "Casual Leave",  total: 12, used: 0, color: "#4f46e5" },
  { type: "Sick Leave",    total: 10, used: 0, color: "#06b6d4" },
  { type: "Earned Leave",  total: 15, used: 0, color: "#10b981" },
  { type: "Comp Off",      total: 4,  used: 0, color: "#f59e0b" },
];

export default function EmpLeaves() {
  const { employeeId, loading: empLoading } = useCurrentEmployee();
  const [history, setHistory] = useState([]);
  const [modal,   setModal]   = useState(false);
  const [filter,  setFilter]  = useState("all");
  const [form,    setForm]    = useState({
    type: "Casual Leave", from: "", to: "", reason: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    leaveService.getLeaves().then((data) => {
      const list = Array.isArray(data) ? data : [];
      const mine = employeeId ? list.filter(l => l.employee_id === employeeId) : list;
      setHistory(mine.map(l => ({
        id: l.id, type: l.leave_type || l.type, employee_id: l.employee_id,
        from: l.from || l.start_date, to: l.to || l.end_date,
        days: l.days || 1, status: (l.status || "pending").toLowerCase(), reason: l.reason || "",
      })));
    });
  }, [employeeId]);

  const leaveTypes = LEAVE_TYPES.map(t => ({ value: t, label: t }));

  const LEAVE_BALANCE = LEAVE_BALANCE_DEFAULTS.map(lb => {
    const used = history.filter(h => h.type === lb.type && h.status === "approved").reduce((a, h) => a + (h.days || 0), 0);
    return { ...lb, used };
  });

  function validate() {
    const e = {};
    if (!form.from)   e.from   = "Start date required";
    if (!form.to)     e.to     = "End date required";
    if (!form.reason.trim()) e.reason = "Reason required";
    if (form.from && form.to && form.to < form.from) e.to = "End must be after start";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function calcDays(from, to) {
    if (!from || !to) return 0;
    const diff = (new Date(to) - new Date(from)) / 86400000 + 1;
    return Math.max(0, diff);
  }

  async function submit() {
    if (!validate()) return;
    if (!employeeId) {
      setErrors({ reason: "Your employee profile could not be loaded. Please refresh or contact HR." });
      return;
    }
    const days = calcDays(form.from, form.to);
    try {
      await leaveService.applyLeave({
        employee_id: employeeId,
        leave_type: form.type,
        start_date: form.from,
        end_date: form.to,
        reason: form.reason,
      });
      setHistory(prev => [{
        id: Date.now(), type: form.type, employee_id: employeeId,
        from: form.from, to: form.to, days, status: "pending", reason: form.reason,
      }, ...prev]);
      setForm({ type: "Casual Leave", from: "", to: "", reason: "" });
      setErrors({});
      setModal(false);
    } catch (err) {
      setErrors({ reason: err.message || "Failed to apply" });
    }
  }

  const filtered = filter === "all" ? history : history.filter(l=>l.status===filter);
  const cannotSubmit = !employeeId || empLoading;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {!empLoading && !employeeId && (
        <div style={{
          background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 12,
          padding: "14px 20px", color: "#92400e", fontSize: 14, fontWeight: 600,
        }}>
          ⚠️ Your employee profile could not be loaded. Please refresh the page or contact HR to link your account.
        </div>
      )}

      {/* Balance cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        {LEAVE_BALANCE.map(l => {
          const remaining = l.total - l.used;
          const pct = Math.round((remaining/l.total)*100);
          return (
            <Card key={l.type} style={{ padding:"18px 20px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ fontSize:12, fontWeight:600, color:T.muted }}>{l.type}</div>
                <div style={{ width:10, height:10, borderRadius:"50%", background:l.color }}/>
              </div>
              <div style={{ fontSize:30, fontWeight:800, fontFamily:"'Syne',sans-serif", color:l.color, lineHeight:1 }}>{remaining}</div>
              <div style={{ fontSize:12, color:T.muted, marginBottom:10 }}>of {l.total} remaining</div>
              <div style={{ background:T.surface2, borderRadius:99, height:6, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:99, width:`${pct}%`, background:l.color }}/>
              </div>
            </Card>
          );
        })}
      </div>

      {/* History table */}
      <Card style={{ padding:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <SectionTitle style={{ marginBottom:0 }}>Leave History</SectionTitle>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {/* Filter tabs */}
            <div style={{ display:"flex", gap:4, background:T.surface2, borderRadius:10, padding:4 }}>
              {["all","approved","pending","rejected"].map(f=>(
                <button key={f} onClick={()=>setFilter(f)} style={{
                  padding:"5px 14px", borderRadius:8, border:"none", cursor:"pointer",
                  fontSize:12, fontWeight:600, textTransform:"capitalize",
                  background: filter===f?T.surface:"transparent",
                  color:      filter===f?T.text:T.muted,
                  boxShadow:  filter===f?"0 1px 3px rgba(0,0,0,.08)":"none",
                  fontFamily:"'DM Sans',sans-serif",
                }}>{f}</button>
              ))}
            </div>
            <Btn onClick={()=>setModal(true)} disabled={cannotSubmit}>
              {empLoading ? "Loading..." : "+ Apply Leave"}
            </Btn>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px 0", color:T.muted }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🗓</div>
            <div style={{ fontWeight:600 }}>No leave records found</div>
          </div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:T.surface2 }}>
                {["Leave Type","From","To","Days","Reason","Status"].map(h=>(
                  <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:T.muted, letterSpacing:".5px", borderBottom:`1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l,i)=>(
                <tr key={l.id}
                  style={{ borderBottom:`1px solid #f1f5f9`, background:i%2===0?T.surface:T.surface2 }}
                  onMouseEnter={e=>e.currentTarget.style.background="#f5f3ff"}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?T.surface:T.surface2}
                >
                  <td style={{ padding:"12px 16px", fontWeight:600, fontSize:14 }}>{l.type}</td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:T.muted }}>{l.from}</td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:T.muted }}>{l.to}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ background:T.primaryLight, color:T.primary, padding:"2px 10px", borderRadius:99, fontSize:12, fontWeight:700 }}>{l.days}d</span>
                  </td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:T.muted, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.reason}</td>
                  <td style={{ padding:"12px 16px" }}><StatusBadge status={l.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Apply Leave Modal */}
      <Modal open={modal} onClose={()=>{ setModal(false); setErrors({}); }} title="Apply for Leave" width={480}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Select
            label="LEAVE TYPE"
            value={form.type}
            onChange={e=>setForm(p=>({...p, type:e.target.value}))}
            options={leaveTypes}
          />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <Input label="FROM DATE" type="date" value={form.from} onChange={e=>setForm(p=>({...p,from:e.target.value}))}/>
              {errors.from && <div style={{ fontSize:11, color:T.danger, marginTop:3 }}>{errors.from}</div>}
            </div>
            <div>
              <Input label="TO DATE" type="date" value={form.to} onChange={e=>setForm(p=>({...p,to:e.target.value}))}/>
              {errors.to && <div style={{ fontSize:11, color:T.danger, marginTop:3 }}>{errors.to}</div>}
            </div>
          </div>
          {form.from && form.to && form.to >= form.from && (
            <div style={{ background:T.primaryLight, borderRadius:9, padding:"8px 14px", fontSize:13, color:T.primary, fontWeight:600 }}>
              📅 Duration: {calcDays(form.from,form.to)} day{calcDays(form.from,form.to)>1?"s":""}
            </div>
          )}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:T.muted, letterSpacing:".4px", display:"block", marginBottom:5 }}>REASON</label>
            <textarea value={form.reason} onChange={e=>setForm(p=>({...p,reason:e.target.value}))}
              placeholder="Briefly explain the reason for your leave..." rows={3}
              style={{ width:"100%", padding:"9px 14px", borderRadius:9, fontSize:14, border:`1.5px solid ${errors.reason?T.danger:T.border}`, background:T.surface, color:T.text, fontFamily:"'DM Sans',sans-serif", resize:"vertical", outline:"none" }}
              onFocus={e=>e.target.style.borderColor=T.primary}
              onBlur={e=>e.target.style.borderColor=errors.reason?T.danger:T.border}
            />
            {errors.reason && <div style={{ fontSize:11, color:T.danger, marginTop:3 }}>{errors.reason}</div>}
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
            <Btn variant="ghost" onClick={()=>{ setModal(false); setErrors({}); }}>Cancel</Btn>
            <Btn onClick={submit}>Submit Application</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}