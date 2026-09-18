import { loadResources } from './resourceLoader';
import { askGeminiChat, type ChatMessagePayload } from './geminiService';
import type { Resource } from '../types/resource';
import { formatAPA, formatBibTeX, formatMLA } from '../hooks/useResources';
import type { Language } from '../types';

export type AssistantMode = 'live' | 'local';
export type AssistantIntent = 
  | 'search' 
  | 'analysis' 
  | 'citation' 
  | 'general'
  | 'species_id'
  | 'protocol'
  | 'gaps'
  | 'interpretation'
  | 'media_advisor';

export type AssistantResult = { resource: Resource; relevance: number };
export type AssistantResponse = {
  answer: string;
  mode: AssistantMode;
  intent: AssistantIntent;
  results?: AssistantResult[];
  citations?: { apa: string; mla: string; bibtex: string };
};

export interface ChatHistoryItem {
  sender: 'user' | 'assistant';
  text: string;
}

const languageNames: Record<Language, string> = {
  ar: 'Arabic',
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  zh: 'Chinese',
  it: 'Italian',
};

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

export const ALGAE_EXPERT_SYSTEM_PROMPT = `
You are the world-class Phycology & Algal Biotechnology AI Research Companion for the Integrated Algae Research Library (المكتبة المتكاملة لأبحاث الطحالب) under the Egyptian Phycological Society (الجمعية المصرية للطحالب), under academic supervision of Prof. Dr. Reda Mohamed Moghazi.

Your expertise includes:
1. Taxonomy & Phycological Systematics (Cyanobacteria/Blue-green algae, Chlorophyta, Rhodophyta, Phaeophyceae, Bacillariophyceae/Diatoms).
2. Cultivation Systems (Open raceway ponds, Tubular & Flat-panel photobioreactors, fermenters, mixotrophic/heterotrophic growth).
3. Culture Media & Formulations (BG-11, BBM, Zarrouk, Walne, Guillard f/2, Chu-10).
4. Bioremediation & Environmental applications (Heavy metal biosorption, wastewater phycoremediation, CO2 biofixation rates).
5. Bioactive Compounds & High-value products (Astaxanthin, Phycocyanin, EPA/DHA, Lipids, Biofuel, Biofertilizers).
6. Analytical & Kinetics Metrics (Specific growth rate μ, Doubling time td, Biomass productivity, Langmuir/Freundlich isotherms).

Response Rules:
- Answer with academic rigor, structured Markdown, clear headings, bullet points, and actionable scientific recommendations.
- When generating protocols, provide explicit parameters (pH, temperature, light intensity in μmol photons m⁻² s⁻¹, photoperiod, aeration/CO2 flow).
- Provide taxonomic scientific names in *italics* (e.g., *Chlorella vulgaris*, *Arthrospira platensis*).
- Maintain responsiveness in the target language specified by user context.
`;

function languageText(language: Language, key: 'metrics' | 'search' | 'noMatch' | 'citation' | 'unavailable'): string {
  const messages: Record<Language, Record<typeof key, string>> = {
    ar: { metrics: 'إحصائيات المكتبة', search: 'نتائج البحث', noMatch: 'لم يتم العثور على أبحاث مطابقة.', citation: 'التوثيق العلمي', unavailable: 'الوضع المحلي نشط، لكن قاعدة بيانات الأبحاث غير متاحة حالياً.' },
    en: { metrics: 'Library metrics', search: 'Search results', noMatch: 'No matching papers were found.', citation: 'Citation', unavailable: 'Local Smart Mode is active, but the research database is unavailable.' },
    fr: { metrics: 'Statistiques de la bibliothèque', search: 'Résultats de recherche', noMatch: 'Aucun article correspondant trouvé.', citation: 'Citation', unavailable: 'Le mode local est actif, mais la base de recherche est indisponible.' },
    es: { metrics: 'Métricas de la biblioteca', search: 'Resultados de búsqueda', noMatch: 'No se encontraron artículos coincidentes.', citation: 'Cita', unavailable: 'El modo inteligente local está activo, pero la base de datos no está disponible.' },
    de: { metrics: 'Bibliotheksstatistik', search: 'Suchergebnisse', noMatch: 'Keine passenden Arbeiten gefunden.', citation: 'Zitation', unavailable: 'Der lokale Modus ist aktiv, aber die Forschungsdatenbank ist nicht verfügbar.' },
    zh: { metrics: '图书馆统计', search: '搜索结果', noMatch: '未找到匹配的论文。', citation: '引用', unavailable: '本地智能模式已启用，但研究数据库暂时不可用。' },
    it: { metrics: 'Statistiche della biblioteca', search: 'Risultati della ricerca', noMatch: 'Non sono stati trovati articoli corrispondenti.', citation: 'Citazione', unavailable: 'La modalità locale è attiva, ma il database di ricerca non è disponible.' },
  };
  return messages[language][key];
}

