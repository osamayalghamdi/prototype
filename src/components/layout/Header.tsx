import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import LanguageSwitcher from '../adaptive/LanguageSwitcher';
import { Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const { language, theme, toggleTheme } = useAppContext();

  return (
    <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-md transition-colors border-b border-gray-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img src="/temp.svg" alt="Logo" className="h-24 w-auto" />
            <h1 className="text-2xl font-bold text-blue-600 dark:text-white">
              {language === 'en' ? 'Midan' : 'ميدان'}
            </h1>
          </div>

          {/* Controls: Language, Theme */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher className="text-blue-600 dark:text-white" />

            <button
              onClick={toggleTheme}
              aria-label={language === 'en' ? 'Toggle theme' : 'تبديل السمة'}
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
