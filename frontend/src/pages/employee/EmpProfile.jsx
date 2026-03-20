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
import { useState, useEffect } from "react";
import { T, Card, SectionTitle, Avatar, Btn, Input } from "../../components/employee/EmpUI";
import useCurrentEmployee from "../../hooks/useCurrentEmployee";

function InfoRow({ label, value }) {
  return (
    <div style={{ padding:"12px 0", borderBottom:`1px solid ${T.border}`, display:"flex", gap:16 }}>
      <div style={{ fontSize:12, fontWeight:600, color:T.muted, letterSpacing:".4px", textTransform:"uppercase", minWidth:140 }}>{label}</div>
      <div style={{ fontSize:14, fontWeight:500, color:T.text }}>{value || "—"}</div>
    </div>
  );
}

// ── Reusable Modal Shell ──────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.4)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, padding:16,
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#fff", borderRadius:16, padding:"28px 24px 24px",
        width:"100%", maxWidth:420,
        boxShadow:"0 8px 40px rgba(0,0,0,0.18)",
        display:"flex", flexDirection:"column", gap:18,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:17, fontWeight:700, color:T.text }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, color:T.muted, cursor:"pointer", lineHeight:1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Change Password Modal ─────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current:"", next:"", confirm:"" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit() {
    if (!form.current || !form.next || !form.confirm) { setError("All fields are required."); return; }
    if (form.next.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.next !== form.confirm) { setError("Passwords do not match."); return; }
    setError("");
    setSuccess(true);
    setTimeout(onClose, 1500);
  }

  return (
    <Modal title="🔑 Change Password" onClose={onClose}>
      {success ? (
        <div style={{ textAlign:"center", padding:"20px 0" }}>
          <div style={{ fontSize:36, marginBottom:10 }}>✅</div>
          <div style={{ fontWeight:700, color:T.success }}>Password updated successfully!</div>
        </div>
      ) : (
        <>
          {["current","next","confirm"].map((key, i) => (
            <div key={key} style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <label style={{ fontSize:12, fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:".4px" }}>
                {["Current Password","New Password","Confirm New Password"][i]}
              </label>
              <input type="password" value={form[key]}
                onChange={e => setForm(p=>({...p,[key]:e.target.value}))}
                style={{ border:`1.5px solid ${T.border}`, borderRadius:8, padding:"10px 12px", fontSize:14, outline:"none", color:T.text }}
              />
            </div>
          ))}
          {error && <div style={{ fontSize:13, color:T.danger, background:"#fff0f0", borderRadius:6, padding:"8px 12px" }}>{error}</div>}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button onClick={onClose} style={{ background:"#f5f5f5", color:T.muted, border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
            <button onClick={handleSubmit} style={{ background:T.primary, color:"#fff", border:"none", borderRadius:8, padding:"10px 22px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Update Password</button>
          </div>
        </>
      )}
    </Modal>
  );
}

// ── Two-Factor Auth Modal ─────────────────────────────────────────────────────
function TwoFactorModal({ onClose }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <Modal title="📱 Two-Factor Authentication" onClose={onClose}>
      <div style={{ fontSize:14, color:T.muted, lineHeight:1.6 }}>
        Two-factor authentication adds an extra layer of security to your account by requiring a code from your phone in addition to your password.
      </div>
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:T.surface2, borderRadius:10, padding:"14px 16px",
      }}>
        <div>
          <div style={{ fontSize:14, fontWeight:600, color:T.text }}>Authenticator App</div>
          <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{enabled ? "Enabled" : "Not enabled"}</div>
        </div>
        <button onClick={()=>setEnabled(p=>!p)} style={{
          background: enabled ? T.success : T.primary,
          color:"#fff", border:"none", borderRadius:8,
          padding:"8px 18px", fontSize:13, fontWeight:600, cursor:"pointer",
        }}>{enabled ? "Disable" : "Enable"}</button>
      </div>
      {enabled && (
        <div style={{ background:"#d1fae5", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#065f46", fontWeight:500 }}>
          ✓ Two-factor authentication is now enabled on your account.
        </div>
      )}
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <button onClick={onClose} style={{ background:"#f5f5f5", color:T.muted, border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Close</button>
      </div>
    </Modal>
  );
}

// ── Download Profile PDF Modal ────────────────────────────────────────────────
function DownloadPDFModal({ profile, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  function handleDownload() {
    setDownloading(true);
    setTimeout(() => { setDownloading(false); setDone(true); }, 1500);
  }

  return (
    <Modal title="📋 Download Profile PDF" onClose={onClose}>
      <div style={{ fontSize:14, color:T.muted, lineHeight:1.6 }}>
        This will export your profile data including personal information, work details, and contact info as a PDF document.
      </div>
      <div style={{ background:T.surface2, borderRadius:10, padding:"14px 16px", display:"flex", flexDirection:"column", gap:6 }}>
        {["Personal Information","Work Information","Contact Details"].map(item => (
          <div key={item} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:T.text }}>
            <span style={{ color:T.success }}>✓</span> {item}
          </div>
        ))}
      </div>
      {done ? (
        <div style={{ background:"#d1fae5", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#065f46", fontWeight:500 }}>
          ✓ Profile PDF downloaded successfully!
        </div>
      ) : (
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ background:"#f5f5f5", color:T.muted, border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button onClick={handleDownload} disabled={downloading} style={{
            background: T.accent, color:"#fff", border:"none", borderRadius:8,
            padding:"10px 22px", fontSize:13, fontWeight:600, cursor:"pointer", opacity: downloading ? 0.7 : 1,
          }}>{downloading ? "Generating…" : "Download PDF"}</button>
        </div>
      )}
    </Modal>
  );
}

// ── Deactivate Account Modal ──────────────────────────────────────────────────
function DeactivateModal({ onClose }) {
  return (
    <Modal title="🗑 Deactivate Account" onClose={onClose}>
      <div style={{ background:"#fff0f0", borderRadius:10, padding:"14px 16px", fontSize:13, color:T.danger, lineHeight:1.6 }}>
        ⚠️ Account deactivation is a permanent action and cannot be undone by yourself. Please contact your HR department for assistance.
      </div>
      <div style={{ fontSize:14, color:T.muted, lineHeight:1.6 }}>
        To deactivate your account, please reach out to HR at <strong>hr@company.com</strong> or raise a support ticket through the HR portal.
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <button onClick={onClose} style={{ background:"#f5f5f5", color:T.muted, border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Close</button>
      </div>
    </Modal>
  );
}

function toProfile(emp) {
  if (!emp) return { name: "", initials: "?", color: "#0061f2", role: "", dept: "", email: "", phone: "", joined: "", empId: "—", manager: "", location: "", dob: "", blood: "", address: "", emergencyContact: "" };
  return {
    name: emp.name || [emp.first_name, emp.last_name].filter(Boolean).join(" ") || "",
    initials: (emp.name || "?").slice(0, 2).toUpperCase(),
    color: "#0061f2",
    role: emp.role || emp.position || "",
    dept: emp.department || emp.dept || "",
    email: emp.email || "",
    phone: emp.phone || emp.phone_number || "",
    joined: emp.joined || emp.joining_date || "",
    empId: emp.id ? `EMP-${String(emp.id).padStart(4, "0")}` : "—",
    manager: "",
    location: "",
    dob: "",
    blood: "",
    address: "",
    emergencyContact: "",
  };
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function EmpProfile() {
  const { employee } = useCurrentEmployee();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(() => toProfile(employee));
  const [saved, setSaved]     = useState(false);
  const [modal, setModal]     = useState(null);

  useEffect(() => {
    if (employee) setProfile(toProfile(employee));
  }, [employee]);

  function save() {
    setEditing(false);
    setSaved(true);
    setTimeout(()=>setSaved(false), 3000);
  }

  const f = (key) => ({
    value: profile[key],
    onChange: e => setProfile(p=>({...p,[key]:e.target.value})),
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Profile header card */}
      <Card style={{ padding:28 }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:24 }}>
          <div style={{ position:"relative" }}>
            <Avatar initials={profile.initials} color={profile.color} size={80}/>
            <div style={{
              position:"absolute", bottom:0, right:0,
              width:24, height:24, borderRadius:"50%",
              background:T.success, border:`2px solid ${T.surface}`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:12,
            }}>✓</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:24, color:T.text }}>{profile.name}</div>
            <div style={{ fontSize:14, color:T.muted, marginTop:4 }}>{profile.role} · {profile.dept}</div>
            <div style={{ display:"flex", gap:16, marginTop:12, flexWrap:"wrap" }}>
              {[
                { icon:"🪪", label:profile.empId },
                { icon:"📧", label:profile.email },
                { icon:"📍", label:profile.location },
              ].map(b=>(
                <div key={b.label} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:T.muted }}>
                  <span>{b.icon}</span><span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {saved && (
              <div style={{ padding:"8px 16px", borderRadius:9, background:"#d1fae5", color:"#065f46", fontSize:13, fontWeight:600 }}>✓ Saved!</div>
            )}
            {editing
              ? <><Btn variant="ghost" onClick={()=>setEditing(false)}>Cancel</Btn><Btn onClick={save}>Save Changes</Btn></>
              : <Btn variant="outline" onClick={()=>setEditing(true)}>✏ Edit Profile</Btn>
            }
          </div>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* Personal info */}
        <Card style={{ padding:20 }}>
          <SectionTitle>Personal Information</SectionTitle>
          {editing ? (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <Input label="FULL NAME"    {...f("name")}  />
              <Input label="PHONE"        {...f("phone")} />
              <Input label="DATE OF BIRTH" type="date" value="1995-08-15" onChange={()=>{}} />
              <Input label="BLOOD GROUP"  {...f("blood")} />
              <Input label="ADDRESS"      {...f("address")} />
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
              <Input label="EMAIL"              {...f("email")}            disabled/>
              <Input label="PHONE"              {...f("phone")}            />
              <Input label="LOCATION"           {...f("location")}         />
              <Input label="EMERGENCY CONTACT"  {...f("emergencyContact")} />
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
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { icon:"🔑", label:"Change Password",     sub:"Last changed 3 months ago", color:T.primary, key:"password"   },
              { icon:"📱", label:"Two-Factor Auth",      sub:"Not enabled",               color:T.warning, key:"2fa"        },
              { icon:"📋", label:"Download Profile PDF", sub:"Export your profile data",  color:T.accent,  key:"pdf"        },
              { icon:"🗑", label:"Deactivate Account",  sub:"Contact HR for assistance", color:T.danger,  key:"deactivate" },
            ].map(a => (
              <button key={a.key} onClick={() => setModal(a.key)} style={{
                display:"flex", alignItems:"center", gap:14, padding:"12px 14px",
                borderRadius:10, border:`1px solid ${T.border}`, background:T.surface,
                cursor:"pointer", textAlign:"left", width:"100%", transition:"all .2s",
              }}
                onMouseEnter={e=>e.currentTarget.style.background=T.surface2}
                onMouseLeave={e=>e.currentTarget.style.background=T.surface}
              >
                <div style={{ width:38, height:38, borderRadius:9, background:`${a.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{a.label}</div>
                  <div style={{ fontSize:11, color:T.muted }}>{a.sub}</div>
                </div>
                <div style={{ marginLeft:"auto", color:T.muted, fontSize:16 }}>›</div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Modals ── */}
      {modal === "password"   && <ChangePasswordModal  onClose={() => setModal(null)} />}
      {modal === "2fa"        && <TwoFactorModal        onClose={() => setModal(null)} />}
      {modal === "pdf"        && <DownloadPDFModal      profile={profile} onClose={() => setModal(null)} />}
      {modal === "deactivate" && <DeactivateModal       onClose={() => setModal(null)} />}
    </div>
  );
}