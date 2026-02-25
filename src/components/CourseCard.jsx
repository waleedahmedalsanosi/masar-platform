/**
 * @file CourseCard.jsx
 * @description مكوّن بطاقة عرض الكورس
 *
 * يعرض ملخصاً بصرياً لكورس واحد يشمل:
 * - صورة/إيموجي الكورس والتصنيف
 * - العنوان، المدرب، المركز
 * - التقييم، عدد الطلاب، مدة الكورس
 * - الوسوم (tags) والمستوى
 * - السعر وزر "View Course"
 *
 * عند النقر تنتقل إلى صفحة تفاصيل الكورس.
 */

import React from "react";
import StarRating from "./StarRating";

/**
 * بطاقة الكورس
 * @param {Object} props
 * @param {import('../data/courses').Course} props.course - بيانات الكورس
 * @param {Function} props.setPage - دالة التنقل لصفحة التفاصيل
 */
function CourseCard({ course, setPage }) {
  return (
    <div className="course-card" onClick={() => setPage && setPage("course-" + course.id)} style={{ cursor: setPage ? "pointer" : "default" }}>
      <div className="course-cover">
        <span className="float">{course.image}</span>
        <span className="course-level">{course.level}</span>
      </div>
      <div className="course-body">
        <div className="course-meta">
          <span className="course-center">{course.center || "Independent Instructor"}</span>
        </div>
        <div className="course-title">{course.title}</div>
        <div className="course-instructor">by {course.instructor} · {course.duration}</div>
        <div className="course-tags">
          {course.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div className="course-footer">
          <span className="course-price">${course.price}</span>
          <div>
            <div className="course-rating">
              <StarRating rating={course.rating} />
              <span>{course.rating}</span>
            </div>
            <div className="course-students">{course.students} students</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
