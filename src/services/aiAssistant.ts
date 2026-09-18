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
You are the Chief Academic Phycologist & Precision Biotechnology AI Advisor for the Integrated Algae Research Library (المكتبة المتكاملة لأبحاث الطحالب) affiliated with the Egyptian Phycological Society (الجمعية المصرية للطحالب), under academic direction of Prof. Dr. Reda Mohamed Moghazi (National Research Centre, Egypt).

Your scientific and technological capabilities cover:
1. Systematic Taxonomy & Strain Identification:
   - Cyanobacteria (*Arthrospira platensis*, *Anabaena*, *Nostoc*, *Spirulina*, *Microcystis*).
   - Chlorophyta (*Chlorella vulgaris*, *Scenedesmus obliquus*, *Dunaliella salina*, *Haematococcus pluvialis*).
   - Bacillariophyceae/Diatoms (*Phaeodactylum tricornutum*, *Skeletonema costatum*, *Chaetoceros*).
   - Phaeophyceae & Rhodophyta macroalgae (*Sargassum*, *Ulva*, *Gracilaria*).
   Always output biological binomial nomenclature in *italics* with author citations when relevant.

2. Precision Culture Formulations & Media Chemistry:
   - BG-11 (freshwater cyanobacteria/microalgae): NaNO3 (1.5 g/L), K2HPO4 (0.04 g/L), MgSO4·7H2O (0.075 g/L), CaCl2·2H2O (0.036 g/L), Citric acid (0.006 g/L), Ferric ammonium citrate (0.006 g/L), EDTA (0.001 g/L), A6 trace elements.
   - Zarrouk's Medium (Spirulina/Arthrospira): NaHCO3 (16.8 g/L), NaNO3 (2.5 g/L), K2HPO4 (0.5 g/L), K2SO4 (1.0 g/L), NaCl (1.0 g/L), MgSO4·7H2O (0.2 g/L), CaCl2 (0.04 g/L), FeSO4·7H2O (0.01 g/L), EDTA (0.08 g/L), Micronutrients A5+B6. pH strictly 9.0 - 9.8.
   - Bold's Basal Medium (BBM), Guillard's f/2 (marine diatoms and flagellates), Walne, Chu-10.
   - Provide exact stock solution preparation, autoclaving vs. sterile-filtration warnings, and pH adjusting protocols.

3. Bioreactor Engineering & Kinetics:
   - Specific growth rate: μ = (ln X2 - ln X1) / (t2 - t1) [day⁻¹ or h⁻¹].
   - Doubling time: td = ln(2) / μ.
   - Volumetric biomass productivity: P_vol = (X2 - X1) / (t2 - t1) [g L⁻¹ day⁻¹].
   - Areal biomass productivity: P_area = P_vol × (V / A) [g m⁻² day⁻¹].
   - CO2 Biofixation kinetics: R_CO2 = C_carbon × P_vol × (44 / 12) (typically ~1.83 g CO2 per g dry algal biomass).
   - Optimal photosynthetically active radiation (PAR): 50 - 250 μmol photons m⁻² s⁻¹, dark:light photoperiods (16:8 or 12:12), aerated with 0.04% - 5% CO2 at 0.1 - 0.5 vvm.

4. Bioremediation & Phycoremediation Protocols:
   - Heavy metal biosorption (Pb²⁺, Cd²⁺, Cr⁶⁺, Cu²⁺, Ni²⁺, Zn²⁺): Biosorption capacity q_e = ((C0 - Ce) × V) / m [mg/g].
   - Langmuir isotherm: q_e = (q_max × K_L × C_e) / (1 + K_L × C_e).
   - Freundlich isotherm: q_e = K_F × (C_e)^(1/n).
   - Municipal, industrial & dairy wastewater polishing: Removal percentages (R%) for Total Nitrogen (TN), Nitrate (NO3⁻), Ammonium (NH4⁺), Total Phosphorus (TP), and Chemical Oxygen Demand (COD).

