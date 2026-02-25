/**
 * @file Footer.jsx
 * @description تذييل الصفحة لمنصة مسار
 *
 * يحتوي التذييل على:
 * - شعار المنصة ووصفها
 * - روابط الصفحات الرئيسية
 * - حقوق النشر
 */

import React from "react";

/**
 * مكوّن تذييل الصفحة
 * @param {Object} props
 * @param {Function} props.setPage - دالة التنقل بين الصفحات
 */
function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand-name">Masar</div>
          <div className="footer-desc">Sudan's premier platform for tech education — connecting learners with the best training centers and instructors nationwide.</div>
        </div>
        <div>
          <div className="footer-heading">Platform</div>
          <ul className="footer-links">
            {["Courses", "Instructors", "Centers", "About"].map(l => (
              <li key={l}><a onClick={() => setPage(l.toLowerCase())}>{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-heading">For Educators</div>
          <ul className="footer-links">
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("register")}>Teach on Masar</a></li>
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("register")}>List Your Center</a></li>
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("center-dashboard")}>Center Dashboard</a></li>
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("inst-dashboard")}>Instructor Dashboard</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-heading">Fields</div>
          <ul className="footer-links">
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("courses")}>Data Science</a></li>
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("courses")}>Programming</a></li>
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("courses")}>Computer Science</a></li>
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("courses")}>UI/UX Design</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2024 Masar. All rights reserved.</div>
        <div className="footer-made">Built for Sudan 🇸🇩</div>
      </div>
    </footer>
  );
}

export default Footer;
