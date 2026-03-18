import { useState, useRef, useEffect } from "react";
import {
  Search, Plus, MoreVertical, Shield, ShieldCheck, ShieldOff,
  Edit2, Trash2, X, Eye, EyeOff, Check, ChevronDown, Users,
  Lock, Mail, Phone, Building2, UserCheck, UserX, Key, Filter
} from "lucide-react";
import employeeService from "../services/employeeService";

const ROLES = ["admin","manager","hr","employee"];
const DEPTS = ["Management","Engineering","Design","HR","Finance","Sales"];
const STATUSES = ["active","inactive","suspended"];

const ROLE_META = {
  admin:    { label:"Admin",    color:"#4f46e5", bg:"#ede9fe", icon:<Shield size={11}/> },
  manager:  { label:"Manager",  color:"#f59e0b", bg:"#fef3c7", icon:<ShieldCheck size={11}/> },
  hr:       { label:"HR",       color:"#8b5cf6", bg:"#f3e8ff", icon:<ShieldCheck size={11}/> },
  employee: { label:"Employee", color:"#06b6d4", bg:"#cffafe", icon:<Users size={11}/> },
};
const STATUS_META = {
  active:    { label:"Active",    color:"#10b981", bg:"#d1fae5", dot:"#10b981" },
  inactive:  { label:"Inactive",  color:"#64748b", bg:"#f1f5f9", dot:"#94a3b8" },
  suspended: { label:"Suspended", color:"#ef4444", bg:"#fee2e2", dot:"#ef4444" },
};

function Avatar({ initials, color, size = 36 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:99, flexShrink:0,
      background:color, color:"#fff",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize: size > 30 ? 13 : 10, fontWeight:700, letterSpacing:".5px",
    }}>{initials}</div>
  );
}

function RoleBadge({ role }) {
  const m = ROLE_META[role] || ROLE_META.employee;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700,
      color:m.color, background:m.bg,
    }}>
      {m.icon}{m.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.active;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700,
      color:m.color, background:m.bg,
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:m.dot, display:"inline-block" }}/>
      {m.label}
    </span>
  );
}

