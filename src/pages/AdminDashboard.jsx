import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useSettings } from "../contexts/SettingsContext";

const ROLE_COLORS = {
  student:    { bg: "rgba(16,185,129,0.12)", text: "#10b981" },
  instructor: { bg: "rgba(99,102,241,0.12)",  text: "#6366f1" },
  marketer:   { bg: "rgba(245,158,11,0.12)",  text: "#f59e0b" },
  center:     { bg: "rgba(6,182,212,0.12)",   text: "#06b6d4" },
  admin:      { bg: "rgba(239,68,68,0.12)",   text: "#ef4444" },
};

const STATUS_COLORS = {
  pending:  { bg: "rgba(245,158,11,0.12)",  text: "#f59e0b" },
  accepted: { bg: "rgba(16,185,129,0.12)",  text: "#10b981" },
  rejected: { bg: "rgba(239,68,68,0.12)",   text: "#ef4444" },
  reserved: { bg: "rgba(139,92,246,0.12)",  text: "#8b5cf6" },
};

function RoleBadge({ role }) {
  const c = ROLE_COLORS[role] || { bg: "rgba(255,255,255,0.08)", text: "var(--text2)" };
  return (
    <span style={{ background: c.bg, color: c.text, borderRadius: 6, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700, textTransform: "capitalize" }}>
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{ background: c.bg, color: c.text, borderRadius: 6, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700, textTransform: "capitalize" }}>
      {status}
    </span>
  );
}

