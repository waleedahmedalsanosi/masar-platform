/**
 * @file EnrollmentModal.jsx
 * @description نافذة التسجيل والدفع في الكورس
 *
 * نافذة منبثقة متعددة الخطوات لإتمام التسجيل في كورس:
 * 1. إدخال بيانات المتدرب (الحقول المحددة من قِبل المدرب عند إنشاء الكورس)
 * 2. اختيار طريقة الدفع (Mobile Money، تحويل بنكي)
 * 3. إدخال تفاصيل الدفع حسب الطريقة المختارة
 * 4. شاشة التأكيد النهائي
 *
 * @note بيانات المالية هي بيانات تجريبية فقط
 */

import { useState } from "react";
import { ENROLLMENT_FIELDS } from "../data/constants";
import { api } from "../services/api";

const MOMO_PROVIDERS = [
  { id: "mtn",    icon: "🟡", name: "MTN",    num: "0910-123-456" },
  { id: "zain",   icon: "🔴", name: "Zain",   num: "0912-987-654" },
  { id: "sudani", icon: "🟢", name: "Sudani", num: "0911-555-777" },
];

/**
 * يبني حالة الفورم الأولية بناءً على حقول التسجيل المحددة للكورس
 */
function buildInitialForm(fields) {
  const f = {};
  fields.forEach(fc => { f[fc.id] = ""; });
  return f;
}

