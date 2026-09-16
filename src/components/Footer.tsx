import { useI18n } from '../i18n';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

export function Footer() {
  const { t, language } = useI18n();
  const isRtl = language === 'ar';

  return (
    <footer className="portal-footer" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo-row">
            <img src="/eps-logo.png" alt="Egyptian Phycological Society" className="footer-society-logo" />
            <div>
              <strong className="footer-title">{t('main_title')}</strong>
              <span className="footer-society">{t('society_title')}</span>
            </div>
          </div>
          <p className="footer-attribution">
            {t('prepared_by')}
          </p>
        </div>

        <div className="footer-links">
          <h4>{t('footer.academicResources')}</h4>
          <ul>
            <li>
              <a href="https://egyjs.journals.ekb.eg/" target="_blank" rel="noopener noreferrer">
                <BookOpen size={14} /> {t('footer.journalLink')}
              </a>
            </li>
            <li>
              <a href="https://www.ekb.eg/" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} /> {t('footer.ekbLink')}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t('footer.copyright')}</p>
        <span className="footer-badge">
          <ShieldCheck size={14} /> {t('footer.officialBadge')}
        </span>
      </div>
    </footer>
  );
}
