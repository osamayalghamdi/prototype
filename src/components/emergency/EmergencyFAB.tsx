
import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import { AlertTriangle } from "lucide-react";
import { Tooltip } from "../ui/tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const EmergencyFAB: React.FC = () => {
  const { setIsEmergencyMode, setEmergencyType, language } = useAppContext();
  
  const handleEmergency = () => {
    setEmergencyType("security"); // Default to security emergency for demo
    setIsEmergencyMode(true);
  };
  
  const tooltipText = language === "en" 
    ? "Emergency Assistance" 
    : "مساعدة طارئة";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className="emergency-fab animate-pulse-emergency"
            onClick={handleEmergency}
            aria-label={tooltipText}
          >
            <AlertTriangle size={24} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EmergencyFAB;
