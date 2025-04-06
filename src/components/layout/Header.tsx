import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import LanguageSwitcher from "../adaptive/LanguageSwitcher";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { StadiumIcon } from "../icons/StadiumIcon";

const Header: React.FC = () => {
  const { language, setCrowdDensity } = useAppContext();
  
  return (
    <header className="stadium-gradient text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <StadiumIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {language === "en" ? "FanBot Stadium Assistant" : "مساعد الملعب فان بوت"}
              </h1>
              <p className="text-sm text-white/80">
                {language === "en" ? "Your Smart Stadium Companion" : "رفيقك الذكي في الملعب"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="w-48">
              <Select onValueChange={(value) => setCrowdDensity(value as any)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                  <SelectValue placeholder={language === "en" ? "Crowd Level" : "مستوى الحشد"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low" className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    {language === "en" ? "Low" : "منخفض"}
                  </SelectItem>
                  <SelectItem value="high" className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                    {language === "en" ? "High" : "عالي"}
                  </SelectItem>
                  <SelectItem value="critical" className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                    {language === "en" ? "Critical" : "حرج"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
