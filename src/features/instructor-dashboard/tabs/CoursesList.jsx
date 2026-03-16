import React from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../../contexts/SettingsContext";

export default function CoursesList({ courses, onAddCourse, onEditCourse, onPublish }) {
  const navigate = useNavigate();
  const { t } = useSettings();

  return (
    <div>
      <div className="inst-page-header">
        <div>
          <div className="inst-page-title">{t("inst.coursesTitle")}</div>
          <div className="inst-page-sub">{t("inst.coursesSubtitle", { count: courses.length, active: courses.filter(c=>c.status==="active").length })}</div>
        </div>
        <button className="btn btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: 9 }} onClick={onAddCourse}>
          {t("inst.addCourse")}
        </button>
      </div>

      <div className="courses-mgmt">
        {courses.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text3)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📚</div>
            <div>{t("inst.noCoursesLong")}</div>
          </div>
        )}
        {courses.map(c => (
          <div key={c.id} className="mgmt-course-card">
            <span className="mgmt-course-emoji">{c.image}</span>
            <div className="mgmt-course-info">
              <div className="mgmt-course-name">{c.title}</div>
              <div className="mgmt-course-meta">
                <span>{t("inst.startDate", { date: c.startDate })}</span>
                <span>{t("inst.price", { price: ((c.price||0)*350).toLocaleString() })}</span>
                <span className={`ov-course-status status-${c.status}`}>{c.status}</span>
              </div>
              {c.enrollmentFields && (
                <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: "0.25rem" }}>
                  {t("inst.fieldsMeta", { count: c.enrollmentFields.length, required: c.enrollmentFields.filter(f=>f.required).length })}
                </div>
              )}
              <div className="mgmt-course-stats">
                <div className="mgmt-stat"><div className="mgmt-stat-val">{c.students}</div><div className="mgmt-stat-lbl">{t("inst.students")}</div></div>
                <div className="mgmt-stat"><div className="mgmt-stat-val">{c.rating > 0 ? c.rating : "—"}</div><div className="mgmt-stat-lbl">{t("inst.rating")}</div></div>
                <div className="mgmt-stat"><div className="mgmt-stat-val" style={{ color: "var(--cyan)" }}>{c.revenue > 0 ? `SDG ${c.revenue.toLocaleString()}` : "—"}</div><div className="mgmt-stat-lbl">{t("inst.revenue")}</div></div>
              </div>
            </div>
            <div className="mgmt-actions">
              <button className="mgmt-btn mgmt-btn-edit" onClick={() => onEditCourse(c)}>{t("inst.editBtn")}</button>
              {c.id <= 8 && <button className="mgmt-btn mgmt-btn-view" onClick={() => navigate(`/courses/${c.id}`)}>{t("inst.viewBtn")}</button>}
              {c.status === "draft" && (
                <button className="mgmt-btn" style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", color: "#22c55e" }}
                  onClick={() => onPublish(c.id)}>
                  {t("inst.publishBtn")}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
