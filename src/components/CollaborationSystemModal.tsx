import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { COLLAB_DATA } from '../data/collaborationData';

export const CollaborationSystemModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { language } = useI18n();
  const lang = language === 'ar' ? 'ar' : 'en';
  const [activeTab, setActiveTab] = useState<'marketplace' | 'register'>('marketplace');

  if (!isOpen) return null;

  return (
    <div className="phase2-modal-overlay" onClick={onClose}>
      <div className="phase2-modal-dialog" onClick={e => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="p2-modal-header" style={{ flexShrink: 0, background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' }}>
          <div className="p2-header-title-box">
            <span className="p2-header-icon">🤝</span>
            <div>
              <h2>{lang === 'ar' ? 'نظام طلب التعاون وتسجيل السلالات' : 'Collaboration & Strain Registration'}</h2>
              <p>{lang === 'ar' ? 'منصة لتسجيل وتبادل السلالات الطحلبية وتكوين شراكات بحثية' : 'Platform for registering and exchanging strains'}</p>
            </div>
          </div>
          <button className="p2-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="p2-tabs-nav" style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 2rem', background: '#f8fafc' }}>
          <button 
            onClick={() => setActiveTab('marketplace')} 
            style={{ padding: '1rem', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'marketplace' ? '2px solid #4f46e5' : '2px solid transparent', color: activeTab === 'marketplace' ? '#4f46e5' : '#64748b', fontWeight: activeTab === 'marketplace' ? 'bold' : 'normal' }}
          >
            {lang === 'ar' ? 'السلالات والطلبات المتاحة' : 'Available Strains & Requests'}
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            style={{ padding: '1rem', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'register' ? '2px solid #4f46e5' : '2px solid transparent', color: activeTab === 'register' ? '#4f46e5' : '#64748b', fontWeight: activeTab === 'register' ? 'bold' : 'normal' }}
          >
            {lang === 'ar' ? 'تسجيل سلالة جديدة' : 'Register a New Strain'}
          </button>
        </div>

        <div className="p2-modal-body" style={{ padding: '2rem' }}>
          {activeTab === 'marketplace' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {COLLAB_DATA.map(item => (
                <div key={item.id} style={{ border: '1px solid #cbd5e1', padding: '1.5rem', borderRadius: '12px', background: '#f8fafc', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ marginTop: 0, color: '#1e293b' }}>{item.title[lang]}</h3>
                    <span style={{ background: '#4f46e5', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{item.type[lang]}</span>
                  </div>
                  <p style={{ margin: '1rem 0', color: '#334155' }}>{item.desc[lang]}</p>
                  <a href={`mailto:${item.contact}`} style={{ display: 'inline-block', background: '#0d7c78', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                    {lang === 'ar' ? 'تواصل مع الباحث' : 'Contact Researcher'}
                  </a>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'register' && (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }} onSubmit={e => { e.preventDefault(); alert(lang === 'ar' ? 'تم تسجيل السلالة بنجاح!' : 'Strain registered successfully!'); setActiveTab('marketplace'); }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'الاسم العلمي للسلالة' : 'Scientific Name of Strain'}</label>
                <input type="text" required placeholder="e.g. Chlorella vulgaris" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'كود السلالة (إن وجد)' : 'Strain Code (if any)'}</label>
                  <input type="text" placeholder="e.g. NRC-08" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'بيئة العزل/الموطن الأصلي' : 'Isolation Habitat / Origin'}</label>
                  <input type="text" required placeholder="e.g. Freshwater, Lake Nasser" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'اسم الباحث المالك' : 'Owner Researcher Name'}</label>
                  <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'المؤسسة/الجامعة' : 'Institution / University'}</label>
                  <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'أهم المميزات (مثال: محتوى دهني عالي، تحمل حرارة)' : 'Key Features (e.g. high lipid, thermotolerant)'}</label>
                <textarea required rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}></textarea>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'البريد الإلكتروني للتواصل' : 'Contact Email'}</label>
                <input type="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <button type="submit" style={{ background: '#4f46e5', color: 'white', padding: '0.75rem 2rem', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                  {lang === 'ar' ? 'تسجيل السلالة في القائمة ➕' : 'Register Strain to Directory ➕'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
