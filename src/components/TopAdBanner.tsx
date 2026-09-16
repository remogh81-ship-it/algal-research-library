import { useEffect, useState } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { topBanners } from '../data/topBanners';
import { useI18n } from '../i18n';

export function TopAdBanner() {
  const { language } = useI18n();
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (topBanners.length < 2) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % topBanners.length), 7000);
    return () => window.clearInterval(timer);
  }, []);
  const banner = topBanners[active];
  const arabic = language === 'ar';
  return (
    <aside className="top-ad-banner" aria-label="Featured journal">
      <a href={banner.href} target="_blank" rel="noopener noreferrer">
        <span className="top-ad-badge"><ExternalLink size={13} /> {banner.badge}</span>
        <div className="top-ad-copy">
          <strong>{arabic ? banner.titleAr : banner.titleEn}</strong>
          <span>{arabic ? banner.subtitleAr : banner.subtitleEn}</span>
        </div>
        <span className="top-ad-cta">{banner.cta} <ArrowUpRight size={16} /></span>
      </a>
    </aside>
  );
}
