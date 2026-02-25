/**
 * @file InstructorsPage.jsx
 * @description صفحة استعراض جميع المدربين
 *
 * توفر هذه الصفحة:
 * - عرض بطاقات جميع المدربين المعتمدين
 * - تفاصيل كل مدرب: التخصص، عدد الكورسات، التقييم، الطلاب
 * - التنقل لصفحة الملف الشخصي للمدرب
 */

import React from "react";
import Footer from "../components/Footer";
import { INSTRUCTORS } from "../data";

/**
 * صفحة المدربين
 * @param {Object} props
 * @param {Function} props.setPage - دالة التنقل لصفحة الملف الشخصي للمدرب
 */
function InstructorsPage({ setPage }) {
  return (
    <>
      <div style={{ paddingTop: 100 }}>
        <section className="section">
          <div className="section-header">
            <div className="section-tag">Meet the Experts</div>
            <h2 className="section-title">80+ Verified Instructors</h2>
            <p className="section-sub">Learn from industry professionals and academics shaping Sudan's tech future.</p>
          </div>
          <div className="instructors-grid">
            {INSTRUCTORS.map(i => (
              <div key={i.id} className="instructor-card" onClick={() => setPage("instructor-" + i.id)}>
                <div className="instructor-header">
                  <div className="avatar">{i.avatar}</div>
                  <div>
                    <div className="instructor-name">{i.name}</div>
                    <div className="instructor-title">{i.title}</div>
                    <div className="instructor-center">{i.center || "Independent"}</div>
                  </div>
                </div>
                <div className="instructor-bio">{i.bio}</div>
                <div className="specialties">
                  {i.specialties.map(s => <span key={s} className="tag">{s}</span>)}
                </div>
                <div className="instructor-stats">
                  <div className="i-stat"><div className="i-stat-val">{i.courses}</div><div className="i-stat-lbl">Courses</div></div>
                  <div className="i-stat"><div className="i-stat-val">{i.students}</div><div className="i-stat-lbl">Students</div></div>
                  <div className="i-stat"><div className="i-stat-val">{i.rating}</div><div className="i-stat-lbl">Rating</div></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer setPage={setPage} />
    </>
  );
}

export default InstructorsPage;