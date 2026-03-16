import React from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../../shared/components/StarRating";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div className="course-card" onClick={() => navigate(`/courses/${course.id}`)} style={{ cursor: "pointer" }}>
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
