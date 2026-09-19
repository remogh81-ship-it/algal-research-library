export interface AlgaeStrain {
  id: string;
  scientificName: string;
  commonName: {
    ar: string;
    en: string;
  };
  division: {
    ar: string;
    en: string;
  };
  habitat: {
    ar: string;
    en: string;
  };
  morphology: {
    ar: string;
    en: string;
  };
  growthMedium: string;
  optimalParams: {
    pH: string;
    temperature: string;
    salinity: string;
    light: string;
  };
  bioproducts: {
    ar: string[];
    en: string[];
  };
  applications: {
    ar: string[];
    en: string[];
  };
  description: {
    ar: string;
    en: string;
  };
  searchKeywords: string;
}

export const ALGAE_STRAINS: AlgaeStrain[] = [
  {
    id: 'arthrospira-platensis',
    scientificName: 'Arthrospira platensis (Spirulina)',
    commonName: {
      ar: 'سبيرولينا (طحلب حلزوني)',
      en: 'Spirulina'
    },
    division: {
      ar: 'البكتيريا الزرقاء (Cyanobacteria)',
      en: 'Cyanobacteria'
    },
    habitat: {
      ar: 'مياه قلوية مالحة وعذبة دافئة',
      en: 'Alkaline saline and warm freshwater lakes'
    },
    morphology: {
      ar: 'خيوط حلزونية متعددة الخلايا متحركة بدون سوط',
      en: 'Multicellular, helical filamentous trichomes'
    },
    growthMedium: 'Zarrouk Medium',
    optimalParams: {
      pH: '9.0 - 10.5',
      temperature: '30 - 38 °C',
      salinity: '10 - 30 g/L NaCl',
      light: '2,500 - 5,000 lux (16:8 L:D)'
    },
    bioproducts: {
      ar: ['الفيكوسيانين (Phycocyanin)', 'بروتين عالي النقاوة (60-70%)', 'حمض جاما لينولينيك (GLA)', 'فيتامين B12'],
      en: ['C-Phycocyanin', 'Crude Protein (60-70%)', 'Gamma-linolenic acid (GLA)', 'Vitamin B12']
    },
    applications: {
      ar: ['المكملات الغذائية وسوبر فود', 'ألوان غذائية ومستحضرات تجميل', 'مضادات أكسدة ومناعة', 'علف مائي عالي القيمة'],
      en: ['Nutraceuticals & Superfood', 'Natural blue colorant', 'Antioxidants & Immunostimulants', 'Aquaculture feed']
    },
    description: {
      ar: 'طحلب أزرق مخضر غني بالبروتين والفيكوسيانين، يُزرع عالمياً في أحواض مفتوحة ومفاعلات ضوئية حيوية، ويتميز بقدرته على النمو في وسط قلوي مرتفع مما يقلل مخاطر التلوث.',
      en: 'A premier blue-green microalga rich in protein and phycocyanin. Cultivated globally in raceway ponds and photobioreactors due to its high alkaline tolerance preventing contaminants.'
    },
    searchKeywords: 'Arthrospira platensis Spirulina phycocyanin protein Zarrouk'
  },
  {
    id: 'chlorella-vulgaris',
    scientificName: 'Chlorella vulgaris',
    commonName: {
      ar: 'كلوريلا الشائعة',
      en: 'Common Chlorella'
    },
    division: {
      ar: 'الطحالب الخضراء (Chlorophyta)',
      en: 'Chlorophyta'
    },
    habitat: {
      ar: 'مياه عذبة وتربة رطبة',
      en: 'Freshwater and damp soil'
    },
    morphology: {
      ar: 'خلايا كروية مفردة مجهرية غير متحركة',
      en: 'Spherical, unicellular non-motile microalgae (2-10 µm)'
    },
    growthMedium: 'BG-11 / BBM Medium',
    optimalParams: {
      pH: '6.5 - 7.5',
      temperature: '25 - 30 °C',
      salinity: 'عذبة (< 1 g/L NaCl)',
      light: '3,000 - 4,500 lux (16:8 L:D)'
    },
    bioproducts: {
      ar: ['عامل نمو كلوريلا (CGF)', 'كلوروفيل أ وب', 'بروتينات ودهون حيوية', 'لوتين (Lutein)'],
      en: ['Chlorella Growth Factor (CGF)', 'Chlorophyll a & b', 'Proteins & Neutral Lipids', 'Lutein']
    },
    applications: {
      ar: ['إزالة سمية المعادن الثقيلة', 'تغذية علاجية وصحية', 'معالجة مياه الصرف الصحي', 'إنتاج وقود حيوي'],
      en: ['Heavy metal bioremediation', 'Therapeutic nutrition', 'Wastewater treatment', 'Biodiesel production']
    },
    description: {
      ar: 'أشهر الطحالب الخضراء أحادية الخلية ذات معدل نمو سريع ومحتوى مرتفع من الكلوروفيل والبروتين، وتُستخدم بكثافة في معالجة مياه الصرف وتثبيت الكربون وتغذية الإنسان.',
      en: 'A fast-growing single-celled green microalga with high chlorophyll and protein content. Extensively utilized for carbon capture, wastewater bioremediation, and dietary supplements.'
    },
    searchKeywords: 'Chlorella vulgaris CGF chlorophyll BBM BG-11 wastewater'
  },
  {
    id: 'dunaliella-salina',
    scientificName: 'Dunaliella salina',
    commonName: {
      ar: 'دوناليلا الملاحات',
      en: 'Saline Dunaliella'
    },
    division: {
      ar: 'الطحالب الخضراء (Chlorophyta)',
      en: 'Chlorophyta'
    },
    habitat: {
      ar: 'البحيرات الملحية الشديدة والسبخات',
      en: 'Hypersaline lakes and solar salt evaporation ponds'
    },
    morphology: {
      ar: 'خلايا إجاصية متحركة بسوطين خالية من جدار خلوي صلب',
      en: 'Ovoid/pyriform biflagellate cell without rigid cell wall'
    },
    growthMedium: "Johnson's / Modified f/2 (High NaCl)",
    optimalParams: {
      pH: '7.5 - 9.0',
      temperature: '28 - 35 °C',
      salinity: '100 - 200 g/L NaCl',
      light: '5,000 - 10,000 lux (شمس ساطعة لتحفيز الصبغة)'
    },
    bioproducts: {
      ar: ['بيتا كاروتين طبيعي (تصل إلى 10-14% من الوزن الجاف)', 'جلسرول (Glycerol)', 'أحماض دهنية أوميغا'],
      en: ['Natural Beta-carotene (up to 10-14% dry wt)', 'Glycerol', 'Omega fatty acids']
    },
    applications: {
      ar: ['إنتاج فيتامين A الطبيعي', 'مضاد أكسدة فائق لمكافحة الشيخوخة', 'صناعة الأدوية ومستحضرات التجميل', 'أعلاف الاستزراع السمكي والجمبري'],
      en: ['Natural Pro-vitamin A', 'Anti-aging skincare & cosmetics', 'Pharmaceuticals', 'Shrimp & fish aquaculture']
    },
    description: {
      ar: 'طحلب ملحي فريد قادر على العيش في تركيزات ملح قصوى، يراكم كميات هائلة من البيتا كاروتين البرتقالي لحماية نفسه من الإشعاع الضوئي الشديد، ويعد المصدر الصناعي الأول للبيتا كاروتين الطبيعي عالمياً.',
      en: 'A halotolerant green flagellate thriving in hypersaline waters. Accumulates massive concentrations of beta-carotene under high salinity and light stress, serving as the top commercial source of natural provitamin A.'
    },
    searchKeywords: 'Dunaliella salina beta-carotene hypersaline glycerol carotenoids'
  },
  {
    id: 'haematococcus-pluvialis',
    scientificName: 'Haematococcus pluvialis',
    commonName: {
      ar: 'هيماتوكوكس (طحلب أستازانتين)',
      en: 'Haematococcus (Astaxanthin alga)'
    },
    division: {
      ar: 'الطحالب الخضراء (Chlorophyta)',
      en: 'Chlorophyta'
    },
    habitat: {
      ar: 'برك صخرية ومياه عذبة مؤقتة',
      en: 'Temporary freshwater pools and rock basins'
    },
    morphology: {
      ar: 'مرحلة خضراء سابحة بسوطين، تتحول عند الإجهاد إلى كيسات حمراء غير متحركة (Aplanospores)',
      en: 'Motile green flagellate forming thick-walled red cysts (aplanospores) under stress'
    },
    growthMedium: 'BBM / MES-Volvox Medium',
    optimalParams: {
      pH: '7.0 - 8.0',
      temperature: '20 - 25 °C (المرحلة الخضراء) / 28-30 °C (الإجهاد)',
      salinity: 'عذبة تماماً (< 0.5 g/L)',
      light: 'منخفض في النمو (1,500 lux) ثم إضاءة عالية للإجهاد (> 8,000 lux)'
    },
    bioproducts: {
      ar: ['أستازانتين طبيعي (Astaxanthin - أقوى مضاد أكسدة في الطبيعة)', 'أحماض دهنية غير مشبعة', 'جلوكان وبولي سكاريد'],
      en: ['Natural Astaxanthin ("King of Carotenoids")', 'Polyunsaturated fatty acids', 'Polysaccharides']
    },
    applications: {
      ar: ['مكملات غذائية مضادة للأكسدة وصحة القلب والعيون', 'تغذية سمك السلمون والجمبري لاكتساب اللون الوردي', 'مستحضرات التجميل وحماية الجلد من الأشعة فوق البنفسجية'],
      en: ['Dietary antioxidants & cardiovascular health', 'Salmon & shrimp flesh pigmentation', 'UV protection cosmetics']
    },
    description: {
      ar: 'أغنى مصدر طبيعي في العالم لصبغة الأستازانتين، التي تبلغ قوتها المضادة للأكسدة 6000 ضعف فيتامين C. تمر زراعته بطورين: طور خضري أخضر للكتلة الحيوية، وطور إجهاد أحمر لتركيز الصبغة.',
      en: 'The world richest natural source of astaxanthin, exhibiting antioxidant strength 6,000 times greater than Vitamin C. Cultivated in a two-stage process: green vegetative growth followed by red stress-induced encystment.'
    },
    searchKeywords: 'Haematococcus pluvialis astaxanthin antioxidant aplanospores carotenoid'
  },
  {
    id: 'scenedesmus-obliquus',
    scientificName: 'Scenedesmus obliquus (Tetradesmus obliquus)',
    commonName: {
      ar: 'سينيديزموس مائل',
      en: 'Scenedesmus'
    },
    division: {
      ar: 'الطحالب الخضراء (Chlorophyta)',
      en: 'Chlorophyta'
    },
    habitat: {
      ar: 'المياه العذبة والبرك ومحطات الصرف',
      en: 'Freshwater ponds, rivers, and municipal effluents'
    },
    morphology: {
      ar: 'مستعمرات رباعية (Coenobium) مميزة من خلايا مغزلية ملتحمة',
      en: 'Colonial coenobia of 4 or 8 spindle-shaped cells'
    },
    growthMedium: 'BG-11 / BBM',
    optimalParams: {
      pH: '6.8 - 8.2',
      temperature: '22 - 30 °C',
      salinity: 'عذبة إلى قليلة الملوحة',
      light: '3,000 - 5,000 lux (14:10 L:D)'
    },
    bioproducts: {
      ar: ['دهون ثلاثية لإنتاج البيوديزل (تصل لـ 40%)', 'بروتينات علفية', 'سكريات حيوية للتخمير الكحولي'],
      en: ['Lipids & TAGs for biodiesel (up to 40%)', 'Fodder proteins', 'Fermentable bio-sugars']
    },
    applications: {
      ar: ['الوقود الحيوي والبيوديزل', 'معالجة مياه الصرف الزراعي والصناعي واختزال النيتروجين والفوسفور', 'أعلاف الماشية والدواجن'],
      en: ['Biofuels & Biodiesel', 'Municipal & agricultural wastewater nutrient removal (N & P)', 'Animal fodder']
    },
    description: {
      ar: 'طحلب قوي شديد المقاومة للملوثات وتقلبات البيئة، يتميز بإنتاجية دهون مرتفعة تجعله المرشح المثالي لبرامج الوقود الحيوي ومعالجة مياه الصرف الصحي المدمجة.',
      en: 'A highly resilient green microalga capable of rapid nutrient uptake. Ideal for coupled bioremediation of agricultural/municipal wastewater and high-yield biodiesel generation.'
    },
    searchKeywords: 'Scenedesmus obliquus Tetradesmus biodiesel lipid wastewater bioremediation'
  },
  {
    id: 'nannochloropsis-oculata',
    scientificName: 'Nannochloropsis oculata',
    commonName: {
      ar: 'نانوكلوروبسيس بحرية',
      en: 'Nannochloropsis'
    },
    division: {
      ar: 'حقيقيات النوى الصفراء (Eustigmatophyceae)',
      en: 'Eustigmatophyceae'
    },
    habitat: {
      ar: 'المياه البحرية ومصبات الأنهار',
      en: 'Marine coastal and estuarine waters'
    },
    morphology: {
      ar: 'خلايا كروية فائقة الصغر (2-4 µm) خضراء بلون باهت',
      en: 'Small spherical cells (2-4 µm) with thick cell walls'
    },
    growthMedium: "Guillard's f/2 Medium",
    optimalParams: {
      pH: '7.8 - 8.4',
      temperature: '20 - 26 °C',
      salinity: '25 - 35 g/L (مياه بحر)',
      light: '3,500 - 6,000 lux'
    },
    bioproducts: {
      ar: ['حمض إيكوسابنتاينويك (EPA - أوميغا 3 بحري)', 'دهون حيوية تصل إلى 50%', 'فايتوستيرول'],
      en: ['Eicosapentaenoic acid (EPA, Omega-3)', 'Total lipids up to 50% dry wt', 'Phytosterols']
    },
    applications: {
      ar: ['تغذية يرقات الأسماك والروتيفيرا في المفرخات البحرية', 'مكملات أوميغا 3 النباتية بديلة لزيت السمك', 'وقود الطيران الحيوي المستدام'],
      en: ['Marine hatchery live feeds (Rotifer enrichment)', 'Vegan EPA Omega-3 supplements', 'Sustainable aviation fuel (SAF)']
    },
    description: {
      ar: 'طحلب دقيق بحري يعد الركيزة الأساسية لمفرخات الأسماك البحرية حول العالم، ويتميز بمحتواه الاستثنائي من حمض أوميغا 3 (EPA) والدهون القابلة للتحويل إلى وقود.',
      en: 'A flagship marine microalga in modern aquaculture. It produces high titers of EPA Omega-3 fatty acids and neutral lipids suitable for human supplements and sustainable aviation fuel.'
    },
    searchKeywords: 'Nannochloropsis oculata EPA omega-3 f/2 marine aquaculture lipid'
  },
  {
    id: 'phaeodactylum-tricornutum',
    scientificName: 'Phaeodactylum tricornutum',
    commonName: {
      ar: 'داياتوم فيوداكتيلوم',
      en: 'Phaeodactylum Diatom'
    },
    division: {
      ar: 'الطحالب العصوية / الداياتومات (Bacillariophyta)',
      en: 'Bacillariophyta (Diatom)'
    },
    habitat: {
      ar: 'المياه البحرية والمناطق الساحلية الضحلة',
      en: 'Marine coastal and tidal environments'
    },
    morphology: {
      ar: 'ثلاثي الأشكال: مغزلي، بيضاوي، وثلاثي الأشعة النادر؛ جدار سيليكا مرن',
      en: 'Polymorphic: fusiform, triradiate, and oval morphotypes'
    },
    growthMedium: "Guillard's f/2 Medium (+ Silicate for growth)",
    optimalParams: {
      pH: '7.8 - 8.5',
      temperature: '18 - 23 °C',
      salinity: '28 - 35 PSU',
      light: '2,500 - 4,500 lux'
    },
    bioproducts: {
      ar: ['صبغة فوكوزانثين (Fucoxanthin)', 'حمض EPA أوميغا 3', 'كريسولامينارين (Chrysolaminarin)'],
      en: ['Fucoxanthin', 'Eicosapentaenoic acid (EPA)', 'Chrysolaminarin']
    },
    applications: {
      ar: ['علاجات مكافحة السمنة وتخفيض سكر الدم', 'صيدلانيات مضادة للالتهابات والأورام', 'هندسة حيوية جينية كمصنع بيولوجي متقدم'],
      en: ['Anti-obesity & metabolic syndrome therapeutics', 'Anti-inflammatory & oncology pharma', 'Model organism for synthetic biology']
    },
    description: {
      ar: 'داياتوم نموذجي يتميز بتسلسل جينومي كامل وسهولة التحويل الوراثي، وينتج صبغة الفوكوزانثين الذهبية ذات الخصائص الطبية الفائقة في حرق الدهون ومقاومة الأكسدة.',
      en: 'The prime model diatom with fully sequenced genome and genetic tools. An industrial source of fucoxanthin (golden-brown pigment) with strong anti-diabetic and thermogenic fat-burning benefits.'
    },
    searchKeywords: 'Phaeodactylum tricornutum diatom fucoxanthin EPA f/2 model organism'
  },
  {
    id: 'ulva-lactuca',
    scientificName: 'Ulva lactuca',
    commonName: {
      ar: 'خس البحر (طحلب ماكرو أخضر)',
      en: 'Sea Lettuce'
    },
    division: {
      ar: 'الطحالب الخضراء الكبيرة (Chlorophyta - Macroalgae)',
      en: 'Chlorophyta (Ulvophyceae)'
    },
    habitat: {
      ar: 'شواطئ البحار الصخرية ومناطق المد والجزر في البحر المتوسط والأحمر',
      en: 'Intertidal and shallow coastal rocky shores globally'
    },
    morphology: {
      ar: 'نصل ورقي أخضر رقيق شفاف سمكه طبقتين خلويتين فقط',
      en: 'Foliose, translucent sheet-like thallus (2 cell layers thick)'
    },
    growthMedium: 'Enriched Natural Seawater (PES / Provasoli)',
    optimalParams: {
      pH: '8.0 - 8.6',
      temperature: '15 - 25 °C',
      salinity: '20 - 38 PSU',
      light: 'إضاءة شمس طبيعية (تغذية شاطئية)'
    },
    bioproducts: {
      ar: ['أولفان (Ulvan - سكريات كبريتية معقدة)', 'ألياف غذائية ذائبة', 'معادن نادرة (حديد ويود وكالسيوم)'],
      en: ['Ulvan (Sulfated polysaccharide)', 'Soluble dietary fibers', 'Trace minerals (Fe, I, Ca, Mg)']
    },
    applications: {
      ar: ['أغذية بشرية وسلطات بحرية', 'أسمدة ومحفزات نمو حيوية للمحاصيل الزراعية', 'مضادات فيروسات وبوليمرات حيوية قابلة للتحلل'],
      en: ['Human culinary consumption & seaweeds', 'Agricultural biostimulants & soil bio-fertilizer', 'Antiviral biomedical films & bioplastics']
    },
    description: {
      ar: 'طحلب بحري كبير واسع الانتشار على السواحل المصرية والعالمية، يتميز بقدرته الفائقة على امتصاص المغذيات واحتوائه على سكر الأولفان الكبريتي ذو الفوائد المناعية والزراعية.',
      en: 'A prolific green seaweed common along Egyptian Mediterranean and Red Sea coasts. Known for high ulvan content—a sulfated heteropolysaccharide with powerful immune-stimulating and plant-growth properties.'
    },
    searchKeywords: 'Ulva lactuca Sea Lettuce ulvan macroalgae biostimulant Egypt'
  },
  {
    id: 'sargassum-cinereum',
    scientificName: 'Sargassum sp. (Sargassum cinereum)',
    commonName: {
      ar: 'سارجاسوم (طحلب بني بحري)',
      en: 'Sargassum Brown Seaweed'
    },
    division: {
      ar: 'الطحالب البنية (Phaeophyceae)',
      en: 'Phaeophyceae'
    },
    habitat: {
      ar: 'الشعاب المرجانية وسواحل البحر الأحمر الدافئة',
      en: 'Tropical and subtropical coral reefs and rocky marine shores'
    },
    morphology: {
      ar: 'ثاليوس متفرع معقد مزود بمثانات هوائية (حويصلات) كروية تمنحه الطفو',
      en: 'Branched bushy thallus with spherical air bladders (pneumatocysts)'
    },
    growthMedium: 'Enriched Seawater',
    optimalParams: {
      pH: '8.1 - 8.4',
      temperature: '22 - 28 °C',
      salinity: '35 - 42 PSU (سواحل البحر الأحمر)',
      light: 'شمس بحرية ساطعة'
    },
    bioproducts: {
      ar: ['فوكويدان (Fucoidan)', 'حمض الألجينيك (Alginate)', 'بوليفينولات وفلوروتانينات'],
      en: ['Fucoidan', 'Alginate / Alginic acid', 'Phlorotannins & Polyphenols']
    },
    applications: {
      ar: ['صناعة الألجينات ومثبتات الأغذية والصيدلة', 'علاجات مضادة للتخثر والأورام', 'ممتز حيوي للمعادن الثقيلة والملوثات النفطية'],
      en: ['Alginate hydrogels & pharmaceutical gelling', 'Anticoagulant & anti-tumor agents', 'Heavy metal biosorption & oil spill clean-up']
    },
    description: {
      ar: 'من أهم الطحالب البنية الشائعة في البحر الأحمر المصري، غني بالفوكويدان والألجينات التي تشكل دعامة لصناعات الأدوية والمواد الهلامية ومعالجة ملوثات المياه والتطبيقات الطبية.',
      en: 'A prominent brown seaweed along Egyptian Red Sea reefs. Abundant in fucoidan and alginate, widely researched in Egypt for biomedical drug delivery, anticoagulants, and environmental remediation.'
    },
    searchKeywords: 'Sargassum fucoidan alginate brown seaweed Red Sea Egypt'
  },
  {
    id: 'nostoc-commune',
    scientificName: 'Nostoc commune',
    commonName: {
      ar: 'نوستوك المستعمر (كبسولة الجفاف)',
      en: 'Nostoc'
    },
    division: {
      ar: 'البكتيريا الزرقاء (Cyanobacteria)',
      en: 'Cyanobacteria'
    },
    habitat: {
      ar: 'التربة القاحلة والصحراوية والصخور الرطبة',
      en: 'Arid desert soils, limestone, and ephemeral damp surfaces'
    },
    morphology: {
      ar: 'مستعمرات هلامية صلبة متجمعة تحتوي على حويصلات متغايرة (Heterocysts) لتثبيت النيتروجين',
      en: 'Gelatinous macroscopic colonies with nitrogen-fixing heterocysts'
    },
    growthMedium: 'BG-110 (بدون نيتروجين N-free)',
    optimalParams: {
      pH: '7.5 - 8.8',
      temperature: '20 - 30 °C',
      salinity: 'مياه عذبة / تربية جافة مع رطوبة دورية',
      light: '2,000 - 4,000 lux'
    },
    bioproducts: {
      ar: ['نوستوفلافين (Nostoflaving)', 'سكريات مخاطية خارجية (EPS)', 'نيتروجين حيوي مثبت', 'ميكوسبورين أشباه الأحماض الأمينية (MAAs)'],
      en: ['Nostoflaving', 'Extracellular polymeric substances (EPS)', 'Fixed biological Nitrogen', 'Mycosporine-like amino acids (MAAs)']
    },
    applications: {
      ar: ['استصلاح الأراضي الصحراوية ومقاومة التصحر', 'تثبيت الكثبان الرملية وحفظ رطوبة التربة', 'أسمدة نيتروجينية حيوية بدون كيماويات', 'واقيات شمسية طبيعية'],
      en: ['Desert soil reclamation & crust restoration', 'Sand dune stabilization', 'Biological nitrogen biofertilizer', 'Natural UV-absorbing cosmetics']
    },
    description: {
      ar: 'بكتيريا زرقاء مدهشة قادرة على تحمل الجفاف الكامل لعقود ثم استعادة نشاطها بدقائق عند توفر الماء، وتلعب دوراً رائداً في مصر لاستصلاح الأراضي الرملية وتثبيت النيتروجين الجوي ذاتياً.',
      en: 'An extraordinary anhydrobiotic cyanobacterium capable of surviving complete desiccation for decades. A cornerstone of desert crust stabilization, non-chemical nitrogen fixation, and agricultural regeneration.'
    },
    searchKeywords: 'Nostoc commune cyanobacteria nitrogen fixation desert soil reclamation'
  },
  {
    id: 'euglena-gracilis',
    scientificName: 'Euglena gracilis',
    commonName: {
      ar: 'يوجلينا رشيقة',
      en: 'Euglena'
    },
    division: {
      ar: 'اليوجلينات (Euglenozoa)',
      en: 'Euglenozoa'
    },
    habitat: {
      ar: 'المياه العذبة الغنية بالمواد العضوية والبرك الضحلة',
      en: 'Organic-rich freshwaters and shallow ponds'
    },
    morphology: {
      ar: 'خلايا مغزلية مرنة متغيرة الشكل مزودة بسوط أمامي وبقعة عينية حمراء حساسة للضوء',
      en: 'Spindle-shaped flexuous cells with single long flagellum and red stigma eye-spot'
    },
    growthMedium: 'Koren-Hutner (KH) / Cramers-Myers',
    optimalParams: {
      pH: '3.5 - 6.5 (تفضل الوسط الحمضي قليلاً)',
      temperature: '24 - 28 °C',
      salinity: 'عذبة (< 1 g/L)',
      light: 'مختلطة التغذية (ضوء + جلوكوز أو إيثانول)'
    },
    bioproducts: {
      ar: ['باراميلون (Paramylon - بيتا 1,3 جلوكان نقي 100%)', 'فيتامينات A, C, E', 'أحماض أمينية كاملة بدون جدار خلوي سيليلوزي'],
      en: ['Paramylon (Pure Beta-1,3-glucan)', 'Complete Vitamins (A, C, E, B-complex)', 'High-digestibility proteins (no cell wall)']
    },
    applications: {
      ar: ['تقوية الجهاز المناعي ومقاومة نزلات البرد', 'أغذية الفضاء والرعاية الصحية الفائقة', 'بلاستيك حيوي مستدام من الباراميلون'],
      en: ['Immune system stimulation', 'Space nutrition & emergency food packs', 'Bioplastics synthesized from paramylon']
    },
    description: {
      ar: 'كائن مختلط التغذية فريد يجمع بين صفات النبات والحيوان، لا يمتلك جداراً سيليلوزياً مما يجعل امتصاص بروتيناته في جسم الإنسان يتجاوز 93%، ويخزن طاقته على هيئة باراميلون المناعي الفريد.',
      en: 'A unique mixotrophic protist combining plant and animal features. Lacking a rigid cellulosic cell wall, it boasts a 93%+ human digestive absorption rate and stores carbon as beta-1,3-glucan (paramylon).'
    },
    searchKeywords: 'Euglena gracilis paramylon beta-glucan mixotrophic space food'
  },
  {
    id: 'porphyridium-cruentum',
    scientificName: 'Porphyridium cruentum (P. purpureum)',
    commonName: {
      ar: 'بورفيريديوم (طحلب أحمر دقيق)',
      en: 'Red Microalga Porphyridium'
    },
    division: {
      ar: 'الطحالب الحمراء (Rhodophyta)',
      en: 'Rhodophyta'
    },
    habitat: {
      ar: 'مياه بحرية وشبه مالحة والتربة الرطبة بالقرب من السواحل',
      en: 'Marine, brackish, and damp coastal soils'
    },
    morphology: {
      ar: 'خلايا كروية مفردة حمراء أو قرمزية محاطة بغلاف هلامي كثيف',
      en: 'Unicellular spherical cells encapsulated by thick mucilaginous polysaccharide sheath'
    },
    growthMedium: "Jones Medium / Modified f/2",
    optimalParams: {
      pH: '7.5 - 8.2',
      temperature: '20 - 25 °C',
      salinity: '25 - 35 PSU',
      light: '1,500 - 3,500 lux (حساسة للضوء العالي)'
    },
    bioproducts: {
      ar: ['فايكوإريثرين (B-Phycoerythrin - صبغة حمراء متفلورة)', 'سكريات كبريتية خارجية مضادة للأكسدة', 'حمض أراكيدونيك (ARA)'],
      en: ['B-Phycoerythrin (Fluorescent red pigment)', 'Sulfated exopolysaccharides (sEPS)', 'Arachidonic acid (ARA)']
    },
    applications: {
      ar: ['كواشف تشخيصية متفلورة في التدفق الخلوي (Flow cytometry)', 'مستحضرات تجميل راقية لترطيب الجلد', 'مضادات للفيروسات ومسكنات حيوية'],
      en: ['Fluorescent diagnostic probes for flow cytometry', 'Luxury skincare barrier moisturizing', 'Antiviral formulations']
    },
    description: {
      ar: 'طحلب أحمر دقيق ثمين ينتج صبغة الفايكوإريثرين الحمراء المشعة ذات القيمة المالية والعلمية الهائلة في التشخيص الطبي والأورام والوسم الفلوري.',
      en: 'A high-value red unicellular microalga. Synthesizes B-phycoerythrin—a radiant fluorophore widely used in biomedical cell sorting, immunoassay fluorescence, and therapeutic dermatology.'
    },
    searchKeywords: 'Porphyridium cruentum phycoerythrin red microalga sulfated polysaccharide'
  }
];
