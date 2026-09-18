import { useState } from 'react';
import { 
  X, 
  Mail, 
  MessageCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Send, 
  Users, 
  Youtube, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useI18n } from '../i18n';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WHATSAPP_NUMBER = '01013420111';
const WHATSAPP_INTL = '+201013420111';
const EMAIL_MAIN = 'remog81@gmail.com';
const EMAIL_SOCIETY = 'egyalgae1997@gmail.com';
const FACEBOOK_GROUP_URL = 'https://www.facebook.com/groups/740974712673179/';
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@%D8%A7%D9%84%D8%AC%D9%85%D8%B9%D9%8A%D8%A9%D8%A7%D9%84%D9%85%D8%B5%D8%B1%D9%8A%D8%A9%D9%84%D9%84%D8%B7%D8%AD%D8%A7%D9%84%D8%A8';

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { language, t } = useI18n();
  const isArabic = language === 'ar';

  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [inquiryName, setInquiryName] = useState('');
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  if (!isOpen) return null;

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(null), 2500);
    } catch {
      // fallback
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(inquirySubject || (isArabic ? 'استفسار أكاديمي - مكتبة أبحاث الطحالب' : 'Inquiry - Algal Research Library'));
    const body = encodeURIComponent(
      `${isArabic ? 'الاسم' : 'Name'}: ${inquiryName || '-'}\n\n${inquiryMessage}`
    );
    window.open(`mailto:${EMAIL_MAIN}?cc=${EMAIL_SOCIETY}&subject=${subject}&body=${body}`, '_blank');
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      inquiryMessage 
        ? `${isArabic ? 'مرحباً، أنا' : 'Hello, I am'} ${inquiryName || ''}.\n${inquiryMessage}`
        : (isArabic 
            ? 'السلام عليكم، أود التواصل بخصوص أبحاث ومكتبة الجمعية المصرية للطحالب.' 
            : 'Hello, I would like to inquire about the Egyptian Phycological Society library and research.')
    );
    window.open(`https://wa.me/201013420111?text=${text}`, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal contact-modal-card" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close" 
          onClick={onClose} 
          aria-label={isArabic ? 'إغلاق النافذة' : 'Close'}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="contact-modal-header">
          <div className="contact-header-badge">
            <Sparkles size={16} />
            <span>{isArabic ? 'قنوات التواصل الرسمية' : 'Official Channels'}</span>
          </div>
          <h2 className="contact-modal-title">
            {isArabic ? 'اتصل بنا - الجمعية المصرية للطحالب' : `${t('contactUs') || 'Contact Us'} - Egyptian Phycological Society`}
          </h2>
          <p className="contact-modal-subtitle">
            {isArabic 
              ? 'يسعدنا استقبال استفسارات الباحثين والمؤسسات العلمية، وطلبات النشر والتعاون الأكاديمي عبر الوسائل التالية:'
              : 'We welcome inquiries from researchers and institutions regarding publications, collaborations, and scientific queries:'}
          </p>
        </div>

        {/* Channels Grid */}
        <div className="contact-channels-grid">
          {/* WhatsApp Card */}
          <div className="contact-channel-card whatsapp-channel">
            <div className="channel-icon-col whatsapp-bg">
              <MessageCircle size={28} />
            </div>
            <div className="channel-info-col">
              <div className="channel-badge-row">
                <span className="channel-type-badge whatsapp-badge">
                  {isArabic ? 'واتساب مباشر' : 'WhatsApp'}
                </span>
                <span className="channel-status-dot">
                  <span className="dot-pulse"></span>
                  {isArabic ? 'متاح للمراسلة الفورية' : 'Active'}
                </span>
              </div>
              <h3 className="channel-primary-val" dir="ltr">{WHATSAPP_NUMBER}</h3>
              <p className="channel-desc">
                {isArabic 
                  ? 'للتواصل السريع والاستفسارات المباشرة مع إدارة الجمعية والمكتبة' 
                  : 'Direct line for prompt research inquiries and consultations'}
              </p>
              <div className="channel-actions-row">
                <button 
                  type="button" 
                  className="channel-action-btn whatsapp-btn"
                  onClick={handleSendWhatsApp}
                >
                  <MessageCircle size={15} />
                  <span>{isArabic ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}</span>
                </button>
                <button 
                  type="button" 
                  className="channel-action-btn copy-btn"
                  onClick={() => handleCopy('wa', WHATSAPP_INTL)}
                >
                  {copiedItem === 'wa' ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                  <span>{copiedItem === 'wa' ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ الرقم' : 'Copy')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Facebook Group Card */}
          <div className="contact-channel-card facebook-channel">
            <div className="channel-icon-col facebook-bg">
              <Users size={28} />
            </div>
            <div className="channel-info-col">
              <div className="channel-badge-row">
                <span className="channel-type-badge facebook-badge">
                  {isArabic ? 'المجموعة العلمية' : 'Facebook Community'}
                </span>
              </div>
              <h3 className="channel-primary-val">
                {isArabic ? 'مجموعة الجمعية على فيسبوك' : 'EPS Facebook Group'}
              </h3>
              <p className="channel-desc">
                {isArabic 
                  ? 'مجتمع علمي تفاعلي يضم نخبة من أساتذة وباحثي علوم الطحالب والبيوتكنولوجي' 
                  : 'Official community connecting phycology scientists, faculty, and students'}
              </p>
              <div className="channel-actions-row">
                <a 
                  href={FACEBOOK_GROUP_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="channel-action-btn facebook-btn"
                >
                  <Users size={15} />
                  <span>{isArabic ? 'انضم للمجموعة على فيسبوك' : 'Join Facebook Group'}</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>

          {/* Email 1: Dr. Reda Moghazy */}
          <div className="contact-channel-card email-channel">
            <div className="channel-icon-col email-bg">
              <Mail size={26} />
            </div>
            <div className="channel-info-col">
              <div className="channel-badge-row">
                <span className="channel-type-badge email-badge">
                  {isArabic ? 'بريد المشرف العام' : 'Chief Academic Email'}
                </span>
              </div>
              <h3 className="channel-primary-val" dir="ltr">{EMAIL_MAIN}</h3>
              <p className="channel-desc">
                {isArabic 
                  ? 'أ.د. رضا محمد مغازي - المشرف العام وأستاذ الطحالب بالمركز القومي للبحوث' 
                  : 'Prof. Dr. Reda Mohamed Moghazy, Lead Supervisor & Phycologist, NRC'}
              </p>
              <div className="channel-actions-row">
                <a 
                  href={`mailto:${EMAIL_MAIN}?subject=${encodeURIComponent(isArabic ? 'مكتبة أبحاث الطحالب - استفسار أكاديمي' : 'Algal Library Inquiry')}`} 
                  className="channel-action-btn email-btn"
                >
                  <Mail size={14} />
                  <span>{isArabic ? 'إرسال بريد' : 'Send Email'}</span>
                </a>
                <button 
                  type="button" 
                  className="channel-action-btn copy-btn"
                  onClick={() => handleCopy('email-main', EMAIL_MAIN)}
                >
                  {copiedItem === 'email-main' ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                  <span>{copiedItem === 'email-main' ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ البريد' : 'Copy')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Email 2: Egyptian Phycological Society */}
          <div className="contact-channel-card email-channel">
            <div className="channel-icon-col email-society-bg">
              <Mail size={26} />
            </div>
            <div className="channel-info-col">
              <div className="channel-badge-row">
                <span className="channel-type-badge email-badge">
                  {isArabic ? 'بريد الجمعية الرسمي' : 'Society Official Email'}
                </span>
              </div>
              <h3 className="channel-primary-val" dir="ltr">{EMAIL_SOCIETY}</h3>
              <p className="channel-desc">
                {isArabic 
                  ? 'البريد الرسمي المعتمد للجمعية المصرية للطحالب والمجلة العلمية' 
                  : 'Official secretariat email for Egyptian Phycological Society'}
              </p>
              <div className="channel-actions-row">
                <a 
                  href={`mailto:${EMAIL_SOCIETY}?subject=${encodeURIComponent(isArabic ? 'الجمعية المصرية للطحالب - تواصل رسمي' : 'Egyptian Phycological Society - Inquiry')}`} 
                  className="channel-action-btn email-btn"
                >
                  <Mail size={14} />
                  <span>{isArabic ? 'إرسال بريد' : 'Send Email'}</span>
                </a>
                <button 
                  type="button" 
                  className="channel-action-btn copy-btn"
                  onClick={() => handleCopy('email-soc', EMAIL_SOCIETY)}
                >
                  {copiedItem === 'email-soc' ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                  <span>{copiedItem === 'email-soc' ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ البريد' : 'Copy')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Inquiry Form Drawer */}
        <form onSubmit={handleSendEmail} className="contact-quick-form">
          <div className="quick-form-header">
            <h4 className="quick-form-title">
              <Send size={16} />
              <span>{isArabic ? 'إرسال رسالة أو استفسار سريع' : 'Send a Quick Message'}</span>
            </h4>
            <span className="quick-form-note">
              {isArabic ? 'سيتم توجيه الرسالة مباشرة إلى البريد الإلكتروني والواتساب' : 'Sends directly to our inbox or WhatsApp'}
            </span>
          </div>

          <div className="quick-form-fields">
            <div className="form-two-cols">
              <input 
                type="text" 
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                placeholder={isArabic ? 'اسم الباحث / المؤسسة...' : 'Your Name / Institution...'} 
              />
              <input 
                type="text" 
                value={inquirySubject}
                onChange={(e) => setInquirySubject(e.target.value)}
                placeholder={isArabic ? 'موضوع الاستفسار (نشر بحث، استشارة، فهرسة...)' : 'Subject (Paper submission, consultation...)'} 
              />
            </div>
            <textarea 
              rows={3} 
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              placeholder={isArabic ? 'اكتب تفاصيل رسالتك أو استفسارك هنا...' : 'Write your message or inquiry details here...'}
              required
            />
          </div>

          <div className="quick-form-buttons">
            <button type="submit" className="quick-send-email-btn">
              <Mail size={15} />
              <span>{isArabic ? 'إرسال عبر البريد الإلكتروني' : 'Send via Email'}</span>
            </button>
            <button 
              type="button" 
              className="quick-send-wa-btn"
              onClick={handleSendWhatsApp}
            >
              <MessageCircle size={15} />
              <span>{isArabic ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}</span>
            </button>
          </div>
        </form>

        {/* Additional Media Links */}
        <div className="contact-modal-footer-media">
          <span className="footer-media-label">
            {isArabic ? 'روابط وقنوات إضافية:' : 'Additional Links:'}
          </span>
          <div className="footer-media-chips">
            <a 
              href={YOUTUBE_CHANNEL_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="media-chip youtube-chip"
            >
              <Youtube size={14} />
              <span>{isArabic ? 'قناة اليوتيوب الرسمية' : 'Official YouTube Channel'}</span>
              <ExternalLink size={11} />
            </a>
            <a 
              href="https://egyjs.journals.ekb.eg/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="media-chip journal-chip"
            >
              <ExternalLink size={14} />
              <span>{isArabic ? 'المجلة المصرية لعلم الطحالب' : 'Egyptian Journal of Phycology'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
