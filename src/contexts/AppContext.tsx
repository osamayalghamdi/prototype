
import React, { createContext, useState, useContext, ReactNode } from "react";

type EmergencyType = "medical" | "security" | "fire" | null;
type Language = "en" | "ar";
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

  React.useEffect(() => {
    // Set the HTML dir attribute based on the language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    emergencyType,
    setEmergencyType,
    crowdDensity,
    setCrowdDensity,
    isEmergencyMode,
    setIsEmergencyMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
