import { useState } from "react";
import { useSettings } from "../../../contexts/SettingsContext";

export default function QAManager({ qaItems, onReply }) {
  const { t } = useSettings();
  const [replyInputs, setReplyInputs] = useState({});

  const unansweredCount = qaItems.filter(q => !q.answer).length;

  const handleReply = (id) => {
    const text = replyInputs[id];
    if (!text?.trim()) return;
    onReply(id, text);
    setReplyInputs(prev => ({ ...prev, [id]: "" }));
  };

  return (
    <div>
      <div className="inst-page-header">
        <div>
          <div className="inst-page-title">{t("inst.qaTitle")}</div>
          <div className="inst-page-sub">{t("inst.qaSubtitle", { unanswered: unansweredCount, answered: qaItems.filter(q=>q.answer).length })}</div>
        </div>
      </div>

      <div className="iqa-list">
        {qaItems.map(q => (
          <div key={q.id} className={`iqa-card ${q.answer ? "answered" : ""}`}>
            <div className="iqa-header">
              <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--gradient)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.7rem", color:"white", flexShrink:0 }}>
                {q.anon ? "?" : q.sender[0]+(q.sender.split(" ")[1]?.[0]||"")}
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:"0.85rem" }}>{q.anon ? t("inst.anonymous") : q.sender}</div>
                <div className="iqa-from">re: <span className="iqa-course-tag">{q.course}</span></div>
              </div>
              <div className="iqa-time">{q.time}</div>
            </div>
            <div className="iqa-question">"{q.question}"</div>
            {q.answer ? (
              <div className="iqa-reply-area">
                <div className="iqa-reply-label">{t("inst.replyLabel")}</div>
                <div className="iqa-answer-text">{q.answer}</div>
              </div>
            ) : (
              <div className="iqa-reply-area">
                <div className="iqa-reply-label">{t("inst.qaTitle")}:</div>
                <textarea className="iqa-reply-input" rows={2} placeholder={t("inst.replyPlaceholder")}
                  value={replyInputs[q.id]||""} onChange={e => setReplyInputs(prev=>({...prev,[q.id]:e.target.value}))} />
                <div className="iqa-reply-footer">
                  <button className="btn btn-primary" style={{ padding:"0.45rem 1.1rem", borderRadius:8, fontSize:"0.82rem" }}
                    disabled={!replyInputs[q.id]?.trim()} onClick={() => handleReply(q.id)}>
                    {t("inst.replyBtn")}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
