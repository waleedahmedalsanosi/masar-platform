/**
 * @file InstructorProfilePage.jsx
 * @description صفحة الملف الشخصي الكامل للمدرب
 *
 * تعرض هذه الصفحة:
 * - معلومات المدرب الكاملة (السيرة الذاتية، الإنجازات)
 * - روابط التواصل الاجتماعي (LinkedIn, GitHub)
 * - قائمة كورسات المدرب على المنصة
 * - إحصائيات عامة (الكورسات، الطلاب، التقييم)
 */

import React from "react";
import CourseCard from "../components/CourseCard";
import { INSTRUCTORS, INSTRUCTOR_DETAILS, COURSES, CENTERS } from "../data";

/**
 * صفحة الملف الشخصي للمدرب
 * @param {Object} props
 * @param {number} props.instructorId - معرف المدرب
 * @param {Function} props.setPage - دالة التنقل بين الصفحات
 */
function InstructorProfilePage({ instructorId, setPage }) {
  const instructor = INSTRUCTORS.find(i => i.id === instructorId);
  const details = INSTRUCTOR_DETAILS[instructorId];
  const center = instructor?.center ? CENTERS.find(c => c.name === instructor.center) : null;
  const instructorCourses = COURSES.filter(c => c.instructor === instructor?.name);

  if (!instructor || !details) return null;

  return (
    <div className="instructor-page">
      <div className="back-btn" onClick={() => setPage("instructors")}>← Back to Instructors</div>
      <div className="ip-layout">
        {/* Sidebar */}
        <div className="ip-sidebar">
          <div className="ip-profile-card">
            <div className="ip-avatar">{instructor.avatar}</div>
            <div className="ip-name">{instructor.name}</div>
            <div className="ip-title">{instructor.title}</div>
            <div className="specialties" style={{ justifyContent: "center" }}>
              {instructor.specialties.map(s => <span key={s} className="tag">{s}</span>)}
            </div>
            <div className="ip-stats">
              <div><div className="ip-stat-val">{instructor.courses}</div><div className="ip-stat-lbl">Courses</div></div>
              <div><div className="ip-stat-val">{instructor.students}</div><div className="ip-stat-lbl">Students</div></div>
              <div><div className="ip-stat-val">{instructor.rating}</div><div className="ip-stat-lbl">Rating</div></div>
            </div>
            {(details.linkedin || details.github) && (
              <div className="ip-links">
                {details.linkedin && <div className="ip-link">🔗 {details.linkedin}</div>}
                {details.github && <div className="ip-link">💻 {details.github}</div>}
              </div>
            )}
          </div>

          {/* Center card */}
          {center && (
            <div className="mini-center" onClick={() => setPage("center-" + center.slug)}>
              <div className="mini-center-logo" style={{ background: center.color }}>{center.logo}</div>
              <div>
                <div className="mini-center-name">{center.name}</div>
                <div className="mini-center-meta">📍 {center.location} · {center.courses} courses</div>
              </div>
              <div className="mini-center-arrow">→</div>
            </div>
          )}
          {!center && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 12, padding: "1rem", fontSize: "0.85rem", color: "var(--text2)", textAlign: "center" }}>
              🎓 Independent Instructor
            </div>
          )}
        </div>

        {/* Main */}
        <div className="ip-main">
          <div className="ip-section">
            <div className="ip-section-title">👤 About {instructor.name}</div>
            <div className="ip-bio">{details.fullBio}</div>
          </div>

          <div className="ip-section">
            <div className="ip-section-title">🏆 Achievements & Credentials</div>
            {details.achievements.map((a, i) => (
              <div key={i} className="achievement-item">
                <div className="achievement-dot" />
                {a}
              </div>
            ))}
          </div>

          <div className="ip-section">
            <div className="ip-section-title">📚 Courses by {instructor.name}</div>
            <div className="courses-grid">
              {instructorCourses.map(c => <CourseCard key={c.id} course={c} setPage={setPage} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorProfilePage;