import type { Language } from '../types';
import { useI18n } from '../i18n';

const languages: Array<[Language, string]> = [['ar', 'AR'], ['en', 'EN'], ['fr', 'FR'], ['de', 'DE'], ['zh', 'ZH']];

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  return <select className="language-switcher" value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Language">
    {languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
  </select>;
}
