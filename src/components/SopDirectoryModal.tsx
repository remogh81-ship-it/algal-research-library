import React from 'react';
import { useI18n } from '../i18n';
import { SOPS_DATA } from '../data/sopsData';

export const SopDirectoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { language } = useI18n();
  const lang = language === 'ar' ? 'ar' : 'en';

  if (!isOpen) return null;

  return (
    <div className="phase2-modal-overlay" onClick={onClose}>
      <div className="phase2-modal-dialog" onClick={e => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="p2-modal-header" style={{ flexShrink: 0, background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)' }}>
          <div className="p2-header-title-box">
            <span className="p2-header-icon">📋</span>
            <div>
              <h2>{lang === 'ar' ? 'دليل البروتوكولات المعملية القياسية' : 'Standard Operating Protocols'}</h2>
              <p>{lang === 'ar' ? 'إجراءات قياسية موثقة للعمل في مختبرات الطحالب' : 'Documented standard procedures for phycology labs'}</p>
            </div>
          </div>
          <button className="p2-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="p2-modal-body" style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {SOPS_DATA.map(sop => (
              <div key={sop.id} style={{ border: '1px solid #cbd5e1', padding: '1.5rem', borderRadius: '12px', background: '#f8fafc' }}>
                <h3 style={{ marginTop: 0 }}>{sop.title[lang]}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ background: '#0d7c78', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{sop.category[lang]}</span>
                  <span style={{ background: '#e2e8f0', color: '#334155', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{sop.difficulty[lang]}</span>
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>⚠️ {sop.safety[lang]}</span>
                </div>
                <p>{sop.description[lang]}</p>
                {sop.url && (
                  <div style={{ marginBottom: '1rem' }}>
                    <a href={sop.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#0ea5e9', textDecoration: 'none', fontWeight: 'bold' }}>
                      🔗 {lang === 'ar' ? 'الرابط المرجعي للبروتوكول' : 'Protocol Reference Link'}
                    </a>
                  </div>
                )}
                <h4 style={{ marginBottom: '0.5rem' }}>{lang === 'ar' ? 'الخطوات:' : 'Steps:'}</h4>
                <ol style={{ paddingLeft: lang === 'ar' ? '0' : '1.5rem', paddingRight: lang === 'ar' ? '1.5rem' : '0' }}>
                  {sop.steps.map((s, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>{s[lang]}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
