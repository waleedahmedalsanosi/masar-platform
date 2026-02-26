import React from "react";
import CourseCard from "../components/CourseCard";
import CenterCard from "../components/CenterCard";
import Footer from "../components/Footer";
import { COURSES, CENTERS, STATS, FEATURES } from "../data";
import { useSettings } from "../contexts/SettingsContext";

function HomePage({ setPage }) {
  const { t } = useSettings();
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-badge">
            <span>🇸🇩</span> {t("home.badge").replace("🇸🇩 ", "")}
          </div>
          <h1>{t("home.title").split(". ").slice(0,2).join(". ")}.<br /><span>{t("home.title").split(". ").slice(2).join(". ")}</span></h1>
          <p>{t("home.subtitle")}</p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => setPage("courses")}>{t("home.explore")}</button>
            <button className="btn btn-outline btn-lg" onClick={() => setPage("register")}>{t("home.joinInstructor")}</button>
          </div>
          <div className="hero-stats">
            {STATS.map(s => (
              <div key={s.label} className="hero-stat">
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.icon} {s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="section-header">
          <div className="section-tag">{t("home.whyTag")}</div>
          <h2 className="section-title">{t("home.whyTitle")}</h2>
          <p className="section-sub">{t("home.whyDesc")}</p>
        </div>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COURSES PREVIEW */}
      <section className="section">
        <div className="section-header">
          <div className="section-tag">{t("home.featuredTag")}</div>
          <h2 className="section-title">{t("home.featuredTitle")}</h2>
          <p className="section-sub">{t("home.featuredDesc")}</p>
        </div>
        <div className="courses-grid">
          {COURSES.slice(0, 4).map(c => <CourseCard key={c.id} course={c} setPage={setPage} />)}
        </div>
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <button className="btn btn-outline btn-lg" onClick={() => setPage("courses")}>{t("home.viewAll")}</button>
        </div>
      </section>

      {/* CENTERS PREVIEW */}
      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="section-header">
          <div className="section-tag">{t("home.centersTag")}</div>
          <h2 className="section-title">{t("home.centersTitle")}</h2>
          <p className="section-sub">{t("home.centersDesc")}</p>
        </div>
        <div className="centers-grid">
          {CENTERS.map(c => <CenterCard key={c.id} center={c} setPage={setPage} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="orb" style={{ width: 400, height: 400, background: "var(--indigo)", top: -100, left: "30%", opacity: 0.06 }} />
        <div className="section-tag">{t("home.ctaTag")}</div>
        <h2 className="section-title">{t("home.ctaTitle")}</h2>
        <p className="section-sub" style={{ marginBottom: "2rem" }}>{t("home.ctaDesc")}</p>
        <button className="btn btn-primary btn-lg" onClick={() => setPage("register")}>{t("home.ctaBtn")}</button>
      </section>

      <Footer setPage={setPage} />
    </>
  );
}

export default HomePage;
