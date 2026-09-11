import type { Language } from '../types';
import { useI18n } from '../i18n';

const languages: Array<[Language, string, string]> = [['ar', '🇪🇬 العربية', 'Egypt'], ['en', '🇬🇧 English', 'United Kingdom'], ['fr', '🇫🇷 Français', 'France'], ['de', '🇩🇪 Deutsch', 'Germany'], ['zh', '🇨🇳 中文', 'China'], ['it', '🇮🇹 Italiano', 'Italy']];

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  return <select className="language-switcher" value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Language" title="Choose language">
    {languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
  </select>;
}
