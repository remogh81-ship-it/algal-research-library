import { useState } from 'react';
import { BookOpen, FilePlus2, GraduationCap, LogIn, Mail, Moon, Plus, Sun, UserRound, Youtube } from 'lucide-react';
import { useI18n } from '../i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@%D8%A7%D9%84%D8%AC%D9%85%D8%B9%D9%8A%D8%A9%D8%A7%D9%84%D9%85%D8%B5%D8%B1%D9%8A%D8%A9%D9%84%D9%84%D8%B7%D8%AD%D8%A7%D9%84%D8%A8';

type HeaderProps = {
  dark: boolean;
  onToggleDark: () => void;
  user: { name: string } | null;
  mineOnly: boolean;
  onToggleMine: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onAddResearch: () => void;
  onLibrary: () => void;
  onOpenProfile?: () => void;
  onOpenContact?: () => void;
};

export function Header({ dark, onToggleDark, user, mineOnly, onToggleMine, onLogin, onLogout, onAddResearch, onLibrary, onOpenProfile, onOpenContact }: HeaderProps) {
  const { t } = useI18n();
  const [logoFailed, setLogoFailed] = useState(false);
  const handleLogoError = () => {
    console.warn('Developer: Upload the society logo to public/eps-logo.png');
    setLogoFailed(true);
  };
  return <header className="topbar">
    <div className="brand">
      {/* Developer: Upload the society logo to public/eps-logo.png */}
      {logoFailed ? <span className="society-logo society-logo-fallback" role="img" aria-label="Egyptian Phycological Society">EPS</span> : <img className="society-logo" src="/eps-logo.png" alt="Egyptian Phycological Society" onError={handleLogoError} />}
      <span className="brand-mark"><BookOpen size={23} /></span>
      <div className="brand-copy">
        <div className="brand-title-row">
          <strong>{t('main_title')}</strong>
          <span className="society-patronage-badge">{t('society_title')}</span>
        </div>
        <span className="prepared-by">{t('prepared_by')}</span>
      </div>
    </div>
    <nav className="nav-actions">
      <a 
        href={YOUTUBE_CHANNEL_URL} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="icon-button youtube-header-btn" 
        title={t('youtubeChannel')} 
        aria-label={t('youtubeChannel')}
      >
        <Youtube size={19} />
      </a>
      {onOpenContact && (
        <button 
          className="header-contact-btn" 
          onClick={onOpenContact} 
          title={t('contactUs') || 'اتصل بنا'} 
          aria-label={t('contactUs') || 'اتصل بنا'}
        >
          <Mail size={16} />
          <span className="header-contact-text">{t('contactUs') || 'اتصل بنا'}</span>
        </button>
      )}
      <button className="icon-button" onClick={onToggleDark} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
      <LanguageSwitcher />
      {user ? <div className="account-menu">
        <button className="account-trigger" onClick={onOpenProfile} title={t('academicProfile') || 'الملف الأكاديمي'}><UserRound size={17} /><span>{user.name}</span></button>
        <button className="menu-action academic-profile-action" onClick={onOpenProfile}><GraduationCap size={15} /> {t('academicProfile') || 'الملف الأكاديمي'}</button>
        <button className="menu-action" onClick={onAddResearch}><Plus size={15} /> {t('submit')}</button>
        <button className="menu-action" onClick={onToggleMine}>{t('mySubmissions')}</button>
        <button className="menu-action" onClick={onLogout}><LogIn size={15} /> {t('logout')}</button>
      </div> : <button className="account-trigger" onClick={onLogin}><LogIn size={17} /> {t('login')}</button>}
      <button className="primary-action" onClick={onAddResearch}><FilePlus2 size={17} /> {t('submit')}</button>
    </nav>
  </header>;
}
