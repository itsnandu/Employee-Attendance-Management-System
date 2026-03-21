// // src/pages/employee/EmpProfile.jsx
// import { useState, useEffect } from "react";
// import { T, Card, SectionTitle, Avatar, Btn, Input } from "../../components/employee/EmpUI";
// import useCurrentEmployee from "../../hooks/useCurrentEmployee";

// function InfoRow({ label, value }) {
//   return (
//     <div style={{ padding:"12px 0", borderBottom:`1px solid ${T.border}`, display:"flex", gap:16 }}>
//       <div style={{ fontSize:12, fontWeight:600, color:T.muted, letterSpacing:".4px", textTransform:"uppercase", minWidth:140 }}>{label}</div>
//       <div style={{ fontSize:14, fontWeight:500, color:T.text }}>{value || "—"}</div>
//     </div>
//   );
// }

// // ── Reusable Modal Shell ──────────────────────────────────────────────────────
// function Modal({ title, onClose, children }) {
//   return (
//     <div onClick={onClose} style={{
//       position:"fixed", inset:0, background:"rgba(0,0,0,0.4)",
//       display:"flex", alignItems:"center", justifyContent:"center",
//       zIndex:1000, padding:16,
//     }}>
//       <div onClick={e=>e.stopPropagation()} style={{
//         background:"#fff", borderRadius:16, padding:"28px 24px 24px",
//         width:"100%", maxWidth:420,
//         boxShadow:"0 8px 40px rgba(0,0,0,0.18)",
//         display:"flex", flexDirection:"column", gap:18,
//       }}>
//         <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//           <span style={{ fontSize:17, fontWeight:700, color:T.text }}>{title}</span>
//           <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, color:T.muted, cursor:"pointer", lineHeight:1 }}>✕</button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }

// // ── Change Password Modal ─────────────────────────────────────────────────────
// function ChangePasswordModal({ onClose }) {
//   const [form, setForm] = useState({ current:"", next:"", confirm:"" });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   function handleSubmit() {
//     if (!form.current || !form.next || !form.confirm) { setError("All fields are required."); return; }
//     if (form.next.length < 8) { setError("New password must be at least 8 characters."); return; }
//     if (form.next !== form.confirm) { setError("Passwords do not match."); return; }
//     setError("");
//     setSuccess(true);
//     setTimeout(onClose, 1500);
//   }

//   return (
//     <Modal title="🔑 Change Password" onClose={onClose}>
//       {success ? (
//         <div style={{ textAlign:"center", padding:"20px 0" }}>
//           <div style={{ fontSize:36, marginBottom:10 }}>✅</div>
//           <div style={{ fontWeight:700, color:T.success }}>Password updated successfully!</div>
//         </div>
//       ) : (
//         <>
//           {["current","next","confirm"].map((key, i) => (
//             <div key={key} style={{ display:"flex", flexDirection:"column", gap:5 }}>
//               <label style={{ fontSize:12, fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:".4px" }}>
//                 {["Current Password","New Password","Confirm New Password"][i]}
//               </label>
//               <input type="password" value={form[key]}
//                 onChange={e => setForm(p=>({...p,[key]:e.target.value}))}
//                 style={{ border:`1.5px solid ${T.border}`, borderRadius:8, padding:"10px 12px", fontSize:14, outline:"none", color:T.text }}
//               />
//             </div>
//           ))}
//           {error && <div style={{ fontSize:13, color:T.danger, background:"#fff0f0", borderRadius:6, padding:"8px 12px" }}>{error}</div>}
//           <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
//             <button onClick={onClose} style={{ background:"#f5f5f5", color:T.muted, border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
//             <button onClick={handleSubmit} style={{ background:T.primary, color:"#fff", border:"none", borderRadius:8, padding:"10px 22px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Update Password</button>
//           </div>
//         </>
//       )}
//     </Modal>
//   );
// }

// // ── Two-Factor Auth Modal ─────────────────────────────────────────────────────
// function TwoFactorModal({ onClose }) {
//   const [enabled, setEnabled] = useState(false);

