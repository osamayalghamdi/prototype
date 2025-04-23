import React, { createContext, useState, useContext, ReactNode } from "react";

type EmergencyType = "medical" | "security" | "fire" | null;
type Language = "en" | "ar" | "es";
type CrowdDensity = "low" | "high" | "critical";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  emergencyType: EmergencyType;
  setEmergencyType: (type: EmergencyType) => void;
  crowdDensity: CrowdDensity;
  setCrowdDensity: (density: CrowdDensity) => void;
  isEmergencyMode: boolean;
  setIsEmergencyMode: (isEmergency: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [emergencyType, setEmergencyType] = useState<EmergencyType>(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [crowdDensity, setCrowdDensity] = useState<CrowdDensity>("low");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  React.useEffect(() => {
    // Set the HTML dir attribute based on the language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    // Apply theme class
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [language, theme]);

  const value = {
    language,
    setLanguage,
    emergencyType,
    setEmergencyType,
    crowdDensity,
    setCrowdDensity,
    isEmergencyMode,
    setIsEmergencyMode,
    theme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
