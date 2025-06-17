import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as Localization from 'expo-localization'; 
import {translations} from './translations';

const getDeviceLanguage = () => {
  try {
    const locales = Localization.getLocales();
    return locales && locales.length > 0 && locales[0].languageCode 
      ? locales[0].languageCode 
      : 'en';
  } catch (error) {
    console.warn('Error detecting device language:', error);
    return 'en';
  }
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: translations,
  //lng: getDeviceLanguage(),
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;