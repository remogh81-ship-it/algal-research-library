import React from 'react';
import { useI18n } from '../i18n';
import { Resource } from '../types/resource';

interface PaperComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPapers: Resource[];
  onRemovePaper: (paperId: number) => void;
  onClearAll: () => void;
  onOpenQuickView?: (paper: Resource) => void;
}

export const PaperComparisonModal: React.FC<PaperComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedPapers,
  onRemovePaper,
  onClearAll,
  onOpenQuickView
}) => {
  const { language } = useI18n();
  const currentLang = language === 'ar' ? 'ar' : 'en';

  if (!isOpen) return null;

  return (
    <div className="phase2-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="phase2-modal-dialog comparison-dialog" onClick={e => e.stopPropagation()} dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Header */}
        <div className="p2-modal-header comparison-header">
          <div className="p2-header-title-box">
            <span className="p2-header-icon">⚖️</span>
            <div>
              <h2>
                {currentLang === 'ar' ? 'أداة المقارنة التحليلية بين الأبحاث' : 'Research Paper Comparison Matrix'}
                <span className="p2-badge-count">{selectedPapers.length} {currentLang === 'ar' ? 'أبحاث' : 'Papers'}</span>
              </h2>
              <p>{currentLang === 'ar' ? 'مقارنة مباشرة جنباً إلى جنب للمنهجيات والسلالات والنتائج' : 'Side-by-side comparison of methodologies, strains, findings, citations'}</p>
            </div>
          </div>
          <div className="p2-header-actions">
            {selectedPapers.length > 0 && (
              <button className="clear-comparison-btn" onClick={onClearAll}>
                {currentLang === 'ar' ? 'تفريغ المقارنة' : 'Clear All'}
              </button>
            )}
            <button type="button" className="p2-close-btn" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="p2-modal-body">
          {selectedPapers.length === 0 ? (
            <div className="p2-empty-state">
              <span className="p2-empty-icon">📑</span>
              <h3>{currentLang === 'ar' ? 'لم تقم بتحديد أبحاث للمقارنة بعد' : 'No papers selected for comparison'}</h3>
              <p>{currentLang === 'ar' ? 'اضغط على زر (⚖️ مقارنة) على بطاقة أي بحث في المكتبة لإضافته هنا (حتى 4 أبحاث).' : 'Click the (⚖️ Compare) button on paper cards to compare up to 4 papers.'}</p>
              <button className="browse-library-btn" onClick={onClose}>
                {currentLang === 'ar' ? 'استعراض أبحاث المكتبة' : 'Browse Research Library'}
              </button>
            </div>
          ) : (
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th className="dim-col">{currentLang === 'ar' ? 'عنصر المقارنة' : 'Dimension'}</th>
                    {selectedPapers.map(p => (
                      <th key={p.id} className="paper-col">
                        <div className="paper-col-header">
                          <strong className="paper-col-title">{p.title}</strong>
                          <button className="remove-paper-btn" onClick={() => onRemovePaper(p.id)} title="Remove">✕</button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="dim-label">{currentLang === 'ar' ? 'سنة النشر والمجلة' : 'Year & Journal'}</td>
                    {selectedPapers.map(p => (
                      <td key={p.id}>
                        <span className="p-year-badge">📅 {p.year}</span>
                        {p.journal && <span className="p-journal-text">{p.journal}</span>}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="dim-label">{currentLang === 'ar' ? 'المؤلفون' : 'Authors'}</td>
                    {selectedPapers.map(p => (
                      <td key={p.id} className="p-authors">{p.authors}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="dim-label">{currentLang === 'ar' ? 'التصنيف العلمي' : 'Category'}</td>
                    {selectedPapers.map(p => (
                      <td key={p.id}>
                        <span className="p-cat-badge">{currentLang === 'ar' ? (p.categoryArabic || p.category) : p.category}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="dim-label">{currentLang === 'ar' ? 'نوع الطحلب / الكائن' : 'Algae Type'}</td>
                    {selectedPapers.map(p => (
                      <td key={p.id} className="p-algae">{p.algaeType || (currentLang === 'ar' ? 'طحالب مجهرية عامة' : 'General Microalgae')}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="dim-label">{currentLang === 'ar' ? 'الملخص العلمي' : 'Summary'}</td>
                    {selectedPapers.map(p => (
                      <td key={p.id} className="p-summary">
                        <p>{currentLang === 'ar' ? (p.summary_ar || p.summary_en) : (p.summary_en || p.summary_ar)}</p>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="dim-label">{currentLang === 'ar' ? 'الإجراءات والوصول' : 'Actions'}</td>
                    {selectedPapers.map(p => (
                      <td key={p.id} className="p-actions">
                        {onOpenQuickView && (
                          <button className="comp-quickview-btn" onClick={() => onOpenQuickView(p)}>
                            👁️ {currentLang === 'ar' ? 'معاينة واستشهاد' : 'QuickView & Cite'}
                          </button>
                        )}
                        {p.doi && (
                          <a className="comp-doi-link" href={p.doi.startsWith('http') ? p.doi : 'https://doi.org/' + p.doi} target="_blank" rel="noreferrer">
                            🔗 DOI
                          </a>
                        )}
                        {p.pdfUrl && (
                          <a className="comp-pdf-link" href={p.pdfUrl} target="_blank" rel="noreferrer">
                            📄 PDF
                          </a>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p2-modal-footer">
          <span>{currentLang === 'ar' ? 'مكتبة أبحاث الطحالب - أداة المقارنة الأكاديمية' : 'Algal Research Library - Comparison Suite'}</span>
          <button className="p2-footer-close-btn" onClick={onClose}>{currentLang === 'ar' ? 'إغلاق' : 'Close'}</button>
        </div>

      </div>
    </div>
  );
};
