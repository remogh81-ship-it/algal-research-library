import React from 'react';
import { useI18n } from '../i18n';
import { AGENDA_DATA } from '../data/agendaData';

export const ConferencesAgendaModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { language } = useI18n();
  const lang = language === 'ar' ? 'ar' : 'en';

  if (!isOpen) return null;

  return (
    <div className="phase2-modal-overlay" onClick={onClose}>
      <div className="phase2-modal-dialog" onClick={e => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="p2-modal-header" style={{ flexShrink: 0, background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
          <div className="p2-header-title-box">
            <span className="p2-header-icon">📅</span>
            <div>
              <h2>{lang === 'ar' ? 'أجندة المؤتمرات ومنح الأبحاث' : 'Conferences & Grants Agenda'}</h2>
              <p>{lang === 'ar' ? 'أهم الفعاليات الأكاديمية وفرص التمويل الدولية' : 'Key academic events and international funding opportunities'}</p>
            </div>
          </div>
          <button className="p2-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="p2-modal-body" style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {AGENDA_DATA.map(item => (
              <div key={item.id} style={{ border: '1px solid #cbd5e1', padding: '1.5rem', borderRadius: '12px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ marginTop: 0 }}>{item.title[lang]}</h3>
                  <span style={{ background: '#0d7c78', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{item.type[lang]}</span>
                </div>
                <p style={{ margin: '0.5rem 0', color: '#475569' }}><strong>{lang === 'ar' ? 'الموعد/التمويل:' : 'Date/Funding:'}</strong> {item.date[lang]}</p>
                <p style={{ margin: '0.5rem 0', color: '#475569' }}><strong>{lang === 'ar' ? 'المكان:' : 'Location:'}</strong> {item.location[lang]}</p>
                <p style={{ margin: '0.5rem 0', color: '#b91c1c' }}><strong>{lang === 'ar' ? 'آخر موعد:' : 'Deadline:'}</strong> {item.deadline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
