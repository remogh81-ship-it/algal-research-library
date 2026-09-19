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
import { AlgaeStrainsAtlasModal } from './components/AlgaeStrainsAtlasModal';
import { GrowthMediaModal } from './components/GrowthMediaModal';
import { PaperComparisonModal } from './components/PaperComparisonModal';
import { SopDirectoryModal } from './components/SopDirectoryModal';
import { ConferencesAgendaModal } from './components/ConferencesAgendaModal';
import { CollaborationSystemModal } from './components/CollaborationSystemModal';
import type { Resource } from './types/resource';

export default function App() {
  const [submit, setSubmit] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [strainsAtlasOpen, setStrainsAtlasOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [initialMediumId, setInitialMediumId] = useState<string>('zarrouk');
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [sopsOpen, setSopsOpen] = useState(false);
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [collabOpen, setCollabOpen] = useState(false);
  const [comparedPaperIds, setComparedPaperIds] = useState<number[]>([]);
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

  const handleToggleCompare = (resource: Resource) => {
    setComparedPaperIds(prev => {
      if (prev.includes(resource.id)) {
        return prev.filter(id => id !== resource.id);
      }
      if (prev.length >= 4) {
        alert(t('maxCompareReached') || 'You can compare up to 4 papers simultaneously');
        return prev;
      }
      return [...prev, resource.id];
    });
  };

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
  if (submit) return <><Header dark={dark} onToggleDark={() => setDark(!dark)} user={user} mineOnly={mineOnly} onToggleMine={() => setMineOnly(!mineOnly)} onLogin={() => setAuthOpen(true)} onLogout={logout} onAddResearch={() => setSubmissionOpen(true)} onLibrary={() => setSubmit(false)} onOpenProfile={() => setProfileOpen(true)} onOpenContact={() => setContactOpen(true)} onOpenBookmarks={() => setBookmarksOpen(true)} bookmarksCount={bookmarksCount} onOpenStrainsAtlas={() => setStrainsAtlasOpen(true)} onOpenMediaCalculator={() => { setInitialMediumId('zarrouk'); setMediaModalOpen(true); }} onOpenComparison={() => setComparisonOpen(true)} comparedCount={comparedPaperIds.length} /><button className="library-return" onClick={() => setSubmit(false)}>{t('library')}</button><SubmitResearch /><Footer onOpenContact={() => setContactOpen(true)} />{contactOpen && <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />}</>;
  return <div>
    <Header 
      dark={dark} 
      onToggleDark={() => setDark(!dark)} 
      user={user} 
      mineOnly={mineOnly} 
      onToggleMine={() => setMineOnly(!mineOnly)} 
      onLogin={() => setAuthOpen(true)} 
      onLogout={logout} 
      onAddResearch={() => user ? setSubmissionOpen(true) : setAuthOpen(true)} 
      onLibrary={() => setSubmit(false)} 
      onOpenProfile={() => setProfileOpen(true)} 
      onOpenContact={() => setContactOpen(true)} 
      onOpenBookmarks={() => setBookmarksOpen(true)} 
      bookmarksCount={bookmarksCount}
      onOpenStrainsAtlas={() => setStrainsAtlasOpen(true)}
      onOpenMediaCalculator={() => { setInitialMediumId('zarrouk'); setMediaModalOpen(true); }}
      onOpenComparison={() => setComparisonOpen(true)}
      comparedCount={comparedPaperIds.length}
    />
    <section className="portal-hero"><div className="hero-content"><span className="eyebrow">{t('hero.motto')}</span><h1 className="hero-heading">{t('hero.heading')}</h1><p>{t('hero.description')}</p><button className="primary-action" onClick={handleStartExploring}>{t('hero.cta')} <Plus size={16} /></button></div><div className="hero-visual"><div className="hero-image-card"><img src="/assets/hero-photobioreactor.jpg" alt="Futuristic photobioreactor research laboratory for microalgae biotechnology" /><span className="visual-badge">Microalgae research</span></div><div className="hero-image-card hero-image-card--secondary"><img src="/assets/microscope-chlorella.jpg" alt="Fluorescence microscopy of microalgae cells" /><span className="visual-badge">Bioenergy lab</span></div></div><div className="hero-stat"><strong>{resources.length > 0 ? resources.length.toLocaleString(language) : '30,000+'}</strong><span>{t('hero.resources_label')}</span><strong>{totalCategories}</strong><span>{t('hero.categories_label')}</span></div></section>
    
    {/* Scientific Quick Launch Bar */}
    <div className="phase2-features-banner">
      <button 
        type="button" 
        className="phase2-feature-btn" 
        onClick={() => setStrainsAtlasOpen(true)}
      >
        <span className="phase2-btn-icon">🧬</span>
        <div className="phase2-btn-text">
          <strong>{t('strainsAtlas')}</strong>
          <small>{t('strainsAtlasDesc')}</small>
        </div>
      </button>
      <button 
        type="button" 
        className="phase2-feature-btn" 
        onClick={() => { setInitialMediumId('zarrouk'); setMediaModalOpen(true); }}
      >
        <span className="phase2-btn-icon">🧪</span>
        <div className="phase2-btn-text">
          <strong>{t('mediaCalculator')}</strong>
          <small>{t('mediaCalculatorDesc')}</small>
        </div>
      </button>
      <button 
        type="button" 
        className="phase2-feature-btn" 
        onClick={() => setComparisonOpen(true)}
      >
        <span className="phase2-btn-icon">⚖️</span>
        <div className="phase2-btn-text">
          <strong>{t('comparePapers')}</strong>
          <small>{comparedPaperIds.length > 0 ? `${comparedPaperIds.length} ${t('compared')}` : t('comparisonTitle')}</small>
        </div>
        {comparedPaperIds.length > 0 && (
          <span className="phase2-count-badge">{comparedPaperIds.length}</span>
        )}
      </button>
      <button 
        type="button" 
        className="phase2-feature-btn" 
        onClick={() => setSopsOpen(true)}
      >
        <span className="phase2-btn-icon">📋</span>
        <div className="phase2-btn-text">
          <strong>{language === 'ar' ? 'بروتوكولات المعامل' : 'Lab Protocols'}</strong>
          <small>{language === 'ar' ? 'دليل البروتوكولات المعملية القياسية' : 'Standard Operating Protocols Directory'}</small>
        </div>
      </button>
      <button 
        type="button" 
        className="phase2-feature-btn" 
        onClick={() => setCollabOpen(true)}
      >
        <span className="phase2-btn-icon">🤝</span>
        <div className="phase2-btn-text">
          <strong>{language === 'ar' ? 'نظام التعاون' : 'Collaboration'}</strong>
          <small>{language === 'ar' ? 'نظام طلب التعاون وتبادل السلالات' : 'Collaboration Request & Strain Exchange'}</small>
        </div>
      </button>
    </div>

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
        isCompared={(id) => comparedPaperIds.includes(id)}
        onToggleCompare={handleToggleCompare}
        isExploring={isExploring}
        onStartExploring={() => setIsExploring(true)}
        onStopExploring={() => setIsExploring(false)}
      />
      <ScientificLabSuite 
        onOpenStrainsAtlas={() => setStrainsAtlasOpen(true)}
        onOpenMediaCalculator={() => { setInitialMediumId('zarrouk'); setMediaModalOpen(true); }}
      />
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
      isCompared={quickViewResource ? comparedPaperIds.includes(quickViewResource.id) : false}
      onToggleCompare={handleToggleCompare}
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
    <AlgaeStrainsAtlasModal
      isOpen={strainsAtlasOpen}
      onClose={() => setStrainsAtlasOpen(false)}
      onSearchLibrary={(query) => {
        setSearchQuery(query);
        setIsExploring(true);
        setTimeout(() => {
          document.getElementById('research-discovery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }}
      onSelectMedium={(med) => {
        setInitialMediumId(med);
        setMediaModalOpen(true);
      }}
    />
    <GrowthMediaModal
      isOpen={mediaModalOpen}
      onClose={() => setMediaModalOpen(false)}
      initialMediumId={initialMediumId}
      onSearchLibrary={(query) => {
        setSearchQuery(query);
        setIsExploring(true);
        setTimeout(() => {
          document.getElementById('research-discovery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }}
    />
    <PaperComparisonModal
      isOpen={comparisonOpen}
      onClose={() => setComparisonOpen(false)}
      selectedPapers={resources.filter(r => comparedPaperIds.includes(r.id))}
      onRemovePaper={(idNum) => setComparedPaperIds(prev => prev.filter(id => id !== idNum))}
      onClearAll={() => setComparedPaperIds([])}
      onOpenQuickView={(paper) => setQuickViewResource(paper)}
    />
    <SopDirectoryModal isOpen={sopsOpen} onClose={() => setSopsOpen(false)} />
    <ConferencesAgendaModal isOpen={agendaOpen} onClose={() => setAgendaOpen(false)} />
    <CollaborationSystemModal isOpen={collabOpen} onClose={() => setCollabOpen(false)} />
  </div>;
}
