import { useState, useEffect } from 'react';
import { LanguageConfig, getDefaultLanguage, getLanguageByCode } from '@/types/languages';

const LANGUAGE_STORAGE_KEY = 'voice-cart-language';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageConfig>(getDefaultLanguage());
  const [isLoading, setIsLoading] = useState(true);

  // Load language preference from localStorage on mount
  useEffect(() => {
    try {
      const savedLanguageCode = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguageCode) {
        const savedLanguage = getLanguageByCode(savedLanguageCode);
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
        }
      }
    } catch (error) {
      console.warn('Failed to load language preference from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save language preference to localStorage
  const changeLanguage = (newLanguage: LanguageConfig) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage.code);
      setCurrentLanguage(newLanguage);
    } catch (error) {
      console.warn('Failed to save language preference to localStorage:', error);
      // Still update the state even if localStorage fails
      setCurrentLanguage(newLanguage);
    }
  };

  // Reset to default language
  const resetToDefault = () => {
    const defaultLanguage = getDefaultLanguage();
    changeLanguage(defaultLanguage);
  };

  return {
    currentLanguage,
    changeLanguage,
    resetToDefault,
    isLoading
  };
};
