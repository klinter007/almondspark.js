import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { englishTranslation, hebrewTranslation, Translations } from './translations';

type Language = 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: englishTranslation,
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(englishTranslation);
  
  // Function to set language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('preferredLanguage', lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };
  
  // Load language preference from localStorage on component mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
      if (savedLanguage && ['en', 'he'].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.error('Failed to load language preference:', error);
    }
  }, []);
  
  // Update translations when language changes
  useEffect(() => {
    setTranslations(language === 'en' ? englishTranslation : hebrewTranslation);
    
    // Update HTML element's lang and dir attributes
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', language);
    htmlElement.setAttribute('dir', language === 'en' ? 'ltr' : 'rtl');
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};