//   return (
//     <Modal title="📱 Two-Factor Authentication" onClose={onClose}>
//       <div style={{ fontSize:14, color:T.muted, lineHeight:1.6 }}>
//         Two-factor authentication adds an extra layer of security to your account by requiring a code from your phone in addition to your password.
//       </div>
//       <div style={{
//         display:"flex", alignItems:"center", justifyContent:"space-between",
//         background:T.surface2, borderRadius:10, padding:"14px 16px",
//       }}>
//         <div>
//           <div style={{ fontSize:14, fontWeight:600, color:T.text }}>Authenticator App</div>
//           <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{enabled ? "Enabled" : "Not enabled"}</div>
//         </div>
//         <button onClick={()=>setEnabled(p=>!p)} style={{
//           background: enabled ? T.success : T.primary,
//           color:"#fff", border:"none", borderRadius:8,
//           padding:"8px 18px", fontSize:13, fontWeight:600, cursor:"pointer",
//         }}>{enabled ? "Disable" : "Enable"}</button>
//       </div>
//       {enabled && (
//         <div style={{ background:"#d1fae5", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#065f46", fontWeight:500 }}>
//           ✓ Two-factor authentication is now enabled on your account.
//         </div>
//       )}
//       <div style={{ display:"flex", justifyContent:"flex-end" }}>
//         <button onClick={onClose} style={{ background:"#f5f5f5", color:T.muted, border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Close</button>
//       </div>
//     </Modal>
//   );
// }

// // ── Download Profile PDF Modal ────────────────────────────────────────────────
// function DownloadPDFModal({ profile, onClose }) {
//   const [downloading, setDownloading] = useState(false);
//   const [done, setDone] = useState(false);

//   function handleDownload() {
//     setDownloading(true);
//     setTimeout(() => { setDownloading(false); setDone(true); }, 1500);
//   }

//   return (
//     <Modal title="📋 Download Profile PDF" onClose={onClose}>
//       <div style={{ fontSize:14, color:T.muted, lineHeight:1.6 }}>
//         This will export your profile data including personal information, work details, and contact info as a PDF document.
//       </div>
//       <div style={{ background:T.surface2, borderRadius:10, padding:"14px 16px", display:"flex", flexDirection:"column", gap:6 }}>
//         {["Personal Information","Work Information","Contact Details"].map(item => (
//           <div key={item} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:T.text }}>
//             <span style={{ color:T.success }}>✓</span> {item}
//           </div>
//         ))}
//       </div>
//       {done ? (
//         <div style={{ background:"#d1fae5", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#065f46", fontWeight:500 }}>
//           ✓ Profile PDF downloaded successfully!
//         </div>
//       ) : (
//         <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
//           <button onClick={onClose} style={{ background:"#f5f5f5", color:T.muted, border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
//           <button onClick={handleDownload} disabled={downloading} style={{
//             background: T.accent, color:"#fff", border:"none", borderRadius:8,
//             padding:"10px 22px", fontSize:13, fontWeight:600, cursor:"pointer", opacity: downloading ? 0.7 : 1,
//           }}>{downloading ? "Generating…" : "Download PDF"}</button>
//         </div>
//       )}
//     </Modal>
//   );
// }

// // ── Deactivate Account Modal ──────────────────────────────────────────────────
// function DeactivateModal({ onClose }) {
//   return (
//     <Modal title="🗑 Deactivate Account" onClose={onClose}>
//       <div style={{ background:"#fff0f0", borderRadius:10, padding:"14px 16px", fontSize:13, color:T.danger, lineHeight:1.6 }}>
//         ⚠️ Account deactivation is a permanent action and cannot be undone by yourself. Please contact your HR department for assistance.
//       </div>
//       <div style={{ fontSize:14, color:T.muted, lineHeight:1.6 }}>
//         To deactivate your account, please reach out to HR at <strong>hr@company.com</strong> or raise a support ticket through the HR portal.
//       </div>
//       <div style={{ display:"flex", justifyContent:"flex-end" }}>
//         <button onClick={onClose} style={{ background:"#f5f5f5", color:T.muted, border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Close</button>
//       </div>
//     </Modal>
//   );
// }

