import { useState } from "react";
import { useSettings } from "../../../contexts/SettingsContext";

export default function EnrollmentsList({ requests, onAction }) {
  const { t } = useSettings();
  const [reqFilter, setReqFilter] = useState("all");

  const pendingCount   = requests.filter(r => r.status === "pending").length;
  const reservedCount  = requests.filter(r => r.status === "reserved").length;
  const filtered = requests.filter(r => reqFilter === "all" || r.status === reqFilter);

  return (
    <div>
      <div className="inst-page-header">
        <div>
          <div className="inst-page-title">{t("inst.requestsTitle")}</div>
          <div className="inst-page-sub">
            {t("inst.requestsSubtitle", { pending: pendingCount, accepted: requests.filter(r=>r.status==="accepted").length, rejected: requests.filter(r=>r.status==="rejected").length })}
            {reservedCount > 0 && <span style={{ marginInlineStart:"0.5rem", color:"#f59e0b", fontWeight:600 }}>· {reservedCount} {t("analytics.filterReserved")}</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all","pending","reserved","accepted","rejected"].map(f => (
            <button key={f} className={`filter-btn ${reqFilter===f?"active":""}`} style={{ fontSize: "0.78rem", padding: "0.35rem 0.875rem" }} onClick={() => setReqFilter(f)}>
              {f === "reserved" ? t("analytics.filterReserved") : t(`inst.filter${f.charAt(0).toUpperCase()+f.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="requests-list">
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text3)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📥</div>
            <div>{t("inst.noFilterRequests", { filter: reqFilter==="all" ? "" : reqFilter })}</div>
          </div>
        )}
        {filtered.map(r => (
          <div key={r.id} className="req-card">
            <div className="req-avatar">{r.avatar || r.name?.slice(0,2).toUpperCase()}</div>
            <div className="req-info">
              <div className="req-name">{r.name}</div>
              <div className="req-course-name">{r.course}</div>
              <div className="req-details">
                📞 {r.phone} &nbsp;·&nbsp; 📧 {r.email} &nbsp;·&nbsp;
                <span className="req-payment-badge">
                  {r.status === "reserved"
                    ? `🔖 ${t("analytics.filterReserved")} · SDG ${((r.amount||0)*350).toLocaleString()}`
                    : `${r.payment==="bank" ? t("inst.bankTransfer") : t("inst.mobileMoney")} · SDG ${((r.amount||0)*350).toLocaleString()}`
                  }
                </span>
              </div>
              {r.fields && Object.keys(r.fields).filter(k => !["fullName","phone","email"].includes(k) && r.fields[k]).length > 0 && (
                <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {Object.entries(r.fields).filter(([k,v]) => !["fullName","phone","email"].includes(k) && v).map(([k,v]) => (
                    <span key={k} style={{ fontSize: "0.72rem", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 5, padding: "0.15rem 0.5rem", color: "var(--text2)" }}>
                      {k}: {v}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="req-time">{r.time}</div>
              {r.status === "pending"
                ? <div className="req-actions" style={{ marginTop: "0.5rem" }}>
                    <button className="req-btn-accept" onClick={() => onAction(r.id, "accepted")}>{t("inst.acceptBtn")}</button>
                    <button className="req-btn-reject" onClick={() => onAction(r.id, "rejected")}>{t("inst.rejectBtn")}</button>
                  </div>
                : r.status === "reserved"
                ? <span style={{ display:"inline-block", marginTop:"0.5rem", background:"rgba(245,158,11,0.1)", color:"#f59e0b", border:"1px solid rgba(245,158,11,0.3)", borderRadius:6, padding:"0.2rem 0.6rem", fontSize:"0.75rem", fontWeight:600 }}>
                    🔖 {t("analytics.filterReserved")}
                  </span>
                : <span className={`req-status ${r.status}`} style={{ display: "inline-block", marginTop: "0.5rem" }}>
                    {r.status === "accepted" ? t("inst.acceptedStatus") : t("inst.rejectedStatus")}
                  </span>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
