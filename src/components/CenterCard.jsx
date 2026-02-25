/**
 * @file CenterCard.jsx
 * @description مكوّن بطاقة عرض المركز التدريبي
 *
 * يعرض ملخصاً بصرياً لمركز تدريبي يشمل:
 * - شعار المركز ولونه المميز
 * - الاسم والشعار والموقع الجغرافي
 * - إحصائيات الكورسات، المدربين، الطلاب
 * - التقييم وسنة التأسيس
 * - مجالات التخصص
 *
 * عند النقر تنتقل إلى صفحة المركز الكاملة.
 */

import React from "react";
import StarRating from "./StarRating";

/**
 * بطاقة المركز التدريبي
 * @param {Object} props
 * @param {import('../data/centers').Center} props.center - بيانات المركز
 * @param {Function} props.setPage - دالة التنقل لصفحة المركز
 */
function CenterCard({ center, setPage }) {
  return (
    <div className="center-card" onClick={() => setPage("center-" + center.slug)}>
      <div className="center-header">
        <div className="center-glow" style={{ background: center.color }} />
        <div className="center-logo" style={{ background: center.color }}>{center.logo}</div>
        <div className="center-name">{center.name}</div>
        <div className="center-tagline">{center.tagline}</div>
      </div>
      <div className="center-body">
        <div className="center-stats">
          <div className="c-stat"><div className="c-stat-val">{center.courses}</div><div className="c-stat-lbl">Courses</div></div>
          <div className="c-stat"><div className="c-stat-val">{center.instructors}</div><div className="c-stat-lbl">Instructors</div></div>
          <div className="c-stat"><div className="c-stat-val">{center.students.toLocaleString()}</div><div className="c-stat-lbl">Students</div></div>
        </div>
        <div className="center-specs">
          {center.specialties.map(s => <span key={s} className="spec-tag">{s}</span>)}
        </div>
        <div className="center-meta">
          <span className="center-location">📍 {center.location} · Est. {center.founded}</span>
          <div className="center-rating"><StarRating rating={center.rating} /> {center.rating}</div>
        </div>
      </div>
    </div>
  );
}

export default CenterCard;
