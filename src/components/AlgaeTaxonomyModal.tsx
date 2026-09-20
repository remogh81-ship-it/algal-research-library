import React, { useState } from 'react';
import { useI18n } from '../i18n';

const ADVANCED_TAXONOMY_DATA = [
  {
    id: 'cyanobacteria',
    color: '#0d9488', // Teal
    name: { en: 'Cyanobacteria (Blue-Green Algae)', ar: 'البكتيريا الزرقاء (الطحالب الخضراء المزرقة)' },
    domain: { en: 'Prokaryota - Bacteria', ar: 'بدائيات النوى - البكتيريا' },
    pigments: { en: 'Chlorophyll a, Phycobilisomes (Phycocyanin, Phycoerythrin)', ar: 'كلوروفيل أ، فيكوبيليسوم (فيكوسيانين، فيكوإريثرين)' },
    storage: { en: 'Cyanophycean starch', ar: 'النشا السيانوبكتيري' },
    wall: { en: 'Peptidoglycan', ar: 'ببتيدوغليكان' },
    classes: [
      { name: 'Chroococcales', examples: 'Microcystis, Synechococcus' },
      { name: 'Oscillatoriales', examples: 'Oscillatoria, Spirulina (Arthrospira)' },
      { name: 'Nostocales (Heterocystous)', examples: 'Nostoc, Anabaena' }
    ]
  },
  {
    id: 'chlorophyta',
    color: '#15803d', // Green
    name: { en: 'Chlorophyta (Green Algae)', ar: 'الطحالب الخضراء (الكلوروفيتا)' },
    domain: { en: 'Eukaryota - Archaeplastida (Plantae)', ar: 'حقيقيات النوى - النباتات القديمة' },
    pigments: { en: 'Chlorophyll a, b, Lutein', ar: 'كلوروفيل أ، ب، لوتين' },
    storage: { en: 'Starch (inside chloroplast)', ar: 'النشا (داخل البلاستيدة)' },
    wall: { en: 'Cellulose, Glycoproteins', ar: 'سليلوز، بروتينات سكرية' },
    classes: [
      { name: 'Chlorophyceae', examples: 'Chlamydomonas, Scenedesmus, Haematococcus' },
      { name: 'Trebouxiophyceae', examples: 'Chlorella, Botryococcus' },
      { name: 'Ulvophyceae', examples: 'Ulva (Sea lettuce), Caulerpa' }
    ]
  },
  {
    id: 'charophyta',
    color: '#4ade80', // Light Green
    name: { en: 'Charophyta (Stoneworts & Desmids)', ar: 'الكاروفيتا (الطحالب الكارية والدزميدات)' },
    domain: { en: 'Eukaryota - Archaeplastida', ar: 'حقيقيات النوى - النباتات القديمة' },
    pigments: { en: 'Chlorophyll a, b', ar: 'كلوروفيل أ، ب' },
    storage: { en: 'Starch', ar: 'النشا' },
    wall: { en: 'Cellulose', ar: 'سليلوز' },
    classes: [
      { name: 'Charophyceae', examples: 'Chara, Nitella' },
      { name: 'Zygnematophyceae', examples: 'Spirogyra, Closterium, Micrasterias' }
    ]
  },
  {
    id: 'bacillariophyta',
    color: '#ca8a04', // Golden/Yellow
    name: { en: 'Bacillariophyta (Diatoms)', ar: 'الدياتومات (الطحالب العصوية)' },
    domain: { en: 'Eukaryota - Chromista (Stramenopiles)', ar: 'حقيقيات النوى - الكروميستا' },
    pigments: { en: 'Chlorophyll a, c, Fucoxanthin', ar: 'كلوروفيل أ، ج، فوكوكسانثين' },
    storage: { en: 'Chrysolaminarin, Lipids', ar: 'كريزولامينارين، دهون (زيوت)' },
    wall: { en: 'Silica (Frustule)', ar: 'سيليكا (صدفة دياتومية)' },
    classes: [
      { name: 'Centricae (Radial symmetry)', examples: 'Thalassiosira, Skeletonema, Cyclotella' },
      { name: 'Pennatae (Bilateral symmetry)', examples: 'Phaeodactylum, Navicula, Nitzschia' }
    ]
  },
  {
    id: 'dinoflagellata',
    color: '#b45309', // Dark Orange
    name: { en: 'Dinoflagellata (Dinoflagellates)', ar: 'السوطيات الدوارة (الدينوفلاجيلات)' },
    domain: { en: 'Eukaryota - Alveolata', ar: 'حقيقيات النوى - ذوات التجاويف' },
    pigments: { en: 'Chlorophyll a, c2, Peridinin', ar: 'كلوروفيل أ، ج2، بيريدينين' },
    storage: { en: 'Starch (cytoplasmic)', ar: 'نشا سيتوبلازمي' },
    wall: { en: 'Cellulosic plates (Theca) or naked', ar: 'صفائح سليلوزية (Theca) أو عارية' },
    classes: [
      { name: 'Dinophyceae', examples: 'Alexandrium, Symbiodinium, Gymnodinium, Ceratium' }
    ]
  },
  {
    id: 'phaeophyceae',
    color: '#713f12', // Brown
    name: { en: 'Phaeophyceae (Brown Algae)', ar: 'الطحالب البنية (الفيوفيتا)' },
    domain: { en: 'Eukaryota - Chromista (Stramenopiles)', ar: 'حقيقيات النوى - الكروميستا' },
    pigments: { en: 'Chlorophyll a, c, Fucoxanthin (dominant)', ar: 'كلوروفيل أ، ج، فوكوكسانثين (سائد)' },
    storage: { en: 'Laminarin, Mannitol', ar: 'لامينارين، مانيتول' },
    wall: { en: 'Cellulose, Alginates', ar: 'سليلوز، ألجينات (حمض الألجنيك)' },
    classes: [
      { name: 'Laminariales (Kelps)', examples: 'Macrocystis, Laminaria, Undaria' },
      { name: 'Fucales', examples: 'Fucus, Sargassum' },
      { name: 'Ectocarpales', examples: 'Ectocarpus' }
    ]
  },
  {
    id: 'rhodophyta',
    color: '#b91c1c', // Red
    name: { en: 'Rhodophyta (Red Algae)', ar: 'الطحالب الحمراء (الرودوفيتا)' },
    domain: { en: 'Eukaryota - Archaeplastida', ar: 'حقيقيات النوى - النباتات القديمة' },
    pigments: { en: 'Chlorophyll a, Phycoerythrin (dominant), Phycocyanin', ar: 'كلوروفيل أ، فيكوإريثرين (سائد)، فيكوسيانين' },
    storage: { en: 'Floridean starch', ar: 'النشا الفلوريدي' },
    wall: { en: 'Cellulose, Agar, Carrageenan', ar: 'سليلوز، أجار، كاراجينان' },
    classes: [
      { name: 'Bangiophyceae', examples: 'Porphyra (Nori), Pyropia' },
      { name: 'Florideophyceae', examples: 'Gelidium, Gracilaria, Corallina' }
    ]
  },
  {
    id: 'euglenophyta',
    color: '#84cc16', // Lime
    name: { en: 'Euglenophyta (Euglenoids)', ar: 'اليوجلينات (اليوجلينوفيتا)' },
    domain: { en: 'Eukaryota - Excavata', ar: 'حقيقيات النوى - اللجفاوات' },
    pigments: { en: 'Chlorophyll a, b (secondary endosymbiosis)', ar: 'كلوروفيل أ، ب (تعايش جواني ثانوي)' },
    storage: { en: 'Paramylon (β-1,3-glucan)', ar: 'باراميلون' },
    wall: { en: 'No cell wall, Proteinaceous Pellicle', ar: 'بدون جدار خلوي، قشيرة بروتينية (Pellicle)' },
    classes: [
      { name: 'Euglenophyceae', examples: 'Euglena, Phacus, Trachelomonas' }
    ]
  }
];

