import { classifyPhycologyPaper, CATEGORY_ARABIC_MAP } from '../data/categories';
import type { Resource } from '../types/resource';

export interface RawAcademicWork {
  title: string;
  authors?: string;
  year?: number;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  algaeType?: string;
}

/**
 * Extracts clean 16-digit ORCID with hyphens (e.g. 0000-0002-1825-0097)
 */
export function cleanOrcid(input?: string): string | null {
  if (!input) return null;
  const match = input.match(/(\d{4}-\d{4}-\d{4}-[\dX]{4})/i);
  return match ? match[1].toUpperCase() : null;
}

/**
 * Detects target algae genus/species from text for automated strain indexing
 */
export function detectAlgaeStrain(text: string): string {
  const t = text.toLowerCase();
  if (/(arthrospira|spirulina)/.test(t)) return 'Arthrospira platensis (Spirulina)';
  if (/chlorella vulgaris/.test(t)) return 'Chlorella vulgaris';
  if (/chlorella sorokiniana/.test(t)) return 'Chlorella sorokiniana';
  if (/chlorella pyrenoidosa/.test(t)) return 'Chlorella pyrenoidosa';
  if (/chlorella/.test(t)) return 'Chlorella sp.';
  if (/(scenedesmus obliquus|tetradesmus obliquus)/.test(t)) return 'Scenedesmus obliquus';
  if (/scenedesmus/.test(t)) return 'Scenedesmus sp.';
  if (/dunaliella/.test(t)) return 'Dunaliella salina';
  if (/haematococcus/.test(t)) return 'Haematococcus pluvialis';
  if (/nannochloropsis/.test(t)) return 'Nannochloropsis sp.';
  if (/(ulva|sea lettuce)/.test(t)) return 'Ulva lactuca (Green seaweed)';
  if (/sargassum/.test(t)) return 'Sargassum sp. (Brown seaweed)';
  if (/nostoc/.test(t)) return 'Nostoc muscorum';
  if (/anabaena/.test(t)) return 'Anabaena sp.';
  if (/microcystis/.test(t)) return 'Microcystis aeruginosa';
  if (/(phaeodactylum|diatom)/.test(t)) return 'Phaeodactylum tricornutum (Diatom)';
  if (/euglena/.test(t)) return 'Euglena gracilis';
  return 'Microalgae consortium';
}

function reconstructAbstract(invertedIndex?: Record<string, number[]>): string {
  if (!invertedIndex) return '';
  const wordEntries: [number, string][] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      wordEntries.push([pos, word]);
    }
  }
  wordEntries.sort((a, b) => a[0] - b[0]);
  return wordEntries.map(([_, word]) => word).join(' ');
}

/**
 * Fetch works from OpenAlex API using ORCID iD
 */
export async function fetchWorksFromOpenAlex(orcid: string): Promise<RawAcademicWork[]> {
  const cleanId = cleanOrcid(orcid);
  if (!cleanId) return [];

  const url = `https://api.openalex.org/works?filter=author.orcid:${encodeURIComponent(cleanId)}&per-page=50`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`OpenAlex API error: ${response.status}`);
  
  const data = await response.json();
  const results = data.results || [];
  
  return results.map((item: any) => {
    const title = item.title || 'Untitled Publication';
    const authors = (item.authorships || [])
      .map((a: any) => a.author?.display_name)
      .filter(Boolean)
      .join(', ') || 'Unknown Authors';
    const year = item.publication_year || new Date().getFullYear();
    const journal = item.primary_location?.source?.display_name || item.biblio?.journal || '';
    const volume = String(item.biblio?.volume || '');
    const issue = String(item.biblio?.issue || '');
    const pages = [item.biblio?.first_page, item.biblio?.last_page].filter(Boolean).join('-');
    const doiUrl = item.doi || '';
    const doi = doiUrl.replace(/^https?:\/\/doi\.org\//i, '');
    const abstract = reconstructAbstract(item.abstract_inverted_index);

    return {
      title,
      authors,
      year,
      journal,
      volume,
      issue,
      pages,
      doi,
      url: doiUrl || item.id || '',
      abstract,
      algaeType: detectAlgaeStrain(`${title} ${abstract}`)
    };
  });
}

/**
 * Fallback fetch using the official ORCID Public REST API
 */
