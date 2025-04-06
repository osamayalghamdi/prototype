
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
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">
          {language === "en" ? `${area} Crowd Level` : `مستوى الحشد في ${area}`}
        </span>
        <span className="text-sm font-medium">{getLabel()}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`crowd-indicator crowd-${crowdDensity}`}
          style={{ width: getPercentage() }}
          role="progressbar"
          aria-valuenow={parseInt(getPercentage())}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );
};

export default CrowdIndicator;
