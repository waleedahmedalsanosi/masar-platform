import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useSettings } from "../contexts/SettingsContext";

function MarketerDashboard({ user, setPage }) {
  const { t } = useSettings();
  const marketerId = String(user?.id || "");

  const [activeTab,   setActiveTab]   = useState("overview");
  const [assignments, setAssignments] = useState([]);
  const [referrals,   setReferrals]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [copiedLink,  setCopiedLink]  = useState("");
  const [copiedForm,  setCopiedForm]  = useState("");
  const [refreshKey,  setRefreshKey]  = useState(0);

  const name     = user?.name || "Marketer";

  const reload = () => setRefreshKey(k => k + 1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [a, r] = await Promise.all([
          api.getMyAssignments(marketerId),
          api.getMarketerRequests(marketerId),
        ]);
        setAssignments(a);
        setReferrals(r);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, [marketerId, refreshKey]);

  const getReferralLink = (a) => `${window.location.origin}/?ref=${marketerId}&course=${a.courseId}`;
  const getFormLink     = (a) => `${window.location.origin}/?ref=${marketerId}&course=${a.courseId}&enroll=1`;

  const copyLink = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(""), 2000);
  };
  const copyForm = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedForm(key);
    setTimeout(() => setCopiedForm(""), 2000);
  };

  const totalEarnings = referrals
    .filter(r => r.status === "accepted")
    .reduce((sum, r) => {
      const a = assignments.find(a => String(a.courseId) === String(r.courseId));
      return sum + (a ? Math.round((r.amount || 0) * 350 * a.commissionRate / 100) : 0);
    }, 0);

  const tabs = [
    { key: "overview", label: t("mkt.tab.overview"), icon: "📊" },
    { key: "links",    label: t("mkt.tab.links"),    icon: "🔗" },
    { key: "earnings", label: t("mkt.tab.earnings"), icon: "💰" },
  ];

  if (loading) return (
    <div className="inst-dash" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", color: "var(--text3)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⏳</div>
        <div>{t("mkt.loading")}</div>
        <div style={{ fontSize: "0.78rem", marginTop: "0.5rem" }}><code>{t("mkt.serverHint")}</code></div>
      </div>
    </div>
  );

  return (
    <div className="inst-dash">
      <div className="inst-topbar" style={{ display: "flex", alignItems: "center" }}>
        {tabs.map(tab => (
          <div key={tab.key} className={`inst-tab ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
            <span>{tab.icon}</span> {tab.label}
          </div>
        ))}
        <button onClick={reload} title="Refresh data"
          style={{ marginInlineStart: "auto", padding: "0.35rem 0.75rem", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--bg)", cursor: "pointer", fontSize: "0.82rem", color: "var(--text2)", display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}>
          {t("mkt.refresh")}
        </button>
      </div>

      <div className="inst-content">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">{t("mkt.welcome", { name: name.split(" ")[0] })}</div>
                <div className="inst-page-sub">{t("mkt.subtitle")}</div>
              </div>
            </div>
            <div className="ov-stats">
              {[
                { icon: "🔗", val: assignments.length,                                    lbl: t("mkt.assignedCourses"),  color: "#6366f1" },
                { icon: "👥", val: referrals.length,                                      lbl: t("mkt.totalReferrals"),   color: "#06b6d4" },
                { icon: "✅", val: referrals.filter(r => r.status === "accepted").length, lbl: t("mkt.accepted"),         color: "#22c55e" },
                { icon: "💰", val: `SDG ${totalEarnings.toLocaleString()}`,               lbl: t("mkt.totalEarnings"),    color: "#fbbf24" },
              ].map(s => (
                <div key={s.lbl} className="ov-stat-card">
                  <div className="ov-stat-glow" style={{ background: s.color }} />
                  <div className="ov-stat-icon">{s.icon}</div>
                  <div className="ov-stat-val" style={{ background: `linear-gradient(135deg,${s.color},white)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
                  <div className="ov-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>

            <div className="ov-grid">
              <div className="ov-card">
                <div className="ov-card-hd">
                  {t("mkt.myLinks")}
                  <span className="ov-see-all" onClick={() => setActiveTab("links")}>{t("mkt.seeAll")}</span>
                </div>
                <div className="ov-card-bd">
                  {assignments.length === 0 && <div style={{ color: "var(--text3)", fontSize: "0.82rem", padding: "0.5rem 0" }}>{t("mkt.noAssigned")}</div>}
                  {assignments.map(a => {
                    const courseRefs = referrals.filter(r => String(r.courseId) === String(a.courseId));
                    return (
                      <div key={a.id} className="ov-course-row">
                        <span className="ov-course-icon">📣</span>
                        <div style={{ flex: 1 }}>
                          <div className="ov-course-name">{a.courseName}</div>
                          <div className="ov-course-students">{a.commissionRate}% · {courseRefs.length} refs</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="ov-card">
                <div className="ov-card-hd">
                  {t("mkt.recentReferrals")}
                  <span className="ov-see-all" onClick={() => setActiveTab("earnings")}>{t("mkt.seeAll")}</span>
                </div>
                <div className="ov-card-bd">
                  {referrals.length === 0 && <div style={{ color: "var(--text3)", fontSize: "0.82rem", padding: "0.5rem 0" }}>{t("mkt.noReferrals")}</div>}
                  {referrals.slice(0, 4).map(r => (
                    <div key={r.id} className="ov-req-row">
                      <div className="ov-req-avatar">{r.avatar || r.name?.slice(0,2).toUpperCase()}</div>
                      <div style={{ flex: 1 }}>
                        <div className="ov-req-name">{r.name}</div>
                        <div className="ov-req-course">{r.course}</div>
                      </div>
                      <span className={`req-status ${r.status}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MY LINKS ── */}
        {activeTab === "links" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">{t("mkt.linksTitle")}</div>
                <div className="inst-page-sub">{t("mkt.linksSubtitle", { count: assignments.length })}</div>
              </div>
            </div>
            {assignments.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text3)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔗</div>
                <div style={{ marginBottom: "0.5rem" }}>{t("mkt.noLinksYet")}</div>
                <div style={{ fontSize: "0.82rem" }}>{t("mkt.noLinksHelp")}</div>
              </div>
            )}
            <div className="courses-mgmt">
              {assignments.map(a => {
                const link = getReferralLink(a);
                const courseRefs = referrals.filter(r => String(r.courseId) === String(a.courseId));
                const accepted = courseRefs.filter(r => r.status === "accepted");
                const pending  = courseRefs.filter(r => r.status === "pending");
                const courseEarnings = accepted.reduce((s,r) => s + Math.round((r.amount||0)*350*a.commissionRate/100), 0);
                return (
                  <div key={a.id} className="mgmt-course-card">
                    <span className="mgmt-course-emoji">📣</span>
                    <div className="mgmt-course-info">
                      <div className="mgmt-course-name">{a.courseName}</div>
                      <div className="mgmt-course-meta">
                        <span style={{ color: "var(--cyan)", fontWeight: 600 }}>{t("mkt.commissionPer", { rate: a.commissionRate })}</span>
                        <span>{t("mkt.assignedDate", { date: new Date(a.createdAt).toLocaleDateString() })}</span>
                      </div>
                      <div style={{ marginTop: "0.75rem", background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 10, padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <div style={{ flex: 1, fontSize: "0.75rem", color: "var(--text2)", wordBreak: "break-all", fontFamily: "monospace" }}>{link}</div>
                        <button onClick={() => copyLink(link, a.id)}
                          style={{ flexShrink: 0, padding: "0.4rem 0.875rem", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--bg)", cursor: "pointer", fontSize: "0.78rem", color: copiedLink===a.id ? "#22c55e" : "var(--text2)", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                          {copiedLink === a.id ? t("mkt.copiedLink") : t("mkt.copyLink")}
                        </button>
                      </div>
                      <div style={{ marginTop: "0.5rem", background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 10, padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.68rem", color: "var(--cyan)", fontWeight: 600, marginBottom: "0.25rem" }}>{t("mkt.directForm")}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text2)", wordBreak: "break-all", fontFamily: "monospace" }}>{getFormLink(a)}</div>
                        </div>
                        <button onClick={() => copyForm(getFormLink(a), a.id)}
                          style={{ flexShrink: 0, padding: "0.4rem 0.875rem", borderRadius: 8, border: "1px solid var(--cyan)", background: copiedForm===a.id ? "rgba(6,182,212,0.15)" : "var(--bg)", cursor: "pointer", fontSize: "0.78rem", color: "var(--cyan)", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                          {copiedForm === a.id ? t("mkt.copiedForm") : t("mkt.copyForm")}
                        </button>
                      </div>
                      <div className="mgmt-course-stats">
                        <div className="mgmt-stat"><div className="mgmt-stat-val">{courseRefs.length}</div><div className="mgmt-stat-lbl">{t("mkt.totalRefs")}</div></div>
                        <div className="mgmt-stat"><div className="mgmt-stat-val">{pending.length}</div><div className="mgmt-stat-lbl">{t("mkt.pending")}</div></div>
                        <div className="mgmt-stat"><div className="mgmt-stat-val">{accepted.length}</div><div className="mgmt-stat-lbl">{t("mkt.accepted")}</div></div>
                        <div className="mgmt-stat"><div className="mgmt-stat-val" style={{ color: "var(--cyan)" }}>{courseEarnings > 0 ? `SDG ${courseEarnings.toLocaleString()}` : "—"}</div><div className="mgmt-stat-lbl">{t("mkt.earnings")}</div></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── EARNINGS ── */}
        {activeTab === "earnings" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">{t("mkt.earningsTitle")}</div>
                <div className="inst-page-sub">{t("mkt.earningsSubtitle", { count: referrals.filter(r=>r.status==="accepted").length, total: totalEarnings.toLocaleString() })}</div>
              </div>
            </div>
            {assignments.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                {assignments.map(a => {
                  const accepted = referrals.filter(r => String(r.courseId)===String(a.courseId) && r.status==="accepted");
                  const earned   = accepted.reduce((s,r) => s+Math.round((r.amount||0)*350*a.commissionRate/100), 0);
                  return (
                    <div key={a.id} style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 12, padding: "1rem" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginBottom: "0.3rem" }}>📚 {a.courseName}</div>
                      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--cyan)" }}>SDG {earned.toLocaleString()}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: "0.25rem" }}>{accepted.length} students · {a.commissionRate}% rate</div>
                    </div>
                  );
                })}
              </div>
            )}
            {referrals.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text3)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>💰</div>
                <div>{t("mkt.noEarnings")}</div>
              </div>
            )}
            <div className="requests-list">
              {referrals.map(r => {
                const a          = assignments.find(a => String(a.courseId)===String(r.courseId));
                const commission = a ? Math.round((r.amount||0)*350*a.commissionRate/100) : 0;
                return (
                  <div key={r.id} className="req-card">
                    <div className="req-avatar">{r.avatar || r.name?.slice(0,2).toUpperCase()}</div>
                    <div className="req-info">
                      <div className="req-name">{r.name}</div>
                      <div className="req-course-name">{r.course}</div>
                      <div className="req-details">
                        📞 {r.phone} &nbsp;·&nbsp;
                        <span className="req-payment-badge">
                          {r.payment==="bank" ? t("mkt.bankTransfer") : t("mkt.mobileMoney")} · SDG {((r.amount||0)*350).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="req-time">{r.time}</div>
                      <span className={`req-status ${r.status}`} style={{ display: "inline-block", marginTop: "0.4rem" }}>{r.status}</span>
                      {a && r.status==="accepted" && commission > 0 && (
                        <div style={{ marginTop: "0.4rem", fontSize: "0.875rem", fontWeight: 700, color: "#22c55e" }}>+SDG {commission.toLocaleString()}</div>
                      )}
                      {r.status==="pending" && (
                        <div style={{ marginTop: "0.3rem", fontSize: "0.72rem", color: "var(--text3)" }}>~SDG {commission.toLocaleString()} pending</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default MarketerDashboard;
