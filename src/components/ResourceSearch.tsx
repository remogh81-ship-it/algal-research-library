import { useEffect, useState } from 'react';
import { ArrowUpDown, ChevronDown, Copy, Download, ExternalLink, FileText, Quote, Search } from 'lucide-react';
import { downloadRIS, formatAPA, formatBibTeX, formatMLA, formatRIS, useResources, type ResourceFilters, type SortOption } from '../hooks/useResources';
import type { Resource } from '../types/resource';
import { useI18n } from '../i18n';
import { useAuth } from '../auth';
import { getLocalizedSummary } from '../utils/translateSummary';

function CitationButtons({ resource }: { resource: Resource }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState('');
  const copy = async (label: string, citation: string) => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(label);
    } catch {
      setCopied('');
    }
    window.setTimeout(() => setCopied(''), 1600);
  };
  return <div className="resource-actions">
    {resource.doi && <a className="button-link" href={resource.doi.startsWith('http') ? resource.doi : `https://doi.org/${resource.doi}`} target="_blank" rel="noreferrer"><ExternalLink size={15} /> {t('doi')}</a>}
    {resource.pdfUrl && <a className="button-link" href={resource.pdfUrl} target="_blank" rel="noreferrer"><FileText size={15} /> {t('pdf')}</a>}
    <div className="citation-menu">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}><Quote size={15} /> {t('citation')} <ChevronDown size={14} /></button>
      {open && <div className="citation-dropdown" role="menu">
        <button type="button" role="menuitem" onClick={() => void copy('APA', formatAPA(resource))}><Copy size={14} /> {copied === 'APA' ? t('citationCopied') : t('apaFormat')}</button>
        <button type="button" role="menuitem" onClick={() => void copy('MLA', formatMLA(resource))}><Copy size={14} /> {copied === 'MLA' ? t('citationCopied') : t('mlaFormat')}</button>
        <button type="button" role="menuitem" onClick={() => void copy('BibTeX', formatBibTeX(resource))}><Copy size={14} /> {copied === 'BibTeX' ? t('citationCopied') : t('bibtexFormat')}</button>
        <button type="button" role="menuitem" onClick={() => void copy('RIS', formatRIS(resource))}><Copy size={14} /> {copied === 'RIS' ? t('citationCopied') : t('risFormat')}</button>
        <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
        <button type="button" role="menuitem" onClick={() => downloadRIS([resource])}><Download size={14} /> {t('downloadRIS')}</button>
      </div>}
      {copied && <span className="citation-toast" role="status">{t('citationCopied')}</span>}
    </div>
  </div>;
}

const SORT_OPTIONS: { value: SortOption; labelKey: string }[] = [
  { value: 'newest', labelKey: 'sortNewest' },
  { value: 'oldest', labelKey: 'sortOldest' },
  { value: 'title_asc', labelKey: 'sortTitleAZ' },
  { value: 'title_desc', labelKey: 'sortTitleZA' },
  { value: 'relevance', labelKey: 'sortRelevance' },
];

