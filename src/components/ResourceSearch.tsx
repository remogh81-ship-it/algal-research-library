import { useEffect, useState } from 'react';
import { Copy, ExternalLink, FileText, Search } from 'lucide-react';
import { formatAPA, formatBibTeX, formatMLA, useResources, type ResourceFilters } from '../hooks/useResources';
import type { Resource } from '../types/resource';

function CitationButtons({ resource }: { resource: Resource }) {
  const [copied, setCopied] = useState('');
  const copy = async (label: string, citation: string) => {
    await navigator.clipboard.writeText(citation);
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1600);
  };
  return <div className="resource-actions">
    {resource.doi && <a className="button-link" href={resource.doi.startsWith('http') ? resource.doi : `https://doi.org/${resource.doi}`} target="_blank" rel="noreferrer"><ExternalLink size={15} /> DOI</a>}
    {resource.pdfUrl && <a className="button-link" href={resource.pdfUrl} target="_blank" rel="noreferrer"><FileText size={15} /> PDF</a>}
    <button type="button" onClick={() => void copy('APA', formatAPA(resource))}><Copy size={15} /> {copied === 'APA' ? 'Copied' : 'APA'}</button>
    <button type="button" onClick={() => void copy('MLA', formatMLA(resource))}><Copy size={15} /> {copied === 'MLA' ? 'Copied' : 'MLA'}</button>
    <button type="button" onClick={() => void copy('BibTeX', formatBibTeX(resource))}><Copy size={15} /> {copied === 'BibTeX' ? 'Copied' : 'BibTeX'}</button>
  </div>;
}

export function ResourceSearch() {
  const { visibleResources, filteredResources, categories, years, search, filters, isLoading, error, progress, page, totalPages, setSearch, setFilters, setPage } = useResources();
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput, setSearch]);
  const updateFilter = (key: keyof ResourceFilters, value: string) => setFilters({ ...filters, [key]: value });

  return <section className="resource-search" aria-label="Academic resource search">
    <div className="resource-search-header"><div><h1>Explore algae research</h1><p>{filteredResources.length.toLocaleString()} indexed resources</p></div><Search size={27} /></div>
    <div className="resource-controls">
      <label className="resource-query"><span className="sr-only">Search title, authors, category, or DOI</span><Search size={18} /><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search titles, authors, categories, or DOI..." /></label>
      <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)} aria-label="Filter by category"><option value="">All categories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
      <select value={filters.year} onChange={(event) => updateFilter('year', event.target.value)} aria-label="Filter by year"><option value="">All years</option>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select>
    </div>
    {isLoading && <p className="loading-message">Loading the compressed research database ({progress?.phase ?? 'cache'})...</p>}
    {error && <p className="error">{error}</p>}
    {!isLoading && !error && visibleResources.length === 0 && <p className="loading-message">No resources match the current filters.</p>}
    <div className="resource-grid">{visibleResources.map((resource) => <article className="resource-card" key={resource.id}>
      <h2>{resource.title || resource.titleArabic}</h2>
      {resource.titleArabic && resource.title !== resource.titleArabic && <p className="resource-arabic" lang="ar" dir="rtl">{resource.titleArabic}</p>}
      <p className="resource-meta">{resource.authors || 'Unknown authors'} · {resource.year || 'n.d.'} · {resource.journal || 'Unknown journal'}</p>
      <p className="resource-category">{resource.category}</p>
      {resource.summary && <p className="resource-summary">{resource.summary}</p>}
      <CitationButtons resource={resource} />
    </article>)}</div>
    {totalPages > 1 && <nav className="pagination" aria-label="Resource pages"><button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button></nav>}
  </section>;
}
