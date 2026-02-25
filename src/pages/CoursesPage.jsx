/**
 * @file CoursesPage.jsx
 * @description صفحة استعراض جميع الكورسات مع إمكانية الفلترة
 *
 * توفر هذه الصفحة:
 * - عرض جميع الكورسات المتاحة على المنصة
 * - فلترة الكورسات حسب التصنيف (All, Data Science, Programming, Design, Computer Science)
 * - شبكة عرض متجاوبة للكورسات
 */

import { useState } from "react";
import CourseCard from "../components/CourseCard";
import Footer from "../components/Footer";
import { COURSES } from "../data";

/**
 * صفحة الكورسات
 * @param {Object} props
 * @param {Function} props.setPage - دالة التنقل لصفحة تفاصيل الكورس
 */
function CoursesPage({ setPage }) {
  const categories = ["All", "Data Science", "Programming", "Computer Science", "Design"];
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? COURSES : COURSES.filter(c => c.category === active);

  return (
    <>
      <div style={{ paddingTop: 100 }}>
        <section className="section">
          <div className="section-header">
            <div className="section-tag">All Courses</div>
            <h2 className="section-title">Explore 150+ Courses</h2>
            <p className="section-sub">From beginner to advanced — find your perfect learning path.</p>
          </div>
          <div className="filters">
            {categories.map(c => (
              <button key={c} className={`filter-btn ${active === c ? "active" : ""}`} onClick={() => setActive(c)}>{c}</button>
            ))}
          </div>
          <div className="courses-grid">
            {filtered.map(c => <CourseCard key={c.id} course={c} setPage={setPage} />)}
          </div>
        </section>
      </div>
      <Footer setPage={setPage} />
    </>
  );
}

export default CoursesPage;