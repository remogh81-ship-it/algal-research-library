import React, { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { ALGAE_STRAINS } from '../data/strainsData';

interface AlgaeStrainsAtlasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchLibrary: (query: string) => void;
  onSelectMedium?: (mediumId: string) => void;
}

export const AlgaeStrainsAtlasModal: React.FC<AlgaeStrainsAtlasModalProps> = ({
  isOpen,
  onClose,
  onSearchLibrary,
  onSelectMedium
}) => {
  const { language } = useI18n();
  const currentLang = language === 'ar' ? 'ar' : 'en';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');

  const divisions = useMemo(() => [
    { id: 'all', label: currentLang === 'ar' ? 'الكل' : 'All' },
    { id: 'cyanobacteria', label: currentLang === 'ar' ? 'بكتيريا زرقاء' : 'Cyanobacteria' },
    { id: 'chlorophyta', label: currentLang === 'ar' ? 'طحالب خضراء' : 'Chlorophyta' },
    { id: 'diatom', label: currentLang === 'ar' ? 'داياتومات' : 'Diatoms' },
    { id: 'rhodophyta', label: currentLang === 'ar' ? 'طحالب حمراء' : 'Rhodophyta' },
    { id: 'macroalgae', label: currentLang === 'ar' ? 'طحالب بحرية' : 'Macroalgae' }
  ], [currentLang]);

  const filteredStrains = useMemo(() => {
    return ALGAE_STRAINS.filter(strain => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        strain.scientificName.toLowerCase().includes(q) ||
        strain.commonName[currentLang].toLowerCase().includes(q) ||
        strain.searchKeywords.toLowerCase().includes(q) ||
        strain.bioproducts[currentLang].some(b => b.toLowerCase().includes(q)) ||
        strain.applications[currentLang].some(a => a.toLowerCase().includes(q));

      const matchDivision =
        selectedDivision === 'all' ||
        (selectedDivision === 'cyanobacteria' && strain.division.en.toLowerCase().includes('cyanobacteria')) ||
        (selectedDivision === 'chlorophyta' && strain.division.en.toLowerCase().includes('chlorophyta')) ||
        (selectedDivision === 'diatom' && strain.division.en.toLowerCase().includes('diatom')) ||
        (selectedDivision === 'rhodophyta' && strain.division.en.toLowerCase().includes('rhodophyta')) ||
        (selectedDivision === 'macroalgae' && (strain.division.en.toLowerCase().includes('macroalgae') || strain.division.en.toLowerCase().includes('phaeophyceae')));

      return matchSearch && matchDivision;
    });
  }, [searchTerm, selectedDivision, currentLang]);

  if (!isOpen) return null;

  return (
    <div className="phase2-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="phase2-modal-dialog atlas-dialog" onClick={e => e.stopPropagation()} dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Header */}
        <div className="p2-modal-header atlas-header">
          <div className="p2-header-title-box">
            <span className="p2-header-icon">🧬</span>
            <div>
              <h2>
                {currentLang === 'ar' ? 'أطلس سلالات الطحالب والأحياء الدقيقة' : 'Algae Strains Directory & Atlas'}
                <span className="p2-badge-count">{ALGAE_STRAINS.length} {currentLang === 'ar' ? 'سلالة' : 'Strains'}</span>
              </h2>
              <p>{currentLang === 'ar' ? 'دليل الخصائص المورفولوجية والبيئية والمخرجات الحيوية وتطبيقات السلالات' : 'Morphological traits, optimal growth parameters, bioproducts & industrial applications'}</p>
            </div>
          </div>
          <button type="button" className="p2-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Toolbar */}
        <div className="p2-toolbar">
          <div className="p2-search-box">
            <span className="p2-search-icon">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={currentLang === 'ar' ? 'ابحث باسم السلالة (مثال: Spirulina)، التطبيق، أو المادة الحيوية...' : 'Search strain name, application, or bioproduct...'}
            />
            {searchTerm && <button className="p2-clear-search" onClick={() => setSearchTerm('')}>✕</button>}
          </div>
          <div className="p2-division-chips">
            {divisions.map(div => (
              <button
                key={div.id}
                className={'p2-chip ' + (selectedDivision === div.id ? 'active' : '')}
                onClick={() => setSelectedDivision(div.id)}
              >
                {div.label}
              </button>
            ))}
          </div>
        </div>

        {/* Strains Grid */}
        <div className="p2-modal-body">
          {filteredStrains.length === 0 ? (
            <div className="p2-empty-state">
              <span className="p2-empty-icon">🔍</span>
              <p>{currentLang === 'ar' ? 'لم يتم العثور على سلالات مطابقة' : 'No matching strains found'}</p>
              <button onClick={() => { setSearchTerm(''); setSelectedDivision('all'); }}>
                {currentLang === 'ar' ? 'إعادة تعيين الفلاتر' : 'Reset filters'}
              </button>
            </div>
          ) : (
            <div className="strains-cards-grid">
              {filteredStrains.map(strain => (
                <div key={strain.id} className="strain-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="strain-card-header">
                    <div>
                      <h3 className="strain-latin-name">{strain.scientificName}</h3>
                      <span className="strain-common-name">{strain.commonName[currentLang]}</span>
                    </div>
                    <span className="strain-division-badge">{strain.division[currentLang]}</span>
                  </div>

                  {strain.imageUrl && (
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: '8px' }}>
                      <img src={strain.imageUrl} alt={strain.scientificName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <p className="strain-desc">{strain.description[currentLang]}</p>

                  <div className="strain-params-grid">
                    <div className="param-item">
                      <span className="param-label">pH</span>
                      <strong className="param-val">{strain.optimalParams.pH}</strong>
                    </div>
                    <div className="param-item">
                      <span className="param-label">{currentLang === 'ar' ? 'الحرارة' : 'Temp'}</span>
                      <strong className="param-val">{strain.optimalParams.temperature}</strong>
                    </div>
                    <div className="param-item">
                      <span className="param-label">{currentLang === 'ar' ? 'الملوحة' : 'Salinity'}</span>
                      <strong className="param-val">{strain.optimalParams.salinity}</strong>
                    </div>
                    <div className="param-item">
                      <span className="param-label">{currentLang === 'ar' ? 'البيئة' : 'Medium'}</span>
                      <strong className="param-val param-medium">{strain.growthMedium}</strong>
                    </div>
                  </div>

                  <div className="strain-tags-section">
                    <span className="tags-heading">{currentLang === 'ar' ? 'المخرجات الحيوية:' : 'Bioproducts:'}</span>
                    <div className="tags-row">
                      {strain.bioproducts[currentLang].map((b, i) => (
                        <span key={i} className="bio-pill">🧪 {b}</span>
                      ))}
                    </div>
                  </div>

                  <div className="strain-tags-section">
                    <span className="tags-heading">{currentLang === 'ar' ? 'التطبيقات والمجالات:' : 'Applications:'}</span>
                    <div className="tags-row">
                      {strain.applications[currentLang].map((a, i) => (
                        <span key={i} className="app-pill">⚡ {a}</span>
                      ))}
                    </div>
                  </div>

                  <div className="strain-card-actions">
                    <button
                      className="strain-explore-btn"
                      onClick={() => {
                        onSearchLibrary(strain.searchKeywords);
                        onClose();
                      }}
                    >
                      📚 {currentLang === 'ar' ? 'استعراض أبحاث السلالة' : 'Search Papers in Library'}
                    </button>
                    {onSelectMedium && (
                      <button
                        className="strain-medium-btn"
                        onClick={() => {
                          const med = strain.growthMedium.toLowerCase().includes('zarrouk') ? 'zarrouk' : strain.growthMedium.toLowerCase().includes('bg-11') ? 'bg-11' : strain.growthMedium.toLowerCase().includes('bbm') ? 'bbm' : strain.growthMedium.toLowerCase().includes('f/2') ? 'f2-guillard' : 'bg-11';
                          onSelectMedium(med);
                        }}
                      >
                        🧪 {currentLang === 'ar' ? 'حاسبة البيئة' : 'Media Recipe'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p2-modal-footer">
          <span>{currentLang === 'ar' ? 'الجمعية المصرية للطحالب - إشراف أ.د. رضا محمد مغازى' : 'Egyptian Phycological Society - Prof. Dr. Reda Mohamed Moghazy'}</span>
          <button className="p2-footer-close-btn" onClick={onClose}>{currentLang === 'ar' ? 'إغلاق' : 'Close'}</button>
        </div>

      </div>
    </div>
  );
};
