/**
 * @file CenterProfilePage.jsx
 * @description صفحة الملف الشخصي الكامل للمركز التدريبي
 *
 * تعرض هذه الصفحة:
 * - معلومات المركز الكاملة (الاسم، الشعار، الموقع، سنة التأسيس)
 * - إحصائيات المركز (الكورسات، المدربون، الطلاب، التقييم)
 * - قائمة مدربي المركز
 * - قائمة كورسات المركز
 */

import React from "react";
import CourseCard from "../components/CourseCard";
import { CENTERS, COURSES, INSTRUCTORS } from "../data";

/**
 * صفحة الملف الشخصي للمركز التدريبي
 * @param {Object} props
 * @param {string} props.slug - المعرف النصي للمركز (من الـ URL)
 * @param {Function} props.setPage - دالة التنقل بين الصفحات
 */
function CenterProfilePage({ slug, setPage }) {
  const center = CENTERS.find(c => c.slug === slug);
  if (!center) return null;
  const centerCourses = COURSES.filter(c => c.center === center.name);
  const centerInstructors = INSTRUCTORS.filter(i => i.center === center.name);

  return (
    <div className="center-page">
      <div className="center-hero">
        <div className="center-hero-glow" style={{ background: center.color }} />
        <div className="center-hero-content">
          <div className="big-logo" style={{ background: center.color }}>{center.logo}</div>
          <div className="center-hero-name">{center.name}</div>
          <div className="center-hero-tag">{center.tagline}</div>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {center.specialties.map(s => <span key={s} className="spec-tag">{s}</span>)}
          </div>
          <div className="center-hero-stats">
            <div><div className="ch-stat-val">{center.courses}</div><div className="ch-stat-lbl">Courses</div></div>
            <div><div className="ch-stat-val">{center.instructors}</div><div className="ch-stat-lbl">Instructors</div></div>
            <div><div className="ch-stat-val">{center.students.toLocaleString()}</div><div className="ch-stat-lbl">Students</div></div>
            <div><div className="ch-stat-val">{center.rating} ★</div><div className="ch-stat-lbl">Rating</div></div>
          </div>
        </div>
      </div>

      <section style={{ marginBottom: "2rem" }}>
        <div className="dash-section-title">Courses by {center.name}</div>
        <div className="courses-grid">
          {centerCourses.length > 0 ? centerCourses.map(c => <CourseCard key={c.id} course={c} setPage={setPage} />) : <p style={{ color: "var(--text2)" }}>No courses listed yet.</p>}
        </div>
      </section>

      <section>
        <div className="dash-section-title">Instructors at {center.name}</div>
        <div className="instructors-grid">
          {centerInstructors.map(i => (
            <div key={i.id} className="instructor-card">
              <div className="instructor-header">
                <div className="avatar">{i.avatar}</div>
                <div>
                  <div className="instructor-name">{i.name}</div>
                  <div className="instructor-title">{i.title}</div>
                </div>
              </div>
              <div className="instructor-bio">{i.bio}</div>
              <div className="specialties">{i.specialties.map(s => <span key={s} className="tag">{s}</span>)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CenterProfilePage;