const IDENTIFICATION_STEPS: Record<string, { question: { en: string, ar: string }, options: { text: { en: string, ar: string }, next: string }[] }> = {
  step1: {
    question: { en: 'Observe the cellular structure under the microscope. What do you see?', ar: 'افحص التركيب الخلوي تحت المجهر. ماذا تلاحظ؟' },
    options: [
      { text: { en: 'Prokaryotic: No true nucleus or distinct membrane-bound organelles (chloroplasts).', ar: 'بدائية النواة: لا توجد نواة حقيقية أو بلاستيدات واضحة.' }, next: 'cyanobacteria' },
      { text: { en: 'Eukaryotic: Distinct nucleus and chloroplasts are visible.', ar: 'حقيقية النواة: تظهر نواة واضحة وبلاستيدات خضراء أو ملونة.' }, next: 'step2' }
    ]
  },
  step2: {
    question: { en: 'Observe the cell wall shape and composition.', ar: 'افحص شكل وتركيب الجدار الخلوي.' },
    options: [
      { text: { en: 'Cell wall is made of overlapping silica valves (geometric patterns/frustules).', ar: 'الجدار الخلوي صلب مكون من مصراعين من السيليكا (أشكال هندسية واضحة).' }, next: 'bacillariophyta' },
      { text: { en: 'Cell wall is not siliceous (no frustules).', ar: 'الجدار الخلوي ليس سيليكونياً.' }, next: 'step3' }
    ]
  },
  step3: {
    question: { en: 'What is the dominant pigmentation (color)?', ar: 'ما هو الصبغ المهيمن (لون الطحلب تحت المجهر)؟' },
    options: [
      { text: { en: 'Distinctly Green (Grass Green)', ar: 'أخضر واضح (أخضر عشبي)' }, next: 'step4' },
      { text: { en: 'Brown, Golden-Brown, or Olive Green', ar: 'بني، بني ذهبي، أو أخضر زيتي' }, next: 'step5' },
      { text: { en: 'Red or Purplish-Red', ar: 'أحمر أو أحمر مزرجن' }, next: 'rhodophyta' }
    ]
  },
  step4: {
    question: { en: 'Green Algae Characteristics: Observe morphology and motility.', ar: 'خصائص الطحالب الخضراء: افحص الشكل والحركة.' },
    options: [
      { text: { en: 'Unicellular, highly motile, no rigid cell wall (flexible pellicle), often with a red eyespot.', ar: 'وحيدة الخلية، سريعة الحركة، جدار مرن (قشيرة)، غالباً تمتلك بقعة عينية حمراء.' }, next: 'euglenophyta' },
      { text: { en: 'Complex branching structure (stoneworts) or distinct symmetrical semicells (desmids).', ar: 'تفرعات معقدة شبه نباتية، أو خلايا متماثلة نصفياً (دزميدات).' }, next: 'charophyta' },
      { text: { en: 'Unicellular, colonial, or filamentous with diverse chloroplast shapes (cup, spiral, net).', ar: 'وحيدة خلية، أو مستعمرات، أو خيطية بأشكال بلاستيدات متنوعة (كأسية، حلزونية، شبكية).' }, next: 'chlorophyta' }
    ]
  },
  step5: {
    question: { en: 'Brown/Golden Characteristics: Observe morphology and motility.', ar: 'خصائص الطحالب البنية/الذهبية: افحص الشكل والحركة.' },
    options: [
      { text: { en: 'Unicellular, motile with two unequal flagella, whirling motion, equatorial groove.', ar: 'وحيدة خلية، تتحرك بسوطين (حركة دورانية)، يوجد أخدود استوائي.' }, next: 'dinoflagellata' },
      { text: { en: 'Large macroscopic multicellular seaweeds (kelps/wracks), mostly marine.', ar: 'أعشاب بحرية ضخمة ومتعددة الخلايا (عشب البحر)، تعيش في الغالب في المحيطات.' }, next: 'phaeophyceae' }
    ]
  }
};

