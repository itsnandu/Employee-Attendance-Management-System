// // src/components/employee/EmpUI.jsx
// // Shared design-system components — mirrors the admin HRMS visual language

// export const T = {
//   primary:      "#4f46e5",
//   primaryDark:  "#3730a3",
//   primaryLight: "#e0e7ff",
//   accent:       "#06b6d4",
//   success:      "#10b981",
//   warning:      "#f59e0b",
//   danger:       "#ef4444",
//   bg:           "#f8fafc",
//   surface:      "#ffffff",
//   surface2:     "#f1f5f9",
//   border:       "#e2e8f0",
//   text:         "#0f172a",
//   muted:        "#64748b",
//   sidebarBg:    "#0f172a",
// };

// export function Avatar({ initials, color, size = 38 }) {
//   return (
//     <div style={{
//       width: size, height: size, borderRadius: "50%",
//       background: `${color}22`, color,
//       display: "flex", alignItems: "center", justifyContent: "center",
//       fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
//       border: `1.5px solid ${color}44`,
//     }}>{initials}</div>
//   );
// }

// export function Badge({ label, color, bg }) {
//   return (
//     <span style={{
//       background: bg, color,
//       padding: "3px 12px", borderRadius: 99,
//       fontSize: 12, fontWeight: 600, letterSpacing: ".3px",
//     }}>{label}</span>
//   );
// }

// export function StatusBadge({ status }) {
//   const map = {
//     approved: { bg: "#d1fae5", color: "#065f46", label: "Approved" },
//     pending:  { bg: "#fef3c7", color: "#92400e", label: "Pending"  },
//     rejected: { bg: "#fee2e2", color: "#991b1b", label: "Rejected" },
//     paid:     { bg: "#d1fae5", color: "#065f46", label: "Paid"     },
//     present:  { bg: "#d1fae5", color: "#065f46", label: "Present"  },
//     late:     { bg: "#fef3c7", color: "#92400e", label: "Late"     },
//     absent:   { bg: "#fee2e2", color: "#991b1b", label: "Absent"   },
//   };
//   const s = map[status] || map.pending;
//   return <Badge label={s.label} color={s.color} bg={s.bg} />;
// }

// export function Card({ children, style = {}, onClick }) {
//   return (
//     <div onClick={onClick} style={{
//       background: T.surface, borderRadius: 14,
//       border: `1px solid ${T.border}`,
//       boxShadow: "0 1px 3px rgba(0,0,0,.06)",
//       ...style,
//     }}>{children}</div>
//   );
// }

// export function SectionTitle({ children, style = {} }) {
//   return (
//     <div style={{
//       fontFamily: "'Syne', sans-serif", fontWeight: 800,
//       fontSize: 16, color: T.text, marginBottom: 16, ...style,
//     }}>{children}</div>
//   );
// }

// export function PageHeader({ title, subtitle }) {
//   return (
//     <div style={{ marginBottom: 24 }}>
//       <h1 style={{
//         fontFamily: "'Syne', sans-serif", fontWeight: 800,
//         fontSize: 26, color: T.text, lineHeight: 1.2,
//       }}>{title}</h1>
//       {subtitle && <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{subtitle}</div>}
//     </div>
//   );
// }

// export function EmptyState({ icon, title, sub }) {
//   return (
//     <div style={{ textAlign: "center", padding: "48px 24px", color: T.muted }}>
//       <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
//       <div style={{ fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 6 }}>{title}</div>
//       <div style={{ fontSize: 13 }}>{sub}</div>
//     </div>
//   );
// }

// export function Btn({ children, onClick, variant = "primary", disabled, style = {} }) {
//   const styles = {
//     primary: { background: T.primary, color: "#fff", border: "none" },
//     outline: { background: "#fff", color: T.primary, border: `1.5px solid ${T.primary}` },
//     ghost:   { background: T.surface2, color: T.muted, border: `1px solid ${T.border}` },
//     danger:  { background: "#fee2e2", color: T.danger, border: `1px solid #fca5a5` },
//   };
//   return (
//     <button
//       onClick={disabled ? undefined : onClick}
//       disabled={disabled}
//       style={{
//         padding: "8px 20px", borderRadius: 10,
//         cursor: disabled ? "not-allowed" : "pointer",
//         fontSize: 13, fontWeight: 600, transition: "all .2s",
//         fontFamily: "'DM Sans', sans-serif",
//         opacity: disabled ? 0.6 : 1,
//         ...styles[variant], ...style,
//       }}
//     >{children}</button>
//   );
// }

// export function Input({ label, value, onChange, type = "text", placeholder, disabled, style = {} }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
//       {label && <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: ".4px" }}>{label}</label>}
//       <input
//         type={type} value={value} onChange={onChange}
//         placeholder={placeholder} disabled={disabled}
//         style={{
//           padding: "9px 14px", borderRadius: 9, fontSize: 14,
//           border: `1.5px solid ${T.border}`, background: disabled ? T.surface2 : T.surface,
//           color: T.text, outline: "none", fontFamily: "'DM Sans', sans-serif",
//           transition: "border-color .2s",
//         }}
//         onFocus={e => e.target.style.borderColor = T.primary}
//         onBlur={e => e.target.style.borderColor = T.border}
//       />
//     </div>
//   );
// }

// export function Select({ label, value, onChange, options, style = {} }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
//       {label && <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: ".4px" }}>{label}</label>}
//       <select value={value} onChange={onChange} style={{
//         padding: "9px 14px", borderRadius: 9, fontSize: 14,
//         border: `1.5px solid ${T.border}`, background: T.surface,
//         color: T.text, outline: "none", fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
//       }}>
//         {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//       </select>
//     </div>
//   );
// }

