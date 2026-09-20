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
  }
];