// ── Dropdown menu ─────────────────────────────────────────────
function ActionMenu({ user, onEdit, onDelete, onToggleStatus, onResetPassword }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const items = [
    { icon:<Edit2 size={14}/>,   label:"Edit User",       action: onEdit,                            color:"#0f172a" },
    { icon:<Key size={14}/>,     label:"Reset Password",  action: onResetPassword,                   color:"#f59e0b" },
    { icon: user.status === "active"
        ? <UserX size={14}/>
        : <UserCheck size={14}/>,
      label: user.status === "active" ? "Suspend User" : "Activate User",
      action: onToggleStatus,
      color: user.status === "active" ? "#ef4444" : "#10b981",
    },
    { icon:<Trash2 size={14}/>,  label:"Delete User",     action: onDelete,                          color:"#ef4444" },
  ];

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width:32, height:32, borderRadius:8, border:"1px solid #e2e8f0",
        background: open ? "#f5f3ff" : "#fff", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b",
      }}>
        <MoreVertical size={15}/>
      </button>
      {open && (
        <div style={{
          position:"absolute", right:0, top:"calc(100% + 4px)", zIndex:100,
          background:"#fff", border:"1px solid #e2e8f0", borderRadius:12,
          boxShadow:"0 8px 30px rgba(0,0,0,.12)", minWidth:180, overflow:"hidden",
          animation:"dropIn .15s ease",
        }}>
          {items.map(it => (
            <button key={it.label} onClick={() => { it.action(); setOpen(false); }} style={{
              display:"flex", alignItems:"center", gap:10,
              width:"100%", padding:"10px 14px", border:"none",
              background:"#fff", cursor:"pointer", fontSize:13,
              color:it.color, fontFamily:"'DM Sans',sans-serif", fontWeight:500,
              textAlign:"left", transition:"background .15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              {it.icon}{it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Add / Edit User Modal ─────────────────────────────────────
function UserModal({ user, onClose, onSave, departments }) {
  const isEdit = !!user;
  const [form, setForm] = useState(user ? { ...user } : {
    name:"", email:"", phone:"", role:"employee", dept:"Engineering", status:"active", password:"",
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  function validate() {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const initials = form.name.trim().split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
    onSave({ ...form, initials, color: user?.color || ROLE_META[form.role]?.color || "#4f46e5" });
  }

  const Field = ({ label, children, error }) => (
    <div style={{ marginBottom: error ? 6 : 14 }}>
      <label style={{ fontSize:12, fontWeight:700, color:"#64748b", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".4px" }}>{label}</label>
      {children}
      {error && <div style={{ fontSize:11, color:"#ef4444", marginTop:4 }}>{error}</div>}
    </div>
  );

  const inputStyle = (hasError) => ({
    width:"100%", boxSizing:"border-box", padding:"10px 14px",
    border:`1.5px solid ${hasError ? "#ef4444" : "#e2e8f0"}`, borderRadius:9,
    fontSize:13, color:"#0f172a", outline:"none",
    fontFamily:"'DM Sans',sans-serif", background:"#f8fafc",
  });

  const selectStyle = {
    width:"100%", boxSizing:"border-box", padding:"10px 14px",
    border:"1.5px solid #e2e8f0", borderRadius:9, fontSize:13,
    color:"#0f172a", outline:"none", fontFamily:"'DM Sans',sans-serif",
    background:"#f8fafc", cursor:"pointer", appearance:"none",
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:999,
      background:"rgba(15,23,42,.5)", backdropFilter:"blur(4px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background:"#fff", borderRadius:20, width:"100%", maxWidth:520,
        maxHeight:"90vh", display:"flex", flexDirection:"column",
        boxShadow:"0 32px 80px rgba(0,0,0,.2)", animation:"modalIn .2s ease",
      }}>
        {/* Header */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"20px 24px 16px", borderBottom:"1px solid #f1f5f9",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              width:40, height:40, borderRadius:12,
              background: isEdit ? "#ede9fe" : "#d1fae5",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {isEdit ? <Edit2 size={18} color="#4f46e5"/> : <Plus size={18} color="#10b981"/>}
            </div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, color:"#0f172a" }}>
                {isEdit ? "Edit User" : "Add New User"}
              </div>
              <div style={{ fontSize:12, color:"#94a3b8" }}>
                {isEdit ? `Editing ${user.name}` : "Create a new user account"}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width:32, height:32, borderRadius:8, border:"1px solid #e2e8f0",
            background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b",
          }}><X size={16}/></button>
        </div>

        {/* Body */}
        <div style={{ padding:"20px 24px", overflowY:"auto", flex:1 }}>
          {/* Name row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Field label="Full Name" error={errors.name}>
              <div style={{ position:"relative" }}>
                <input value={form.name} onChange={e => set("name", e.target.value)}
                  placeholder="John Doe" style={{ ...inputStyle(!!errors.name), paddingLeft:36 }}
                  onFocus={e => e.target.style.borderColor="#4f46e5"}
                  onBlur={e  => e.target.style.borderColor=errors.name?"#ef4444":"#e2e8f0"}
                />
                <Users size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}/>
              </div>
            </Field>
            <Field label="Phone">
              <div style={{ position:"relative" }}>
                <input value={form.phone} onChange={e => set("phone", e.target.value)}
                  placeholder="+91 98765 00000" style={{ ...inputStyle(false), paddingLeft:36 }}
                  onFocus={e => e.target.style.borderColor="#4f46e5"}
                  onBlur={e  => e.target.style.borderColor="#e2e8f0"}
                />
                <Phone size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}/>
              </div>
            </Field>
          </div>

          <Field label="Email Address" error={errors.email}>
            <div style={{ position:"relative" }}>
              <input value={form.email} onChange={e => set("email", e.target.value)}
                placeholder="user@hrms.com" style={{ ...inputStyle(!!errors.email), paddingLeft:36 }}
                onFocus={e => e.target.style.borderColor="#4f46e5"}
                onBlur={e  => e.target.style.borderColor=errors.email?"#ef4444":"#e2e8f0"}
              />
              <Mail size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}/>
            </div>
          </Field>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Field label="Role">
              <div style={{ position:"relative" }}>
                <select value={form.role} onChange={e => set("role", e.target.value)} style={selectStyle}
                  onFocus={e => e.target.style.borderColor="#4f46e5"}
                  onBlur={e  => e.target.style.borderColor="#e2e8f0"}
                >
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_META[r]?.label || r}</option>)}
                </select>
                <ChevronDown size={13} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", pointerEvents:"none" }}/>
              </div>
            </Field>
            <Field label="Department">
              <div style={{ position:"relative" }}>
                <select value={form.dept} onChange={e => set("dept", e.target.value)} style={selectStyle}
                  onFocus={e => e.target.style.borderColor="#4f46e5"}
                  onBlur={e  => e.target.style.borderColor="#e2e8f0"}
                >
                  {(departments?.length ? departments : DEPTS).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown size={13} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", pointerEvents:"none" }}/>
              </div>
            </Field>
          </div>

          <Field label="Status">
            <div style={{ display:"flex", gap:8 }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => set("status", s)} style={{
                  flex:1, padding:"8px 0", borderRadius:9, border:"1.5px solid",
                  cursor:"pointer", fontSize:12, fontWeight:600,
                  fontFamily:"'DM Sans',sans-serif", textTransform:"capitalize",
                  background: form.status===s ? STATUS_META[s].bg : "#f8fafc",
                  color:      form.status===s ? STATUS_META[s].color : "#94a3b8",
                  borderColor:form.status===s ? STATUS_META[s].color+"55" : "#e2e8f0",
                  transition:"all .2s",
                }}>{s}</button>
              ))}
            </div>
          </Field>

          {!isEdit && (
            <Field label="Password" error={errors.password}>
              <div style={{ position:"relative" }}>
                <input type={showPass?"text":"password"} value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="Set a password" style={{ ...inputStyle(!!errors.password), paddingLeft:36, paddingRight:40 }}
                  onFocus={e => e.target.style.borderColor="#4f46e5"}
                  onBlur={e  => e.target.style.borderColor=errors.password?"#ef4444":"#e2e8f0"}
                />
                <Lock size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}/>
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex", padding:0 }}>
                  {showPass ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </Field>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"16px 24px", borderTop:"1px solid #f1f5f9", display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{
            padding:"9px 20px", borderRadius:9, border:"1.5px solid #e2e8f0",
            background:"#fff", cursor:"pointer", fontSize:13, fontWeight:600,
            fontFamily:"'DM Sans',sans-serif", color:"#64748b",
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            padding:"9px 24px", borderRadius:9, border:"none",
            background:"linear-gradient(135deg,#4f46e5,#3730a3)",
            color:"#fff", cursor:"pointer", fontSize:13, fontWeight:700,
            fontFamily:"'DM Sans',sans-serif",
            boxShadow:"0 4px 14px rgba(79,70,229,.35)",
            display:"flex", alignItems:"center", gap:7,
          }}>
            <Check size={14}/>{isEdit ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reset Password Modal ──────────────────────────────────────
function ResetPasswordModal({ user, onClose }) {
  const [done, setDone] = useState(false);
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:999,
      background:"rgba(15,23,42,.5)", backdropFilter:"blur(4px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background:"#fff", borderRadius:20, width:"100%", maxWidth:400,
        padding:28, boxShadow:"0 32px 80px rgba(0,0,0,.2)", animation:"modalIn .2s ease",
        textAlign:"center",
      }}>
        <div style={{ width:56, height:56, borderRadius:16, background:"#fef3c7", margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Key size={24} color="#f59e0b"/>
        </div>
        {!done ? (
          <>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#0f172a", margin:"0 0 8px" }}>Reset Password</h3>
            <p style={{ color:"#64748b", fontSize:14, margin:"0 0 24px" }}>
              Send a password reset link to <strong>{user.email}</strong>?
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={onClose} style={{ flex:1, padding:"10px 0", borderRadius:9, border:"1.5px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif", color:"#64748b" }}>Cancel</button>
              <button onClick={() => setDone(true)} style={{ flex:1, padding:"10px 0", borderRadius:9, border:"none", background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>Send Reset Link</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ width:48, height:48, borderRadius:"50%", background:"#d1fae5", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Check size={22} color="#10b981"/>
            </div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#10b981", margin:"0 0 8px" }}>Link Sent!</h3>
            <p style={{ color:"#64748b", fontSize:14, margin:"0 0 20px" }}>Password reset link sent to {user.email}</p>
            <button onClick={onClose} style={{ width:"100%", padding:"10px 0", borderRadius:9, border:"none", background:"#d1fae5", color:"#10b981", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>Done</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────
function DeleteModal({ user, onClose, onConfirm }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:999,
      background:"rgba(15,23,42,.5)", backdropFilter:"blur(4px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background:"#fff", borderRadius:20, width:"100%", maxWidth:400,
        padding:28, boxShadow:"0 32px 80px rgba(0,0,0,.2)", animation:"modalIn .2s ease",
        textAlign:"center",
      }}>
        <div style={{ width:56, height:56, borderRadius:16, background:"#fee2e2", margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Trash2 size={24} color="#ef4444"/>
        </div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#0f172a", margin:"0 0 8px" }}>Delete User</h3>
        <p style={{ color:"#64748b", fontSize:14, margin:"0 0 6px" }}>
          Are you sure you want to delete <strong>{user.name}</strong>?
        </p>
        <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 24px" }}>This action cannot be undone.</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px 0", borderRadius:9, border:"1.5px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif", color:"#64748b" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px 0", borderRadius:9, border:"none", background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>Delete User</button>
        </div>
      </div>
    </div>
  );
}

// ── Toast Notification ────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  const colors = { success:{ bg:"#d1fae5", color:"#065f46", border:"#a7f3d0" }, error:{ bg:"#fee2e2", color:"#991b1b", border:"#fca5a5" }, info:{ bg:"#ede9fe", color:"#4338ca", border:"#c4b5fd" } };
  const c = colors[type] || colors.info;
  return (
    <div style={{
      position:"fixed", bottom:24, right:24, zIndex:9999,
      background:c.bg, border:`1px solid ${c.border}`, color:c.color,
      borderRadius:12, padding:"12px 18px", fontSize:13, fontWeight:600,
      fontFamily:"'DM Sans',sans-serif", boxShadow:"0 8px 24px rgba(0,0,0,.12)",
      display:"flex", alignItems:"center", gap:10, animation:"slideUp .2s ease",
      maxWidth:320,
    }}>
      {type==="success" && <Check size={15}/>}
      {type==="error"   && <X size={15}/>}
      {type==="info"    && <Key size={15}/>}
      {message}
    </div>
  );
}

function toUserFormat(emp) {
  const name = emp.name || [emp.first_name, emp.last_name].filter(Boolean).join(" ") || "Unknown";

  const rawRole = emp.role || emp.position || "employee";
  const role = String(rawRole).toLowerCase().trim();

  const initials = name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";

  return {
    id: emp.id,
    name,
    email: emp.email || "",
    phone: emp.phone || emp.phone_number || "",
    role,
    dept: emp.dept || emp.department || "",
    status: (emp.status || "active").toLowerCase(),
    initials,
    color: ROLE_META[role]?.color || "#4f46e5",
    joined: emp.joined || emp.joining_date || new Date().toISOString().slice(0, 10),
    lastLogin: "—",
  };
}

// ── Main Component ─────────────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers]           = useState([]);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal]           = useState(null); // null | { type, user? }
  const [toast, setToast]           = useState(null);
  const [viewMode, setViewMode]     = useState("table"); // "table" | "grid"

  useEffect(() => {
    employeeService.getAll().then((data) => {
      if (Array.isArray(data)) setUsers(data.map(toUserFormat));
    });
  }, []);

  function showToast(message, type = "success") { setToast({ message, type }); }

  // Stats
  const totalActive    = users.filter(u => u.status === "active").length;
  const totalAdmins    = users.filter(u => u.role === "admin").length;
  const totalSuspended = users.filter(u => u.status === "suspended").length;

  // Filtered list
  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase()) ||
                        u.dept.toLowerCase().includes(search.toLowerCase());
    
    const matchRole   = roleFilter   === "all" || u.role   === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  async function saveUser(data) {
    const payload = { name: data.name, email: data.email, phone: data.phone, role: data.role, department: data.dept, status: data.status, joined: data.joined };
    try {
      if (modal.user) {
        await employeeService.update(modal.user.id, payload);
        setUsers(prev => prev.map(u => u.id === modal.user.id ? toUserFormat({ ...u, ...data }) : u));
        showToast(`${data.name} updated successfully`);
      } else {
        const created = await employeeService.create(payload);
        setUsers(prev => [...prev, toUserFormat(created)]);
        showToast(`${data.name} created successfully`);
      }
    } catch (err) {
      showToast(err.message || "Failed to save", "error");
      return;
    }
    setModal(null);
  }

  async function deleteUser(id) {
    const u = users.find(u => u.id === id);
    try {
      await employeeService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast(`${u?.name} deleted`, "error");
    } catch (err) {
      showToast(err.message || "Failed to delete", "error");
    }
    setModal(null);
  }

  async function toggleStatus(id) {
    const u = users.find(u => u.id === id);
    const next = u.status === "active" ? "suspended" : "active";
    try {
      await employeeService.update(id, { name: u.name, email: u.email, phone: u.phone, role: u.role, department: u.dept, status: next, joined: u.joined });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: next } : u));
      showToast(`${u.name} ${next === "active" ? "activated" : "suspended"}`, next === "active" ? "success" : "info");
    } catch (err) {
      showToast(err.message || "Failed to update", "error");
    }
  }

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", color:"#0f172a" }}>

      {/* ── Header ── */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, margin:"0 0 4px", letterSpacing:"-.3px" }}></h1>
          <p style={{ color:"#94a3b8", fontSize:14, margin:0 }}>Manage system users, roles and access permissions</p>
        </div>
        <button onClick={() => setModal({ type:"add" })} style={{
          display:"flex", alignItems:"center", gap:8,
          padding:"10px 20px", borderRadius:11, border:"none",
          background:"linear-gradient(135deg,#4f46e5,#3730a3)",
          color:"#fff", cursor:"pointer", fontSize:14, fontWeight:700,
          fontFamily:"'DM Sans',sans-serif",
          boxShadow:"0 4px 14px rgba(79,70,229,.3)",
        }}>
          <Plus size={17}/>Add New User
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[
          { label:"Total Users",    value:users.length,    icon:"👥", iconBg:"#ede9fe", iconColor:"#4f46e5" },
          { label:"Active Users",   value:totalActive,     icon:"✅", iconBg:"#d1fae5", iconColor:"#10b981" },
          { label:"Admin Accounts", value:totalAdmins,     icon:"🛡️", iconBg:"#fef3c7", iconColor:"#f59e0b" },
          { label:"Suspended",      value:totalSuspended,  icon:"🚫", iconBg:"#fee2e2", iconColor:"#ef4444" },
        ].map(c => (
          <div key={c.label} style={{
            background:"#fff", borderRadius:16, padding:"18px 20px",
            border:"1px solid #e2e8f0", boxShadow:"0 1px 3px rgba(0,0,0,.04)",
            display:"flex", alignItems:"center", gap:14,
          }}>
            <div style={{
              width:48, height:48, borderRadius:14, flexShrink:0,
              background:c.iconBg, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20,
            }}>{c.icon}</div>
            <div>
              <div style={{ fontSize:28, fontWeight:800, lineHeight:1, color:c.iconColor }}>{c.value}</div>
              <div style={{ fontSize:12, color:"#94a3b8", marginTop:3 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters Row ── */}
      <div style={{
        background:"#fff", borderRadius:14, border:"1px solid #e2e8f0",
        padding:"14px 18px", marginBottom:16,
        display:"flex", alignItems:"center", gap:12, flexWrap:"wrap",
      }}>
        {/* Search */}
        <div style={{ position:"relative", flex:1, minWidth:220 }}>
          <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}/>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or department…"
            style={{
              width:"100%", boxSizing:"border-box",
              padding:"9px 36px 9px 34px", border:"1.5px solid #e2e8f0",
              borderRadius:9, fontSize:13, outline:"none", color:"#0f172a",
              fontFamily:"'DM Sans',sans-serif", background:"#f8fafc",
              transition:"border-color .2s",
            }}
            onFocus={e => { e.target.style.borderColor="#4f46e5"; e.target.style.background="#fff"; }}
            onBlur={e  => { e.target.style.borderColor="#e2e8f0"; e.target.style.background="#f8fafc"; }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex", padding:0 }}>
              <X size={13}/>
            </button>
          )}
        </div>

        {/* Role Filter */}
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <Filter size={13} color="#94a3b8"/>
          <span style={{ fontSize:12, color:"#64748b", fontWeight:600 }}>Role:</span>
          <div style={{ display:"flex", gap:4 }}>
            {["all",...ROLES].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} style={{
                padding:"5px 12px", borderRadius:99, border:"1.5px solid",
                cursor:"pointer", fontSize:12, fontWeight:600, textTransform:"capitalize",
                fontFamily:"'DM Sans',sans-serif", transition:"all .15s",
                background: roleFilter===r ? "#4f46e5" : "#fff",
                color:      roleFilter===r ? "#fff" : "#64748b",
                borderColor:roleFilter===r ? "#4f46e5" : "#e2e8f0",
              }}>{r === "all" ? "All" : ROLE_META[r]?.label || r}</button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:12, color:"#64748b", fontWeight:600 }}>Status:</span>
          <div style={{ display:"flex", gap:4 }}>
            {["all",...STATUSES].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding:"5px 12px", borderRadius:99, border:"1.5px solid",
                cursor:"pointer", fontSize:12, fontWeight:600, textTransform:"capitalize",
                fontFamily:"'DM Sans',sans-serif", transition:"all .15s",
                background: statusFilter===s ? "#0f172a" : "#fff",
                color:      statusFilter===s ? "#fff" : "#64748b",
                borderColor:statusFilter===s ? "#0f172a" : "#e2e8f0",
              }}>{s === "all" ? "All" : STATUS_META[s]?.label || s}</button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <span style={{ marginLeft:"auto", fontSize:12, color:"#94a3b8", whiteSpace:"nowrap" }}>
          {filtered.length} of {users.length} users
        </span>
      </div>

      {/* ── Table ── */}
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["USER","ROLE","DEPARTMENT","STATUS","JOINED","LAST LOGIN","ACTIONS"].map(h => (
                <th key={h} style={{
                  padding:"12px 16px", textAlign:"left", fontSize:11,
                  fontWeight:700, color:"#64748b", letterSpacing:".6px",
                  borderBottom:"1px solid #e2e8f0", whiteSpace:"nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding:"48px 16px", textAlign:"center", color:"#94a3b8" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
                  <div style={{ fontSize:14, fontWeight:600 }}>No users found</div>
                  <div style={{ fontSize:12, marginTop:4 }}>Try adjusting your search or filters</div>
                </td>
              </tr>
            ) : (
              filtered.map((u, i) => (
                <tr key={u.id}
                  style={{ borderBottom:"1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc", transition:"background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafbfc"}
                >
                  {/* User */}
                  <td style={{ padding:"13px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                      <Avatar initials={u.initials} color={u.color} size={38}/>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>{u.name}</div>
                        <div style={{ fontSize:12, color:"#94a3b8" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td style={{ padding:"13px 16px" }}><RoleBadge role={u.role}/></td>
                  {/* Dept */}
                  <td style={{ padding:"13px 16px" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#64748b" }}>
                      <Building2 size={13} color="#94a3b8"/>{u.dept}
                    </span>
                  </td>
                  {/* Status */}
                  <td style={{ padding:"13px 16px" }}><StatusBadge status={u.status}/></td>
                  {/* Joined */}
                  <td style={{ padding:"13px 16px", fontSize:13, color:"#64748b" }}>
                    {new Date(u.joined).toLocaleDateString("en-GB",{ day:"numeric", month:"short", year:"numeric" })}
                  </td>
                  {/* Last Login */}
                  <td style={{ padding:"13px 16px", fontSize:13, color:u.lastLogin==="—"?"#94a3b8":"#64748b" }}>
                    {u.lastLogin === "—" ? "—" : new Date(u.lastLogin).toLocaleDateString("en-GB",{ day:"numeric", month:"short", year:"numeric" })}
                  </td>
                  {/* Actions */}
                  <td style={{ padding:"13px 16px" }}>
                    <ActionMenu
                      user={u}
                      onEdit={() => setModal({ type:"edit", user:u })}
                      onDelete={() => setModal({ type:"delete", user:u })}
                      onToggleStatus={() => toggleStatus(u.id)}
                      onResetPassword={() => setModal({ type:"reset", user:u })}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        {filtered.length > 0 && (
          <div style={{
            padding:"12px 18px", borderTop:"1px solid #f1f5f9",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            background:"#fafbfc",
          }}>
            <span style={{ fontSize:12, color:"#94a3b8" }}>
              Showing <strong style={{ color:"#0f172a" }}>{filtered.length}</strong> of <strong style={{ color:"#0f172a" }}>{users.length}</strong> users
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {[...new Set(users.map(u => u.role))].map(r => {
                const m = ROLE_META[r] || ROLE_META.employee;
                const count = filtered.filter(u => u.role === r).length;
                return count > 0 ? (
                  <span key={r} style={{ fontSize:11, fontWeight:700, color:m.color, background:m.bg, padding:"2px 8px", borderRadius:99 }}>
                    {m.label}: {count}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <UserModal user={modal.user || null} onClose={() => setModal(null)} onSave={saveUser} departments={[...new Set(users.map(u=>u.dept).filter(Boolean))].sort()} />
      )}
      {modal?.type === "delete" && (
        <DeleteModal user={modal.user} onClose={() => setModal(null)} onConfirm={() => deleteUser(modal.user.id)} />
      )}
      {modal?.type === "reset" && (
        <ResetPasswordModal user={modal.user} onClose={() => setModal(null)} />
      )}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes dropIn   { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn  { from{opacity:0;transform:scale(.97) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        select option { font-family:'DM Sans',sans-serif; }
      `}</style>
    </div>
  );
}