5. High-Value Natural Bioactive Extraction Protocols:
   - Astaxanthin from *Haematococcus pluvialis*: Two-phase green-to-red stress induction (N/P depletion, high irradiance >400 μmol m⁻² s⁻¹, salt stress), cell wall disruption (bead milling, enzymatic lysis), extraction via supercritical CO2 or ethyl acetate/ethanol.
   - Phycobiliproteins (C-Phycocyanin) from *Arthrospira*: Repeated freeze-thaw cycles (-20°C to 25°C) or ultrasonic disintegration in phosphate buffer (0.1 M, pH 7.0), purity ratio calculation: EP = A620 / A280 (Food grade: >0.7, Cosmetic: >1.5, Analytical/Reagent: >4.0).
   - Lipids & FAME for Biodiesel: Bligh & Dyer / Folch chloroform-methanol or Soxhlet n-hexane extraction, transesterification using methanol + 1% H2SO4 or KOH at 60°C.

Response Formatting Rules:
- Provide exhaustive, publication-grade academic answers.
- Use clean hierarchical Markdown (#, ##, ###, bullet points, bolding, scientific units).
- When providing protocols, use numbered step-by-step Standard Operating Procedure (SOP) format with:
  1. Objectives & Principles
  2. Required Reagents & Equipment
  3. Step-by-Step Execution Guide
  4. Critical Quality Control (QC) & Pitfalls
  5. Mathematical Formulas & Calculation Examples
- Always respond in the target language of the prompt or context (Arabic or English).
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
        guidance = `## 🔬 استشارة متخصصة: استزراع وإنتاجية *Arthrospira platensis* (السبيرولينا)

### 1. بيئة الاستزراع الكيميائية الموصى بها: **بيئة زاروك (Zarrouk's Medium)**
- **بيكربونات الصوديوم (NaHCO₃):** 16.8 جم/لتر (لتوفير الكربون غير العضوي وضبط الأس الهيدروجيني).
- **نترات الصوديوم (NaNO₃):** 2.5 جم/لتر (كمصدر نيتروجين رئيسي).
- **فوسفات ثنائي البوتاسيوم (K₂HPO₄):** 0.5 جم/لتر.
- **كبريتات البوتاسيوم (K₂SO₄):** 1.0 جم/لتر | **كلوريد الصوديوم (NaCl):** 1.0 جم/لتر.
- **محلول العناصر النادرة (Trace Elements A5+B6):** 1 مل/لتر.

### 2. الظروف الفيزيوكيميائية المثلى:
- **الأس الهيدروجيني (pH):** 9.2 – 9.8 (قلوية عالية تمنع التلوث بالميكروبات الأخرى).
- **درجة الحرارة:** 30 – 35°م (الحد الأدنى 20°م، والحد الحرج 38°م).
- **الإضاءة (PAR):** 60 – 120 μmol photons m⁻² s⁻¹ مع دورة ضوئية 16:8 ساعة.
- **التهوية والخلط:** تقليب مستمر (سرعة تدفق 20-30 سم/ث في الأحواض المفتوحة Raceway Ponds).

### 3. استخلاص صبغة الفيكوسيانين (C-Phycocyanin):
- تكسير الكتلة الحيوية الرطبة عبر دورات التجميد والذوبان المتكررة (-20°م ثم 25°م).
- الاستخلاص في دارئ الفوسفات (Sodium phosphate buffer 0.1 M, pH 7.0).
- معامل النقاء المطلوب: $EP = A_{620} / A_{280}$ (أكبر من 0.7 للدرجة الغذائية، وأكبر من 4.0 للدرجة التحليلية).`;
      } else if (isChlorella) {
        guidance = `## 🔬 استشارة متخصصة: استزراع وإنتاجية *Chlorella vulgaris*

### 1. بيئة الاستزراع: **بيئة BG-11 أو BBM (Bold's Basal Medium)**
- **نترات الصوديوم (NaNO₃):** 1.5 جم/لتر (للنمو الخضري السريع).
- **فوسفات ثنائي البوتاسيوم (K₂HPO₄):** 0.04 جم/لتر | **كبريتات المغنيسيوم:** 0.075 جم/لتر.
- **سترات الحديد والأمونيوم:** 0.006 جم/لتر لتعزيز تصنيع الكلوروفيل.

### 2. بروتوكول حث تراكم الدهون للوقود الحيوي:
- **المرحلة 1 (تراكم الكتلة الحيوية):** نمو كامل في BG-11 لمدة 8-10 أيام (تركيز نيتروجين كامل).
- **المرحلة 2 (الإجهاد النيتروجيني):** نقل الخلايا لبيئة خالية من النيتروجين (Nitrogen-free BG-11) مع زيادة الإضاءة (>180 μmol m⁻² s⁻¹). يؤدي ذلك لتراكم الدهون المحايدة (TAGs) بنسبة تفوق 40-50% من الوزن الجاف.
- **معدل النمو النوعي المتوقع (μ):** 0.65 – 1.1 day⁻¹.`;
      } else if (isScenedesmus || isBioremediation) {
        guidance = `## 🔬 استشارة متخصصة: المعالجة الحيوية بمساعدة الطحالب (*Phycoremediation*)

### 1. السلالات الأكثر كفاءة:
- *Scenedesmus obliquus* و *Chlorella pyrenoidosa*.

### 2. كفاءة إزالة المغذيات والملوثات:
- **إزالة النيتروجين الكلي (TN) والأمونيوم (NH₄⁺):** 80% – 95% خلال 6-8 أيام.
- **إزالة الفوسفور الكلي (TP):** 75% – 90% عبر الامتزاز والتخزين الفائض (Polyphosphate accumulation).
- **خفض الأكسجين الحيوي الممتص (BOD/COD):** خفض بنسبة تصل إلى 70-85%.

### 3. الامتزاز الحيوي للمعادن الثقيلة (Biosorption):
- حساب سعة الامتزاز عند الاتزان: $q_e = \\frac{(C_0 - C_e) \\times V}{m}$ (مجم معدن/جم طحلب جاف).
- التوافق مع نموذج لانجمير (Langmuir Isotherm) لتحديد أقصى سعة تشبع أحادية الطبقة $q_{max}$.`;
      } else {
        guidance = `## 🔬 الإرشادات المعيارية الشاملة لأبحاث واستزراع الطحالب

### 1. المعايير الفيزيوكيميائية الدقيقة:
- 🌡️ **درجة الحرارة:** 22-26°م للمزارع النقية، 28-32°م للطحالب الخضراء المزرقة.
- 💡 **شدة الإضاءة:** 50-120 μmol photons m⁻² s⁻¹ مع نظام إضاءة 16:8 ضوء:ظلام.
- 🫧 **إمداد ثاني أكسيد الكربون:** تهوية بهواء مدعم بـ 1-2% CO₂ عند معدل تدفق 0.2-0.5 vvm لضبط الـ pH وتجنب استنزاف الكربون.
- ⚗️ **الأس الهيدروجيني (pH):** 6.8-7.8 لمعظم الطحالب الخضراء، و9.0-10.0 للسيانوباكتيريا القلوية.

### 2. المعادلات الحركية القياسية:
- **معدل النمو النوعي:** $\\mu = \\frac{\\ln(OD_2) - \\ln(OD_1)}{t_2 - t_1}$
- **الزمن المضاعف:** $t_d = \\frac{\\ln(2)}{\\mu}$
- **الإنتاجية الحجمية:** $P_{vol} = \\frac{X_2 - X_1}{\\Delta t}$ (جم كتلة جافة / لتر / يوم).

> يمكنك الانتقال إلى **الجناح الحاسوبي المخبري** بالصفحة الرئيسية لإجراء هذه الحسابات الرياضية فورياً.`;
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