// function toProfile(emp) {
//   if (!emp) return { name: "", initials: "?", color: "#4f46e5", role: "", dept: "", email: "", phone: "", joined: "", empId: "—", manager: "", location: "", dob: "", blood: "", address: "", emergencyContact: "" };
//   return {
//     name: emp.name || [emp.first_name, emp.last_name].filter(Boolean).join(" ") || "",
//     initials: (emp.name || "?").slice(0, 2).toUpperCase(),
//     color: "#4f46e5",
//     role: emp.role || emp.position || "",
//     dept: emp.department || emp.dept || "",
//     email: emp.email || "",
//     phone: emp.phone || emp.phone_number || "",
//     joined: emp.joined || emp.joining_date || "",
//     empId: emp.id ? `EMP-${String(emp.id).padStart(4, "0")}` : "—",
//     manager: "",
//     location: "",
//     dob: "",
//     blood: "",
//     address: "",
//     emergencyContact: "",
//   };
// }

// // ── Main Component ────────────────────────────────────────────────────────────
// export default function EmpProfile() {
//   const { employee } = useCurrentEmployee();
//   const [editing, setEditing] = useState(false);
//   const [profile, setProfile] = useState(() => toProfile(employee));
//   const [saved, setSaved]     = useState(false);
//   const [modal, setModal]     = useState(null);

//   useEffect(() => {
//     if (employee) setProfile(toProfile(employee));
//   }, [employee]);

//   function save() {
//     setEditing(false);
//     setSaved(true);
//     setTimeout(()=>setSaved(false), 3000);
//   }

//   const f = (key) => ({
//     value: profile[key],
//     onChange: e => setProfile(p=>({...p,[key]:e.target.value})),
//   });

//   return (
//     <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

//       {/* Profile header card */}
//       <Card style={{ padding:28 }}>
//         <div style={{ display:"flex", alignItems:"flex-start", gap:24 }}>
//           <div style={{ position:"relative" }}>
//             <Avatar initials={profile.initials} color={profile.color} size={80}/>
//             <div style={{
//               position:"absolute", bottom:0, right:0,
//               width:24, height:24, borderRadius:"50%",
//               background:T.success, border:`2px solid ${T.surface}`,
//               display:"flex", alignItems:"center", justifyContent:"center", fontSize:12,
//             }}>✓</div>
//           </div>
//           <div style={{ flex:1 }}>
//             <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, color:T.text }}>{profile.name}</div>
//             <div style={{ fontSize:14, color:T.muted, marginTop:4 }}>{profile.role} · {profile.dept}</div>
//             <div style={{ display:"flex", gap:16, marginTop:12, flexWrap:"wrap" }}>
//               {[
//                 { icon:"🪪", label:profile.empId },
//                 { icon:"📧", label:profile.email },
//                 { icon:"📍", label:profile.location },
//               ].map(b=>(
//                 <div key={b.label} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:T.muted }}>
//                   <span>{b.icon}</span><span>{b.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div style={{ display:"flex", gap:8 }}>
//             {saved && (
//               <div style={{ padding:"8px 16px", borderRadius:9, background:"#d1fae5", color:"#065f46", fontSize:13, fontWeight:600 }}>✓ Saved!</div>
//             )}
//             {editing
//               ? <><Btn variant="ghost" onClick={()=>setEditing(false)}>Cancel</Btn><Btn onClick={save}>Save Changes</Btn></>
//               : <Btn variant="outline" onClick={()=>setEditing(true)}>✏ Edit Profile</Btn>
//             }
//           </div>
//         </div>
//       </Card>

//       <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

//         {/* Personal info */}
//         <Card style={{ padding:20 }}>
//           <SectionTitle>Personal Information</SectionTitle>
//           {editing ? (
//             <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
//               <Input label="FULL NAME"    {...f("name")}  />
//               <Input label="PHONE"        {...f("phone")} />
//               <Input label="DATE OF BIRTH" type="date" value="1995-08-15" onChange={()=>{}} />
//               <Input label="BLOOD GROUP"  {...f("blood")} />
//               <Input label="ADDRESS"      {...f("address")} />
//             </div>
//           ) : (
//             <div>
//               <InfoRow label="Full Name"     value={profile.name}    />
//               <InfoRow label="Phone"         value={profile.phone}   />
//               <InfoRow label="Date of Birth" value={profile.dob}     />
//               <InfoRow label="Blood Group"   value={profile.blood}   />
//               <InfoRow label="Address"       value={profile.address} />
//             </div>
//           )}
//         </Card>

