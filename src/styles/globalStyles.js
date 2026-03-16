/**
 * @file globalStyles.js
 * @description أنماط CSS العامة لمنصة مسار — تصميم سوداني أصيل
 *
 * الألوان: أخضر السودان + ذهبي نوبي
 * الخط: Cairo (يدعم العربي والإنجليزي)
 * الأنماط: هندسة إسلامية في الخلفيات
 */

/** @type {string} سلسلة CSS الكاملة للمنصة */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* ── ألوان السودان ── */
    --indigo: #22C55E;
    --indigo-dark: #16A34A;
    --indigo-light: #86EFAC;
    --cyan: #FBBF24;
    --cyan-dark: #F59E0B;

    /* ── خلفيات دافئة ── */
    --bg: #060D09;
    --bg2: #0C1710;
    --bg3: #121E15;
    --surface: #15211A;
    --surface2: #1C2D22;
    --border: rgba(34,197,94,0.18);
    --border2: rgba(255,255,255,0.07);
    --text: #EEF8F2;
    --text2: #90B89E;
    --text3: #4E7060;

    /* ── تدرج السودان (أخضر → ذهبي) ── */
    --gradient: linear-gradient(135deg, var(--indigo) 0%, var(--cyan) 100%);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Cairo', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--indigo-dark); border-radius: 3px; }

  /* NAVBAR */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 5%;
    height: 68px;
    background: rgba(6,13,9,0.88);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(34,197,94,0.1);
    transition: all 0.3s;
  }
  .nav.scrolled {
    background: rgba(6,13,9,0.97);
    border-bottom-color: rgba(34,197,94,0.2);
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  }
  .nav-logo {
    font-family: 'Cairo', sans-serif;
    font-weight: 900; font-size: 1.5rem;
    background: var(--gradient);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    cursor: pointer; letter-spacing: -0.5px;
  }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    color: var(--text2); text-decoration: none; font-size: 0.9rem;
    font-weight: 600; transition: color 0.2s; cursor: pointer;
  }
  .nav-links a:hover { color: var(--text); }
  .nav-links a.active { color: var(--indigo-light); }
  .nav-actions { display: flex; gap: 0.75rem; align-items: center; }

  .btn {
    padding: 0.5rem 1.25rem; border-radius: 10px;
    font-family: 'Cairo', sans-serif;
    font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
    border: none; outline: none; letter-spacing: 0.01em;
  }
  .btn-ghost {
    background: transparent; color: var(--text2);
    border: 1px solid var(--border2);
  }
  .btn-ghost:hover { border-color: var(--indigo); color: var(--text); }
  .btn-primary {
    background: var(--gradient); color: white;
  }
  .btn-primary:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(34,197,94,0.3);
  }
  .btn-lg { padding: 0.8rem 2rem; font-size: 1rem; border-radius: 12px; }
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
    font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 0.7rem; color: white;
  }
  .nav-username { font-size: 0.85rem; font-weight: 600; color: var(--text); }
  .btn-outline {
    background: transparent; color: var(--indigo-light);
    border: 1.5px solid var(--indigo-dark);
  }
  .btn-outline:hover { background: rgba(34,197,94,0.1); }

  /* HERO */
  .hero {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 100px 5% 60px;
    text-align: center;
  }

  /* خلفية دافئة من أخضر النيل */
  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse 90% 65% at 50% -10%, rgba(34,197,94,0.22) 0%, transparent 65%),
      radial-gradient(ellipse 50% 35% at 15% 90%, rgba(251,191,36,0.08) 0%, transparent 55%),
      radial-gradient(ellipse 50% 35% at 85% 80%, rgba(34,197,94,0.07) 0%, transparent 55%);
  }

  /* نمط هندسي إسلامي (معيّن/ألماس) */
  .hero-grid {
    position: absolute; inset: 0; z-index: 0;
    background-image:
      repeating-linear-gradient(
        45deg,
        rgba(34,197,94,0.055) 0px, rgba(34,197,94,0.055) 1px,
        transparent 1px, transparent 32px
      ),
      repeating-linear-gradient(
        135deg,
        rgba(34,197,94,0.055) 0px, rgba(34,197,94,0.055) 1px,
        transparent 1px, transparent 32px
      );
    mask-image: radial-gradient(ellipse 85% 85% at 50% 30%, black 25%, transparent 78%);
  }

  .hero-content { position: relative; z-index: 1; max-width: 820px; }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.45rem 1.1rem; border-radius: 100px;
    background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.35);
    font-size: 0.82rem; color: var(--indigo-light); font-weight: 700;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.6s ease both;
    letter-spacing: 0.02em;
  }

  .hero h1 {
    font-family: 'Cairo', sans-serif;
    font-size: clamp(2.4rem, 5.5vw, 4.2rem);
    font-weight: 900; line-height: 1.15;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.6s ease 0.1s both;
    letter-spacing: -0.5px;
  }
  .hero h1 span {
    background: var(--gradient);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero p {
    font-size: 1.1rem; color: var(--text2); max-width: 540px;
    margin: 0 auto 2.5rem; line-height: 1.8; font-weight: 500;
    animation: fadeUp 0.6s ease 0.2s both;
  }
  .hero-actions {
    display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
    animation: fadeUp 0.6s ease 0.3s both;
  }
  .hero-stats {
    display: flex; gap: 3rem; justify-content: center; flex-wrap: wrap;
    margin-top: 5rem; padding-top: 3rem; border-top: 1px solid rgba(34,197,94,0.12);
    animation: fadeUp 0.6s ease 0.4s both;
  }
  .hero-stat { text-align: center; }
  .hero-stat-value {
    font-family: 'Cairo', sans-serif; font-size: 2rem; font-weight: 900;
    background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero-stat-label { font-size: 0.82rem; color: var(--text3); margin-top: 0.25rem; font-weight: 600; }

  /* SECTION */
  .section { padding: 80px 5%; }
  .section-header { text-align: center; margin-bottom: 3rem; }
  .section-tag {
    display: inline-block; font-size: 0.75rem; font-weight: 800;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--indigo); margin-bottom: 0.75rem;
  }
  .section-title {
    font-family: 'Cairo', sans-serif; font-size: clamp(1.75rem, 3vw, 2.5rem);
    font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.3px;
  }
  .section-sub { color: var(--text2); font-size: 1rem; max-width: 500px; margin: 0 auto; line-height: 1.8; font-weight: 500; }

  /* FEATURES */
  .features-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5px; background: rgba(34,197,94,0.08); border-radius: 20px; overflow: hidden;
  }
  .feature-card {
    background: var(--surface); padding: 2rem;
    transition: background 0.25s;
  }
  .feature-card:hover { background: var(--surface2); }
  .feature-icon { font-size: 2rem; margin-bottom: 1rem; }
  .feature-title { font-family: 'Cairo', sans-serif; font-size: 1.05rem; font-weight: 800; margin-bottom: 0.5rem; }
  .feature-desc { color: var(--text2); font-size: 0.88rem; line-height: 1.75; font-weight: 500; }

  /* COURSES */
  .filters {
    display: flex; gap: 0.5rem; flex-wrap: wrap;
    justify-content: center; margin-bottom: 2.5rem;
  }
  .filter-btn {
    padding: 0.45rem 1.1rem; border-radius: 100px;
    border: 1.5px solid var(--border2); background: transparent;
    color: var(--text2); font-size: 0.82rem; cursor: pointer;
    transition: all 0.2s; font-family: 'Cairo', sans-serif; font-weight: 600;
  }
  .filter-btn:hover { border-color: var(--indigo); color: var(--text); }
  .filter-btn.active { background: var(--indigo); border-color: var(--indigo); color: white; }
  .courses-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 1.25rem;
  }
  .course-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; overflow: hidden;
    transition: all 0.25s; cursor: pointer;
  }
  .course-card:hover {
    transform: translateY(-5px);
    border-color: rgba(34,197,94,0.25);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,197,94,0.08);
  }
  .course-cover {
    height: 120px; display: flex; align-items: center; justify-content: center;
    font-size: 3.5rem;
    background: linear-gradient(135deg, var(--bg3) 0%, var(--surface2) 100%);
    position: relative;
  }
  .course-level {
    position: absolute; top: 0.75rem; right: 0.75rem;
    padding: 0.2rem 0.6rem; border-radius: 100px;
    font-size: 0.7rem; font-weight: 700;
    background: rgba(0,0,0,0.5); color: var(--cyan);
    border: 1px solid rgba(251,191,36,0.3);
    font-family: 'Cairo', sans-serif;
  }
  .course-body { padding: 1.25rem; }
  .course-meta { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }
  .course-center { font-size: 0.75rem; color: var(--indigo-light); font-weight: 700; }
  .course-title { font-family: 'Cairo', sans-serif; font-size: 0.97rem; font-weight: 800; margin-bottom: 0.5rem; line-height: 1.45; }
  .course-instructor { font-size: 0.82rem; color: var(--text3); margin-bottom: 1rem; font-weight: 500; }
  .course-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .tag {
    padding: 0.2rem 0.65rem; border-radius: 100px;
    background: rgba(34,197,94,0.1); color: var(--indigo-light);
    font-size: 0.7rem; font-weight: 700; font-family: 'Cairo', sans-serif;
  }
  .course-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 1rem; border-top: 1px solid var(--border2);
  }
  .course-price {
    font-family: 'Cairo', sans-serif; font-size: 1.1rem; font-weight: 900;
    color: var(--cyan);
  }
  .course-rating { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; }
  .stars { color: #FBBF24; }
  .course-students { font-size: 0.75rem; color: var(--text3); font-weight: 500; }

  /* INSTRUCTORS */
  .instructors-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
  }
  .instructor-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; padding: 1.5rem;
    transition: all 0.25s; cursor: pointer;
  }
  .instructor-card:hover {
    transform: translateY(-4px);
    border-color: rgba(34,197,94,0.25);
    box-shadow: 0 20px 40px rgba(0,0,0,0.45);
  }
  .instructor-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
  .avatar {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cairo', sans-serif; font-weight: 900; font-size: 1rem;
    background: var(--gradient); color: white; flex-shrink: 0;
  }
  .instructor-name { font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 1rem; }
  .instructor-title { font-size: 0.82rem; color: var(--indigo-light); font-weight: 600; }
  .instructor-center { font-size: 0.75rem; color: var(--text3); font-weight: 500; }
  .instructor-bio { font-size: 0.87rem; color: var(--text2); line-height: 1.7; margin-bottom: 1rem; font-weight: 500; }
  .instructor-stats { display: flex; gap: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border2); }
  .i-stat { text-align: center; }
  .i-stat-val { font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 1rem; color: var(--text); }
  .i-stat-lbl { font-size: 0.7rem; color: var(--text3); font-weight: 600; }
  .specialties { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem; }

  /* CENTERS */
  .centers-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }
  .center-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 18px; overflow: hidden;
    transition: all 0.25s; cursor: pointer;
  }
  .center-card:hover {
    transform: translateY(-5px);
    border-color: rgba(34,197,94,0.25);
    box-shadow: 0 24px 48px rgba(0,0,0,0.5);
  }
  .center-header { padding: 1.75rem; position: relative; overflow: hidden; }
  .center-logo {
    width: 56px; height: 56px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cairo', sans-serif; font-weight: 900; font-size: 1rem;
    color: white; margin-bottom: 1rem;
  }
  .center-name { font-family: 'Cairo', sans-serif; font-size: 1.2rem; font-weight: 900; margin-bottom: 0.25rem; }
  .center-tagline { font-size: 0.87rem; color: var(--text2); font-weight: 500; }
  .center-glow {
    position: absolute; top: -40px; right: -40px;
    width: 120px; height: 120px; border-radius: 50%; opacity: 0.14;
    filter: blur(30px);
  }
  .center-body { padding: 1.25rem 1.75rem; border-top: 1px solid var(--border2); }
  .center-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
  .c-stat { text-align: center; }
  .c-stat-val { font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 1.1rem; }
  .c-stat-lbl { font-size: 0.7rem; color: var(--text3); font-weight: 600; }
  .center-specs { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
  .spec-tag {
    padding: 0.2rem 0.65rem; border-radius: 100px;
    background: rgba(251,191,36,0.1); color: var(--cyan);
    font-size: 0.7rem; font-weight: 700; font-family: 'Cairo', sans-serif;
  }
  .center-meta { display: flex; justify-content: space-between; align-items: center; }
  .center-location { font-size: 0.82rem; color: var(--text3); font-weight: 500; }
  .center-rating { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; }

  /* DASHBOARD */
  .dashboard { padding: 100px 5% 60px; min-height: 100vh; }
  .dash-header { margin-bottom: 2rem; }
  .dash-welcome { font-family: 'Cairo', sans-serif; font-size: 1.75rem; font-weight: 900; margin-bottom: 0.25rem; }
  .dash-sub { color: var(--text2); font-size: 0.9rem; font-weight: 500; }
  .dash-grid { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; }
  .dash-sidebar { display: flex; flex-direction: column; gap: 1.25rem; }
  .profile-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; padding: 1.5rem; text-align: center;
  }
  .profile-avatar {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--gradient); display: flex; align-items: center; justify-content: center;
    font-family: 'Cairo', sans-serif; font-weight: 900; font-size: 1.4rem;
    color: white; margin: 0 auto 1rem;
  }
  .profile-name { font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 1.1rem; margin-bottom: 0.25rem; }
  .profile-role { font-size: 0.82rem; color: var(--indigo-light); font-weight: 700; }
  .profile-spec { font-size: 0.87rem; color: var(--text2); margin-top: 0.5rem; font-weight: 500; }
  .profile-progress { margin-top: 1rem; }
  .progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.4rem; font-weight: 600; }
  .progress-bar { height: 6px; background: var(--bg3); border-radius: 100px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--gradient); border-radius: 100px; }
  .sidebar-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; padding: 1.25rem;
  }
  .sidebar-title { font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 0.95rem; margin-bottom: 1rem; }
  .interest-tag {
    display: inline-block; margin: 0.2rem;
    padding: 0.3rem 0.7rem; border-radius: 100px;
    background: rgba(34,197,94,0.1); color: var(--indigo-light);
    font-size: 0.75rem; font-weight: 700;
    border: 1px solid rgba(34,197,94,0.2);
    font-family: 'Cairo', sans-serif;
  }
  .dash-main { display: flex; flex-direction: column; gap: 1.5rem; }
  .dash-section-title { font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 1.05rem; margin-bottom: 1rem; }
  .enrolled-card {
    display: flex; gap: 1rem; align-items: center;
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 14px; padding: 1rem;
    transition: border-color 0.2s;
  }
  .enrolled-card:hover { border-color: rgba(34,197,94,0.25); }
  .enrolled-icon { font-size: 2rem; flex-shrink: 0; }
  .enrolled-title { font-weight: 700; font-size: 0.9rem; margin-bottom: 0.25rem; }
  .enrolled-instructor { font-size: 0.8rem; color: var(--text3); margin-bottom: 0.75rem; font-weight: 500; }
  .enrolled-footer { display: flex; align-items: center; gap: 1rem; }
  .enrolled-progress-text { font-size: 0.75rem; color: var(--cyan); font-weight: 700; }
  .rec-card {
    display: flex; justify-content: space-between; align-items: center;
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 14px; padding: 1rem;
    transition: border-color 0.2s; gap: 1rem;
  }
  .rec-card:hover { border-color: rgba(34,197,94,0.25); }
  .rec-left { display: flex; gap: 0.75rem; align-items: center; }
  .rec-icon { font-size: 1.75rem; }
  .rec-title { font-weight: 700; font-size: 0.9rem; }
  .rec-meta { font-size: 0.75rem; color: var(--text3); font-weight: 500; }
  .rec-price { font-family: 'Cairo', sans-serif; font-weight: 900; color: var(--cyan); font-size: 1rem; flex-shrink: 0; }

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
    font-family: 'Cairo', sans-serif; font-weight: 900; font-size: 1.4rem;
    color: white; margin-bottom: 1.25rem;
  }
  .center-hero-name { font-family: 'Cairo', sans-serif; font-size: 2rem; font-weight: 900; margin-bottom: 0.4rem; }
  .center-hero-tag { font-size: 1rem; color: var(--text2); margin-bottom: 2rem; font-weight: 500; }
  .center-hero-stats { display: flex; gap: 3rem; flex-wrap: wrap; }
  .ch-stat-val { font-family: 'Cairo', sans-serif; font-size: 1.5rem; font-weight: 900; }
  .ch-stat-lbl { font-size: 0.82rem; color: var(--text3); font-weight: 600; }

  /* AUTH */
  .auth-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 100px 5% 60px;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,197,94,0.12) 0%, transparent 60%);
  }
  .auth-card {
    background: var(--surface); border: 1px solid rgba(34,197,94,0.15);
    border-radius: 22px; padding: 2.5rem;
    width: 100%; max-width: 430px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.4);
  }
  .auth-logo {
    font-family: 'Cairo', sans-serif; font-weight: 900; font-size: 1.6rem;
    background: var(--gradient);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }
  .auth-title { font-family: 'Cairo', sans-serif; font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
  .auth-sub { color: var(--text2); font-size: 0.9rem; margin-bottom: 2rem; font-weight: 500; }
  .role-selector { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.6rem; margin-bottom: 1.5rem; }
  .role-btn {
    padding: 0.8rem; border-radius: 12px; border: 1.5px solid var(--border2);
    background: transparent; color: var(--text2); cursor: pointer;
    font-family: 'Cairo', sans-serif; font-size: 0.82rem; font-weight: 600;
    transition: all 0.2s; text-align: center;
  }
  .role-btn:hover { border-color: var(--indigo); color: var(--text); }
  .role-btn.selected {
    background: rgba(34,197,94,0.1);
    border-color: var(--indigo);
    color: var(--indigo-light);
  }
  .role-icon { font-size: 1.25rem; display: block; margin-bottom: 0.3rem; }
  .form-group { margin-bottom: 1rem; }
  .form-label { display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.4rem; color: var(--text2); }
  .form-input {
    width: 100%; padding: 0.75rem 1rem; border-radius: 10px;
    background: var(--bg); border: 1.5px solid var(--border2);
    color: var(--text); font-family: 'Cairo', sans-serif; font-size: 0.92rem; font-weight: 500;
    outline: none; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px rgba(34,197,94,0.1); }
  .form-input::placeholder { color: var(--text3); }
  .input-error { border-color: #f87171 !important; }
  .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.87rem; color: var(--text2); font-weight: 500; }
  .auth-link { color: var(--indigo-light); cursor: pointer; font-weight: 700; }

  /* FOOTER */
  .footer {
    background: var(--surface); border-top: 1px solid var(--border2);
    padding: 3rem 5% 2rem;
  }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 2rem; }
  .footer-brand-name {
    font-family: 'Cairo', sans-serif; font-weight: 900; font-size: 1.4rem;
    background: var(--gradient);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 0.75rem;
  }
  .footer-desc { color: var(--text2); font-size: 0.87rem; line-height: 1.75; max-width: 260px; font-weight: 500; }
  .footer-heading { font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 0.9rem; margin-bottom: 1rem; }
  .footer-links { list-style: none; }
  .footer-links li { margin-bottom: 0.6rem; }
  .footer-links a { color: var(--text2); text-decoration: none; font-size: 0.87rem; cursor: pointer; transition: color 0.2s; font-weight: 500; }
  .footer-links a:hover { color: var(--indigo-light); }
  .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid var(--border2); }
  .footer-copy { font-size: 0.82rem; color: var(--text3); font-weight: 500; }
  .footer-made { font-size: 0.82rem; color: var(--text3); font-weight: 500; }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .float { animation: float 4s ease-in-out infinite; }

  /* DIVIDER */
  .divider { height: 1px; background: var(--border2); margin: 0; }

  /* CARD ROW */
  .enrolled-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .rec-list { display: flex; flex-direction: column; gap: 0.75rem; }

  /* GLOW ORBS */
  .orb {
    position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; opacity: 0.07;
  }

  /* ===== INSTRUCTOR DASHBOARD ===== */
  .inst-dash { padding: 88px 0 0; min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); }

  /* Top bar */
  .inst-topbar {
    background: var(--surface); border-bottom: 1px solid var(--border2);
    padding: 0 5%; display: flex; align-items: center; gap: 0;
    overflow-x: auto;
  }
  .inst-tab {
    padding: 1rem 1.25rem; font-size: 0.87rem; font-weight: 600; color: var(--text3);
    cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s;
    white-space: nowrap; display: flex; align-items: center; gap: 0.4rem;
    font-family: 'Cairo', sans-serif;
  }
  .inst-tab:hover { color: var(--text2); }
  .inst-tab.active { color: var(--indigo-light); border-bottom-color: var(--indigo); font-weight: 700; }
  .inst-tab .tab-badge {
    background: var(--indigo); color: white;
    font-size: 0.65rem; font-weight: 800; padding: 0.1rem 0.45rem;
    border-radius: 100px; min-width: 16px; text-align: center;
  }

  /* Content wrapper */
  .inst-content { padding: 2rem 5%; flex: 1; }

  /* Page title row */
  .inst-page-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem;
  }
  .inst-page-title { font-family: 'Cairo', sans-serif; font-size: 1.5rem; font-weight: 900; }
  .inst-page-sub { font-size: 0.87rem; color: var(--text2); margin-top: 0.2rem; font-weight: 500; }

  /* ── OVERVIEW ── */
  .ov-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .ov-stat-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; padding: 1.25rem; position: relative; overflow: hidden;
    transition: border-color 0.2s;
  }
  .ov-stat-card:hover { border-color: rgba(34,197,94,0.25); }
  .ov-stat-icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
  .ov-stat-val { font-family: 'Cairo', sans-serif; font-size: 1.75rem; font-weight: 900; margin-bottom: 0.15rem; }
  .ov-stat-lbl { font-size: 0.78rem; color: var(--text3); font-weight: 600; }
  .ov-stat-trend { font-size: 0.72rem; color: #22C55E; margin-top: 0.25rem; font-weight: 600; }
  .ov-stat-glow {
    position: absolute; top: -20px; right: -20px;
    width: 80px; height: 80px; border-radius: 50%; opacity: 0.08; filter: blur(20px);
  }

  .ov-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .ov-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 16px; overflow: hidden; }
  .ov-card-hd {
    padding: 1rem 1.25rem; border-bottom: 1px solid var(--border2);
    font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 0.9rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ov-card-bd { padding: 0.75rem 1.25rem; }
  .ov-see-all { font-size: 0.75rem; color: var(--indigo-light); cursor: pointer; font-weight: 700; }
  .ov-course-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border2); }
  .ov-course-row:last-child { border-bottom: none; }
  .ov-course-icon { font-size: 1.4rem; }
  .ov-course-name { font-size: 0.87rem; font-weight: 700; flex: 1; }
  .ov-course-students { font-size: 0.75rem; color: var(--text3); font-weight: 500; }
  .ov-course-status { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 100px; font-family: 'Cairo', sans-serif; }
  .status-active { background: rgba(34,197,94,0.1); color: #22C55E; }
  .status-draft { background: rgba(251,191,36,0.1); color: #FBBF24; }
  .ov-req-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border2); }
  .ov-req-row:last-child { border-bottom: none; }
  .ov-req-avatar {
    width: 30px; height: 30px; border-radius: 50%; background: var(--gradient);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 0.65rem; color: white; flex-shrink: 0;
  }
  .ov-req-name { font-size: 0.84rem; font-weight: 700; }
  .ov-req-course { font-size: 0.72rem; color: var(--text3); font-weight: 500; }
  .ov-req-time { font-size: 0.72rem; color: var(--text3); margin-left: auto; white-space: nowrap; font-weight: 500; }
  .ov-req-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--cyan); flex-shrink: 0; }

  /* ── COURSES MANAGEMENT ── */
  .courses-mgmt { display: flex; flex-direction: column; gap: 1rem; }
  .mgmt-course-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; padding: 1.25rem; display: flex; align-items: center; gap: 1.25rem;
    transition: border-color 0.2s;
  }
  .mgmt-course-card:hover { border-color: rgba(34,197,94,0.25); }
  .mgmt-course-emoji { font-size: 2.25rem; flex-shrink: 0; }
  .mgmt-course-info { flex: 1; }
  .mgmt-course-name { font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 0.97rem; margin-bottom: 0.3rem; }
  .mgmt-course-meta { font-size: 0.78rem; color: var(--text3); margin-bottom: 0.6rem; display: flex; gap: 1rem; flex-wrap: wrap; font-weight: 500; }
  .mgmt-course-stats { display: flex; gap: 1.5rem; }
  .mgmt-stat { text-align: center; }
  .mgmt-stat-val { font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 1rem; }
  .mgmt-stat-lbl { font-size: 0.68rem; color: var(--text3); font-weight: 600; }
  .mgmt-actions { display: flex; gap: 0.5rem; align-items: center; }
  .mgmt-btn {
    padding: 0.4rem 0.875rem; border-radius: 8px; font-size: 0.8rem; font-weight: 700;
    cursor: pointer; border: 1px solid; transition: all 0.2s;
    font-family: 'Cairo', sans-serif;
  }
  .mgmt-btn-edit { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.3); color: var(--indigo-light); }
  .mgmt-btn-edit:hover { background: rgba(34,197,94,0.2); }
  .mgmt-btn-view { background: transparent; border-color: var(--border2); color: var(--text2); }
  .mgmt-btn-view:hover { border-color: var(--text2); }

  /* ── ADD COURSE MODAL ── */
  .add-course-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; padding: 1rem;
    animation: fadeIn 0.2s ease;
  }
  .add-course-modal {
    background: var(--surface); border: 1px solid rgba(34,197,94,0.15);
    border-radius: 22px; width: 100%; max-width: 580px;
    max-height: 92vh; overflow-y: auto; animation: slideUp 0.3s ease;
  }
  .acm-header {
    padding: 1.5rem; border-bottom: 1px solid var(--border2);
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .acm-title { font-family: 'Cairo', sans-serif; font-weight: 900; font-size: 1.15rem; }
  .acm-sub { font-size: 0.82rem; color: var(--text2); margin-top: 0.2rem; font-weight: 500; }
  .acm-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .acm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }
  .acm-section-title {
    font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 0.87rem;
    color: var(--indigo-light); margin: 0.5rem 0 0; padding-top: 0.75rem;
    border-top: 1px solid var(--border2);
  }
  .acm-select {
    width: 100%; padding: 0.7rem 1rem; border-radius: 10px;
    background: var(--bg); border: 1.5px solid var(--border2);
    color: var(--text); font-family: 'Cairo', sans-serif; font-size: 0.9rem; font-weight: 500;
    outline: none; transition: border-color 0.2s; appearance: none; cursor: pointer;
  }
  .acm-select:focus { border-color: var(--indigo); }
  .acm-textarea {
    width: 100%; padding: 0.7rem 1rem; border-radius: 10px;
    background: var(--bg); border: 1.5px solid var(--border2);
    color: var(--text); font-family: 'Cairo', sans-serif; font-size: 0.9rem; font-weight: 500;
    outline: none; transition: border-color 0.2s; resize: none; line-height: 1.7;
  }
  .acm-textarea:focus { border-color: var(--indigo); }
  .acm-footer { padding: 1.25rem 1.5rem; border-top: 1px solid var(--border2); display: flex; gap: 0.75rem; justify-content: flex-end; }

  /* ── REQUESTS ── */
  .requests-list { display: flex; flex-direction: column; gap: 0.875rem; }
  .req-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; padding: 1.25rem; display: flex; align-items: center; gap: 1.25rem;
    transition: border-color 0.2s;
  }
  .req-card:hover { border-color: rgba(34,197,94,0.2); }
  .req-avatar {
    width: 44px; height: 44px; border-radius: 50%; background: var(--gradient);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cairo', sans-serif; font-weight: 900; font-size: 0.9rem; color: white; flex-shrink: 0;
  }
  .req-info { flex: 1; }
  .req-name { font-weight: 800; font-size: 0.92rem; margin-bottom: 0.2rem; }
  .req-course-name { font-size: 0.82rem; color: var(--indigo-light); margin-bottom: 0.2rem; font-weight: 600; }
  .req-details { font-size: 0.75rem; color: var(--text3); font-weight: 500; }
  .req-time { font-size: 0.75rem; color: var(--text3); white-space: nowrap; font-weight: 500; }
  .req-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
  .req-btn-accept {
    padding: 0.45rem 1rem; border-radius: 9px;
    background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #22C55E;
    font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: 'Cairo', sans-serif;
    transition: all 0.2s;
  }
  .req-btn-accept:hover { background: rgba(34,197,94,0.22); }
  .req-btn-reject {
    padding: 0.45rem 1rem; border-radius: 9px;
    background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); color: #f87171;
    font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: 'Cairo', sans-serif;
    transition: all 0.2s;
  }
  .req-btn-reject:hover { background: rgba(248,113,113,0.18); }
  .req-status { font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.7rem; border-radius: 100px; font-family: 'Cairo', sans-serif; }
  .req-status.accepted { background: rgba(34,197,94,0.1); color: #22C55E; }
  .req-status.rejected { background: rgba(248,113,113,0.1); color: #f87171; }
  .req-status.pending { background: rgba(251,191,36,0.1); color: #FBBF24; }
  .req-payment-badge {
    font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 5px;
    background: rgba(251,191,36,0.1); color: var(--cyan); font-weight: 700;
    font-family: 'Cairo', sans-serif;
  }

  /* ── INSTRUCTOR Q&A ── */
  .iqa-list { display: flex; flex-direction: column; gap: 0.875rem; }
  .iqa-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; padding: 1.25rem; transition: border-color 0.2s;
  }
  .iqa-card:hover { border-color: rgba(34,197,94,0.2); }
  .iqa-card.answered { border-left: 3px solid var(--indigo); }
  .iqa-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.875rem; }
  .iqa-from { font-size: 0.78rem; color: var(--text3); font-weight: 500; }
  .iqa-course-tag {
    font-size: 0.72rem; background: rgba(34,197,94,0.1); color: var(--indigo-light);
    padding: 0.15rem 0.5rem; border-radius: 4px; margin-left: 0.4rem; font-weight: 700;
  }
  .iqa-time { font-size: 0.72rem; color: var(--text3); margin-left: auto; white-space: nowrap; font-weight: 500; }
  .iqa-question { font-size: 0.9rem; font-weight: 600; color: var(--text); line-height: 1.65; margin-bottom: 0.875rem; }
  .iqa-reply-area { background: var(--bg3); border-radius: 12px; padding: 0.875rem; }
  .iqa-reply-label { font-size: 0.75rem; font-weight: 800; color: var(--indigo-light); margin-bottom: 0.5rem; }
  .iqa-answer-text { font-size: 0.87rem; color: var(--text2); line-height: 1.7; font-weight: 500; }
  .iqa-reply-input {
    width: 100%; padding: 0.7rem 0.875rem; border-radius: 10px;
    background: var(--bg); border: 1.5px solid var(--border2);
    color: var(--text); font-family: 'Cairo', sans-serif; font-size: 0.87rem; font-weight: 500;
    outline: none; resize: none; transition: border-color 0.2s; line-height: 1.7;
  }
  .iqa-reply-input:focus { border-color: var(--indigo); }
  .iqa-reply-footer { display: flex; justify-content: flex-end; margin-top: 0.6rem; }

  /* ── PROFILE EDIT ── */
  .inst-profile-grid { display: grid; grid-template-columns: 240px 1fr; gap: 1.5rem; align-items: start; }
  .inst-profile-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; padding: 1.5rem; text-align: center;
  }
  .inst-profile-avatar-wrap { position: relative; display: inline-block; margin-bottom: 1rem; }
  .inst-profile-avatar-large {
    width: 88px; height: 88px; border-radius: 50%; background: var(--gradient);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cairo', sans-serif; font-weight: 900; font-size: 1.5rem; color: white;
  }
  .inst-profile-form {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;
  }
  .form-section-title {
    font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 0.87rem;
    color: var(--indigo-light); padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border2); margin-bottom: 0.25rem;
  }

  @media (max-width: 900px) {
    .ov-stats { grid-template-columns: repeat(2, 1fr); }
    .ov-grid { grid-template-columns: 1fr; }
    .inst-profile-grid { grid-template-columns: 1fr; }
  }

  /* COURSE DETAIL */
  .course-detail { padding: 90px 5% 60px; min-height: 100vh; }
  .cd-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
  .cd-main { display: flex; flex-direction: column; gap: 1.5rem; }
  .cd-hero { background: var(--surface); border: 1px solid var(--border2); border-radius: 18px; overflow: hidden; }
  .cd-video-wrap { width: 100%; aspect-ratio: 16/9; background: #000; position: relative; }
  .cd-video-wrap iframe { width: 100%; height: 100%; border: none; }
  .cd-video-placeholder {
    width: 100%; height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem;
    background: linear-gradient(135deg, var(--bg3) 0%, var(--surface2) 100%);
    cursor: pointer;
  }
  .cd-video-placeholder:hover .play-btn { transform: scale(1.08); }
  .play-btn {
    width: 72px; height: 72px; border-radius: 50%; background: var(--gradient);
    display: flex; align-items: center; justify-content: center; font-size: 1.75rem;
    transition: transform 0.2s; box-shadow: 0 8px 32px rgba(34,197,94,0.4);
  }
  .cd-video-label { font-size: 0.9rem; color: var(--text2); font-weight: 500; }
  .cd-info { padding: 1.5rem; }
  .cd-badge-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
  .cd-cat { font-size: 0.75rem; color: var(--cyan); font-weight: 800; }
  .cd-title { font-family: 'Cairo', sans-serif; font-size: 1.5rem; font-weight: 900; margin-bottom: 0.75rem; line-height: 1.35; }
  .cd-meta-row { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .cd-meta-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.87rem; color: var(--text2); font-weight: 500; }
  .cd-about { font-size: 0.9rem; color: var(--text2); line-height: 1.8; font-weight: 500; }
  .cd-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 16px; overflow: hidden; }
  .cd-card-header {
    padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border2);
    font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 1rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .cd-card-body { padding: 1.25rem 1.5rem; }
  .week-item { display: flex; gap: 1rem; padding: 0.9rem 0; border-bottom: 1px solid var(--border2); }
  .week-item:last-child { border-bottom: none; }
  .week-num {
    width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
    background: rgba(34,197,94,0.1); color: var(--indigo-light);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 0.82rem;
  }
  .week-content { flex: 1; }
  .week-title { font-weight: 700; font-size: 0.92rem; margin-bottom: 0.3rem; }
  .week-topics { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .week-topic { font-size: 0.72rem; color: var(--text3); padding: 0.15rem 0.5rem; background: var(--bg3); border-radius: 5px; font-weight: 600; }
  .schedule-item { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: 1px solid var(--border2); }
  .schedule-item:last-child { border-bottom: none; }
  .sched-day { font-weight: 700; font-size: 0.9rem; }
  .sched-time { font-size: 0.87rem; color: var(--text2); font-weight: 500; }
  .sched-type {
    font-size: 0.75rem; color: var(--cyan);
    background: rgba(251,191,36,0.1); padding: 0.2rem 0.6rem; border-radius: 100px; font-weight: 700;
  }
  .review-summary { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border2); }
  .review-big-rating { font-family: 'Cairo', sans-serif; font-size: 3.5rem; font-weight: 900; color: var(--text); line-height: 1; }
  .review-stars-row { display: flex; flex-direction: column; gap: 0.25rem; }
  .review-stars-big { font-size: 1.3rem; color: #FBBF24; }
  .review-count { font-size: 0.82rem; color: var(--text3); font-weight: 500; }
  .review-item { padding: 1rem 0; border-bottom: 1px solid var(--border2); }
  .review-item:last-child { border-bottom: none; }
  .review-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem; }
  .review-avatar {
    width: 36px; height: 36px; border-radius: 50%; background: var(--gradient);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 0.7rem; color: white; flex-shrink: 0;
  }
  .review-name { font-weight: 700; font-size: 0.9rem; }
  .review-date { font-size: 0.75rem; color: var(--text3); font-weight: 500; }
  .review-text { font-size: 0.87rem; color: var(--text2); line-height: 1.7; font-weight: 500; }
  .enroll-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 18px; padding: 1.5rem; }
  .enroll-price { font-family: 'Cairo', sans-serif; font-size: 2rem; font-weight: 900; color: var(--cyan); margin-bottom: 0.25rem; }
  .enroll-deadline { font-size: 0.82rem; color: #f87171; margin-bottom: 1.25rem; font-weight: 600; }
  .enroll-btn { width: 100%; padding: 0.9rem; font-size: 1rem; border-radius: 12px; margin-bottom: 1rem; }
  .enroll-details { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.25rem; }
  .enroll-detail-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.87rem; color: var(--text2); font-weight: 500; }
  .enroll-detail-icon { font-size: 1.1rem; flex-shrink: 0; }
  .enroll-divider { height: 1px; background: var(--border2); margin: 1rem 0; }
  .mini-instructor {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; padding: 1.25rem; cursor: pointer; transition: all 0.2s;
  }
  .mini-instructor:hover { border-color: rgba(34,197,94,0.3); transform: translateY(-2px); }
  .mini-inst-header { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem; }
  .mini-inst-name { font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 0.97rem; }
  .mini-inst-title { font-size: 0.82rem; color: var(--indigo-light); font-weight: 600; }
  .mini-inst-bio { font-size: 0.84rem; color: var(--text2); line-height: 1.65; margin-bottom: 0.75rem; font-weight: 500; }
  .mini-inst-link { font-size: 0.82rem; color: var(--cyan); font-weight: 700; }
  .mini-center {
    display: flex; align-items: center; gap: 0.75rem;
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 14px; padding: 1rem; cursor: pointer; transition: all 0.2s; margin-top: 0.75rem;
  }
  .mini-center:hover { border-color: rgba(251,191,36,0.3); transform: translateY(-2px); }
  .mini-center-logo {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cairo', sans-serif; font-weight: 900; font-size: 0.87rem; color: white; flex-shrink: 0;
  }
  .mini-center-name { font-weight: 700; font-size: 0.92rem; }
  .mini-center-meta { font-size: 0.75rem; color: var(--text3); font-weight: 500; }
  .mini-center-arrow { margin-left: auto; color: var(--text3); }

  /* INSTRUCTOR PROFILE */
  .instructor-page { padding: 90px 5% 60px; min-height: 100vh; }
  .ip-layout { display: grid; grid-template-columns: 300px 1fr; gap: 2rem; align-items: start; }
  .ip-sidebar { display: flex; flex-direction: column; gap: 1.25rem; position: sticky; top: 88px; }
  .ip-profile-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 18px; padding: 2rem; text-align: center;
  }
  .ip-avatar {
    width: 88px; height: 88px; border-radius: 50%; background: var(--gradient);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cairo', sans-serif; font-weight: 900; font-size: 1.5rem; color: white;
    margin: 0 auto 1rem;
  }
  .ip-name { font-family: 'Cairo', sans-serif; font-size: 1.3rem; font-weight: 900; margin-bottom: 0.25rem; }
  .ip-title { font-size: 0.9rem; color: var(--indigo-light); margin-bottom: 0.5rem; font-weight: 700; }
  .ip-stats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;
    margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--border2);
  }
  .ip-stat-val { font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 1.1rem; }
  .ip-stat-lbl { font-size: 0.7rem; color: var(--text3); font-weight: 600; }
  .ip-links {
    display: flex; flex-direction: column; gap: 0.5rem;
    margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--border2);
  }
  .ip-link {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.84rem; color: var(--text2); padding: 0.5rem 0.75rem;
    border-radius: 9px; background: var(--bg); font-weight: 500;
  }
  .ip-main { display: flex; flex-direction: column; gap: 1.5rem; }
  .ip-section {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; padding: 1.5rem;
  }
  .ip-section-title { font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 1rem; margin-bottom: 1rem; }
  .ip-bio { font-size: 0.92rem; color: var(--text2); line-height: 1.85; font-weight: 500; }
  .achievement-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border2); font-size: 0.9rem; font-weight: 500; }
  .achievement-item:last-child { border-bottom: none; }
  .achievement-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gradient); flex-shrink: 0; }
  .back-btn {
    display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text2);
    font-size: 0.87rem; cursor: pointer; margin-bottom: 1.5rem; transition: color 0.2s; font-weight: 600;
  }
  .back-btn:hover { color: var(--indigo-light); }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .dash-grid { grid-template-columns: 1fr; }
    .hero-stats { gap: 1.5rem; }
    .cd-layout { grid-template-columns: 1fr; }
    .ip-layout { grid-template-columns: 1fr; }
  }

  /* ── LIGHT THEME ── */
  [data-theme="light"] {
    --bg: #F0FAF5;
    --bg2: #E3F5EB;
    --bg3: #D2ECDD;
    --surface: #FFFFFF;
    --surface2: #EAF7EF;
    --border: rgba(22,163,74,0.18);
    --border2: rgba(0,0,0,0.08);
    --text: #0A1F12;
    --text2: #2E5A3E;
    --text3: #6B9E78;
  }

  [data-theme="light"] .nav {
    background: rgba(240,250,245,0.88);
    border-bottom-color: rgba(22,163,74,0.15);
  }
  [data-theme="light"] .nav.scrolled {
    background: rgba(240,250,245,0.98);
    box-shadow: 0 4px 20px rgba(22,163,74,0.1);
  }
  [data-theme="light"] .hero-bg {
    background:
      radial-gradient(ellipse 90% 65% at 50% -10%, rgba(22,163,74,0.14) 0%, transparent 65%),
      radial-gradient(ellipse 50% 35% at 85% 80%, rgba(251,191,36,0.06) 0%, transparent 55%);
  }
  [data-theme="light"] .auth-page {
    background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(22,163,74,0.08) 0%, transparent 60%),
                var(--bg);
  }
  [data-theme="light"] .modal-overlay { background: rgba(10,31,18,0.5); }
  [data-theme="light"] ::-webkit-scrollbar-track { background: var(--bg2); }

  /* ── SETTINGS TOGGLES ── */
  .settings-toggles {
    display: flex; align-items: center; gap: 0.4rem; margin-inline-end: 0.25rem;
  }
  .toggle-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem;
    height: 32px; padding: 0 0.65rem; border-radius: 9px; border: 1px solid var(--border2);
    background: var(--surface); color: var(--text2); font-size: 0.82rem; font-weight: 700;
    cursor: pointer; transition: all 0.2s; white-space: nowrap; font-family: 'Cairo', sans-serif;
  }
  .toggle-btn:hover {
    border-color: var(--indigo); color: var(--indigo-light); background: var(--surface2);
  }
  .toggle-btn .toggle-icon { font-size: 0.95rem; }

  /* ── Q&A SECTION ── */
  .qa-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 18px; overflow: hidden; }
  .qa-header { padding: 1.1rem 1.5rem; border-bottom: 1px solid var(--border2); display: flex; align-items: center; justify-content: space-between; font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 0.95rem; }
  .qa-header-sub { font-size: 0.78rem; color: var(--text3); font-weight: 500; margin-right: 0.5rem; }
  .qa-body { padding: 1.25rem 1.5rem; }
  .qa-recipient-tabs { display: flex; gap: 0.5rem; margin-bottom: 0.875rem; }
  .qa-tab { padding: 0.4rem 0.9rem; border-radius: 100px; border: 1.5px solid var(--border2); background: transparent; color: var(--text2); font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Cairo', sans-serif; }
  .qa-tab.active { background: rgba(34,197,94,0.1); border-color: var(--indigo); color: var(--indigo-light); }
  .qa-textarea { width: 100%; padding: 0.75rem 1rem; border-radius: 10px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--text); font-family: 'Cairo', sans-serif; font-size: 0.9rem; font-weight: 500; outline: none; resize: none; transition: border-color 0.2s; line-height: 1.7; }
  .qa-textarea:focus { border-color: var(--indigo); }
  .qa-char-count { text-align: right; font-size: 0.72rem; color: var(--text3); margin-top: 0.3rem; font-weight: 500; }
  .qa-submit-row { display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem; }
  .qa-anon-toggle { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text2); cursor: pointer; font-weight: 600; }
  .qa-toggle-box { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .qa-toggle-box.checked { background: var(--indigo); border-color: var(--indigo); }
  .qa-sent { text-align: center; padding: 2rem 0; }
  .qa-sent-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
  .qa-sent-title { font-family: 'Cairo', sans-serif; font-size: 1.1rem; font-weight: 800; margin-bottom: 0.5rem; }
  .qa-sent-sub { font-size: 0.87rem; color: var(--text2); line-height: 1.7; font-weight: 500; }
  .qa-existing { margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border2); }
  .qa-existing-title { font-family: 'Cairo', sans-serif; font-size: 0.87rem; font-weight: 800; color: var(--text2); margin-bottom: 1rem; }
  .qa-item { padding: 0.875rem 0; border-bottom: 1px solid var(--border2); }
  .qa-item:last-child { border-bottom: none; }
  .qa-item-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
  .qa-item-sender { font-size: 0.82rem; font-weight: 700; }
  .qa-item-to { font-size: 0.75rem; color: var(--text3); font-weight: 500; }
  .qa-item-time { font-size: 0.72rem; color: var(--text3); margin-left: auto; font-weight: 500; }
  .qa-item-q { font-size: 0.87rem; color: var(--text); line-height: 1.65; margin-bottom: 0.6rem; font-weight: 500; }
  .qa-item-answer { background: var(--bg3); border-radius: 10px; padding: 0.75rem 1rem; border-left: 3px solid var(--indigo); }
  .qa-item-answer-by { font-size: 0.75rem; font-weight: 800; color: var(--indigo-light); margin-bottom: 0.35rem; }
  .qa-item-answer-text { font-size: 0.84rem; color: var(--text2); line-height: 1.7; font-weight: 500; }
`;

export default styles;
