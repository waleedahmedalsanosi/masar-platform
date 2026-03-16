import React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

export default function Overview({ courses, requests, pendingCount, setActiveTab, onAddCourse }) {
  const { t } = useSettings();
  const totalStudents = courses.filter(c => c.status === "active").reduce((s, c) => s + (c.students || 0), 0);
  const totalRevenue  = courses.reduce((s, c) => s + (c.revenue || 0), 0);

  return (
    <div>
      <div className="inst-page-header">
        <div>
          <div className="inst-page-title">{t("inst.yourCourses")}</div>
          <div className="inst-page-sub">{t("inst.subtitle")}</div>
        </div>
        <button className="btn btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: 9 }} onClick={onAddCourse}>
          {t("inst.addCourse")}
        </button>
      </div>

      <div className="ov-stats">
        {[
          { icon: "👥", val: totalStudents.toLocaleString(), lbl: t("inst.totalStudents"), trend: t("inst.weekTrend"), color: "#6366f1" },
          { icon: "📚", val: courses.length, lbl: t("inst.courses"), trend: t("inst.activeDraft", { active: courses.filter(c=>c.status==="active").length, draft: courses.filter(c=>c.status==="draft").length }), color: "#06b6d4" },
          { icon: "⭐", val: "4.75", lbl: t("inst.avgRating"), trend: t("inst.basedOn"), color: "#fbbf24" },
          { icon: "💰", val: `SDG ${totalRevenue.toLocaleString()}`, lbl: t("inst.totalRevenue"), trend: t("inst.monthTrend"), color: "#22c55e" },
        ].map(s => (
          <div key={s.lbl} className="ov-stat-card">
            <div className="ov-stat-glow" style={{ background: s.color }} />
            <div className="ov-stat-icon">{s.icon}</div>
            <div className="ov-stat-val" style={{ background: `linear-gradient(135deg,${s.color},white)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
            <div className="ov-stat-lbl">{s.lbl}</div>
            <div className="ov-stat-trend">{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="ov-grid">
        <div className="ov-card">
          <div className="ov-card-hd">
            {t("inst.yourCourses")}
            <span className="ov-see-all" onClick={() => setActiveTab("courses")}>{t("inst.manageAll")}</span>
          </div>
          <div className="ov-card-bd">
            {courses.length === 0 && <div style={{ color: "var(--text3)", fontSize: "0.82rem", padding: "0.5rem 0" }}>{t("inst.noCourses")}</div>}
            {courses.map(c => (
              <div key={c.id} className="ov-course-row">
                <span className="ov-course-icon">{c.image}</span>
                <div style={{ flex: 1 }}>
                  <div className="ov-course-name">{c.title}</div>
                  <div className="ov-course-students">{c.students} {c.rating > 0 ? `⭐ ${c.rating}` : t("inst.noRatings")}</div>
                </div>
                <span className={`ov-course-status status-${c.status}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ov-card">
          <div className="ov-card-hd">
            {t("inst.recentRequests")}
            {pendingCount > 0 && <span className="ov-see-all" onClick={() => setActiveTab("requests")}>{t("inst.pendingArrow", { count: pendingCount })}</span>}
          </div>
          <div className="ov-card-bd">
            {requests.length === 0 && <div style={{ color: "var(--text3)", fontSize: "0.82rem", padding: "0.5rem 0" }}>{t("inst.noRequests")}</div>}
            {requests.slice(0, 4).map(r => (
              <div key={r.id} className="ov-req-row">
                {r.status === "pending" && <div className="ov-req-dot" />}
                <div className="ov-req-avatar">{r.avatar || r.name?.slice(0,2).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div className="ov-req-name">{r.name}</div>
                  <div className="ov-req-course">{r.course}</div>
                </div>
                <div>
                  <div className="ov-req-time">{r.time}</div>
                  <div style={{ textAlign: "right", marginTop: "0.2rem" }}>
                    <span className={`req-status ${r.status}`}>{r.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
