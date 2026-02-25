/**
 * @file Navbar.jsx
 * @description مكوّن شريط التنقل الرئيسي لمنصة مسار
 *
 * شريط التنقل ثابت في أعلى الصفحة مع:
 * - الشعار الذي يعود للصفحة الرئيسية عند النقر عليه
 * - روابط التنقل بين الصفحات الرئيسية
 * - زرا تسجيل الدخول / الانضمام للزوار
 * - عرض اسم المستخدم وزر الخروج عند تسجيل الدخول
 * - تأثير التمييز (scrolled) عند التمرير للأسفل
 */

import React from "react";

/**
 * مكوّن شريط التنقل
 * @param {Object} props
 * @param {string} props.activePage - الصفحة النشطة حالياً
 * @param {Function} props.setPage - دالة التنقل بين الصفحات
 * @param {boolean} props.scrolled - هل تم التمرير للأسفل؟
 * @param {Object|null} props.user - بيانات المستخدم المسجل (أو null)
 * @param {Function} props.onLogout - دالة تسجيل الخروج
 */
function Navbar({ activePage, setPage, scrolled, user, onLogout }) {
  const initials = user ? user.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "";
  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-logo" onClick={() => setPage("home")}>Masar</div>
      <ul className="nav-links">
        {["home", "courses", "instructors", "centers"].map(p => (
          <li key={p}>
            <a className={activePage === p ? "active" : ""} onClick={() => setPage(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </a>
          </li>
        ))}
        {user && <li><a className={activePage === "dashboard" || activePage === "inst-dashboard" || activePage === "center-dashboard" ? "active" : ""} onClick={() => setPage(user.role === "instructor" ? "inst-dashboard" : user.role === "center" ? "center-dashboard" : "dashboard")}>My Space</a></li>}
      </ul>
      <div className="nav-actions">
        {user ? (
          <>
            <div className="nav-user" onClick={() => setPage(user?.role === "instructor" ? "inst-dashboard" : user?.role === "center" ? "center-dashboard" : "dashboard")}>
              <div className="nav-avatar">{initials}</div>
              <span className="nav-username">{user.name.split(" ")[0]}</span>
            </div>
            <button className="btn btn-ghost" onClick={onLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={() => setPage("login")}>Sign In</button>
            <button className="btn btn-primary" onClick={() => setPage("register")}>Join Free</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
