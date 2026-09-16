import ar from '../locales/ar.json';
import de from '../locales/de.json';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';
import zh from '../locales/zh.json';
import it from '../locales/it.json';
import type { Language } from '../types';

const categoryTranslations: Record<Language, typeof en> = { ar, de, en, fr, es, zh, it } as unknown as Record<Language, typeof en>;

export function getLocalizedCategory(category: string, lang: string): string {
  const source = categoryTranslations[lang as Language] ?? en;
  const localized = source.categories[category as keyof typeof source.categories];
  return localized ?? category;
}
