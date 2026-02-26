import { useState } from "react";
import { supabase } from "../services/supabase";
import { useSettings } from "../contexts/SettingsContext";

/** snake_case → camelCase */
const toCamel = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
      v,
    ])
  );
};

function AuthPage({ mode, setPage, onLogin }) {
  const { t } = useSettings();
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
    { key: "student",    label: t("auth.student"),    icon: "🎓" },
    { key: "instructor", label: t("auth.instructor"), icon: "👨‍🏫" },
    { key: "marketer",   label: t("auth.marketer"),   icon: "📢" },
    { key: "center",     label: t("auth.center"),     icon: "🏢" },
  ];

  const routeForRole = (r) =>
    r === "instructor" ? "inst-dashboard"
    : r === "center"   ? "center-dashboard"
    : r === "marketer" ? "marketer-dashboard"
    : r === "admin"    ? "admin-dashboard"
    : "dashboard";

  const handleSubmit = async () => {
    if (!email || !password) { setError(t("auth.fillFields")); return; }
    if (!isLogin && !name)   { setError(t("auth.enterName")); return; }
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // ── Sign In via Supabase Auth ────────────────────────────────────
        const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
        if (authErr) {
          setError(authErr.message.includes("Invalid") ? t("auth.wrongPassword") : t("auth.noAccount"));
          return;
        }
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        if (profileErr || !profile) { setError(t("auth.noAccount")); return; }
        const safeUser = { id: data.user.id, email: data.user.email, ...toCamel(profile) };
        onLogin(safeUser);
        setPage(routeForRole(safeUser.role));

      } else {
        // ── Sign Up via Supabase Auth ────────────────────────────────────
        const { data, error: authErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
              specialization: spec || "Tech & Programming",
              centerName: centerName || null,
            },
          },
        });
        if (authErr) {
          setError(authErr.message.includes("already") ? t("auth.emailExists") : t("auth.serverError"));
          return;
        }
        // Profile auto-created by DB trigger (handle_new_user)
        const safeUser = {
          id: data.user.id,
          email,
          name,
          role,
          specialization: spec || "Tech & Programming",
          centerName: centerName || null,
        };
        onLogin(safeUser);
        setPage(routeForRole(role));
      }
    } catch {
      setError(t("auth.serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Masar</div>
        <div className="auth-title">{isLogin ? t("auth.welcomeBack") : t("auth.joinMasar")}</div>
        <div className="auth-sub">{isLogin ? t("auth.loginSub") : t("auth.registerSub")}</div>

        {!isLogin && (
          <>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text2)", marginBottom: "0.5rem" }}>{t("auth.iam")}</div>
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
            <label className="form-label">{t("auth.fullName")}</label>
            <input className="form-input" type="text" placeholder={t("auth.fullNamePlaceholder")} value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">{t("auth.email")}</label>
          <input className="form-input" type="email" placeholder={t("auth.emailPlaceholder")} value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        {!isLogin && role === "student" && (
          <div className="form-group">
            <label className="form-label">{t("auth.specialization")}</label>
            <input className="form-input" type="text" placeholder={t("auth.specializationPlaceholder")} value={spec} onChange={e => setSpec(e.target.value)} />
          </div>
        )}
        {!isLogin && role === "center" && (
          <div className="form-group">
            <label className="form-label">{t("auth.centerName")}</label>
            <input className="form-input" type="text" placeholder={t("auth.centerNamePlaceholder")} value={centerName} onChange={e => setCenterName(e.target.value)} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">{t("auth.password")}</label>
          <input className="form-input" type="password" placeholder={t("auth.passwordPlaceholder")} value={password}
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
          {loading ? t("auth.loading") : isLogin ? t("auth.signinBtn") : t("auth.createBtn")}
        </button>

        {isLogin && (
          <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 8, fontSize: "0.75rem", color: "var(--text3)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--text2)" }}>{t("auth.demoAccounts")}</strong><br />
            {t("auth.demoInstructor")}<br />
            {t("auth.demoStudent")}<br />
            {t("auth.demoMarketer")}<br />
            {t("auth.demoCenter")}<br />
            {t("auth.demoAdmin")}
          </div>
        )}

        <div className="auth-footer">
          {isLogin ? t("auth.noAccountYet") : t("auth.haveAccount")}{" "}
          <span className="auth-link" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
            {isLogin ? t("auth.signup") : t("auth.signinLink")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
