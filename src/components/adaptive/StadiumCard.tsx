
import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import { LocationPoint } from "../../data/stadiumData";
import { ArrowRight, ArrowLeft, Map } from "lucide-react";

interface StadiumCardProps {
  location: LocationPoint;
  isActive?: boolean;
}

const StadiumCard: React.FC<StadiumCardProps> = ({ location, isActive = false }) => {
  const { language } = useAppContext();
  
  const isRtl = language === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  
  return (
    <div 
      className={`stadium-card ${isActive ? 'ring-2 ring-stadium-primary' : ''}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-semibold">{location.name}</h3>
        <div className="bg-stadium-primary rounded-full p-2">
          <Map size={16} className="text-white" />
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{location.path[language]}</p>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-500 mb-1">
          {language === "en" ? "Landmarks:" : "معالم بارزة:"}
        </h4>
        <ul className="list-disc list-inside text-gray-700 text-sm">
          {location.landmarks[language].map((landmark, index) => (
            <li key={index}>{landmark}</li>
          ))}
        </ul>
      </div>
      
      <button 
        className="flex items-center justify-between w-full text-stadium-primary hover:underline group"
      >
        <span>
          {language === "en" ? "Get Directions" : "الحصول على الاتجاهات"}
        </span>
        <ArrowIcon size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default StadiumCard;
