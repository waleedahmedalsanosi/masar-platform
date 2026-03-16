import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useSettings } from "../../../contexts/SettingsContext";

export default function ProfileTab({ courses }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useSettings();
  const [profileSaved, setProfileSaved] = useState(false);

  const name = user?.name || "Ahmed Hassan";
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const totalStudents = courses.filter(c => c.status === "active").reduce((s, c) => s + (c.students || 0), 0);

  return (
    <div>
      <div className="inst-page-header">
        <div>
          <div className="inst-page-title">{t("inst.profileTitle")}</div>
          <div className="inst-page-sub">{t("inst.profileSubtitle")}</div>
        </div>
        <button className="btn btn-ghost" style={{ padding:"0.6rem 1.25rem", fontSize:"0.875rem", borderRadius:9 }} onClick={() => navigate("/instructors/1")}>
          {t("inst.viewPublic")}
        </button>
      </div>

      <div className="inst-profile-grid">
        <div className="inst-profile-card">
          <div className="inst-profile-avatar-wrap">
            <div className="inst-profile-avatar-large">{initials}</div>
          </div>
          <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1rem", margin:"0.5rem 0 0.2rem" }}>{name}</div>
          <div style={{ fontSize:"0.82rem", color:"var(--indigo-light)" }}>{t("inst.instructorRole")}</div>
          <div style={{ fontSize:"0.78rem", color:"var(--text3)", marginTop:"0.5rem" }}>{user?.email}</div>
          <div style={{ marginTop:"1rem", paddingTop:"1rem", borderTop:"1px solid var(--border2)", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
            <div><div style={{ fontFamily:"Syne,sans-serif", fontWeight:700 }}>{totalStudents}</div><div style={{ fontSize:"0.7rem", color:"var(--text3)" }}>{t("inst.students")}</div></div>
            <div><div style={{ fontFamily:"Syne,sans-serif", fontWeight:700 }}>{courses.length}</div><div style={{ fontSize:"0.7rem", color:"var(--text3)" }}>{t("inst.courses")}</div></div>
          </div>
        </div>

        <div className="inst-profile-form">
          <div className="form-section-title">{t("inst.basicInfo")}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.875rem" }}>
            <div className="form-group"><label className="form-label">{t("inst.fullName")}</label><input className="form-input" defaultValue={name} /></div>
            <div className="form-group"><label className="form-label">{t("inst.titleRole")}</label><input className="form-input" defaultValue="Data Scientist" /></div>
          </div>
          <div className="form-group"><label className="form-label">{t("inst.email")}</label><input className="form-input" defaultValue={user?.email} /></div>
          <div className="form-group"><label className="form-label">{t("inst.phone2")}</label><input className="form-input" placeholder={t("inst.phonePlaceholder")} /></div>

          <div className="form-section-title">{t("inst.aboutYou")}</div>
          <div className="form-group">
            <label className="form-label">{t("inst.bio")} <span style={{ color:"var(--text3)", fontWeight:400 }}>{t("inst.bioNote")}</span></label>
            <textarea className="form-input" rows={3} style={{ resize:"none", lineHeight:1.6 }} defaultValue="5+ years in data science, ex-Google and currently leading the data team at a Khartoum-based fintech." />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.875rem" }}>
            <div className="form-group"><label className="form-label">{t("inst.linkedin")}</label><input className="form-input" placeholder={t("inst.linkedinPlaceholder")} /></div>
            <div className="form-group"><label className="form-label">{t("inst.github")}</label><input className="form-input" placeholder={t("inst.githubPlaceholder")} /></div>
          </div>

          <div className="form-section-title">{t("inst.specializations")}</div>
          <div className="form-group">
            <label className="form-label">{t("inst.skills")} <span style={{ color:"var(--text3)", fontWeight:400 }}>{t("inst.skillsNote")}</span></label>
            <input className="form-input" defaultValue="Python, Machine Learning, Data Science, Statistics" />
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", gap:"0.75rem", marginTop:"0.5rem" }}>
            <button className="btn btn-ghost" style={{ padding:"0.6rem 1.25rem", borderRadius:9, fontSize:"0.875rem" }} onClick={() => setProfileSaved(false)}>{t("inst.discard")}</button>
            <button className="btn btn-primary" style={{ padding:"0.6rem 1.25rem", borderRadius:9, fontSize:"0.875rem" }} onClick={() => setProfileSaved(true)}>
              {profileSaved ? t("inst.saved") : t("inst.saveChanges")}
            </button>
          </div>
          {profileSaved && <div style={{ textAlign:"right", fontSize:"0.78rem", color:"#22c55e", marginTop:"0.4rem" }}>{t("inst.profileUpdated")}</div>}
        </div>
      </div>
    </div>
  );
}
