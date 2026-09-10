export interface RawResource {
  i: number;
  t: string;
  ta: string;
  c: string;
  ca: string;
  a: string;
  y: number;
  j: string;
  d: string;
  s: string;
  u: string;
  p: string;
}

export interface Resource {
  id: number;
  title: string;
  titleArabic: string;
  category: string;
  categoryArabic: string;
  authors: string;
  year: number;
  journal: string;
  doi: string;
  summary: string;
  url: string;
  pdfUrl: string;
}

export function mapRawToResource(raw: RawResource): Resource {
  return {
    id: raw.i,
    title: raw.t,
    titleArabic: raw.ta,
    category: raw.c,
    categoryArabic: raw.ca,
    authors: raw.a,
    year: raw.y,
    journal: raw.j,
    doi: raw.d,
    summary: raw.s,
    url: raw.u,
    pdfUrl: raw.p,
  };
}
