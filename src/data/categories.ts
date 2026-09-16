export const MASTER_CATEGORIES = [
  'Biofuel',
  'Bioremediation',
  'Wastewater Treatment',
  'Microalgae',
  'Macroalgae',
  'Carbon Capture',
  'Applied Phycology',
] as const;

export type MasterCategory = typeof MASTER_CATEGORIES[number];

export const categoryMap: Record<string, MasterCategory> = {
  Biofuel: 'Biofuel',
  Bioremediation: 'Bioremediation',
  'Wastewater Treatment': 'Wastewater Treatment',
  Microalgae: 'Microalgae',
  Macroalgae: 'Macroalgae',
  'Carbon Capture': 'Carbon Capture',
  'Applied Phycology': 'Applied Phycology',
  'Wastewater Bioremediation': 'Bioremediation',
  'Microalgae Cultivation': 'Microalgae',
  'Carbon Bio-fixation': 'Carbon Capture',
  'Heavy Metals Biosorption': 'Bioremediation',
  'الوقود الحيوي': 'Biofuel',
  'المعالجة الحيوية': 'Bioremediation',
  'معالجة مياه الصرف': 'Wastewater Treatment',
  'المعالجة الحيوية لمياه الصرف': 'Bioremediation',
  'الطحالب الدقيقة': 'Microalgae',
  'استزراع الطحالب الدقيقة': 'Microalgae',
  'الطحالب الكبيرة': 'Macroalgae',
  'احتجاز الكربون': 'Carbon Capture',
  'التثبيت الحيوي للكربون': 'Carbon Capture',
  'الامتزاز الحيوي للمعادن الثقيلة': 'Bioremediation',
  'علم الطحالب التطبيقي': 'Applied Phycology',
};

const normalizedCategoryMap = Object.fromEntries(
  Object.entries(categoryMap).map(([value, category]) => [value.toLocaleLowerCase(), category]),
) as Record<string, MasterCategory>;

export function normalizeCategory(value: string): MasterCategory | null {
  return normalizedCategoryMap[value.trim().toLocaleLowerCase()] ?? null;
}
