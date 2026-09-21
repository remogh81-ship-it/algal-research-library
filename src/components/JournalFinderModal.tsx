import React, { useState } from 'react';
import { useI18n } from '../i18n';

interface Journal {
  name: string;
  publisher: string;
  if: number;
  quartile: string;
  keywords: string[];
  scope: {
    en: string;
    ar: string;
  };
}

const JOURNALS: Journal[] = [
  {
    name: 'Algal Research',
    publisher: 'Elsevier',
    if: 5.0,
    quartile: 'Q1',
    keywords: ['biofuels', 'bioproducts', 'cultivation', 'biorefinery', 'microalgae', 'macroalgae', 'biomass', 'biotechnology', 'photobioreactor'],
    scope: {
      en: 'Focuses on the commercial use and biotechnology of microalgae and macroalgae, covering cultivation, harvesting, extraction, and bioproducts.',
      ar: 'يركز على الاستخدام التجاري والتكنولوجيا الحيوية للطحالب بنوعيها، ويغطي الاستزراع، الحصاد، الاستخلاص، والمنتجات الحيوية.'
    }
  },
  {
    name: 'Journal of Applied Phycology',
    publisher: 'Springer',
    if: 3.3,
    quartile: 'Q1',
    keywords: ['commercial', 'applied', 'applications', 'food', 'feed', 'phycocolloids', 'agriculture', 'aquaculture', 'bioremediation', 'seaweed'],
    scope: {
      en: 'Publishes research on the commercial applications of algae, including food, feed, hydrocolloids, agriculture, and wastewater treatment.',
      ar: 'ينشر الأبحاث المتعلقة بالتطبيقات التجارية للطحالب، كالغذاء، الأعلاف، الغرويات المائية، الزراعة، ومعالجة المياه.'
    }
  },
  {
    name: 'Bioresource Technology',
    publisher: 'Elsevier',
    if: 11.4,
    quartile: 'Q1',
    keywords: ['wastewater', 'biofuel', 'biogas', 'biodiesel', 'bioremediation', 'anaerobic digestion', 'environment', 'biomass', 'conversion'],
    scope: {
      en: 'A premier journal for biomass conversion, biofuels, and wastewater bioremediation using biological systems, including algae.',
      ar: 'مجلة رائدة لتحويل الكتلة الحيوية، الوقود الحيوي، والمعالجة الحيوية لمياه الصرف باستخدام الأنظمة البيولوجية مثل الطحالب.'
    }
  },
  {
    name: 'Journal of Phycology',
    publisher: 'Wiley',
    if: 2.8,
    quartile: 'Q1',
    keywords: ['taxonomy', 'ecology', 'evolution', 'cell biology', 'physiology', 'systematics', 'phylogeny', 'diatoms', 'cyanobacteria', 'basic'],
    scope: {
      en: 'Dedicated to fundamental research in phycology, emphasizing taxonomy, ecology, evolution, and basic biology of algae.',
      ar: 'مكرس للأبحاث الأساسية في علم الطحالب، مع التركيز على التصنيف، البيئة، التطور، والبيولوجيا الأساسية.'
    }
  },
  {
    name: 'Marine Drugs',
    publisher: 'MDPI',
    if: 5.4,
    quartile: 'Q1',
    keywords: ['pharmaceuticals', 'bioactive', 'compounds', 'metabolites', 'drugs', 'medicine', 'antibacterial', 'antioxidant', 'marine', 'seaweed'],
    scope: {
      en: 'Covers research on biologically active compounds isolated from marine organisms, heavily featuring marine algae and seaweeds.',
      ar: 'يغطي الأبحاث حول المركبات النشطة بيولوجياً المعزولة من الكائنات البحرية، خاصة الطحالب البحرية والأعشاب.'
    }
  },
  {
    name: 'Aquaculture',
    publisher: 'Elsevier',
    if: 4.5,
    quartile: 'Q1',
    keywords: ['feed', 'fish', 'shrimp', 'nutrition', 'aquaculture', 'live feed', 'rotifers', 'artemia', 'hatchery'],
    scope: {
      en: 'Focuses on the cultivation of aquatic organisms; highly relevant for studies using algae as live feed or feed ingredients.',
      ar: 'يركز على استزراع الكائنات المائية؛ مناسب جداً للدراسات التي تستخدم الطحالب كغذاء حي أو مكونات علفية.'
    }
  },
  {
    name: 'Phycologia',
    publisher: 'Taylor & Francis',
    if: 2.2,
    quartile: 'Q2',
    keywords: ['morphology', 'taxonomy', 'life history', 'reproduction', 'systematics', 'ultrastructure', 'benthic'],
    scope: {
      en: 'Publishes papers on all aspects of fundamental phycology, including morphology, taxonomy, and life histories.',
      ar: 'ينشر أوراقاً بحثية في جميع جوانب علم الطحالب الأساسي، بما في ذلك التشكل (المورفولوجي)، التصنيف، ودورات الحياة.'
    }
  },
  {
    name: 'European Journal of Phycology',
    publisher: 'Taylor & Francis',
    if: 2.4,
    quartile: 'Q2',
    keywords: ['ecology', 'physiology', 'macroalgae', 'coastal', 'marine', 'freshwater', 'blooms', 'phytoplankton'],
    scope: {
      en: 'Covers ecology, physiology, and biochemistry of algae, often featuring ecological studies of macroalgae and phytoplankton.',
      ar: 'يغطي البيئة والفسيولوجيا والكيمياء الحيوية للطحالب، وغالباً ما يبرز الدراسات البيئية للعوالق النباتية والطحالب الكبيرة.'
    }
  }
];

interface ScoredJournal extends Journal {
  score: number;
}

