export const MASTER_CATEGORIES = [
  'Biofuels & Bioenergy',
  'Wastewater Treatment & Bioremediation',
  'Carbon Capture & Bio-fixation',
  'Pharmaceuticals & Bioactive Compounds',
  'Food & Functional Nutrition',
  'Agriculture & Biofertilizers',
  'Aquaculture & Animal Feed',
  'Cosmetics & Personal Care',
  'Bioplastics & Biomaterials',
  'Algal Cultivation & Bioprocess',
  'Ecology, Taxonomy & Blooms',
  'Applied Phycology & Biotechnology',
] as const;

export type MasterCategory = typeof MASTER_CATEGORIES[number];

export const CATEGORY_ARABIC_MAP: Record<MasterCategory, string> = {
  'Biofuels & Bioenergy': 'الوقود والطاقة الحيوية',
  'Wastewater Treatment & Bioremediation': 'معالجة مياه الصرف والمعالجة الحيوية',
  'Carbon Capture & Bio-fixation': 'احتجاز وتثبيت الكربون',
  'Pharmaceuticals & Bioactive Compounds': 'المركبات الصيدلانية والحيوية النشطة',
  'Food & Functional Nutrition': 'الأغذية والمكملات الغذائية',
  'Agriculture & Biofertilizers': 'الزراعة والمخصبات الحيوية',
  'Aquaculture & Animal Feed': 'الاستزراع المائي وأعلاف الحيوانات',
  'Cosmetics & Personal Care': 'مستحضرات التجميل والعناية الشخصية',
  'Bioplastics & Biomaterials': 'البلاستيك الحيوي والمواد المتقدمة',
  'Algal Cultivation & Bioprocess': 'استزراع الطحالب والعمليات الحيوية',
  'Ecology, Taxonomy & Blooms': 'البيئة والتصنيف وازدهار الطحالب',
  'Applied Phycology & Biotechnology': 'علم الطحالب التطبيقي والتكنولوجيا الحيوية',
};

/**
 * Intelligent Academic Phycology Classifier
 * Classifies research papers into the standard international phycology domains
 * based on contextual title, abstract, and keywords.
 */
