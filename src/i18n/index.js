import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from './locales/en/translation';
import translationUk from './locales/uk/translation';

const LANGUAGE_STORAGE_KEY = 'fitapp_language';

const resources = {
  en: {
    translation: translationEn,
  },
  uk: {
    translation: translationUk,
  },
};

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage && resources[savedLanguage]) {
    return savedLanguage;
  }

  const browserLanguage = window.navigator.language?.slice(0, 2);
  return resources[browserLanguage] ? browserLanguage : 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (language) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }

  if (typeof document !== 'undefined') {
    document.documentElement.lang = language;
  }
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.resolvedLanguage || i18n.language || 'en';
}

export default i18n;
