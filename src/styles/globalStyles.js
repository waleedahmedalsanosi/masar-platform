/**
 * @file globalStyles.js
 * @description أنماط CSS العامة لمنصة مسار
 *
 * يحتوي هذا الملف على جميع أنماط CSS الخاصة بالمنصة كـ template literal.
 * يتم حقنها في الـ DOM عبر مكوّن App.jsx باستخدام:
 * `<style dangerouslySetInnerHTML={{ __html: styles }} />`
 *
 * الأقسام الرئيسية:
 * - متغيرات CSS (CSS Custom Properties / Design Tokens)
 * - أنماط شريط التنقل (Navbar)
 * - قسم البطل (Hero Section)
 * - بطاقات الكورسات والمدربين (Cards)
 * - لوحة التحكم (Dashboard)
 * - النوافذ المنبثقة (Modals)
 * - الاستجابة للشاشات المختلفة (Responsive / Media Queries)
 */

/** @type {string} سلسلة CSS الكاملة للمنصة */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --indigo: #6366f1;
    --indigo-dark: #4f46e5;
    --indigo-light: #818cf8;
    --cyan: #06b6d4;
    --cyan-dark: #0891b2;
    --bg: #0a0a0f;
    --bg2: #111118;
    --bg3: #1a1a2e;
    --surface: #16161f;
    --surface2: #1e1e2e;
    --border: rgba(99,102,241,0.15);
    --border2: rgba(255,255,255,0.06);
    --text: #f0f0f8;
    --text2: #a0a0b8;
    --text3: #606078;
    --gradient: linear-gradient(135deg, var(--indigo) 0%, var(--cyan) 100%);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--indigo); border-radius: 3px; }

  /* NAVBAR */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 5%;
    height: 68px;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border2);
    transition: all 0.3s;
  }
  .nav.scrolled { background: rgba(10,10,15,0.97); border-bottom-color: var(--border); }
  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 1.5rem;
    background: var(--gradient);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    cursor: pointer;
  }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    color: var(--text2); text-decoration: none; font-size: 0.9rem;
    font-weight: 500; transition: color 0.2s; cursor: pointer;
  }
  .nav-links a:hover { color: var(--text); }
  .nav-links a.active { color: var(--indigo-light); }
  .nav-actions { display: flex; gap: 0.75rem; align-items: center; }
  .btn {
    padding: 0.5rem 1.25rem; border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
    border: none; outline: none;
  }
  .btn-ghost {
    background: transparent; color: var(--text2);
    border: 1px solid var(--border2);
  }
  .btn-ghost:hover { border-color: var(--indigo); color: var(--text); }
  .btn-primary {
    background: var(--gradient); color: white;
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.35); }
  .btn-lg { padding: 0.75rem 2rem; font-size: 1rem; border-radius: 10px; }
  .nav-user {
    display: flex; align-items: center; gap: 0.5rem;
    cursor: pointer; padding: 0.3rem 0.75rem 0.3rem 0.3rem;
    border-radius: 100px; border: 1px solid var(--border2);
    transition: border-color 0.2s;
  }
  .nav-user:hover { border-color: var(--indigo); }
  .nav-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--gradient); display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.7rem; color: white;
  }
  .nav-username { font-size: 0.85rem; font-weight: 500; color: var(--text); }
  .btn-outline {
    background: transparent; color: var(--indigo-light);
    border: 1.5px solid var(--indigo);
  }
  .btn-outline:hover { background: rgba(99,102,241,0.1); }

  /* HERO */
  .hero {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 100px 5% 60px;
    text-align: center;
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%),
                radial-gradient(ellipse 60% 40% at 80% 80%, rgba(6,182,212,0.1) 0%, transparent 60%);
  }
  .hero-grid {
    position: absolute; inset: 0; z-index: 0;
    background-image: linear-gradient(var(--border2) 1px, transparent 1px),
                      linear-gradient(90deg, var(--border2) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
  }
  .hero-content { position: relative; z-index: 1; max-width: 800px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.4rem 1rem; border-radius: 100px;
    background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3);
    font-size: 0.8rem; color: var(--indigo-light); font-weight: 500;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.6s ease both;
  }
  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 800; line-height: 1.1;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.6s ease 0.1s both;
  }
  .hero h1 span {
    background: var(--gradient);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero p {
    font-size: 1.15rem; color: var(--text2); max-width: 560px;
    margin: 0 auto 2.5rem; line-height: 1.7;
    animation: fadeUp 0.6s ease 0.2s both;
  }
  .hero-actions {
    display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
    animation: fadeUp 0.6s ease 0.3s both;
  }
  .hero-stats {
    display: flex; gap: 3rem; justify-content: center; flex-wrap: wrap;
    margin-top: 5rem; padding-top: 3rem; border-top: 1px solid var(--border2);
    animation: fadeUp 0.6s ease 0.4s both;
  }
  .hero-stat { text-align: center; }
  .hero-stat-value {
    font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800;
    background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero-stat-label { font-size: 0.85rem; color: var(--text3); margin-top: 0.25rem; }

  /* SECTION */
  .section { padding: 80px 5%; }
  .section-header { text-align: center; margin-bottom: 3rem; }
  .section-tag {
    display: inline-block; font-size: 0.75rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--cyan); margin-bottom: 0.75rem;
  }
  .section-title {
    font-family: 'Syne', sans-serif; font-size: clamp(1.75rem, 3vw, 2.5rem);
    font-weight: 700; margin-bottom: 1rem;
  }
  .section-sub { color: var(--text2); font-size: 1rem; max-width: 500px; margin: 0 auto; line-height: 1.7; }

  /* FEATURES */
  .features-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5px; background: var(--border2); border-radius: 16px; overflow: hidden;
  }
  .feature-card {
    background: var(--surface); padding: 2rem;
    transition: background 0.2s;
  }
  .feature-card:hover { background: var(--surface2); }
  .feature-icon { font-size: 2rem; margin-bottom: 1rem; }
  .feature-title { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 700; margin-bottom: 0.5rem; }
  .feature-desc { color: var(--text2); font-size: 0.875rem; line-height: 1.7; }

  /* COURSES */
  .filters {
    display: flex; gap: 0.5rem; flex-wrap: wrap;
    justify-content: center; margin-bottom: 2.5rem;
  }
  .filter-btn {
    padding: 0.4rem 1rem; border-radius: 100px;
    border: 1px solid var(--border2); background: transparent;
    color: var(--text2); font-size: 0.8rem; cursor: pointer;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .filter-btn:hover { border-color: var(--indigo); color: var(--text); }
  .filter-btn.active { background: var(--indigo); border-color: var(--indigo); color: white; }
  .courses-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 1.25rem;
  }
  .course-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 14px; overflow: hidden;
    transition: all 0.25s; cursor: pointer;
  }
  .course-card:hover { transform: translateY(-4px); border-color: var(--border); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
  .course-cover {
    height: 120px; display: flex; align-items: center; justify-content: center;
    font-size: 3.5rem;
    background: linear-gradient(135deg, var(--bg3) 0%, var(--surface2) 100%);
    position: relative;
  }
  .course-level {
    position: absolute; top: 0.75rem; right: 0.75rem;
    padding: 0.2rem 0.6rem; border-radius: 100px;
    font-size: 0.7rem; font-weight: 600;
    background: rgba(0,0,0,0.5); color: var(--cyan);
    border: 1px solid rgba(6,182,212,0.3);
  }
  .course-body { padding: 1.25rem; }
  .course-meta { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }
  .course-center { font-size: 0.75rem; color: var(--indigo-light); font-weight: 500; }
  .course-title { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.4; }
  .course-instructor { font-size: 0.8rem; color: var(--text3); margin-bottom: 1rem; }
  .course-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .tag {
    padding: 0.2rem 0.6rem; border-radius: 100px;
    background: rgba(99,102,241,0.1); color: var(--indigo-light);
    font-size: 0.7rem; font-weight: 500;
  }
  .course-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 1rem; border-top: 1px solid var(--border2);
  }
  .course-price {
    font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700;
    color: var(--cyan);
  }
  .course-rating { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; }
  .stars { color: #fbbf24; }
  .course-students { font-size: 0.75rem; color: var(--text3); }

  /* INSTRUCTORS */
  .instructors-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
  }
  .instructor-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 14px; padding: 1.5rem;
    transition: all 0.25s; cursor: pointer;
  }
  .instructor-card:hover { transform: translateY(-4px); border-color: var(--border); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
  .instructor-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
  .avatar {
    width: 52px; height: 52px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.95rem;
    background: var(--gradient); color: white; flex-shrink: 0;
  }
  .instructor-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; }
  .instructor-title { font-size: 0.8rem; color: var(--indigo-light); }
  .instructor-center { font-size: 0.75rem; color: var(--text3); }
  .instructor-bio { font-size: 0.85rem; color: var(--text2); line-height: 1.6; margin-bottom: 1rem; }
  .instructor-stats { display: flex; gap: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border2); }
  .i-stat { text-align: center; }
  .i-stat-val { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; color: var(--text); }
  .i-stat-lbl { font-size: 0.7rem; color: var(--text3); }
  .specialties { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem; }

  /* CENTERS */
  .centers-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }
  .center-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; overflow: hidden;
    transition: all 0.25s; cursor: pointer;
  }
  .center-card:hover { transform: translateY(-4px); border-color: var(--border); box-shadow: 0 24px 48px rgba(0,0,0,0.5); }
  .center-header { padding: 1.75rem; position: relative; overflow: hidden; }
  .center-logo {
    width: 56px; height: 56px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem;
    color: white; margin-bottom: 1rem;
  }
  .center-name { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; margin-bottom: 0.25rem; }
  .center-tagline { font-size: 0.85rem; color: var(--text2); }
  .center-glow {
    position: absolute; top: -40px; right: -40px;
    width: 120px; height: 120px; border-radius: 50%; opacity: 0.12;
    filter: blur(30px);
  }
  .center-body { padding: 1.25rem 1.75rem; border-top: 1px solid var(--border2); }
  .center-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
  .c-stat { text-align: center; }
  .c-stat-val { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; }
  .c-stat-lbl { font-size: 0.7rem; color: var(--text3); }
  .center-specs { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
  .spec-tag {
    padding: 0.2rem 0.6rem; border-radius: 100px;
    background: rgba(6,182,212,0.1); color: var(--cyan);
    font-size: 0.7rem; font-weight: 500;
  }
  .center-meta { display: flex; justify-content: space-between; align-items: center; }
  .center-location { font-size: 0.8rem; color: var(--text3); }
  .center-rating { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; }

  /* DASHBOARD */
  .dashboard { padding: 100px 5% 60px; min-height: 100vh; }
  .dash-header { margin-bottom: 2rem; }
  .dash-welcome { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800; margin-bottom: 0.25rem; }
  .dash-sub { color: var(--text2); font-size: 0.9rem; }
  .dash-grid { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; }
  .dash-sidebar { display: flex; flex-direction: column; gap: 1.25rem; }
  .profile-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 14px; padding: 1.5rem; text-align: center;
  }
  .profile-avatar {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--gradient); display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem;
    color: white; margin: 0 auto 1rem;
  }
  .profile-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.25rem; }
  .profile-role { font-size: 0.8rem; color: var(--indigo-light); }
  .profile-spec { font-size: 0.85rem; color: var(--text2); margin-top: 0.5rem; }
  .profile-progress { margin-top: 1rem; }
  .progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.4rem; }
  .progress-bar { height: 6px; background: var(--bg3); border-radius: 100px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--gradient); border-radius: 100px; }
  .sidebar-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 14px; padding: 1.25rem;
  }
  .sidebar-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; margin-bottom: 1rem; }
  .interest-tag {
    display: inline-block; margin: 0.2rem;
    padding: 0.3rem 0.7rem; border-radius: 100px;
    background: rgba(99,102,241,0.12); color: var(--indigo-light);
    font-size: 0.75rem; font-weight: 500;
    border: 1px solid rgba(99,102,241,0.2);
  }
  .dash-main { display: flex; flex-direction: column; gap: 1.5rem; }
  .dash-section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.05rem; margin-bottom: 1rem; }
  .enrolled-card {
    display: flex; gap: 1rem; align-items: center;
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 12px; padding: 1rem;
    transition: border-color 0.2s;
  }
  .enrolled-card:hover { border-color: var(--border); }
  .enrolled-icon { font-size: 2rem; flex-shrink: 0; }
  .enrolled-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem; }
  .enrolled-instructor { font-size: 0.8rem; color: var(--text3); margin-bottom: 0.75rem; }
  .enrolled-footer { display: flex; align-items: center; gap: 1rem; }
  .enrolled-progress-text { font-size: 0.75rem; color: var(--cyan); font-weight: 600; }
  .rec-card {
    display: flex; justify-content: space-between; align-items: center;
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 12px; padding: 1rem;
    transition: border-color 0.2s; gap: 1rem;
  }
  .rec-card:hover { border-color: var(--border); }
  .rec-left { display: flex; gap: 0.75rem; align-items: center; }
  .rec-icon { font-size: 1.75rem; }
  .rec-title { font-weight: 600; font-size: 0.9rem; }
  .rec-meta { font-size: 0.75rem; color: var(--text3); }
  .rec-price { font-family: 'Syne', sans-serif; font-weight: 700; color: var(--cyan); font-size: 1rem; flex-shrink: 0; }

  /* CENTER PAGE */
  .center-page { padding: 100px 5% 60px; min-height: 100vh; }
  .center-hero {
    border-radius: 20px; padding: 3rem;
    background: var(--surface); border: 1px solid var(--border2);
    position: relative; overflow: hidden; margin-bottom: 2rem;
  }
  .center-hero-content { position: relative; z-index: 1; }
  .center-hero-glow {
    position: absolute; top: -60px; right: -60px;
    width: 250px; height: 250px; border-radius: 50%;
    opacity: 0.1; filter: blur(60px);
  }
  .big-logo {
    width: 72px; height: 72px; border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem;
    color: white; margin-bottom: 1.25rem;
  }
  .center-hero-name { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; margin-bottom: 0.4rem; }
  .center-hero-tag { font-size: 1rem; color: var(--text2); margin-bottom: 2rem; }
  .center-hero-stats { display: flex; gap: 3rem; flex-wrap: wrap; }
  .ch-stat-val { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; }
  .ch-stat-lbl { font-size: 0.8rem; color: var(--text3); }

  /* AUTH */
  .auth-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 100px 5% 60px;
  }
  .auth-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 20px; padding: 2.5rem;
    width: 100%; max-width: 420px;
  }
  .auth-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.5rem; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem; }
  .auth-title { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
  .auth-sub { color: var(--text2); font-size: 0.875rem; margin-bottom: 2rem; }
  .role-selector { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-bottom: 1.5rem; }
  .role-btn {
    padding: 0.75rem; border-radius: 10px; border: 1.5px solid var(--border2);
    background: transparent; color: var(--text2); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem; transition: all 0.2s;
    text-align: center;
  }
  .role-btn:hover { border-color: var(--indigo); color: var(--text); }
  .role-btn.selected { background: rgba(99,102,241,0.12); border-color: var(--indigo); color: var(--indigo-light); }
  .role-icon { font-size: 1.25rem; display: block; margin-bottom: 0.25rem; }
  .form-group { margin-bottom: 1rem; }
  .form-label { display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text2); }
  .form-input {
    width: 100%; padding: 0.7rem 1rem; border-radius: 8px;
    background: var(--bg); border: 1.5px solid var(--border2);
    color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--indigo); }
  .form-input::placeholder { color: var(--text3); }
  .input-error { border-color: #f87171 !important; }
  .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: var(--text2); }
  .auth-link { color: var(--indigo-light); cursor: pointer; font-weight: 500; }

  /* FOOTER */
  .footer {
    background: var(--surface); border-top: 1px solid var(--border2);
    padding: 3rem 5% 2rem;
  }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 2rem; }
  .footer-brand-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.75rem; }
  .footer-desc { color: var(--text2); font-size: 0.85rem; line-height: 1.7; max-width: 260px; }
  .footer-heading { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem; margin-bottom: 1rem; }
  .footer-links { list-style: none; }
  .footer-links li { margin-bottom: 0.6rem; }
  .footer-links a { color: var(--text2); text-decoration: none; font-size: 0.85rem; cursor: pointer; transition: color 0.2s; }
  .footer-links a:hover { color: var(--indigo-light); }
  .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid var(--border2); }
  .footer-copy { font-size: 0.8rem; color: var(--text3); }
  .footer-made { font-size: 0.8rem; color: var(--text3); }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .float { animation: float 4s ease-in-out infinite; }

  /* DIVIDER */
  .divider { height: 1px; background: var(--border2); margin: 0; }

  /* CARD ROW */
  .enrolled-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .rec-list { display: flex; flex-direction: column; gap: 0.75rem; }

  /* GLOW ORBS */
  .orb {
    position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; opacity: 0.08;
  }



  /* ===== INSTRUCTOR DASHBOARD ===== */
  .inst-dash { padding: 88px 0 0; min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); }

  /* Top bar */
  .inst-topbar { background: var(--surface); border-bottom: 1px solid var(--border2); padding: 0 5%; display: flex; align-items: center; gap: 0; }
  .inst-tab { padding: 1rem 1.25rem; font-size: 0.85rem; font-weight: 500; color: var(--text3); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 0.4rem; }
  .inst-tab:hover { color: var(--text2); }
  .inst-tab.active { color: var(--indigo-light); border-bottom-color: var(--indigo); font-weight: 600; }
  .inst-tab .tab-badge { background: var(--indigo); color: white; font-size: 0.65rem; font-weight: 700; padding: 0.1rem 0.45rem; border-radius: 100px; min-width: 16px; text-align: center; }

  /* Content wrapper */
  .inst-content { padding: 2rem 5%; flex: 1; }

  /* Page title row */
  .inst-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
  .inst-page-title { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; }
  .inst-page-sub { font-size: 0.85rem; color: var(--text2); margin-top: 0.2rem; }

  /* ── OVERVIEW ── */
  .ov-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .ov-stat-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; padding: 1.25rem; position: relative; overflow: hidden; transition: border-color 0.2s; }
  .ov-stat-card:hover { border-color: var(--border); }
  .ov-stat-icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
  .ov-stat-val { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800; margin-bottom: 0.15rem; }
  .ov-stat-lbl { font-size: 0.78rem; color: var(--text3); }
  .ov-stat-trend { font-size: 0.72rem; color: #22c55e; margin-top: 0.25rem; }
  .ov-stat-glow { position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; border-radius: 50%; opacity: 0.07; filter: blur(20px); }

  .ov-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .ov-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; overflow: hidden; }
  .ov-card-hd { padding: 1rem 1.25rem; border-bottom: 1px solid var(--border2); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; }
  .ov-card-bd { padding: 0.75rem 1.25rem; }
  .ov-see-all { font-size: 0.75rem; color: var(--indigo-light); cursor: pointer; font-weight: 500; }
  .ov-course-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border2); }
  .ov-course-row:last-child { border-bottom: none; }
  .ov-course-icon { font-size: 1.4rem; }
  .ov-course-name { font-size: 0.85rem; font-weight: 600; flex: 1; }
  .ov-course-students { font-size: 0.75rem; color: var(--text3); }
  .ov-course-status { font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.55rem; border-radius: 100px; }
  .status-active { background: rgba(34,197,94,0.1); color: #22c55e; }
  .status-draft { background: rgba(251,191,36,0.1); color: #fbbf24; }
  .ov-req-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border2); }
  .ov-req-row:last-child { border-bottom: none; }
  .ov-req-avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--gradient); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.65rem; color: white; flex-shrink: 0; }
  .ov-req-name { font-size: 0.82rem; font-weight: 600; }
  .ov-req-course { font-size: 0.72rem; color: var(--text3); }
  .ov-req-time { font-size: 0.72rem; color: var(--text3); margin-left: auto; white-space: nowrap; }
  .ov-req-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--cyan); flex-shrink: 0; }

  /* ── COURSES MANAGEMENT ── */
  .courses-mgmt { display: flex; flex-direction: column; gap: 1rem; }
  .mgmt-course-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; padding: 1.25rem; display: flex; align-items: center; gap: 1.25rem; transition: border-color 0.2s; }
  .mgmt-course-card:hover { border-color: var(--border); }
  .mgmt-course-emoji { font-size: 2.25rem; flex-shrink: 0; }
  .mgmt-course-info { flex: 1; }
  .mgmt-course-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; margin-bottom: 0.3rem; }
  .mgmt-course-meta { font-size: 0.78rem; color: var(--text3); margin-bottom: 0.6rem; display: flex; gap: 1rem; flex-wrap: wrap; }
  .mgmt-course-stats { display: flex; gap: 1.5rem; }
  .mgmt-stat { text-align: center; }
  .mgmt-stat-val { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; }
  .mgmt-stat-lbl { font-size: 0.68rem; color: var(--text3); }
  .mgmt-actions { display: flex; gap: 0.5rem; align-items: center; }
  .mgmt-btn { padding: 0.4rem 0.875rem; border-radius: 7px; font-size: 0.78rem; font-weight: 600; cursor: pointer; border: 1px solid; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .mgmt-btn-edit { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: var(--indigo-light); }
  .mgmt-btn-edit:hover { background: rgba(99,102,241,0.2); }
  .mgmt-btn-view { background: transparent; border-color: var(--border2); color: var(--text2); }
  .mgmt-btn-view:hover { border-color: var(--text2); }

  /* ── ADD COURSE MODAL ── */
  .add-course-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.2s ease; }
  .add-course-modal { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; width: 100%; max-width: 580px; max-height: 92vh; overflow-y: auto; animation: slideUp 0.3s ease; }
  .acm-header { padding: 1.5rem; border-bottom: 1px solid var(--border2); display: flex; justify-content: space-between; align-items: flex-start; }
  .acm-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.15rem; }
  .acm-sub { font-size: 0.8rem; color: var(--text2); margin-top: 0.2rem; }
  .acm-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .acm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }
  .acm-section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; color: var(--indigo-light); margin: 0.5rem 0 0; padding-top: 0.75rem; border-top: 1px solid var(--border2); }
  .acm-select { width: 100%; padding: 0.7rem 1rem; border-radius: 8px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.875rem; outline: none; transition: border-color 0.2s; appearance: none; cursor: pointer; }
  .acm-select:focus { border-color: var(--indigo); }
  .acm-textarea { width: 100%; padding: 0.7rem 1rem; border-radius: 8px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.875rem; outline: none; transition: border-color 0.2s; resize: none; line-height: 1.6; }
  .acm-textarea:focus { border-color: var(--indigo); }
  .acm-footer { padding: 1.25rem 1.5rem; border-top: 1px solid var(--border2); display: flex; gap: 0.75rem; justify-content: flex-end; }

  /* ── REQUESTS ── */
  .requests-list { display: flex; flex-direction: column; gap: 0.875rem; }
  .req-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; padding: 1.25rem; display: flex; align-items: center; gap: 1.25rem; transition: border-color 0.2s; }
  .req-card:hover { border-color: var(--border); }
  .req-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--gradient); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.9rem; color: white; flex-shrink: 0; }
  .req-info { flex: 1; }
  .req-name { font-weight: 700; font-size: 0.92rem; margin-bottom: 0.2rem; }
  .req-course-name { font-size: 0.8rem; color: var(--indigo-light); margin-bottom: 0.2rem; }
  .req-details { font-size: 0.75rem; color: var(--text3); }
  .req-time { font-size: 0.75rem; color: var(--text3); white-space: nowrap; }
  .req-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
  .req-btn-accept { padding: 0.45rem 1rem; border-radius: 8px; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; font-size: 0.8rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .req-btn-accept:hover { background: rgba(34,197,94,0.22); }
  .req-btn-reject { padding: 0.45rem 1rem; border-radius: 8px; background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); color: #f87171; font-size: 0.8rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .req-btn-reject:hover { background: rgba(248,113,113,0.18); }
  .req-status { font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.7rem; border-radius: 100px; }
  .req-status.accepted { background: rgba(34,197,94,0.1); color: #22c55e; }
  .req-status.rejected { background: rgba(248,113,113,0.1); color: #f87171; }
  .req-status.pending { background: rgba(251,191,36,0.1); color: #fbbf24; }
  .req-payment-badge { font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 4px; background: rgba(6,182,212,0.1); color: var(--cyan); font-weight: 500; }

  /* ── INSTRUCTOR Q&A ── */
  .iqa-list { display: flex; flex-direction: column; gap: 0.875rem; }
  .iqa-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; padding: 1.25rem; transition: border-color 0.2s; }
  .iqa-card:hover { border-color: var(--border); }
  .iqa-card.answered { border-left: 3px solid var(--indigo); }
  .iqa-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.875rem; }
  .iqa-from { font-size: 0.78rem; color: var(--text3); }
  .iqa-course-tag { font-size: 0.72rem; background: rgba(99,102,241,0.1); color: var(--indigo-light); padding: 0.15rem 0.5rem; border-radius: 4px; margin-left: 0.4rem; }
  .iqa-time { font-size: 0.72rem; color: var(--text3); margin-left: auto; white-space: nowrap; }
  .iqa-question { font-size: 0.9rem; font-weight: 500; color: var(--text); line-height: 1.6; margin-bottom: 0.875rem; }
  .iqa-reply-area { background: var(--bg3); border-radius: 10px; padding: 0.875rem; }
  .iqa-reply-label { font-size: 0.75rem; font-weight: 600; color: var(--indigo-light); margin-bottom: 0.5rem; }
  .iqa-answer-text { font-size: 0.85rem; color: var(--text2); line-height: 1.6; }
  .iqa-reply-input { width: 100%; padding: 0.7rem 0.875rem; border-radius: 8px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.85rem; outline: none; resize: none; transition: border-color 0.2s; line-height: 1.6; }
  .iqa-reply-input:focus { border-color: var(--indigo); }
  .iqa-reply-footer { display: flex; justify-content: flex-end; margin-top: 0.6rem; }

  /* ── PROFILE EDIT ── */
  .inst-profile-grid { display: grid; grid-template-columns: 240px 1fr; gap: 1.5rem; align-items: start; }
  .inst-profile-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; padding: 1.5rem; text-align: center; }
  .inst-profile-avatar-wrap { position: relative; display: inline-block; margin-bottom: 1rem; }
  .inst-profile-avatar-large { width: 88px; height: 88px; border-radius: 50%; background: var(--gradient); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.5rem; color: white; }
  .inst-profile-form { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .form-section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; color: var(--indigo-light); padding-bottom: 0.5rem; border-bottom: 1px solid var(--border2); margin-bottom: 0.25rem; }

  @media (max-width: 900px) {
    .ov-stats { grid-template-columns: repeat(2, 1fr); }
    .ov-grid { grid-template-columns: 1fr; }
    .inst-profile-grid { grid-template-columns: 1fr; }
  }

  /* COURSE DETAIL */
  .course-detail { padding: 90px 5% 60px; min-height: 100vh; }
  .cd-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
  .cd-main { display: flex; flex-direction: column; gap: 1.5rem; }
  .cd-hero { background: var(--surface); border: 1px solid var(--border2); border-radius: 16px; overflow: hidden; }
  .cd-video-wrap { width: 100%; aspect-ratio: 16/9; background: #000; position: relative; }
  .cd-video-wrap iframe { width: 100%; height: 100%; border: none; }
  .cd-video-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; background: linear-gradient(135deg, var(--bg3) 0%, var(--surface2) 100%); cursor: pointer; }
  .cd-video-placeholder:hover .play-btn { transform: scale(1.1); }
  .play-btn { width: 72px; height: 72px; border-radius: 50%; background: var(--gradient); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; transition: transform 0.2s; box-shadow: 0 8px 32px rgba(99,102,241,0.4); }
  .cd-video-label { font-size: 0.9rem; color: var(--text2); }
  .cd-info { padding: 1.5rem; }
  .cd-badge-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
  .cd-cat { font-size: 0.75rem; color: var(--cyan); font-weight: 600; }
  .cd-title { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; margin-bottom: 0.75rem; line-height: 1.3; }
  .cd-meta-row { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .cd-meta-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: var(--text2); }
  .cd-about { font-size: 0.9rem; color: var(--text2); line-height: 1.75; }
  .cd-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; overflow: hidden; }
  .cd-card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border2); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem; }
  .cd-card-body { padding: 1.25rem 1.5rem; }
  .week-item { display: flex; gap: 1rem; padding: 0.9rem 0; border-bottom: 1px solid var(--border2); }
  .week-item:last-child { border-bottom: none; }
  .week-num { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; background: rgba(99,102,241,0.12); color: var(--indigo-light); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.8rem; }
  .week-content { flex: 1; }
  .week-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.3rem; }
  .week-topics { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .week-topic { font-size: 0.72rem; color: var(--text3); padding: 0.15rem 0.5rem; background: var(--bg3); border-radius: 4px; }
  .schedule-item { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: 1px solid var(--border2); }
  .schedule-item:last-child { border-bottom: none; }
  .sched-day { font-weight: 600; font-size: 0.9rem; }
  .sched-time { font-size: 0.85rem; color: var(--text2); }
  .sched-type { font-size: 0.75rem; color: var(--cyan); background: rgba(6,182,212,0.1); padding: 0.2rem 0.6rem; border-radius: 100px; }
  .review-summary { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border2); }
  .review-big-rating { font-family: 'Syne', sans-serif; font-size: 3.5rem; font-weight: 800; color: var(--text); line-height: 1; }
  .review-stars-row { display: flex; flex-direction: column; gap: 0.25rem; }
  .review-stars-big { font-size: 1.3rem; color: #fbbf24; }
  .review-count { font-size: 0.8rem; color: var(--text3); }
  .review-item { padding: 1rem 0; border-bottom: 1px solid var(--border2); }
  .review-item:last-child { border-bottom: none; }
  .review-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem; }
  .review-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--gradient); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.7rem; color: white; flex-shrink: 0; }
  .review-name { font-weight: 600; font-size: 0.9rem; }
  .review-date { font-size: 0.75rem; color: var(--text3); }
  .review-text { font-size: 0.85rem; color: var(--text2); line-height: 1.65; }
  .enroll-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 16px; padding: 1.5rem; }
  .enroll-price { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: var(--cyan); margin-bottom: 0.25rem; }
  .enroll-deadline { font-size: 0.8rem; color: #f87171; margin-bottom: 1.25rem; }
  .enroll-btn { width: 100%; padding: 0.9rem; font-size: 1rem; border-radius: 10px; margin-bottom: 1rem; }
  .enroll-details { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.25rem; }
  .enroll-detail-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; color: var(--text2); }
  .enroll-detail-icon { font-size: 1.1rem; flex-shrink: 0; }
  .enroll-divider { height: 1px; background: var(--border2); margin: 1rem 0; }
  .mini-instructor { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; padding: 1.25rem; cursor: pointer; transition: border-color 0.2s, transform 0.2s; }
  .mini-instructor:hover { border-color: var(--indigo); transform: translateY(-2px); }
  .mini-inst-header { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem; }
  .mini-inst-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem; }
  .mini-inst-title { font-size: 0.8rem; color: var(--indigo-light); }
  .mini-inst-bio { font-size: 0.82rem; color: var(--text2); line-height: 1.6; margin-bottom: 0.75rem; }
  .mini-inst-link { font-size: 0.8rem; color: var(--cyan); font-weight: 500; }
  .mini-center { display: flex; align-items: center; gap: 0.75rem; background: var(--surface); border: 1px solid var(--border2); border-radius: 12px; padding: 1rem; cursor: pointer; transition: border-color 0.2s, transform 0.2s; margin-top: 0.75rem; }
  .mini-center:hover { border-color: var(--cyan); transform: translateY(-2px); }
  .mini-center-logo { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.85rem; color: white; flex-shrink: 0; }
  .mini-center-name { font-weight: 600; font-size: 0.9rem; }
  .mini-center-meta { font-size: 0.75rem; color: var(--text3); }
  .mini-center-arrow { margin-left: auto; color: var(--text3); }
  /* INSTRUCTOR PROFILE */
  .instructor-page { padding: 90px 5% 60px; min-height: 100vh; }
  .ip-layout { display: grid; grid-template-columns: 300px 1fr; gap: 2rem; align-items: start; }
  .ip-sidebar { display: flex; flex-direction: column; gap: 1.25rem; position: sticky; top: 88px; }
  .ip-profile-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 16px; padding: 2rem; text-align: center; }
  .ip-avatar { width: 88px; height: 88px; border-radius: 50%; background: var(--gradient); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.5rem; color: white; margin: 0 auto 1rem; }
  .ip-name { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; margin-bottom: 0.25rem; }
  .ip-title { font-size: 0.9rem; color: var(--indigo-light); margin-bottom: 0.5rem; }
  .ip-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--border2); }
  .ip-stat-val { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; }
  .ip-stat-lbl { font-size: 0.7rem; color: var(--text3); }
  .ip-links { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--border2); }
  .ip-link { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text2); padding: 0.5rem 0.75rem; border-radius: 8px; background: var(--bg); }
  .ip-main { display: flex; flex-direction: column; gap: 1.5rem; }
  .ip-section { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; padding: 1.5rem; }
  .ip-section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; margin-bottom: 1rem; }
  .ip-bio { font-size: 0.9rem; color: var(--text2); line-height: 1.8; }
  .achievement-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border2); font-size: 0.875rem; }
  .achievement-item:last-child { border-bottom: none; }
  .achievement-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gradient); flex-shrink: 0; }
  .back-btn { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text2); font-size: 0.85rem; cursor: pointer; margin-bottom: 1.5rem; transition: color 0.2s; }
  .back-btn:hover { color: var(--indigo-light); }
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .dash-grid { grid-template-columns: 1fr; }
    .hero-stats { gap: 1.5rem; }
  }
`;

export default styles;
