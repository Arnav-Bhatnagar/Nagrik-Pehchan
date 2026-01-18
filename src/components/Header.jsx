import { Flag, Languages, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';


export default function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] dark:from-[#E68B2A] dark:via-gray-800 dark:to-[#0F5C06] shadow-lg">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b-4 border-[#138808] dark:border-[#0F5C06]">
        <div className="max-w-7xl mx-auto px-0 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white dark:bg-gray-700 p-0 rounded-lg flex items-center justify-center">
                <img className="h-24 w-auto object-contain" src="/logo.png" alt="Nagrik Pehchan Logo" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('title')}
                </h1>
                <p className="text-sm text-[#138808] dark:text-[#90EE90] font-semibold mt-1">
                  {t('subtitle')}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 bg-[#138808] dark:bg-[#90EE90] text-white dark:text-gray-900 rounded-lg hover:bg-[#0F5C06] dark:hover:bg-white transition-colors shadow-md font-medium"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF9933] dark:bg-[#FFB366] text-white dark:text-gray-900 rounded-lg hover:bg-[#E68B2A] dark:hover:bg-[#FFC299] transition-colors shadow-md font-medium"
              >
                <Languages className="w-5 h-5" />
                <span className="font-medium">{language === 'en' ? 'हिन्दी' : 'English'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
