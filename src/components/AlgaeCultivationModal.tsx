import React, { useState } from 'react';
import { useI18n } from '../i18n';

const APPLICATIONS_DATA = [
  {
    icon: '⛽',
    title: { en: 'Biofuels & Biodiesel', ar: 'الوقود الحيوي والديزل' },
    desc: { en: 'Extraction of lipids from oleaginous algae to produce sustainable biodiesel, bioethanol, and biomethane.', ar: 'استخلاص الدهون من الطحالب الزيتية لإنتاج وقود حيوي مستدام مثل الديزل الحيوي والإيثانول.' }
  },
  {
    icon: '💊',
    title: { en: 'Pharmaceuticals & Nutraceuticals', ar: 'الأدوية والمكملات الغذائية' },
    desc: { en: 'High-value compounds like Omega-3 fatty acids, Astaxanthin, and Phycocyanin used in health supplements.', ar: 'مركبات عالية القيمة مثل أحماض أوميغا-3، أستازانثين، وفيكوسيانين المستخدمة في المكملات.' }
  },
  {
    icon: '💧',
    title: { en: 'Wastewater Treatment', ar: 'معالجة مياه الصرف' },
    desc: { en: 'Bioremediation of municipal and industrial wastewater by absorbing heavy metals, nitrogen, and phosphorus.', ar: 'المعالجة الحيوية لمياه الصرف بامتصاص المعادن الثقيلة، النيتروجين، والفوسفور.' }
  },
  {
    icon: '🌍',
    title: { en: 'CO2 Sequestration', ar: 'احتجاز الكربون' },
    desc: { en: 'Mitigating climate change by capturing flue gas CO2 directly into algal biomass via photosynthesis.', ar: 'تقليل الانبعاثات بالتقاط ثاني أكسيد الكربون من المصانع وتحويله لكتلة حيوية.' }
  },
  {
    icon: '🐄',
    title: { en: 'Animal & Aquaculture Feed', ar: 'أعلاف الحيوانات والأسماك' },
    desc: { en: 'Protein-rich algal biomass used as a sustainable alternative feed in poultry, cattle, and aquaculture.', ar: 'كتلة حيوية غنية بالبروتين كبديل مستدام في تغذية الدواجن، الماشية، والاستزراع السمكي.' }
  },
  {
    icon: '♻️',
    title: { en: 'Bioplastics', ar: 'البلاستيك الحيوي' },
    desc: { en: 'Using algal polysaccharides and PHBs to create fully biodegradable and eco-friendly plastics.', ar: 'استخدام سكريات الطحالب لإنتاج بلاستيك حيوي قابل للتحلل وصديق للبيئة.' }
  }
];

const CULTIVATION_SYSTEMS = [
  {
    id: 'raceway',
    image: '/algae_raceway_pond.jpg',
    title: { en: 'Open Raceway Ponds (ORP)', ar: 'البرك المفتوحة (Raceway Ponds)' },
    desc: { 
      en: 'Shallow, oval-shaped artificial ponds with paddle wheels for circulation. The most common and cost-effective method for commercial mass cultivation.', 
      ar: 'برك صناعية ضحلة بيضاوية الشكل تعتمد على عجلات دوارة للتقليب. الطريقة الأرخص والأكثر شيوعاً للإنتاج التجاري الضخم.' 
    },
    pros: { en: 'Low capital cost, easy to maintain, scales up easily.', ar: 'تكلفة إنشاء منخفضة، سهولة الصيانة، يسهل توسيعها.' },
    cons: { en: 'High contamination risk, poor light penetration, evaporation losses.', ar: 'عُرضة للتلوث، تبخر المياه، اختراق ضعيف للضوء.' }
  },
  {
    id: 'tubular',
    image: '/algae_tubular_pbr.jpg',
    title: { en: 'Tubular Photobioreactors (PBR)', ar: 'المفاعلات الأنبوبية (Tubular PBR)' },
    desc: { 
      en: 'Closed systems of transparent tubes (glass or plastic) arranged horizontally or vertically. Offers a high surface-to-volume ratio for excellent sunlight capture.', 
      ar: 'أنظمة مغلقة من الأنابيب الشفافة ترص أفقياً أو عمودياً. توفر نسبة سطح إلى حجم عالية لالتقاط ضوء الشمس بكفاءة ممتازة.' 
    },
    pros: { en: 'High productivity, low contamination, continuous operation.', ar: 'إنتاجية عالية، تلوث شبه منعدم، تشغيل مستمر.' },
    cons: { en: 'High installation cost, oxygen buildup (requires degassing), fouling.', ar: 'تكلفة عالية، تراكم الأكسجين السام للطحالب، صعوبة التنظيف.' }
  },
  {
    id: 'flatpanel',
    image: '/algae_flat_panel_pbr.jpg',
    title: { en: 'Flat Panel Photobioreactors', ar: 'المفاعلات اللوحية المسطحة' },
    desc: { 
      en: 'Thin, vertical rectangular tanks offering very short light paths. Ideal for achieving extremely high cell densities, often illuminated by LEDs.', 
      ar: 'خزانات عمودية مستطيلة ورقيقة توفر مساراً ضوئياً قصيراً جداً. مثالية لتحقيق كثافة خلوية فائقة، وغالباً ما تضاء بمصابيح LED.' 
    },
    pros: { en: 'Highest light efficiency, great mass transfer, high density.', ar: 'كفاءة ضوئية قصوى، انتقال كتلة ممتاز، كثافة إنتاجية عالية.' },
    cons: { en: 'Hard to scale up individually, temperature control can be challenging.', ar: 'صعوبة التكبير لكل لوح بمفرده، تحديات في التحكم بالحرارة.' }
  },
  {
    id: 'column',
    image: '/algae_column_pbr.jpg',
    title: { en: 'Vertical Column / Airlift PBRs', ar: 'المفاعلات العمودية / الرفع بالهواء' },
    desc: { 
      en: 'Vertical cylindrical transparent tubes mixed by gas bubbling from the bottom (sparger). Excellent for sensitive algae as there are no moving mechanical parts.', 
      ar: 'أنابيب عمودية شفافة يتم تقليبها بضخ فقاعات الغاز من الأسفل. ممتازة للطحالب الحساسة لعدم وجود أجزاء ميكانيكية حادة للتقليب.' 
    },
    pros: { en: 'Low shear stress, good mixing, excellent mass transfer.', ar: 'إجهاد قص منخفض جداً، تقليب جيد، تبادل غازي ممتاز.' },
    cons: { en: 'Small illumination surface area relative to volume in thick columns.', ar: 'مساحة الإضاءة صغيرة مقارنة بالحجم في الأعمدة العريضة.' }
  }
];

