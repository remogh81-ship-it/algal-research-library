import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Resource } from '../types/resource';
import { getSubmittedResources, loadResources, type ResourceLoadProgress } from '../services/resourceLoader';
import { useAuth } from '../auth';
import { MASTER_CATEGORIES, normalizeCategory } from '../data/categories';

export const RESOURCE_PAGE_SIZE = 50;

export type SortOption = 'newest' | 'oldest' | 'title_asc' | 'title_desc' | 'relevance';

export type ResourceFilters = {
  category: string;
  year: string;
  journal: string;
  algaeType: string;
};

/* ---- Citation Formatters ---- */

export function formatAPA(resource: Resource): string {
  return `${resource.authors} (${resource.year}). ${resource.title}. ${resource.journal}.${resource.doi ? ` https://doi.org/${resource.doi.replace(/^https?:\/\/doi.org\//, '')}` : ''}`;
}

export function formatMLA(resource: Resource): string {
  return `${resource.authors}. "${resource.title}." ${resource.journal}, ${resource.year}.${resource.doi ? ` DOI: ${resource.doi}` : ''}`;
}

export function formatBibTeX(resource: Resource): string {
  const key = `${resource.authors.split(/[, ]/)[0] || 'resource'}${resource.year}`;
  return `@article{${key},\n  author = {${resource.authors}},\n  title = {${resource.title}},\n  journal = {${resource.journal}},\n  year = {${resource.year}},\n  doi = {${resource.doi}}\n}`;
}

export function formatRIS(resource: Resource): string {
  const lines: string[] = [
    'TY  - JOUR',
    `TI  - ${resource.title}`,
  ];
  // Split authors and add each as AU
  const authors = resource.authors.split(/\s*[,;&]\s*/).filter(Boolean);
  for (const author of authors) {
    lines.push(`AU  - ${author.trim()}`);
  }
  lines.push(`PY  - ${resource.year}`);
  lines.push(`JO  - ${resource.journal}`);
  if (resource.volume) lines.push(`VL  - ${resource.volume}`);
  if (resource.issue) lines.push(`IS  - ${resource.issue}`);
  if (resource.pages) lines.push(`SP  - ${resource.pages}`);
  if (resource.doi) {
    const cleanDoi = resource.doi.replace(/^https?:\/\/doi.org\//, '');
    lines.push(`DO  - ${cleanDoi}`);
    lines.push(`UR  - https://doi.org/${cleanDoi}`);
  } else if (resource.url) {
    lines.push(`UR  - ${resource.url}`);
  }
  if (resource.summary_ar) lines.push(`AB  - ${resource.summary_ar}`);
  lines.push('ER  - ');
  return lines.join('\n');
}

/** Download an RIS file for one or more resources */
export function downloadRIS(resources: Resource[], filename = 'algae-research.ris'): void {
  const content = resources.map(formatRIS).join('\n\n');
  const blob = new Blob([content], { type: 'application/x-research-info-systems' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---- Sort Helpers ---- */

function sortResources(resources: Resource[], sortBy: SortOption, searchQuery: string): Resource[] {
  const sorted = [...resources];
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => b.year - a.year);
    case 'oldest':
      return sorted.sort((a, b) => a.year - b.year);
    case 'title_asc':
      return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'title_desc':
      return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    case 'relevance':
    default:
      if (!searchQuery.trim()) return sorted.sort((a, b) => b.year - a.year);
      // Simple relevance: title match gets higher priority
      const q = searchQuery.trim().toLocaleLowerCase();
      return sorted.sort((a, b) => {
        const aTitle = (a.title || '').toLocaleLowerCase();
        const bTitle = (b.title || '').toLocaleLowerCase();
        const aScore = aTitle.includes(q) ? 2 : 0;
        const bScore = bTitle.includes(q) ? 2 : 0;
        if (aScore !== bScore) return bScore - aScore;
        return b.year - a.year;
      });
  }
}

/* ---- Main Hook ---- */

export function useResources() {
  useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ResourceFilters>({ category: '', year: '', journal: '', algaeType: '' });
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ResourceLoadProgress | null>(null);

  useEffect(() => {
    let active = true;
    const load = () => Promise.all([loadResources((nextProgress) => {
      if (active) setProgress(nextProgress);
    }), getSubmittedResources()]).then(([loaded, submitted]) => {
      if (active) setResources([...submitted, ...loaded]);
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : 'Unable to load resources');
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    void load();
    window.addEventListener('resources-updated', load);
    return () => { active = false; window.removeEventListener('resources-updated', load); };
  }, []);

  const categories = MASTER_CATEGORIES.slice();

  const years = useMemo(() => [...new Set(resources.map((resource) => resource.year).filter(Boolean))].sort((a, b) => b - a), [resources]);

  // Extract unique journals and algae types for advanced filtering
  const journals = useMemo(() => [...new Set(resources.map((r) => r.journal).filter(Boolean))].sort(), [resources]);
  const algaeTypes = useMemo(() => [...new Set(resources.map((r) => r.algaeType).filter(Boolean))].sort(), [resources]);

  const filteredResources = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const filtered = resources.filter((resource) => {
      const searchable = [resource.title, resource.titleArabic, resource.authors, resource.category, resource.categoryArabic, normalizeCategory(resource.category) ?? '', normalizeCategory(resource.categoryArabic) ?? '', resource.doi].join(' ').toLocaleLowerCase();
      return (!query || searchable.includes(query)) &&
        (!filters.category || normalizeCategory(resource.category) === filters.category || normalizeCategory(resource.categoryArabic) === filters.category) &&
        (!filters.year || String(resource.year) === filters.year) &&
        (!filters.journal || resource.journal === filters.journal) &&
        (!filters.algaeType || resource.algaeType === filters.algaeType);
    });
    return sortResources(filtered, sortBy, search);
  }, [filters, resources, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredResources.length / RESOURCE_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleResources = filteredResources.slice((currentPage - 1) * RESOURCE_PAGE_SIZE, currentPage * RESOURCE_PAGE_SIZE);

  const updateSearch = useCallback((value: string) => { setSearch(value); setPage(1); }, []);
  const updateFilters = useCallback((next: ResourceFilters) => { setFilters(next); setPage(1); }, []);
  const updateSort = useCallback((next: SortOption) => { setSortBy(next); setPage(1); }, []);
  const setCurrentPage = useCallback((nextPage: number) => setPage(Math.max(1, Math.min(nextPage, totalPages))), [totalPages]);

  return {
    resources, visibleResources, filteredResources, categories, years, journals, algaeTypes,
    search, filters, sortBy, isLoading, error, progress, page: currentPage, totalPages,
    setSearch: updateSearch, setFilters: updateFilters, setSortBy: updateSort, setPage: setCurrentPage,
  };
}
