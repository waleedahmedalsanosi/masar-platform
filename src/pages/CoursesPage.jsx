import { useState } from "react";
import CourseCard from "../components/CourseCard";
import Footer from "../components/Footer";
import { COURSES } from "../data";
import { useSettings } from "../contexts/SettingsContext";

function CoursesPage({ setPage }) {
  const { t } = useSettings();
  const categories = [
    { key: "All",              label: () => t("courses.all") },
    { key: "Data Science",     label: () => t("courses.datascience") },
    { key: "Programming",      label: () => t("courses.programming") },
    { key: "Computer Science", label: () => t("courses.cs") },
    { key: "Design",           label: () => t("courses.design") },
  ];
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? COURSES : COURSES.filter(c => c.category === active);

  return (
    <>
      <div style={{ paddingTop: 100 }}>
        <section className="section">
          <div className="section-header">
            <div className="section-tag">{t("courses.tag")}</div>
            <h2 className="section-title">{t("courses.title")}</h2>
            <p className="section-sub">{t("courses.subtitle")}</p>
          </div>
          <div className="filters">
            {categories.map(c => (
              <button key={c.key} className={`filter-btn ${active === c.key ? "active" : ""}`} onClick={() => setActive(c.key)}>
                {c.label()}
              </button>
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