export interface ResearchToolDefinition {
  id: AssistantIntent;
  nameAr: string;
  nameEn: string;
  icon: string;
  promptTemplateAr: string;
  promptTemplateEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export const RESEARCH_TOOLS: ResearchToolDefinition[] = [
  {
    id: 'species_id',
    nameAr: 'تعريف الأنواع',
    nameEn: 'Species Identification',
    icon: 'Dna',
    promptTemplateAr: 'أريد تحديد نوع طحلب بالخصائص المورفولوجية والبيئية التالية: ',
    promptTemplateEn: 'Identify the algae species based on these morphological and physiological traits: ',
    descriptionAr: 'تحليل دقيق لتشخيص وتصنيف الطحالب حسب المعايير المورفولوجية والبيئية',
    descriptionEn: 'Taxonomic identification guide based on morphological & ecological traits',
  },
  {
    id: 'protocol',
    nameAr: 'مولّد البروتوكولات',
    nameEn: 'Protocol Generator',
    icon: 'FileSpreadsheet',
    promptTemplateAr: 'صمم بروتوكولاً تجريبياً مفصلاً (زراعة / استخلاص / معالجة) لطحلب: ',
    promptTemplateEn: 'Generate a detailed laboratory protocol (cultivation, extraction, or assay) for: ',
    descriptionAr: 'بروتوكولات مخبرية معيارية للزراعة واستخلاص الصبغات والدهون',
    descriptionEn: 'Standard laboratory SOPs for culture, harvesting, and analytical assays',
  },
  {
    id: 'media_advisor',
    nameAr: 'مستشار البيئات الغذائية',
    nameEn: 'Media Advisor',
    icon: 'FlaskConical',
    promptTemplateAr: 'ما هي أفضل بيئة زراعية غذائية لنمو طحلب [النوع] لغرض [إنتاج دهون / نمو سريع / إجهاد نيتروجيني]: ',
    promptTemplateEn: 'Recommend and adjust the optimal culture medium (BG-11, BBM, Zarrouk, f/2) for: ',
    descriptionAr: 'توصيات تركيبات الأوساط الغذائية (BG-11, BBM, Zarrouk, Walne...) والتعديل للعناصر',
    descriptionEn: 'Formulation advisor for culture media optimization and nutrient stress conditions',
  },
  {
    id: 'gaps',
    nameAr: 'محلل الفجوات البحثية',
    nameEn: 'Research Gap Analyzer',
    icon: 'Sparkles',
    promptTemplateAr: 'حدد الفجوات البحثية الحالية والمجالات غير المدروسة كفاية في موضوع: ',
    promptTemplateEn: 'Analyze research gaps and unaddressed research questions in: ',
    descriptionAr: 'اكتشاف نقاط الضعف والفجوات في الأدبيات لاقتراح أفكار رسائل ماجستير ودكتوراه',
    descriptionEn: 'Uncover literature gaps to formulate novel MSc/PhD theses proposals',
  },
  {
    id: 'interpretation',
    nameAr: 'مفسر النتائج والبيانات',
    nameEn: 'Data Interpreter',
    icon: 'LineChart',
    promptTemplateAr: 'فسّر علمياً النتائج والبيانات المخبرية التالية وقارنها بالمعدلات المنشورة: ',
    promptTemplateEn: 'Provide a scientific phycological interpretation for the following experimental data: ',
    descriptionAr: 'تفسير معدلات النمو μ، كفاءة الامتزاز الحيوي، وتثبيت ثاني أكسيد الكربون',
    descriptionEn: 'Interpret kinetics, growth curves, adsorption isotherms, and pigment yields',
  },
  {
    id: 'citation',
    nameAr: 'الموثق المرجعي',
    nameEn: 'Citation & Review Writer',
    icon: 'BookOpen',
    promptTemplateAr: 'صغ فقرة مراجعة علمية أكاديمية موثقة مع المراجع (APA/BibTeX) عن: ',
    promptTemplateEn: 'Draft an academic synthesized literature review paragraph with citations on: ',
    descriptionAr: 'صياغة فقرات أدبيات البحث والتوثيق الأكاديمي بأنماط APA و MLA و BibTeX',
    descriptionEn: 'Draft academic review paragraphs and export compliant reference citations',
  },
];

export const QUICK_PROMPTS_AR = [
  'بروتوكول زراعة Arthrospira platensis (Spirulina) في بيئة Zarrouk',
  'أفضل ظروف لإجهاد Chlorella vulgaris لزيادة تراكم الدهون لإنتاج الوقود الحيوي',
  'مقارنة كفاءة إزالة النيتروجين والفوسفور بواسطة Scenedesmus obliquus',
  'حساب معدل تثبيت ثاني أكسيد الكربون (CO2 Bio-fixation) في المفاعلات الضوئية',
];

export const QUICK_PROMPTS_EN = [
  'Cultivation protocol for Arthrospira platensis (Spirulina) in Zarrouk medium',
  'Nitrogen-starvation protocols for Chlorella vulgaris lipid accumulation',
  'Scenedesmus obliquus efficiency in wastewater heavy metal biosorption',
  'CO2 sequestration kinetics calculation in photobioreactors',
];

function classifyIntent(prompt: string): AssistantIntent {
  const p = prompt.toLocaleLowerCase();
  if (/(species|identify|taxonomy|نوع|تصنيف|تعريف|مورفولوج|سلالة)/i.test(p)) return 'species_id';
  if (/(protocol|sop|methodology|بروتوكول|خطوات عمل|طريقة تحضير|استخلاص)/i.test(p)) return 'protocol';
  if (/(medium|media|zarrouk|bg-11|bbm|guillard|بيئة غذائية|وسط غذائي|تغذية)/i.test(p)) return 'media_advisor';
  if (/(gap|novel|thesis|فجوة|فجوات|بحث جديد|أفكار بحثية|ماجستير)/i.test(p)) return 'gaps';
  if (/(interpret|data|kinetics|isotherm|تفسير|نتائج|منحنى نمو|دلالة)/i.test(p)) return 'interpretation';
  if (/(apa|mla|bibtex|citation|توثيق|استشهاد|مراجع|literature review)/i.test(p)) return 'citation';
  if (/(how many|count|statistics|statistic|most|عدد|إحصائيات|الأكثر|كم)/i.test(p)) return 'analysis';
  if (/(find|search|papers|research|أبحاث|ابحث|دراسة)/i.test(p)) return 'search';
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
      ? `## ${year} ${languageText(language, 'metrics')}\n\n- **${language === 'ar' ? 'الأبحاث المسترجعة' : 'Papers found'}:** ${scoped.length.toLocaleString()}\n- **${language === 'ar' ? 'أبرز المجلات العلمية' : 'Top journals'}:**\n${topJournals.map(([journal, count]) => `  - ${journal}: ${count}`).join('\n') || `  - ${languageText(language, 'noMatch')}`}`
      : `## ${languageText(language, 'metrics')}\n\n- **${language === 'ar' ? 'إجمالي الأبحاث المفهرسة بالمكتبة' : 'Total resources'}:** ${resources.length.toLocaleString()}\n- **${language === 'ar' ? 'النطاق الزمني للمنشورات' : 'Publication span'}:** ${Math.min(...resources.map((resource) => resource.year))} إلى ${Math.max(...resources.map((resource) => resource.year))}\n- **${language === 'ar' ? 'المجلات العلمية المتخصصة' : 'Unique indexed journals'}:** ${Object.keys(journalCounts).length.toLocaleString()}`;
    return { answer, mode: 'local', intent };
  }

