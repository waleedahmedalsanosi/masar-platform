/**
 * @file App.jsx
 * @description المكوّن الجذري لتطبيق منصة مسار
 *
 * هذا هو المكوّن الرئيسي الذي يُدير:
 * - حالة التنقل بين الصفحات (page routing) باستخدام نظام routing بسيط قائم على state
 * - حالة المستخدم المسجل (user authentication state)
 * - اكتشاف تمرير الصفحة للتأثير على شريط التنقل
 * - حقن أنماط CSS العامة
 *
 * @module App
 *
 * نظام التوجيه (Routing):
 * - "home"              → HomePage
 * - "courses"           → CoursesPage
 * - "instructors"       → InstructorsPage
 * - "centers"           → CentersPage
 * - "dashboard"         → DashboardPage (الطالب)
 * - "inst-dashboard"    → InstructorDashboard
 * - "center-dashboard"  → CenterOwnerDashboard
 * - "login"             → AuthPage (وضع تسجيل الدخول)
 * - "register"          → AuthPage (وضع التسجيل)
 * - "course-{id}"       → CourseDetailPage
 * - "instructor-{id}"   → InstructorProfilePage
 * - "center-{slug}"     → CenterProfilePage
 */

import { useState, useEffect } from "react";

// الأنماط العامة
import styles from "./styles/globalStyles";

// السياق العام (لغة + ثيم)
import { SettingsProvider } from "./contexts/SettingsContext";

// مكوّنات التخطيط
import Navbar from "./components/Navbar";

// الصفحات الرئيسية
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import InstructorsPage from "./pages/InstructorsPage";
import CentersPage from "./pages/CentersPage";
import CenterProfilePage from "./pages/CenterProfilePage";

// صفحات المصادقة
import AuthPage from "./pages/AuthPage";

// لوحات التحكم
import DashboardPage from "./pages/DashboardPage";
import InstructorDashboard from "./pages/InstructorDashboard";
import CenterOwnerDashboard from "./pages/CenterOwnerDashboard";
import MarketerDashboard from "./pages/MarketerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// صفحات التفاصيل
import CourseDetailPage from "./pages/CourseDetailPage";
import InstructorProfilePage from "./pages/InstructorProfilePage";

/**
 * المكوّن الجذري للتطبيق
 *
 * @returns {JSX.Element} هيكل التطبيق الكامل مع نظام التوجيه
 *
 * @example
 * // في ملف index.js أو main.jsx:
 * import App from './App';
 * ReactDOM.createRoot(document.getElementById('root')).render(<App />);
 */
export default function App() {
  /** @type {[string, Function]} اسم الصفحة الحالية */
  const [page, setPage] = useState("home");

  /** @type {[boolean, Function]} هل تجاوز التمرير 30 بكسل؟ */
  const [scrolled, setScrolled] = useState(false);

  /** @type {[Object|null, Function]} بيانات المستخدم المسجل — محفوظة في localStorage */
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("masar_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // معالجة روابط الإحالة: ?ref=MARKETER_ID&course=COURSE_ID&enroll=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref    = params.get("ref");
    const course = params.get("course");
    const enroll = params.get("enroll");
    if (ref)           sessionStorage.setItem("masar_ref", ref);
    if (enroll === "1") sessionStorage.setItem("masar_auto_enroll", "1");
    if (course)        setPage(`course-${course}`);
  }, []);

  // مراقبة التمرير لتطبيق تأثير scrolled على شريط التنقل
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // الرجوع لأعلى الصفحة عند كل تنقل
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  /**
   * معالج تسجيل الدخول
   * @param {Object} userData - بيانات المستخدم المسجل
   */
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("masar_user", JSON.stringify(userData));
  };

  /**
   * معالج تسجيل الخروج
   * يُفرغ حالة المستخدم ويعود للصفحة الرئيسية
   */
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("masar_user");
    setPage("home");
  };

  /**
   * محدد المكوّن المناسب بناءً على الصفحة الحالية
   * @returns {JSX.Element} مكوّن الصفحة المطلوبة
   */
  const renderPage = () => {
    if (page === "home") return <HomePage setPage={setPage} />;
    if (page === "courses") return <CoursesPage setPage={setPage} />;
    if (page === "instructors") return <InstructorsPage setPage={setPage} />;
    if (page === "centers") return <CentersPage setPage={setPage} />;
    if (page === "dashboard") return <DashboardPage user={user} setPage={setPage} />;
    if (page === "inst-dashboard") return <InstructorDashboard user={user} setPage={setPage} />;
    if (page === "center-dashboard") return <CenterOwnerDashboard user={user} setPage={setPage} />;
    if (page === "marketer-dashboard") return <MarketerDashboard user={user} setPage={setPage} />;
    if (page === "admin-dashboard") return <AdminDashboard user={user} setPage={setPage} />;
    if (page === "login") return <AuthPage mode="login" setPage={setPage} onLogin={handleLogin} />;
    if (page === "register") return <AuthPage mode="register" setPage={setPage} onLogin={handleLogin} />;
    if (page.startsWith("course-")) return <CourseDetailPage courseId={parseInt(page.replace("course-", ""))} setPage={setPage} />;
    if (page.startsWith("instructor-")) return <InstructorProfilePage instructorId={parseInt(page.replace("instructor-", ""))} setPage={setPage} />;
    if (page.startsWith("center-")) return <CenterProfilePage slug={page.replace("center-", "")} setPage={setPage} />;
    return <HomePage setPage={setPage} />;
  };

  /** صفحتا المصادقة لا تعرضان شريط التنقل */
  const showNav = !["login", "register"].includes(page);

  /**
   * يحدد الصفحة النشطة في شريط التنقل
   * يعالج حالات التفاصيل (course-*, instructor-*, center-*)
   * @returns {string} اسم الصفحة النشطة
   */
  const getActivePage = () => {
    if (page.startsWith("course-") || page === "courses") return "courses";
    if (page.startsWith("instructor-") || page === "instructors") return "instructors";
    if (page.startsWith("center-") || page === "centers") return "centers";
    if (page === "inst-dashboard") return "inst-dashboard";
    if (page === "center-dashboard") return "center-dashboard";
    if (page === "admin-dashboard") return "admin-dashboard";
    return page;
  };

  return (
    <SettingsProvider>
      {/* حقن أنماط CSS العامة */}
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* شريط التنقل — يُخفى في صفحات المصادقة */}
      {showNav && (
        <Navbar
          activePage={getActivePage()}
          setPage={setPage}
          scrolled={scrolled}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* محتوى الصفحة الحالية — كل صفحة تعرض Footer بنفسها */}
      <main>{renderPage()}</main>
    </SettingsProvider>
  );
}
