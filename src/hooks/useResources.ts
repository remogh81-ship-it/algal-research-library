import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Resource } from '../types/resource';
import { getSubmittedResources, loadResources, type ResourceLoadProgress } from '../services/resourceLoader';
import { useAuth } from '../auth';

export const RESOURCE_PAGE_SIZE = 50;

export type ResourceFilters = {
  category: string;
  year: string;
};

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

export function useResources() {
  useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ResourceFilters>({ category: '', year: '' });
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

  const categories = useMemo(() => [...new Set(resources.flatMap((resource) => [resource.category, resource.categoryArabic]).filter(Boolean))].sort(), [resources]);
  const years = useMemo(() => [...new Set(resources.map((resource) => resource.year).filter(Boolean))].sort((a, b) => b - a), [resources]);
  const filteredResources = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return resources.filter((resource) => {
      const searchable = [resource.title, resource.titleArabic, resource.authors, resource.category, resource.categoryArabic, resource.doi].join(' ').toLocaleLowerCase();
      return (!query || searchable.includes(query)) &&
        (!filters.category || resource.category === filters.category || resource.categoryArabic === filters.category) &&
        (!filters.year || String(resource.year) === filters.year);
    });
  }, [filters, resources, search]);
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / RESOURCE_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleResources = filteredResources.slice((currentPage - 1) * RESOURCE_PAGE_SIZE, currentPage * RESOURCE_PAGE_SIZE);

  const updateSearch = useCallback((value: string) => { setSearch(value); setPage(1); }, []);
  const updateFilters = useCallback((next: ResourceFilters) => { setFilters(next); setPage(1); }, []);
  const setCurrentPage = useCallback((nextPage: number) => setPage(Math.max(1, Math.min(nextPage, totalPages))), [totalPages]);

  return {
    resources, visibleResources, filteredResources, categories, years, search, filters,
    isLoading, error, progress, page: currentPage, totalPages,
    setSearch: updateSearch, setFilters: updateFilters, setPage: setCurrentPage,
  };
}