  const results = rankResources(prompt, resources);
  
  if (intent === 'citation') {
    const selected = results[0]?.resource;
    if (!selected) return { answer: languageText(language, 'noMatch'), mode: 'local', intent };
    return { 
      answer: `## ${languageText(language, 'citation')}: ${selected.title}\n\n**APA (7th ed.)**\n\`\`\`\n${formatAPA(selected)}\n\`\`\`\n\n**MLA (9th ed.)**\n\`\`\`\n${formatMLA(selected)}\n\`\`\`\n\n**BibTeX**\n\`\`\`bibtex\n${formatBibTeX(selected)}\n\`\`\``, 
      mode: 'local', 
      intent, 
      results: [{ resource: selected, relevance: results[0].relevance }], 
      citations: { apa: formatAPA(selected), mla: formatMLA(selected), bibtex: formatBibTeX(selected) } 
    };
  }

  if (intent === 'species_id' || intent === 'protocol' || intent === 'media_advisor' || intent === 'gaps' || intent === 'interpretation') {
    const relatedText = results.length > 0 
      ? `\n\n### ${language === 'ar' ? 'أبحاث ذات صلة من قاعدة البيانات' : 'Related Papers from Library'}:\n` + results.map(r => `- **${r.resource.title}** (${r.resource.year}) - *${r.resource.algaeType || 'Algae'}*`).join('\n')
      : '';

    let guidance = '';
    if (language === 'ar') {
      guidance = `## 🔬 إرشادات المستشار العلمي المحلي\n\n` +
        `**المعايير الفيزيوكيميائية الأساسية:**\n` +
        `- 🌡️ درجة الحرارة المثلى: **22-26°م** (حسب السلالة)\n` +
        `- 💡 شدة الإضاءة: **50-100 μmol photons m⁻² s⁻¹** (فترة ضوئية 16:8 ساعة)\n` +
        `- 🫧 تدفق الهواء: **1-2% CO₂** (0.5-1.0 vvm)\n` +
        `- ⚗️ الأس الهيدروجيني: **pH 6.8-7.5** (حسب الوسط الغذائي)\n\n` +
        `> يمكنك أيضاً استخدام **الجناح الحاسوبي العلمي المتخصص** في الصفحة الرئيسية لحساب معدلات النمو والإنتاجية.`;
    } else {
      guidance = `## 🔬 Local Scientific Advisory\n\n` +
        `**Standard Phycological Parameters:**\n` +
        `- 🌡️ Optimal temperature: **22-26°C** (species-dependent)\n` +
        `- 💡 Light intensity: **50-100 μmol photons m⁻² s⁻¹** (16:8 h photoperiod)\n` +
        `- 🫧 Aeration: **1-2% CO₂** (0.5-1.0 vvm)\n` +
        `- ⚗️ pH range: **6.8-7.5** (medium-dependent)\n\n` +
        `> Use the built-in **Scientific Lab Calculators** on the main portal for growth rate (μ), biomass productivity, and CO₂ fixation kinetics.`;
    }

    return {
      answer: guidance + relatedText,
      mode: 'local',
      intent,
      results,
    };
  }

