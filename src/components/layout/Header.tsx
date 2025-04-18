import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import LanguageSwitcher from "../adaptive/LanguageSwitcher";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sun, Moon } from "lucide-react";

const Header: React.FC = () => {
  const { language, setCrowdDensity, theme, toggleTheme } = useAppContext();

  return (
    <header className="bg-white sticky top-0 z-40 shadow-md dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <img src="/temp.svg" alt="Logo" className="h-16 w-auto mr-3" />
              <div>
                <h1 className="text-lg font-bold tracking-tight text-stadium-primary dark:text-white">
                  {language === "en" ? "Midan" : "ميدان"}
                </h1>
                <p className="text-xs text-gray-600 dark:text-white/80">
                  {language === "en" ? "Your Smart Stadium Companion" : "رفيقك الذكي في الملعب"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-32">
              <Select onValueChange={(value) => setCrowdDensity(value as any)}>
                <SelectTrigger className="bg-stadium-primary/10 border border-stadium-primary/20 text-stadium-primary rounded-lg h-8 text-xs focus:ring-stadium-primary dark:bg-white/20 dark:border-0 dark:text-white dark:focus:ring-white/30">
                  <SelectValue placeholder={language === "en" ? "Crowd Level" : "مستوى الحشد"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low" className="flex items-center text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    {language === "en" ? "Low" : "منخفض"}
                  </SelectItem>
                  <SelectItem value="high" className="flex items-center text-xs">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                    {language === "en" ? "High" : "عالي"}
                  </SelectItem>
                  <SelectItem value="critical" className="flex items-center text-xs">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                    {language === "en" ? "Critical" : "حرج"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <LanguageSwitcher className="text-stadium-primary dark:text-white" />
            <button
              onClick={toggleTheme}
              aria-label={language === 'en' ? 'Toggle theme' : 'تبديل السمة'}
              className="p-1.5 rounded-full bg-stadium-primary/10 text-stadium-primary hover:bg-stadium-primary/20 dark:bg-white/20 dark:text-white dark:hover:bg-white/30 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
