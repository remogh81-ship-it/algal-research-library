export interface MediaComponent {
  name: string;
  chemicalFormula: string;
  concentrationPerLiter: number; // base value in grams or mL per 1 Liter
  unit: 'g' | 'mg' | 'mL';
  role: {
    ar: string;
    en: string;
  };
}

export interface CultureMedium {
  id: string;
  name: string;
  category: 'cyanobacteria' | 'green_algae' | 'marine' | 'freshwater' | 'universal';
  description: {
    ar: string;
    en: string;
  };
  targetStrains: string[];
  phRange: string;
  autoclaveNotes: {
    ar: string;
    en: string;
  };
  preparationTips: {
    ar: string;
    en: string;
  };
  components: MediaComponent[];
}

export const CULTURE_MEDIA: CultureMedium[] = [
  {
    id: 'zarrouk',
    name: "Zarrouk's Medium (بيئة زاروك)",
    category: 'cyanobacteria',
    description: {
      ar: 'البيئة القياسية العالمية لزراعة طحلب السبيرولينا (Arthrospira platensis)، تتميز بتركيز مرتفع جداً من بيكربونات الصوديوم لتوفير وسط قلوي (pH 9-10) يمنع التلوث البيولوجي.',
      en: 'The golden standard medium for Spirulina (Arthrospira platensis) cultivation. Formulated with high sodium bicarbonate to maintain a selective alkaline pH (9-10).'
    },
    targetStrains: ['Arthrospira platensis (Spirulina)', 'Arthrospira maxima'],
    phRange: '9.0 - 10.5',
    autoclaveNotes: {
      ar: 'يُفضل تعقيم بيكربونات الصوديوم بشكل منفصل بالترشيح (0.22 µm) أو إضافتها بعد تبريد المحلول المغلي لتفادي تفكك الكربونات وترسب الكالسيوم.',
      en: 'Autoclave trace elements and macro-salts separately. NaHCO3 can be filter-sterilized or added after cooling to prevent carbonate breakdown.'
    },
    preparationTips: {
      ar: 'أذب بيكربونات الصوديوم جيداً أولاً، ثم أضف باقي الأملاح بالترتيب. في المزارع الكبيرة يمكن استخدام بيكربونات تجارية نقية لتقليل التكلفة.',
      en: 'Dissolve NaHCO3 completely before adding other salts. Stir thoroughly to ensure full dissolution of iron-EDTA complex.'
    },
    components: [
      { name: 'بيكربونات الصوديوم (Sodium Bicarbonate)', chemicalFormula: 'NaHCO3', concentrationPerLiter: 16.8, unit: 'g', role: { ar: 'مصدر الكربون الرئيسي ومنظم القلوية العالية', en: 'Inorganic carbon source & pH buffer' } },
      { name: 'نترات الصوديوم (Sodium Nitrate)', chemicalFormula: 'NaNO3', concentrationPerLiter: 2.5, unit: 'g', role: { ar: 'مصدر النيتروجين لبناء البروتينات والفيكوسيانين', en: 'Nitrogen source for protein & phycocyanin' } },
      { name: 'فوسفات ثنائي البوتاسيوم (Dipotassium Phosphate)', chemicalFormula: 'K2HPO4', concentrationPerLiter: 0.5, unit: 'g', role: { ar: 'مصدر الفوسفور والبوتاسيوم وتثبيت الـ pH', en: 'Phosphorus and potassium nutrient' } },
      { name: 'كبريتات البوتاسيوم (Potassium Sulfate)', chemicalFormula: 'K2SO4', concentrationPerLiter: 1.0, unit: 'g', role: { ar: 'مصدر البوتاسيوم والكبريت', en: 'Potassium and sulfur source' } },
      { name: 'كلوريد الصوديوم (Sodium Chloride)', chemicalFormula: 'NaCl', concentrationPerLiter: 1.0, unit: 'g', role: { ar: 'تنظيم الضغط الأسموزي والملوحة', en: 'Osmotic regulator & ionic strength' } },
      { name: 'كبريتات المغنيسيوم المائية (Magnesium Sulfate heptahydrate)', chemicalFormula: 'MgSO4·7H2O', concentrationPerLiter: 0.2, unit: 'g', role: { ar: 'المغنيسيوم ضروري لبناء الكلوروفيل والإنزيمات', en: 'Core magnesium for chlorophyll synthesis' } },
      { name: 'كلوريد الكالسيوم المائي (Calcium Chloride dihydrate)', chemicalFormula: 'CaCl2·2H2O', concentrationPerLiter: 0.04, unit: 'g', role: { ar: 'الكالسيوم لسلامة الأغشية الخلوية', en: 'Cell membrane structural integrity' } },
      { name: 'كبريتات الحديدوز المائية (Ferrous Sulfate heptahydrate)', chemicalFormula: 'FeSO4·7H2O', concentrationPerLiter: 0.01, unit: 'g', role: { ar: 'عنصر الحديد لتفاعلات نقل الإلكترونات والبناء الضوئي', en: 'Iron for photosynthetic electron transport' } },
      { name: 'إيديتا ثنائية الصوديوم (EDTA Disodium)', chemicalFormula: 'Na2EDTA', concentrationPerLiter: 0.08, unit: 'g', role: { ar: 'مخلب كيميائي لحفظ الحديد والمعادن النادرة من الترسب', en: 'Chelating agent preventing mineral precipitation' } },
      { name: 'محلول العناصر النادرة A5 (Trace Elements A5)', chemicalFormula: 'H3BO3, MnCl2, ZnSO4, CuSO4, MoO3', concentrationPerLiter: 1.0, unit: 'mL', role: { ar: 'محفزات إنزيمية حيوية بتركيزات دقيقة', en: 'Micro-nutrients and enzyme cofactors' } }
    ]
  },
  {
    id: 'bg-11',
    name: 'BG-11 Medium (بيئة بي جي 11)',
    category: 'universal',
    description: {
      ar: 'أوسع بيئات النمو انتشاراً في العالم للسيانوباكتيريا (الطحالب الخضراء المزرقة) ومعظم الطحالب الخضراء للمياه العذبة، وتتميز بتوازن غذائي مثالي ونمو سريع.',
      en: 'The most universal culture medium for freshwater cyanobacteria and green microalgae, supporting high biomass productivity across diverse strains.'
    },
    targetStrains: ['Chlorella vulgaris', 'Scenedesmus obliquus', 'Nostoc commune', 'Anabaena', 'Synechocystis'],
    phRange: '7.1 - 7.5',
    autoclaveNotes: {
      ar: 'تعقم في الأوتوكلاف عند 121 °C لمدة 15-20 دقيقة عند ضغط 15 psi. يُضبط الأس الهيدروجيني قبل التعقيم بحمض الهيدروكلوريك أو هيدروكسيد الصوديوم.',
      en: 'Autoclave at 121 °C (15 psi) for 15-20 minutes. Adjust pH to 7.1-7.4 prior to sterilization using 1M NaOH or HCl.'
    },
    preparationTips: {
      ar: 'للسلالات المثبتة للنيتروجين مثل Nostoc، يتم استبعاد NaNO3 وتسمى البيئة حينها BG-110.',
      en: 'For diazotrophic (N2-fixing) cyanobacteria like Nostoc, omit NaNO3 (designated as BG-110).'
    },
    components: [
      { name: 'نترات الصوديوم (Sodium Nitrate)', chemicalFormula: 'NaNO3', concentrationPerLiter: 1.5, unit: 'g', role: { ar: 'المصدر النيتروجيني الأساسي', en: 'Primary nitrogen source' } },
      { name: 'فوسفات ثنائي البوتاسيوم المائي (Dipotassium Phosphate trihydrate)', chemicalFormula: 'K2HPO4·3H2O', concentrationPerLiter: 0.04, unit: 'g', role: { ar: 'مصدر الفوسفور والمخفف الأيوني', en: 'Phosphate buffer & P source' } },
      { name: 'كبريتات المغنيسيوم المائية (Magnesium Sulfate)', chemicalFormula: 'MgSO4·7H2O', concentrationPerLiter: 0.075, unit: 'g', role: { ar: 'المغنيسيوم لتكوين الكلوروفيل', en: 'Magnesium for chlorophyll synthesis' } },
      { name: 'كلوريد الكالسيوم (Calcium Chloride dihydrate)', chemicalFormula: 'CaCl2·2H2O', concentrationPerLiter: 0.036, unit: 'g', role: { ar: 'الكالسيوم لانقسام الخلايا', en: 'Cell division & membrane stabilization' } },
      { name: 'حمض الستريك (Citric Acid)', chemicalFormula: 'C6H8O7', concentrationPerLiter: 0.006, unit: 'g', role: { ar: 'مخلب وميسر للحديد', en: 'Organic iron chelator' } },
      { name: 'سترات حديديك الأمونيوم (Ferric Ammonium Citrate)', chemicalFormula: 'C6H8FeNO7', concentrationPerLiter: 0.006, unit: 'g', role: { ar: 'مصدر الحديد الحيوي', en: 'Bioavailable iron complex' } },
      { name: 'إيديتا ثنائية الصوديوم (Disodium EDTA)', chemicalFormula: 'Na2EDTA', concentrationPerLiter: 0.001, unit: 'g', role: { ar: 'مخلب كيميائي لمنع الترسب', en: 'Heavy metal trace chelator' } },
      { name: 'كربونات الصوديوم (Sodium Carbonate)', chemicalFormula: 'Na2CO3', concentrationPerLiter: 0.02, unit: 'g', role: { ar: 'مصدر كربوني مساعد وضابط pH', en: 'Carbon supplement & pH stabilizer' } },
      { name: 'محلول المعادن النادرة BG-11 (Trace Metal Mix)', chemicalFormula: 'H3BO3, MnCl2, ZnSO4, Na2MoO4, CuSO4, Co(NO3)2', concentrationPerLiter: 1.0, unit: 'mL', role: { ar: 'مزيج العناصر الصغرى المحفزة', en: 'Micro-nutrient catalyst cocktail' } }
    ]
  },
  {
    id: 'bbm',
    name: "Bold's Basal Medium - BBM (بيئة بولد الأساسية)",
    category: 'green_algae',
    description: {
      ar: 'بيئة قياسية نقية للمياه العذبة مصممة خصيصاً للطحالب الخضراء مثل الكلوريلا والسينيديزموس والهيماتوكوكس، وتتميز بنظام تخفيف فوسفاتي مزدوج عالي الاستقرار.',
      en: "Premier freshwater defined formulation for green microalgae (Chlorophyta). Known for its dual phosphate buffering system ensuring pH stability."
    },
    targetStrains: ['Chlorella vulgaris', 'Haematococcus pluvialis', 'Scenedesmus obliquus', 'Chlamydomonas reinhardtii'],
    phRange: '6.6 - 6.8',
    autoclaveNotes: {
      ar: 'تُعقم عند 121 °C لمدة 20 دقيقة. إذا لوحظ ترسب خفيف بعد التبريد، يُرج المحلول بلطف ليذوب مع تدرج الحرارة.',
      en: 'Autoclave at 121 °C for 20 minutes. Slight haze may form from iron phosphates if autoclaved too long.'
    },
    preparationTips: {
      ar: 'تُحضر عادة من محاليل مخزونة (Stock Solutions 100x) حيث يُؤخذ 10 مل من كل محلول مخزون لكل لتر ماء مقطر.',
      en: 'Conveniently prepared from 100x stock solutions using 10 mL of each macro stock per 1 Liter distilled water.'
    },
    components: [
      { name: 'نترات الصوديوم (Sodium Nitrate)', chemicalFormula: 'NaNO3', concentrationPerLiter: 0.25, unit: 'g', role: { ar: 'مصدر النيتروجين الأساسي', en: 'Nitrogen source' } },
      { name: 'فوسفات البوتاسيوم أحادية الهيدروجين (K2HPO4)', chemicalFormula: 'K2HPO4', concentrationPerLiter: 0.075, unit: 'g', role: { ar: 'منظم دارئ فوسفاتي ومصدر بوتاسيوم', en: 'Phosphate buffer component' } },
      { name: 'فوسفات البوتاسيوم ثنائية الهيدروجين (KH2PO4)', chemicalFormula: 'KH2PO4', concentrationPerLiter: 0.175, unit: 'g', role: { ar: 'منظم دارئ فوسفاتي حمضي', en: 'Acidic phosphate buffer component' } },
      { name: 'كبريتات المغنيسيوم المائية (MgSO4·7H2O)', chemicalFormula: 'MgSO4·7H2O', concentrationPerLiter: 0.075, unit: 'g', role: { ar: 'مصدر المغنيسيوم والكبريتات', en: 'Magnesium and sulfate nutrition' } },
      { name: 'كلوريد الكالسيوم (CaCl2·2H2O)', chemicalFormula: 'CaCl2·2H2O', concentrationPerLiter: 0.025, unit: 'g', role: { ar: 'كالسيوم للجدار الخلوي', en: 'Calcium ion source' } },
      { name: 'كلوريد الصوديوم (NaCl)', chemicalFormula: 'NaCl', concentrationPerLiter: 0.025, unit: 'g', role: { ar: 'توازن أيوني للصوديوم والكلور', en: 'Ionic balance' } },
      { name: 'محلول الحديد الحمضي (Acidified Iron Solution)', chemicalFormula: 'FeSO4·7H2O + H2SO4', concentrationPerLiter: 1.0, unit: 'mL', role: { ar: 'حديد مخلب حمضياً لضمان الامتصاص', en: 'Acid-stabilized bioavailable iron' } },
      { name: 'محلول البورون (Boron Solution)', chemicalFormula: 'H3BO3', concentrationPerLiter: 1.0, unit: 'mL', role: { ar: 'بورون لتأيض الكربوهيدرات', en: 'Boron micronutrient' } },
      { name: 'محلول المعادن النادرة BBM (Trace Metals Mix)', chemicalFormula: 'ZnSO4, MnCl2, MoO3, CuSO4, Co(NO3)2', concentrationPerLiter: 1.0, unit: 'mL', role: { ar: 'عناصر صغرى محفزة', en: 'Trace element cocktail' } }
    ]
  },
  {
    id: 'f2-guillard',
    name: "Guillard's f/2 Medium (بيئة جيلارد البحرية)",
    category: 'marine',
    description: {
      ar: 'البيئة البحرية الأشهر والأكثر استخداماً في العالم لكل مفرخات الأسماك والطحالب البحرية والداياتومات، تُحضر على ماء بحر طبيعي أو صناعي مصفى.',
      en: "The global benchmark enriched seawater medium for marine microalgae, diatoms, and aquaculture hatcheries worldwide."
    },
    targetStrains: ['Nannochloropsis oculata', 'Phaeodactylum tricornutum', 'Isochrysis galbana', 'Dunaliella salina', 'Chaetoceros'],
    phRange: '8.0 - 8.2',
    autoclaveNotes: {
      ar: 'يُفضل تعقيم ماء البحر أولاً، ثم إضافة الفيتامينات بالترشيح المعقم (0.22 µm) بعد التبريد لأن فيتامين B1 و B12 يتلفان بالحرارة العالية.',
      en: 'Sterilize seawater base first. Always filter-sterilize vitamin stock (0.22 µm) and add aseptically after medium cools below 40 °C.'
    },
    preparationTips: {
      ar: 'للداياتومات (Diatoms)، أضف محلول سيليكات الصوديوم (Na2SiO3) لبناء جدار السيليكا الخارجي. للطحالب البحرية الأخرى يمكن الاستغناء عن السيليكات.',
      en: 'Add sodium metasilicate (Na2SiO3) for diatoms only to support frustule silicification. Omit for flagellates to avoid precipitate.'
    },
    components: [
      { name: 'ماء بحر مفلتر طبيعي أو صناعي (Filtered Seawater)', chemicalFormula: 'Seawater (30-35 PSU)', concentrationPerLiter: 1000, unit: 'mL', role: { ar: 'الوسط المائي والملوحة البحرية الطبيعية', en: 'Natural ocean mineral baseline' } },
      { name: 'نترات الصوديوم (Sodium Nitrate)', chemicalFormula: 'NaNO3', concentrationPerLiter: 0.075, unit: 'g', role: { ar: 'مصدر النيتروجين البحري', en: 'Nitrate nitrogen enrichment' } },
      { name: 'فوسفات الصوديوم أحادية القاعدة (Sodium Phosphate monobasic)', chemicalFormula: 'NaH2PO4·H2O', concentrationPerLiter: 0.005, unit: 'g', role: { ar: 'مصدر الفوسفات المتاح', en: 'Orthophosphate phosphorus' } },
      { name: 'سيليكات الصوديوم المائية (Sodium Metasilicate - للداياتومات)', chemicalFormula: 'Na2SiO3·9H2O', concentrationPerLiter: 0.030, unit: 'g', role: { ar: 'سيليكا لبناء جدار قواقع الداياتومات', en: 'Silicate for diatom shell formation' } },
      { name: 'محلول المعادن النادرة f/2 (Trace Metals solution)', chemicalFormula: 'FeCl3, Na2EDTA, CuSO4, ZnSO4, CoCl2, MnCl2, Na2MoO4', concentrationPerLiter: 1.0, unit: 'mL', role: { ar: 'عناصر نادرة مخلبة لحماية الكائنات الدقيقة', en: 'EDTA-chelated essential trace metals' } },
      { name: 'محلول الفيتامينات f/2 (Vitamin solution)', chemicalFormula: 'Thiamine HCl (B1), Biotin (H), Cyanocobalamin (B12)', concentrationPerLiter: 0.5, unit: 'mL', role: { ar: 'فيتامينات حيوية ضرورية لانقسام الخلايا البحرية', en: 'Vitamins B1, B12 and Biotin coenzymes' } }
    ]
  },
  {
    id: 'walne',
    name: "Walne Medium - Conway (بيئة والني للاستزراع المائي)",
    category: 'marine',
    description: {
      ar: 'بيئة غنية عالية المغذيات مصممة خصيصاً لمزارع التغذية المكثفة للرخويات والمحار ويرقات الأسماك، توفر كثافة خلوية فائقة تفوق f/2 بأضعاف.',
      en: 'A high-density nutrient medium optimized for mass algal production in intensive oyster, clam, and marine fish hatcheries.'
    },
    targetStrains: ['Isochrysis galbana', 'Tetraselmis suecica', 'Chaetoceros calcitrans', 'Skeletonema costatum'],
    phRange: '7.8 - 8.2',
    autoclaveNotes: {
      ar: 'تُحضر المحاليل المخزونة وتعقم بالفلترة، ثم تُضاف المعقمات لماء البحر المعقم مسبقاً بنسبة 1 مل لكل لتر.',
      en: 'Stock solutions (Nutrient Solution, Trace Metals, Vitamins) prepared separately and dosed at 1 mL/L into pasteurized seawater.'
    },
    preparationTips: {
      ar: 'ممتازة لإنتاج كثافات خلوية عالية في أنظمة الأنابيب الرأسية والمفاعلات المستمرة.',
      en: 'Ideal for rapid continuous photobioreactor batch runs reaching high cell densities.'
    },
    components: [
      { name: 'نترات الصوديوم (Sodium Nitrate)', chemicalFormula: 'NaNO3', concentrationPerLiter: 0.100, unit: 'g', role: { ar: 'مصدر نيتروجين عالي التركيز', en: 'High-density nitrogen' } },
      { name: 'إيديتا ثنائية الصوديوم (Na2EDTA)', chemicalFormula: 'Na2EDTA', concentrationPerLiter: 0.045, unit: 'g', role: { ar: 'مخلب قوي للمعادن الثقيلة', en: 'Metal complexing buffer' } },
      { name: 'حمض البوريك (Boric Acid)', chemicalFormula: 'H3BO3', concentrationPerLiter: 0.0336, unit: 'g', role: { ar: 'بورون لتثبيت الجدار الخلوي', en: 'Cell structural boron' } },
      { name: 'فوسفات الصوديوم ثنائية الهيدروجين (NaH2PO4·2H2O)', chemicalFormula: 'NaH2PO4·2H2O', concentrationPerLiter: 0.020, unit: 'g', role: { ar: 'فوسفور حيوي قابل للتمثيل', en: 'Phosphorus nutrient' } },
      { name: 'كلوريد الحديديك (Ferric Chloride hexahydrate)', chemicalFormula: 'FeCl3·6H2O', concentrationPerLiter: 0.0013, unit: 'g', role: { ar: 'حديد لتمثيل الطاقة والصبغات', en: 'Iron catalyst' } },
      { name: 'كلوريد المنجنيز (Manganese Chloride tetrahydrate)', chemicalFormula: 'MnCl2·4H2O', concentrationPerLiter: 0.00036, unit: 'g', role: { ar: 'منجنيز لأكسدة الماء في البناء الضوئي', en: 'Photosystem II manganese activator' } },
      { name: 'محلول فيتامين والني (B1 + B12)', chemicalFormula: 'B1 (Thiamine) + B12 (Cyanocobalamin)', concentrationPerLiter: 0.1, unit: 'mL', role: { ar: 'محفزات حيوية للنمو السريع', en: 'Essential aquaculture vitamins' } }
    ]
  },
  {
    id: 'chu-10',
    name: 'Chu No. 10 Medium (بيئة تشو 10)',
    category: 'freshwater',
    description: {
      ar: 'بيئة مياه عذبة منخفضة المغذيات تحاكي المياه الطبيعية للبحيرات والأنهار، مثالية لعزل ودراسة الداياتومات العذبة والطحالب العوالقية الحساسة.',
      en: 'An oligotrophic to mesotrophic freshwater medium simulating natural lake conditions, ideal for limnological plankton and freshwater diatoms.'
    },
    targetStrains: ['Freshwater Diatoms (Navicula, Synedra)', 'Asterionella', 'Fragilaria', 'Microcystis'],
    phRange: '6.8 - 7.5',
    autoclaveNotes: {
      ar: 'يُفضل ضبط الـ pH إلى 7.0 قبل التعقيم عند 121 °C لمدة 15 دقيقة لتفادي تعكير السيليكات.',
      en: 'Autoclave at 121 °C for 15 minutes. Ensure neutral pH to maintain silicate stability.'
    },
    preparationTips: {
      ar: 'نظراً لانخفاض تركيزاتها الكيميائية، تحاكي هذه البيئة بيئة المياه العذبة غير الملوثة، وتمنع الصدمة التناضحية للسلالات البرية المعزولة حديثاً.',
      en: 'Its low nutrient concentrations mimic unpolluted natural waters, preventing osmotic shock during wild strain isolation.'
    },
    components: [
      { name: 'نترات الكالسيوم (Calcium Nitrate tetrahydrate)', chemicalFormula: 'Ca(NO3)2·4H2O', concentrationPerLiter: 0.040, unit: 'g', role: { ar: 'مصدر مزدوج للكالسيوم والنيتروجين', en: 'Dual calcium and nitrogen source' } },
      { name: 'فوسفات ثنائي البوتاسيوم (Dipotassium Phosphate)', chemicalFormula: 'K2HPO4', concentrationPerLiter: 0.010, unit: 'g', role: { ar: 'مصدر الفوسفور المنخفض', en: 'Oligotrophic phosphorus source' } },
      { name: 'كبريتات المغنيسيوم (Magnesium Sulfate)', chemicalFormula: 'MgSO4·7H2O', concentrationPerLiter: 0.025, unit: 'g', role: { ar: 'مصدر المغنيسيوم والكبريت', en: 'Magnesium and sulfur supply' } },
      { name: 'كربونات الصوديوم (Sodium Carbonate)', chemicalFormula: 'Na2CO3', concentrationPerLiter: 0.020, unit: 'g', role: { ar: 'تنظيم القلوية والكربون غير العضوي', en: 'Alkalinity and carbon balance' } },
      { name: 'سيليكات الصوديوم (Sodium Silicate)', chemicalFormula: 'Na2SiO3·9H2O', concentrationPerLiter: 0.025, unit: 'g', role: { ar: 'عنصر السيليكون الأساسي لجدر داياتومات المياه العذبة', en: 'Silicate frustule building block' } },
      { name: 'كلوريد الحديديك (Ferric Chloride)', chemicalFormula: 'FeCl3·6H2O', concentrationPerLiter: 0.0008, unit: 'g', role: { ar: 'حديد نزر للتنفس والبناء الضوئي', en: 'Micronutrient iron supply' } }
    ]
  }
];