export async function fetchWorksFromOrcidRest(orcid: string): Promise<RawAcademicWork[]> {
  const cleanId = cleanOrcid(orcid);
  if (!cleanId) return [];

  const url = `https://pub.orcid.org/v3.0/${cleanId}/works`;
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  });
  if (!response.ok) throw new Error(`ORCID API error: ${response.status}`);

  const data = await response.json();
  const groups = data.group || [];
  
  return groups.map((g: any) => {
    const summary = g['work-summary']?.[0];
    const title = summary?.title?.title?.value || 'Untitled Publication';
    const journal = summary?.['journal-title']?.value || '';
    const pubDate = summary?.['publication-date'];
    const year = Number(pubDate?.year?.value) || new Date().getFullYear();
    
    // Find DOI in external ids
    const extIds = summary?.['external-ids']?.['external-id'] || [];
    const doiObj = extIds.find((id: any) => id['external-id-type']?.toLowerCase() === 'doi');
    const doi = doiObj ? doiObj['external-id-value'] : '';
    const doiUrl = doi ? `https://doi.org/${doi}` : (summary?.url?.value || '');

    return {
      title,
      authors: '',
      year,
      journal,
      doi,
      url: doiUrl,
      algaeType: detectAlgaeStrain(title)
    };
  });
}

/**
 * Unified ORCID fetcher: Tries OpenAlex first for rich metadata & abstracts,
 * falls back to ORCID Public API.
 */
export async function fetchWorksFromOrcid(orcid: string): Promise<RawAcademicWork[]> {
  try {
    const openAlexWorks = await fetchWorksFromOpenAlex(orcid);
    if (openAlexWorks.length > 0) return openAlexWorks;
  } catch (err) {
    console.warn('OpenAlex fetch failed, attempting ORCID REST API fallback:', err);
  }

  try {
    return await fetchWorksFromOrcidRest(orcid);
  } catch (err) {
    console.error('ORCID REST API fallback failed:', err);
    throw err;
  }
}

/**
 * Robust BibTeX parser for Google Scholar exports.
 */
export function parseScholarBibTeX(bibTeX: string): RawAcademicWork[] {
  const works: RawAcademicWork[] = [];
  if (!bibTeX || !bibTeX.trim()) return works;

  // Split entries by @type{
  const entryRegex = /@(\w+)\s*\{([^,]*),([\s\S]*?)(?=\n@|\s*$)/g;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(bibTeX)) !== null) {
    const body = match[3];
    const getField = (fieldName: string): string => {
      const reg = new RegExp(`${fieldName}\\s*=\\s*[{"]([^}"]*)[}"]|${fieldName}\\s*=\\s*(\\d+)`, 'i');
      const m = reg.exec(body);
      return (m ? (m[1] || m[2]) : '').trim();
    };

    const title = getField('title').replace(/[{}]/g, '');
    if (!title) continue;

    const authors = getField('author').replace(/[{}]/g, '').replace(/\s+and\s+/gi, ', ');
    const journal = getField('journal') || getField('booktitle') || getField('publisher');
    const year = Number(getField('year')) || new Date().getFullYear();
    const volume = getField('volume');
    const issue = getField('number') || getField('issue');
    const pages = getField('pages').replace(/--/g, '-');
    const doi = getField('doi');
    const url = getField('url') || (doi ? `https://doi.org/${doi}` : '');
    const abstract = getField('abstract') || getField('note');

    works.push({
      title,
      authors: authors || 'Unknown Authors',
      year,
      journal,
      volume,
      issue,
      pages,
      doi,
      url,
      abstract,
      algaeType: detectAlgaeStrain(`${title} ${abstract}`)
    });
  }

  return works;
}

/**
 * Transforms fetched academic works into full Library Resource entities:
 * 1. Executes intelligent phycological classification into the 12 master domains
 * 2. Detects target algae strains
 * 3. Formats metadata and assigns ownerId
 */
export function syncAndClassifyPapers(
  rawWorks: RawAcademicWork[],
  ownerId: string,
  authorNameFallback?: string
): Resource[] {
  return rawWorks.map((work, idx) => {
    const category = classifyPhycologyPaper(work.title, work.abstract);
    const categoryArabic = CATEGORY_ARABIC_MAP[category] || 'علم الطحالب التطبيقي والتكنولوجيا الحيوية';
    const authors = work.authors && work.authors !== 'Unknown Authors'
      ? work.authors
      : (authorNameFallback || 'Unknown Authors');

    // Generate unique ID in the 800,000,000 range
    const uniqueId = 800000000 + Math.floor(Date.now() % 100000000) + idx;

    return {
      id: uniqueId,
      ownerId,
      title: work.title,
      titleArabic: work.title,
      category,
      categoryArabic,
      algaeType: work.algaeType || detectAlgaeStrain(work.title),
      authors,
      year: work.year || new Date().getFullYear(),
      journal: work.journal || 'Academic Publication',
      volume: work.volume || '',
      issue: work.issue || '',
      pages: work.pages || '',
      doi: work.doi || '',
      summary_ar: work.abstract || '',
      summary_en: work.abstract,
      url: work.url || (work.doi ? `https://doi.org/${work.doi}` : ''),
      pdfUrl: ''
    };
  });
}
