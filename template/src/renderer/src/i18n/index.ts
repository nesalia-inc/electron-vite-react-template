import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'

// Get system locale
const getSystemLocale = (): string => {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language || 'en'
    return lang.split('-')[0]
  }
  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr }
  },
  lng: getSystemLocale(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
