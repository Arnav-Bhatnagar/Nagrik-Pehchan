import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    title: 'Nagrik Pehchan',
    subtitle: 'Government of India',
    selectState: 'Select State/UT',
    allIndia: 'All India',
    stressIndex: 'Stress Index',
    annualStress: 'Annual Stress Index',
    monthlyContribution: 'Monthly Contribution Score',
    monthToMonth: 'Month-to-Month Change',
    stressIndexDesc: 'Current stress level based on enrollment metrics',
    annualStressDesc: '12-month average stress index',
    monthlyContributionDesc: 'Current month contribution to overall stress',
    monthToMonthDesc: 'Change from previous month',
    trendAnalysis: 'Stress Trend Analysis',
    monthlyDistribution: 'Monthly Stress Distribution',
    contributionBreakdown: 'Monthly Contribution Breakdown',
    changeOverTime: 'Month-to-Month Changes',
    month: 'Month',
    value: 'Value',
    percentage: 'Percentage',
    change: 'Change',
    loading: 'Loading data...',
    noData: 'No data available'
  },
  hi: {
    title: 'नागरिक पहचान',
    subtitle: 'भारत सरकार',
    selectState: 'राज्य/केंद्र शासित प्रदेश चुनें',
    allIndia: 'संपूर्ण भारत',
    stressIndex: 'तनाव सूचकांक',
    annualStress: 'वार्षिक तनाव सूचकांक',
    monthlyContribution: 'मासिक योगदान स्कोर',
    monthToMonth: 'महीने-दर-महीने परिवर्तन',
    stressIndexDesc: 'नामांकन मेट्रिक्स के आधार पर वर्तमान तनाव स्तर',
    annualStressDesc: '12 महीने का औसत तनाव सूचकांक',
    monthlyContributionDesc: 'समग्र तनाव में वर्तमान महीने का योगदान',
    monthToMonthDesc: 'पिछले महीने से परिवर्तन',
    trendAnalysis: 'तनाव प्रवृत्ति विश्लेषण',
    monthlyDistribution: 'मासिक तनाव वितरण',
    contributionBreakdown: 'मासिक योगदान विवरण',
    changeOverTime: 'महीने-दर-महीने परिवर्तन',
    month: 'महीना',
    value: 'मान',
    percentage: 'प्रतिशत',
    change: 'परिवर्तन',
    loading: 'डेटा लोड हो रहा है...',
    noData: 'कोई डेटा उपलब्ध नहीं'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
