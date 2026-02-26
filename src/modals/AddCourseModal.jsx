/**
 * @file AddCourseModal.jsx
 * @description نافذة إضافة كورس جديد للمدرب
 *
 * نافذة منبثقة متعددة الخطوات لإنشاء كورس جديد:
 * الخطوة 1 - المعلومات الأساسية: العنوان، التصنيف، المستوى، السعر، الوصف
 * الخطوة 2 - الجدول والمنهج: أيام المحاضرات، الأسابيع والمواضيع
 * الخطوة 3 - نموذج التسجيل: تحديد المعلومات المطلوبة من المتدرب
 * الخطوة 4 - محتوى الكورس: المنهج الأسبوعي
 * الخطوة 5 - المراجعة والنشر: مراجعة نهائية قبل الإرسال للاعتماد
 */

import { useState } from "react";
import { ENROLLMENT_FIELDS } from "../data/constants";
import { useSettings } from "../contexts/SettingsContext";

/**
 * نافذة إضافة كورس جديد
 * @param {Object} props
 * @param {Function} props.onClose - دالة إغلاق نافذة
 * @param {Function} props.onSave - callback يُستدعى عند حفظ الكورس مع بياناته
 */
function AddCourseModal({ onClose, onSave }) {
  const { t } = useSettings();
  const STEPS = [
    { key:1, label:t("acm.step1"), icon:"📋" },
    { key:2, label:t("acm.step2"), icon:"🗓" },
    { key:3, label:t("acm.step3"), icon:"📝" },
    { key:4, label:t("acm.step4"), icon:"📚" },
    { key:5, label:t("acm.step5"), icon:"🚀" },
  ];

  const emojis = ["📚","🐍","🌐","🤖","🎨","🗄️","📊","⚡","📱","☁️","🔧","🧠"];
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Step 1 — Basics
    image:"📚", title:"", category:"Data Science", level:"Beginner",
    price:"", mode:"online", description:"",
    // Step 2 — Schedule
    startDate:"", enrollDeadline:"", duration:"",
    scheduleDays:[{ day:"Saturday", time:"10:00", endTime:"12:00", type:"Live Lecture" }],
    meetLink:"", groupLink:"", location:"",
    // Step 3 — Enrollment Fields
    enrollmentFields:[
      { id:"fullName", required:true },
      { id:"phone",    required:true },
    ],
    // Step 4 — Content (weeks)
    weeks:[
      { title:"Introduction", topics:"" },
      { title:"", topics:"" },
    ],
    // Step 5 tags
    tags:"",
  });

  const set = (field, val) => { setForm(f=>({...f,[field]:val})); setErrors(e=>({...e,[field]:""})); };

  // ── Enrollment field helpers ──────────────────────────────
  const toggleEnrollField = (id) => {
    setForm(f => {
      const exists = f.enrollmentFields.find(ef => ef.id === id);
      if (exists) return { ...f, enrollmentFields: f.enrollmentFields.filter(ef => ef.id !== id) };
      return { ...f, enrollmentFields: [...f.enrollmentFields, { id, required: false }] };
    });
  };

  const setEnrollFieldRequired = (id, required) => {
    setForm(f => ({
      ...f,
      enrollmentFields: f.enrollmentFields.map(ef => ef.id === id ? { ...ef, required } : ef),
    }));
  };

  // ─────────────────────────────────────────────────────────

  const validate = () => {
    const e = {};
    if (step===1) {
      if (!form.title.trim()) e.title = "Required";
      if (!form.price || isNaN(form.price) || +form.price<=0) e.price = "Enter a valid price";
      if (!form.description.trim()) e.description = "Required";
    }
    if (step===2) {
      if (!form.startDate) e.startDate = "Required";
      if (!form.duration.trim()) e.duration = "Required";
    }
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const next = () => { if(validate()) setStep(s=>Math.min(s+1,5)); };
  const back = () => setStep(s=>Math.max(s-1,1));

  const addWeek    = () => setForm(f=>({...f, weeks:[...f.weeks,{title:"",topics:""}]}));
  const setWeek    = (i,field,val) => setForm(f=>{ const w=[...f.weeks]; w[i]={...w[i],[field]:val}; return {...f,weeks:w}; });
  const removeWeek = (i) => setForm(f=>({...f,weeks:f.weeks.filter((_,idx)=>idx!==i)}));

  const addDay    = () => setForm(f=>({...f,scheduleDays:[...f.scheduleDays,{day:"Saturday",time:"10:00",endTime:"12:00",type:"Live Lecture"}]}));
  const setDay    = (i,field,val) => setForm(f=>{ const d=[...f.scheduleDays]; d[i]={...d[i],[field]:val}; return {...f,scheduleDays:d}; });
  const removeDay = (i) => setForm(f=>({...f,scheduleDays:f.scheduleDays.filter((_,idx)=>idx!==i)}));

  const BtnStyle = {padding:"0.65rem 1.35rem",borderRadius:9,fontSize:"0.875rem"};

  const WizardBar = () => (
    <div style={{marginBottom:"1.5rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.72rem",color:"var(--text3)",marginBottom:"0.4rem"}}>
        <span>{t("enroll.stepOf", { current: step, total: 5 })}</span>
        <span style={{color:"var(--indigo-light)",fontWeight:600}}>{STEPS[step-1].label}</span>
      </div>
      <div style={{height:4,background:"var(--border2)",borderRadius:100,overflow:"hidden"}}>
        <div style={{height:"100%",background:"var(--gradient)",borderRadius:100,width:`${(step/5)*100}%`,transition:"width 0.4s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:"0.75rem"}}>
        {STEPS.map(s=>(
          <div key={s.key} style={{display:"flex",alignItems:"center",gap:"0.3rem",opacity:step>=s.key?1:0.4,transition:"opacity 0.3s"}}>
            <div style={{width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem",background:step>s.key?"var(--cyan)":step===s.key?"var(--indigo)":"var(--bg3)",color:"white",fontWeight:700,transition:"background 0.3s",flexShrink:0}}>
              {step>s.key?"✓":s.icon}
            </div>
            <span style={{fontSize:"0.7rem",fontWeight:step===s.key?600:400,color:step===s.key?"var(--text)":"var(--text3)"}}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (done) return (
    <div className="add-course-overlay">
      <div className="add-course-modal">
        <div className="acm-body" style={{textAlign:"center",padding:"2.5rem 1.5rem"}}>
          <div style={{fontSize:"3.5rem",marginBottom:"1rem",animation:"bounceIn 0.5s ease"}}>🎉</div>
          <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"1.25rem",marginBottom:"0.5rem"}}>{t("acm.created")}</div>
          <div style={{fontSize:"0.875rem",color:"var(--text2)",lineHeight:1.7,marginBottom:"1.5rem"}}>
            <strong style={{color:"var(--text)"}}>{form.title}</strong> {t("acm.savedAsDraft")}<br/>
            {t("acm.reviewInMyCourses")}
          </div>
          <div style={{background:"var(--bg3)",borderRadius:12,padding:"1rem",marginBottom:"1.5rem",textAlign:"left"}}>
            <div style={{display:"flex",gap:"0.75rem",alignItems:"center",marginBottom:"0.75rem"}}>
              <span style={{fontSize:"2rem"}}>{form.image}</span>
              <div>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:700}}>{form.title}</div>
                <div style={{fontSize:"0.78rem",color:"var(--text3)"}}>{form.category} · {form.level} · {form.mode}</div>
              </div>
              <div style={{marginLeft:"auto",fontFamily:"Syne,sans-serif",fontWeight:800,color:"var(--cyan)",fontSize:"1.1rem"}}>${form.price}</div>
            </div>
            {form.weeks.filter(w=>w.title).length>0 && (
              <div style={{fontSize:"0.78rem",color:"var(--text3)"}}>
                📚 {form.weeks.filter(w=>w.title).length} {t("acm.weeksLabel")} · 📅 {t("acm.startsLabel")} {form.startDate||"TBD"}
              </div>
            )}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
            <button className="btn btn-ghost" style={BtnStyle} onClick={onClose}>{t("enroll.done")}</button>
            <button className="btn btn-primary" style={BtnStyle} onClick={onClose}>{t("acm.goMyCourses")} →</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="add-course-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="add-course-modal">

        {/* Header */}
        <div className="acm-header">
          <div>
            <div className="acm-title">{["",t("acm.h1"),t("acm.h2"),t("acm.h3"),t("acm.h4"),t("acm.h5")][step]}</div>
            <div className="acm-sub">{["",t("acm.s1"),t("acm.s2"),t("acm.s3"),t("acm.s4"),t("acm.s5")][step]}</div>
          </div>
          <button className="em-close" onClick={onClose}>✕</button>
        </div>

        <div className="acm-body">
          <WizardBar />

          {/* ── STEP 1: BASICS ── */}
          {step===1 && (
            <>
              <div className="form-group">
                <label className="form-label">{t("ecm.courseIcon")}</label>
                <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                  {emojis.map(e=>(
                    <div key={e} onClick={()=>set("image",e)}
                      style={{width:36,height:36,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",cursor:"pointer",border:`1.5px solid ${form.image===e?"var(--indigo)":"var(--border2)"}`,background:form.image===e?"rgba(99,102,241,0.1)":"var(--bg)",transition:"all 0.15s"}}>
                      {e}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t("acm.courseTitle")} *</label>
                <input className={`form-input ${errors.title?"input-error":""}`} placeholder={t("acm.courseTitlePlaceholder")} value={form.title} onChange={e=>set("title",e.target.value)} />
                {errors.title && <div style={{fontSize:"0.72rem",color:"#f87171",marginTop:"0.25rem"}}>⚠ {errors.title}</div>}
              </div>

              <div className="acm-row">
                <div className="form-group">
                  <label className="form-label">{t("acm.category")}</label>
                  <select className="acm-select" value={form.category} onChange={e=>set("category",e.target.value)}>
                    {["Data Science","Programming","Computer Science","Design","Other"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t("acm.level")}</label>
                  <select className="acm-select" value={form.level} onChange={e=>set("level",e.target.value)}>
                    {["Beginner","Intermediate","Advanced"].map(l=><option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="acm-row">
                <div className="form-group">
                  <label className="form-label">{t("acm.price")} *</label>
                  <input className={`form-input ${errors.price?"input-error":""}`} type="number" min="1" placeholder={t("acm.pricePlaceholder")} value={form.price} onChange={e=>set("price",e.target.value)} />
                  {errors.price && <div style={{fontSize:"0.72rem",color:"#f87171",marginTop:"0.25rem"}}>⚠ {errors.price}</div>}
                  {form.price>0 && <div style={{fontSize:"0.72rem",color:"var(--text3)",marginTop:"0.25rem"}}>≈ SDG {(form.price*350).toLocaleString()}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">{t("acm.mode")}</label>
                  <select className="acm-select" value={form.mode} onChange={e=>set("mode",e.target.value)}>
                    {[["online","🟢 Online"],["in-person","🟡 In-Person"],["hybrid","🔵 Hybrid"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t("acm.description")} *</label>
                <textarea className={`acm-textarea ${errors.description?"input-error":""}`} rows={3} placeholder={t("acm.descPlaceholder")} value={form.description} onChange={e=>set("description",e.target.value)} />
                {errors.description && <div style={{fontSize:"0.72rem",color:"#f87171",marginTop:"0.25rem"}}>⚠ {errors.description}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">{t("acm.tags")}</label>
                <input className="form-input" placeholder={t("acm.tagsPlaceholder")} value={form.tags} onChange={e=>set("tags",e.target.value)} />
              </div>
            </>
          )}

          {/* ── STEP 2: SCHEDULE ── */}
          {step===2 && (
            <>
              <div className="acm-row">
                <div className="form-group">
                  <label className="form-label">{t("acm.startDate")} *</label>
                  <input className={`form-input ${errors.startDate?"input-error":""}`} type="date" value={form.startDate} onChange={e=>set("startDate",e.target.value)} />
                  {errors.startDate && <div style={{fontSize:"0.72rem",color:"#f87171",marginTop:"0.25rem"}}>⚠ {errors.startDate}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">{t("acm.enrollDeadline")}</label>
                  <input className="form-input" type="date" value={form.enrollDeadline} onChange={e=>set("enrollDeadline",e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t("acm.duration")} *</label>
                <input className={`form-input ${errors.duration?"input-error":""}`} placeholder={t("acm.durationPlaceholder")} value={form.duration} onChange={e=>set("duration",e.target.value)} />
                {errors.duration && <div style={{fontSize:"0.72rem",color:"#f87171",marginTop:"0.25rem"}}>⚠ {errors.duration}</div>}
              </div>

              <div style={{marginBottom:"0.75rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}>
                  <label className="form-label" style={{margin:0}}>{t("acm.lectureDays")}</label>
                  <button onClick={addDay} style={{fontSize:"0.75rem",color:"var(--indigo-light)",background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:6,padding:"0.2rem 0.6rem",cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>+ {t("acm.addDay")}</button>
                </div>
                {form.scheduleDays.map((d,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:"0.5rem",marginBottom:"0.5rem",alignItems:"center"}}>
                    <select className="acm-select" style={{fontSize:"0.8rem",padding:"0.55rem 0.7rem"}} value={d.day} onChange={e=>setDay(i,"day",e.target.value)}>
                      {["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"].map(dy=><option key={dy}>{dy}</option>)}
                    </select>
                    <input className="form-input" style={{fontSize:"0.8rem",padding:"0.55rem 0.7rem"}} type="time" value={d.time} onChange={e=>setDay(i,"time",e.target.value)} />
                    <select className="acm-select" style={{fontSize:"0.78rem",padding:"0.55rem 0.7rem"}} value={d.type} onChange={e=>setDay(i,"type",e.target.value)}>
                      {["Live Lecture","Lab / Practice","Project Review","Q&A Session"].map(t=><option key={t}>{t}</option>)}
                    </select>
                    {form.scheduleDays.length>1 && (
                      <button onClick={()=>removeDay(i)} style={{color:"#f87171",background:"none",border:"none",cursor:"pointer",fontSize:"1rem",padding:"0.2rem",lineHeight:1}}>✕</button>
                    )}
                  </div>
                ))}
              </div>

              {(form.mode==="online"||form.mode==="hybrid") && (
                <>
                  <div className="acm-section-title">🔗 {t("acm.onlineLinks")}</div>
                  <div className="form-group">
                    <label className="form-label">{t("acm.meetLink")}</label>
                    <input className="form-input" placeholder="https://zoom.us/j/..." value={form.meetLink} onChange={e=>set("meetLink",e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("acm.groupLink")}</label>
                    <input className="form-input" placeholder="https://chat.whatsapp.com/..." value={form.groupLink} onChange={e=>set("groupLink",e.target.value)} />
                  </div>
                </>
              )}

              {(form.mode==="in-person"||form.mode==="hybrid") && (
                <>
                  <div className="acm-section-title">📍 {t("acm.venue")}</div>
                  <div className="form-group">
                    <label className="form-label">{t("acm.location")}</label>
                    <input className="form-input" placeholder={t("acm.locationPlaceholder")} value={form.location} onChange={e=>set("location",e.target.value)} />
                  </div>
                </>
              )}
            </>
          )}

          {/* ── STEP 3: ENROLLMENT FORM ── */}
          {step===3 && (
            <>
              <div style={{fontSize:"0.82rem",color:"var(--text2)",lineHeight:1.6,marginBottom:"1rem"}}>
                {t("acm.enrollmentFieldsDesc")}{" "}
                <strong style={{color:"var(--text)"}}>{t("acm.enrollAlwaysRequired")}</strong>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.75rem"}}>
                {ENROLLMENT_FIELDS.map(field => {
                  const selected = form.enrollmentFields.find(ef => ef.id === field.id);
                  const isOn = !!selected;
                  const isReq = selected?.required ?? false;

                  return (
                    <div key={field.id}
                      style={{
                        borderRadius:10,
                        border:`1.5px solid ${isOn?(field.locked?"var(--cyan)":"var(--indigo)"):"var(--border2)"}`,
                        background: isOn?(field.locked?"rgba(6,182,212,0.06)":"rgba(99,102,241,0.06)"):"var(--bg)",
                        overflow:"hidden",
                        transition:"all 0.2s",
                        opacity: !isOn && !field.locked ? 0.65 : 1,
                      }}>

                      {/* Card header — click to toggle */}
                      <div
                        onClick={() => !field.locked && toggleEnrollField(field.id)}
                        style={{
                          display:"flex",alignItems:"center",gap:"0.5rem",
                          padding:"0.55rem 0.7rem",
                          cursor: field.locked ? "default" : "pointer",
                          userSelect:"none",
                        }}>
                        <span style={{fontSize:"1rem",flexShrink:0}}>{field.icon}</span>
                        <span style={{fontSize:"0.8rem",fontWeight:isOn?600:400,flex:1,lineHeight:1.3}}>{field.label}</span>
                        {field.locked
                          ? <span style={{fontSize:"0.62rem",color:"var(--cyan)",fontWeight:700,background:"rgba(6,182,212,0.12)",padding:"0.15rem 0.45rem",borderRadius:4,flexShrink:0}}>{t("acm.fixed")}</span>
                          : <div style={{
                              width:16,height:16,borderRadius:"50%",flexShrink:0,
                              background: isOn ? "var(--indigo)" : "transparent",
                              border: `2px solid ${isOn?"var(--indigo)":"var(--border2)"}`,
                              display:"flex",alignItems:"center",justifyContent:"center",
                              transition:"all 0.2s",
                            }}>
                              {isOn && <span style={{fontSize:"0.55rem",color:"white",fontWeight:900,lineHeight:1}}>✓</span>}
                            </div>
                        }
                      </div>

                      {/* Required / Optional toggle — only for selected non-locked fields */}
                      {isOn && !field.locked && (
                        <div style={{display:"flex",borderTop:"1px solid var(--border2)",fontSize:"0.71rem",fontFamily:"DM Sans,sans-serif"}}>
                          <button
                            onClick={() => setEnrollFieldRequired(field.id, false)}
                            style={{
                              flex:1, padding:"0.3rem 0.25rem",
                              background: !isReq ? "rgba(99,102,241,0.12)" : "transparent",
                              border:"none",
                              color: !isReq ? "var(--indigo-light)" : "var(--text3)",
                              cursor:"pointer", fontWeight: !isReq ? 700 : 400,
                              fontFamily:"inherit", transition:"all 0.15s",
                            }}>
                            {t("acm.optional")}
                          </button>
                          <button
                            onClick={() => setEnrollFieldRequired(field.id, true)}
                            style={{
                              flex:1, padding:"0.3rem 0.25rem",
                              background: isReq ? "rgba(99,102,241,0.12)" : "transparent",
                              border:"none", borderLeft:"1px solid var(--border2)",
                              color: isReq ? "var(--indigo-light)" : "var(--text3)",
                              cursor:"pointer", fontWeight: isReq ? 700 : 400,
                              fontFamily:"inherit", transition:"all 0.15s",
                            }}>
                            {t("acm.required")} ★
                          </button>
                        </div>
                      )}

                      {/* Always-required label for locked fields */}
                      {isOn && field.locked && (
                        <div style={{borderTop:"1px solid rgba(6,182,212,0.15)",fontSize:"0.7rem",color:"var(--text3)",padding:"0.28rem 0.7rem",textAlign:"center"}}>
                          {t("acm.alwaysRequired")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Summary chip */}
              <div style={{
                background:"rgba(99,102,241,0.06)",
                border:"1px solid rgba(99,102,241,0.15)",
                borderRadius:8, padding:"0.6rem 0.875rem",
                fontSize:"0.78rem", color:"var(--text2)",
                display:"flex", alignItems:"center", gap:"0.5rem",
              }}>
                <span>📋</span>
                <span>
                  <strong style={{color:"var(--text)"}}>{form.enrollmentFields.length}</strong> {t("acm.fieldsSelected")}
                  &nbsp;·&nbsp;
                  <strong style={{color:"var(--indigo-light)"}}>{form.enrollmentFields.filter(f=>f.required).length}</strong> {t("acm.required")}
                  &nbsp;·&nbsp;
                  <span style={{color:"var(--text3)"}}>{form.enrollmentFields.filter(f=>!f.required).length} {t("acm.optional")}</span>
                </span>
              </div>
            </>
          )}

          {/* ── STEP 4: CONTENT ── */}
          {step===4 && (
            <>
              <div style={{fontSize:"0.82rem",color:"var(--text2)",lineHeight:1.6,marginBottom:"1rem"}}>
                {t("acm.contentDesc")}
              </div>
              {form.weeks.map((w,i)=>(
                <div key={i} style={{display:"flex",gap:"0.6rem",marginBottom:"0.6rem",alignItems:"flex-start"}}>
                  <div style={{width:30,height:30,borderRadius:7,background:"rgba(99,102,241,0.12)",color:"var(--indigo-light)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"0.75rem",flexShrink:0,marginTop:2}}>W{i+1}</div>
                  <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:"0.5rem"}}>
                    <input className="form-input" style={{fontSize:"0.82rem",padding:"0.55rem 0.7rem"}} placeholder={t("acm.weekTitle", { n: i+1 })} value={w.title} onChange={e=>setWeek(i,"title",e.target.value)} />
                    <input className="form-input" style={{fontSize:"0.82rem",padding:"0.55rem 0.7rem"}} placeholder={t("acm.weekTopics")} value={w.topics} onChange={e=>setWeek(i,"topics",e.target.value)} />
                  </div>
                  {form.weeks.length>1 && (
                    <button onClick={()=>removeWeek(i)} style={{color:"#f87171",background:"none",border:"none",cursor:"pointer",fontSize:"1rem",lineHeight:1,padding:"0.4rem",marginTop:2}}>✕</button>
                  )}
                </div>
              ))}
              <button onClick={addWeek} style={{width:"100%",padding:"0.6rem",borderRadius:8,border:"1.5px dashed var(--border2)",background:"transparent",color:"var(--text2)",cursor:"pointer",fontSize:"0.82rem",fontFamily:"DM Sans,sans-serif",marginTop:"0.25rem",transition:"all 0.2s"}}
                onMouseEnter={e=>{e.target.style.borderColor="var(--indigo)";e.target.style.color="var(--indigo-light)"}}
                onMouseLeave={e=>{e.target.style.borderColor="var(--border2)";e.target.style.color="var(--text2)"}}>
                + {t("acm.addWeek")}
              </button>
            </>
          )}

          {/* ── STEP 5: REVIEW ── */}
          {step===5 && (
            <>
              <div style={{fontSize:"0.85rem",color:"var(--text2)",marginBottom:"1rem"}}>{t("acm.reviewDesc")}</div>

              {/* Summary card */}
              <div style={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:12,padding:"1.25rem",marginBottom:"1rem"}}>
                <div style={{display:"flex",gap:"0.875rem",alignItems:"center",marginBottom:"1rem"}}>
                  <span style={{fontSize:"2.25rem"}}>{form.image}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"1rem",marginBottom:"0.15rem"}}>{form.title||<em style={{color:"var(--text3)"}}>No title</em>}</div>
                    <div style={{fontSize:"0.78rem",color:"var(--text3)",display:"flex",gap:"0.6rem",flexWrap:"wrap"}}>
                      <span>{form.category}</span><span>·</span><span>{form.level}</span>
                      <span>·</span><span style={{textTransform:"capitalize"}}>{form.mode}</span>
                    </div>
                  </div>
                  <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,color:"var(--cyan)",fontSize:"1.15rem"}}>${form.price}</div>
                </div>

                {[
                  [`📅 ${t("acm.startDate")}`,       form.startDate||"—"],
                  [`⏱ ${t("acm.duration")}`,         form.duration||"—"],
                  [`📚 ${t("acm.weeksLabel")}`,       form.weeks.filter(w=>w.title).length + ` ${t("acm.defined")}`],
                  [`🗓 ${t("acm.sessions")}`,         form.scheduleDays.length + ` ${t("acm.sessionTypes")}`],
                  [`📋 ${t("acm.enrollmentFields")}`, `${form.enrollmentFields.length} ${t("acm.fieldsLabel")} (${form.enrollmentFields.filter(f=>f.required).length} ${t("acm.required")})`],
                  ...(form.meetLink  ? [["💻 Meet Link","✓ Added"]]  : []),
                  ...(form.groupLink ? [["💬 Group Link","✓ Added"]] : []),
                ].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"0.4rem 0",borderBottom:"1px solid var(--border2)",fontSize:"0.82rem"}}>
                    <span style={{color:"var(--text3)"}}>{k}</span>
                    <span style={{fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:10,padding:"0.875rem",fontSize:"0.82rem",color:"var(--text2)"}}>
                💡 {t("acm.draftHint")}
              </div>
            </>
          )}
        </div>

        <div className="acm-footer">
          <button className="btn btn-ghost" style={BtnStyle} onClick={step===1?onClose:back}>
            {step===1 ? t("ecm.cancel") : `← ${t("common.back")}`}
          </button>
          <div style={{display:"flex",gap:"0.5rem",marginInlineStart:"auto"}}>
            {step<5
              ? <button className="btn btn-primary" style={BtnStyle} onClick={next}>{t("common.next")} →</button>
              : <>
                  <button className="btn btn-outline" style={BtnStyle} onClick={()=>{onSave(form);setDone(true);}}>{t("acm.saveDraft")}</button>
                  <button className="btn btn-primary" style={{...BtnStyle,display:"flex",alignItems:"center",gap:"0.4rem"}} onClick={()=>{onSave(form);setDone(true);}}>
                    🚀 {t("acm.createCourse")}
                  </button>
                </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCourseModal;
