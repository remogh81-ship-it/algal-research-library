export const SOPS_DATA = [
  {
    id: 'lipid-extraction',
    title: { en: 'Total Lipid Extraction (Modified Bligh & Dyer)', ar: 'استخلاص الدهون الكلية (طريقة بليغ وداير المعدلة)' },
    category: { en: 'Lipids & Biofuels', ar: 'الدهون والوقود الحيوي' },
    difficulty: { en: 'Intermediate', ar: 'متوسط' },
    duration: { en: '4 Hours', ar: '4 ساعات' },
    safety: { en: 'BSL-1, Fume Hood Required', ar: 'مستوى أمان حيوي 1، يلزم غطاء دخان' },
    description: { en: 'Standard gravimetric protocol for extracting and quantifying total neutral and polar lipids from microalgae biomass using Chloroform:Methanol.', ar: 'بروتوكول قياسي لاستخلاص وكمية الدهون من الكتلة الحيوية الدقيقة للطحالب باستخدام المذيبات.' },
    url: 'https://doi.org/10.1139/y59-099',
    reagents: [
      { name: 'Chloroform', qty: '1', unit: 'vol' },
      { name: 'Methanol', qty: '2', unit: 'vol' },
      { name: 'Distilled Water', qty: '0.8', unit: 'vol' }
    ],
    steps: [
      { en: 'Harvest 50-100 mg of freeze-dried biomass.', ar: 'احصد 50-100 مجم من الكتلة الحيوية المجففة بالتبريد.' },
      { en: 'Add 3 mL of Chloroform:Methanol (1:2 v/v) and vortex for 5 mins.', ar: 'أضف 3 مل من الكلوروفورم:ميثانول ورج لمدة 5 دقائق.' },
      { en: 'Add 1 mL Chloroform, 1 mL Water to induce phase separation. Centrifuge.', ar: 'أضف 1 مل كلوروفورم و 1 مل ماء لفصل الطبقات. استخدم جهاز الطرد المركزي.' },
      { en: 'Recover lower phase, evaporate solvent under N2, and weigh.', ar: 'استرجع الطبقة السفلية، بخر المذيب، ثم زن الدهون.' }
    ]
  },
  {
    id: 'cell-counting',
    title: { en: 'Cell Counting via Hemocytometer', ar: 'عد الخلايا بواسطة شريحة هيموسيتوميتر' },
    category: { en: 'Isolation & Cultivation', ar: 'العزل والاستزراع' },
    difficulty: { en: 'Beginner', ar: 'مبتدئ' },
    duration: { en: '30 Mins', ar: '30 دقيقة' },
    safety: { en: 'BSL-1', ar: 'مستوى أمان حيوي 1' },
    description: { en: 'Standard cell counting procedure for tracking microalgae growth curves using a Neubauer chamber.', ar: 'إجراء قياسي لعد الخلايا وتتبع منحنى نمو الطحالب باستخدام شريحة نيوباور.' },
    url: 'https://www.protocols.io/view/microalgae-cell-counting-using-a-hemocytometer-bjxzkpn6',
    reagents: [
      { name: 'Lugols Iodine (Optional)', qty: '1', unit: 'drop' }
    ],
    steps: [
      { en: 'Clean the Neubauer chamber and place the coverslip.', ar: 'نظف شريحة نيوباور وضع الغطاء.' },
      { en: 'Pipette 10 µL of well-mixed culture under the coverslip.', ar: 'ضع 10 ميكرولتر من المزرعة المختلطة.' },
      { en: 'Count cells in the 4 corner squares and central square.', ar: 'عد الخلايا في المربعات الأربعة والمربع المركزي.' },
      { en: 'Calculate cells/mL = Total count x 10^4 / number of squares.', ar: 'احسب عدد الخلايا/مل = العدد الكلي × 10^4 / عدد المربعات.' }
    ]
  },
  {
    id: 'chlorophyll-extraction',
    title: { en: 'Chlorophyll & Carotenoid Quantification', ar: 'تقدير كمية الكلوروفيل والكاروتينات' },
    category: { en: 'Pigments & Bioactives', ar: 'الصبغات والمركبات الحيوية' },
    difficulty: { en: 'Beginner', ar: 'مبتدئ' },
    duration: { en: '2 Hours', ar: 'ساعتان' },
    safety: { en: 'BSL-1, Fume Hood Recommended', ar: 'مستوى أمان 1، يوصى بغطاء دخان' },
    description: { en: 'Spectrophotometric quantification of Chlorophyll a, b, and total carotenoids using 80% Acetone or Methanol (Lichtenthaler equations).', ar: 'التقدير الطيفي للكلوروفيل أ، ب، والكاروتينات الكلية باستخدام الأسيتون أو الميثانول.' },
    url: 'https://doi.org/10.1016/0027-5107(87)90259-7',
    reagents: [
      { name: '80% Acetone or 100% Methanol', qty: '5', unit: 'mL' }
    ],
    steps: [
      { en: 'Centrifuge culture to pellet cells and discard supernatant.', ar: 'اطرد المزرعة مركزياً وتخلص من الجزء العلوي.' },
      { en: 'Add 5 mL of solvent, vortex, and incubate in dark at 4°C for 24h.', ar: 'أضف 5 مل من المذيب، ورج المزيج، ثم حضنه في الظلام عند 4 درجات مئوية لمدة 24 ساعة.' },
      { en: 'Centrifuge again and read absorbance at 663, 645, and 470 nm.', ar: 'اطرد مركزياً مرة أخرى واقرأ الامتصاص عند 663، 645، و 470 نانومتر.' },
      { en: 'Apply Lichtenthaler (1987) equations to calculate pigment concentrations.', ar: 'استخدم معادلات Lichtenthaler لحساب تركيزات الصبغات.' }
    ]
  }
];
