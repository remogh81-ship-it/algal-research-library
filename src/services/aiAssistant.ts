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

export interface ResearchToolDefinition {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: 'Dna' | 'FileSpreadsheet' | 'FlaskConical' | 'Sparkles' | 'LineChart' | 'BookOpen' | 'Cpu';
  promptTemplateAr: string;
  promptTemplateEn: string;
}

export const RESEARCH_TOOLS: ResearchToolDefinition[] = [
  {
    id: 'species_id',
    nameAr: 'تشخيص وتصنيف السلالات الطحلبية',
    nameEn: 'Taxonomic Strain Identification',
    descriptionAr: 'تحليل الصفات المورفولوجية والبيوكيميائية لتحديد وتصنيف السلالات النقية بدقة.',
    descriptionEn: 'Identify and classify algal strains based on morphological and molecular markers.',
    icon: 'Dna',
    promptTemplateAr: 'أريد تحديد وتصنيف السلالة الطحلبية ذات الخصائص التالية: [اكتب الخصائص، مثل: وحيدة خلية، خضراء كروية، قطرها 3-8 ميكرون] مع تبيان أفضل بيئة ومراجع تصنيفية موثوقة.',
    promptTemplateEn: 'Please identify and taxonomically classify the microalgal strain with these features: [insert characteristics, e.g., unicellular, spherical green, 3-8 μm] and suggest optimal media.'
  },
  {
    id: 'media_formulation',
    nameAr: 'مستشار البيئات الغذائية المعملية',
    nameEn: 'Culture Media Formulator',
    descriptionAr: 'حساب وإعداد مكونات البيئات القياسية (BG-11, Zarrouk, BBM, f/2) وضبط المغذيات.',
    descriptionEn: 'Formulate and adjust nutrient recipes for standard media (BG-11, Zarrouk, BBM, Guillard f/2).',
    icon: 'FlaskConical',
    promptTemplateAr: 'أريد بروتوكول تحضير بيئة [اختر: Zarrouk / BG-11 / BBM / f/2] بالتراكيز المحددة بالـ g/L ومصدر الكربون والنيتروجين، مع محاذير التعقيم والخلط.',
    promptTemplateEn: 'Provide the exact preparation protocol for [Zarrouk / BG-11 / BBM / f/2] medium with chemical formulas, concentrations in g/L, and autoclave sterilization notes.'
  },
  {
    id: 'biofuels_lipids',
    nameAr: 'بروتوكول إنتاج وتحفيز الدهون والوقود',
    nameEn: 'Lipid & Biofuel Induction Protocol',
    descriptionAr: 'استراتيجيات تحفيز تراكم الدهون الثلاثية (TAGs) عبر الإجهاد النيتروجيني والضوئي.',
    descriptionEn: 'Optimized stress protocols (nitrogen starvation, high light) to maximize lipid accumulation.',
    icon: 'LineChart',
    promptTemplateAr: 'ما هو البروتوكول الإجرائي ثنائي المرحلة لتعظيم إنتاج الدهون المحايدة (TAGs) في طحلب [Chlorella / Scenedesmus / Nannochloropsis] مع جدول بالمعايير المثلى ونسبة الزيادة المتوقعة؟',
    promptTemplateEn: 'What is the optimal two-stage culture strategy to induce lipid accumulation in [Chlorella / Scenedesmus / Nannochloropsis] for biodiesel production?'
  },
  {
    id: 'phycoremediation',
    nameAr: 'تصميم معالجة مياه الصرف (Phycoremediation)',
    nameEn: 'Phycoremediation & Wastewater Design',
    descriptionAr: 'حساب كفاءات إزالة النيتروجين، الفوسفور، وامتزاز المعادن الثقيلة ونماذج لانجمير.',
    descriptionEn: 'Design wastewater treatment setups to eliminate N, P, COD, and heavy metals using microalgae.',
    icon: 'Sparkles',
    promptTemplateAr: 'أريد تصميم نظام معالجة حيوية بمياه الصرف [البلدي / الصناعي / الزراعي] باستخدام الطحالب، مع كفاءات إزالة النيتروجين والفوسفور وحركية الامتزاز.',
    promptTemplateEn: 'How can I optimize an algal phycoremediation system to treat [municipal / industrial / agricultural] wastewater, including N/P removal rates and hydraulic retention time (HRT)?'
  },
  {
    id: 'pigment_extraction',
    nameAr: 'استخلاص وتنقية الصبغات الحيوية (Phycocyanin / Astaxanthin)',
    nameEn: 'Pigment Extraction & Purification',
    descriptionAr: 'طرق التكسير الخلوي والاستخلاص الدقيق للفيكوسيانين والأستازانثين مع معادلات النقاء.',
    descriptionEn: 'Cell disruption and purification protocols for high-value pigments (C-phycocyanin, astaxanthin).',
    icon: 'FileSpreadsheet',
    promptTemplateAr: 'أريد بروتوكولاً معملياً دقيقاً لاستخلاص صبغة الفيكوسيانين من *Arthrospira platensis* بأعلى نقاوة طيفية (EP = A620/A280) وحساب العائد.',
    promptTemplateEn: 'Provide a laboratory SOP for the extraction and purification of C-phycocyanin from *Arthrospira platensis* including freeze-thaw steps and spectroscopic purity index calculation.'
  },
  {
    id: 'literature_synthesis',
    nameAr: 'التحليل التركيبي والمقارن للأوراق العلمية',
    nameEn: 'Cross-Paper Literature Synthesis',
    descriptionAr: 'مقارنة منهجيات الأبحاث وتحديد الفجوات العلمية بناءً على قاعدة بيانات المكتبة.',
    descriptionEn: 'Synthesize evidence, compare methodologies, and discover research gaps from indexed papers.',
    icon: 'BookOpen',
    promptTemplateAr: 'قارن بين أحدث الأبحاث المفهرسة في المكتبة حول [الموضوع أو السلالة] من حيث المنهجية، وسرعة النمو، ومعدل إنتاج الكتلة الحيوية، واستنتج الفجوة البحثية.',
    promptTemplateEn: 'Compare the indexed benchmark studies on [topic or strain] regarding methodology, growth kinetics, and identify key research gaps.'
  }
];

