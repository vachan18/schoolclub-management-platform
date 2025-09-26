import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationEN from '../public/locales/en/translation.json';
import translationFR from '../public/locales/fr/translation.json';
import translationKN from '../public/locales/kn/translation.json';
import translationML from '../public/locales/ml/translation.json';
import translationTE from '../public/locales/te/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
  kn: {
    translation: translationKN,
  },
  ml: {
    translation: translationML,
  },
  te: {
    translation: translationTE,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['en', 'kn', 'te', 'ml', 'fr'],
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