export function classifyPhycologyPaper(title?: string, summary?: string, originalCategory?: string): MasterCategory {
  const text = `${title || ''} ${summary || ''}`.toLowerCase();
  const orig = (originalCategory || '').trim().toLowerCase();

  // 1. Wastewater Treatment & Bioremediation (Heavy metals, dyes, municipal, effluent, adsorption)
  if (/(wastewater|sewage|effluent|remediation|biosorption|adsorption|heavy metal|lead\(|cadmium|copper|chromium|nickel|dye removal|pollutant|phycoremediation)/i.test(text) ||
      orig.includes('wastewater') || orig.includes('remediation') || orig.includes('biosorption') || orig.includes('معالجة')) {
    return 'Wastewater Treatment & Bioremediation';
  }

  // 2. Carbon Capture & Bio-fixation (CO2, flue gas, sequestration, climate)
  if (/(carbon capture|co2 fixation|co2 bio-fixation|carbon bio-fixation|sequestration|co2 mitigation|flue gas|carbon dioxide removal|negative emissions)/i.test(text) ||
      orig.includes('carbon') || orig.includes('كربون')) {
    return 'Carbon Capture & Bio-fixation';
  }

  // 3. Pharmaceuticals & Bioactive Compounds (Antioxidants, antimicrobials, therapeutics, peptides)
  if (/(pharmaceutical|antioxidant|antimicrobial|antibacterial|antiviral|anticancer|anti-inflammatory|cytotoxic|bioactive peptide|polysaccharide|therapeutic|drug discovery|phycobiliprotein|astaxanthin)/i.test(text) ||
      orig.includes('medicine') || orig.includes('pharmaceutical') || orig.includes('صيدلان')) {
    return 'Pharmaceuticals & Bioactive Compounds';
  }

  // 4. Food, Functional Nutrition & Nutraceuticals (Dietary, supplements, omega-3, protein)
  if (/(nutraceutical|supplement|human health|dietary|edible|nutrition|functional food|protein source|omega-3|polyunsaturated fatty acid|dha|epa|vitamin|spirulina food|chlorella supplement)/i.test(text) ||
      orig.includes('nutrition') || orig.includes('food') || orig.includes('تغذي')) {
    return 'Food & Functional Nutrition';
  }

  // 5. Agriculture, Biofertilizers & Biostimulants (Soil, crops, plant growth)
  if (/(biofertilizer|fertilizer|biostimulant|crop|soil conditioning|plant growth|agri-food|agricultural|rhizosphere|plant immunity)/i.test(text) ||
      orig.includes('agriculture') || orig.includes('زراع')) {
    return 'Agriculture & Biofertilizers';
  }

  // 6. Aquaculture & Animal Feed (Fish feed, shrimp, livestock, rotifers)
  if (/(aquaculture|fish feed|aquafeed|shrimp|larvae|animal feed|poultry|livestock|rotifer|artemia|marine hatcher)/i.test(text) ||
      orig.includes('aquaculture') || orig.includes('feed') || orig.includes('أسماك') || orig.includes('علف')) {
    return 'Aquaculture & Animal Feed';
  }

  // 7. Cosmetics & Personal Care (Skincare, anti-aging, UV protection)
  if (/(cosmetic|cosmeceutical|skin care|skincare|anti-aging|uv protection|moisturiz|dermal|collagen|pigment for cosmetics)/i.test(text) ||
      orig.includes('cosmetics') || orig.includes('تجميل')) {
    return 'Cosmetics & Personal Care';
  }

  // 8. Bioplastics, Nanomaterials & Biomaterials (PHA, PHB, nanoparticles, biochar)
  if (/(bioplastic|polyhydroxyalkanoate|pha|phb|nanoparticle|nanomaterial|biochar|hydrogel|biopolymer|biodegradable plastic|packaging material)/i.test(text) ||
      orig.includes('materials') || orig.includes('plastic') || orig.includes('نانو')) {
    return 'Bioplastics & Biomaterials';
  }

  // 9. Ecology, Taxonomy, Biodiversity & Algal Blooms (HABs, phylogeny, systematics, seaweeds)
  if (/(bloom|harmful algal|hab|taxonomy|systematics|morpholog|phylogen|biodiversity|ecological|macroalgae|seaweed|sargassum|ulva|gracilaria|species diversity|limnology)/i.test(text) ||
      orig.includes('ecology') || orig.includes('taxonomy') || orig.includes('macroalgae') || orig.includes('بيئ')) {
    return 'Ecology, Taxonomy & Blooms';
  }

  // 10. Algal Cultivation, Photobioreactors & Harvesting (PBR, raceway, kinetics, flocculation)
  if (/(photobioreactor|pbr|raceway|open pond|flocculation|harvesting|centrifugation|cultivation system|growth kinetic|scale-up|cell disruption|culture medium)/i.test(text) ||
      orig.includes('cultivation') || orig.includes('استزراع')) {
    return 'Algal Cultivation & Bioprocess';
  }

  // 11. Biofuels & Bioenergy (Biodiesel, ethanol, biomethane, pyrolysis, lipids)
  if (/(biofuel|biodiesel|bioethanol|biomethane|biohydrogen|hydrothermal liquefaction|transesterification|lipid production|bioenergy|crude bio-oil|fame)/i.test(text) ||
      orig === 'biofuel' || orig.includes('biofuel') || orig.includes('وقود')) {
    return 'Biofuels & Bioenergy';
  }

  // 12. General Applied Phycology & Biotechnology fallback
  return 'Applied Phycology & Biotechnology';
}

export const categoryMap: Record<string, MasterCategory> = {
  'Biofuels & Bioenergy': 'Biofuels & Bioenergy',
  'Wastewater Treatment & Bioremediation': 'Wastewater Treatment & Bioremediation',
  'Carbon Capture & Bio-fixation': 'Carbon Capture & Bio-fixation',
  'Pharmaceuticals & Bioactive Compounds': 'Pharmaceuticals & Bioactive Compounds',
  'Food & Functional Nutrition': 'Food & Functional Nutrition',
  'Agriculture & Biofertilizers': 'Agriculture & Biofertilizers',
  'Aquaculture & Animal Feed': 'Aquaculture & Animal Feed',
  'Cosmetics & Personal Care': 'Cosmetics & Personal Care',
  'Bioplastics & Biomaterials': 'Bioplastics & Biomaterials',
  'Algal Cultivation & Bioprocess': 'Algal Cultivation & Bioprocess',
  'Ecology, Taxonomy & Blooms': 'Ecology, Taxonomy & Blooms',
  'Applied Phycology & Biotechnology': 'Applied Phycology & Biotechnology',

  // Legacy mappings
  Biofuel: 'Biofuels & Bioenergy',
  Bioremediation: 'Wastewater Treatment & Bioremediation',
  'Wastewater Treatment': 'Wastewater Treatment & Bioremediation',
  'Wastewater Bioremediation': 'Wastewater Treatment & Bioremediation',
  'Heavy Metals Biosorption': 'Wastewater Treatment & Bioremediation',
  'Carbon Capture': 'Carbon Capture & Bio-fixation',
  'Carbon Bio-fixation': 'Carbon Capture & Bio-fixation',
  'Microalgae Cultivation': 'Algal Cultivation & Bioprocess',
  'Applied Phycology': 'Applied Phycology & Biotechnology',
  'High-Value Products & Materials': 'Bioplastics & Biomaterials',
  Microalgae: 'Algal Cultivation & Bioprocess',
  Macroalgae: 'Ecology, Taxonomy & Blooms',
  environment: 'Ecology, Taxonomy & Blooms',
  agriculture: 'Agriculture & Biofertilizers',
  medicine: 'Pharmaceuticals & Bioactive Compounds',
  nutrition: 'Food & Functional Nutrition',
  cosmetics: 'Cosmetics & Personal Care',
  aquaculture: 'Aquaculture & Animal Feed',
  industry: 'Applied Phycology & Biotechnology',

  // Arabic mappings
  'الوقود الحيوي': 'Biofuels & Bioenergy',
  'الوقود والطاقة الحيوية': 'Biofuels & Bioenergy',
  'المعالجة الحيوية': 'Wastewater Treatment & Bioremediation',
  'معالجة مياه الصرف': 'Wastewater Treatment & Bioremediation',
  'معالجة مياه الصرف والمعالجة الحيوية': 'Wastewater Treatment & Bioremediation',
  'احتجاز الكربون': 'Carbon Capture & Bio-fixation',
  'احتجاز وتثبيت الكربون': 'Carbon Capture & Bio-fixation',
  'التثبيت الحيوي للكربون': 'Carbon Capture & Bio-fixation',
  'المركبات الصيدلانية والحيوية النشطة': 'Pharmaceuticals & Bioactive Compounds',
  'الأغذية والمكملات الغذائية': 'Food & Functional Nutrition',
  'الزراعة والمخصبات الحيوية': 'Agriculture & Biofertilizers',
  'الاستزراع المائي وأعلاف الحيوانات': 'Aquaculture & Animal Feed',
  'مستحضرات التجميل والعناية الشخصية': 'Cosmetics & Personal Care',
  'البلاستيك الحيوي والمواد المتقدمة': 'Bioplastics & Biomaterials',
  'استزراع الطحالب والعمليات الحيوية': 'Algal Cultivation & Bioprocess',
  'البيئة والتصنيف وازدهار الطحالب': 'Ecology, Taxonomy & Blooms',
  'علم الطحالب التطبيقي والتكنولوجيا الحيوية': 'Applied Phycology & Biotechnology',
  'علم الطحالب التطبيقي': 'Applied Phycology & Biotechnology',
  'الطحالب الدقيقة': 'Algal Cultivation & Bioprocess',
  'الطحالب الكبيرة': 'Ecology, Taxonomy & Blooms',
};

const normalizedCategoryMap = Object.fromEntries(
  Object.entries(categoryMap).map(([value, category]) => [value.toLocaleLowerCase(), category]),
) as Record<string, MasterCategory>;

export function normalizeCategory(value?: string): MasterCategory | null {
  if (!value) return null;
  return normalizedCategoryMap[value.trim().toLocaleLowerCase()] ?? null;
}
