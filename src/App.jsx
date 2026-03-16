import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import styles from "./styles/globalStyles";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import Navbar from "./shared/components/Navbar";

import HomePage              from "./pages/HomePage";
import CoursesPage           from "./features/courses/CoursesPage";
import CourseDetailPage      from "./features/courses/CourseDetailPage";
import InstructorsPage       from "./features/instructors/InstructorsPage";
import InstructorProfilePage from "./features/instructors/InstructorProfilePage";
import CentersPage           from "./features/centers/CentersPage";
import CenterProfilePage     from "./features/centers/CenterProfilePage";
import AuthPage              from "./features/auth/AuthPage";
import DashboardPage         from "./features/student-dashboard/DashboardPage";
import InstructorDashboard   from "./features/instructor-dashboard/InstructorDashboard";
import CenterOwnerDashboard  from "./features/center-dashboard/CenterOwnerDashboard";
import MarketerDashboard     from "./features/marketer-dashboard/MarketerDashboard";
import AdminDashboard        from "./features/admin-dashboard/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const hideNav = ["/login", "/register"].includes(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle referral links: ?ref=MARKETER_ID&course=COURSE_ID&enroll=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref    = params.get("ref");
    const course = params.get("course");
    const enroll = params.get("enroll");
    if (ref)            sessionStorage.setItem("masar_ref", ref);
    if (enroll === "1") sessionStorage.setItem("masar_auto_enroll", "1");
    if (course)         navigate(`/courses/${course}`, { replace: true });
  }, []);

  return (
    <>
      {!hideNav && <Navbar scrolled={scrolled} />}
      <main>
        <Routes>
          <Route path="/"                      element={<HomePage />} />
          <Route path="/courses"               element={<CoursesPage />} />
          <Route path="/courses/:id"           element={<CourseDetailPage />} />
          <Route path="/instructors"           element={<InstructorsPage />} />
          <Route path="/instructors/:id"       element={<InstructorProfilePage />} />
          <Route path="/centers"               element={<CentersPage />} />
          <Route path="/centers/:slug"         element={<CenterProfilePage />} />
          <Route path="/login"                 element={<AuthPage mode="login" />} />
          <Route path="/register"              element={<AuthPage mode="register" />} />
          <Route path="/dashboard"             element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/instructor/dashboard"  element={<RoleRoute role="instructor"><InstructorDashboard /></RoleRoute>} />
          <Route path="/center/dashboard"      element={<RoleRoute role="center"><CenterOwnerDashboard /></RoleRoute>} />
          <Route path="/marketer/dashboard"    element={<RoleRoute role="marketer"><MarketerDashboard /></RoleRoute>} />
          <Route path="/admin/dashboard"       element={<RoleRoute role="admin"><AdminDashboard /></RoleRoute>} />
          <Route path="*"                      element={<HomePage />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <ScrollToTop />
        <AppLayout />
      </SettingsProvider>
    </AuthProvider>
  );
}
