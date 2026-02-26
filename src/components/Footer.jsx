import React from "react";
import { useSettings } from "../contexts/SettingsContext";

function Footer({ setPage }) {
  const { t } = useSettings();
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand-name">Masar</div>
          <div className="footer-desc">{t("footer.desc")}</div>
        </div>
        <div>
          <div className="footer-heading">{t("footer.platform")}</div>
          <ul className="footer-links">
            <li><a onClick={() => setPage("courses")}>{t("footer.courses")}</a></li>
            <li><a onClick={() => setPage("instructors")}>{t("footer.instructors")}</a></li>
            <li><a onClick={() => setPage("centers")}>{t("footer.centers")}</a></li>
            <li><a onClick={() => setPage("home")}>{t("footer.about")}</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-heading">{t("footer.foreducators")}</div>
          <ul className="footer-links">
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("register")}>{t("footer.teach")}</a></li>
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("register")}>{t("footer.listcenter")}</a></li>
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("center-dashboard")}>{t("footer.centerdash")}</a></li>
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("inst-dashboard")}>{t("footer.instdash")}</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-heading">{t("footer.fields")}</div>
          <ul className="footer-links">
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("courses")}>{t("footer.datascience")}</a></li>
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("courses")}>{t("footer.programming")}</a></li>
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("courses")}>{t("footer.cs")}</a></li>
            <li><a style={{cursor:"pointer"}} onClick={()=>setPage("courses")}>{t("footer.uiux")}</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">{t("footer.rights")}</div>
        <div className="footer-made">{t("footer.builtfor")}</div>
      </div>
    </footer>
  );
}

export default Footer;
