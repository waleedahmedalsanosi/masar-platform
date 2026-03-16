import { useParams, useNavigate } from "react-router-dom";
import CourseCard from "../courses/CourseCard";
import {
  usePublicInstructors,
  usePublicInstructorDetails,
  usePublicCourses,
  usePublicCenters,
} from "../courses/hooks/usePublicData";

export default function InstructorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const instructorId = parseInt(id);

  const { data: instructors = [] } = usePublicInstructors();
  const { data: details           } = usePublicInstructorDetails(instructorId);
  const { data: allCourses  = [] } = usePublicCourses();
  const { data: centers     = [] } = usePublicCenters();

  const instructor = instructors.find(i => i.id === instructorId);
  const center = instructor?.center ? centers.find(c => c.name === instructor.center) : null;
  const instructorCourses = allCourses.filter(c => c.instructor === instructor?.name);

  if (!instructor || !details) return null;

  return (
    <div className="instructor-page">
      <div className="back-btn" onClick={() => navigate("/instructors")} style={{ cursor: "pointer" }}>← Back to Instructors</div>
      <div className="ip-layout">
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

          {center && (
            <div className="mini-center" onClick={() => navigate(`/centers/${center.slug}`)} style={{ cursor: "pointer" }}>
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
              {instructorCourses.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
