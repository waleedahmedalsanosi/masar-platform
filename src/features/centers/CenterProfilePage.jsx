import { useParams, useNavigate } from "react-router-dom";
import CourseCard from "../courses/CourseCard";
import {
  usePublicCenters,
  usePublicCourses,
  usePublicInstructors,
} from "../courses/hooks/usePublicData";

export default function CenterProfilePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: centers     = [] } = usePublicCenters();
  const { data: allCourses  = [] } = usePublicCourses();
  const { data: instructors = [] } = usePublicInstructors();

  const center = centers.find(c => c.slug === slug);

  if (!center) return null;

  const centerCourses = allCourses.filter(c => c.center === center.name);
  const centerInstructors = instructors.filter(i => i.center === center.name);

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
          {centerCourses.length > 0
            ? centerCourses.map(c => <CourseCard key={c.id} course={c} />)
            : <p style={{ color: "var(--text2)" }}>No courses listed yet.</p>}
        </div>
      </section>

      <section>
        <div className="dash-section-title">Instructors at {center.name}</div>
        <div className="instructors-grid">
          {centerInstructors.map(i => (
            <div key={i.id} className="instructor-card" onClick={() => navigate(`/instructors/${i.id}`)} style={{ cursor: "pointer" }}>
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
