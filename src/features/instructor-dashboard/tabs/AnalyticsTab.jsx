import React from "react";
import { useSettings } from "../../../contexts/SettingsContext";

export default function AnalyticsTab({ courses, requests, views }) {
  const { t } = useSettings();

  const reservedCount = requests.filter(r => r.status === "reserved").length;
  const totalViews    = views.filter(v => courses.some(c => String(c.id) === String(v.courseId))).length;

  return (
    <div>
      <div className="inst-page-header">
        <div>
          <div className="inst-page-title">{t("analytics.title")}</div>
          <div className="inst-page-sub">{t("analytics.subtitle")}</div>
        </div>
      </div>

      <div className="ov-stats">
        {[
          { icon:"👁",  val: totalViews,                                         lbl: t("analytics.totalViews"),       color:"#6366f1" },
          { icon:"📝",  val: requests.length,                                    lbl: t("analytics.totalSubmissions"), color:"#06b6d4" },
          { icon:"🔖",  val: reservedCount,                                      lbl: t("analytics.reserved"),         color:"#f59e0b" },
          { icon:"✅",  val: requests.filter(r=>r.status==="accepted").length,   lbl: t("analytics.accepted"),         color:"#22c55e" },
        ].map(s => (
          <div key={s.lbl} className="ov-stat-card">
            <div className="ov-stat-glow" style={{ background: s.color }} />
            <div className="ov-stat-icon">{s.icon}</div>
            <div className="ov-stat-val" style={{ background:`linear-gradient(135deg,${s.color},white)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.val}</div>
            <div className="ov-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:"1.5rem" }}>
        <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.92rem", marginBottom:"1rem", color:"var(--text)" }}>
          📊 {t("analytics.perCourse")}
        </div>
        <div className="courses-mgmt">
          {courses.length === 0 && (
            <div style={{ textAlign:"center", padding:"3rem 1rem", color:"var(--text3)" }}>
              <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>📊</div>
              <div>{t("analytics.noCourses")}</div>
            </div>
          )}
          {courses.map(c => {
            const courseRequests = requests.filter(r => String(r.courseId) === String(c.id));
            const courseViews    = views.filter(v => String(v.courseId) === String(c.id));
            const numReserved    = courseRequests.filter(r => r.status === "reserved").length;
            const numPending     = courseRequests.filter(r => r.status === "pending").length;
            const numAccepted    = courseRequests.filter(r => r.status === "accepted").length;
            const numRejected    = courseRequests.filter(r => r.status === "rejected").length;
            const convRate       = courseViews.length > 0 ? Math.round((numAccepted / courseViews.length) * 100) : 0;

            return (
              <div key={c.id} className="mgmt-course-card" style={{ flexDirection:"column", gap:"0.75rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                  <span style={{ fontSize:"1.5rem" }}>{c.image}</span>
                  <div style={{ flex:1 }}>
                    <div className="mgmt-course-name">{c.title}</div>
                    <div style={{ fontSize:"0.73rem", color:"var(--text3)" }}>{c.level} · {c.mode} · ${c.price}</div>
                  </div>
                  <span className={`ov-course-status status-${c.status}`}>{c.status}</span>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"0.4rem" }}>
                  {[
                    { icon:"👁",  val: courseViews.length,    lbl: t("analytics.views"),    color:"#6366f1" },
                    { icon:"📝",  val: courseRequests.length, lbl: t("analytics.submitted"), color:"#06b6d4" },
                    { icon:"🔖",  val: numReserved,           lbl: t("analytics.reserved"), color:"#f59e0b" },
                    { icon:"⏳",  val: numPending,            lbl: t("analytics.pending"),  color:"#94a3b8" },
                    { icon:"✅",  val: numAccepted,           lbl: t("analytics.accepted"), color:"#22c55e" },
                    { icon:"❌",  val: numRejected,           lbl: t("analytics.rejected"), color:"#f87171" },
                  ].map(s => (
                    <div key={s.lbl} style={{ textAlign:"center", background:"var(--bg3)", borderRadius:8, padding:"0.55rem 0.2rem", border:"1px solid var(--border2)" }}>
                      <div style={{ fontSize:"0.9rem", marginBottom:"0.15rem" }}>{s.icon}</div>
                      <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, color:s.color, fontSize:"1.05rem" }}>{s.val}</div>
                      <div style={{ fontSize:"0.62rem", color:"var(--text3)", marginTop:"0.1rem" }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.72rem", color:"var(--text3)", marginBottom:"0.3rem" }}>
                    <span>{t("analytics.convRate")}</span>
                    <span style={{ color: convRate>20?"#22c55e":convRate>10?"#f59e0b":"var(--text3)", fontWeight:600 }}>{convRate}%</span>
                  </div>
                  <div style={{ height:5, background:"var(--border2)", borderRadius:100 }}>
                    <div style={{ height:"100%", width:`${Math.min(convRate,100)}%`, background:"linear-gradient(90deg,#6366f1,#22c55e)", borderRadius:100, transition:"width 0.4s ease" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
