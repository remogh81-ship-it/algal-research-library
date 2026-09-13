import GrowthRateCalculator from './components/GrowthRateCalculator';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AdSlot } from './components/AdSlot';
import { TopAdBanner } from './components/TopAdBanner';
import { AiChatWidget } from './components/AiChatWidget';
import { Footer } from './components/Footer';
import { ResourceSearch } from './components/ResourceSearch';
import { SubmitResearch } from './components/SubmitResearch';
import { useI18n } from './i18n';
import { AuthModal } from './components/AuthModal';
import { SubmissionModal } from './components/SubmissionModal';
import { useAuth } from './auth';
import { Header } from './components/Header';
import { useResources } from './hooks/useResources';
export default function App() {
  const [submit, setSubmit] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [mineOnly, setMineOnly] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('library-theme') === 'dark');
  const [selectedPaperIds, setSelectedPaperIds] = useState<number[]>([]);
  const { language, t } = useI18n();
  const { user, logout } = useAuth();
  const { resources } = useResources();
  const totalCategories = resources.length > 0 ? new Set(resources.map((resource) => resource.category || 'General')).size : 5;

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
    <section className="portal-hero"><div className="hero-content"><span className="eyebrow">{t('hero.motto')}</span><h1 className="hero-heading">{t('hero.heading')}</h1><p>{t('hero.description')}</p><button className="primary-action" onClick={() => document.querySelector('.resource-query input')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>{t('hero.cta')} <Plus size={16} /></button></div><div className="hero-visual"><div className="hero-image-card"><img src="/assets/hero-photobioreactor.jpg" alt="Futuristic photobioreactor research laboratory for microalgae biotechnology" /><span className="visual-badge">Microalgae research</span></div><div className="hero-image-card hero-image-card--secondary"><img src="/assets/microscope-chlorella.jpg" alt="Fluorescence microscopy of microalgae cells" /><span className="visual-badge">Bioenergy lab</span></div></div><div className="hero-stat"><strong>{resources.length > 0 ? resources.length.toLocaleString(language) : '30,000+'}</strong><span>{t('hero.resources_label')}</span><strong>{totalCategories}</strong><span>{t('hero.categories_label')}</span></div></section>
    <TopAdBanner />
    <AdSlot />
    <div className="quick-filters"><span>Quick filters</span>{['Microalgae', 'Biofuel', 'Wastewater Treatment', 'Carbon Capture'].map((filter) => <button key={filter} onClick={() => { setMineOnly(false); document.querySelector('.resource-query input')?.setAttribute('value', filter); }}>{filter}</button>)}</div>
    <main className="library-main"><ResourceSearch mineOnly={mineOnly} selectedPaperIds={selectedPaperIds} onTogglePaper={(id) => setSelectedPaperIds((ids) => ids.includes(id) ? ids.filter((selectedId) => selectedId !== id) : [...ids, id])} /></main>
    <AdSlot /><Footer /><AiChatWidget selectedPapers={resources.filter((resource) => selectedPaperIds.includes(resource.id))} />
    {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}{submissionOpen && <SubmissionModal onClose={() => setSubmissionOpen(false)} onSaved={() => setMineOnly(true)} />}
  </div>;
}
