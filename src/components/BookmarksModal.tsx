import React from 'react';
import { X, Bookmark, Download, Trash2, ExternalLink, FileText, Eye, BookOpen } from 'lucide-react';
import type { Resource } from '../types/resource';
import { useI18n } from '../i18n';
import { downloadRIS } from '../hooks/useResources';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedIds: number[];
  resources: Resource[];
  onToggleBookmark: (id: number) => void;
  onClearAll: () => void;
  onQuickView: (resource: Resource) => void;
}

export function BookmarksModal({
  isOpen,
  onClose,
  bookmarkedIds,
  resources,
  onToggleBookmark,
  onClearAll,
  onQuickView,
}: BookmarksModalProps) {
  const { t, category, language } = useI18n();

  if (!isOpen) return null;

  const bookmarkedPapers = resources.filter((res) => bookmarkedIds.includes(res.id));

  const handleExportAll = () => {
    if (bookmarkedPapers.length === 0) return;
    downloadRIS(bookmarkedPapers, 'my-algae-reading-list.ris');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="bookmarks-modal" 
        onClick={(e) => e.stopPropagation()}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="bookmarks-header-title">
            <Bookmark size={22} className="bookmarks-title-icon" />
            <h2>{t('readingList')}</h2>
            <span className="bookmarks-count-pill">{bookmarkedPapers.length}</span>
          </div>
          <button type="button" className="close-button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Action Bar */}
        {bookmarkedPapers.length > 0 && (
          <div className="bookmarks-toolbar">
            <button 
              type="button" 
              className="bookmarks-tool-btn export-btn" 
              onClick={handleExportAll}
            >
              <Download size={15} />
              {t('exportAllRIS')} ({bookmarkedPapers.length})
            </button>
            <button 
              type="button" 
              className="bookmarks-tool-btn clear-btn" 
              onClick={() => {
                if (window.confirm(language === 'ar' ? 'هل تريد مسح جميع الأبحاث المحفوظة؟' : 'Clear all saved papers?')) {
                  onClearAll();
                }
              }}
            >
              <Trash2 size={15} />
              {t('clearAllBookmarks')}
            </button>
          </div>
        )}

        {/* Papers List */}
        <div className="bookmarks-list">
          {bookmarkedPapers.length === 0 ? (
            <div className="bookmarks-empty-state">
              <Bookmark size={48} className="empty-bookmark-icon" />
              <h3>{t('emptyBookmarks')}</h3>
              <p>{t('emptyBookmarksDesc')}</p>
            </div>
          ) : (
            bookmarkedPapers.map((paper) => (
              <div key={paper.id} className="bookmark-item-card">
                <div className="bookmark-item-main">
                  <div className="bookmark-item-tags">
                    <span className="bookmark-cat-tag">{category(paper.category)}</span>
                    {paper.algaeType && <span className="bookmark-algae-tag">{paper.algaeType}</span>}
                    <span className="bookmark-year-tag">{paper.year || 'n.d.'}</span>
                  </div>
                  <h4 
                    className="bookmark-item-title"
                    onClick={() => {
                      onQuickView(paper);
                      onClose();
                    }}
                  >
                    {paper.title || paper.titleArabic}
                  </h4>
                  {paper.titleArabic && paper.title !== paper.titleArabic && (
                    <p className="bookmark-item-title-ar" lang="ar" dir="rtl">
                      {paper.titleArabic}
                    </p>
                  )}
                  <p className="bookmark-item-authors">
                    {paper.authors} · {paper.journal}
                  </p>
                </div>

                <div className="bookmark-item-actions">
                  <button
                    type="button"
                    className="bookmark-item-btn preview-btn"
                    title={t('quickView')}
                    onClick={() => {
                      onQuickView(paper);
                      onClose();
                    }}
                  >
                    <Eye size={15} />
                    <span>{t('quickView')}</span>
                  </button>

                  {paper.doi && (
                    <a
                      href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bookmark-item-btn link-btn"
                      title={t('doi')}
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}

                  {paper.pdfUrl && (
                    <a
                      href={paper.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bookmark-item-btn link-btn"
                      title={t('pdf')}
                    >
                      <FileText size={15} />
                    </a>
                  )}

                  <button
                    type="button"
                    className="bookmark-item-btn remove-btn"
                    title={t('removeBookmark')}
                    onClick={() => onToggleBookmark(paper.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
