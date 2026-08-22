import { createContext, useContext, useState } from "react";
import translations from "../translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("neurocare_language") || "en"
  );

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("neurocare_language", newLanguage);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}