
import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import LanguageSwitcher from "../adaptive/LanguageSwitcher";

const WelcomeBanner: React.FC = () => {
  const { language } = useAppContext();
  
  return (
    <div className="relative bg-gradient-to-r from-stadium-primary to-stadium-primary/80 rounded-lg p-6 text-white my-6">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="md:w-3/4 space-y-4">
          <h1 className="text-3xl font-bold">
            {language === "en" 
              ? "Welcome to Saudi Stadium Navigator" 
              : "مرحبًا بكم في دليل الملاعب السعودية"}
          </h1>
          <p className="text-white/90">
            {language === "en"
              ? "Find your way around Saudi stadiums with ease. Locate your seat, discover amenities, and enjoy the game!"
              : "اعثر على طريقك في الملاعب السعودية بسهولة. حدد مقعدك، واكتشف المرافق، واستمتع بالمباراة!"}
          </p>
        </div>
        
        <div className="hidden md:block md:w-1/4">
          <div className="w-24 h-24 mx-auto">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="w-full h-full"
            >
              <path d="M12 2a1 1 0 0 1 .967.744L14.146 7.2 17.5 9.134a1 1 0 0 1 0 1.732L14.146 12.8l-1.18 4.456a1 1 0 0 1-1.933 0L9.854 12.8 6.5 10.866a1 1 0 0 1 0-1.732L9.854 7.2l1.18-4.456A1 1 0 0 1 12 2z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 overflow-hidden opacity-10 mix-blend-overlay pointer-events-none">
        <svg 
          width="100%" 
          height="100%" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern 
              id="banner-pattern" 
              x="0" 
              y="0" 
              width="40" 
              height="40" 
              patternUnits="userSpaceOnUse"
            >
              <path 
                d="M0 20L20 0L40 20L20 40Z" 
                fill="white"
              />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#banner-pattern)" />
        </svg>
      </div>
    </div>
  );
};

export default WelcomeBanner;
