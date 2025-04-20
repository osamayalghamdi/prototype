import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import LanguageSwitcher from '../adaptive/LanguageSwitcher';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const { language, setCrowdDensity, theme, toggleTheme } = useAppContext();

  return (
    <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-md transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img src="/temp.svg" alt="Logo" className="h-24 w-auto" />
            <h1 className="text-2xl font-bold text-stadium-primary dark:text-white">
              {language === 'en' ? 'Midan' : 'ميدان'}
            </h1>
          </div>

          {/* Controls: Crowd Level, Language, Theme */}
          <div className="flex items-center space-x-4">
            <Select onValueChange={(val) => setCrowdDensity(val as any)}>
              <SelectTrigger className="bg-stadium-primary/10 text-stadium-primary border border-stadium-primary rounded-md h-8 px-3 text-sm">
                <SelectValue placeholder={language === 'en' ? 'Crowd Level' : 'مستوى الحشد'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{language === 'en' ? 'Low' : 'منخفض'}</SelectItem>
                <SelectItem value="high">{language === 'en' ? 'High' : 'عالي'}</SelectItem>
                <SelectItem value="critical">{language === 'en' ? 'Critical' : 'حرج'}</SelectItem>
              </SelectContent>
            </Select>

            <LanguageSwitcher className="text-stadium-primary dark:text-white" />

            <button
              onClick={toggleTheme}
              aria-label={language === 'en' ? 'Toggle theme' : 'تبديل السمة'}
              className="p-2 rounded-md bg-stadium-primary/20 hover:bg-stadium-primary/30 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="text-white w-5 h-5" />
              ) : (
                <Moon className="text-stadium-primary w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