//         {/* Work info */}
//         <Card style={{ padding:20 }}>
//           <SectionTitle>Work Information</SectionTitle>
//           <InfoRow label="Employee ID"   value={profile.empId}   />
//           <InfoRow label="Department"    value={profile.dept}    />
//           <InfoRow label="Designation"   value={profile.role}    />
//           <InfoRow label="Reporting To"  value={profile.manager} />
//           <InfoRow label="Date Joined"   value={profile.joined}  />
//           <InfoRow label="Work Location" value={profile.location}/>
//         </Card>

//         {/* Contact info */}
//         <Card style={{ padding:20 }}>
//           <SectionTitle>Contact Information</SectionTitle>
//           {editing ? (
//             <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
//               <Input label="EMAIL"              {...f("email")}            disabled/>
//               <Input label="PHONE"              {...f("phone")}            />
//               <Input label="LOCATION"           {...f("location")}         />
//               <Input label="EMERGENCY CONTACT"  {...f("emergencyContact")} />
//             </div>
//           ) : (
//             <div>
//               <InfoRow label="Email"             value={profile.email}            />
//               <InfoRow label="Phone"             value={profile.phone}            />
//               <InfoRow label="Location"          value={profile.location}         />
//               <InfoRow label="Emergency Contact" value={profile.emergencyContact} />
//             </div>
//           )}
//         </Card>

//         {/* Account & Security */}
//         <Card style={{ padding:20 }}>
//           <SectionTitle>Account &amp; Security</SectionTitle>
//           <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
//             {[
//               { icon:"🔑", label:"Change Password",     sub:"Last changed 3 months ago", color:T.primary, key:"password"   },
//               { icon:"📱", label:"Two-Factor Auth",      sub:"Not enabled",               color:T.warning, key:"2fa"        },
//               { icon:"📋", label:"Download Profile PDF", sub:"Export your profile data",  color:T.accent,  key:"pdf"        },
//               { icon:"🗑", label:"Deactivate Account",  sub:"Contact HR for assistance", color:T.danger,  key:"deactivate" },
//             ].map(a => (
//               <button key={a.key} onClick={() => setModal(a.key)} style={{
//                 display:"flex", alignItems:"center", gap:14, padding:"12px 14px",
//                 borderRadius:10, border:`1px solid ${T.border}`, background:T.surface,
//                 cursor:"pointer", textAlign:"left", width:"100%", transition:"all .2s",
//               }}
//                 onMouseEnter={e=>e.currentTarget.style.background=T.surface2}
//                 onMouseLeave={e=>e.currentTarget.style.background=T.surface}
//               >
//                 <div style={{ width:38, height:38, borderRadius:9, background:`${a.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{a.icon}</div>
//                 <div>
//                   <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{a.label}</div>
//                   <div style={{ fontSize:11, color:T.muted }}>{a.sub}</div>
//                 </div>
//                 <div style={{ marginLeft:"auto", color:T.muted, fontSize:16 }}>›</div>
//               </button>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* ── Modals ── */}
//       {modal === "password"   && <ChangePasswordModal  onClose={() => setModal(null)} />}
//       {modal === "2fa"        && <TwoFactorModal        onClose={() => setModal(null)} />}
//       {modal === "pdf"        && <DownloadPDFModal      profile={profile} onClose={() => setModal(null)} />}
//       {modal === "deactivate" && <DeactivateModal       onClose={() => setModal(null)} />}
//     </div>
//   );
// }

// src/pages/employee/EmpProfile.jsx
// src/pages/employee/EmpProfile.jsx
import { useState, useEffect } from "react";
import { T, Card, SectionTitle, Avatar, Btn, Input } from "../../components/employee/EmpUI";
import useCurrentEmployee from "../../hooks/useCurrentEmployee";

