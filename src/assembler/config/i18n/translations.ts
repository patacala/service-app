import commonEN from './locales/en/common.json';
import commonES from './locales/es/common.json';
import authEN from './locales/en/auth.json';
import authES from './locales/es/auth.json';

enum Language {
  EN = 'en',
  ES = 'es',
}

enum Namespace {
  COMMON = 'common',
  AUTH = 'auth',
}

type TranslationResource = {
  [key: string]: string | TranslationResource;
};

type Translations = {
  [key in Language]: {
    [key in Namespace]?: TranslationResource;
  };
};

export const translations: Translations = {
  [Language.EN]: {
    [Namespace.COMMON]: commonEN,
    [Namespace.AUTH]: authEN,
  },
  [Language.ES]: {
    [Namespace.COMMON]: commonES,
    [Namespace.AUTH]: authES,
  },
};

export const namespaces = [Namespace.COMMON, Namespace.AUTH];
export {Language, Namespace};
