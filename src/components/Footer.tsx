import { useState } from 'react';
import { useI18n } from '../i18n';
import { BookOpen, ExternalLink, ShieldCheck, Youtube, Mail, MessageCircle, Users, Copy, Check } from 'lucide-react';

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@%D8%A7%D9%84%D8%AC%D9%85%D8%B9%D9%8A%D8%A9%D8%A7%D9%84%D9%85%D8%B5%D8%B1%D9%8A%D8%A9%D9%84%D9%84%D8%B7%D8%AD%D8%A7%D9%84%D8%A8';
const FACEBOOK_GROUP_URL = 'https://www.facebook.com/groups/740974712673179/';
const WHATSAPP_NUMBER = '01013420111';
const WHATSAPP_LINK = 'https://wa.me/201013420111';
const EMAIL_MAIN = 'remog81@gmail.com';
const EMAIL_SOCIETY = 'egyalgae1997@gmail.com';

interface FooterProps {
  onOpenContact?: () => void;
}

export function Footer({ onOpenContact }: FooterProps) {
  const { t, language } = useI18n();
  const isRtl = language === 'ar';
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEmail(id);
      setTimeout(() => setCopiedEmail(null), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <footer className="portal-footer" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="footer-content">
        {/* Brand & Society Info */}
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
          <div className="footer-society-badges">
            <span className="footer-soc-badge">🌿 علم الطحالب التطبيقي</span>
            <span className="footer-soc-badge">🔬 المركز القومي للبحوث</span>
          </div>
        </div>

        {/* Academic Resources */}
        <div className="footer-links">
          <h4>{t('footer.academicResources') || 'المصادر والروابط الأكاديمية'}</h4>
          <ul>
            <li>
              <a href="https://egyjs.journals.ekb.eg/" target="_blank" rel="noopener noreferrer">
                <BookOpen size={14} /> {t('footer.journalLink') || 'المجلة المصرية لعلم الطحالب (EKB)'}
              </a>
            </li>
            <li>
              <a href="https://www.ekb.eg/" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} /> {t('footer.ekbLink') || 'بنك المعرفة المصري'}
              </a>
            </li>
            <li>
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="footer-youtube-link">
                <Youtube size={15} color="#ef4444" /> {t('footer.youtubeLink') || 'قناة الجمعية على YouTube'}
              </a>
            </li>
            <li>
              <a href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer" className="footer-fb-link">
                <Users size={14} color="#1877f2" /> {t('footer.facebookLink') || 'مجموعة الجمعية على Facebook'}
              </a>
            </li>
          </ul>
        </div>

        {/* Official Contact Section */}
        <div className="footer-contact-col">
          <div className="footer-contact-title-row">
            <h4>{t('footer.contactTitle') || t('contactUs') || 'اتصل بنا'}</h4>
            {onOpenContact && (
              <button 
                type="button" 
                className="footer-open-contact-btn" 
                onClick={onOpenContact}
                title={t('contactUs') || 'اتصل بنا'}
              >
                <Mail size={13} />
                <span>{t('contactUs') || 'اتصل بنا'}</span>
              </button>
            )}
          </div>
          
          <div className="footer-contact-items">
            {/* WhatsApp */}
            <div className="footer-contact-item">
              <span className="footer-contact-icon whatsapp"><MessageCircle size={15} /></span>
              <div className="footer-contact-text">
                <span className="contact-label">{isRtl ? 'واتساب مباشر:' : 'WhatsApp:'}</span>
                <a 
                  href={WHATSAPP_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="contact-value-link whatsapp-text"
                  dir="ltr"
                >
                  {WHATSAPP_NUMBER}
                </a>
              </div>
            </div>

            {/* Email 1: Dr. Reda Moghazy */}
            <div className="footer-contact-item">
              <span className="footer-contact-icon email"><Mail size={15} /></span>
              <div className="footer-contact-text">
                <span className="contact-label">{isRtl ? 'المشرف الأكاديمي:' : 'Supervisor Email:'}</span>
                <div className="email-copy-row">
                  <a href={`mailto:${EMAIL_MAIN}`} className="contact-value-link" dir="ltr">{EMAIL_MAIN}</a>
                  <button 
                    type="button" 
                    className="footer-copy-btn" 
                    onClick={() => handleCopy('e1', EMAIL_MAIN)}
                    title={isRtl ? 'نسخ البريد' : 'Copy email'}
                  >
                    {copiedEmail === 'e1' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Email 2: Society */}
            <div className="footer-contact-item">
              <span className="footer-contact-icon email-soc"><Mail size={15} /></span>
              <div className="footer-contact-text">
                <span className="contact-label">{isRtl ? 'البريد الرسمي للجمعية:' : 'Society Email:'}</span>
                <div className="email-copy-row">
                  <a href={`mailto:${EMAIL_SOCIETY}`} className="contact-value-link" dir="ltr">{EMAIL_SOCIETY}</a>
                  <button 
                    type="button" 
                    className="footer-copy-btn" 
                    onClick={() => handleCopy('e2', EMAIL_SOCIETY)}
                    title={isRtl ? 'نسخ البريد' : 'Copy email'}
                  >
                    {copiedEmail === 'e2' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Facebook Group */}
            <div className="footer-contact-item">
              <span className="footer-contact-icon fb"><Users size={15} /></span>
              <div className="footer-contact-text">
                <span className="contact-label">{isRtl ? 'المجتمع العلمي:' : 'Community:'}</span>
                <a 
                  href={FACEBOOK_GROUP_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="contact-value-link fb-text"
                >
                  {isRtl ? 'مجموعة فيسبوك الرسمية' : 'Official Facebook Group'} <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t('footer.copyright') || '© 2026 الجمعية المصرية للطحالب - جميع الحقوق محفوظة.'}</p>
        <span className="footer-badge">
          <ShieldCheck size={14} /> {t('footer.officialBadge') || 'بوابة أكاديمية موثقة'}
        </span>
      </div>
    </footer>
  );
}

