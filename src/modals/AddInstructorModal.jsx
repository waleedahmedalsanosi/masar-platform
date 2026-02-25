/**
 * @file AddInstructorModal.jsx
 * @description نافذة إضافة مدرب جديد للمركز
 *
 * نافذة منبثقة تُمكّن مالك المركز من إضافة مدرب جديد عبر:
 * - إدخال الاسم والتخصص والبريد الإلكتروني
 * - تحديد الكورسات المسندة للمدرب
 */

import { useState } from "react";

/**
 * نافذة إضافة مدرب جديد
 * @param {Object} props
 * @param {Function} props.onClose - دالة إغلاق نافذة
 * @param {Function} props.onAdd - callback يُستدعى مع بيانات مدرب الجديد
 */
function AddInstructorModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name:"", title:"", email:"", phone:"", split:70 });
  const [sent, setSent] = useState(false);
  const isValid = form.name.trim() && form.email.trim();
  return (
    <div className="add-course-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="add-course-modal" style={{maxWidth:460}}>
        <div className="acm-header">
          <div><div className="acm-title">+ Add Instructor</div><div className="acm-sub">Invite an instructor to join your center</div></div>
          <button className="em-close" onClick={onClose}>✕</button>
        </div>
        {!sent ? (
          <>
            <div className="acm-body">
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Ahmed Hassan" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Title / Specialization</label><input className="form-input" placeholder="Data Scientist" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div className="acm-row">
                <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="instructor@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="09xxxxxxxxx" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
              </div>
              <div className="form-group">
                <label className="form-label">Center Fee per Student (SDG)</label>
                <input className="form-input" type="number" min="0" placeholder="50" defaultValue="50"
                  style={{}} onChange={e=>setForm({...form,feePerStudent:+e.target.value})}/>
                <div style={{fontSize:"0.75rem",color:"var(--text3)",marginTop:"0.35rem"}}>
                  💡 The instructor sets their own course price. The center earns this flat fee per enrollment.
                </div>
              </div>
              <div style={{background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:10,padding:"0.875rem",fontSize:"0.82rem",color:"var(--text2)"}}>
                📧 An invitation email will be sent to the instructor. They'll create their account and be listed under your center.
              </div>
            </div>
            <div className="acm-footer">
              <button className="btn btn-ghost" style={{padding:"0.6rem 1.1rem",borderRadius:9,fontSize:"0.875rem"}} onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" style={{padding:"0.6rem 1.25rem",borderRadius:9,fontSize:"0.875rem"}} disabled={!isValid} onClick={()=>{onAdd({...form,avatar:form.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()});setSent(true);}}>Send Invitation →</button>
            </div>
          </>
        ) : (
          <div className="acm-body" style={{textAlign:"center",padding:"1.5rem"}}>
            <div style={{fontSize:"3rem",marginBottom:"0.75rem"}}>✉️</div>
            <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"1.1rem",marginBottom:"0.4rem"}}>Invitation Sent!</div>
            <div style={{fontSize:"0.85rem",color:"var(--text2)",marginBottom:"1.5rem"}}>An invitation was sent to <strong>{form.email}</strong>. Once they accept, they'll appear under your instructors.</div>
            <button className="btn btn-primary" style={{width:"100%",padding:"0.875rem",borderRadius:10}} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddInstructorModal;
