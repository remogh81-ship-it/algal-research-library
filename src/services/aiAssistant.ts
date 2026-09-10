import { loadResources } from './resourceLoader';
import { askGemini } from './geminiService';
import type { Resource } from '../types/resource';

export type AssistantMode = 'live' | 'local';
export type AssistantResponse = { answer: string; mode: AssistantMode };

const QUICK_PROMPTS = ['Find top papers on wastewater treatment', 'Find research on microalgae biofuel', 'Summarize research from 2024'];

function localAnswer(prompt: string, resources: Resource[]): string {
  const normalized = prompt.toLocaleLowerCase();
  const terms = normalized.split(/\s+/).filter((term) => term.length > 2);
  const matches = resources.filter((resource) => [resource.title, resource.titleArabic, resource.category, resource.categoryArabic, resource.authors, resource.journal, String(resource.year)].join(' ').toLocaleLowerCase().split(/\s+/).some((value) => terms.some((term) => value.includes(term))));
  const selected = matches.slice(0, 5);
  if (!selected.length) return `Local Smart Mode searched ${resources.length.toLocaleString()} resources but found no close matches. Try a topic, author, category, or year.`;
  const lines = selected.map((resource, index) => `${index + 1}. ${resource.title} (${resource.year})`);
  return `Found ${matches.length.toLocaleString()} papers in the local database:\n${lines.join('\n')}`;
}

export async function askAssistant(prompt: string, signal?: AbortSignal): Promise<AssistantResponse> {
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    const onAbort = () => controller.abort();
    signal?.addEventListener('abort', onAbort, { once: true });
    try {
      const answer = await askGemini(prompt, controller.signal);
      return { answer, mode: 'live' };
    } finally {
      window.clearTimeout(timeout);
      signal?.removeEventListener('abort', onAbort);
    }
  } catch {
    let resources: Resource[] = [];
    try {
      resources = await loadResources();
    } catch {
      return { answer: 'Local Smart Mode is active, but the research database is still unavailable. Please try again shortly.', mode: 'local' };
    }
    return { answer: localAnswer(prompt, resources), mode: 'local' };
  }
}

export { QUICK_PROMPTS };
