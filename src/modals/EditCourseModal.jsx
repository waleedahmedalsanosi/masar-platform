/**
 * @file EditCourseModal.jsx
 * @description نافذة تعديل بيانات الكورس
 *
 * نافذة منبثقة تُمكّن المدرب من تعديل تفاصيل كورس موجود:
 * - تعديل العنوان، التصنيف، المستوى، السعر
 * - تعديل الوصف والمنهج
 * - تحديث طريقة التدريس والروابط
 */

import { useState } from "react";

/**
 * نافذة تعديل الكورس
 * @param {Object} props
 * @param {Object} props.course - بيانات الكورس الحالية
 * @param {Function} props.onClose - دالة إغلاق نافذة
 * @param {Function} props.onSave - callback يُستدعى مع بيانات المحدّثة
 */
function EditCourseModal({ course, onClose, onSave }) {
  const [form, setForm] = useState({
    title:    course.title    || "",
    price:    course.price    || "",
    level:    course.level    || "Beginner",
    duration: course.duration || "",
    image:    course.image    || "📚",
    status:   course.status   || "draft",
  });
  const [saved, setSaved] = useState(false);
  const emojis = ["📚","🐍","🌐","🤖","🎨","🗄️","📊","⚡","📱","☁️","🔧","🧠"];

  const handleSave = () => {
    onSave({ ...course, ...form });
    setSaved(true);
    setTimeout(() => { onClose(); }, 900);
  };

  return (
    <div className="add-course-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="add-course-modal" style={{maxWidth:520}}>
        <div className="acm-header">
          <div>
            <div className="acm-title">✏ Edit Course</div>
            <div className="acm-sub">Changes will reflect immediately on the course page</div>
          </div>
          <button className="em-close" onClick={onClose}>✕</button>
        </div>
        <div className="acm-body">
          {/* Icon */}
          <div className="form-group">
            <label className="form-label">Course Icon</label>
            <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
              {emojis.map(e=>(
                <div key={e} onClick={()=>setForm(f=>({...f,image:e}))}
                  style={{width:36,height:36,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",cursor:"pointer",border:`1.5px solid ${form.image===e?"var(--indigo)":"var(--border2)"}`,background:form.image===e?"rgba(99,102,241,0.1)":"var(--bg)",transition:"all 0.15s"}}>
                  {e}
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Course Title</label>
            <input className="form-input" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
          </div>
          <div className="acm-row">
            <div className="form-group">
              <label className="form-label">Price (USD)</label>
              <input className="form-input" type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
              {form.price>0 && <div style={{fontSize:"0.72rem",color:"var(--text3)",marginTop:"0.25rem"}}>≈ SDG {(form.price*350).toLocaleString()}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Level</label>
              <select className="acm-select" value={form.level} onChange={e=>setForm(f=>({...f,level:e.target.value}))}>
                {["Beginner","Intermediate","Advanced"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Duration</label>
            <input className="form-input" placeholder="e.g. 8 weeks" value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="acm-select" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              {[["draft","📝 Draft"],["active","✅ Active"],["archived","📦 Archived"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="acm-footer">
          <button className="btn btn-ghost" style={{padding:"0.6rem 1.1rem",borderRadius:9,fontSize:"0.875rem"}} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{padding:"0.6rem 1.35rem",borderRadius:9,fontSize:"0.875rem",display:"flex",alignItems:"center",gap:"0.4rem"}}
            onClick={handleSave} disabled={!form.title.trim()}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditCourseModal;
