
// // src/pages/Login.jsx
// import { useState } from "react";
// import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight } from "lucide-react";
// import authService from "../services/authService";
// import useAuth from "../hooks/useAuth";

// // ── ADD YOUR 3 SLIDE IMAGES HERE ──────────────────────────────
// // Replace these import paths with your actual image files placed in src/assets/
// // Example: import slide1 from "../assets/slide1.jpg";
// // Then use: { image: slide1, headline: "...", sub: "..." }

// import slide1 from "../assets/login-slide-1.jpeg";
// import slide2 from "../assets/login-slide-2.jpeg";
// import slide3 from "../assets/login-slide-3.jpeg";

// const SLIDES = [
//   {
//     image:    slide1,
//     headline: "Streamline your workforce",
//     sub:      "Powerful HR tools for modern teams",
//   },
//   {
//     image:    slide2,
//     headline: "Attendance made effortless",
//     sub:      "Track, manage and report in real-time",
//   },
//   {
//     image:    slide3,
//     headline: "Payroll & leaves simplified",
//     sub:      "Everything your team needs, in one place",
//   },
// ];

// export default function Login() {
//   const { login } = useAuth();
//   const [slide, setSlide]       = useState(0);
//   const [form,  setForm]        = useState({ username:"", password:"" });
//   const [err,   setErr]         = useState("");
//   const [loading, setLoading]   = useState(false);
//   const [show,  setShow]        = useState(false);

//   const accent     = "#4f46e5";
//   const accentDark = "#3730a3";

//   const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

//   async function submit() {
//     if (!form.username || !form.password) { setErr("All fields are required"); return; }
//     setLoading(true); setErr("");
//     try {
//       if (form.username === "employee" && form.password === "emp123") {
//         await new Promise(r => setTimeout(r, 700));
//         login({ id:42, name:"Rahul Sharma", email:"rahul.sharma@company.com", role:"employee", department:"Engineering" }, "mock-emp-token");
//       } else {
//         const res = await authService.login(form.username, form.password);
//         login(res.user, res.token);
//       }
//     } catch(ex) { setErr(ex.message); }
//     finally { setLoading(false); }
//   }

//   return (
//     <div style={{
//       minHeight:"100vh", display:"flex",
//       fontFamily:"'DM Sans',sans-serif", background:"#f1f5f9",
//       alignItems:"center", justifyContent:"center", padding:20,
//     }}>
//       <div style={{
//         display:"flex", width:"100%", maxWidth:1000,
//         minHeight:600, borderRadius:24,
//         boxShadow:"0 32px 80px rgba(0,0,0,.18)",
//         overflow:"hidden", background:"#fff",
//         animation:"fadeUp .5s ease",
//       }}>

//         {/* ══════════ LEFT — Slideshow ══════════ */}
//         <div style={{ width:"46%", flexShrink:0, position:"relative", overflow:"hidden", background:"#0f172a" }}>

//           {/* Slide image */}
//           <div style={{
//             position:"absolute", inset:0,
//             backgroundImage:`url(${SLIDES[slide].image})`,
//             backgroundSize:"cover", backgroundPosition:"center",
//             transition:"background-image .5s ease",
//           }}/>

//           {/* Gradient overlay for text readability */}
//           <div style={{
//             position:"absolute", inset:0,
//             background:"linear-gradient(to bottom,rgba(0,0,0,.3) 0%,rgba(0,0,0,.0) 35%,rgba(0,0,0,.7) 100%)",
//             pointerEvents:"none",
//           }}/>

//           {/* Logo */}
//           <div style={{ position:"absolute", top:24, left:24, display:"flex", alignItems:"center", gap:10, zIndex:10 }}>
//             <div style={{
//               width:38, height:38, borderRadius:10,
//               background:"rgba(255,255,255,.15)", backdropFilter:"blur(8px)",
//               border:"1px solid rgba(255,255,255,.3)",
//               display:"flex", alignItems:"center", justifyContent:"center",
//             }}>
//               <Building2 size={19} color="#fff"/>
//             </div>
//             <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:19, color:"#fff", letterSpacing:".5px" }}>EAMS</div>
//           </div>

//           {/* Caption + dots */}
//           <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"28px 26px 26px", zIndex:10 }}>
//             <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff", lineHeight:1.25, marginBottom:6 }}>
//               {SLIDES[slide].headline}
//             </div>
//             <div style={{ fontSize:13, color:"rgba(255,255,255,.65)" }}>
//               {SLIDES[slide].sub}
//             </div>

//             {/* Dot indicators */}
//             <div style={{ display:"flex", gap:8, marginTop:18, alignItems:"center" }}>
//               {SLIDES.map((_, i) => (
//                 <button key={i} onClick={() => setSlide(i)} style={{
//                   height:4, borderRadius:99, border:"none", cursor:"pointer", padding:0,
//                   transition:"all .35s ease",
//                   background: i === slide ? "#fff" : "rgba(255,255,255,.35)",
//                   width: i === slide ? 28 : 14,
//                 }}/>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ══════════ RIGHT — Login Form ══════════ */}
//         <div style={{
//           flex:1, background:"#fff",
//           display:"flex", flexDirection:"column",
//           justifyContent:"center", padding:"48px 44px",
//         }}>

//           {/* Heading */}
//           <div style={{ marginBottom:28 }}>
//             <h1 style={{
//               fontFamily:"'Syne',sans-serif", fontWeight:800,
//               fontSize:30, color:"#0f172a", margin:"0 0 6px", letterSpacing:"-.5px",
//             }}>Welcome back 👋</h1>
//             <p style={{ color:"#94a3b8", fontSize:14, margin:0 }}>
//               Sign in to your EAMS account to continue
//             </p>
//           </div>

