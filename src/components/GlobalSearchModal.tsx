import React, { useState } from 'react';
import { useI18n } from '../i18n';

export const GlobalSearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { language } = useI18n();
  const lang = language === 'ar' ? 'ar' : 'en';
  const [query, setQuery] = useState('');
  
  if (!isOpen) return null;

  const handleSearch = (engine: string) => {
    if (!query.trim()) return;
    const q = encodeURIComponent(query);
    if (engine === 'scholar') window.open(`https://scholar.google.com/scholar?q=${q}`, '_blank');
    if (engine === 'pubmed') window.open(`https://pubmed.ncbi.nlm.nih.gov/?term=${q}`, '_blank');
    if (engine === 'scopus') window.open(`https://www.scopus.com/results/results.uri?searchterm=${q}`, '_blank');
  };

  return (
    <div className="phase2-modal-overlay" onClick={onClose}>
      <div className="phase2-modal-dialog" onClick={e => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="p2-modal-header" style={{ background: 'linear-gradient(135deg, #fef08a, #fde047)' }}>
          <div className="p2-header-title-box">
            <span className="p2-header-icon">🌍</span>
            <div>
              <h2>{lang === 'ar' ? 'محرك البحث العلمي المفتوح' : 'Public Scientific Search Engine'}</h2>
              <p>{lang === 'ar' ? 'ابحث عن الأبحاث في قواعد البيانات العالمية' : 'Search for papers in global scientific databases'}</p>
            </div>
          </div>
          <button className="p2-close-btn" onClick={onClose}>✖</button>
        </div>
        <div className="p2-modal-body" style={{ padding: '2rem', textAlign: 'center' }}>
          <input 
            type="text" 
            placeholder={lang === 'ar' ? 'أدخل الكلمات المفتاحية (مثال: Chlorella lipid extraction)' : 'Enter keywords (e.g., Chlorella lipid extraction)'} 
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '2px solid #e2e8f0', marginBottom: '1.5rem' }}
          />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => handleSearch('scholar')} style={{ background: '#4285F4', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>
              Google Scholar
            </button>
            <button onClick={() => handleSearch('pubmed')} style={{ background: '#2B5E86', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>
              PubMed
            </button>
            <button onClick={() => handleSearch('scopus')} style={{ background: '#F27F20', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>
              Scopus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
