import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, UserPlus } from "lucide-react";
import authService from "../services/authService";
import useAuth from "../hooks/useAuth";

const accent = "#4f46e5";
const accentDark = "#3730a3";

function Signup() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setErr("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await authService.registerUser({ email, password });
      if (res?.error) {
        setErr(res.error);
        return;
      }
      login(res.user, res.token);
    } catch (error) {
      const data = error.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.detail ||
        data?.error ||
        data?.message ||
        error.message ||
        "Signup failed";
      setErr(typeof msg === "object" ? JSON.stringify(msg) : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'DM Sans', sans-serif",
        background: "#f1f5f9",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "48px 40px",
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 32px 80px rgba(0,0,0,.12)",
        }}
      >
        <h1
          style={{
            fontWeight: 800,
            fontSize: 28,
            color: "#0f172a",
            margin: "0 0 6px",
          }}
        >
          Create account
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 28px" }}>
          Sign up to get started with EAMS
        </p>

        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#64748b",
              display: "block",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: ".4px",
            }}
          >
            Email
          </label>
          <div style={{ position: "relative" }}>
            <Mail
              size={15}
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#cbd5e1",
              }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              placeholder="Enter your email"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px 12px 40px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                fontSize: 14,
                color: "#0f172a",
                outline: "none",
                fontFamily: "'DM Sans', sans-serif",
                background: "#f8fafc",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#64748b",
              display: "block",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: ".4px",
            }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            <Lock
              size={15}
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#cbd5e1",
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              placeholder="At least 6 characters"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px 12px 40px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                fontSize: 14,
                color: "#0f172a",
                outline: "none",
                fontFamily: "'DM Sans', sans-serif",
                background: "#f8fafc",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#64748b",
              display: "block",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: ".4px",
            }}
          >
            Confirm Password
          </label>
          <div style={{ position: "relative" }}>
            <Lock
              size={15}
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#cbd5e1",
              }}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              placeholder="••••••••"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px 12px 40px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                fontSize: 14,
                color: "#0f172a",
                outline: "none",
                fontFamily: "'DM Sans', sans-serif",
                background: "#f8fafc",
              }}
            />
          </div>
        </div>

        {err && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: 9,
              padding: "10px 14px",
              fontSize: 13,
              color: "#dc2626",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>⚠️</span>
            <span>{err}</span>
          </div>
        )}

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px 0",
            border: "none",
            borderRadius: 11,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            background: loading
              ? "#e2e8f0"
              : `linear-gradient(135deg,${accent},${accentDark})`,
            color: loading ? "#94a3b8" : "#fff",
            boxShadow: loading ? "none" : `0 6px 20px ${accent}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? (
            "Creating account…"
          ) : (
            <>
              Sign Up <UserPlus size={17} />
            </>
          )}
        </button>

        <p
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 14,
            color: "#64748b",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: accent,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>

        <p style={{ marginTop: 12, textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
          © 2026 EAMS. All rights reserved.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

export default Signup;
