
import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import { Button } from "../ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useAppContext();
  
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-1 ${language === "ar" ? "font-[IBM Plex Sans Arabic]" : ""}`}
      onClick={toggleLanguage}
      aria-label={language === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
    >
      <Globe size={16} />
      <span>{language === "en" ? "العربية" : "English"}</span>
    </Button>
  );
};

export default LanguageSwitcher;
