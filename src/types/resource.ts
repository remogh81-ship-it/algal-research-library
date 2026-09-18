import { classifyPhycologyPaper, CATEGORY_ARABIC_MAP } from '../data/categories';

export interface RawResource {
  i?: number | string;
  id?: number | string;
  t?: string;
  title?: string;
  ta?: string;
  title_ar?: string;
  c?: string;
  category?: string;
  ca?: string;
  category_ar?: string;
  algae_type?: string;
  algaeType?: string;
  a?: string;
  authors?: string;
  y?: number;
  year?: number;
  j?: string;
  journal?: string;
  volume?: string | number;
  issue?: string | number;
  pages?: string | number;
  v?: string | number;
  issue_number?: string | number;
  journal_publisher?: string;
  d?: string;
  doi?: string;
  s?: string;
  summary_ar?: string;
  summary_en?: string;
  summary_fr?: string;
  summary_de?: string;
  summary_zh?: string;
  summary_it?: string;
  u?: string;
  url?: string;
  p?: string | number;
  pdf_url?: string;
}

export interface Resource {
  id: number;
  ownerId?: string;
  title: string;
  titleArabic: string;
  category: string;
  categoryArabic: string;
  algaeType: string;
  authors: string;
  year: number;
  journal: string;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
  summary_ar: string;
  summary_en?: string;
  summary_fr?: string;
  summary_de?: string;
  summary_zh?: string;
  summary_it?: string;
  url: string;
  pdfUrl: string;
}

export function mapResource(raw: RawResource, fallbackId = 0): Resource {
  const title = raw.t ?? raw.title ?? 'Untitled';
  const summary = raw.summary_en ?? raw.summary_ar ?? raw.s ?? '';
  const rawCategory = raw.c ?? raw.category ?? '';
  
  // Reclassify paper scientifically into standard phycology domains
  const standardCategory = classifyPhycologyPaper(title, summary, rawCategory);
  const standardCategoryArabic = CATEGORY_ARABIC_MAP[standardCategory] || raw.ca || raw.category_ar || '';

  return {
    id: typeof raw.i === 'number' ? raw.i : (typeof raw.id === 'number' ? raw.id : fallbackId),
    title,
    titleArabic: raw.ta ?? raw.title_ar ?? raw.t ?? '',
    category: standardCategory,
    categoryArabic: standardCategoryArabic,
    algaeType: raw.algae_type ?? raw.algaeType ?? '',
    authors: raw.a ?? raw.authors ?? 'Unknown',
    year: raw.y ?? raw.year ?? new Date().getFullYear(),
    journal: raw.j ?? raw.journal ?? raw.journal_publisher ?? '',
    volume: String(raw.v ?? raw.volume ?? ''),
    issue: String(raw.i ?? raw.issue ?? raw.issue_number ?? ''),
    pages: String(raw.p ?? raw.pages ?? ''),
    doi: raw.d ?? raw.doi ?? '',
    summary_ar: raw.summary_ar ?? raw.s ?? '',
    summary_en: raw.summary_en,
    summary_fr: raw.summary_fr,
    summary_de: raw.summary_de,
    summary_zh: raw.summary_zh,
    summary_it: raw.summary_it,
    url: raw.u ?? raw.url ?? '',
    pdfUrl: String(raw.pdf_url ?? (typeof raw.p === 'string' && /^https?:\/\//i.test(raw.p) ? raw.p : '')),
  };
}

export const mapRawToResource = mapResource;