export const QUICK_PROMPTS_AR = [
  'ما هي أفضل بيئة لزراعة السبيرولينا وحصادها؟',
  'بروتوكول حث إنتاج الدهون في كلوريلا لإنتاج الديزل الحيوي',
  'كفاءة سلالات سينيديسموس في معالجة مياه الصرف وإزالة المعادن',
  'كيفية استخلاص صبغة الفيكوسيانين وحساب مؤشر النقاوة',
  'معادلات حساب معدل النمو النوعي والزمن المضاعف للطحالب',
  'تثبيت ثاني أكسيد الكربون حيوياً بواسطة المفاعلات الضوئية PBR'
];

export const QUICK_PROMPTS_EN = [
  'Optimal Zarrouk formulation and harvest for Spirulina',
  'Two-stage nitrogen starvation protocol for Chlorella lipids',
  'Scenedesmus efficiency in wastewater nutrient removal',
  'Extraction and spectroscopic purity of C-phycocyanin',
  'Formulas for specific growth rate (μ) and biomass productivity',
  'CO2 biofixation kinetics and photobioreactor design'
];

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

function languageText(language: Language, key: 'metrics' | 'search' | 'noMatch' | 'citation' | 'unavailable'): string {
  const messages: Record<Language, Record<'metrics' | 'search' | 'noMatch' | 'citation' | 'unavailable', string>> = {
    ar: { 
      metrics: 'إحصائيات المكتبة', 
      search: 'نتائج البحث', 
      noMatch: 'لم يتم العثور على أبحاث مطابقة.', 
      citation: 'التوثيق العلمي', 
      unavailable: 'الوضع المحلي نشط، لكن قاعدة بيانات الأبحاث غير متاحة حالياً.' 
    },
    en: { 
      metrics: 'Library metrics', 
      search: 'Search results', 
      noMatch: 'No matching papers were found.', 
      citation: 'Citation', 
      unavailable: 'Local Smart Mode is active, but the research database is unavailable.' 
    },
    fr: { 
      metrics: 'Statistiques de la bibliothèque', 
      search: 'Résultats de recherche', 
      noMatch: 'Aucun article correspondant trouvé.', 
      citation: 'Citation', 
      unavailable: 'Le mode local est actif, mais la base de recherche est indisponible.' 
    },
    es: { 
      metrics: 'Métricas de la biblioteca', 
      search: 'Resultados de búsqueda', 
      noMatch: 'No se encontraron artículos coincidentes.', 
      citation: 'Cita', 
      unavailable: 'El modo inteligente local está activo, pero la base de datos no está disponible.' 
    },
    de: { 
      metrics: 'Bibliotheksstatistik', 
      search: 'Suchergebnisse', 
      noMatch: 'Keine passenden Arbeiten gefunden.', 
      citation: 'Zitation', 
      unavailable: 'Der lokale Modus ist aktiv, aber die Forschungsdatenbank ist nicht verfügbar.' 
    },
    zh: { 
      metrics: '图书馆统计', 
      search: '搜索结果', 
      noMatch: '未找到匹配的论文。', 
      citation: '引用', 
      unavailable: '本地智能模式已启用，但研究数据库暂时不可用。' 
    },
    it: { 
      metrics: 'Statistiche della biblioteca', 
      search: 'Risultati della ricerca', 
      noMatch: 'Non sono stati trovati articoli corrispondenti.', 
      citation: 'Citazione', 
      unavailable: 'La modalità locale è attiva, ma il database di ricerca non è disponible.' 
    },
  };
  return messages[language]?.[key] ?? messages.en[key];
}