export const AlgaeCultivationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { language } = useI18n();
  const lang = language === 'ar' ? 'ar' : 'en';
  const [activeTab, setActiveTab] = useState<'applications' | 'systems'>('applications');

  if (!isOpen) return null;

  return (
    <div className="phase2-modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="phase2-modal-dialog" onClick={e => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ maxWidth: '950px', width: '100%' }}>
        
        {/* Header */}
        <div className="p2-modal-header" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', flexShrink: 0 }}>
          <div className="p2-header-title-box">
            <span className="p2-header-icon" style={{ fontSize: '2rem' }}>🏭</span>
            <div>
              <h2 style={{ color: '#1e3a8a', margin: '0 0 0.25rem 0' }}>{lang === 'ar' ? 'تطبيقات زراعة الطحالب وأنظمة الاستزراع' : 'Algal Cultivation Apps & Systems'}</h2>
              <p style={{ margin: 0, color: '#1d4ed8' }}>{lang === 'ar' ? 'التطبيقات الصناعية والتصميم الهندسي للمفاعلات الحيوية' : 'Industrial applications and Bioreactor engineering designs'}</p>
            </div>
          </div>
          <button className="p2-close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Tabs */}
        <div className="p2-tabs-nav" style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 1.5rem', flexShrink: 0 }}>
          <button 
            onClick={() => setActiveTab('applications')} 
            style={{ padding: '1.2rem', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'applications' ? '3px solid #1d4ed8' : '3px solid transparent', color: activeTab === 'applications' ? '#1d4ed8' : '#64748b', fontWeight: activeTab === 'applications' ? 'bold' : 'normal', fontSize: '1.1rem' }}
          >
            {lang === 'ar' ? 'التطبيقات الصناعية والبيئية 🌍' : 'Industrial Applications 🌍'}
          </button>
          <button 
            onClick={() => setActiveTab('systems')}
            style={{ padding: '1.2rem', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeTab === 'systems' ? '3px solid #1d4ed8' : '3px solid transparent', color: activeTab === 'systems' ? '#1d4ed8' : '#64748b', fontWeight: activeTab === 'systems' ? 'bold' : 'normal', fontSize: '1.1rem' }}
          >
            {lang === 'ar' ? 'تصميمات المزارع الطحلبية (PBRs) 🧪' : 'Cultivation Designs (PBRs) 🧪'}
          </button>
        </div>
        
        {/* Body */}
        <div className="p2-modal-body" style={{ padding: '2rem', maxHeight: '70vh', overflowY: 'auto', background: '#f8fafc' }}>
          
          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {APPLICATIONS_DATA.map((app, idx) => (
                <div key={idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{app.icon}</div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem' }}>{app.title[lang]}</h3>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>{app.desc[lang]}</p>
                </div>
              ))}
            </div>
          )}

          {/* Systems Tab */}
          {activeTab === 'systems' && (
            <div style={{ display: 'grid', gap: '2rem' }}>
              {CULTIVATION_SYSTEMS.map(sys => (
                <div key={sys.id} style={{ display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  
                  {/* Text Details */}
                  <div style={{ padding: '2rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#1e3a8a', fontSize: '1.4rem' }}>{sys.title[lang]}</h3>
                    <p style={{ margin: '0 0 1.5rem 0', color: '#334155', fontSize: '1.05rem', lineHeight: '1.6' }}>{sys.desc[lang]}</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <strong style={{ color: '#166534', display: 'block', marginBottom: '0.5rem' }}>{lang === 'ar' ? '✔️ المميزات:' : '✔️ Pros:'}</strong>
                        <span style={{ color: '#15803d', fontSize: '0.9rem' }}>{sys.pros[lang]}</span>
                      </div>
                      <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
                        <strong style={{ color: '#991b1b', display: 'block', marginBottom: '0.5rem' }}>{lang === 'ar' ? '❌ العيوب:' : '❌ Cons:'}</strong>
                        <span style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{sys.cons[lang]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Scientific Diagram Image */}
                  <div style={{ background: '#f1f5f9', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                    <img src={sys.image} alt={sys.title.en} style={{ maxWidth: '100%', height: 'auto', maxHeight: '450px', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                  </div>
                  
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
