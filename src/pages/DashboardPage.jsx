import { useState } from "react";
import { COURSES } from "../data";
import { useSettings } from "../contexts/SettingsContext";

const studentData = {
  name: "Mohammed Abdallah", role: "Student", specialization: "Data Science & ML",
  interests: ["Python", "Machine Learning", "Data Visualization", "SQL", "Statistics"],
  enrolled: [
    { id: 1, progress: 65 },
    { id: 3, progress: 20 },
    { id: 5, progress: 90 },
  ],
  recommended: [2, 6, 7],
};

function DashboardPage({ user, setPage }) {
  const { t } = useSettings();
  const displayUser = user || studentData;
  const name = displayUser.name || studentData.name;
  const role = displayUser.role || "Student";
  const specialization = displayUser.specialization || studentData.specialization;
  const initials = name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

  const enrolled = studentData.enrolled.map(e => ({ ...COURSES.find(c => c.id === e.id), progress: e.progress }));
  const recommended = studentData.recommended.map(id => COURSES.find(c => c.id === id));

  const quickStats = [
    ["3",   t("dash.enrolled")],
    ["1",   t("dash.completed")],
    ["58%", t("dash.avgProgress")],
    ["4.8", t("dash.avgRating")],
  ];

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div className="dash-welcome">{t("dash.welcome", { name: name.split(" ")[0] })}</div>
        <div className="dash-sub">{t("dash.subtitle", { specialization })}</div>
      </div>
      <div className="dash-grid">
        <div className="dash-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-name">{name}</div>
            <div className="profile-role">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
            <div className="profile-spec">{specialization}</div>
            <div className="profile-progress" style={{ marginTop: "1.25rem" }}>
              <div className="progress-label">
                <span style={{ color: "var(--text2)", fontSize: "0.75rem" }}>{t("dash.progress")}</span>
                <span style={{ color: "var(--cyan)", fontSize: "0.75rem" }}>58%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: "58%" }} /></div>
            </div>
          </div>
          <div className="sidebar-card">
            <div className="sidebar-title">{t("dash.interests")}</div>
            <div>
              {studentData.interests.map(i => (
                <span key={i} className="interest-tag" style={{cursor:"pointer"}} onClick={()=>setPage&&setPage("courses")} title={t("dash.browse")}>{i}</span>
              ))}
            </div>
          </div>
          <div className="sidebar-card">
            <div className="sidebar-title">{t("dash.quickStats")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {quickStats.map(([v, l]) => (
                <div key={l} style={{ textAlign: "center", padding: "0.75rem", background: "var(--bg)", borderRadius: "10px" }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>{v}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text3)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-main">
          <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 14, padding: "1.5rem" }}>
            <div className="dash-section-title">{t("dash.myCourses")}</div>
            <div className="enrolled-list">
              {enrolled.map(c => (
                <div key={c.id} className="enrolled-card" style={{cursor:"pointer"}} onClick={()=>setPage&&setPage("course-"+c.id)}>
                  <div className="enrolled-icon">{c.image}</div>
                  <div style={{ flex: 1 }}>
                    <div className="enrolled-title">{c.title}</div>
                    <div className="enrolled-instructor">{c.instructor}</div>
                    <div className="progress-bar" style={{ maxWidth: "100%" }}>
                      <div className="progress-fill" style={{ width: `${c.progress}%` }} />
                    </div>
                    <div className="enrolled-footer">
                      <span className="enrolled-progress-text">{t("dash.pctComplete", { progress: c.progress })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 14, padding: "1.5rem" }}>
            <div className="dash-section-title">{t("dash.recommended")}</div>
            <div className="rec-list">
              {recommended.map(c => (
                <div key={c.id} className="rec-card" style={{cursor:"pointer"}} onClick={()=>setPage&&setPage("course-"+c.id)}>
                  <div className="rec-left">
                    <div className="rec-icon">{c.image}</div>
                    <div>
                      <div className="rec-title">{c.title}</div>
                      <div className="rec-meta">{c.instructor} · {c.level} · {c.duration}</div>
                    </div>
                  </div>
                  <div className="rec-price">${c.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