  if (!results.length) {
    return { 
      answer: `${languageText(language, 'noMatch')} (${resources.length.toLocaleString()} ${language === 'ar' ? 'بحث تم فحصهم' : 'resources searched'}).`, 
      mode: 'local', 
      intent 
    };
  }

  return { 
    answer: `## ${languageText(language, 'search')}\n\n${language === 'ar' ? 'تم العثور على أبحاث مطابقة من قاعدة البيانات المحلية:' : 'Found top matching papers from the local library database:'}`, 
    mode: 'local', 
    intent, 
    results 
  };
}

export async function askAssistant(
  prompt: string,
  currentLanguage: Language = 'en',
  chatHistory: ChatHistoryItem[] = [],
  signal?: AbortSignal
): Promise<AssistantResponse> {
  const responseLanguage = resolveResponseLanguage(prompt, currentLanguage);
  const langName = languageNames[responseLanguage];
  const intent = classifyIntent(prompt);

  const systemInstruction = `${ALGAE_EXPERT_SYSTEM_PROMPT}\n\nCurrent user interaction language: ${langName}. Always provide your response in ${langName}. Maintain academic professionalism, scientific precision, and practical actionable insights.`;

  // Format message history for Gemini API
  const messages: ChatMessagePayload[] = chatHistory.slice(-8).map((m) => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));
  messages.push({ role: 'user', parts: [{ text: prompt }] });

  try {
    const controller = new AbortController();
    // 30 seconds timeout for high quality reasoning
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    const onAbort = () => controller.abort();
    signal?.addEventListener('abort', onAbort, { once: true });

    try {
      const answer = await askGeminiChat(messages, systemInstruction, controller.signal);
      return { answer, mode: 'live', intent };
    } finally {
      window.clearTimeout(timeout);
      signal?.removeEventListener('abort', onAbort);
    }
  } catch (err) {
    console.warn('Live AI call unavailable or timed out, falling back to local engine:', err);
    let resources: Resource[] = [];
    try {
      resources = await loadResources();
    } catch {
      return { 
        answer: `${languageText(responseLanguage, 'unavailable')} Please try again shortly.`, 
        mode: 'local', 
        intent 
      };
    }
    return localAnswer(prompt, resources, responseLanguage);
  }
}

export async function generatePaperSummary(abstract: string, language: Language, signal?: AbortSignal): Promise<string> {
  const languageName = languageNames[language];
  const prompt = `Respond entirely in ${languageName}. Return a comprehensive 4-bullet point structured academic synthesis in ${languageName} analyzing:
1. 🎯 Research Objectives & Scientific Hypotheses
2. 🔬 Microalgae Species, Strains & Experimental Methodology
3. 📊 Quantitative Results, Efficiencies & Kinetics
4. 💡 Practical Industrial & Environmental Applications

Base findings strictly on the provided text:
\n\nAbstract:\n${abstract}`;

  const messages: ChatMessagePayload[] = [{ role: 'user', parts: [{ text: prompt }] }];
  const sys = `${ALGAE_EXPERT_SYSTEM_PROMPT}\nProvide concise, high-impact scientific synthesis.`;
  return askGeminiChat(messages, sys, signal);
}
