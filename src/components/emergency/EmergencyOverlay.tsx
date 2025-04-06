
import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import { exitLocations } from "../../data/stadiumData";
import { Button } from "../ui/button";
import { AlertTriangle, X } from "lucide-react";

const EmergencyOverlay: React.FC = () => {
  const { isEmergencyMode, setIsEmergencyMode, emergencyType, language } = useAppContext();
  
  if (!isEmergencyMode) return null;
  
  const getEmergencyTitle = () => {
    switch (emergencyType) {
      case "medical":
        return language === "en" ? "Medical Emergency" : "حالة طوارئ طبية";
      case "security":
        return language === "en" ? "Security Alert" : "تنبيه أمني";
      case "fire":
        return language === "en" ? "Fire Emergency" : "حالة طوارئ حريق";
      default:
        return language === "en" ? "Emergency" : "حالة طوارئ";
    }
  };
  
  const getEmergencyInstructions = () => {
    if (language === "en") {
      return "Please proceed calmly to the nearest emergency exit. Follow the instructions from staff.";
    } else {
      return "يرجى التوجه بهدوء إلى أقرب مخرج للطوارئ. اتبع تعليمات الموظفين.";
    }
  };
  
  // Pick the nearest exit (simplified for demo)
  const nearestExit = exitLocations["exit-n"];
  
  const exitPath = nearestExit?.path[language] || "";
  const screenReaderInstructions = language === "en" 
    ? `Emergency exit: ${exitPath}. Follow vibrating pulse pattern.` 
    : `مخرج الطوارئ: ${exitPath}. اتبع نمط النبض المهتز.`;

  return (
    <div className="emergency-overlay" role="alert" aria-live="assertive">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle size={64} className="animate-pulse-emergency" />
        </div>
        
        <h1 className="text-4xl font-bold mb-6">{getEmergencyTitle()}</h1>
        
        <p className="text-xl mb-8">{getEmergencyInstructions()}</p>
        
        <div className="bg-white bg-opacity-20 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {language === "en" ? "Nearest Exit" : "أقرب مخرج"}
          </h2>
          <p className="text-xl mb-4">{exitPath}</p>
          <ul className="text-left list-disc list-inside mb-4">
            {nearestExit?.landmarks[language].map((landmark, index) => (
              <li key={index} className="text-lg mb-2">{landmark}</li>
            ))}
          </ul>
          <p className="sr-only">{screenReaderInstructions}</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            className="bg-white text-danger-zone hover:bg-gray-100 text-lg px-6 py-3"
            onClick={() => setIsEmergencyMode(false)}
          >
            {language === "en" ? "Acknowledge" : "تأكيد"}
          </Button>
          <Button 
            className="bg-white bg-opacity-10 text-white hover:bg-opacity-20 border border-white text-lg px-6 py-3"
            onClick={() => window.location.href = "tel:911"}
          >
            {language === "en" ? "Call for Help" : "اتصل للمساعدة"}
          </Button>
        </div>
        
        <button 
          className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white hover:bg-opacity-10"
          onClick={() => setIsEmergencyMode(false)}
          aria-label={language === "en" ? "Close emergency overlay" : "إغلاق طبقة الطوارئ"}
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default EmergencyOverlay;
