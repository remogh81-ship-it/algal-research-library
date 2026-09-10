import { useEffect, useState } from 'react';
import { BookOpen, FilePlus2 } from 'lucide-react';
import { AdSlot } from './components/AdSlot';
import { AiChatWidget } from './components/AiChatWidget';
import { Footer } from './components/Footer';
import { ResourceSearch } from './components/ResourceSearch';
import { SubmitResearch } from './components/SubmitResearch';
import type { Language } from './types';

const siteTitles: Record<Language, string> = {
  ar: 'المكتبة المتكاملة لأبحاث الطحالب',
  en: 'Integrated Algae Research Library',
  it: 'Biblioteca Integrata di Ricerca sulle Alghe',
};
const taglines: Record<Language, string> = {
  ar: 'الجمعية المصرية للطحالب',
  en: 'Egyptian Phycological Society',
  it: 'Società Egiziana di Ficologia',
};
export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    document.title = `${siteTitles[language]} | ${taglines[language]}`;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${siteTitles[language]} | ${taglines[language]}`);
    document.querySelector('meta[name="description"]')?.setAttribute('content', `${siteTitles[language]} | ${taglines[language]}`);
  }, [language]);
  if (submit) return <><header className="topbar"><div className="brand"><BookOpen size={25} /><div><strong>{siteTitles[language]}</strong><span className="tagline">{taglines[language]}</span></div></div><button onClick={() => setSubmit(false)}><BookOpen size={18} /> المكتبة</button></header><SubmitResearch /><Footer /></>;
  return <div>
    <header className="topbar"><div className="brand"><BookOpen size={25} /><div><strong>{siteTitles[language]}</strong><span className="tagline">{taglines[language]}</span></div></div><div className="nav-actions"><select value={language} onChange={(e) => setLanguage(e.target.value as Language)} aria-label="Language"><option value="ar">العربية</option><option value="en">English</option><option value="it">Italiano</option></select><button onClick={() => setSubmit(true)}><FilePlus2 size={17} /> إرسال بحث</button></div></header>
    <AdSlot />
    <main className="library-main"><ResourceSearch /></main>
    <AdSlot /><Footer /><AiChatWidget />
  </div>;
}