// ── SVG Icons ──────────────────────────────────────────────────
const IcoId = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
    <path d="M7 15h.01M11 15h2M15 15h2"/>
  </svg>
);
const IcoMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IcoPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IcoKey = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);
const IcoShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IcoDownload = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="12" x2="12" y2="18"/>
    <polyline points="9 15 12 18 15 15"/>
  </svg>
);
const IcoTrash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const IcoChevron = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IcoCheckCircle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

function InfoRow({ label, value }) {
  return (
    <div style={{ padding:"12px 0", borderBottom:`1px solid ${T.border}`, display:"flex", gap:16 }}>
      <div style={{ fontSize:12, fontWeight:700, color:T.muted, letterSpacing:".5px", textTransform:"uppercase", minWidth:140 }}>{label}</div>
      <div style={{ fontSize:14, fontWeight:500, color:value ? T.text : T.muted }}>{value || "—"}</div>
    </div>
  );
}

// ── Modal Shell ──────────────────────────────────────────────
function Modal({ title, icon, iconBg, onClose, children }) {
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(15,23,42,.45)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, padding:16, backdropFilter:"blur(3px)",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#fff", borderRadius:20, width:"100%", maxWidth:440,
        boxShadow:"0 24px 64px rgba(0,0,0,.2)", overflow:"hidden",
      }}>
        {/* Modal header */}
        <div style={{
          background: iconBg || "linear-gradient(135deg,#0061f2,#0052cc)",
          padding:"18px 24px", display:"flex", alignItems:"center", gap:12,
        }}>
          {icon && (
            <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 }}>
              {icon}
            </div>
          )}
          <div style={{ flex:1, fontWeight:800, fontSize:15, color:"#fff" }}>{title}</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)", border:"none", cursor:"pointer", width:28, height:28, borderRadius:7, color:"#fff", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding:24, display:"flex", flexDirection:"column", gap:16 }}>{children}</div>
      </div>
    </div>
  );
}

// ── Change Password Modal ────────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current:"", next:"", confirm:"" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit() {
    if (!form.current || !form.next || !form.confirm) { setError("All fields are required."); return; }
    if (form.next.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.next !== form.confirm) { setError("Passwords do not match."); return; }
    setError(""); setSuccess(true); setTimeout(onClose, 1500);
  }

  const inputStyle = { border:`1.5px solid ${T.border}`, borderRadius:9, padding:"10px 14px", fontSize:14, outline:"none", color:T.text, fontFamily:"'DM Sans',sans-serif", transition:"border-color .2s", width:"100%", boxSizing:"border-box" };

  return (
    <Modal title="Change Password" icon={<IcoKey/>} onClose={onClose}>
      {success ? (
        <div style={{ textAlign:"center", padding:"16px 0" }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:"#d1fae5", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", color:"#10b981" }}><IcoCheckCircle/></div>
          <div style={{ fontWeight:700, color:"#065f46", fontSize:16 }}>Password updated successfully!</div>
        </div>
      ) : (
        <>
          {["current","next","confirm"].map((key, i) => (
            <div key={key} style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".5px" }}>
                {["Current Password","New Password","Confirm New Password"][i]}
              </label>
              <input type="password" value={form[key]}
                onChange={e => setForm(p=>({...p,[key]:e.target.value}))}
                onFocus={e => e.target.style.borderColor="#0061f2"}
                onBlur={e  => e.target.style.borderColor=T.border}
                style={inputStyle}
              />
            </div>
          ))}
          {error && <div style={{ fontSize:13, color:T.danger, background:"#fff0f0", border:"1px solid #fca5a5", borderRadius:8, padding:"8px 12px" }}>{error}</div>}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button onClick={onClose} style={{ background:"#f1f5f9", color:T.muted, border:"none", borderRadius:9, padding:"9px 20px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
            <button onClick={handleSubmit} style={{ background:"linear-gradient(135deg,#0061f2,#0052cc)", color:"#fff", border:"none", borderRadius:9, padding:"9px 22px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", boxShadow:"0 4px 12px rgba(0,97,242,.3)" }}>Update Password</button>
          </div>
        </>
      )}
    </Modal>
  );
}

