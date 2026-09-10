import { useEffect, useState } from 'react';
import { BookOpen, FilePlus2 } from 'lucide-react';
import { AdSlot } from './components/AdSlot';
import { AiChatWidget } from './components/AiChatWidget';
import { Footer } from './components/Footer';
import { ResourceSearch } from './components/ResourceSearch';
import { SubmitResearch } from './components/SubmitResearch';
import { useI18n } from './i18n';
import { LanguageSwitcher } from './components/LanguageSwitcher';
export default function App() {
  const [submit, setSubmit] = useState(false);
  const { language, t } = useI18n();

  useEffect(() => {
    document.title = `${t('siteTitle')} | ${t('tagline')}`;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${t('siteTitle')} | ${t('tagline')}`);
    document.querySelector('meta[name="description"]')?.setAttribute('content', `${t('siteTitle')} | ${t('tagline')}`);
  }, [language, t]);
  if (submit) return <><header className="topbar"><div className="brand"><BookOpen size={25} /><div><strong>{t('siteTitle')}</strong><span className="tagline">{t('tagline')}</span></div></div><button onClick={() => setSubmit(false)}><BookOpen size={18} /> {t('library')}</button></header><SubmitResearch /><Footer /></>;
  return <div>
    <header className="topbar"><div className="brand"><BookOpen size={25} /><div><strong>{t('siteTitle')}</strong><span className="tagline">{t('tagline')}</span></div></div><div className="nav-actions"><LanguageSwitcher /><button onClick={() => setSubmit(true)}><FilePlus2 size={17} /> {t('submit')}</button></div></header>
    <AdSlot />
    <main className="library-main"><ResourceSearch /></main>
    <AdSlot /><Footer /><AiChatWidget />
  </div>;
}