function classifyIntent(prompt: string): AssistantIntent {
  const p = prompt.toLowerCase();
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

export const ALGAE_EXPERT_SYSTEM_PROMPT = `
You are the Chief Academic Phycologist & Precision Biotechnology AI Advisor for the Integrated Algae Research Library (المكتبة المتكاملة لأبحاث الطحالب) affiliated with the Egyptian Phycological Society (الجمعية المصرية للطحالب), under academic direction of Prof. Dr. Reda Mohamed Moghazy (National Research Centre, Egypt).

CORE SCIENTIFIC DIRECTIVE:
You must provide ACCURATE, TARGETED, FOCUSED, and HIGHLY STRUCTURED scientific answers. Avoid generic introductions or superficial fillers. Every answer must deliver rigorous, actionable value to academic researchers and biotechnology professionals.

MANDATORY RESPONSE BLUEPRINT:
Structure every scientific inquiry, protocol request, or technical question using the following 5 focused sections:

### 1. 🎯 الخلاصة العلمية المركزة (Direct Executive Takeaway)
- A concise, high-density scientific answer directly solving the user's question in 2–3 sentences.
- State the exact species, strain, or optimal operational parameter immediately.

### 2. 📊 جدول المعايير والبارامترات الرقمية (Quantitative Benchmark Table)
Provide a structured Markdown table summarizing the exact quantitative metrics:
| المعيار / Parameter | القيمة المثلى (Optimal) | المدى التشغيلي (Range) | الوحدة / الملاحظات العلمية |
Include specific numbers: Light (μmol photons m⁻² s⁻¹), Temp (°C), pH, Carbon/Aeration (vvm or % CO₂), Biomass yield (g/L/day), or Extraction purity ratio.

### 3. 🔬 البروتوكول الإجرائي الدقيق (Focused Actionable SOP)
- Numbered, concise, step-by-step procedural steps without redundant fluff.
- Specify exact chemical concentrations (g/L or mg/L), incubation intervals, centrifugation speeds (rpm / ×g), and reagent grades.

### 4. ⚠️ ضوابط الجودة والمحاذير المعملية (Critical QC & Pitfalls)
- 2–3 bullet points highlighting critical failure points (e.g., photoinhibition thresholds, contamination vectors, shear stress, temperature crash risks).

### 5. 📚 الشواهد والدراسات المرجعية (Library Evidence & Citations)
- Directly reference the provided benchmark studies from the library (citing author, year, journal, and DOI).

TAXONOMIC & CHEMICAL RIGOR:
- Binomial species names MUST be in *italics* (*Chlorella vulgaris*, *Arthrospira platensis*).
- Chemical formulas in correct stoichiometry (NaHCO₃, NaNO₃, K₂HPO₄, CO₂).
- Always respond in the target language (Arabic or English).
`;

/* Common Stopwords in Arabic and English to purify search intents */
const STOP_WORDS = new Set([
  'what', 'is', 'how', 'to', 'the', 'of', 'in', 'on', 'for', 'with', 'a', 'an', 'and', 'or', 'by', 'at', 'from',
  'can', 'you', 'give', 'me', 'please', 'tell', 'about', 'best', 'good', 'way', 'paper', 'papers', 'research',
  'ما', 'هي', 'هو', 'في', 'على', 'عن', 'من', 'إلى', 'كيف', 'كيفية', 'هل', 'أريد', 'ماهو', 'ماهي', 'اعطني',
  'طريقة', 'بروتوكول', 'بحث', 'ابحث', 'عن', 'افضل', 'أفضل', 'دراسة', 'دراسات', 'مكتبة', 'معلومات', 'حول'
]);

/* Phycology High-Priority Keywords & Weights */
const PHYCOLOGY_WEIGHTS: Record<string, number> = {
  // Strains & Genera
  spirulina: 12, arthrospira: 12, chlorella: 12, scenedesmus: 12, dunaliella: 12,
  haematococcus: 12, nannochloropsis: 12, anabaena: 12, nostoc: 12, phaeodactylum: 12,
  skeletonema: 12, sargassum: 12, ulva: 12, gracilaria: 12, cyanobacteria: 10,
  diatom: 10, diatoms: 10, microalgae: 8, macroalgae: 8,
  سبيرولينا: 12, أرثروسبيرا: 12, كلوريلا: 12, سينيديسموس: 12, دوناليلا: 12,
  هيماتوكوكس: 12, نانوكلوروبسيس: 12, أنابينا: 12, نوستوك: 12, سارجاسوم: 12, أولفا: 12,

  // Topics & Products
  biofuel: 9, biodiesel: 9, lipid: 9, lipids: 9, bioethanol: 9, biohydrogen: 9,
  wastewater: 9, remediation: 9, bioremediation: 9, biosorption: 9, adsorption: 8,
  'heavy metal': 9, 'heavy metals': 9, lead: 8, cadmium: 8, chromium: 8, nickel: 8, copper: 8,
  carbon: 9, co2: 9, biofixation: 9, sequestration: 9, 'flue gas': 8,
  astaxanthin: 10, phycocyanin: 10, antioxidant: 8, antimicrobial: 8, anticancer: 8,
  biofertilizer: 9, biostimulant: 9, agriculture: 8, aquafeed: 8, aquaculture: 8,
  bioplastic: 9, pha: 9, phb: 9, nanoparticle: 8, nanoparticles: 8,
  zarrouk: 10, 'bg-11': 10, bbm: 10, guillard: 10, photobioreactor: 9, pbr: 9, raceway: 9,
  kinetics: 8, 'growth rate': 8, productivity: 8, isotherm: 8, langmuir: 8,
  وقود: 9, 'ديزل حيوي': 9, دهون: 9, معالجة: 9, صرف: 9, 'امتزاز حيوي': 9, 'معادن ثقيلة': 9,
  كربون: 9, 'تثبيت حيوي': 9, فيكوسيانين: 10, أستازانثين: 10, أكسدة: 8, مخصبات: 9, 'أعلاف': 8,
  'بلاستيك حيوي': 9, زاروك: 10, 'مفاعل ضوئي': 9, حركية: 8
};

function rankResources(prompt: string, resources: Resource[]): AssistantResult[] {
  const normalized = prompt.toLowerCase();
  
  // Extract clean meaningful keywords excluding stopwords
  const rawTerms = normalized.split(/[^\p{L}\p{N}+-]+/u).filter((t) => t.length > 1);
  const searchTerms = rawTerms.filter((t) => !STOP_WORDS.has(t));
  
  if (searchTerms.length === 0) {
    searchTerms.push(...rawTerms.filter((t) => t.length > 2));
  }

  return resources
    .map((resource) => {
      const titleLower = `${resource.title || ''} ${resource.titleArabic || ''}`.toLowerCase();
      const catLower = `${resource.category || ''} ${resource.categoryArabic || ''}`.toLowerCase();
      const strainLower = (resource.algaeType || '').toLowerCase();
      const authorLower = (resource.authors || '').toLowerCase();
      const journalLower = (resource.journal || '').toLowerCase();
      const summaryLower = `${resource.summary_en || ''} ${resource.summary_ar || ''}`.toLowerCase();

      let score = 0;

      for (const term of searchTerms) {
        const weight = PHYCOLOGY_WEIGHTS[term] || 3;

        // Highest priority: title match
        if (titleLower.includes(term)) score += weight * 5;
        // High priority: strain or category match
        if (strainLower.includes(term)) score += weight * 4;
        if (catLower.includes(term)) score += weight * 3;
        // Author or journal match
        if (authorLower.includes(term)) score += weight * 2;
        if (journalLower.includes(term)) score += weight * 2;
        // Summary content match
        if (summaryLower.includes(term)) score += weight * 1.5;
      }

      // Bonus for recent peer-reviewed publications
      if (resource.year && resource.year >= 2020) score += 2;
      if (resource.doi) score += 1;

      return { resource, relevance: score };
    })
    .filter((match) => match.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance || b.resource.year - a.resource.year)
    .slice(0, 5);
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
      ? `\n\n### ${language === 'ar' ? 'أبحاث موثقة ذات صلة من قاعدة بيانات المكتبة:' : 'Documented Benchmark Papers from Library Database:'}\n` + results.map(r => `- **${r.resource.title}** (${r.resource.year}) — *${r.resource.algaeType || 'Algae'}* · *${r.resource.journal}*${r.resource.doi ? ` [DOI: ${r.resource.doi}]` : ''}`).join('\n')
      : '';

    // Smart strain detection
    const isSpirulina = /(spirulina|arthrospira|سبيرولينا|أرثروسبيرا)/i.test(prompt);
    const isChlorella = /(chlorella|كلوريلا)/i.test(prompt);
    const isScenedesmus = /(scenedesmus|سينيديسموس)/i.test(prompt);
    const isDunaliella = /(dunaliella|دوناليلا)/i.test(prompt);
    const isHaematococcus = /(haematococcus|هيماتوكوكس)/i.test(prompt);
    const isBiofuel = /(lipid|biofuel|biodiesel|وقود|دهون|ديزل حيوي)/i.test(prompt);
    const isBioremediation = /(remediation|heavy metal|wastewater|صرف|معالجة|معادن ثقيلة)/i.test(prompt);

    let guidance = '';
    if (language === 'ar') {
      if (isSpirulina) {
        guidance = `### 1. 🎯 الخلاصة العلمية المركزة
طحلب *Arthrospira platensis* (السبيرولينا) ينمو بكفاءة قصوى في البيئات القلوية الغنية بالكربون غير العضوي، وأنسب بيئة معتمدة عالمياً هي **بيئة زاروك (Zarrouk's Medium)** بتركيز NaHCO₃ مرتفع مع تثبيت درجة الحرارة بين 30-35°م.

### 2. 📊 جدول المعايير والبارامترات الرقمية
| المعيار الفيزيوكيميائي | القيمة المثلى (Optimal) | المدى المقبول (Range) | الوحدة / الملاحظات |
| :--- | :--- | :--- | :--- |
| **الأس الهيدروجيني (pH)** | **9.2 – 9.5** | 9.0 – 9.8 | قلوي يمنع التلوث البيولوجي |
| **درجة الحرارة** | **32°C** | 30 – 35°C | حرجة عند >38°C أو <18°C |
| **شدة الإضاءة (PAR)** | **80 – 100** | 50 – 120 | μmol photons m⁻² s⁻¹ |
| **بيكربونات الصوديوم** | **16.8** | 12.0 – 18.0 | g/L NaHCO₃ (مصدر كربون) |
| **نترات الصوديوم** | **2.5** | 2.0 – 2.5 | g/L NaNO₃ (مصدر نيتروجين) |
| **إنتاجية الكتلة الحيوية** | **0.85 – 1.2** | 0.6 – 1.5 | g L⁻¹ day⁻¹ |

### 3. 🔬 البروتوكول الإجرائي الدقيق (SOP)
1. **تحضير الوسط:** إذابة 16.8 جم NaHCO₃ و 2.5 جم NaNO₃ و 0.5 جم K₂HPO₄ في 1 لتر ماء مقطر، وإضافة 1 مل من محلول العناصر النادرة (Trace A5+B6).
2. **التلقيح والزراعة:** تلقيح بكثافة بصرية أولية $OD_{560} = 0.2$، مع خلط مستمر (25-30 سم/ث).
3. **الحصاد:** ترشيح الكتلة الحيوية عبر شبكة حريرية (Nylon mesh 40-50 μm)، وغسلها بماء مقطر لإزالة الأملاح.
4. **استخلاص الفيكوسيانين:** تجميد الكتلة الحيوية الرطبة عند -20°م ثم إذابتها في دارئ فوسفات الصوديوم (0.1 M, pH 7.0)، مع طرد مركزي (10,000 ×g لمدة 15 دقيقة) وقياس النقاء $EP = A_{620} / A_{280} > 0.7$.

### 4. ⚠️ ضوابط الجودة والمحاذير المعملية
- هبوط الـ pH إلى ما دون 8.5 يسمح بنمو الطحالب الخضراء وحيدة الخلية والبروتوزوا الملوثة.
- تجنب تعريض المزارع لإضاءة قوية مفاجئة لتفادي التثبيط الضوئي (Photoinhibition).`;
      } else if (isChlorella) {
        guidance = `### 1. 🎯 الخلاصة العلمية المركزة
طحلب *Chlorella vulgaris* هو النموذج الأمثل لإنتاج الكتلة الحيوية الغنية بالبروتين والدهون؛ ويتم تحقيق أقصى تراكم للدهون (>40% من الوزن الجاف) عبر إستراتيجية **الزراعة ثنائية المرحلة (Two-Stage Strategy)** بحرمان الخلايا من النيتروجين.

### 2. 📊 جدول المعايير والبارامترات الرقمية
| المعيار التشغيلي | مرحلة الكتلة الحيوية (المرحلة 1) | مرحلة إجهاد الدهون (المرحلة 2) | الملاحظات العلمية |
| :--- | :--- | :--- | :--- |
| **البيئة الغذائية** | **BG-11 كاملة** (1.5 g/L NaNO₃) | **BG-11 خالية من N** (0.0 g/L) | حث مسار TAGs |
| **شدة الإضاءة** | **60 – 80** μmol m⁻² s⁻¹ | **150 – 200** μmol m⁻² s⁻¹ | إجهاد ضوئي مضاعف |
| **درجة الحرارة** | **24 – 26°C** | **25 – 28°C** | حرارة معتدلة |
| **الأس الهيدروجيني (pH)** | **7.0 – 7.2** | **7.5 – 8.0** | معتدل إلى قلوي خفيف |
| **معدل النمو النوعي (μ)**| **0.85 – 1.1** day⁻¹ | **<0.15** day⁻¹ | توقف الانقسام الخلوي |
| **محتوى الدهون الجاف** | **14 – 18%** | **42 – 52%** | دهون محايدة صالحة للديزل |

### 3. 🔬 البروتوكول الإجرائي الدقيق (SOP)
1. **المرحلة 1:** زراعة الخلايا في وسط BG-11 كامل لمدة 6-8 أيام مع إمداد 1.5% CO₂ حتى وصول الكثافة إلى $OD_{680} \approx 1.8$.
2. **الغسيل والنقل:** جمع الخلايا بالطرد المركزي (4,000 ×g لمدة 8 دقائق)، وغسل الراسب بماء مقطر لإزالة بقايا النترات.
3. **المرحلة 2:** إعادة تعليق الخلايا في وسط BG-11 خالٍ تماماً من النيتروجين، مع مضاعفة الإضاءة لمدة 72-96 ساعة.
4. **الاستخلاص والتحويل:** استخلاص الدهون بطريقة Folch المعدلة أو مذيب n-Hexane، وإجراء الأسترة التبادلية (Transesterification) بميثانول + 1% H₂SO₄ عند 60°م لمدة ساعتين.

### 4. ⚠️ ضوابط الجودة والمحاذير المعملية
- الإجهاد النيتروجيني المطول لأكثر من 5 أيام يؤدي لتحلل صبغة الكلوروفيل وموت الخلايا الذاتي (Autolysis).
- ضرورة مراقبة ترسب الخلايا وضمان الخلط بالفقاعات الغازية لمنع حدوث التكتل التلقائي.`;
      } else if (isScenedesmus || isBioremediation) {
        guidance = `### 1. 🎯 الخلاصة العلمية المركزة
تُظهر سلالة *Scenedesmus obliquus* كفاءة استثنائية في المعالجة الحيوية لمياه الصرف (*Phycoremediation*)، حيث تزيل ما بين 85-95% من النيتروجين والفوسفور، وتمتلك قدرة امتزاز حيوي فائقة للمعادن الثقيلة تتوافق مع نموذج لانجمير (Langmuir Isotherm).

### 2. 📊 جدول المعايير والبارامترات الرقمية
| المعيار / الملوث | تركيز الدخول (Influent) | كفاءة الإزالة (Removal %) | زمن المكوث الهيدروليكي (HRT) |
| :--- | :--- | :--- | :--- |
| **النيتروجين الكلي (TN)** | **40 – 80 mg/L** | **85 – 94%** | 4 – 6 أيام |
| **الفوسفور الكلي (TP)** | **6 – 15 mg/L** | **80 – 92%** | 4 – 6 أيام (امتزاز فاخر) |
| **خفض COD** | **300 – 600 mg/L** | **70 – 82%** | اقتران تكافلي مع البكتيريا |
| **امتزاز الرصاص (Pb²⁺)** | **10 – 50 mg/L** | **$q_{max} = 78.4$ mg/g** | توافق تام مع لانجمير ($R^2 > 0.98$) |
| **امتزاز الكادميوم (Cd²⁺)**| **5 – 25 mg/L** | **$q_{max} = 42.1$ mg/g** | زمن اتزان 60 دقيقة |

### 3. 🔬 البروتوكول الإجرائي الدقيق (SOP)
1. **المعالجة الأولية:** ترشيح مياه الصرف لإزالة العوالق الخشنة، وتعديل الأس الهيدروجيني إلى pH 7.0 ± 0.2.
2. **التلقيح والتكافل:** تلقيح بنسبة 15% حجمياً من مزرعة نشطة لـ *Scenedesmus obliquus* في الطور اللوغاريتمي.
3. **التشغيل:** إمداد إضاءة مستمرة أو دورة 16:8 مع تهوية خفيفة بدون إضافة أية مغذيات كيميائية خارجية.
4. **فصل الكتلة الحيوية:** الترويق التلقائي أو إضافة الشبة المخففة (Alum 20 mg/L) أو الترويق الحيوي، وقياس المغذيات المتبقية بالطرق القياسية (APHA Standards).

### 4. ⚠️ ضوابط الجودة والمحاذير المعملية
- العكارة العالية تمنع نفاذ الضوء، لذا يجب تخفيف مياه الصرف الخام (1:1 أو 1:2) عند بدء التجربة.
- الحفاظ على pH بين 6.8 و 7.8 لمنع تطاير الأمونيا كغاز $NH_3$ وضمان امتصاصها بيولوجياً.`;
      } else {
        guidance = `### 1. 🎯 الخلاصة العلمية المركزة
تعتمد كفاءة وتطبيقات الطحالب الدقيقة على الضبط الدقيق لمدخلات الضوء والكربون وتوازن النيتروجين والفوسفور، وتختلف المتطلبات الفيزيوكيميائية بين الأجناس الخضراء وحيدة الخلية والسيانوباكتيريا الخيطية.

### 2. 📊 جدول المعايير والبارامترات التشغيلية القياسية
| المتغير البيئي | الطحالب الخضراء (*Chlorophyta*) | السيانوباكتيريا (*Cyanobacteria*) | الدياتومات (*Bacillariophyceae*) |
| :--- | :--- | :--- | :--- |
| **البيئة المعتمدة** | **BG-11 / BBM** | **Zarrouk / BG-11₀** | **Guillard f/2 (+ Silicate)** |
| **الأس الهيدروجيني (pH)**| **6.8 – 7.5** | **9.0 – 9.8** | **7.8 – 8.2** |
| **درجة الحرارة (°C)** | **22 – 26** | **30 – 35** | **18 – 22** |
| **الإضاءة (PAR)** | **60 – 100** μmol m⁻² s⁻¹ | **50 – 90** μmol m⁻² s⁻¹ | **40 – 80** μmol m⁻² s⁻¹ |
| **التهوية (CO₂)** | **1 – 2% CO₂** (0.2 vvm) | **تهوية خلط قلوية** | **تهوية فقاعية دقيقة** |

### 3. 🔬 المعادلات الحسابية والتحليل الحركي
- **معدل النمو النوعي:** $\\mu = \\frac{\\ln(OD_2) - \\ln(OD_1)}{t_2 - t_1}$ [day⁻¹]
- **الزمن المضاعف:** $t_d = \\frac{0.693}{\\mu}$ [days]
- **معدل تثبيت الكربون:** $R_{CO_2} = 1.83 \\times P_{vol}$ [g CO₂ L⁻¹ day⁻¹]

### 4. ⚠️ ضوابط الجودة والمحاذير المعملية
- تجنب التغيرات المفاجئة في درجات الحرارة بين الليل والنهار بمقدار يزيد عن 6°م لتفادي الصدمة الفسيولوجية.
- استخدام مرشحات التعقيم (0.22 μm filters) لكافة الإمدادات الهوائية لمنع تلوث المزرعة بالفطريات والبكتيريا.`;
      }
    } else {
      guidance = `## 🔬 Phycological Advisory & Standard Scientific Parameters

### 1. Key Physicochemical Operational Benchmarks:
- 🌡️ **Culture Temperature:** 22–26°C for standard Chlorophyta; 30–35°C for thermophilic Cyanobacteria (*Arthrospira*).
- 💡 **Irradiance (PAR):** 50–120 μmol photons m⁻² s⁻¹ under a 16:8 h light:dark cycle.
- 🫧 **Gas Sparging:** Continuous bubbling with 1–2% CO₂ enriched air at 0.2–0.5 vvm.
- ⚗️ **pH Regulation:** 6.8–7.5 for freshwater green microalgae; 9.0–9.8 for alkaliphilic cyanobacteria.

### 2. Fundamental Kinetic Formulations:
- **Specific Growth Rate:** $\\mu = \\frac{\\ln(OD_2) - \\ln(OD_1)}{t_2 - t_1}$ [day⁻¹]
- **Doubling Time:** $t_d = \\frac{\\ln(2)}{\\mu}$ [days or hours]
- **Volumetric Productivity:** $P_{vol} = \\frac{X_2 - X_1}{\\Delta t}$ [g L⁻¹ day⁻¹]
- **CO₂ Biofixation Rate:** $R_{CO_2} = C_{carbon} \\times P_{vol} \\times \\frac{44}{12}$ (~1.83 g CO₂ per g dry algae).

> Leverage the built-in **Scientific Lab Calculators** on the portal home page for real-time automated computations.`;
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

  // Retrieve top matching papers from library database for true scientific RAG
  let relevantResults: AssistantResult[] = [];
  try {
    const allResources = await loadResources();
    relevantResults = rankResources(prompt, allResources).slice(0, 5);
  } catch (err) {
    console.warn('Unable to preload library resources for RAG context:', err);
  }

  let libraryContext = '';
  if (relevantResults.length > 0) {
    libraryContext = `\n\n### RELEVANT BENCHMARK STUDIES INDEXED IN THE EGYPTIAN PHYCOLOGICAL SOCIETY LIBRARY (30,000+ REPOSITORY):\n` +
      relevantResults.map(({ resource: r }, i) => 
        `[Study ${i + 1}] Title: "${r.title}" (${r.year})\nAuthors: ${r.authors}\nJournal: ${r.journal}\nStrain/Taxon: ${r.algaeType || 'Algae'}\nDOI: ${r.doi || 'N/A'}\nKey Data/Abstract: ${r.summary_en || r.summary_ar || 'N/A'}`
      ).join('\n\n') +
      `\n\nCRITICAL SCIENTIFIC CITATION DIRECTIVE:
1. Synthesize your expert answer by explicitly incorporating and citing the relevant indexed benchmark studies above (mentioning authors, publication year, and specific metrics).
2. Compare their methodologies and parameters against international phycological benchmarks.
3. Provide rigorous, comprehensive Standard Operating Procedures (SOPs) with exact physicochemical parameters, chemical formulas, and safety notes.
4. Add a "📚 الاستشهادات المرجعية من قاعدة بيانات المكتبة" section at the end of your response listing these studies with their DOI links.`;
  }

  const systemInstruction = `${ALGAE_EXPERT_SYSTEM_PROMPT}${libraryContext}\n\nCurrent user interaction language: ${langName}. Always provide your comprehensive, publication-grade academic response in ${langName}. Use rich Markdown formatting (tables, bold headings, bullet points, LaTeX formulas if helpful).`;

  // Format message history for Gemini API
  const messages: ChatMessagePayload[] = chatHistory.slice(-8).map((m) => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));
  messages.push({ role: 'user', parts: [{ text: prompt }] });

  try {
    const controller = new AbortController();
    // 35 seconds timeout for deep scientific synthesis
    const timeout = window.setTimeout(() => controller.abort(), 35000);
    const onAbort = () => controller.abort();
    signal?.addEventListener('abort', onAbort, { once: true });

    try {
      const answer = await askGeminiChat(messages, systemInstruction, controller.signal);
      return { answer, mode: 'live', intent, results: relevantResults };
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
