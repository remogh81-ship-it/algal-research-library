import type { Filters, Paper } from '../types';

export async function loadAlgaeDatabase(): Promise<Paper[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}algae_database.json`);
  if (!response.ok) throw new Error(`Unable to load algae database (${response.status})`);
  const records: unknown = await response.json();
  if (!Array.isArray(records)) throw new Error('Algae database has an invalid format');
  return records as Paper[];
}

export function filterPapers(papers: Paper[], filters: Filters): Paper[] {
  const query = (value: string) => value.trim().toLocaleLowerCase();
  return papers.filter((paper) =>
    (!filters.topic || query(paper.topic).includes(query(filters.topic))) &&
    (!filters.year || String(paper.year) === filters.year) &&
    (!filters.author || query(paper.authors).includes(query(filters.author))) &&
    (!filters.doi || query(paper.doi).includes(query(filters.doi))) &&
    (!filters.language || query(paper.language) === query(filters.language)),
  );
}
