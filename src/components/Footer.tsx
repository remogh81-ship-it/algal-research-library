import { useI18n } from '../i18n';
import { BookOpen, ExternalLink, ShieldCheck, Youtube } from 'lucide-react';

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@%D8%A7%D9%84%D8%AC%D9%85%D8%B9%D9%8A%D8%A9%D8%A7%D9%84%D9%85%D8%B5%D8%B1%D9%8A%D8%A9%D9%84%D9%84%D8%B7%D8%AD%D8%A7%D9%84%D8%A8';

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
            <li>
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="footer-youtube-link">
                <Youtube size={15} color="#ef4444" /> {t('footer.youtubeLink')}
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
