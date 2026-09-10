import { useI18n } from '../i18n';

export function Footer() {
  const { t } = useI18n();
  return <footer><strong>Integrated Algae Research Library</strong><p>{t('footer.copyright')}</p></footer>;
}
