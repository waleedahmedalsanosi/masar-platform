/**
 * @file CourseDetailPage.jsx
 * @description صفحة تفاصيل الكورس الكاملة
 *
 * تعرض هذه الصفحة:
 * - فيديو تعريفي للكورس (YouTube embed)
 * - معلومات المدرب والتقييمات
 * - تفاصيل الجدول الدراسي
 * - منهج الكورس الأسبوعي الكاملة
 * - مراجعات الطلاب السابقين
 * - قسم الأسئلة والأجوبة (QASection)
 * - زر التسجيل الذي يفتح نافذة الدفع (EnrollmentModal)
 * - شارات التعليم الحضوري/الإلكتروني وروابط الخرائط
 */

import { useState, useEffect } from "react";
import { COURSES, COURSE_DETAILS, INSTRUCTORS, INSTRUCTOR_DETAILS, CENTERS } from "../data";
import QASection from "../components/QASection";
import EnrollmentModal from "../modals/EnrollmentModal";

/**
 * صفحة تفاصيل الكورس
 * @param {Object} props
 * @param {number} props.courseId - معرف الكورس المراد عرضه
 * @param {Function} props.setPage - دالة التنقل بين الصفحات
 */
function CourseDetailPage({ courseId, setPage }) {
  const course = COURSES.find(c => c.id === courseId);
  const details = COURSE_DETAILS[courseId];
  const instructor = INSTRUCTORS.find(i => i.name === course?.instructor);
  const center = course?.center ? CENTERS.find(c => c.name === course.center) : null;
  const [playing, setPlaying] = useState(false);
  const [showEnroll, setShowEnroll] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  // فتح فورم التسجيل تلقائياً عند المجيء عبر رابط الفورم المباشر
  useEffect(() => {
    if (sessionStorage.getItem("masar_auto_enroll") === "1") {
      sessionStorage.removeItem("masar_auto_enroll");
      setShowEnroll(true);
    }
  }, []);

  if (!course || !details) return null;

  const avgRating = (details.reviews.reduce((s, r) => s + r.rating, 0) / details.reviews.length).toFixed(1);

  const modeBadge = { online: { label: "🟢 Online", cls: "online" }, "in-person": { label: "🟡 In-Person", cls: "in-person" }, hybrid: { label: "🔵 Hybrid", cls: "hybrid" } };
  const mb = modeBadge[course.mode] || modeBadge.online;

  return (
    <div className="course-detail">
      {showEnroll && <EnrollmentModal course={{...course, details}} onClose={() => setShowEnroll(false)} />}
      <div className="back-btn" onClick={() => setPage("courses")}>← Back to Courses</div>
      <div className="cd-layout">
        {/* LEFT / MAIN */}
        <div className="cd-main">
          {/* Hero with video */}
          <div className="cd-hero">
            <div className="cd-video-wrap">
              {playing ? (
                <iframe src={`https://www.youtube.com/embed/${details.videoId}?autoplay=1`} title="Course intro" allowFullScreen allow="autoplay" />
              ) : (
                <div className="cd-video-placeholder" onClick={() => setPlaying(true)}>
                  <div style={{ fontSize: "5rem", marginBottom: "0.5rem" }}>{course.image}</div>
                  <div className="play-btn">▶</div>
                  <div className="cd-video-label">Watch Course Introduction</div>
                </div>
              )}
            </div>
            <div className="cd-info">
              <div className="cd-badge-row">
                <span className="cd-cat">{course.category}</span>
                <span className="tag">{course.level}</span>
                <span className={`mode-badge ${mb.cls}`}>{mb.label}</span>
                {course.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <div className="cd-title">{course.title}</div>
              <div className="cd-meta-row">
                <span className="cd-meta-item">⏱ {course.duration}</span>
                <span className="cd-meta-item">👥 {course.students} students</span>
                <span className="cd-meta-item">⭐ {course.rating} ({details.reviews.length} reviews)</span>
                <span className="cd-meta-item">📅 Starts {details.startDate}</span>
              </div>
              <div className="cd-about">{details.about}</div>
            </div>
          </div>

          {/* Curriculum */}
          <div className="cd-card">
            <div className="cd-card-header">📚 Course Curriculum — {details.curriculum.length} Weeks</div>
            <div className="cd-card-body">
              {details.curriculum.map(w => (
                <div key={w.week} className="week-item">
                  <div className="week-num">W{w.week}</div>
                  <div className="week-content">
                    <div className="week-title">{w.title}</div>
                    <div className="week-topics">{w.topics.map(t => <span key={t} className="week-topic">{t}</span>)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="cd-card">
            <div className="cd-card-header">🗓 Lecture Schedule</div>
            <div className="cd-card-body">
              {details.schedule.map((s, i) => (
                <div key={i} className="schedule-item">
                  <div>
                    <div className="sched-day">{s.day}</div>
                    <div className="sched-time">{s.time}</div>
                  </div>
                  <span className="sched-type">{s.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="cd-card">
            <div className="cd-card-header">⭐ Student Reviews</div>
            <div className="cd-card-body">
              <div className="review-summary">
                <div className="review-big-rating">{avgRating}</div>
                <div className="review-stars-row">
                  <div className="review-stars-big">{"★".repeat(Math.round(parseFloat(avgRating)))}</div>
                  <div className="review-count">{details.reviews.length} reviews</div>
                </div>
              </div>
              {details.reviews.map((r, i) => (
                <div key={i} className="review-item">
                  <div className="review-header">
                    <div className="review-avatar">{r.avatar}</div>
                    <div>
                      <div className="review-name">{r.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ color: "#fbbf24", fontSize: "0.75rem" }}>{"★".repeat(r.rating)}</span>
                        <span className="review-date">{r.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="review-text">{r.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Q&A */}
          <QASection course={course} instructor={instructor} center={center} />
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          {/* Enroll Card */}
          <div className="enroll-card">
            <div className="enroll-price">${course.price}</div>
            <div className="enroll-deadline">⏰ Enrollment closes: {details.enrollDeadline}</div>
            <button className="btn btn-primary enroll-btn" onClick={() => setShowEnroll(true)}>Enroll Now</button>
            <button className={`btn enroll-btn ${wishlisted?"btn-primary":"btn-outline"}`} style={{ marginTop: "0.5rem", background: wishlisted?"rgba(251,191,36,0.15)":undefined, borderColor: wishlisted?"#fbbf24":undefined, color: wishlisted?"#fbbf24":undefined }} onClick={() => setWishlisted(w=>!w)}>{wishlisted ? "★ Wishlisted" : "☆ Add to Wishlist"}</button>
            <div className="enroll-divider" />
            <div className="enroll-details">
              <div className="enroll-detail-item"><span className="enroll-detail-icon">📅</span> Starts {details.startDate}</div>
              <div className="enroll-detail-item"><span className="enroll-detail-icon">⏱</span> {course.duration}</div>
              <div className="enroll-detail-item"><span className="enroll-detail-icon">📶</span> {course.level}</div>
              <div className="enroll-detail-item"><span className="enroll-detail-icon">🌐</span> <span style={{textTransform:"capitalize"}}>{course.mode} course</span></div>
              {(course.mode === "online" || course.mode === "hybrid") && <div className="enroll-detail-item"><span className="enroll-detail-icon">💻</span> Zoom / Google Meet link provided</div>}
              {(course.mode === "in-person" || course.mode === "hybrid") && course.location && <div className="enroll-detail-item"><span className="enroll-detail-icon">📍</span> {course.location.address}</div>}
              <div className="enroll-detail-item"><span className="enroll-detail-icon">🎓</span> Certificate on completion</div>
              <div className="enroll-detail-item"><span className="enroll-detail-icon">💬</span> Arabic & English support</div>
              <div className="enroll-detail-item"><span className="enroll-detail-icon">♾</span> Lifetime access to recordings</div>
            </div>
          </div>

          {/* Instructor mini card */}
          {instructor && (
            <div style={{ marginTop: "1rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Your Instructor</div>
              <div className="mini-instructor" onClick={() => setPage("instructor-" + instructor.id)}>
                <div className="mini-inst-header">
                  <div className="avatar" style={{ width: 44, height: 44, fontSize: "0.85rem" }}>{instructor.avatar}</div>
                  <div>
                    <div className="mini-inst-name">{instructor.name}</div>
                    <div className="mini-inst-title">{instructor.title}</div>
                  </div>
                </div>
                <div className="mini-inst-bio">{INSTRUCTOR_DETAILS[instructor.id]?.fullBio?.substring(0, 120)}...</div>
                <div className="mini-inst-link">View full profile →</div>

                {/* Center link */}
                {center && (
                  <div className="mini-center" onClick={e => { e.stopPropagation(); setPage("center-" + center.slug); }}>
                    <div className="mini-center-logo" style={{ background: center.color }}>{center.logo}</div>
                    <div>
                      <div className="mini-center-name">{center.name}</div>
                      <div className="mini-center-meta">📍 {center.location} · {center.rating} ★</div>
                    </div>
                    <div className="mini-center-arrow">→</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;
