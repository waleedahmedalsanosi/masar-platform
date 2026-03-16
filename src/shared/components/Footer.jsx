import React from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../contexts/SettingsContext";

export default function Footer() {
  const navigate = useNavigate();
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
            <li><a onClick={() => navigate("/courses")}>{t("footer.courses")}</a></li>
            <li><a onClick={() => navigate("/instructors")}>{t("footer.instructors")}</a></li>
            <li><a onClick={() => navigate("/centers")}>{t("footer.centers")}</a></li>
            <li><a onClick={() => navigate("/")}>{t("footer.about")}</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-heading">{t("footer.foreducators")}</div>
          <ul className="footer-links">
            <li><a onClick={() => navigate("/register")}>{t("footer.teach")}</a></li>
            <li><a onClick={() => navigate("/register")}>{t("footer.listcenter")}</a></li>
            <li><a onClick={() => navigate("/center/dashboard")}>{t("footer.centerdash")}</a></li>
            <li><a onClick={() => navigate("/instructor/dashboard")}>{t("footer.instdash")}</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-heading">{t("footer.fields")}</div>
          <ul className="footer-links">
            <li><a onClick={() => navigate("/courses")}>{t("footer.datascience")}</a></li>
            <li><a onClick={() => navigate("/courses")}>{t("footer.programming")}</a></li>
            <li><a onClick={() => navigate("/courses")}>{t("footer.cs")}</a></li>
            <li><a onClick={() => navigate("/courses")}>{t("footer.uiux")}</a></li>
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
