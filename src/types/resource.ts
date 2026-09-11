export interface RawResource {
  i?: number;
  id?: number;
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
  p?: string;
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

export function mapResource(raw: RawResource): Resource {
  return {
    id: raw.i ?? raw.id ?? 0,
    title: raw.t ?? raw.title ?? 'Untitled',
    titleArabic: raw.ta ?? raw.title_ar ?? raw.t ?? '',
    category: raw.c ?? raw.category ?? 'General',
    categoryArabic: raw.ca ?? raw.category_ar ?? '',
    algaeType: raw.algae_type ?? raw.algaeType ?? '',
    authors: raw.a ?? raw.authors ?? 'Unknown',
    year: raw.y ?? raw.year ?? new Date().getFullYear(),
    journal: raw.j ?? raw.journal ?? raw.journal_publisher ?? '',
    doi: raw.d ?? raw.doi ?? '',
    summary_ar: raw.summary_ar ?? raw.s ?? '',
    summary_en: raw.summary_en,
    summary_fr: raw.summary_fr,
    summary_de: raw.summary_de,
    summary_zh: raw.summary_zh,
    summary_it: raw.summary_it,
    url: raw.u ?? raw.url ?? '',
    pdfUrl: raw.p ?? raw.pdf_url ?? '',
  };
}

export const mapRawToResource = mapResource;