export default function AdminDashboard({ user, setPage }) {
  const { t } = useSettings();
  const [tab, setTab]               = useState("overview");
  const [users, setUsers]           = useState([]);
  const [courses, setCourses]       = useState([]);
  const [requests, setRequests]     = useState([]);
  const [views, setViews]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [reqFilter, setReqFilter]   = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  useEffect(() => {
    Promise.all([
      api.getAllUsers(),
      api.getAllCourses(),
      api.getAllRequests(),
      api.getAllCourseViews(),
    ])
      .then(([u, c, r, v]) => {
        setUsers(u || []);
        setCourses(c || []);
        setRequests(r || []);
        setViews(v || []);
      })
      .catch(() => setError(t("admin.serverHint")))
      .finally(() => setLoading(false));
  }, []);

  // ── Computed values ──────────────────────────────────────────────────────
  const totalUsers       = users.length;
  const totalCourses     = courses.length;
  const totalEnrollments = requests.length;
  const totalReserved    = requests.filter(r => r.status === "reserved").length;
  const totalPending     = requests.filter(r => r.status === "pending").length;
  const totalAccepted    = requests.filter(r => r.status === "accepted").length;
  const totalRejected    = requests.filter(r => r.status === "rejected").length;
  const totalViews       = views.length;

  const roleCounts = ["student", "instructor", "marketer", "center", "admin"].map(role => ({
    role,
    count: users.filter(u => u.role === role).length,
  }));

  const acceptRate  = totalEnrollments > 0 ? Math.round((totalAccepted / totalEnrollments) * 100) : 0;
  const reserveRate = totalEnrollments > 0 ? Math.round((totalReserved / totalEnrollments) * 100) : 0;

  // Top courses by views
  const viewsByCourse = courses.map(c => ({
    ...c,
    viewCount: views.filter(v => String(v.courseId) === String(c.id)).length,
  })).sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

  // Top courses by enrollments
  const enrollByCourse = courses.map(c => ({
    ...c,
    enrollCount: requests.filter(r => String(r.courseId) === String(c.id)).length,
  })).sort((a, b) => b.enrollCount - a.enrollCount).slice(0, 5);

  // ── User actions ─────────────────────────────────────────────────────────
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUser(userId, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch {
      alert("Failed to update role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (String(userId) === String(user?.id)) { alert(t("admin.cannotDeleteSelf")); return; }
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch {
      alert("Failed to delete user.");
    }
  };

  // ── Course actions ───────────────────────────────────────────────────────
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await api.deleteCourse(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch {
      alert("Failed to delete course.");
    }
  };

  // ── Request actions ──────────────────────────────────────────────────────
  const handleRequestStatus = async (reqId, status) => {
    try {
      await api.updateRequest(reqId, { status });
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r));
    } catch {
      alert("Failed to update request.");
    }
  };

  // ── Filtered data ─────────────────────────────────────────────────────────
  const filteredUsers = userFilter === "all" ? users : users.filter(u => u.role === userFilter);
  const filteredCourses = courseFilter === "all" ? courses : courses.filter(c => (c.status || "active") === courseFilter);
  const filteredRequests = reqFilter === "all" ? requests : requests.filter(r => r.status === reqFilter);

  const tabs = [
    { key: "overview",   icon: "🏠", label: t("admin.tab.overview") },
    { key: "users",      icon: "👥", label: t("admin.tab.users") },
    { key: "courses",    icon: "📚", label: t("admin.tab.courses") },
    { key: "requests",   icon: "📋", label: t("admin.tab.requests") },
    { key: "analytics",  icon: "📈", label: t("admin.tab.analytics") },
  ];

  if (loading) return (
    <div className="inst-dash" style={{ justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", color: "var(--text3)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
        <div>{t("admin.loading")}</div>
        <div style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.7 }}>{t("admin.serverHint")}</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="inst-dash" style={{ justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", color: "#f87171" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
        <div>{error}</div>
      </div>
    </div>
  );

  return (
    <div className="inst-dash">
      {/* ── Topbar ── */}
      <div className="inst-topbar">
        <div className="inst-page-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#ef4444,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{t("admin.welcome", { name: user?.name?.split(" ")[0] || "Admin" })}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>{t("admin.subtitle")}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", padding: "0 1.5rem 1rem" }}>
          {tabs.map(tb => (
            <button
              key={tb.key}
              className={`tab-btn ${tab === tb.key ? "active" : ""}`}
              onClick={() => setTab(tb.key)}
            >
              {tb.icon} {tb.label}
              {tb.key === "users"    && <span style={{ marginInlineStart: "0.4rem", background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "1px 6px", fontSize: "0.7rem" }}>{totalUsers}</span>}
              {tb.key === "requests" && totalPending > 0 && <span style={{ marginInlineStart: "0.4rem", background: "#f59e0b", borderRadius: 10, padding: "1px 6px", fontSize: "0.7rem", color: "#000" }}>{totalPending}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="inst-content">

        {/* ════════════ OVERVIEW ════════════ */}
        {tab === "overview" && (
          <>
            {/* Stat cards */}
            <div className="ov-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
              <div className="ov-stat-card">
                <div className="ov-stat-icon" style={{ background: "rgba(99,102,241,0.15)" }}>👥</div>
                <div className="ov-stat-value">{totalUsers}</div>
                <div className="ov-stat-label">{t("admin.totalUsers")}</div>
              </div>
              <div className="ov-stat-card">
                <div className="ov-stat-icon" style={{ background: "rgba(6,182,212,0.15)" }}>📚</div>
                <div className="ov-stat-value">{totalCourses}</div>
                <div className="ov-stat-label">{t("admin.totalCourses")}</div>
              </div>
              <div className="ov-stat-card">
                <div className="ov-stat-icon" style={{ background: "rgba(16,185,129,0.15)" }}>📋</div>
                <div className="ov-stat-value">{totalEnrollments}</div>
                <div className="ov-stat-label">{t("admin.totalEnrollments")}</div>
              </div>
              <div className="ov-stat-card">
                <div className="ov-stat-icon" style={{ background: "rgba(139,92,246,0.15)" }}>🔖</div>
                <div className="ov-stat-value">{totalReserved}</div>
                <div className="ov-stat-label">{t("admin.reserved")}</div>
              </div>
            </div>

            {/* Role breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
              <div style={{ background: "var(--surface)", borderRadius: 16, padding: "1.25rem", border: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, marginBottom: "1rem" }}>{t("admin.roleBreakdown")}</div>
                {roleCounts.map(({ role, count }) => {
                  const c = ROLE_COLORS[role];
                  const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                  return (
                    <div key={role} style={{ marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.82rem" }}>
                        <RoleBadge role={role} />
                        <span style={{ color: "var(--text2)", fontWeight: 600 }}>{count}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: "var(--bg3)" }}>
                        <div style={{ height: "100%", borderRadius: 3, background: c?.text || "var(--indigo)", width: `${pct}%`, transition: "width 0.5s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent activity */}
              <div style={{ background: "var(--surface)", borderRadius: 16, padding: "1.25rem", border: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, marginBottom: "1rem" }}>{t("admin.recentActivity")}</div>
                {requests.slice(-5).reverse().map(r => (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid var(--border2)", fontSize: "0.82rem" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div style={{ color: "var(--text3)", fontSize: "0.72rem" }}>{r.course}</div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
                {requests.length === 0 && <div style={{ color: "var(--text3)", fontSize: "0.85rem" }}>No activity yet.</div>}
              </div>
            </div>
          </>
        )}

        {/* ════════════ USERS ════════════ */}
        {tab === "users" && (
          <>
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{t("admin.usersTitle")}</div>
              <div style={{ color: "var(--text3)", fontSize: "0.82rem" }}>{t("admin.usersSubtitle", { count: filteredUsers.length })}</div>
            </div>

            {/* Role filter buttons */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
              {[
                { key: "all",        label: t("admin.filterAll") },
                { key: "student",    label: t("admin.filterStudent") },
                { key: "instructor", label: t("admin.filterInstructor") },
                { key: "marketer",   label: t("admin.filterMarketer") },
                { key: "center",     label: t("admin.filterCenter") },
                { key: "admin",      label: t("admin.filterAdmin") },
              ].map(f => (
                <button
                  key={f.key}
                  className={`filter-btn ${userFilter === f.key ? "active" : ""}`}
                  onClick={() => setUserFilter(f.key)}
                >
                  {f.label}
                  <span style={{ marginInlineStart: "0.35rem", opacity: 0.7, fontSize: "0.72rem" }}>
                    ({f.key === "all" ? users.length : users.filter(u => u.role === f.key).length})
                  </span>
                </button>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--text3)", padding: "3rem" }}>{t("admin.noUsers")}</div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filteredUsers.map(u => {
                const initials = u.name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() || "?";
                return (
                  <div key={u.id} style={{ background: "var(--surface)", borderRadius: 12, padding: "1rem 1.25rem", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{u.name}</div>
                      <div style={{ color: "var(--text3)", fontSize: "0.78rem" }}>{u.email}</div>
                    </div>
                    <RoleBadge role={u.role} />
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      style={{ background: "var(--bg2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.35rem 0.6rem", fontSize: "0.8rem", cursor: "pointer" }}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="marketer">Marketer</option>
                      <option value="center">Center</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "0.35rem 0.75rem", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}
                    >
                      🗑 {t("admin.deleteUser")}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ════════════ COURSES ════════════ */}
        {tab === "courses" && (
          <>
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{t("admin.coursesTitle")}</div>
              <div style={{ color: "var(--text3)", fontSize: "0.82rem" }}>{t("admin.coursesSubtitle", { count: filteredCourses.length })}</div>
            </div>

            {/* Status filter */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {["all", "active", "draft"].map(f => (
                <button
                  key={f}
                  className={`filter-btn ${courseFilter === f ? "active" : ""}`}
                  onClick={() => setCourseFilter(f)}
                >
                  {f === "all" ? t("admin.filterAll") : f === "active" ? t("common.status.active") : t("common.status.draft")}
                </button>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--text3)", padding: "3rem" }}>{t("admin.noCourses")}</div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filteredCourses.map(c => {
                const instructor = users.find(u => String(u.id) === String(c.instructorId));
                const enrollCount = requests.filter(r => String(r.courseId) === String(c.id)).length;
                const viewCount   = views.filter(v => String(v.courseId) === String(c.id)).length;
                return (
                  <div key={c.id} style={{ background: "var(--surface)", borderRadius: 12, padding: "1rem 1.25rem", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
                      {c.image || "📚"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.title}</div>
                      <div style={{ color: "var(--text3)", fontSize: "0.75rem" }}>
                        {t("admin.instructorLabel")}: {instructor?.name || `#${c.instructorId}`} · 👁 {viewCount} · 📋 {enrollCount} · 💰 ${c.price}
                      </div>
                    </div>
                    <span style={{
                      background: c.status === "active" || c.status === "published" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                      color: c.status === "active" || c.status === "published" ? "#10b981" : "#f59e0b",
                      borderRadius: 6, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700
                    }}>
                      {c.status || "active"}
                    </span>
                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "0.35rem 0.75rem", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}
                    >
                      🗑 {t("admin.deleteCourse")}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ════════════ REQUESTS ════════════ */}
        {tab === "requests" && (
          <>
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{t("admin.requestsTitle")}</div>
              <div style={{ color: "var(--text3)", fontSize: "0.82rem" }}>{t("admin.requestsSubtitle", { count: requests.length, pending: totalPending })}</div>
            </div>

            {/* Status filter */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
              {[
                { key: "all",      label: t("admin.filterAll") },
                { key: "pending",  label: t("common.status.pending") },
                { key: "accepted", label: t("common.status.accepted") },
                { key: "rejected", label: t("common.status.rejected") },
                { key: "reserved", label: t("analytics.reserved") },
              ].map(f => (
                <button
                  key={f.key}
                  className={`filter-btn ${reqFilter === f.key ? "active" : ""}`}
                  onClick={() => setReqFilter(f.key)}
                >
                  {f.label}
                  <span style={{ marginInlineStart: "0.35rem", opacity: 0.7, fontSize: "0.72rem" }}>
                    ({f.key === "all" ? requests.length : requests.filter(r => r.status === f.key).length})
                  </span>
                </button>
              ))}
            </div>

            {filteredRequests.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--text3)", padding: "3rem" }}>{t("admin.noRequests")}</div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filteredRequests.map(r => (
                <div key={r.id} className="req-card">
                  <div className="req-avatar">{r.avatar || (r.name?.charAt(0) || "?")}</div>
                  <div className="req-info">
                    <div className="req-name">{r.name}</div>
                    <div className="req-meta">{r.course}</div>
                    <div className="req-meta" style={{ fontSize: "0.72rem" }}>
                      {r.email || r.phone}
                      {r.amount && <span> · 💰 {r.amount} USD</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                    <StatusBadge status={r.status} />
                    {(r.status === "pending" || r.status === "reserved") && (
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => handleRequestStatus(r.id, "accepted")}
                          style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "0.3rem 0.7rem", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600 }}
                        >
                          {t("admin.acceptBtn")}
                        </button>
                        <button
                          onClick={() => handleRequestStatus(r.id, "rejected")}
                          style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "0.3rem 0.7rem", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600 }}
                        >
                          {t("admin.rejectBtn")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ════════════ ANALYTICS ════════════ */}
        {tab === "analytics" && (
          <>
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{t("admin.analyticsTitle")}</div>
              <div style={{ color: "var(--text3)", fontSize: "0.82rem" }}>{t("admin.analyticsSubtitle")}</div>
            </div>

            {/* Platform-wide stat cards */}
            <div className="ov-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", marginBottom: "1.5rem" }}>
              <div className="ov-stat-card">
                <div className="ov-stat-icon" style={{ background: "rgba(99,102,241,0.15)" }}>👁</div>
                <div className="ov-stat-value">{totalViews}</div>
                <div className="ov-stat-label">{t("admin.totalViews")}</div>
              </div>
              <div className="ov-stat-card">
                <div className="ov-stat-icon" style={{ background: "rgba(16,185,129,0.15)" }}>✓</div>
                <div className="ov-stat-value">{acceptRate}%</div>
                <div className="ov-stat-label">{t("admin.acceptRate")}</div>
              </div>
              <div className="ov-stat-card">
                <div className="ov-stat-icon" style={{ background: "rgba(139,92,246,0.15)" }}>🔖</div>
                <div className="ov-stat-value">{reserveRate}%</div>
                <div className="ov-stat-label">{t("admin.reservedRate")}</div>
              </div>
              <div className="ov-stat-card">
                <div className="ov-stat-icon" style={{ background: "rgba(245,158,11,0.15)" }}>⏳</div>
                <div className="ov-stat-value">{totalPending}</div>
                <div className="ov-stat-label">{t("common.status.pending")}</div>
              </div>
            </div>

            {/* Enrollments by Status */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "var(--surface)", borderRadius: 16, padding: "1.25rem", border: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, marginBottom: "1rem" }}>{t("admin.enrollByStatus")}</div>
                {[
                  { label: t("common.status.accepted"), count: totalAccepted, color: "#10b981" },
                  { label: t("common.status.pending"),  count: totalPending,  color: "#f59e0b" },
                  { label: t("analytics.reserved"),     count: totalReserved, color: "#8b5cf6" },
                  { label: t("common.status.rejected"), count: totalRejected, color: "#ef4444" },
                ].map(({ label, count, color }) => {
                  const pct = totalEnrollments > 0 ? Math.round((count / totalEnrollments) * 100) : 0;
                  return (
                    <div key={label} style={{ marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.82rem" }}>
                        <span style={{ color: "var(--text2)" }}>{label}</span>
                        <span style={{ fontWeight: 600 }}>{count} <span style={{ color: "var(--text3)", fontSize: "0.72rem" }}>({pct}%)</span></span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: "var(--bg3)" }}>
                        <div style={{ height: "100%", borderRadius: 3, background: color, width: `${pct}%`, transition: "width 0.5s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Top courses by views */}
              <div style={{ background: "var(--surface)", borderRadius: 16, padding: "1.25rem", border: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, marginBottom: "1rem" }}>{t("admin.topCoursesByViews")}</div>
                {viewsByCourse.length === 0 && <div style={{ color: "var(--text3)", fontSize: "0.85rem" }}>No view data yet.</div>}
                {viewsByCourse.map((c, i) => {
                  const maxV = viewsByCourse[0]?.viewCount || 1;
                  return (
                    <div key={c.id} style={{ marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.82rem" }}>
                        <span style={{ color: "var(--text2)" }}>{i + 1}. {c.image} {c.title}</span>
                        <span style={{ fontWeight: 600 }}>{c.viewCount}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: "var(--bg3)" }}>
                        <div style={{ height: "100%", borderRadius: 3, background: "var(--indigo)", width: `${(c.viewCount / maxV) * 100}%`, transition: "width 0.5s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top courses by enrollments */}
            <div style={{ background: "var(--surface)", borderRadius: 16, padding: "1.25rem", border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, marginBottom: "1rem" }}>{t("admin.topCoursesByEnroll")}</div>
              {enrollByCourse.length === 0 && <div style={{ color: "var(--text3)", fontSize: "0.85rem" }}>No enrollment data yet.</div>}
              {enrollByCourse.map((c, i) => {
                const maxE = enrollByCourse[0]?.enrollCount || 1;
                return (
                  <div key={c.id} style={{ marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.82rem" }}>
                      <span style={{ color: "var(--text2)" }}>{i + 1}. {c.image} {c.title}</span>
                      <span style={{ fontWeight: 600 }}>{c.enrollCount} enrollments</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: "var(--bg3)" }}>
                      <div style={{ height: "100%", borderRadius: 3, background: "#06b6d4", width: `${(c.enrollCount / maxE) * 100}%`, transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
