import type { Resource } from '../types/resource';

export function getLocalizedSummary(resource: Resource, currentLang: string): string {
  const title = resource.title || 'Untitled research';
  const journal = resource.journal || 'an academic journal';
  const category = resource.category || 'algae research';
  const algaeType = resource.algaeType || 'algae';
  if (currentLang === 'ar') return resource.summary_ar;
  if (currentLang === 'en' && resource.summary_en) return resource.summary_en;
  if (currentLang === 'fr' && resource.summary_fr) return resource.summary_fr;
  if (currentLang === 'de' && resource.summary_de) return resource.summary_de;
  if (currentLang === 'zh' && resource.summary_zh) return resource.summary_zh;
  if (currentLang === 'fr') return `Article de recherche intitulé « ${title} », publié dans ${journal} (${resource.year}), portant sur les applications de ${category} et des ${algaeType}.`;
  if (currentLang === 'de') return `Forschungsarbeit mit dem Titel „${title}“, veröffentlicht in ${journal} (${resource.year}), zu Anwendungen von ${category} und ${algaeType}.`;
  if (currentLang === 'zh') return `研究论文《${title}》发表于${journal}（${resource.year}），重点关注${category}和${algaeType}应用。`;
  return `Research paper titled '${title}' published in ${journal} (${resource.year}) focusing on ${category} and ${algaeType} applications.`;
}
