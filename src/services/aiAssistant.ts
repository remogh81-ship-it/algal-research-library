import { loadResources } from './resourceLoader';
import { askGemini } from './geminiService';
import type { Resource } from '../types/resource';
import { formatAPA, formatBibTeX, formatMLA } from '../hooks/useResources';

export type AssistantMode = 'live' | 'local';
export type AssistantIntent = 'search' | 'analysis' | 'citation' | 'general';
export type AssistantResult = { resource: Resource; relevance: number };
export type AssistantResponse = {
  answer: string;
  mode: AssistantMode;
  intent: AssistantIntent;
  results?: AssistantResult[];
  citations?: { apa: string; mla: string; bibtex: string };
};

const QUICK_PROMPTS = ['Latest biofuel research', 'Microalgae applications', 'Library statistics'];

function classifyIntent(prompt: string): AssistantIntent {
  if (/(apa|mla|bibtex|citation|توثيق|استشهاد)/i.test(prompt)) return 'citation';
  if (/(how many|count|statistics|statistic|most|عدد|إحصائيات|الأكثر|كم)/i.test(prompt)) return 'analysis';
  if (/(find|search|papers|research|أبحاث|ابحث|دراسة)/i.test(prompt)) return 'search';
  return 'general';
}

function rankResources(prompt: string, resources: Resource[]): AssistantResult[] {
  const normalized = prompt.toLocaleLowerCase();
  const terms = normalized.split(/[^\p{L}\p{N}]+/u).filter((term) => term.length > 2);
  return resources.map((resource) => {
    const haystack = [resource.title, resource.titleArabic, resource.category, resource.categoryArabic, resource.algaeType, resource.authors, resource.journal, String(resource.year)].join(' ').toLocaleLowerCase();
    const relevance = terms.reduce((score, term) => score + (haystack.includes(term) ? (resource.title.toLocaleLowerCase().includes(term) ? 4 : 1) : 0), 0);
    return { resource, relevance };
  }).filter((match) => match.relevance > 0).sort((a, b) => b.relevance - a.relevance || b.resource.year - a.resource.year).slice(0, 5);
}

function localAnswer(prompt: string, resources: Resource[]): AssistantResponse {
  const intent = classifyIntent(prompt);
  const yearMatch = prompt.match(/\b(19|20)\d{2}\b/);
  if (intent === 'analysis') {
    const year = yearMatch ? Number(yearMatch[0]) : undefined;
    const scoped = year ? resources.filter((resource) => resource.year === year) : resources;
    const journalCounts = scoped.reduce<Record<string, number>>((counts, resource) => {
      const journal = resource.journal || 'Unknown journal';
      counts[journal] = (counts[journal] ?? 0) + 1;
      return counts;
    }, {});
    const topJournals = Object.entries(journalCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const answer = year
      ? `## ${year} research metrics\n\n- **Papers found:** ${scoped.length.toLocaleString()}\n- **Top journals:**\n${topJournals.map(([journal, count]) => `  - ${journal}: ${count}`).join('\n') || '  - No journal data available.'}`
      : `## Library metrics\n\n- **Total resources:** ${resources.length.toLocaleString()}\n- **Publication years:** ${Math.min(...resources.map((resource) => resource.year))} to ${Math.max(...resources.map((resource) => resource.year))}\n- **Unique journals:** ${Object.keys(journalCounts).length.toLocaleString()}`;
    return { answer, mode: 'local', intent };
  }
  const results = rankResources(prompt, resources);
  if (intent === 'citation') {
    const selected = results[0]?.resource;
    if (!selected) return { answer: 'No matching paper was found for citation generation.', mode: 'local', intent };
    return { answer: `## Citation for ${selected.title}\n\n**APA**\n\`\`\`\n${formatAPA(selected)}\n\`\`\`\n\n**MLA**\n\`\`\`\n${formatMLA(selected)}\n\`\`\`\n\n**BibTeX**\n\`\`\`bibtex\n${formatBibTeX(selected)}\n\`\`\``, mode: 'local', intent, results: [{ resource: selected, relevance: results[0].relevance }], citations: { apa: formatAPA(selected), mla: formatMLA(selected), bibtex: formatBibTeX(selected) } };
  }
  if (!results.length) return { answer: `Local Smart Mode searched ${resources.length.toLocaleString()} resources but found no close matches. Try a topic, author, category, or year.`, mode: 'local', intent };
  return { answer: `## Search results\n\nFound **${results.length} top matches** from the local database.`, mode: 'local', intent, results };
}

export async function askAssistant(prompt: string, signal?: AbortSignal): Promise<AssistantResponse> {
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    const onAbort = () => controller.abort();
    signal?.addEventListener('abort', onAbort, { once: true });
    try {
      const answer = await askGemini(prompt, controller.signal);
      return { answer, mode: 'live', intent: classifyIntent(prompt) };
    } finally {
      window.clearTimeout(timeout);
      signal?.removeEventListener('abort', onAbort);
    }
  } catch {
    let resources: Resource[] = [];
    try {
      resources = await loadResources();
    } catch {
      return { answer: 'Local Smart Mode is active, but the research database is still unavailable. Please try again shortly.', mode: 'local', intent: classifyIntent(prompt) };
    }
    return localAnswer(prompt, resources);
  }
}

export { QUICK_PROMPTS };
