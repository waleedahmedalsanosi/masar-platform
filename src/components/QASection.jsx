/**
 * @file QASection.jsx
 * @description مكوّن قسم الأسئلة والأجوبة للكورس
 *
 * يعرض:
 * - قائمة الأسئلة والأجوبة المتعلقة بالكورس مع بيانات السائل والإجابات
 * - نموذج لطرح سؤال جديد
 * - دعم الإعجاب بالأسئلة والأجوبة
 *
 * يحتوي على بيانات SAMPLE_QA التجريبية داخلياً.
 */

import { useState } from "react";

const SAMPLE_QA = [
  { id:1, sender:"Rania Hassan", anon:false, to:"instructor", question:"Is prior programming knowledge required before joining?", answer:"No prior experience needed at all — we start from absolute zero. Just bring your laptop and curiosity!", answeredBy:"Ahmed Hassan", time:"2 days ago" },
  { id:2, sender:"Anonymous", anon:true, to:"instructor", question:"Will sessions be recorded in case I miss one?", answer:"Yes, all sessions are recorded and uploaded within 24 hours to the course group.", answeredBy:"Ahmed Hassan", time:"1 week ago" },
  { id:3, sender:"Kamal Ibrahim", anon:false, to:"center", question:"Do you offer any discounts for university students?", answer:"Yes! Students get 15% off — just send your university ID to our WhatsApp.", answeredBy:"Code Academy Sudan", time:"3 days ago" },
];

function QASection({ course, instructor, center }) {
  const [recipient, setRecipient] = useState("instructor");
  const [question, setQuestion] = useState("");
  const [anon, setAnon] = useState(false);
  const [sent, setSent] = useState(false);
  const maxLen = 500;

  const recipientName = recipient === "instructor"
    ? (instructor?.name || "the instructor")
    : (center?.name || "the center");

  const placeholders = {
    instructor: `Ask ${instructor?.name || "the instructor"} anything about the course content, pace, or requirements...`,
    center: `Ask ${center?.name || "the center"} about payment, schedules, facilities, or policies...`,
  };

  const handleSend = () => {
    if (!question.trim()) return;
    setSent(true);
  };

  return (
    <div className="qa-card">
      <div className="qa-header">
        <div className="qa-header-left">
          💬 Ask a Question
          <span className="qa-header-sub">· Typically answered within 24h</span>
        </div>
      </div>
      <div className="qa-body">
        {!sent ? (
          <>
            {/* Who to ask */}
            <div style={{fontSize:"0.78rem",color:"var(--text2)",marginBottom:"0.5rem"}}>Send your question to:</div>
            <div className="qa-recipient-tabs">
              <button className={`qa-tab ${recipient==="instructor"?"active":""}`} onClick={() => setRecipient("instructor")}>
                👨‍🏫 {instructor?.name || "Instructor"}
              </button>
              {center && (
                <button className={`qa-tab ${recipient==="center"?"active":""}`} onClick={() => setRecipient("center")}>
                  🏢 {center.name}
                </button>
              )}
            </div>

            {/* Textarea */}
            <textarea
              className="qa-textarea"
              rows={3}
              placeholder={placeholders[recipient]}
              value={question}
              maxLength={maxLen}
              onChange={e => setQuestion(e.target.value)}
            />
            <div className="qa-char-count">{question.length}/{maxLen}</div>

            {/* Footer row */}
            <div className="qa-submit-row">
              <div className="qa-anon-toggle" onClick={() => setAnon(!anon)}>
                <div className={`qa-toggle-box ${anon?"checked":""}`}>{anon && <span style={{color:"white",fontSize:"0.6rem",fontWeight:700}}>✓</span>}</div>
                Ask anonymously
              </div>
              <button className="btn btn-primary"
                style={{padding:"0.6rem 1.25rem",borderRadius:8,fontSize:"0.875rem"}}
                disabled={!question.trim()}
                onClick={handleSend}>
                Send Question →
              </button>
            </div>
          </>
        ) : (
          <div className="qa-sent">
            <div className="qa-sent-icon">✉️</div>
            <div className="qa-sent-title">Question Sent!</div>
            <div className="qa-sent-sub">
              Your question was sent to <strong>{recipientName}</strong>.<br/>
              {anon ? "It will appear as Anonymous." : ""} Expect a reply within 24 hours.
            </div>
            <button className="btn btn-ghost" style={{marginTop:"1rem",padding:"0.5rem 1.25rem",borderRadius:8,fontSize:"0.85rem"}} onClick={() => { setSent(false); setQuestion(""); }}>
              Ask Another Question
            </button>
          </div>
        )}

        {/* Existing Q&A */}
        <div className="qa-existing">
          <div className="qa-existing-title">Previous Questions ({SAMPLE_QA.length})</div>
          {SAMPLE_QA.map(q => (
            <div key={q.id} className="qa-item">
              <div className="qa-item-header">
                <div style={{width:22,height:22,borderRadius:"50%",background:"var(--gradient)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",fontWeight:700,color:"white",flexShrink:0}}>
                  {q.anon ? "?" : q.sender[0]}
                </div>
                <span className="qa-item-sender">{q.anon ? "Anonymous" : q.sender}</span>
                <span className="qa-item-to">→ {q.to === "instructor" ? instructor?.name : center?.name}</span>
                <span className="qa-item-time">{q.time}</span>
              </div>
              <div className="qa-item-q">{q.question}</div>
              {q.answer && (
                <div className="qa-item-answer">
                  <div className="qa-item-answer-by">💬 {q.answeredBy} replied:</div>
                  <div className="qa-item-answer-text">{q.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QASection;
