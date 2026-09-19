import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
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
import { ScientificLabSuite } from './components/ScientificLabSuite';
import { JournalPromotionSection } from './components/JournalPromotionSection';
import { ResearcherProfileModal } from './components/ResearcherProfileModal';
import { ContactModal } from './components/ContactModal';
import { useBookmarks } from './hooks/useBookmarks';
import { QuickViewDrawer } from './components/QuickViewDrawer';
import { BookmarksModal } from './components/BookmarksModal';
import type { Resource } from './types/resource';

export default function App() {
  const [submit, setSubmit] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [quickViewResource, setQuickViewResource] = useState<Resource | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [mineOnly, setMineOnly] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('library-theme') === 'dark');
  const [selectedPaperIds, setSelectedPaperIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, t } = useI18n();
  const { user, logout } = useAuth();
  const { resources } = useResources();
  const { bookmarks, bookmarksCount, toggleBookmark, isBookmarked, clearBookmarks } = useBookmarks();
  const totalCategories = resources.length > 0 ? new Set(resources.map((resource) => resource.category || 'General')).size : 5;

  const handleStartExploring = () => {
    setIsExploring(true);
    setTimeout(() => {
      document.getElementById('research-discovery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  useEffect(() => {
    document.title = `${t('siteTitle')} | ${t('tagline')}`;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${t('siteTitle')} | ${t('tagline')}`);
    document.querySelector('meta[name="description"]')?.setAttribute('content', `${t('siteTitle')} | ${t('tagline')}`);
  }, [language, t]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('library-theme', dark ? 'dark' : 'light'); }, [dark]);
  if (submit) return <><Header dark={dark} onToggleDark={() => setDark(!dark)} user={user} mineOnly={mineOnly} onToggleMine={() => setMineOnly(!mineOnly)} onLogin={() => setAuthOpen(true)} onLogout={logout} onAddResearch={() => setSubmissionOpen(true)} onLibrary={() => setSubmit(false)} onOpenProfile={() => setProfileOpen(true)} onOpenContact={() => setContactOpen(true)} onOpenBookmarks={() => setBookmarksOpen(true)} bookmarksCount={bookmarksCount} /><button className="library-return" onClick={() => setSubmit(false)}>{t('library')}</button><SubmitResearch /><Footer onOpenContact={() => setContactOpen(true)} />{contactOpen && <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />}</>;
  return <div>
    <Header dark={dark} onToggleDark={() => setDark(!dark)} user={user} mineOnly={mineOnly} onToggleMine={() => setMineOnly(!mineOnly)} onLogin={() => setAuthOpen(true)} onLogout={logout} onAddResearch={() => user ? setSubmissionOpen(true) : setAuthOpen(true)} onLibrary={() => setSubmit(false)} onOpenProfile={() => setProfileOpen(true)} onOpenContact={() => setContactOpen(true)} onOpenBookmarks={() => setBookmarksOpen(true)} bookmarksCount={bookmarksCount} />
    <section className="portal-hero"><div className="hero-content"><span className="eyebrow">{t('hero.motto')}</span><h1 className="hero-heading">{t('hero.heading')}</h1><p>{t('hero.description')}</p><button className="primary-action" onClick={handleStartExploring}>{t('hero.cta')} <Plus size={16} /></button></div><div className="hero-visual"><div className="hero-image-card"><img src="/assets/hero-photobioreactor.jpg" alt="Futuristic photobioreactor research laboratory for microalgae biotechnology" /><span className="visual-badge">Microalgae research</span></div><div className="hero-image-card hero-image-card--secondary"><img src="/assets/microscope-chlorella.jpg" alt="Fluorescence microscopy of microalgae cells" /><span className="visual-badge">Bioenergy lab</span></div></div><div className="hero-stat"><strong>{resources.length > 0 ? resources.length.toLocaleString(language) : '30,000+'}</strong><span>{t('hero.resources_label')}</span><strong>{totalCategories}</strong><span>{t('hero.categories_label')}</span></div></section>
    <div className="quick-filters">
      <span>{t('quickFilters')}</span>
      {[
        'Biofuels & Bioenergy',
        'Wastewater Treatment & Bioremediation',
        'Carbon Capture & Bio-fixation',
        'Food & Functional Nutrition',
        'Pharmaceuticals & Bioactive Compounds',
        'Agriculture & Biofertilizers',
        'Bioplastics & Biomaterials',
        'Ecology, Taxonomy & Blooms',
      ].map((filter) => (
        <button
          key={filter}
          className={searchQuery === filter ? 'active' : ''}
          onClick={() => {
            setMineOnly(false);
            setIsExploring(true);
            setSearchQuery(filter);
            setTimeout(() => {
              document.getElementById('research-discovery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
          }}
        >
          {t(`categories.${filter}`) || filter}
        </button>
      ))}
      {searchQuery && (
        <button className="clear-filter" onClick={() => setSearchQuery('')}>✕</button>
      )}
    </div>
    <main className="library-main">
      <ResourceSearch
        mineOnly={mineOnly}
        selectedPaperIds={selectedPaperIds}
        onTogglePaper={(id) => setSelectedPaperIds((ids) => ids.includes(id) ? ids.filter((selectedId) => selectedId !== id) : [...ids, id])}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onQuickView={(res) => setQuickViewResource(res)}
        isBookmarked={isBookmarked}
        onToggleBookmark={toggleBookmark}
        isExploring={isExploring}
        onStartExploring={() => setIsExploring(true)}
        onStopExploring={() => setIsExploring(false)}
      />
      <ScientificLabSuite />
      <JournalPromotionSection />
    </main>
    <Footer onOpenContact={() => setContactOpen(true)} /><AiChatWidget selectedPapers={resources.filter((resource) => selectedPaperIds.includes(resource.id))} />
    {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    {submissionOpen && <SubmissionModal onClose={() => setSubmissionOpen(false)} onSaved={() => setMineOnly(true)} />}
    {profileOpen && <ResearcherProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} onAddPaper={() => setSubmissionOpen(true)} />}
    {contactOpen && <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />}
    <QuickViewDrawer
      resource={quickViewResource}
      isOpen={Boolean(quickViewResource)}
      onClose={() => setQuickViewResource(null)}
      isBookmarked={quickViewResource ? isBookmarked(quickViewResource.id) : false}
      onToggleBookmark={toggleBookmark}
    />
    <BookmarksModal
      isOpen={bookmarksOpen}
      onClose={() => setBookmarksOpen(false)}
      bookmarkedIds={bookmarks}
      resources={resources}
      onToggleBookmark={toggleBookmark}
      onClearAll={clearBookmarks}
      onQuickView={(res) => setQuickViewResource(res)}
    />
  </div>;
}
