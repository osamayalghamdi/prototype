
import React from "react";
import { useAppContext } from "../../contexts/AppContext";

interface CrowdIndicatorProps {
  area: string;
}

const CrowdIndicator: React.FC<CrowdIndicatorProps> = ({ area }) => {
  const { crowdDensity, language } = useAppContext();
  
  const getLabel = () => {
    if (language === "en") {
      return {
        low: "Low Crowd Density",
        high: "High Crowd Density",
        critical: "Critical Crowd Density"
      }[crowdDensity];
    } else {
      return {
        low: "كثافة حشد منخفضة",
        high: "كثافة حشد عالية",
        critical: "كثافة حشد حرجة"
      }[crowdDensity];
    }
  };
  
  const getPercentage = () => {
    switch(crowdDensity) {
      case "low": return "30%";
      case "high": return "70%";
      case "critical": return "90%";
    }
  };
  
  return (
    
};

export default CrowdIndicator;
