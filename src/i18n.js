import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import amTranslation from './locales/am/translation.json';
import omTranslation from './locales/om/translation.json';
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
    resources: {
        en: { translation: enTranslation },
        am: { translation: amTranslation },
        om: { translation: omTranslation }
    },
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    },
    detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage']
    }
});
export default i18n;
