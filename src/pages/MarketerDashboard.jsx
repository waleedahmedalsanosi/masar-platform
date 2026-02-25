/**
 * @file MarketerDashboard.jsx
 * @description لوحة تحكم المسوق
 *
 * تتضمن:
 * - Overview: إحصائيات عامة (كورسات، إحالات، مكاسب)
 * - My Links: روابط الإحالة لكل كورس معيّن مع إمكانية النسخ
 * - Earnings: قائمة الطلاب المُحالين وعمولة كل طالب
 */

import { useState, useEffect } from "react";
import { api } from "../services/api";

function MarketerDashboard({ user, setPage }) {
  const marketerId = String(user?.id || "");

  const [activeTab,   setActiveTab]   = useState("overview");
  const [assignments, setAssignments] = useState([]);
  const [referrals,   setReferrals]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [copiedLink,  setCopiedLink]  = useState("");
  const [copiedForm,  setCopiedForm]  = useState("");
  const [refreshKey,  setRefreshKey]  = useState(0);

  const name     = user?.name || "Marketer";
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

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
      } catch {
        // json-server غير مشغّل
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [marketerId, refreshKey]);

  const getReferralLink = (a) =>
    `${window.location.origin}/?ref=${marketerId}&course=${a.courseId}`;

  const getFormLink = (a) =>
    `${window.location.origin}/?ref=${marketerId}&course=${a.courseId}&enroll=1`;

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

  // حساب الأرباح الإجمالية من الطلبات المقبولة
  const totalEarnings = referrals
    .filter(r => r.status === "accepted")
    .reduce((sum, r) => {
      const a = assignments.find(a => String(a.courseId) === String(r.courseId));
      return sum + (a ? Math.round((r.amount || 0) * 350 * a.commissionRate / 100) : 0);
    }, 0);

  const tabs = [
    { key: "overview", label: "Overview",  icon: "📊" },
    { key: "links",    label: "My Links",  icon: "🔗" },
    { key: "earnings", label: "Earnings",  icon: "💰" },
  ];

  if (loading) return (
    <div className="inst-dash" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", color: "var(--text3)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⏳</div>
        <div>Loading dashboard...</div>
        <div style={{ fontSize: "0.78rem", marginTop: "0.5rem" }}>Make sure the server is running: <code>npm run start</code></div>
      </div>
    </div>
  );

  return (
    <div className="inst-dash">
      {/* Tab bar */}
      <div className="inst-topbar" style={{ display: "flex", alignItems: "center" }}>
        {tabs.map(t => (
          <div key={t.key} className={`inst-tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
            <span>{t.icon}</span> {t.label}
          </div>
        ))}
        <button
          onClick={reload}
          title="Refresh data"
          style={{ marginLeft: "auto", padding: "0.35rem 0.75rem", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--bg)", cursor: "pointer", fontSize: "0.82rem", color: "var(--text2)", display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}
        >
          🔄 Refresh
        </button>
      </div>

      <div className="inst-content">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">Welcome back, {name.split(" ")[0]} 👋</div>
                <div className="inst-page-sub">Track your referrals and earnings across all assigned courses</div>
              </div>
            </div>

            {/* Stats */}
            <div className="ov-stats">
              {[
                { icon: "🔗", val: assignments.length,                              lbl: "Assigned Courses",  color: "#6366f1" },
                { icon: "👥", val: referrals.length,                                lbl: "Total Referrals",   color: "#06b6d4" },
                { icon: "✅", val: referrals.filter(r => r.status === "accepted").length, lbl: "Accepted",    color: "#22c55e" },
                { icon: "💰", val: `SDG ${totalEarnings.toLocaleString()}`,          lbl: "Total Earnings",    color: "#fbbf24" },
              ].map(s => (
                <div key={s.lbl} className="ov-stat-card">
                  <div className="ov-stat-glow" style={{ background: s.color }} />
                  <div className="ov-stat-icon">{s.icon}</div>
                  <div className="ov-stat-val" style={{ background: `linear-gradient(135deg,${s.color},white)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {s.val}
                  </div>
                  <div className="ov-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>

            <div className="ov-grid">
              {/* My referral links */}
              <div className="ov-card">
                <div className="ov-card-hd">
                  🔗 My Referral Links
                  <span className="ov-see-all" onClick={() => setActiveTab("links")}>See all →</span>
                </div>
                <div className="ov-card-bd">
                  {assignments.length === 0 && (
                    <div style={{ color: "var(--text3)", fontSize: "0.82rem", padding: "0.5rem 0" }}>
                      No courses assigned yet. Ask an instructor to assign you.
                    </div>
                  )}
                  {assignments.map(a => {
                    const courseRefs = referrals.filter(r => String(r.courseId) === String(a.courseId));
                    return (
                      <div key={a.id} className="ov-course-row">
                        <span className="ov-course-icon">📣</span>
                        <div style={{ flex: 1 }}>
                          <div className="ov-course-name">{a.courseName}</div>
                          <div className="ov-course-students">
                            {a.commissionRate}% commission · {courseRefs.length} referrals
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent referrals */}
              <div className="ov-card">
                <div className="ov-card-hd">
                  📥 Recent Referrals
                  <span className="ov-see-all" onClick={() => setActiveTab("earnings")}>See all →</span>
                </div>
                <div className="ov-card-bd">
                  {referrals.length === 0 && (
                    <div style={{ color: "var(--text3)", fontSize: "0.82rem", padding: "0.5rem 0" }}>
                      No referrals yet. Share your links to start earning!
                    </div>
                  )}
                  {referrals.slice(0, 4).map(r => (
                    <div key={r.id} className="ov-req-row">
                      <div className="ov-req-avatar">{r.avatar || r.name?.slice(0, 2).toUpperCase()}</div>
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
                <div className="inst-page-title">My Referral Links</div>
                <div className="inst-page-sub">
                  {assignments.length} courses assigned — share these links to track your referrals
                </div>
              </div>
            </div>

            {assignments.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text3)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔗</div>
                <div style={{ marginBottom: "0.5rem" }}>No courses assigned yet.</div>
                <div style={{ fontSize: "0.82rem" }}>When an instructor assigns you to a course, your unique referral link will appear here.</div>
              </div>
            )}

            <div className="courses-mgmt">
              {assignments.map(a => {
                const link         = getReferralLink(a);
                const courseRefs   = referrals.filter(r => String(r.courseId) === String(a.courseId));
                const accepted     = courseRefs.filter(r => r.status === "accepted");
                const pending      = courseRefs.filter(r => r.status === "pending");
                const courseEarnings = accepted.reduce(
                  (s, r) => s + Math.round((r.amount || 0) * 350 * a.commissionRate / 100), 0
                );

                return (
                  <div key={a.id} className="mgmt-course-card">
                    <span className="mgmt-course-emoji">📣</span>
                    <div className="mgmt-course-info">
                      <div className="mgmt-course-name">{a.courseName}</div>
                      <div className="mgmt-course-meta">
                        <span style={{ color: "var(--cyan)", fontWeight: 600 }}>💰 {a.commissionRate}% commission per student</span>
                        <span>📅 Assigned {new Date(a.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Referral link box */}
                      <div style={{ marginTop: "0.75rem", background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 10, padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <div style={{ flex: 1, fontSize: "0.75rem", color: "var(--text2)", wordBreak: "break-all", fontFamily: "monospace" }}>
                          {link}
                        </div>
                        <button
                          onClick={() => copyLink(link, a.id)}
                          style={{ flexShrink: 0, padding: "0.4rem 0.875rem", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--bg)", cursor: "pointer", fontSize: "0.78rem", color: copiedLink === a.id ? "#22c55e" : "var(--text2)", whiteSpace: "nowrap", transition: "all 0.2s" }}
                        >
                          {copiedLink === a.id ? "✓ Copied!" : "📋 Copy Link"}
                        </button>
                      </div>

                      {/* Direct enrollment form link box */}
                      <div style={{ marginTop: "0.5rem", background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 10, padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.68rem", color: "var(--cyan)", fontWeight: 600, marginBottom: "0.25rem" }}>
                            📝 Direct Enrollment Form
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text2)", wordBreak: "break-all", fontFamily: "monospace" }}>
                            {getFormLink(a)}
                          </div>
                        </div>
                        <button
                          onClick={() => copyForm(getFormLink(a), a.id)}
                          style={{ flexShrink: 0, padding: "0.4rem 0.875rem", borderRadius: 8, border: "1px solid var(--cyan)", background: copiedForm === a.id ? "rgba(6,182,212,0.15)" : "var(--bg)", cursor: "pointer", fontSize: "0.78rem", color: copiedForm === a.id ? "var(--cyan)" : "var(--cyan)", whiteSpace: "nowrap", transition: "all 0.2s" }}
                        >
                          {copiedForm === a.id ? "✓ Copied!" : "📝 Copy Form"}
                        </button>
                      </div>

                      <div className="mgmt-course-stats">
                        <div className="mgmt-stat">
                          <div className="mgmt-stat-val">{courseRefs.length}</div>
                          <div className="mgmt-stat-lbl">Total Refs</div>
                        </div>
                        <div className="mgmt-stat">
                          <div className="mgmt-stat-val">{pending.length}</div>
                          <div className="mgmt-stat-lbl">Pending</div>
                        </div>
                        <div className="mgmt-stat">
                          <div className="mgmt-stat-val">{accepted.length}</div>
                          <div className="mgmt-stat-lbl">Accepted</div>
                        </div>
                        <div className="mgmt-stat">
                          <div className="mgmt-stat-val" style={{ color: "var(--cyan)" }}>
                            {courseEarnings > 0 ? `SDG ${courseEarnings.toLocaleString()}` : "—"}
                          </div>
                          <div className="mgmt-stat-lbl">Earnings</div>
                        </div>
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
                <div className="inst-page-title">Earnings</div>
                <div className="inst-page-sub">
                  {referrals.filter(r => r.status === "accepted").length} accepted referrals ·
                  {" "}SDG {totalEarnings.toLocaleString()} total earned
                </div>
              </div>
            </div>

            {/* Summary cards */}
            {assignments.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                {assignments.map(a => {
                  const accepted = referrals.filter(r => String(r.courseId) === String(a.courseId) && r.status === "accepted");
                  const earned   = accepted.reduce((s, r) => s + Math.round((r.amount || 0) * 350 * a.commissionRate / 100), 0);
                  return (
                    <div key={a.id} style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 12, padding: "1rem" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginBottom: "0.3rem" }}>📚 {a.courseName}</div>
                      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--cyan)" }}>
                        SDG {earned.toLocaleString()}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: "0.25rem" }}>
                        {accepted.length} students · {a.commissionRate}% rate
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {referrals.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text3)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>💰</div>
                <div>No referrals yet. Share your links to start earning!</div>
              </div>
            )}

            <div className="requests-list">
              {referrals.map(r => {
                const a          = assignments.find(a => String(a.courseId) === String(r.courseId));
                const commission = a ? Math.round((r.amount || 0) * 350 * a.commissionRate / 100) : 0;
                return (
                  <div key={r.id} className="req-card">
                    <div className="req-avatar">{r.avatar || r.name?.slice(0, 2).toUpperCase()}</div>
                    <div className="req-info">
                      <div className="req-name">{r.name}</div>
                      <div className="req-course-name">{r.course}</div>
                      <div className="req-details">
                        📞 {r.phone}
                        &nbsp;·&nbsp;
                        <span className="req-payment-badge">
                          {r.payment === "bank" ? "🏦 Bank Transfer" : "📱 Mobile Money"} · SDG {((r.amount || 0) * 350).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="req-time">{r.time}</div>
                      <span className={`req-status ${r.status}`} style={{ display: "inline-block", marginTop: "0.4rem" }}>
                        {r.status}
                      </span>
                      {a && r.status === "accepted" && commission > 0 && (
                        <div style={{ marginTop: "0.4rem", fontSize: "0.875rem", fontWeight: 700, color: "#22c55e" }}>
                          +SDG {commission.toLocaleString()}
                        </div>
                      )}
                      {r.status === "pending" && (
                        <div style={{ marginTop: "0.3rem", fontSize: "0.72rem", color: "var(--text3)" }}>
                          ~SDG {commission.toLocaleString()} pending
                        </div>
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
