import React, { useEffect, useState } from 'react';
import { 
  X, Bookmark, ExternalLink, FileText, Copy, Download, 
  BookOpen, Calendar, Users, Award, Check 
} from 'lucide-react';
import type { Resource } from '../types/resource';
import { useI18n } from '../i18n';
import { formatAPA, formatMLA, formatBibTeX, formatRIS, downloadRIS } from '../hooks/useResources';
import { getLocalizedSummary } from '../utils/translateSummary';

interface QuickViewDrawerProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

export function QuickViewDrawer({
  resource,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
}: QuickViewDrawerProps) {
  const { t, category, language } = useI18n();
  const [citationTab, setCitationTab] = useState<'APA' | 'MLA' | 'BibTeX' | 'RIS'>('APA');
  const [copied, setCopied] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !resource) return null;

  const currentCitation = {
    APA: formatAPA(resource),
    MLA: formatMLA(resource),
    BibTeX: formatBibTeX(resource),
    RIS: formatRIS(resource),
  }[citationTab];

  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(currentCitation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const localizedSummary = getLocalizedSummary(resource, language);

  return (
    <div className="quickview-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={t('paperDetails')}>
      <div 
        className="quickview-drawer" 
        onClick={(e) => e.stopPropagation()}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Drawer Header */}
        <div className="quickview-header">
          <div className="quickview-header-badges">
            <span className="quickview-category-badge">{category(resource.category)}</span>
            {resource.algaeType && (
              <span className="quickview-algae-badge">{resource.algaeType}</span>
            )}
            <span className="quickview-year-badge">{resource.year || 'n.d.'}</span>
          </div>
          <button 
            type="button" 
            className="quickview-close-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="quickview-body">
          <h2 className="quickview-title">
            {resource.title || resource.titleArabic}
          </h2>

          {resource.titleArabic && resource.title !== resource.titleArabic && (
            <p className="quickview-title-arabic" lang="ar" dir="rtl">
              {resource.titleArabic}
            </p>
          )}

          {/* Metadata Grid */}
          <div className="quickview-meta-box">
            <div className="quickview-meta-row">
              <Users size={16} className="quickview-meta-icon" />
              <div>
                <span className="quickview-meta-label">{t('authorsLabel')}:</span>
                <span className="quickview-meta-val">{resource.authors || t('unknownAuthors')}</span>
              </div>
            </div>

            <div className="quickview-meta-row">
              <BookOpen size={16} className="quickview-meta-icon" />
              <div>
                <span className="quickview-meta-label">{t('sourceJournal')}:</span>
                <span className="quickview-meta-val">
                  {resource.journal || t('unknownJournal')}
                  {resource.volume && `, Vol. ${resource.volume}`}
                  {resource.issue && `(${resource.issue})`}
                  {resource.pages && `, pp. ${resource.pages}`}
                </span>
              </div>
            </div>

            {resource.year && (
              <div className="quickview-meta-row">
                <Calendar size={16} className="quickview-meta-icon" />
                <div>
                  <span className="quickview-meta-label">{t('publicationYear')}:</span>
                  <span className="quickview-meta-val">{resource.year}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Toolbar */}
          <div className="quickview-actions-bar">
            <button
              type="button"
              className={`quickview-action-btn bookmark-action-btn ${isBookmarked ? 'active' : ''}`}
              onClick={() => onToggleBookmark(resource.id)}
            >
              <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
              <span>{isBookmarked ? t('savedPapers') : t('savePaper')}</span>
            </button>

            {resource.doi && (
              <a
                href={resource.doi.startsWith('http') ? resource.doi : `https://doi.org/${resource.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="quickview-action-btn"
              >
                <ExternalLink size={16} />
                <span>{t('doi')}</span>
              </a>
            )}

            {resource.pdfUrl && (
              <a
                href={resource.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="quickview-action-btn quickview-pdf-btn"
              >
                <FileText size={16} />
                <span>{t('pdf')}</span>
              </a>
            )}
          </div>

          {/* Abstract / Scientific Summary */}
          <div className="quickview-section">
            <h3 className="quickview-section-title">
              <Award size={18} />
              {t('abstract')}
            </h3>
            <div className="quickview-abstract-content">
              <p>{localizedSummary || (language === 'ar' ? 'لا يتوفر ملخص تفصيلي لهذا البحث حالياً.' : 'No detailed abstract available for this paper yet.')}</p>
              
              {/* Show original Arabic if viewing in other languages */}
              {language !== 'ar' && resource.summary_ar && resource.summary_en && (
                <div className="quickview-arabic-abstract" dir="rtl" lang="ar">
                  <strong>Arabic Abstract / الملخص العربي:</strong>
                  <p>{resource.summary_ar}</p>
                </div>
              )}
            </div>
          </div>

          {/* Citations Section */}
          <div className="quickview-section">
            <div className="quickview-citations-header">
              <h3 className="quickview-section-title">
                <BookOpen size={18} />
                {t('citationFormats')}
              </h3>
              <button
                type="button"
                className="quickview-download-ris-btn"
                onClick={() => downloadRIS([resource], `citation-${resource.id}.ris`)}
              >
                <Download size={14} />
                {t('downloadRIS')}
              </button>
            </div>

            {/* Citation Tabs */}
            <div className="quickview-tabs">
              {(['APA', 'MLA', 'BibTeX', 'RIS'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`quickview-tab-btn ${citationTab === tab ? 'active' : ''}`}
                  onClick={() => setCitationTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Citation Box */}
            <div className="quickview-citation-box">
              <pre className="quickview-citation-text">{currentCitation}</pre>
              <button
                type="button"
                className="quickview-copy-btn"
                onClick={handleCopyCitation}
                title="Copy Citation"
              >
                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                <span>{copied ? t('copied') : t('citation')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