export function ResourceSearch({
  mineOnly = false,
  selectedPaperIds = [],
  onTogglePaper,
  searchQuery,
  onSearchQueryChange,
}: {
  mineOnly?: boolean;
  selectedPaperIds?: number[];
  onTogglePaper?: (id: number) => void;
  searchQuery?: string;
  onSearchQueryChange?: (q: string) => void;
}) {
  const { t, category, language } = useI18n();
  const { user } = useAuth();
  const {
    visibleResources, filteredResources, categories, years, journals, algaeTypes,
    search, filters, sortBy, isLoading, error, progress,
    page, totalPages, setSearch, setFilters, setSortBy, setPage,
  } = useResources();
  const scopedResources = mineOnly && user ? filteredResources.filter((resource) => resource.ownerId === user.id) : filteredResources;
  const [searchInput, setSearchInput] = useState(searchQuery || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== searchInput) {
      setSearchInput(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput);
      onSearchQueryChange?.(searchInput);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput, setSearch, onSearchQueryChange]);
  const updateFilter = (key: keyof ResourceFilters, value: string) => setFilters({ ...filters, [key]: value });

  return <section className="resource-search" aria-label={t('searchLabel')}>
    <div className="resource-search-header"><div><span className="eyebrow">RESEARCH DISCOVERY</span><h1>{mineOnly ? 'My submissions' : t('explore')}</h1><p>{t('indexed', { count: scopedResources.length.toLocaleString(language) })}</p></div><Search size={27} /></div>
    
    {/* Primary Controls: Search + Category + Year + Sort */}
    <div className="resource-controls">
      <label className="resource-query"><span className="sr-only">{t('searchLabel')}</span><Search size={18} /><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder={t('searchPlaceholder')} /></label>
      <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)} aria-label={t('allCategories')}><option value="">{t('allCategories')}</option>{categories.map((value) => <option key={value} value={value}>{category(value)}</option>)}</select>
      <select value={filters.year} onChange={(event) => updateFilter('year', event.target.value)} aria-label={t('allYears')}><option value="">{t('allYears')}</option>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select>
      <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} aria-label={t('sortLabel')} className="sort-select">
        {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
      </select>
    </div>

    {/* Advanced Filters Toggle */}
    <div className="advanced-filters-toggle">
      <button type="button" className="toggle-advanced-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
        <ArrowUpDown size={14} />
        {t('advancedFilters')}
        <ChevronDown size={14} style={{ transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {filteredResources.length > 0 && (
        <button type="button" className="export-all-btn" onClick={() => downloadRIS(filteredResources.slice(0, 100), 'algae-research-export.ris')}>
          <Download size={14} /> {t('exportRIS')} ({Math.min(filteredResources.length, 100)})
        </button>
      )}
    </div>

    {/* Advanced Filters Panel */}
    {showAdvanced && <div className="advanced-filters-panel">
      <select value={filters.journal} onChange={(event) => updateFilter('journal', event.target.value)} aria-label={t('allJournals')}>
        <option value="">{t('allJournals')}</option>
        {journals.slice(0, 100).map((j) => <option key={j} value={j}>{j}</option>)}
      </select>
      <select value={filters.algaeType} onChange={(event) => updateFilter('algaeType', event.target.value)} aria-label={t('allAlgaeTypes')}>
        <option value="">{t('allAlgaeTypes')}</option>
        {algaeTypes.map((at) => <option key={at} value={at}>{at}</option>)}
      </select>
    </div>}

    {isLoading && <p className="loading-message">{t('loading', { phase: progress?.phase ?? 'cache' })}</p>}
    {error && <p className="error">{error}</p>}
    {!isLoading && !error && scopedResources.length === 0 && <p className="loading-message">{t('noResults')}</p>}
    <div className="resource-grid">{visibleResources.filter((resource) => !mineOnly || resource.ownerId === user?.id).map((resource) => <article className="resource-card" key={resource.id}>
      {onTogglePaper && <label><input type="checkbox" checked={selectedPaperIds.includes(resource.id)} onChange={() => onTogglePaper(resource.id)} /> Select for AI summary</label>}
      <h2>{resource.title || resource.titleArabic} {language !== 'en' && language !== 'ar' && resource.title && <small className="fallback-indicator">({t('fallback')})</small>}</h2>
      {resource.titleArabic && resource.title !== resource.titleArabic && <p className="resource-arabic" lang="ar" dir="rtl">{resource.titleArabic}</p>}
      <p className="resource-meta">{resource.authors || t('unknownAuthors')} · {resource.year || 'n.d.'} · {resource.journal || t('unknownJournal')}</p>
      {resource.algaeType && <span className="algae-type-badge">{resource.algaeType}</span>}
      <p className="resource-category">{category(resource.category)}</p>
      <p className="resource-summary">{getLocalizedSummary(resource, language)}</p>
      <CitationButtons resource={resource} />
    </article>)}</div>
    {totalPages > 1 && <nav className="pagination" aria-label={t('page', { page, total: totalPages })}><button disabled={page === 1} onClick={() => setPage(page - 1)}>{t('previous')}</button><span>{t('page', { page, total: totalPages })}</span><button disabled={page === totalPages} onClick={() => setPage(page + 1)}>{t('next')}</button></nav>}
  </section>;
}
