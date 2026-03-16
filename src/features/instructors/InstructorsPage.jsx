import { useNavigate } from "react-router-dom";
import Footer from "../../shared/components/Footer";
import { usePublicInstructors } from "../courses/hooks/usePublicData";

export default function InstructorsPage() {
  const navigate = useNavigate();
  const { data: INSTRUCTORS = [], isLoading } = usePublicInstructors();

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
              <div key={i.id} className="instructor-card" onClick={() => navigate(`/instructors/${i.id}`)} style={{ cursor: "pointer" }}>
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
      <Footer />
    </>
  );
}
