import { useEffect, useState } from 'react';
import { Copy, ExternalLink, FileText, Search } from 'lucide-react';
import { formatAPA, formatBibTeX, formatMLA, useResources, type ResourceFilters } from '../hooks/useResources';
import type { Resource } from '../types/resource';
import { useI18n } from '../i18n';
import { useAuth } from '../auth';

function CitationButtons({ resource }: { resource: Resource }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState('');
  const copy = async (label: string, citation: string) => {
    await navigator.clipboard.writeText(citation);
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1600);
  };
  return <div className="resource-actions">
    {resource.doi && <a className="button-link" href={resource.doi.startsWith('http') ? resource.doi : `https://doi.org/${resource.doi}`} target="_blank" rel="noreferrer"><ExternalLink size={15} /> {t('doi')}</a>}
    {resource.pdfUrl && <a className="button-link" href={resource.pdfUrl} target="_blank" rel="noreferrer"><FileText size={15} /> {t('pdf')}</a>}
    <button type="button" onClick={() => void copy('APA', formatAPA(resource))}><Copy size={15} /> {copied === 'APA' ? t('copied') : t('apa')}</button>
    <button type="button" onClick={() => void copy('MLA', formatMLA(resource))}><Copy size={15} /> {copied === 'MLA' ? t('copied') : t('mla')}</button>
    <button type="button" onClick={() => void copy('BibTeX', formatBibTeX(resource))}><Copy size={15} /> {copied === 'BibTeX' ? t('copied') : t('bibtex')}</button>
  </div>;
}

export function ResourceSearch({ mineOnly = false }: { mineOnly?: boolean }) {
  const { t, category, language } = useI18n();
  const { user } = useAuth();
  const { visibleResources, filteredResources, categories, years, search, filters, isLoading, error, progress, page, totalPages, setSearch, setFilters, setPage } = useResources();
  const scopedResources = mineOnly && user ? filteredResources.filter((resource) => resource.ownerId === user.id) : filteredResources;
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput, setSearch]);
  const updateFilter = (key: keyof ResourceFilters, value: string) => setFilters({ ...filters, [key]: value });

  return <section className="resource-search" aria-label={t('searchLabel')}>
    <div className="resource-search-header"><div><span className="eyebrow">RESEARCH DISCOVERY</span><h1>{mineOnly ? 'My submissions' : t('explore')}</h1><p>{t('indexed', { count: scopedResources.length.toLocaleString(language) })}</p></div><Search size={27} /></div>
    <div className="resource-controls">
      <label className="resource-query"><span className="sr-only">{t('searchLabel')}</span><Search size={18} /><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder={t('searchPlaceholder')} /></label>
      <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)} aria-label={t('allCategories')}><option value="">{t('allCategories')}</option>{categories.map((value) => <option key={value} value={value}>{category(value)}</option>)}</select>
      <select value={filters.year} onChange={(event) => updateFilter('year', event.target.value)} aria-label={t('allYears')}><option value="">{t('allYears')}</option>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select>
    </div>
    {isLoading && <p className="loading-message">{t('loading', { phase: progress?.phase ?? 'cache' })}</p>}
    {error && <p className="error">{error}</p>}
    {!isLoading && !error && scopedResources.length === 0 && <p className="loading-message">{t('noResults')}</p>}
    <div className="resource-grid">{visibleResources.filter((resource) => !mineOnly || resource.ownerId === user?.id).map((resource) => <article className="resource-card" key={resource.id}>
      <h2>{resource.title || resource.titleArabic} {language !== 'en' && language !== 'ar' && resource.title && <small className="fallback-indicator">({t('fallback')})</small>}</h2>
      {resource.titleArabic && resource.title !== resource.titleArabic && <p className="resource-arabic" lang="ar" dir="rtl">{resource.titleArabic}</p>}
      <p className="resource-meta">{resource.authors || t('unknownAuthors')} · {resource.year || 'n.d.'} · {resource.journal || t('unknownJournal')}</p>
      <p className="resource-category">{category(resource.category)}</p>
      {resource.summary && <p className="resource-summary">{resource.summary}</p>}
      <CitationButtons resource={resource} />
    </article>)}</div>
    {totalPages > 1 && <nav className="pagination" aria-label={t('page', { page, total: totalPages })}><button disabled={page === 1} onClick={() => setPage(page - 1)}>{t('previous')}</button><span>{t('page', { page, total: totalPages })}</span><button disabled={page === totalPages} onClick={() => setPage(page + 1)}>{t('next')}</button></nav>}
  </section>;
}