// ── Two-Factor Auth Modal ─────────────────────────────────────
function TwoFactorModal({ onClose }) {
  const [enabled, setEnabled] = useState(false);
  return (
    <Modal title="Two-Factor Authentication" icon={<IcoShield/>} onClose={onClose}>
      <div style={{ fontSize:14, color:T.muted, lineHeight:1.6 }}>
        Two-factor authentication adds an extra layer of security to your account by requiring a code from your phone in addition to your password.
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:T.surface2, borderRadius:12, padding:"14px 16px" }}>
        <div>
          <div style={{ fontSize:14, fontWeight:600, color:T.text }}>Authenticator App</div>
          <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{enabled ? "Enabled" : "Not enabled"}</div>
        </div>
        <button onClick={()=>setEnabled(p=>!p)} style={{
          background: enabled ? "#10b981" : "#0061f2",
          color:"#fff", border:"none", borderRadius:9,
          padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer",
        }}>{enabled ? "Disable" : "Enable"}</button>
      </div>
      {enabled && (
        <div style={{ background:"#d1fae5", borderRadius:9, padding:"10px 14px", fontSize:13, color:"#065f46", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
          <IcoCheckCircle/> Two-factor authentication is now enabled.
        </div>
      )}
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <button onClick={onClose} style={{ background:"#f1f5f9", color:T.muted, border:"none", borderRadius:9, padding:"9px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Close</button>
      </div>
    </Modal>
  );
}

// ── Download PDF Modal ────────────────────────────────────────
function DownloadPDFModal({ profile, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  function handleDownload() {
    setDownloading(true);
    setTimeout(() => { setDownloading(false); setDone(true); }, 1500);
  }

  return (
    <Modal title="Download Profile PDF" icon={<IcoDownload/>} iconBg="linear-gradient(135deg,#0284c7,#0061f2)" onClose={onClose}>
      <div style={{ fontSize:14, color:T.muted, lineHeight:1.6 }}>
        This will export your profile data including personal information, work details, and contact info as a PDF document.
      </div>
      <div style={{ background:T.surface2, borderRadius:12, padding:"14px 16px", display:"flex", flexDirection:"column", gap:8 }}>
        {["Personal Information","Work Information","Contact Details"].map(item => (
          <div key={item} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:T.text }}>
            <span style={{ color:"#10b981", display:"flex" }}><IcoCheckCircle/></span> {item}
          </div>
        ))}
      </div>
      {done ? (
        <div style={{ background:"#d1fae5", borderRadius:9, padding:"10px 14px", fontSize:13, color:"#065f46", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
          <IcoCheckCircle/> Profile PDF downloaded successfully!
        </div>
      ) : (
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ background:"#f1f5f9", color:T.muted, border:"none", borderRadius:9, padding:"9px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button onClick={handleDownload} disabled={downloading} style={{
            background:"linear-gradient(135deg,#0284c7,#0061f2)", color:"#fff", border:"none", borderRadius:9,
            padding:"9px 22px", fontSize:13, fontWeight:700, cursor:"pointer", opacity:downloading ? 0.7 : 1,
            display:"flex", alignItems:"center", gap:7,
          }}>
            <IcoDownload/>{downloading ? "Generating…" : "Download PDF"}
          </button>
        </div>
      )}
    </Modal>
  );
}

// ── Deactivate Account Modal ──────────────────────────────────
function DeactivateModal({ onClose }) {
  return (
    <Modal title="Deactivate Account" icon={<IcoTrash/>} iconBg="linear-gradient(135deg,#ef4444,#dc2626)" onClose={onClose}>
      <div style={{ background:"#fff0f0", border:"1px solid #fca5a5", borderRadius:10, padding:"14px 16px", fontSize:13, color:T.danger, lineHeight:1.6 }}>
        ⚠️ Account deactivation is permanent and cannot be undone by yourself. Please contact your HR department for assistance.
      </div>
      <div style={{ fontSize:14, color:T.muted, lineHeight:1.6 }}>
        To deactivate your account, please reach out to HR at <strong>hr@company.com</strong> or raise a support ticket through the HR portal.
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <button onClick={onClose} style={{ background:"#f1f5f9", color:T.muted, border:"none", borderRadius:9, padding:"9px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Close</button>
      </div>
    </Modal>
  );
}

function toProfile(emp) {
  if (!emp) return { name:"", initials:"?", color:"#0061f2", role:"", dept:"", email:"", phone:"", joined:"", empId:"—", manager:"", location:"", dob:"", blood:"", address:"", emergencyContact:"" };
  return {
    name:     emp.name || [emp.first_name, emp.last_name].filter(Boolean).join(" ") || "",
    initials: (emp.name || "?").slice(0, 2).toUpperCase(),
    color:    "#0061f2",
    role:     emp.role || emp.position || "",
    dept:     emp.department || emp.dept || "",
    email:    emp.email || "",
    phone:    emp.phone || emp.phone_number || "",
    joined:   emp.joined || emp.joining_date || "",
    empId:    emp.id ? `EMP-${String(emp.id).padStart(4, "0")}` : "—",
    manager:"", location:"", dob:"", blood:"", address:"", emergencyContact:"",
  };
}

// ── Main Component ────────────────────────────────────────────
export default function EmpProfile() {
  const { employee } = useCurrentEmployee();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(() => toProfile(employee));
  const [saved, setSaved]     = useState(false);
  const [modal, setModal]     = useState(null);

  useEffect(() => { if (employee) setProfile(toProfile(employee)); }, [employee]);

  function save() { setEditing(false); setSaved(true); setTimeout(()=>setSaved(false), 3000); }
  const f = key => ({ value:profile[key], onChange:e => setProfile(p=>({...p,[key]:e.target.value})) });

  const SECURITY_ACTIONS = [
    { Ico:IcoKey,      label:"Change Password",     sub:"Last changed 3 months ago", color:"#0061f2", key:"password"   },
    { Ico:IcoShield,   label:"Two-Factor Auth",      sub:"Not enabled",               color:"#f59e0b", key:"2fa"        },
    { Ico:IcoDownload, label:"Download Profile PDF", sub:"Export your profile data",  color:"#0284c7", key:"pdf"        },
    { Ico:IcoTrash,    label:"Deactivate Account",   sub:"Contact HR for assistance", color:"#ef4444", key:"deactivate" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* ── Profile header ── */}
      <Card style={{ padding:28 }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:24 }}>
          {/* Avatar with online dot */}
          <div style={{ position:"relative" }}>
            <Avatar initials={profile.initials} color={profile.color} size={80}/>
            <div style={{
              position:"absolute", bottom:2, right:2,
              width:22, height:22, borderRadius:"50%",
              background:"#10b981", border:`2.5px solid #fff`,
              display:"flex", alignItems:"center", justifyContent:"center", color:"#fff",
            }}><IcoCheck/></div>
          </div>

          {/* Name / role / meta */}
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:24, color:T.text, lineHeight:1.1 }}>{profile.name}</div>
            <div style={{ fontSize:14, color:T.muted, marginTop:5, fontWeight:500 }}>
              {profile.role}{profile.role && profile.dept ? " · " : ""}{profile.dept}
            </div>
            <div style={{ display:"flex", gap:18, marginTop:12, flexWrap:"wrap" }}>
              {[
                { Ico:IcoId,   label:profile.empId   },
                { Ico:IcoMail, label:profile.email    },
                { Ico:IcoPin,  label:profile.location },
              ].filter(b => b.label).map(b => (
                <div key={b.label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:T.muted }}>
                  <span style={{ color:"#0061f2", display:"flex" }}><b.Ico/></span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:"flex", gap:8, flexShrink:0 }}>
            {saved && (
              <div style={{ padding:"8px 14px", borderRadius:9, background:"#d1fae5", color:"#065f46", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                <IcoCheckCircle/> Saved!
              </div>
            )}
            {editing ? (
              <>
                <Btn variant="ghost" onClick={() => setEditing(false)}>Cancel</Btn>
                <Btn onClick={save}>Save Changes</Btn>
              </>
            ) : (
              <button onClick={() => setEditing(true)} style={{
                display:"flex", alignItems:"center", gap:7,
                padding:"9px 18px", borderRadius:10,
                border:"1.5px solid #0061f2", background:"#dbeafe", color:"#0061f2",
                fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                transition:"all .2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background="#0061f2"; e.currentTarget.style.color="#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background="#dbeafe"; e.currentTarget.style.color="#0061f2"; }}
              >
                <IcoEdit/> Edit Profile
              </button>
            )}
          </div>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* Personal info */}
        <Card style={{ padding:20 }}>
          <SectionTitle>Personal Information</SectionTitle>
          {editing ? (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <Input label="FULL NAME"     {...f("name")}    />
              <Input label="PHONE"         {...f("phone")}   />
              <Input label="DATE OF BIRTH" type="date" value="" onChange={()=>{}} />
              <Input label="BLOOD GROUP"   {...f("blood")}   />
              <Input label="ADDRESS"       {...f("address")} />
            </div>
          ) : (
            <div>
              <InfoRow label="Full Name"     value={profile.name}    />
              <InfoRow label="Phone"         value={profile.phone}   />
              <InfoRow label="Date of Birth" value={profile.dob}     />
              <InfoRow label="Blood Group"   value={profile.blood}   />
              <InfoRow label="Address"       value={profile.address} />
            </div>
          )}
        </Card>

        {/* Work info */}
        <Card style={{ padding:20 }}>
          <SectionTitle>Work Information</SectionTitle>
          <InfoRow label="Employee ID"   value={profile.empId}   />
          <InfoRow label="Department"    value={profile.dept}    />
          <InfoRow label="Designation"   value={profile.role}    />
          <InfoRow label="Reporting To"  value={profile.manager} />
          <InfoRow label="Date Joined"   value={profile.joined}  />
          <InfoRow label="Work Location" value={profile.location}/>
        </Card>

        {/* Contact info */}
        <Card style={{ padding:20 }}>
          <SectionTitle>Contact Information</SectionTitle>
          {editing ? (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <Input label="EMAIL"             {...f("email")}            disabled/>
              <Input label="PHONE"             {...f("phone")}            />
              <Input label="LOCATION"          {...f("location")}         />
              <Input label="EMERGENCY CONTACT" {...f("emergencyContact")} />
            </div>
          ) : (
            <div>
              <InfoRow label="Email"             value={profile.email}            />
              <InfoRow label="Phone"             value={profile.phone}            />
              <InfoRow label="Location"          value={profile.location}         />
              <InfoRow label="Emergency Contact" value={profile.emergencyContact} />
            </div>
          )}
        </Card>

        {/* Account & Security */}
        <Card style={{ padding:20 }}>
          <SectionTitle>Account &amp; Security</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {SECURITY_ACTIONS.map(a => (
              <button key={a.key} onClick={() => setModal(a.key)}
                onMouseEnter={e => { e.currentTarget.style.background=T.surface2; e.currentTarget.style.borderColor=a.color; }}
                onMouseLeave={e => { e.currentTarget.style.background=T.surface;  e.currentTarget.style.borderColor=T.border; }}
                style={{
                  display:"flex", alignItems:"center", gap:14, padding:"12px 14px",
                  borderRadius:12, border:`1px solid ${T.border}`, background:T.surface,
                  cursor:"pointer", textAlign:"left", width:"100%", transition:"all .2s",
                }}
              >
                <div style={{ width:40, height:40, borderRadius:11, background:`${a.color}15`, color:a.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <a.Ico/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{a.label}</div>
                  <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{a.sub}</div>
                </div>
                <div style={{ color:T.muted, display:"flex" }}><IcoChevron/></div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Modals ── */}
      {modal === "password"   && <ChangePasswordModal                           onClose={() => setModal(null)} />}
      {modal === "2fa"        && <TwoFactorModal                                 onClose={() => setModal(null)} />}
      {modal === "pdf"        && <DownloadPDFModal profile={profile}             onClose={() => setModal(null)} />}
      {modal === "deactivate" && <DeactivateModal                                onClose={() => setModal(null)} />}
    </div>
  );
}

