export const SOPS_DATA = [
  {
    id: 'apha-10200-h',
    title: { en: 'Chlorophyll Determination (APHA 10200 H)', ar: 'تقدير الكلوروفيل (طريقة APHA 10200 H)' },
    category: { en: 'Pigments & Bioactives', ar: 'الصبغات والمركبات الحيوية' },
    difficulty: { en: 'Intermediate', ar: 'متوسط' },
    duration: { en: '3-4 Hours', ar: '3-4 ساعات' },
    safety: { en: 'BSL-1, Fume Hood', ar: 'مستوى أمان 1، يلزم غطاء دخان' },
    description: { en: 'Standard APHA method for the extraction and spectrophotometric/fluorometric determination of chlorophyll a, b, and c in phytoplankton using 90% aqueous acetone.', ar: 'طريقة APHA القياسية لاستخلاص وتقدير الكلوروفيل أ، ب، وجـ في الهائمات النباتية باستخدام الأسيتون المائي بتركيز 90%.' },
    url: 'https://www.standardmethods.org/doi/10.2105/SMWW.2882.208',
    reagents: [
      { name: '90% Aqueous Acetone', qty: 'Varies', unit: 'mL' },
      { name: 'Magnesium Carbonate (MgCO3) suspension', qty: '1', unit: 'mL' }
    ],
    steps: [
      { en: 'Concentrate sample by centrifuging or filtering through a glass fiber filter.', ar: 'ركز العينة عن طريق الطرد المركزي أو الترشيح باستخدام فلتر ألياف زجاجية.' },
      { en: 'Grind the filter/pellet in 90% acetone with a tissue grinder.', ar: 'اطحن الفلتر/الكتلة في 90% أسيتون باستخدام مطحنة الأنسجة.' },
      { en: 'Steep the samples overnight at 4°C in the dark.', ar: 'انقع العينات طوال الليل عند 4 درجات مئوية في الظلام.' },
      { en: 'Clarify by centrifugation, then measure optical density at 664, 647, 630, and 750 nm.', ar: 'اطرد مركزياً لترويق المستخلص، ثم قس الامتصاص الضوئي عند 664، 647، 630، و 750 نانومتر.' },
      { en: 'Calculate pigment concentrations using the Trichromatic equations.', ar: 'احسب تركيزات الصبغات باستخدام معادلات Trichromatic القياسية.' }
    ]
  },
  {
    id: 'apha-10200-f',
    title: { en: 'Phytoplankton Counting (APHA 10200 F)', ar: 'عد الهائمات النباتية (طريقة APHA 10200 F)' },
    category: { en: 'Isolation & Cultivation', ar: 'العزل والاستزراع' },
    difficulty: { en: 'Intermediate', ar: 'متوسط' },
    duration: { en: '1-2 Hours', ar: '1-2 ساعة' },
    safety: { en: 'BSL-1', ar: 'مستوى أمان حيوي 1' },
    description: { en: 'Standard APHA microscopic techniques for counting phytoplankton/microalgae, utilizing Sedgwick-Rafter cell, Palmer-Maloney nannoplankton cell, or inverted microscope.', ar: 'الطرق الميكروسكوبية القياسية لجمعية APHA لعد الطحالب والهائمات النباتية، باستخدام خلايا عد Sedgwick-Rafter أو Palmer-Maloney.' },
    url: 'https://www.standardmethods.org/doi/10.2105/SMWW.2882.208',
    reagents: [
      { name: 'Lugol’s Iodine Solution (Preservative)', qty: '1', unit: 'mL / 100mL' }
    ],
    steps: [
      { en: 'Preserve the sample immediately with Lugol’s solution if not examined fresh.', ar: 'احفظ العينة فوراً بمحلول لوجول إذا لم تفحص طازجة.' },
      { en: 'Transfer a well-mixed sample aliquot to the counting chamber (e.g., Sedgwick-Rafter).', ar: 'انقل جزءاً من العينة المخلوطة جيداً إلى شريحة العد (مثل Sedgwick-Rafter).' },
      { en: 'Allow cells to settle (approx. 15 mins for Sedgwick-Rafter).', ar: 'اترك الخلايا لتترسب (حوالي 15 دقيقة).' },
      { en: 'Enumerate cells across at least 10 random fields or random strips.', ar: 'قم بعد الخلايا في 10 حقول عشوائية أو شرائط عرضية على الأقل.' },
      { en: 'Calculate cell density (cells/mL) based on chamber volume and magnification.', ar: 'احسب كثافة الخلايا (خلية/مل) بناءً على حجم غرفة العد والتكبير.' }
    ]
  },
  {
    id: 'apha-2540-d',
    title: { en: 'Microalgal Biomass / TSS (APHA 2540 D)', ar: 'كتلة الطحالب / المواد الصلبة العالقة (APHA 2540 D)' },
    category: { en: 'Lipids & Biofuels', ar: 'الدهون والوقود الحيوي' },
    difficulty: { en: 'Beginner', ar: 'مبتدئ' },
    duration: { en: '2 Hours (Plus Drying)', ar: 'ساعتان (+ وقت التجفيف)' },
    safety: { en: 'BSL-1, Thermal Hazard', ar: 'مستوى أمان 1، خطر حراري' },
    description: { en: 'Determination of Total Suspended Solids (TSS) adapted for estimating microalgae dry weight biomass. Involves filtration and oven drying at 103-105°C.', ar: 'تقدير المواد الصلبة العالقة الكلية (TSS) المعدلة لحساب الوزن الجاف لكتلة الطحالب الحيوية بالتجفيف عند 103-105 درجة مئوية.' },
    url: 'https://www.standardmethods.org/doi/10.2105/SMWW.2882.030',
    reagents: [
      { name: 'Deionized Water (for washing)', qty: '20', unit: 'mL' }
    ],
    steps: [
      { en: 'Prepare and pre-weigh a glass-fiber filter (e.g., GF/C) after drying at 103°C.', ar: 'قم بإعداد وزن فلتر ألياف زجاجية مسبقاً بعد تجفيفه عند 103 درجة مئوية.' },
      { en: 'Filter a known volume of the microalgal culture through the filter under vacuum.', ar: 'رشح حجماً معروفاً من مزرعة الطحالب عبر الفلتر باستخدام التفريغ.' },
      { en: 'Wash the filter with three successive 10-mL volumes of DI water to remove salts.', ar: 'اغسل الفلتر بـ 3 دفعات (10 مل لكل دفعة) من الماء المقطر لإزالة الأملاح.' },
      { en: 'Dry the filter with biomass in an oven at 103–105°C for at least 1 hour.', ar: 'جفف الفلتر مع الكتلة الحيوية في فرن عند 103-105 مئوية لمدة ساعة على الأقل.' },
      { en: 'Cool in a desiccator, weigh, and calculate dry weight per liter.', ar: 'برده في مجفف، ثم زنه، واحسب الوزن الجاف لكل لتر.' }
    ]
  },
  {
    id: 'apha-4500-no3',
    title: { en: 'Nitrate Determination (APHA 4500-NO3)', ar: 'تقدير النترات في الأوساط (APHA 4500-NO3)' },
    category: { en: 'Isolation & Cultivation', ar: 'العزل والاستزراع' },
    difficulty: { en: 'Intermediate', ar: 'متوسط' },
    duration: { en: '1 Hour', ar: 'ساعة واحدة' },
    safety: { en: 'BSL-1, Chemical Hazard', ar: 'مستوى أمان 1، خطر كيميائي' },
    description: { en: 'Standard APHA spectrophotometric method for measuring nitrate-nitrogen in algal culture media to monitor nutrient depletion (e.g., UV Screening or Cadmium Reduction).', ar: 'طريقة APHA الطيفية القياسية لقياس النترات في بيئات نمو الطحالب لمراقبة استهلاك المغذيات.' },
    url: 'https://www.standardmethods.org/doi/10.2105/SMWW.2882.091',
    reagents: [
      { name: 'Hydrochloric Acid (HCl)', qty: '1', unit: 'mL' },
      { name: 'Nitrate Stock Solution', qty: 'As needed', unit: 'mL' }
    ],
    steps: [
      { en: 'Filter culture sample to remove algal biomass and obtain clear medium.', ar: 'قم بترشيح عينة المزرعة لإزالة كتلة الطحالب والحصول على بيئة صافية.' },
      { en: 'Add 1 mL of 1N HCl to 50 mL clear sample to prevent interference.', ar: 'أضف 1 مل من حمض الهيدروكلوريك (1N) إلى 50 مل من العينة.' },
      { en: 'Read absorbance against a distilled water blank at 220 nm and 275 nm.', ar: 'اقرأ الامتصاص مقابل ماء مقطر كعينة فارغة عند 220 و 275 نانومتر.' },
      { en: 'Subtract twice the absorbance at 275 nm from the 220 nm reading.', ar: 'اطرح ضعف قراءة الامتصاص عند 275 نانومتر من قراءة 220 نانومتر.' },
      { en: 'Calculate nitrate concentration using a standard calibration curve.', ar: 'احسب تركيز النترات باستخدام منحنى المعايرة القياسي.' }
    ]
  },
  {
    id: 'protein-lowry',
    title: { en: 'Total Protein (Lowry Method)', ar: 'البروتين الكلي (طريقة لوري)' },
    category: { en: 'Pigments & Bioactives', ar: 'الصبغات والمركبات الحيوية' },
    difficulty: { en: 'Intermediate', ar: 'متوسط' },
    duration: { en: '2 Hours', ar: 'ساعتان' },
    safety: { en: 'BSL-1', ar: 'مستوى أمان حيوي 1' },
    description: { en: 'Widely adapted standard method for determining total protein content in microalgal biomass utilizing the Folin-Ciocalteu reagent.', ar: 'طريقة قياسية معتمدة على نطاق واسع لتقدير محتوى البروتين الكلي في الكتلة الحيوية للطحالب الدقيقة باستخدام كاشف Folin-Ciocalteu.' },
    url: 'https://doi.org/10.1016/S0021-9258(19)52451-6',
    reagents: [
      { name: 'Alkaline Copper Solution', qty: '5', unit: 'mL' },
      { name: 'Folin-Ciocalteu Reagent', qty: '0.5', unit: 'mL' }
    ],
    steps: [
      { en: 'Extract proteins from algal biomass using hot alkaline lysis (0.5N NaOH).', ar: 'استخلص البروتينات من كتلة الطحالب باستخدام التحلل القلوي الساخن (0.5N NaOH).' },
      { en: 'Add 5 mL of Alkaline Copper Solution to 1 mL of the protein extract.', ar: 'أضف 5 مل من المحلول النحاسي القلوي إلى 1 مل من مستخلص البروتين.' },
      { en: 'Incubate for 10 minutes at room temperature.', ar: 'حَضِّن لمدة 10 دقائق في درجة حرارة الغرفة.' },
      { en: 'Add 0.5 mL of diluted Folin-Ciocalteu reagent and immediately vortex.', ar: 'أضف 0.5 مل من كاشف Folin-Ciocalteu المخفف ورج المزيج فوراً.' },
      { en: 'Incubate in the dark for 30 mins and read absorbance at 750 nm.', ar: 'حَضِّن في الظلام لمدة 30 دقيقة واقرأ الامتصاص عند 750 نانومتر.' }
    ]
  },
  {
    id: 'carbohydrate-dubois',
    title: { en: 'Total Carbohydrates (Phenol-Sulfuric Acid)', ar: 'الكربوهيدرات الكلية (الفينول وحمض الكبريتيك)' },
    category: { en: 'Lipids & Biofuels', ar: 'الدهون والوقود الحيوي' },
    difficulty: { en: 'Intermediate', ar: 'متوسط' },
    duration: { en: '2 Hours', ar: 'ساعتان' },
    safety: { en: 'BSL-1, Corrosive Hazard', ar: 'مستوى أمان 1، مواد كاوية (حامض)' },
    description: { en: 'Standard Dubois method for the rapid quantitative colorimetric determination of total carbohydrates in algal biomass.', ar: 'طريقة ديبوا (Dubois) القياسية للتقدير اللوني الكمي السريع للكربوهيدرات الكلية في كتلة الطحالب.' },
    url: 'https://doi.org/10.1021/ac60111a017',
    reagents: [
      { name: '5% Aqueous Phenol', qty: '1', unit: 'mL' },
      { name: 'Concentrated Sulfuric Acid (H2SO4)', qty: '5', unit: 'mL' }
    ],
    steps: [
      { en: 'Hydrolyze algal biomass with dilute acid to release simple sugars.', ar: 'قم بالتحلل المائي لكتلة الطحالب باستخدام حمض مخفف لتحرير السكريات البسيطة.' },
      { en: 'Take 1 mL of the sugar extract and add 1 mL of 5% Phenol solution.', ar: 'خذ 1 مل من مستخلص السكر وأضف 1 مل من محلول الفينول 5%.' },
      { en: 'Rapidly add 5 mL of concentrated sulfuric acid directly to the liquid surface.', ar: 'أضف 5 مل من حمض الكبريتيك المركز بسرعة مباشرة على سطح السائل.' },
      { en: 'Allow the tubes to stand for 10 minutes, then shake and place in a water bath at 25-30°C for 20 mins.', ar: 'اترك الأنابيب لمدة 10 دقائق، ثم رجها وضعها في حمام مائي (25-30 درجة مئوية) لمدة 20 دقيقة.' },
      { en: 'Measure absorbance at 490 nm and calculate using a glucose standard curve.', ar: 'قس الامتصاص عند 490 نانومتر واحسب التركيز باستخدام منحنى الجلوكوز القياسي.' }
    ]
  }
];
