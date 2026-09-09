import type { Filters } from '../types';
import { AdSlot } from './AdSlot';

type Props = { filters: Filters; onChange: (filters: Filters) => void };

export function SearchFilters({ filters, onChange }: Props) {
  const update = (field: keyof Filters, value: string) => onChange({ ...filters, [field]: value });
  return <aside className="filters">
    <h2>تصفية النتائج</h2>
    <label>الموضوع<input value={filters.topic} onChange={(e) => update('topic', e.target.value)} /></label>
    <label>السنة<input value={filters.year} onChange={(e) => update('year', e.target.value)} inputMode="numeric" /></label>
    <label>المؤلف<input value={filters.author} onChange={(e) => update('author', e.target.value)} /></label>
    <label>DOI<input value={filters.doi} onChange={(e) => update('doi', e.target.value)} /></label>
    <label>اللغة<select value={filters.language} onChange={(e) => update('language', e.target.value)}><option value="">الكل</option><option>Arabic</option><option>English</option><option>Italian</option></select></label>
    <AdSlot variant="sidebar" />
  </aside>;
}
