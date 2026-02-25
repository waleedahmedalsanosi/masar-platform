/**
 * @file HomePage.jsx
 * @description الصفحة الرئيسية لمنصة مسار
 *
 * تتضمن الصفحة الرئيسية الأقسام التالية:
 * 1. Hero Section - القسم الترحيبي مع العنوان الرئيسي وزرا الدعوة للعمل
 * 2. Stats Section - إحصائيات المنصة (الطلاب، الكورسات، المراكز، المدربين)
 * 3. Featured Courses - أبرز 3 كورسات مميزة
 * 4. Features Section - مميزات المنصة الستة
 * 5. Centers Section - أبرز 3 مراكز تدريبية
 * 6. CTA Section - دعوة للتسجيل
 */

import React from "react";
import CourseCard from "../components/CourseCard";
import CenterCard from "../components/CenterCard";
import Footer from "../components/Footer";
import { COURSES, CENTERS, STATS, FEATURES } from "../data";

/**
 * مكوّن الصفحة الرئيسية
 * @param {Object} props
 * @param {Function} props.setPage - دالة التنقل بين صفحات التطبيق
 */
function HomePage({ setPage }) {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-badge">
            <span>🇸🇩</span> Sudan's #1 Tech Training Platform
          </div>
          <h1>Learn. Grow.<br /><span>Build Your Future.</span></h1>
          <p>Masar connects Sudanese learners with the best training centers and instructors in Computer Science, Data Science, and Programming.</p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => setPage("courses")}>Explore Courses</button>
            <button className="btn btn-outline btn-lg" onClick={() => setPage("register")}>Join as Instructor</button>
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
          <div className="section-tag">Why Masar?</div>
          <h2 className="section-title">Everything You Need to Succeed</h2>
          <p className="section-sub">We built Masar to solve the real problems Sudanese students face when looking for quality tech education.</p>
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
          <div className="section-tag">Featured Courses</div>
          <h2 className="section-title">Start Learning Today</h2>
          <p className="section-sub">Handpicked courses from verified instructors and centers across Sudan.</p>
        </div>
        <div className="courses-grid">
          {COURSES.slice(0, 4).map(c => <CourseCard key={c.id} course={c} setPage={setPage} />)}
        </div>
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <button className="btn btn-outline btn-lg" onClick={() => setPage("courses")}>View All Courses →</button>
        </div>
      </section>

      {/* CENTERS PREVIEW */}
      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="section-header">
          <div className="section-tag">Training Centers</div>
          <h2 className="section-title">Trusted Institutions</h2>
          <p className="section-sub">Verified centers with full profiles, transparent data, and proven track records.</p>
        </div>
        <div className="centers-grid">
          {CENTERS.map(c => <CenterCard key={c.id} center={c} setPage={setPage} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="orb" style={{ width: 400, height: 400, background: "var(--indigo)", top: -100, left: "30%", opacity: 0.06 }} />
        <div className="section-tag">Get Started</div>
        <h2 className="section-title">Ready to Build Your<br />Tech Career?</h2>
        <p className="section-sub" style={{ marginBottom: "2rem" }}>Join thousands of Sudanese students already learning on Masar.</p>
        <button className="btn btn-primary btn-lg" onClick={() => setPage("register")}>Create Free Account</button>
      </section>

      <Footer setPage={setPage} />
    </>
  );
}

export default HomePage;