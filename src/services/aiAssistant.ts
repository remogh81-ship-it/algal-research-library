import { loadResources } from './resourceLoader';
import { askGemini } from './geminiService';
import type { Resource } from '../types/resource';
import { formatAPA, formatBibTeX, formatMLA } from '../hooks/useResources';
import type { Language } from '../types';

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

export async function generatePaperSummary(abstract: string, language: Language, signal?: AbortSignal): Promise<string> {
  const languageName = languageNames[language];
  return askGemini(`Respond entirely in ${languageName}. Return a 4-bullet point structured academic summary in the active language (${languageName}) based strictly on the provided abstract text. Do not add facts not present in the abstract.\n\nAbstract:\n${abstract}`, signal);
}

const languageNames: Record<Language, string> = { ar: 'Arabic', en: 'English', fr: 'French', es: 'Spanish', de: 'German', zh: 'Chinese', it: 'Italian' };
const languagePatterns: Array<[Language, RegExp]> = [
  ['ar', /(?:بالعربية|بالعربي|للغة العربية|ترجم للعربية|in arabic)/i],
  ['en', /(?:بالإنجليزية|بالانجليزية|للإنجليزية|ترجم للإنجليزية|in english|answer in english)/i],
  ['fr', /(?:بالفرنسية|للغة الفرنسية|ترجم للفرنسية|in french|answer in french)/i],
  ['es', /(?:بالإسبانية|للغة الإسبانية|ترجم للإسبانية|in spanish|en español|answer in spanish)/i],
  ['de', /(?:بالألمانية|للغة الألمانية|ترجم للألمانية|in german|answer in german)/i],
  ['zh', /(?:بالصينية|للغة الصينية|ترجم للصينية|in chinese|answer in chinese)/i],
  ['it', /(?:بالإيطالية|للغة الإيطالية|ترجم للإيطالية|in italian|answer in italian)/i],
];

function resolveResponseLanguage(prompt: string, currentLanguage: Language): Language {
  return languagePatterns.find(([, pattern]) => pattern.test(prompt))?.[0] ?? currentLanguage;
}

function languageText(language: Language, key: 'metrics' | 'search' | 'noMatch' | 'citation' | 'unavailable'): string {
  const messages: Record<Language, Record<typeof key, string>> = {
    ar: { metrics: 'إحصائيات المكتبة', search: 'نتائج البحث', noMatch: 'لم يتم العثور على أبحاث مطابقة.', citation: 'التوثيق العلمي', unavailable: 'الوضع المحلي نشط، لكن قاعدة بيانات الأبحاث غير متاحة حالياً.' },
    en: { metrics: 'Library metrics', search: 'Search results', noMatch: 'No matching papers were found.', citation: 'Citation', unavailable: 'Local Smart Mode is active, but the research database is unavailable.' },
    fr: { metrics: 'Statistiques de la bibliothèque', search: 'Résultats de recherche', noMatch: 'Aucun article correspondant trouvé.', citation: 'Citation', unavailable: 'Le mode local est actif, mais la base de recherche est indisponible.' },
    es: { metrics: 'Métricas de la biblioteca', search: 'Resultados de búsqueda', noMatch: 'No se encontraron artículos coincidentes.', citation: 'Cita', unavailable: 'El modo inteligente local está activo, pero la base de datos no está disponible.' },
    de: { metrics: 'Bibliotheksstatistik', search: 'Suchergebnisse', noMatch: 'Keine passenden Arbeiten gefunden.', citation: 'Zitation', unavailable: 'Der lokale Modus ist aktiv, aber die Forschungsdatenbank ist nicht verfügbar.' },
    zh: { metrics: '图书馆统计', search: '搜索结果', noMatch: '未找到匹配的论文。', citation: '引用', unavailable: '本地智能模式已启用，但研究数据库暂时不可用。' },
    it: { metrics: 'Statistiche della biblioteca', search: 'Risultati della ricerca', noMatch: 'Non sono stati trovati articoli corrispondenti.', citation: 'Citazione', unavailable: 'La modalità locale è attiva, ma il database di ricerca non è disponibile.' },
  };
  return messages[language][key];
}

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

function localAnswer(prompt: string, resources: Resource[], language: Language): AssistantResponse {
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
      ? `## ${year} ${languageText(language, 'metrics')}\n\n- **${language === 'ar' ? 'الأبحاث' : 'Papers found'}:** ${scoped.length.toLocaleString()}\n- **${language === 'ar' ? 'أهم المجلات' : 'Top journals'}:**\n${topJournals.map(([journal, count]) => `  - ${journal}: ${count}`).join('\n') || `  - ${languageText(language, 'noMatch')}`}`
      : `## ${languageText(language, 'metrics')}\n\n- **${language === 'ar' ? 'إجمالي الموارد' : 'Total resources'}:** ${resources.length.toLocaleString()}\n- **${language === 'ar' ? 'سنوات النشر' : 'Publication years'}:** ${Math.min(...resources.map((resource) => resource.year))} to ${Math.max(...resources.map((resource) => resource.year))}\n- **${language === 'ar' ? 'المجلات الفريدة' : 'Unique journals'}:** ${Object.keys(journalCounts).length.toLocaleString()}`;
    return { answer, mode: 'local', intent };
  }
  const results = rankResources(prompt, resources);
  if (intent === 'citation') {
    const selected = results[0]?.resource;
    if (!selected) return { answer: languageText(language, 'noMatch'), mode: 'local', intent };
    return { answer: `## ${languageText(language, 'citation')}: ${selected.title}\n\n**APA**\n\`\`\`\n${formatAPA(selected)}\n\`\`\`\n\n**MLA**\n\`\`\`\n${formatMLA(selected)}\n\`\`\`\n\n**BibTeX**\n\`\`\`bibtex\n${formatBibTeX(selected)}\n\`\`\``, mode: 'local', intent, results: [{ resource: selected, relevance: results[0].relevance }], citations: { apa: formatAPA(selected), mla: formatMLA(selected), bibtex: formatBibTeX(selected) } };
  }
  if (!results.length) return { answer: `${languageText(language, 'noMatch')} (${resources.length.toLocaleString()} resources searched).`, mode: 'local', intent };
  return { answer: `## ${languageText(language, 'search')}\n\nFound **${results.length} top matches** from the local database.`, mode: 'local', intent, results };
}

export async function askAssistant(prompt: string, currentLanguage: Language = 'en', signal?: AbortSignal): Promise<AssistantResponse> {
  const responseLanguage = resolveResponseLanguage(prompt, currentLanguage);
  const languageInstruction = `Respond entirely in ${languageNames[responseLanguage]}. The active UI language is ${languageNames[currentLanguage]}; an explicit language request in the user query takes priority. Keep tables, summaries, labels, and insights in the response language.`;
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    const onAbort = () => controller.abort();
    signal?.addEventListener('abort', onAbort, { once: true });
    try {
      const answer = await askGemini(`${languageInstruction}\n\nUser request:\n${prompt}`, controller.signal);
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
      return { answer: `${languageText(responseLanguage, 'unavailable')} Please try again shortly.`, mode: 'local', intent: classifyIntent(prompt) };
    }
    return localAnswer(prompt, resources, responseLanguage);
  }
}

export { QUICK_PROMPTS };
