import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import en from './locales/en.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import de from './locales/de.json';
import zh from './locales/zh.json';
import it from './locales/it.json';
import type { Language } from './types';
import { getLocalizedCategory } from './utils/localization';

const translations = { en, ar, fr, es, de, zh, it } as unknown as Record<Language, Translation>;
type Translation = typeof en;
type I18nContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: string, values?: Record<string, string | number>) => string; category: (value: string) => string };
const I18nContext = createContext<I18nContextValue | null>(null);

function readPath(source: Translation, key: string): unknown {
  return key.split('.').reduce<unknown>((value, part) => (value && typeof value === 'object' ? (value as Record<string, unknown>)[part] : undefined), source);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('library-language');
    return saved && saved in translations ? saved as Language : 'ar';
  });
  const setLanguage = (next: Language) => { setLanguageState(next); localStorage.setItem('library-language', next); };
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  const value = useMemo<I18nContextValue>(() => {
    const source = translations[language];
    const t = (key: string, values?: Record<string, string | number>) => {
      const raw = readPath(source, key) ?? readPath(en, key) ?? key;
      return String(raw).replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(values?.[name] ?? `{{${name}}}`));
    };
    return { language, setLanguage, t, category: (value) => getLocalizedCategory(value, language) };
  }, [language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used within I18nProvider');
  return value;
}
