import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { TRANSLATIONS } from "../i18n/translations";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem("masar_lang") || "en"
  );
  const [theme, setThemeState] = useState(
    () => localStorage.getItem("masar_theme") || "dark"
  );

  // Apply lang direction + theme attribute to <html> whenever they change
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("masar_lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("masar_theme", theme);
  }, [theme]);

  const toggleLang = useCallback(() => {
    setLangState((l) => (l === "en" ? "ar" : "en"));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  // Translation function — supports {placeholder} interpolation
  // Usage: t('key') or t('key', { name: 'Ahmed' })
  const t = useCallback(
    (key, vars = {}) => {
      const str = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS["en"]?.[key] ?? key;
      return str.replace(/\{(\w+)\}/g, (_, k) =>
        vars[k] !== undefined ? vars[k] : `{${k}}`
      );
    },
    [lang]
  );

  return (
    <SettingsContext.Provider value={{ lang, theme, toggleLang, toggleTheme, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}
