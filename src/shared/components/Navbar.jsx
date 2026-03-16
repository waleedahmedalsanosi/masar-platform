import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSettings } from "../../contexts/SettingsContext";
import { useAuth } from "../../contexts/AuthContext";

const roleDashPath = {
  instructor: "/instructor/dashboard",
  center:     "/center/dashboard",
  marketer:   "/marketer/dashboard",
  admin:      "/admin/dashboard",
};

export default function Navbar({ scrolled }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { lang, theme, toggleLang, toggleTheme, t } = useSettings();
  const { user, handleLogout } = useAuth();

  const dashPath = user ? (roleDashPath[user.role] || "/dashboard") : "/dashboard";
  const initials = user ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "";

  const navLinks = [
    { path: "/",            key: "nav.home" },
    { path: "/courses",     key: "nav.courses" },
    { path: "/instructors", key: "nav.instructors" },
    { path: "/centers",     key: "nav.centers" },
  ];

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const dashActive = ["/dashboard", "/instructor/dashboard", "/center/dashboard", "/marketer/dashboard", "/admin/dashboard"]
    .some(p => pathname.startsWith(p));

  const dashLabel = user?.role === "admin" ? t("nav.adminPanel") : t("nav.myspace");

  const logout = async () => {
    await handleLogout();
    navigate("/");
  };

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Masar</div>

      <ul className="nav-links">
        {navLinks.map(({ path, key }) => (
          <li key={path}>
            <a className={isActive(path) ? "active" : ""} onClick={() => navigate(path)} style={{ cursor: "pointer" }}>
              {t(key)}
            </a>
          </li>
        ))}
        {user && (
          <li>
            <a className={dashActive ? "active" : ""} onClick={() => navigate(dashPath)} style={{ cursor: "pointer" }}>
              {dashLabel}
            </a>
          </li>
        )}
      </ul>

      <div className="nav-actions">
        <div className="settings-toggles">
          <button className="toggle-btn" onClick={toggleTheme} title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <span className="toggle-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>
          <button className="toggle-btn" onClick={toggleLang} title={lang === "en" ? "العربية" : "English"}>
            {lang === "en" ? "عر" : "EN"}
          </button>
        </div>

        {user ? (
          <>
            <div className="nav-user" onClick={() => navigate(dashPath)} title={dashLabel} style={{ cursor: "pointer" }}>
              <div className="nav-avatar">{initials}</div>
              <span className="nav-username">{user.name.split(" ")[0]}</span>
            </div>
            <button className="btn btn-ghost" onClick={logout}>{t("nav.signout")}</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={() => navigate("/login")}>{t("nav.signin")}</button>
            <button className="btn btn-primary" onClick={() => navigate("/register")}>{t("nav.joinfree")}</button>
          </>
        )}
      </div>
    </nav>
  );
}
