/**
 * @file CourseReviewModal.jsx
 * @description نافذة مراجعة واعتماد الكورس
 *
 * نافذة منبثقة تُستخدم من قِبَل مالكي المراكز لمراجعة الكورسات
 * المُقدَّمة من المدربين وقبولها أو رفضها مع إمكانية إضافة ملاحظات.
 */

import { useState } from "react";

/**
 * نافذة مراجعة الكورس
 * @param {Object} props
 * @param {Object} props.course - بيانات الكورس المراد مراجعته
 * @param {Function} props.onClose - دالة إغلاق نافذة
 * @param {Function} props.onApprove - callback عند قبول الكورس
 * @param {Function} props.onReject - callback عند رفض الكورس مع سبب الرفض
 */
function CourseReviewModal({ course, onClose, onApprove, onReject }) {
  const [feedback, setFeedback] = useState("");
  return (
    <div className="add-course-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="add-course-modal">
        <div className="acm-header">
          <div>
            <div className="acm-title">🔍 Review Course</div>
            <div className="acm-sub">Submitted by {course.instructor} · {course.submitDate}</div>
          </div>
          <button className="em-close" onClick={onClose}>✕</button>
        </div>
        <div className="acm-body">
          <div style={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:12,padding:"1.25rem",marginBottom:"1rem"}}>
            <div style={{display:"flex",gap:"0.875rem",alignItems:"center",marginBottom:"0.875rem"}}>
              <span style={{fontSize:"2.25rem"}}>{course.image}</span>
              <div>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"1rem"}}>{course.title}</div>
                <div style={{fontSize:"0.78rem",color:"var(--text3)"}}>by {course.instructor}</div>
              </div>
            </div>
            <div style={{fontSize:"0.82rem",color:"var(--text2)",lineHeight:1.7}}>
              This is a preview of the course details submitted by the instructor. In production, the full curriculum, schedule, pricing, and description would appear here for your review.
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Feedback to instructor <span style={{fontWeight:400,color:"var(--text3)"}}>(optional — sent if rejected or edited)</span></label>
            <textarea className="acm-textarea" rows={3} placeholder="e.g. Please add more details to week 3 curriculum..." value={feedback} onChange={e=>setFeedback(e.target.value)}/>
          </div>
        </div>
        <div className="acm-footer">
          <button className="btn btn-ghost" style={{padding:"0.6rem 1.1rem",borderRadius:9,fontSize:"0.875rem"}} onClick={onClose}>Cancel</button>
          <button className="req-btn-reject" style={{padding:"0.6rem 1.1rem",borderRadius:9,fontSize:"0.875rem"}} onClick={onReject}>✕ Reject</button>
          <button className="req-btn-accept" style={{padding:"0.6rem 1.25rem",borderRadius:9,fontSize:"0.875rem"}} onClick={onApprove}>✓ Approve & Publish</button>
        </div>
      </div>
    </div>
  );
}

export default CourseReviewModal;
