import { useI18n } from '../i18n';
import { ArrowUpRight, Award, BookOpen, CheckCircle, ExternalLink, FileText, Send, Sparkles } from 'lucide-react';

export function JournalPromotionSection() {
  const { t, language } = useI18n();
  const isRtl = language === 'ar';

  const journalUrl = 'https://egyjs.journals.ekb.eg/';

  return (
    <section className="journal-promotion-section" aria-label="Journal Promotion" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="journal-promo-card">
        {/* Decorative background aura */}
        <div className="journal-promo-badge-row">
          <span className="society-patronage-pill">
            <img src="/eps-logo.png" alt="EPS Logo" className="pill-society-logo" />
            <span>{t('journalPromotion.societyPatronage')}</span>
          </span>
          <span className="ekb-badge">
            <Award size={14} /> {t('journalPromotion.badge')}
          </span>
        </div>

        <div className="journal-promo-grid">
          <div className="journal-info-col">
            <h2 className="journal-promo-title">
              {t('journalPromotion.title')}
            </h2>
            <p className="journal-promo-subtitle">
              {t('journalPromotion.subtitle')}
            </p>
            <p className="journal-promo-description">
              {t('journalPromotion.description')}
            </p>

            <div className="journal-highlights-list">
              <div className="highlight-item">
                <CheckCircle size={16} className="highlight-icon" />
                <span>{t('journalPromotion.highlightOpenAccess')}</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={16} className="highlight-icon" />
                <span>{t('journalPromotion.highlightPeerReview')}</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={16} className="highlight-icon" />
                <span>{t('journalPromotion.highlightIndexing')}</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={16} className="highlight-icon" />
                <span>{t('journalPromotion.issn')}</span>
              </div>
            </div>

            <div className="journal-actions-row">
              <a
                href={journalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="journal-cta-primary"
              >
                <Send size={16} />
                <span>{t('journalPromotion.ctaSubmit')}</span>
                <ArrowUpRight size={16} />
              </a>

              <a
                href={journalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="journal-cta-secondary"
              >
                <BookOpen size={16} />
                <span>{t('journalPromotion.ctaBrowse')}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="journal-visual-col">
            <div className="journal-cover-mockup">
              <div className="cover-header">
                <img src="/eps-logo.png" alt="Egyptian Phycological Society" className="cover-logo" />
                <span className="cover-society-name">{t('society_title')}</span>
              </div>
              <div className="cover-body">
                <h3>THE EGYPTIAN JOURNAL OF PHYCOLOGY</h3>
                <p className="cover-arabic-title">المجلة المصرية للطحالب</p>
                <div className="cover-divider"></div>
                <p className="cover-topics">
                  {t('journalPromotion.coverTopics')}
                </p>
              </div>
              <div className="cover-footer">
                <span>Egyptian Knowledge Bank (EKB)</span>
                <span>ISSN 1110-8649</span>
              </div>
            </div>

            <div className="academic-credit-box">
              <Sparkles size={16} className="credit-sparkle" />
              <div>
                <strong>{t('prepared_by')}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
