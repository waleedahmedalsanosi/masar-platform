import { useState } from "react";
import { useSettings } from "../../../contexts/SettingsContext";

export default function MarketersList({ assignments, requests, courses, onAssign, onRemove }) {
  const { t } = useSettings();
  const [copiedLink, setCopiedLink] = useState("");

  const copyLink = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(""), 2000);
  };

  return (
    <div>
      <div className="inst-page-header">
        <div>
          <div className="inst-page-title">{t("inst.marketersTitle")}</div>
          <div className="inst-page-sub">{t("inst.marketersSubtitle", { count: assignments.length })}</div>
        </div>
        <button className="btn btn-primary" style={{ padding:"0.6rem 1.25rem", fontSize:"0.875rem", borderRadius:9 }} onClick={onAssign}>
          {t("inst.assignMarketer")}
        </button>
      </div>

      {assignments.length === 0 && (
        <div style={{ textAlign:"center", padding:"3rem 1rem", color:"var(--text3)" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>📢</div>
          <div style={{ marginBottom:"0.5rem" }}>{t("inst.noMarketers")}</div>
          <div style={{ fontSize:"0.82rem" }}>{t("inst.marketerHelp")}</div>
        </div>
      )}

      <div className="courses-mgmt">
        {assignments.map(a => {
          const link = `${window.location.origin}/?ref=${a.marketerId}&course=${a.courseId}`;
          const courseReferrals = requests.filter(r => String(r.marketerId)===String(a.marketerId) && String(r.courseId)===String(a.courseId));
          const accepted = courseReferrals.filter(r => r.status==="accepted");
          const commissionTotal = accepted.reduce((s,r) => s+Math.round((r.amount||0)*350*a.commissionRate/100), 0);
          const avatarInitials = a.marketerName.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

          return (
            <div key={a.id} className="mgmt-course-card">
              <div style={{ width:44, height:44, borderRadius:"50%", background:"var(--gradient)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Syne,sans-serif", fontWeight:700, color:"white", fontSize:"0.82rem", flexShrink:0 }}>
                {avatarInitials}
              </div>
              <div className="mgmt-course-info">
                <div className="mgmt-course-name">{a.marketerName}</div>
                <div className="mgmt-course-meta">
                  <span>📧 {a.marketerEmail}</span>
                  <span>📚 {a.courseName}</span>
                  <span style={{ color:"var(--cyan)", fontWeight:600 }}>{t("inst.commission", { rate: a.commissionRate })}</span>
                </div>
                <div style={{ marginTop:"0.6rem", background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:8, padding:"0.6rem 0.75rem", display:"flex", gap:"0.75rem", alignItems:"center" }}>
                  <div style={{ flex:1, fontSize:"0.73rem", color:"var(--text3)", wordBreak:"break-all", fontFamily:"monospace" }}>{link}</div>
                  <button onClick={() => copyLink(link, a.id)}
                    style={{ flexShrink:0, padding:"0.35rem 0.75rem", borderRadius:7, border:"1px solid var(--border2)", background:"var(--bg)", cursor:"pointer", fontSize:"0.75rem", color:"var(--text2)", whiteSpace:"nowrap" }}>
                    {copiedLink===a.id ? t("inst.copiedBtn") : t("inst.copyBtn")}
                  </button>
                </div>
                <div className="mgmt-course-stats">
                  <div className="mgmt-stat"><div className="mgmt-stat-val">{courseReferrals.length}</div><div className="mgmt-stat-lbl">{t("inst.referrals")}</div></div>
                  <div className="mgmt-stat"><div className="mgmt-stat-val">{accepted.length}</div><div className="mgmt-stat-lbl">{t("inst.accepted")}</div></div>
                  <div className="mgmt-stat"><div className="mgmt-stat-val" style={{ color:"var(--cyan)" }}>{commissionTotal>0 ? `SDG ${commissionTotal.toLocaleString()}` : "—"}</div><div className="mgmt-stat-lbl">{t("inst.commissionDue")}</div></div>
                </div>
              </div>
              <div className="mgmt-actions">
                <button className="mgmt-btn" style={{ background:"rgba(239,68,68,0.08)", borderColor:"rgba(239,68,68,0.2)", color:"#f87171" }}
                  onClick={() => onRemove(a.id)}>
                  {t("inst.removeBtn")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
