import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import LanguageSwitcher from '../adaptive/LanguageSwitcher';
import { Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const { language, theme, toggleTheme } = useAppContext();

  // Helper function for localized text (can be moved to context if used widely)
  const getText = (en: string, ar: string, es: string) => {
    if (language === "en") return en;
    if (language === "ar") return ar;
    if (language === "es") return es;
    return en; // Default to English
  };

  return (
    <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-md transition-colors border-b border-gray-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center">
            <img 
              // Use different logos based on theme if needed
              src={theme === 'dark' ? "/midan-logo.png" : "/midan-logo.png"} 
              alt="Midan" 
              className="h-8 object-contain" // Removed dark:invert as we now use separate logos
            />
          </a>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher className="text-blue-600 dark:text-white" />
            <button
              onClick={toggleTheme}
              // Updated aria-label to include Spanish
              aria-label={getText('Toggle theme', 'تبديل السمة', 'Cambiar tema')}
              className="p-2 rounded-md bg-blue-600/20 hover:bg-blue-600/30 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="text-white w-5 h-5" />
              ) : (
                <Moon className="text-blue-600 w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;