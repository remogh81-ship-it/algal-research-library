import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AdSlot } from './components/AdSlot';
import { AiChatWidget } from './components/AiChatWidget';
import { Footer } from './components/Footer';
import { ResourceSearch } from './components/ResourceSearch';
import { SubmitResearch } from './components/SubmitResearch';
import { useI18n } from './i18n';
import { AuthModal } from './components/AuthModal';
import { SubmissionModal } from './components/SubmissionModal';
import { useAuth } from './auth';
import { Header } from './components/Header';
export default function App() {
  const [submit, setSubmit] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [mineOnly, setMineOnly] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('library-theme') === 'dark');
  const { language, t } = useI18n();
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = `${t('siteTitle')} | ${t('tagline')}`;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${t('siteTitle')} | ${t('tagline')}`);
    document.querySelector('meta[name="description"]')?.setAttribute('content', `${t('siteTitle')} | ${t('tagline')}`);
  }, [language, t]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('library-theme', dark ? 'dark' : 'light'); }, [dark]);
  if (submit) return <><Header dark={dark} onToggleDark={() => setDark(!dark)} user={user} mineOnly={mineOnly} onToggleMine={() => setMineOnly(!mineOnly)} onLogin={() => setAuthOpen(true)} onLogout={logout} onAddResearch={() => setSubmissionOpen(true)} onLibrary={() => setSubmit(false)} /><button className="library-return" onClick={() => setSubmit(false)}>{t('library')}</button><SubmitResearch /><Footer /></>;
  return <div>
    <Header dark={dark} onToggleDark={() => setDark(!dark)} user={user} mineOnly={mineOnly} onToggleMine={() => setMineOnly(!mineOnly)} onLogin={() => setAuthOpen(true)} onLogout={logout} onAddResearch={() => user ? setSubmissionOpen(true) : setAuthOpen(true)} onLibrary={() => setSubmit(false)} />
    <section className="portal-hero"><div><span className="eyebrow">EVIDENCE. DISCOVERY. IMPACT.</span><h1>Where algae research<br /><em>moves forward.</em></h1><p>Explore 30,000 indexed studies, discover emerging science, and share your work with a focused academic community.</p><button className="primary-action" onClick={() => document.querySelector('.resource-query input')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>Start exploring <Plus size={16} /></button></div><div className="hero-stat"><strong>30,000+</strong><span>Indexed resources</span><strong>5</strong><span>Research areas</span></div></section>
    <AdSlot />
    <div className="quick-filters"><span>Quick filters</span>{['Microalgae', 'Biofuel', 'Wastewater Treatment', 'Carbon Capture'].map((filter) => <button key={filter} onClick={() => { setMineOnly(false); document.querySelector('.resource-query input')?.setAttribute('value', filter); }}>{filter}</button>)}</div>
    <main className="library-main"><ResourceSearch mineOnly={mineOnly} /></main>
    <AdSlot /><Footer /><AiChatWidget />
    {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}{submissionOpen && <SubmissionModal onClose={() => setSubmissionOpen(false)} onSaved={() => setMineOnly(true)} />}
  </div>;
}
