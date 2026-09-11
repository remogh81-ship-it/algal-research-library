import ar from '../locales/ar.json';
import de from '../locales/de.json';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import zh from '../locales/zh.json';
import type { Language } from '../types';

const categoryTranslations = { ar, de, en, fr, zh };

export function getLocalizedCategory(category: string, lang: string): string {
  const source = categoryTranslations[lang as Language] ?? en;
  const localized = source.categories[category as keyof typeof source.categories];
  return localized ?? category;
}