//           {/* Demo hint */}
//           <div style={{
//             background:"#ede9fe", borderRadius:9, padding:"10px 14px", marginBottom:22,
//             fontSize:13, color:"#4f46e5", fontWeight:500, display:"flex", flexDirection:"column", gap:3,
//           }}>
//             <div style={{ display:"flex", gap:6 }}><span>🛡️</span><span>Admin: <strong>admin / admin123</strong></span></div>
//             <div style={{ display:"flex", gap:6 }}><span>👤</span><span>Employee: <strong>employee / emp123</strong></span></div>
//           </div>

//           {/* Username */}
//           <div style={{ marginBottom:14 }}>
//             <label style={{ fontSize:12, fontWeight:700, color:"#64748b", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".4px" }}>
//               Username
//             </label>
//             <div style={{ position:"relative" }}>
//               <Mail size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#cbd5e1", pointerEvents:"none" }}/>
//               <input
//                 name="username" value={form.username} onChange={handle}
//                 onKeyDown={e => e.key === "Enter" && submit()}
//                 placeholder="Enter your username"
//                 style={{
//                   width:"100%", boxSizing:"border-box", padding:"12px 14px 12px 40px",
//                   border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:14,
//                   color:"#0f172a", outline:"none", fontFamily:"'DM Sans',sans-serif",
//                   background:"#f8fafc", transition:"border-color .2s, background .2s",
//                 }}
//                 onFocus={e => { e.target.style.borderColor = accent; e.target.style.background = "#fff"; }}
//                 onBlur={e  => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div style={{ marginBottom:20 }}>
//             <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
//               <label style={{ fontSize:12, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".4px" }}>Password</label>
//               <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:accent, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
//                 Forgot password?
//               </button>
//             </div>
//             <div style={{ position:"relative" }}>
//               <Lock size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#cbd5e1", pointerEvents:"none" }}/>
//               <input
//                 name="password" type={show ? "text" : "password"}
//                 value={form.password} onChange={handle}
//                 onKeyDown={e => e.key === "Enter" && submit()}
//                 placeholder="••••••••"
//                 style={{
//                   width:"100%", boxSizing:"border-box", padding:"12px 44px 12px 40px",
//                   border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:14,
//                   color:"#0f172a", outline:"none", fontFamily:"'DM Sans',sans-serif",
//                   background:"#f8fafc", transition:"border-color .2s, background .2s",
//                 }}
//                 onFocus={e => { e.target.style.borderColor = accent; e.target.style.background = "#fff"; }}
//                 onBlur={e  => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
//               />
//               <button type="button" onClick={() => setShow(s => !s)} style={{
//                 position:"absolute", right:13, top:"50%", transform:"translateY(-50%)",
//                 background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex", padding:0,
//               }}>
//                 {show ? <EyeOff size={16}/> : <Eye size={16}/>}
//               </button>
//             </div>
//           </div>

//           {/* Error */}
//           {err && (
//             <div style={{
//               background:"#fee2e2", border:"1px solid #fca5a5", borderRadius:9,
//               padding:"10px 14px", fontSize:13, color:"#dc2626", marginBottom:14,
//               display:"flex", alignItems:"center", gap:8,
//             }}>
//               <span>⚠️</span>{err}
//             </div>
//           )}

//           {/* Sign In */}
//           <button
//             onClick={submit} disabled={loading}
//             style={{
//               width:"100%", padding:"13px 0", border:"none", borderRadius:11,
//               cursor: loading ? "not-allowed" : "pointer", fontSize:15, fontWeight:700,
//               fontFamily:"'DM Sans',sans-serif",
//               background: loading ? "#e2e8f0" : `linear-gradient(135deg,${accent},${accentDark})`,
//               color: loading ? "#94a3b8" : "#fff",
//               boxShadow: loading ? "none" : `0 6px 20px ${accent}40`,
//               display:"flex", alignItems:"center", justifyContent:"center", gap:8,
//               transition:"all .2s",
//             }}
//           >
//             {loading ? (
//               <>
//                 <div style={{ width:16, height:16, border:"2px solid #cbd5e1", borderTopColor:accent, borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
//                 Signing in…
//               </>
//             ) : (
//               <>Sign In <ArrowRight size={17}/></>
//             )}
//           </button>

//           {/* Footer */}
//           <div style={{ marginTop:"auto", paddingTop:28, textAlign:"center", fontSize:12, color:"#e2e8f0" }}>
//             © 2026 HRMS. All rights reserved.
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
//         @keyframes spin   { to { transform:rotate(360deg) } }
//         @keyframes fadeUp { from { opacity:0;transform:translateY(20px) } to { opacity:1;transform:translateY(0) } }
//         input::placeholder { color:#cbd5e1 !important; }
//         * { box-sizing:border-box; }
//       `}</style>
//     </div>
//   );
// }

import { useState } from "react";
import authService from "../services/authService";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    const data = {
      email: email,
      password: password
    };

    try {

      const res = await authService.loginUser(data);

      console.log(res);

      localStorage.setItem("token", res.token);

      alert("Login Successful");

    } catch (error) {

      console.log(error);
      alert("Login Failed");

    }

  };

  return (
    <div>

      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br/>

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/>

      <button onClick={handleLogin}>Login</button>

    </div>
  );
}

export default Login;