// export function Modal({ open, onClose, title, children, width = 500 }) {
//   if (!open) return null;
//   return (
//     <div style={{
//       position: "fixed", inset: 0, background: "rgba(15,23,42,.45)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       zIndex: 1000, backdropFilter: "blur(3px)",
//     }} onClick={e => e.target === e.currentTarget && onClose()}>
//       <div style={{
//         background: T.surface, borderRadius: 16, width, maxWidth: "92vw",
//         maxHeight: "90vh", overflow: "auto", padding: 28,
//         boxShadow: "0 20px 60px rgba(0,0,0,.2)",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//           <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18 }}>{title}</div>
//           <button onClick={onClose} style={{
//             border: "none", background: T.surface2, cursor: "pointer",
//             width: 32, height: 32, borderRadius: 8, fontSize: 16, color: T.muted,
//           }}>✕</button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }


// src/components/employee/EmpUI.jsx
// Shared design-system components — mirrors the admin HRMS visual language

export const T = {
  primary:      "#0061f2",   // brand blue — matches sidebar
  primaryDark:  "#0052cc",   // darker shade for hover/pressed
  primaryLight: "#dbeafe",   // light tint for backgrounds / badges
  accent:       "#0ea5e9",   // sky-blue accent
  success:      "#10b981",
  warning:      "#f59e0b",
  danger:       "#ef4444",
  bg:           "#f8fafc",
  surface:      "#ffffff",
  surface2:     "#f1f5f9",
  border:       "#e2e8f0",
  text:         "#0f172a",
  muted:        "#64748b",
  sidebarBg:    "#0061f2",   // sidebar background matches brand blue
};

export function Avatar({ initials, color, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${color}22`, color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
      border: `1.5px solid ${color}44`,
    }}>{initials}</div>
  );
}

export function Badge({ label, color, bg }) {
  return (
    <span style={{
      background: bg, color,
      padding: "3px 12px", borderRadius: 99,
      fontSize: 12, fontWeight: 600, letterSpacing: ".3px",
    }}>{label}</span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    approved: { bg: "#d1fae5", color: "#065f46", label: "Approved" },
    pending:  { bg: "#fef3c7", color: "#92400e", label: "Pending"  },
    rejected: { bg: "#fee2e2", color: "#991b1b", label: "Rejected" },
    paid:     { bg: "#d1fae5", color: "#065f46", label: "Paid"     },
    present:  { bg: "#d1fae5", color: "#065f46", label: "Present"  },
    late:     { bg: "#fef3c7", color: "#92400e", label: "Late"     },
    absent:   { bg: "#fee2e2", color: "#991b1b", label: "Absent"   },
  };
  const s = map[status] || map.pending;
  return <Badge label={s.label} color={s.color} bg={s.bg} />;
}

export function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: T.surface, borderRadius: 14,
      border: `1px solid ${T.border}`,
      boxShadow: "0 1px 3px rgba(0,0,0,.06)",
      ...style,
    }}>{children}</div>
  );
}

export function SectionTitle({ children, style = {} }) {
  return (
    <div style={{
      fontWeight: 800,
      fontSize: 16, color: T.text, marginBottom: 16, ...style,
    }}>{children}</div>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{
        fontWeight: 800,
        fontSize: 26, color: T.text, lineHeight: 1.2,
      }}>{title}</h1>
      {subtitle && <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: T.muted }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13 }}>{sub}</div>
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", disabled, style = {} }) {
  const styles = {
    primary: { background: T.primary, color: "#fff", border: "none" },
    outline: { background: "#fff", color: T.primary, border: `1.5px solid ${T.primary}` },
    ghost:   { background: T.surface2, color: T.muted, border: `1px solid ${T.border}` },
    danger:  { background: "#fee2e2", color: T.danger, border: `1px solid #fca5a5` },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        padding: "8px 20px", borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 13, fontWeight: 600, transition: "all .2s",
        fontFamily: "'DM Sans', sans-serif",
        opacity: disabled ? 0.6 : 1,
        ...styles[variant], ...style,
      }}
    >{children}</button>
  );
}

export function Input({ label, value, onChange, type = "text", placeholder, disabled, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: ".4px" }}>{label}</label>}
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} disabled={disabled}
        style={{
          padding: "9px 14px", borderRadius: 9, fontSize: 14,
          border: `1.5px solid ${T.border}`, background: disabled ? T.surface2 : T.surface,
          color: T.text, outline: "none", fontFamily: "'DM Sans', sans-serif",
          transition: "border-color .2s",
        }}
        onFocus={e => e.target.style.borderColor = T.primary}
        onBlur={e => e.target.style.borderColor = T.border}
      />
    </div>
  );
}

export function Select({ label, value, onChange, options, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: ".4px" }}>{label}</label>}
      <select value={value} onChange={onChange} style={{
        padding: "9px 14px", borderRadius: 9, fontSize: 14,
        border: `1.5px solid ${T.border}`, background: T.surface,
        color: T.text, outline: "none", fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Modal({ open, onClose, title, children, width = 500 }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(3px)",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: T.surface, borderRadius: 16, width, maxWidth: "92vw",
        maxHeight: "90vh", overflow: "auto", padding: 28,
        boxShadow: "0 20px 60px rgba(0,0,0,.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{title}</div>
          <button onClick={onClose} style={{
            border: "none", background: T.surface2, cursor: "pointer",
            width: 32, height: 32, borderRadius: 8, fontSize: 16, color: T.muted,
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}