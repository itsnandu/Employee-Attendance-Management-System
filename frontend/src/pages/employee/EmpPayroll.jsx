// src/pages/employee/EmpPayroll.jsx
import { useState, useEffect } from "react";
import { T, Card, SectionTitle, StatusBadge, Btn, Modal } from "../../components/employee/EmpUI";
import payrollService from "../../services/payrollService";
import employeeService from "../../services/employeeService";
import useCurrentEmployee from "../../hooks/useCurrentEmployee";

function BreakdownRow({ label, value, bold, color }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${T.border}` }}>
      <span style={{ fontSize:14, color:bold?T.text:T.muted }}>{label}</span>
      <span style={{ fontSize:14, fontWeight:bold?700:500, color:color||T.text }}>{value}</span>
    </div>
  );
}

function fmtCurrency(n) {
  if (n == null || isNaN(n)) return "—";
  return "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function EmpPayroll() {
  const { employee, employeeId } = useCurrentEmployee();
  const [payroll, setPayroll] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!employeeId) return;
    payrollService.getPayrollByEmployee(employeeId).then((data) => setPayroll(Array.isArray(data) ? data : []));
  }, [employeeId]);

  const PAYSLIPS = payroll.map(p => {
    const gross = (p.salary || 0) + (p.bonus || 0);
    const ded = p.deduction || 0;
    const net = gross - ded;
    return {
      id: p.id,
      month: p.month || "—",
      gross: fmtCurrency(gross),
      deductions: fmtCurrency(ded),
      net: fmtCurrency(net),
      status: "paid",
      basic: fmtCurrency((p.salary || 0) * 0.5),
      hra: fmtCurrency((p.salary || 0) * 0.2),
      special: fmtCurrency((p.salary || 0) * 0.3),
      pf: fmtCurrency(ded * 0.4),
      tax: fmtCurrency(ded * 0.46),
      professional: fmtCurrency(200),
      other: fmtCurrency(ded * 0.14),
    };
  });

  const latest = PAYSLIPS[0];
  const ctc = employee?.salary ? employee.salary * 12 : 0;
  const monthlyGross = employee?.salary || 0;
  const monthlyNet = latest ? parseFloat(String(latest.net).replace(/[^0-9.]/g, "")) || 0 : 0;
  const deductions = latest ? parseFloat(String(latest.deductions).replace(/[^0-9.]/g, "")) || 0 : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* CTC summary */}
      <div style={{
        background:`linear-gradient(120deg, ${T.primary}, ${T.primaryDark})`,
        borderRadius:16, padding:"28px 32px", color:"#fff",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        boxShadow:"0 4px 20px rgba(79,70,229,.25)", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", right:-30, top:-30, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,.06)" }}/>
        <div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.65)", marginBottom:4, letterSpacing:".5px" }}>ANNUAL CTC</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:36, lineHeight:1 }}>{fmtCurrency(ctc)}</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.7)", marginTop:6 }}>{employee?.role || employee?.position || "—"} · {employee?.department || "—"}</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, position:"relative" }}>
          {[
            { label:"Monthly Gross", value: fmtCurrency(monthlyGross) },
            { label:"Monthly Net",   value: fmtCurrency(monthlyNet) },
            { label:"Deductions",    value: fmtCurrency(deductions) },
            { label:"YTD Earned",    value: fmtCurrency(monthlyNet * PAYSLIPS.length) },
          ].map(s=>(
            <div key={s.label} style={{ background:"rgba(255,255,255,.13)", borderRadius:10, padding:"10px 16px", backdropFilter:"blur(6px)" }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", marginBottom:2 }}>{s.label}</div>
              <div style={{ fontSize:17, fontWeight:700 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payslips list */}
      <Card style={{ padding:20 }}>
        <SectionTitle>Payslips</SectionTitle>
        {PAYSLIPS.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px 0", color:T.muted }}>No payslips found</div>
        ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {PAYSLIPS.map(p=>(
            <div key={p.id} style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"16px 20px", borderRadius:12, border:`1px solid ${T.border}`,
              background:T.surface, transition:"all .2s",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.background="#f5f3ff"; e.currentTarget.style.borderColor=T.primary+"44"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=T.surface; e.currentTarget.style.borderColor=T.border; }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:44, height:44, borderRadius:11, background:T.primaryLight, color:T.primary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>💰</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15 }}>{p.month}</div>
                  <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>Net Pay: <strong style={{ color:T.success }}>{p.net}</strong></div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:13, color:T.muted }}>Gross <strong style={{ color:T.text }}>{p.gross}</strong></div>
                  <div style={{ fontSize:13, color:T.muted }}>Deductions <strong style={{ color:T.danger }}>{p.deductions}</strong></div>
                </div>
                <StatusBadge status={p.status}/>
                <Btn variant="outline" onClick={()=>setSelected(p)} style={{ padding:"6px 16px" }}>View Slip</Btn>
              </div>
            </div>
          ))}
        </div>
        )}
      </Card>

      {/* Payslip detail modal */}
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={`Payslip — ${selected?.month}`} width={520}>
        {selected && (
          <div>
            {/* Net pay highlight */}
            <div style={{ background:`linear-gradient(90deg,${T.primary},${T.accent})`, borderRadius:12, padding:"16px 20px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.7)", marginBottom:2 }}>NET PAY</div>
                <div style={{ fontSize:28, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif" }}>{selected.net}</div>
              </div>
              <StatusBadge status={selected.status}/>
            </div>

            {/* Earnings */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.muted, letterSpacing:".5px", marginBottom:8 }}>EARNINGS</div>
              <BreakdownRow label="Basic Salary"        value={selected.basic}   />
              <BreakdownRow label="HRA"                 value={selected.hra}     />
              <BreakdownRow label="Special Allowance"   value={selected.special} />
              <BreakdownRow label="Gross Total" value={selected.gross} bold color={T.success}/>
            </div>

            {/* Deductions */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.muted, letterSpacing:".5px", marginBottom:8 }}>DEDUCTIONS</div>
              <BreakdownRow label="Provident Fund"      value={selected.pf}           />
              <BreakdownRow label="Income Tax (TDS)"    value={selected.tax}          />
              <BreakdownRow label="Professional Tax"    value={selected.professional} />
              <BreakdownRow label="Other Deductions"    value={selected.other}        />
              <BreakdownRow label="Total Deductions" value={selected.deductions} bold color={T.danger}/>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <Btn variant="outline" style={{ flex:1 }} onClick={()=>setSelected(null)}>Close</Btn>
              <Btn style={{ flex:1 }}>⬇ Download PDF</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}