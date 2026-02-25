/**
 * @file AuthPage.jsx
 * @description صفحة تسجيل الدخول والتسجيل الجديد
 *
 * صفحة موحدة تدعم وضعين:
 * - login: تسجيل الدخول للمستخدمين الحاليين (التحقق من بيانات json-server)
 * - register: إنشاء حساب جديد مع اختيار نوع الحساب
 *   (Student / Instructor / Center Owner)
 *
 * البيانات محفوظة في db.json عبر json-server.
 */

import { useState } from "react";
import { api } from "../services/api";

/**
 * صفحة المصادقة (تسجيل الدخول / التسجيل)
 * @param {Object} props
 * @param {'login'|'register'} props.mode - وضع الصفحة
 * @param {Function} props.setPage - دالة التنقل بين الصفحات
 * @param {Function} props.onLogin - callback يُستدعى عند نجاح تسجيل الدخول مع بيانات المستخدم
 */
function AuthPage({ mode, setPage, onLogin }) {
  const [role, setRole]             = useState("student");
  const [isLogin, setIsLogin]       = useState(mode === "login");
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [spec, setSpec]             = useState("");
  const [centerName, setCenterName] = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const roles = [
    { key: "student",    label: "Student",    icon: "🎓" },
    { key: "instructor", label: "Instructor", icon: "👨‍🏫" },
    { key: "marketer",   label: "Marketer",   icon: "📢" },
    { key: "center",     label: "Center",     icon: "🏢" },
  ];

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill in all required fields."); return; }
    if (!isLogin && !name)   { setError("Please enter your name."); return; }
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // ── تسجيل الدخول: البحث عن المستخدم بالإيميل ──
        const users = await api.findByEmail(email);
        if (!users || users.length === 0) {
          setError("No account found with this email.");
          return;
        }
        const found = users[0];
        if (found.password !== password) {
          setError("Incorrect password. Please try again.");
          return;
        }
        const { password: _p, ...safeUser } = found;
        onLogin(safeUser);
        setPage(safeUser.role === "instructor" ? "inst-dashboard" : safeUser.role === "center" ? "center-dashboard" : safeUser.role === "marketer" ? "marketer-dashboard" : "dashboard");

      } else {
        // ── تسجيل جديد: التحقق من عدم وجود الإيميل مسبقاً ──
        const existing = await api.findByEmail(email);
        if (existing && existing.length > 0) {
          setError("An account with this email already exists.");
          return;
        }
        const newUser = await api.createUser({
          name, email, password, role,
          specialization: spec || "Tech & Programming",
          centerName: centerName || null,
        });
        const { password: _p, ...safeUser } = newUser;
        onLogin(safeUser);
        setPage(role === "instructor" ? "inst-dashboard" : role === "center" ? "center-dashboard" : role === "marketer" ? "marketer-dashboard" : "dashboard");
      }
    } catch (err) {
      setError("Connection error. Make sure the server is running: npm run start");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Masar</div>
        <div className="auth-title">{isLogin ? "Welcome back" : "Join Masar"}</div>
        <div className="auth-sub">{isLogin ? "Sign in to continue your learning journey." : "Create your account and start growing today."}</div>

        {!isLogin && (
          <>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text2)", marginBottom: "0.5rem" }}>I am a...</div>
            <div className="role-selector">
              {roles.map(r => (
                <button key={r.key} className={`role-btn ${role === r.key ? "selected" : ""}`} onClick={() => setRole(r.key)}>
                  <span className="role-icon">{r.icon}</span>{r.label}
                </button>
              ))}
            </div>
          </>
        )}

        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" placeholder="Mohammed Abdallah" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        {!isLogin && role === "student" && (
          <div className="form-group">
            <label className="form-label">Specialization / Field of Interest</label>
            <input className="form-input" type="text" placeholder="e.g. Data Science, Programming..." value={spec} onChange={e => setSpec(e.target.value)} />
          </div>
        )}
        {!isLogin && role === "center" && (
          <div className="form-group">
            <label className="form-label">Center Name</label>
            <input className="form-input" type="text" placeholder="e.g. TechHub Khartoum" value={centerName} onChange={e => setCenterName(e.target.value)} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>

        {error && (
          <div style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: "0.75rem", padding: "0.6rem 0.9rem", background: "rgba(248,113,113,0.08)", borderRadius: 8, border: "1px solid rgba(248,113,113,0.2)" }}>
            {error}
          </div>
        )}

        <button className="btn btn-primary"
          style={{ width: "100%", padding: "0.85rem", fontSize: "1rem", borderRadius: 10, marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
        </button>

        {isLogin && (
          <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 8, fontSize: "0.75rem", color: "var(--text3)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--text2)" }}>Demo accounts:</strong><br />
            Instructor: ahmed@masar.com / 123456<br />
            Student: sara@masar.com / 123456<br />
            Marketer: osama@masar.com / 123456
          </div>
        )}

        <div className="auth-footer">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="auth-link" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
