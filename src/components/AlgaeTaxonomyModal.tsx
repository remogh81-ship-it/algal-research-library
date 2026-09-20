import React, { useState } from 'react';
import { useI18n } from '../i18n';

const TAXONOMY_DATA = [
  { id: 'cyanobacteria', name: { en: 'Cyanobacteria (Blue-Green Algae)', ar: 'البكتيريا الزرقاء (الطحالب الخضراء المزرقة)' }, desc: { en: 'Prokaryotic oxygenic phototrophs. Examples: Spirulina, Nostoc, Microcystis.', ar: 'كائنات بدائية النواة تقوم بالبناء الضوئي. أمثلة: سبيرولينا، نوستوك.' } },
  { id: 'chlorophyta', name: { en: 'Chlorophyta (Green Algae)', ar: 'الطحالب الخضراء (Chlorophyta)' }, desc: { en: 'Eukaryotic algae with chlorophyll a and b. Examples: Chlorella, Dunaliella, Scenedesmus.', ar: 'طحالب حقيقية النواة تحتوي على كلوروفيل أ و ب. أمثلة: كلوريلا، دونالييلا.' } },
  { id: 'bacillariophyta', name: { en: 'Bacillariophyta (Diatoms)', ar: 'الدياتومات (Bacillariophyta)' }, desc: { en: 'Characterized by siliceous frustules. Examples: Skeletonema, Thalassiosira.', ar: 'تتميز بجدر خلايا سيليكونية (Frustules). أمثلة: سكليتونيما، ثالاسيوسيرا.' } },
  { id: 'rhodophyta', name: { en: 'Rhodophyta (Red Algae)', ar: 'الطحالب الحمراء (Rhodophyta)' }, desc: { en: 'Contain phycobiliproteins giving red color. Examples: Porphyra, Gelidium.', ar: 'تحتوي على صبغات فيكوبيليبروتين تعطيها اللون الأحمر. أمثلة: بورفيرا، جيليديوم.' } },
  { id: 'phaeophyceae', name: { en: 'Phaeophyceae (Brown Algae)', ar: 'الطحالب البنية (Phaeophyceae)' }, desc: { en: 'Mostly marine, containing fucoxanthin. Examples: Sargassum, Macrocystis.', ar: 'معظمها بحرية، تحتوي على صبغة الفوكوكسانثين. أمثلة: سارجاسوم، ماكروسيستيس.' } },
];

export const AlgaeTaxonomyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { language } = useI18n();
  const lang = language === 'ar' ? 'ar' : 'en';
  
  if (!isOpen) return null;

  return (
    <div className="phase2-modal-overlay" onClick={onClose}>
      <div className="phase2-modal-dialog" onClick={e => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="p2-modal-header" style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' }}>
          <div className="p2-header-title-box">
            <span className="p2-header-icon">🧬</span>
            <div>
              <h2>{lang === 'ar' ? 'دليل تصنيف الطحالب' : 'Algae Taxonomy Directory'}</h2>
              <p>{lang === 'ar' ? 'المرجع التصنيفي الشامل للمجموعات الطحلبية الرئيسية' : 'Comprehensive taxonomic reference for major algal groups'}</p>
            </div>
          </div>
          <button className="p2-close-btn" onClick={onClose}>✖</button>
        </div>
        <div className="p2-modal-body" style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {TAXONOMY_DATA.map(tax => (
              <div key={tax.id} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #22c55e' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#15803d' }}>{tax.name[lang]}</h3>
                <p style={{ margin: 0, color: '#334155' }}>{tax.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
