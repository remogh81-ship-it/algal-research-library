import { useState } from 'react';
import { BookOpen, FilePlus2, LogIn, Moon, Plus, Sun, UserRound } from 'lucide-react';
import { useI18n } from '../i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

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
};

export function Header({ dark, onToggleDark, user, mineOnly, onToggleMine, onLogin, onLogout, onAddResearch, onLibrary }: HeaderProps) {
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
      <button className="icon-button" onClick={onToggleDark} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
      <LanguageSwitcher />
      {user ? <div className="account-menu">
        <button className="account-trigger" onClick={onToggleMine}><UserRound size={17} /><span>{user.name}</span></button>
        <button className="menu-action" onClick={onAddResearch}><Plus size={15} /> {t('submit')}</button>
        <button className="menu-action" onClick={onToggleMine}>{t('mySubmissions')}</button>
        <button className="menu-action" onClick={onLogout}><LogIn size={15} /> {t('logout')}</button>
      </div> : <button className="account-trigger" onClick={onLogin}><LogIn size={17} /> {t('login')}</button>}
      <button className="primary-action" onClick={onAddResearch}><FilePlus2 size={17} /> {t('submit')}</button>
    </nav>
  </header>;
}