export const JournalFinderModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { language } = useI18n();
  const lang = language === 'ar' ? 'ar' : 'en';

  const [inputTitle, setInputTitle] = useState('');
  const [inputAbstract, setInputAbstract] = useState('');
  const [inputKeywords, setInputKeywords] = useState('');
  const [results, setResults] = useState<ScoredJournal[] | null>(null);

  if (!isOpen) return null;

  const handleSearch = () => {
    const combinedText = `${inputTitle} ${inputAbstract} ${inputKeywords}`.toLowerCase();
    const words = combinedText.split(/[\s,.;()-]+/).filter(w => w.length > 2);
    
    if (words.length === 0) {
      setResults(null);
      return;
    }

    const scored = JOURNALS.map(journal => {
      let matchCount = 0;
      journal.keywords.forEach(kw => {
        if (words.includes(kw.toLowerCase()) || combinedText.includes(kw.toLowerCase())) {
          matchCount += 1;
        }
      });
      return { ...journal, score: matchCount };
    });

    // Sort by score (desc), then by IF (desc)
    const sorted = scored.sort((a, b) => b.score - a.score || b.if - a.if);
    
    // Calculate percentage match (just a visual heuristic, max 3 matches = 95%)
    const maxScore = Math.max(...sorted.map(s => s.score), 1);
    const normalized = sorted.map(s => ({
      ...s,
      score: s.score > 0 ? Math.min(Math.round((s.score / Math.max(3, maxScore)) * 95) + 5, 99) : 0
    }));

    setResults(normalized);
  };

  const handleClear = () => {
    setInputTitle('');
    setInputAbstract('');
    setInputKeywords('');
    setResults(null);
  };

  return (
    <div className="phase2-modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="phase2-modal-dialog" onClick={e => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ maxWidth: '900px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div className="p2-modal-header" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', flexShrink: 0 }}>
          <div className="p2-header-title-box">
            <span className="p2-header-icon" style={{ fontSize: '2rem' }}>📑</span>
            <div>
              <h2 style={{ color: '#92400e', margin: '0 0 0.25rem 0' }}>{lang === 'ar' ? 'الباحث عن المجلات العلمية (Journal Finder)' : 'Academic Journal Finder'}</h2>
              <p style={{ margin: 0, color: '#b45309' }}>{lang === 'ar' ? 'ابحث عن أنسب مجلة علمية لنشر بحثك بناءً على الملخص والكلمات المفتاحية' : 'Find the most suitable journal for your manuscript based on title and abstract'}</p>
            </div>
          </div>
          <button className="p2-close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Body */}
        <div className="p2-modal-body" style={{ padding: '1.5rem', overflowY: 'auto', background: '#fafaf9', flexGrow: 1 }}>
          
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr', background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e7e5e4', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#44403c' }}>{lang === 'ar' ? 'عنوان البحث (Title)' : 'Manuscript Title'}</label>
              <input type="text" value={inputTitle} onChange={e => setInputTitle(e.target.value)} placeholder={lang === 'ar' ? 'أدخل عنوان البحث...' : 'Enter manuscript title...'} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '1rem' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#44403c' }}>{lang === 'ar' ? 'الملخص (Abstract)' : 'Abstract'}</label>
              <textarea value={inputAbstract} onChange={e => setInputAbstract(e.target.value)} placeholder={lang === 'ar' ? 'انسخ والصق ملخص البحث هنا لتحليل المحتوى...' : 'Paste your abstract here for content analysis...'} rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '1rem', resize: 'vertical' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#44403c' }}>{lang === 'ar' ? 'الكلمات المفتاحية (Keywords)' : 'Keywords'}</label>
              <input type="text" value={inputKeywords} onChange={e => setInputKeywords(e.target.value)} placeholder={lang === 'ar' ? 'مثال: microalgae, biodiesel, wastewater (مفصولة بفاصلة)' : 'e.g., microalgae, biodiesel, wastewater'} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '1rem' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button onClick={handleSearch} style={{ flexGrow: 1, padding: '0.8rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                🔍 {lang === 'ar' ? 'ابحث عن المجلات المناسبة' : 'Find Matching Journals'}
              </button>
              <button onClick={handleClear} style={{ padding: '0.8rem 1.5rem', background: '#f5f5f4', color: '#57534e', border: '1px solid #d6d3d1', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' }}>
                {lang === 'ar' ? 'مسح' : 'Clear'}
              </button>
            </div>

          </div>

          {/* Results Section */}
          {results && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ borderBottom: '2px solid #e7e5e4', paddingBottom: '0.5rem', color: '#292524' }}>{lang === 'ar' ? 'نتائج المطابقة' : 'Match Results'}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                {results.map((journal, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e7e5e4', borderLeft: `6px solid ${journal.score > 70 ? '#16a34a' : journal.score > 40 ? '#ca8a04' : '#a8a29e'}` }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', color: '#1c1917' }}>{journal.name}</h4>
                        <span style={{ color: '#78716c', fontSize: '0.9rem' }}>{lang === 'ar' ? 'الناشر:' : 'Publisher:'} {journal.publisher}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ background: '#fef9c3', color: '#854d0e', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 'bold' }}>IF: {journal.if.toFixed(1)}</span>
                        <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 'bold' }}>{journal.quartile}</span>
                        {journal.score > 0 && (
                          <span style={{ background: journal.score > 70 ? '#dcfce7' : '#fef08a', color: journal.score > 70 ? '#166534' : '#854d0e', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            {lang === 'ar' ? 'تطابق' : 'Match'}: {journal.score}%
                          </span>
                        )}
                      </div>
                    </div>

                    <p style={{ margin: '1rem 0 0 0', color: '#44403c', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      <strong>{lang === 'ar' ? 'نطاق المجلة (Scope): ' : 'Scope: '}</strong>
                      {journal.scope[lang]}
                    </p>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
