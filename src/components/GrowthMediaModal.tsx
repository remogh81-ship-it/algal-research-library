import React, { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { CULTURE_MEDIA } from '../data/mediaRecipesData';

interface GrowthMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMediumId?: string;
  onSearchLibrary?: (query: string) => void;
}

export const GrowthMediaModal: React.FC<GrowthMediaModalProps> = ({
  isOpen,
  onClose,
  initialMediumId
}) => {
  const { language } = useI18n();
  const currentLang = language === 'ar' ? 'ar' : 'en';

  const [selectedMediumId, setSelectedMediumId] = useState<string>(initialMediumId || 'zarrouk');
  const [targetVolumeLiters, setTargetVolumeLiters] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (initialMediumId && CULTURE_MEDIA.some(m => m.id === initialMediumId)) {
      setSelectedMediumId(initialMediumId);
    }
  }, [initialMediumId]);

  const currentMedium = useMemo(() => {
    return CULTURE_MEDIA.find(m => m.id === selectedMediumId) || CULTURE_MEDIA[0];
  }, [selectedMediumId]);

  const calculatedComponents = useMemo(() => {
    const vol = isNaN(targetVolumeLiters) || targetVolumeLiters <= 0 ? 1 : targetVolumeLiters;
    return currentMedium.components.map(comp => {
      const qty = comp.concentrationPerLiter * vol;
      let formatted = '';
      if (qty >= 100) formatted = qty.toFixed(1);
      else if (qty >= 1) formatted = qty.toFixed(2);
      else if (qty >= 0.01) formatted = qty.toFixed(3);
      else formatted = qty.toFixed(4);

      return {
        ...comp,
        calculatedQty: formatted
      };
    });
  }, [currentMedium, targetVolumeLiters]);

  const handleCopyRecipe = () => {
    const vol = isNaN(targetVolumeLiters) || targetVolumeLiters <= 0 ? 1 : targetVolumeLiters;
    let text = `=== ${currentMedium.name} ===\n`;
    text += `${currentLang === 'ar' ? 'الحجم' : 'Volume'}: ${vol} L | pH: ${currentMedium.phRange}\n\n`;
    text += `${currentLang === 'ar' ? 'المكونات والأوزان:' : 'Components:'}\n`;
    calculatedComponents.forEach((c, i) => {
      text += `${i + 1}. ${c.name} [${c.chemicalFormula}]: ${c.calculatedQty} ${c.unit}\n`;
    });
    text += `\n${currentLang === 'ar' ? 'التعقيم:' : 'Autoclave:'} ${currentMedium.autoclaveNotes[currentLang]}\n`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="phase2-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="phase2-modal-dialog media-dialog" onClick={e => e.stopPropagation()} dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Header */}
        <div className="p2-modal-header media-header">
          <div className="p2-header-title-box">
            <span className="p2-header-icon">🧪</span>
            <div>
              <h2>{currentLang === 'ar' ? 'دليل بيئات النمو القياسية وحاسبة الأملاح' : 'Standard Culture Media & Salt Calculator'}</h2>
              <p>{currentLang === 'ar' ? 'تراكيب كيميائية قياسية مع حاسبة تحضير فورية لأي حجم استزراع (مختبري أو صناعي)' : 'Formulations and volume preparation calculator for mass photobioreactors'}</p>
            </div>
          </div>
          <button type="button" className="p2-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Media Tabs */}
        <div className="media-tabs-bar">
          {CULTURE_MEDIA.map(m => (
            <button
              key={m.id}
              className={'media-tab-btn ' + (selectedMediumId === m.id ? 'active' : '')}
              onClick={() => setSelectedMediumId(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p2-modal-body">
          {/* Active Medium Overview */}
          <div className="media-overview-card">
            <div className="media-card-top">
              <h3>{currentMedium.name}</h3>
              <div className="media-badges">
                <span className="ph-badge">pH: {currentMedium.phRange}</span>
                <span className="cat-badge">{currentMedium.category}</span>
              </div>
            </div>
            <p className="media-desc">{currentMedium.description[currentLang]}</p>
            <div className="target-strains-row">
              <span className="target-strains-label">{currentLang === 'ar' ? 'السلالات المتوافقة:' : 'Target Strains:'}</span>
              {currentMedium.targetStrains.map((s, idx) => (
                <span key={idx} className="strain-pill">{s}</span>
              ))}
            </div>
          </div>

          {/* Calculator Control */}
          <div className="calc-control-card">
            <div className="calc-info">
              <strong>🧮 {currentLang === 'ar' ? 'حجم الوسط المراد تحضيره:' : 'Target Volume:'}</strong>
              <span>{currentLang === 'ar' ? 'أدخل الحجم المطلوب باللترات لحساب الأوزان الدقيقة تلقائياً' : 'Enter volume in Liters to compute chemical weights'}</span>
            </div>
            <div className="calc-inputs">
              <div className="calc-number-box">
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={targetVolumeLiters}
                  onChange={e => setTargetVolumeLiters(parseFloat(e.target.value) || 0)}
                />
                <span className="unit-label">L</span>
              </div>
              <div className="calc-presets">
                {[1, 5, 20, 100, 500].map(v => (
                  <button
                    key={v}
                    className={'preset-btn ' + (targetVolumeLiters === v ? 'active' : '')}
                    onClick={() => setTargetVolumeLiters(v)}
                  >
                    {v}L
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Salt Preparation Table */}
          <div className="media-table-wrapper">
            <table className="media-salts-table">
              <thead>
                <tr>
                  <th>{currentLang === 'ar' ? 'المادة الكيميائية / الملح' : 'Component'}</th>
                  <th>{currentLang === 'ar' ? 'الصيغة' : 'Formula'}</th>
                  <th>{currentLang === 'ar' ? 'التركيز (1 لتر)' : 'Base (1L)'}</th>
                  <th className="highlight-col">{currentLang === 'ar' ? `الوزن المطلوب (${targetVolumeLiters} لتر)` : `Required (${targetVolumeLiters} L)`}</th>
                  <th>{currentLang === 'ar' ? 'الدور الوظيفي' : 'Role'}</th>
                </tr>
              </thead>
              <tbody>
                {calculatedComponents.map((c, i) => (
                  <tr key={i}>
                    <td className="comp-name">{c.name}</td>
                    <td className="comp-formula">{c.chemicalFormula}</td>
                    <td className="comp-base">{c.concentrationPerLiter} {c.unit}/L</td>
                    <td className="comp-calc">{c.calculatedQty} {c.unit}</td>
                    <td className="comp-role">{c.role[currentLang]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Autoclave & Tips */}
          <div className="media-tips-grid">
            <div className="tip-card autoclave-tip">
              <h4>⚠️ {currentLang === 'ar' ? 'إرشادات التعقيم والأوتوكلاف:' : 'Sterilization Notes:'}</h4>
              <p>{currentMedium.autoclaveNotes[currentLang]}</p>
            </div>
            <div className="tip-card prep-tip">
              <h4>💡 {currentLang === 'ar' ? 'نصائح التحضير المعملي:' : 'Preparation Tips:'}</h4>
              <p>{currentMedium.preparationTips[currentLang]}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p2-modal-footer">
          <span>{currentLang === 'ar' ? 'الجمعية المصرية للطحالب - معتمد للمختبرات والمزارع' : 'Egyptian Phycological Society'}</span>
          <div className="footer-actions">
            <button className="copy-recipe-btn" onClick={handleCopyRecipe}>
              {copied ? '✓ ' + (currentLang === 'ar' ? 'تم النسخ!' : 'Copied!') : '📋 ' + (currentLang === 'ar' ? 'نسخ أوزان التركيبة' : 'Copy Recipe')}
            </button>
            <button className="p2-footer-close-btn" onClick={onClose}>{currentLang === 'ar' ? 'إغلاق' : 'Close'}</button>
          </div>
        </div>

      </div>
    </div>
  );
};
