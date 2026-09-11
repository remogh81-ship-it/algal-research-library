import { useEffect, useState } from 'react';
import { BookOpen, FilePlus2, LogIn, Moon, Plus, Sun, UserRound } from 'lucide-react';
import { AdSlot } from './components/AdSlot';
import { TopAdBanner } from './components/TopAdBanner';
import { AiChatWidget } from './components/AiChatWidget';
import { Footer } from './components/Footer';
import { ResourceSearch } from './components/ResourceSearch';
import { SubmitResearch } from './components/SubmitResearch';
import { useI18n } from './i18n';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { AuthModal } from './components/AuthModal';
import { SubmissionModal } from './components/SubmissionModal';
import { useAuth } from './auth';
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
  if (submit) return <><header className="topbar"><div className="brand"><BookOpen size={25} /><div><strong>{t('siteTitle')}</strong><span className="tagline">{t('tagline')}</span></div></div><button onClick={() => setSubmit(false)}><BookOpen size={18} /> {t('library')}</button></header><SubmitResearch /><Footer /></>;
  return <div>
    <header className="topbar"><div className="brand"><span className="brand-mark"><BookOpen size={23} /></span><div><strong>{t('siteTitle')}</strong><span className="tagline">{t('tagline')}</span></div></div><nav className="nav-actions"><button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button><LanguageSwitcher />{user ? <div className="account-menu"><button className="account-trigger" onClick={() => setMineOnly(!mineOnly)}><UserRound size={17} /><span>{user.name}</span></button><button className="menu-action" onClick={() => { setSubmissionOpen(true); setMineOnly(false); }}><Plus size={15} /> Add research</button><button className="menu-action" onClick={() => setMineOnly(!mineOnly)}>My submissions</button><button className="menu-action" onClick={logout}><LogIn size={15} /> Logout</button></div> : <button className="account-trigger" onClick={() => setAuthOpen(true)}><LogIn size={17} /> Login / تسجيل الدخول</button>}<button className="primary-action" onClick={() => user ? setSubmissionOpen(true) : setAuthOpen(true)}><FilePlus2 size={17} /> Add research</button></nav></header>
    <section className="portal-hero"><div><span className="eyebrow">EVIDENCE. DISCOVERY. IMPACT.</span><h1>Where algae research<br /><em>moves forward.</em></h1><p>Explore 30,000 indexed studies, discover emerging science, and share your work with a focused academic community.</p><button className="primary-action" onClick={() => document.querySelector('.resource-query input')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>Start exploring <Plus size={16} /></button></div><div className="hero-stat"><strong>30,000+</strong><span>Indexed resources</span><strong>5</strong><span>Research areas</span></div></section>
    <TopAdBanner />
    <AdSlot />
    <div className="quick-filters"><span>Quick filters</span>{['Microalgae', 'Biofuel', 'Wastewater Treatment', 'Carbon Capture'].map((filter) => <button key={filter} onClick={() => { setMineOnly(false); document.querySelector('.resource-query input')?.setAttribute('value', filter); }}>{filter}</button>)}</div>
    <main className="library-main"><ResourceSearch mineOnly={mineOnly} /></main>
    <AdSlot /><Footer /><AiChatWidget />
    {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}{submissionOpen && <SubmissionModal onClose={() => setSubmissionOpen(false)} onSaved={() => setMineOnly(true)} />}
  </div>;
}
