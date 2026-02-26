import React from "react";
import { useSettings } from "../contexts/SettingsContext";

function Navbar({ activePage, setPage, scrolled, user, onLogout }) {
  const { lang, theme, toggleLang, toggleTheme, t } = useSettings();
  const initials = user ? user.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "";

  const navPages = ["home", "courses", "instructors", "centers"];
  const navKeys  = { home: "nav.home", courses: "nav.courses", instructors: "nav.instructors", centers: "nav.centers" };

  const dashPage = user?.role === "instructor" ? "inst-dashboard"
                 : user?.role === "center"     ? "center-dashboard"
                 : user?.role === "marketer"   ? "marketer-dashboard"
                 : "dashboard";

  const isDashActive = ["dashboard","inst-dashboard","center-dashboard","marketer-dashboard"].includes(activePage);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-logo" onClick={() => setPage("home")}>Masar</div>

      <ul className="nav-links">
        {navPages.map(p => (
          <li key={p}>
            <a className={activePage === p ? "active" : ""} onClick={() => setPage(p)}>
              {t(navKeys[p])}
            </a>
          </li>
        ))}
        {user && (
          <li>
            <a className={isDashActive ? "active" : ""} onClick={() => setPage(dashPage)}>
              {t("nav.myspace")}
            </a>
          </li>
        )}
      </ul>

      <div className="nav-actions">
        {/* ── Settings Toggles ── */}
        <div className="settings-toggles">
          <button
            className="toggle-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="toggle-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>
          <button
            className="toggle-btn"
            onClick={toggleLang}
            title={lang === "en" ? "العربية" : "English"}
          >
            {lang === "en" ? "عر" : "EN"}
          </button>
        </div>

        {/* ── Auth Buttons ── */}
        {user ? (
          <>
            <div className="nav-user" onClick={() => setPage(dashPage)}>
              <div className="nav-avatar">{initials}</div>
              <span className="nav-username">{user.name.split(" ")[0]}</span>
            </div>
            <button className="btn btn-ghost" onClick={onLogout}>{t("nav.signout")}</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={() => setPage("login")}>{t("nav.signin")}</button>
            <button className="btn btn-primary" onClick={() => setPage("register")}>{t("nav.joinfree")}</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