export const AlgaeTaxonomyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { language } = useI18n();
  const lang = language === 'ar' ? 'ar' : 'en';
  
  const [activeTab, setActiveTab] = useState<'directory' | 'identification'>('directory');
  const [expandedId, setExpandedId] = useState<string | null>(ADVANCED_TAXONOMY_DATA[0].id);
  
  // Interactive Key State
  const [currentStep, setCurrentStep] = useState<string>('step1');
  const [keyHistory, setKeyHistory] = useState<string[]>([]);
  const [identifiedResult, setIdentifiedResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOptionSelect = (nextState: string) => {
    if (nextState.startsWith('step')) {
      setKeyHistory([...keyHistory, currentStep]);
      setCurrentStep(nextState);
    } else {
      // It's a taxonomic group id
      setIdentifiedResult(nextState);
    }
  };

  const handleBack = () => {
    if (identifiedResult) {
      setIdentifiedResult(null);
      return;
    }
    const newHistory = [...keyHistory];
    const prev = newHistory.pop();
    if (prev) {
      setKeyHistory(newHistory);
      setCurrentStep(prev);
    }
  };

  const handleReset = () => {
    setKeyHistory([]);
    setCurrentStep('step1');
    setIdentifiedResult(null);
  };

  const renderIdentificationKey = () => {
    if (identifiedResult) {
      const resultData = ADVANCED_TAXONOMY_DATA.find(t => t.id === identifiedResult);
      return (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', border: `2px solid ${resultData?.color}` }}>
          <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>{lang === 'ar' ? 'نتيجة التعريف (Identification Result):' : 'Identification Result:'}</h3>
          <h2 style={{ color: resultData?.color, fontSize: '2rem', margin: '0 0 1rem 0' }}>{resultData?.name[lang]}</h2>
          <p style={{ color: '#334155', marginBottom: '2rem' }}>{lang === 'ar' ? 'تم الوصول إلى هذا التصنيف بناءً على الخصائص التي اخترتها.' : 'Reached this classification based on your selected traits.'}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => { setActiveTab('directory'); setExpandedId(resultData?.id || null); }} style={{ background: resultData?.color, color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>
              {lang === 'ar' ? 'عرض التفاصيل في الدليل' : 'View Details in Directory'}
            </button>
            <button onClick={handleReset} style={{ background: '#e2e8f0', color: '#334155', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>
              {lang === 'ar' ? 'تعريف عينة أخرى' : 'Identify Another Sample'}
            </button>
          </div>
        </div>
      );
    }

    const stepData = IDENTIFICATION_STEPS[currentStep];
    return (
      <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.3rem' }}>{stepData.question[lang]}</h3>
          {currentStep !== 'step1' && (
            <button onClick={handleBack} style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}>
              {lang === 'ar' ? '◀ تراجع' : '◀ Back'}
            </button>
          )}
        </div>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {stepData.options.map((opt, idx) => (
            <button 
              key={idx} 
              onClick={() => handleOptionSelect(opt.next)}
              style={{ 
                padding: '1.5rem', 
                background: '#f8fafc', 
                border: '2px solid #cbd5e1', 
                borderRadius: '8px', 
                textAlign: lang === 'ar' ? 'right' : 'left',
                fontSize: '1.1rem',
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = '#15803d')}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
            >
              {opt.text[lang]}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
           <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
             {lang === 'ar' ? 'مفتاح التعريف ثنائي التفرع (Dichotomous Key)' : 'Dichotomous Identification Key'}
           </span>
        </div>
      </div>
    );
  };

  return (
    <div className="phase2-modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="phase2-modal-dialog" onClick={e => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ maxWidth: '900px', width: '100%' }}>
        <div className="p2-modal-header" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', flexShrink: 0 }}>
          <div className="p2-header-title-box">
            <span className="p2-header-icon" style={{ fontSize: '2rem' }}>🧬</span>
            <div>
              <h2 style={{ color: '#166534', margin: '0 0 0.25rem 0' }}>{lang === 'ar' ? 'دليل التصنيف والتعريف للطحالب' : 'Algae Taxonomy & Identification'}</h2>
              <p style={{ margin: 0, color: '#15803d' }}>{lang === 'ar' ? 'تصنيف علمي دقيق ومفتاح تشخيصي تفاعلي' : 'Precise scientific taxonomy and interactive identification key'}</p>
            </div>
          </div>
          <button className="p2-close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="p2-tabs-nav" style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 1.5rem', flexShrink: 0 }}>
          <button 
            onClick={() => setActiveTab('directory')} 
            style={{ padding: '1.2rem', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'directory' ? '3px solid #166534' : '3px solid transparent', color: activeTab === 'directory' ? '#166534' : '#64748b', fontWeight: activeTab === 'directory' ? 'bold' : 'normal', fontSize: '1.1rem' }}
          >
            {lang === 'ar' ? 'قاعدة بيانات التصنيف 📚' : 'Taxonomy Database 📚'}
          </button>
          <button 
            onClick={() => setActiveTab('identification')}
            style={{ padding: '1.2rem', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'identification' ? '3px solid #166534' : '3px solid transparent', color: activeTab === 'identification' ? '#166534' : '#64748b', fontWeight: activeTab === 'identification' ? 'bold' : 'normal', fontSize: '1.1rem' }}
          >
            {lang === 'ar' ? 'مفتاح التعريف التفاعلي 🔬' : 'Interactive ID Key 🔬'}
          </button>
        </div>
        
        <div className="p2-modal-body" style={{ padding: '2rem', maxHeight: '65vh', overflowY: 'auto', background: '#f8fafc' }}>
          
          {activeTab === 'directory' && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {ADVANCED_TAXONOMY_DATA.map(tax => {
                const isExpanded = expandedId === tax.id;
                return (
                  <div key={tax.id} style={{ 
                    background: 'white', 
                    borderRadius: '12px', 
                    boxShadow: isExpanded ? '0 10px 25px -5px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
                    border: `1px solid ${isExpanded ? tax.color : '#e2e8f0'}`,
                    borderRight: lang === 'ar' ? `6px solid ${tax.color}` : `1px solid ${isExpanded ? tax.color : '#e2e8f0'}`,
                    borderLeft: lang === 'en' ? `6px solid ${tax.color}` : `1px solid ${isExpanded ? tax.color : '#e2e8f0'}`,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}>
                    
                    {/* Accordion Header */}
                    <div 
                      onClick={() => setExpandedId(isExpanded ? null : tax.id)}
                      style={{ 
                        padding: '1.25rem 1.5rem', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        cursor: 'pointer',
                        background: isExpanded ? '#f8fafc' : 'white'
                      }}
                    >
                      <div>
                        <h3 style={{ margin: 0, color: tax.color, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {tax.name[lang]}
                        </h3>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                          {lang === 'ar' ? 'المملكة / النطاق:' : 'Domain / Kingdom:'} <strong>{tax.domain[lang]}</strong>
                        </p>
                      </div>
                      <div style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s', color: tax.color, fontWeight: 'bold' }}>
                        ▼
                      </div>
                    </div>

                    {/* Accordion Body */}
                    {isExpanded && (
                      <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid #f1f5f9' }}>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
                          
                          {/* Traits Cards */}
                          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🎨</div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: '0.9rem' }}>{lang === 'ar' ? 'الأصباغ (Pigments)' : 'Pigments'}</h4>
                            <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>{tax.pigments[lang]}</p>
                          </div>
                          
                          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🔋</div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: '0.9rem' }}>{lang === 'ar' ? 'المواد المخزنة (Storage)' : 'Storage Products'}</h4>
                            <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>{tax.storage[lang]}</p>
                          </div>
                          
                          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🧱</div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: '0.9rem' }}>{lang === 'ar' ? 'الجدار الخلوي (Cell Wall)' : 'Cell Wall'}</h4>
                            <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>{tax.wall[lang]}</p>
                          </div>

                        </div>

                        {/* Sub-classes */}
                        <div>
                          <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                            {lang === 'ar' ? 'أهم الطوائف والأجناس (Classes & Genera)' : 'Key Classes & Genera'}
                          </h4>
                          <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {tax.classes.map((c, idx) => (
                              <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.5rem' }}>
                                <strong style={{ color: tax.color, minWidth: '150px' }}>{c.name}</strong>
                                <span style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>({c.examples})</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'identification' && renderIdentificationKey()}

        </div>
      </div>
    </div>
  );
};
