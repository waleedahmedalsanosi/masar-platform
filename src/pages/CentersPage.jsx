/**
 * @file CentersPage.jsx
 * @description صفحة استعراض جميع المراكز التدريبية
 *
 * تعرض شبكة من بطاقات المراكز التدريبية المعتمدة على منصة مسار،
 * مع إمكانية الانتقال لصفحة كل مركز للاطلاع على تفاصيله الكاملة.
 */

import React from "react";
import CenterCard from "../components/CenterCard";
import Footer from "../components/Footer";
import { CENTERS } from "../data";

/**
 * صفحة المراكز التدريبية
 * @param {Object} props
 * @param {Function} props.setPage - دالة التنقل لصفحة المركز
 */
function CentersPage({ setPage }) {
  return (
    <>
      <div style={{ paddingTop: 100 }}>
        <section className="section">
          <div className="section-header">
            <div className="section-tag">Training Centers</div>
            <h2 className="section-title">25+ Partner Centers</h2>
            <p className="section-sub">Every center is verified, transparent, and ready to help you grow.</p>
          </div>
          <div className="centers-grid">
            {CENTERS.map(c => <CenterCard key={c.id} center={c} setPage={setPage} />)}
          </div>
        </section>
      </div>
      <Footer setPage={setPage} />
    </>
  );
}

export default CentersPage;