function EnrollmentModal({ course, onClose }) {
  // الحقول المحددة من المدرب (مع fallback للكورسات القديمة)
  const courseFields = course.enrollmentFields || [
    { id: "fullName", required: true  },
    { id: "phone",    required: true  },
    { id: "email",    required: false },
  ];

  // step: "reserve" | "payment-choice" | "bank" | "momo" | "upload" | "done"
  const [step, setStep]               = useState("reserve");
  const [payLater, setPayLater]       = useState(false);
  const [payMethod, setPayMethod]     = useState(null);
  const [momoProvider, setMomoProvider] = useState("mtn");
  const [file, setFile]               = useState(null);
  const [copied, setCopied]           = useState("");
  const [form, setForm]               = useState(() => buildInitialForm(courseFields));
  const [errors, setErrors]           = useState({});
  const refNum = useState("MSR-" + course.id + "-" + Math.floor(10000 + Math.random() * 90000))[0];

  const isOnline   = course.mode === "online"    || course.mode === "hybrid";
  const isInPerson = course.mode === "in-person" || course.mode === "hybrid";

  // ── Dynamic validation ────────────────────────────────────
  const validate = () => {
    const e = {};
    courseFields.forEach(fc => {
      const def = ENROLLMENT_FIELDS.find(f => f.id === fc.id);
      const val = (form[fc.id] || "").trim();
      if (fc.required && !val) {
        e[fc.id] = `${def?.label || fc.id} is required`;
      }
      // Specific format validation
      if (fc.id === "phone" && val && !/^09\d{8}$/.test(val.replace(/-/g, ""))) {
        e.phone = "Enter a valid Sudanese number (09xxxxxxxx)";
      }
      if (fc.id === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        e.email = "Enter a valid email address";
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const setField = (id, val) => {
    setForm(prev => ({ ...prev, [id]: val }));
    setErrors(prev => ({ ...prev, [id]: "" }));
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(""), 1800);
  };

  const getLinkType = url => {
    if (!url) return "zoom";
    if (url.includes("whatsapp")) return "whatsapp";
    if (url.includes("t.me") || url.includes("telegram")) return "telegram";
    return "zoom";
  };

  // Step progress map
  const STEPS = payLater
    ? ["reserve", "done"]
    : ["reserve", "payment-choice", payMethod === "bank" ? "bank" : "momo", "upload", "done"];
  const stepIdx   = STEPS.indexOf(step);
  const totalSteps = STEPS.length;

  const ProgressBar = () => (
    <div style={{marginBottom:"1.5rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.72rem",color:"var(--text3)",marginBottom:"0.4rem"}}>
        <span>Step {Math.max(stepIdx+1,1)} of {totalSteps}</span>
        <span style={{color:"var(--indigo-light)",fontWeight:600}}>
          {step==="reserve"        && "Your Details"}
          {step==="payment-choice" && "Payment Method"}
          {step==="bank"           && "Bank Transfer"}
          {step==="momo"           && "Mobile Money"}
          {step==="upload"         && "Upload Receipt"}
          {step==="done"           && (payLater ? "Reservation Confirmed" : "Enrollment Confirmed")}
        </span>
      </div>
      <div style={{height:4,background:"var(--border2)",borderRadius:100,overflow:"hidden"}}>
        <div style={{height:"100%",background:"var(--gradient)",borderRadius:100,width:`${((stepIdx+1)/totalSteps)*100}%`,transition:"width 0.4s ease"}} />
      </div>
    </div>
  );

  // ── Render a single enrollment field ─────────────────────
  const renderField = (fc) => {
    const def = ENROLLMENT_FIELDS.find(f => f.id === fc.id);
    if (!def) return null;
    const value = form[fc.id] || "";
    const err   = errors[fc.id];

    return (
      <div key={fc.id} className="form-group">
        <label className="form-label">
          {def.icon} {def.label}
          {fc.required
            ? " *"
            : <span style={{color:"var(--text3)",fontWeight:400}}> (optional)</span>
          }
        </label>

        {(def.type === "text" || def.type === "tel" || def.type === "email" || def.type === "url") && (
          <input
            className={`form-input ${err ? "input-error" : ""}`}
            type={def.type}
            placeholder={def.placeholder || ""}
            value={value}
            onChange={e => setField(fc.id, e.target.value)}
          />
        )}

        {def.type === "date" && (
          <input
            className={`form-input ${err ? "input-error" : ""}`}
            type="date"
            value={value}
            onChange={e => setField(fc.id, e.target.value)}
          />
        )}

        {def.type === "select" && (
          <select
            className={`acm-select ${err ? "input-error" : ""}`}
            value={value}
            onChange={e => setField(fc.id, e.target.value)}
            style={{width:"100%"}}
          >
            <option value="">— Select —</option>
            {def.options.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        )}

        {def.type === "textarea" && (
          <textarea
            className={`form-input ${err ? "input-error" : ""}`}
            rows={2}
            placeholder={def.placeholder || ""}
            value={value}
            onChange={e => setField(fc.id, e.target.value)}
            style={{resize:"none",lineHeight:1.6}}
          />
        )}

        {err && <div style={{fontSize:"0.75rem",color:"#f87171",marginTop:"0.3rem"}}>⚠ {err}</div>}
      </div>
    );
  };

  return (
    <div className="enroll-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="enroll-modal">
        {/* Header */}
        <div className="em-header">
          <div>
            <div className="em-title" style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <span>{course.image}</span> {course.title}
            </div>
            <div className="em-subtitle">
              {course.instructor} · <span style={{color:"var(--cyan)",fontWeight:700}}>${course.price}</span>
              {" · "}<span style={{textTransform:"capitalize",color:"var(--indigo-light)"}}>{course.mode}</span>
            </div>
          </div>
          <button className="em-close" onClick={onClose}>✕</button>
        </div>

        <div className="em-body">
          <ProgressBar />

          {/* ── STEP: RESERVE ── */}
          {step === "reserve" && (
            <div>
              <div style={{fontSize:"0.85rem",color:"var(--text2)",marginBottom:"1.25rem",lineHeight:1.6}}>
                Fill in your details to <strong style={{color:"var(--text)"}}>reserve your seat</strong>. You can pay now or later — your spot is held for <strong style={{color:"var(--cyan)"}}>48 hours</strong>.
              </div>

              {/* Dynamic enrollment fields */}
              {courseFields.map(fc => renderField(fc))}

              {/* Course summary card */}
              <div style={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:10,padding:"0.875rem",marginBottom:"1.25rem",display:"flex",gap:"0.75rem",alignItems:"center"}}>
                <span style={{fontSize:"1.75rem"}}>{course.image}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:"0.82rem",fontWeight:600,marginBottom:"0.15rem"}}>{course.title}</div>
                  <div style={{fontSize:"0.75rem",color:"var(--text3)"}}>
                    📅 Starts {course.details?.startDate || "Soon"} &nbsp;·&nbsp; ⏱ {course.duration} &nbsp;·&nbsp; 📶 {course.level}
                  </div>
                </div>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,color:"var(--cyan)",fontSize:"1rem",flexShrink:0}}>${course.price}</div>
              </div>

              {/* Pay now vs pay later toggle */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",marginBottom:"1.25rem"}}>
                <div onClick={() => setPayLater(false)} style={{padding:"0.875rem",borderRadius:10,border:`1.5px solid ${!payLater?"var(--indigo)":"var(--border2)"}`,background:!payLater?"rgba(99,102,241,0.08)":"var(--bg)",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                  <div style={{fontSize:"1.25rem",marginBottom:"0.25rem"}}>💳</div>
                  <div style={{fontWeight:600,fontSize:"0.85rem"}}>Pay Now</div>
                  <div style={{fontSize:"0.72rem",color:"var(--text3)"}}>Confirm instantly</div>
                </div>
                <div onClick={() => setPayLater(true)} style={{padding:"0.875rem",borderRadius:10,border:`1.5px solid ${payLater?"var(--cyan)":"var(--border2)"}`,background:payLater?"rgba(6,182,212,0.08)":"var(--bg)",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                  <div style={{fontSize:"1.25rem",marginBottom:"0.25rem"}}>🔖</div>
                  <div style={{fontWeight:600,fontSize:"0.85rem"}}>Reserve Now</div>
                  <div style={{fontSize:"0.72rem",color:"var(--text3)"}}>Pay within 48h</div>
                </div>
              </div>

              <button className="btn btn-primary" style={{width:"100%",padding:"0.9rem",borderRadius:10,fontSize:"0.95rem",marginBottom:"0.5rem"}}
                onClick={() => { if (validate()) setStep(payLater ? "done" : "payment-choice"); }}>
                {payLater ? "Reserve My Seat →" : "Continue to Payment →"}
              </button>
              <div style={{textAlign:"center",fontSize:"0.75rem",color:"var(--text3)"}}>🔒 Your info is safe and never shared</div>
            </div>
          )}

          {/* ── STEP: PAYMENT CHOICE ── */}
          {step === "payment-choice" && (
            <div>
              <div style={{fontSize:"0.85rem",color:"var(--text2)",marginBottom:"1rem"}}>
                Choose your payment method for <strong style={{color:"var(--cyan)"}}>SDG {(course.price * 350).toLocaleString()}</strong> <span style={{color:"var(--text3)"}}>(≈ ${course.price})</span>
              </div>

              <div className="payment-methods">
                {[
                  { id:"bank", icon:"🏦", name:"Bank Transfer",  desc:"Direct bank transfer — most common" },
                  { id:"momo", icon:"📱", name:"Mobile Money",   desc:"MTN, Zain, or Sudani wallet" },
                ].map(m => (
                  <div key={m.id} className={`payment-method ${payMethod===m.id?"selected":""}`} onClick={() => setPayMethod(m.id)}>
                    <span className="pm-icon">{m.icon}</span>
                    <div><div className="pm-name">{m.name}</div><div className="pm-desc">{m.desc}</div></div>
                    <div className={`pm-radio ${payMethod===m.id?"selected":""}`} />
                  </div>
                ))}
              </div>

              <div style={{display:"flex",gap:"0.75rem",marginTop:"1.25rem"}}>
                <button className="btn btn-ghost" style={{flex:1,padding:"0.875rem",borderRadius:10}} onClick={() => setStep("reserve")}>← Back</button>
                <button className="btn btn-primary" style={{flex:2,padding:"0.875rem",borderRadius:10}} disabled={!payMethod}
                  onClick={() => setStep(payMethod)}>
                  View Payment Details →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: BANK ── */}
          {step === "bank" && (
            <div>
              <div style={{fontSize:"0.85rem",color:"var(--text2)",marginBottom:"0.75rem"}}>Transfer the exact amount below, then upload your receipt.</div>
              <div className="bank-box">
                <div className="bank-box-title">🏦 Transfer to:</div>
                {[
                  {label:"Bank",          value:"Bank of Khartoum"},
                  {label:"Account Name",  value:"Masar Training Platform"},
                  {label:"Account No.",   value:"1234-5678-9012-3456"},
                  {label:"Amount (SDG)",  value:`SDG ${(course.price*350).toLocaleString()}`},
                  {label:"Reference",     value:form.phone || refNum},
                ].map(b => (
                  <div key={b.label} className="bank-row">
                    <span className="bank-label">{b.label}</span>
                    <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
                      <span className="bank-value" style={b.label==="Amount (SDG)"?{color:"var(--cyan)"}:{}}>{b.value}</span>
                      <button className="copy-btn" onClick={() => copyText(b.value, b.label)}>
                        {copied===b.label ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:10,padding:"0.75rem",fontSize:"0.78rem",color:"var(--text2)",marginBottom:"1rem"}}>
                💡 Use your phone number <strong>({form.phone || "09xxxxxxxx"})</strong> as the transfer reference so we can match your payment quickly.
              </div>
              <div style={{display:"flex",gap:"0.75rem"}}>
                <button className="btn btn-ghost" style={{flex:1,padding:"0.875rem",borderRadius:10}} onClick={() => setStep("payment-choice")}>← Back</button>
                <button className="btn btn-primary" style={{flex:2,padding:"0.875rem",borderRadius:10}} onClick={() => setStep("upload")}>I've Transferred →</button>
              </div>
            </div>
          )}

          {/* ── STEP: MOMO ── */}
          {step === "momo" && (
            <div>
              <div style={{fontSize:"0.85rem",color:"var(--text2)",marginBottom:"0.75rem"}}>Select your operator and send the amount:</div>
              <div className="momo-grid">
                {MOMO_PROVIDERS.map(p => (
                  <div key={p.id} className={`momo-btn ${momoProvider===p.id?"selected":""}`} onClick={() => setMomoProvider(p.id)}>
                    <span className="momo-icon">{p.icon}</span>
                    <div className="momo-name">{p.name}</div>
                    <div className="momo-num">{p.num}</div>
                  </div>
                ))}
              </div>
              <div className="bank-box" style={{marginTop:"0.75rem"}}>
                <div className="bank-box-title">📱 Send to:</div>
                {[
                  {label:"Number",       value: MOMO_PROVIDERS.find(p=>p.id===momoProvider)?.num},
                  {label:"Amount",       value:`SDG ${(course.price*350).toLocaleString()}`},
                  {label:"Note/Message", value:`${form.fullName || "Your name"} – ${course.title}`},
                ].map(b => (
                  <div key={b.label} className="bank-row">
                    <span className="bank-label">{b.label}</span>
                    <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
                      <span className="bank-value" style={b.label==="Amount"?{color:"var(--cyan)"}:{}}>{b.value}</span>
                      <button className="copy-btn" onClick={() => copyText(b.value, b.label)}>
                        {copied===b.label ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:"0.75rem",marginTop:"1rem"}}>
                <button className="btn btn-ghost" style={{flex:1,padding:"0.875rem",borderRadius:10}} onClick={() => setStep("payment-choice")}>← Back</button>
                <button className="btn btn-primary" style={{flex:2,padding:"0.875rem",borderRadius:10}} onClick={() => setStep("upload")}>I've Sent It →</button>
              </div>
            </div>
          )}

          {/* ── STEP: UPLOAD ── */}
          {step === "upload" && (
            <div>
              <div style={{fontSize:"0.85rem",color:"var(--text2)",marginBottom:"0.75rem",lineHeight:1.6}}>
                Upload a <strong>screenshot or photo</strong> of your payment confirmation. Our team reviews receipts within <strong style={{color:"var(--cyan)"}}>2–4 hours</strong>.
              </div>
              <label className={`file-upload-area ${file?"has-file":""}`}>
                <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])} />
                <div className="upload-icon">{file ? "✅" : "📎"}</div>
                <div className="upload-text">{file ? "Receipt ready!" : "Tap to upload receipt"}</div>
                {!file && <div className="upload-hint">PNG, JPG, PDF · Max 5MB</div>}
                {file && <div className="file-chosen">📄 {file.name}</div>}
              </label>

              <div style={{marginBottom:"1rem"}}>
                <label className="form-label">Note to instructor <span style={{color:"var(--text3)",fontWeight:400}}>(optional)</span></label>
                <textarea className="form-input" rows={2} placeholder="Any questions or special requests before you start..." style={{resize:"none",lineHeight:1.6}} value={form.note || ""} onChange={e => setField("note", e.target.value)} />
              </div>

              <div style={{display:"flex",gap:"0.75rem"}}>
                <button className="btn btn-ghost" style={{flex:1,padding:"0.875rem",borderRadius:10}} onClick={() => setStep(payMethod)}>← Back</button>
                <button className="btn btn-primary" style={{flex:2,padding:"0.875rem",borderRadius:10}} disabled={!file}
                  onClick={async () => {
                    // حفظ طلب التسجيل في قاعدة البيانات
                    try {
                      const initials   = (form.fullName || "??").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
                      const marketerId = sessionStorage.getItem("masar_ref") || null;
                      await api.createRequest({
                        courseId:     String(course.id),
                        instructorId: String(course.instructorId || 1),
                        name:    form.fullName || "—",
                        avatar:  initials,
                        course:  course.title,
                        phone:   form.phone   || "—",
                        email:   form.email   || "—",
                        payment: payMethod,
                        amount:  course.price,
                        time:    "just now",
                        status:  "pending",
                        fields:  form,
                        ...(marketerId ? { marketerId } : {}),
                      });
                      if (marketerId) sessionStorage.removeItem("masar_ref");
                    } catch { /* json-server غير مشغّل، نكمل بدون حفظ */ }
                    setStep("done");
                  }}>
                  Submit & Confirm →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: DONE ── */}
          {step === "done" && (
            <div className="status-card">
              <div className="status-icon">{payLater ? "🔖" : "🎉"}</div>
              <div className="status-title">{payLater ? "Seat Reserved!" : "You're In!"}</div>
              <div className={`status-badge ${payLater ? "pending" : "approved"}`}>
                {payLater ? "⏳ Payment Pending" : "✓ Enrollment Submitted"}
              </div>
              <div className="status-desc">
                {payLater
                  ? `Your seat in "${course.title}" is reserved for 48 hours. Complete your payment and upload the receipt to confirm your enrollment.`
                  : `We received your payment receipt. You'll get a WhatsApp/email confirmation within 2–4 hours. Welcome aboard!`
                }
              </div>
              <div className="status-ref">Reference No: <span>{refNum}</span></div>

              {/* Pay Later → show payment reminder */}
              {payLater && (
                <div style={{background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:12,padding:"1rem",marginBottom:"1rem",textAlign:"left"}}>
                  <div style={{fontWeight:600,fontSize:"0.85rem",marginBottom:"0.5rem"}}>⏰ Your 48-hour payment window:</div>
                  <div style={{fontSize:"0.82rem",color:"var(--text2)",lineHeight:1.7}}>
                    1. Transfer <strong style={{color:"var(--cyan)"}}>SDG {(course.price*350).toLocaleString()}</strong> to Masar (Bank of Khartoum or Mobile Money)<br/>
                    2. Come back to this page and tap <strong>"Complete Payment"</strong><br/>
                    3. Upload your receipt to confirm your spot
                  </div>
                  <button className="btn btn-primary" style={{width:"100%",padding:"0.75rem",borderRadius:10,marginTop:"0.875rem",fontSize:"0.875rem"}}
                    onClick={() => { setPayLater(false); setStep("payment-choice"); }}>
                    Complete Payment Now →
                  </button>
                </div>
              )}

              {/* Approved: online links */}
              {!payLater && isOnline && (
                <div className="course-links-section">
                  <div style={{fontSize:"0.75rem",fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.5rem",textAlign:"left"}}>
                    Links sent after confirmation:
                  </div>
                  {course.meetLink && (
                    <div className={`course-link-btn ${getLinkType(course.meetLink)}`} style={{opacity:0.6,cursor:"default"}}>
                      <span className="cl-icon">{course.meetLink.includes("zoom")?"💻":"📹"}</span>
                      <div className="cl-text">
                        <div className="cl-title">{course.meetLink.includes("zoom")?"Zoom Meeting Link":"Google Meet Link"}</div>
                        <div className="cl-sub">Will be sent after payment is verified</div>
                      </div>
                      <span style={{fontSize:"0.72rem",color:"var(--text3)"}}>Pending</span>
                    </div>
                  )}
                  {course.groupLink && (
                    <div className={`course-link-btn ${getLinkType(course.groupLink)}`} style={{opacity:0.6,cursor:"default"}}>
                      <span className="cl-icon">{course.groupLink.includes("whatsapp")?"💬":"✈️"}</span>
                      <div className="cl-text">
                        <div className="cl-title">{course.groupLink.includes("whatsapp")?"WhatsApp Group":"Telegram Group"}</div>
                        <div className="cl-sub">Will be sent after payment is verified</div>
                      </div>
                      <span style={{fontSize:"0.72rem",color:"var(--text3)"}}>Pending</span>
                    </div>
                  )}
                </div>
              )}

              {/* In-person location always visible */}
              {isInPerson && course.location && (
                <div className="location-section">
                  <div style={{fontSize:"0.75rem",fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.75rem",textAlign:"left"}}>Course Location</div>
                  <div className="map-container">
                    <div className="map-placeholder">
                      <span className="map-pin">📍</span>
                      <div style={{fontSize:"0.8rem",color:"var(--text2)",padding:"0 1rem"}}>{course.location.address}</div>
                    </div>
                  </div>
                  <a href={course.location?.mapUrl||"https://maps.google.com"} target="_blank" rel="noreferrer" className="map-open-btn" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:"0.75rem"}}><span>🗺️</span> Open in Google Maps</a>
                </div>
              )}

              <button className="btn btn-ghost" style={{width:"100%",padding:"0.875rem",borderRadius:10,marginTop:"1rem"}} onClick={onClose}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnrollmentModal;
