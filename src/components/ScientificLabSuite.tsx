import { useState } from 'react';
import { useI18n } from '../i18n';
import { Activity, Beaker, Droplets, Filter, FlaskConical, LineChart, Scale, Wind } from 'lucide-react';
import GrowthRateCalculator from './GrowthRateCalculator';
import BiomassProductivityCalculator from './BiomassProductivityCalculator';
import NutrientDilutionCalculator from './NutrientDilutionCalculator';
import PollutantAdsorptionCalculator from './PollutantAdsorptionCalculator';
import Co2SequestrationRateCalculator from './Co2SequestrationRateCalculator';
import PigmentCalculator from './PigmentCalculator';

type LabTab = 'growth' | 'biomass' | 'nutrient' | 'pollutant' | 'co2' | 'pigment';

interface ScientificLabSuiteProps {
  onOpenStrainsAtlas?: () => void;
  onOpenMediaCalculator?: () => void;
}

export function ScientificLabSuite({ onOpenStrainsAtlas, onOpenMediaCalculator }: ScientificLabSuiteProps = {}) {
  const { t, language } = useI18n();
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState<LabTab>('growth');

  const tabs: Array<{ id: LabTab; labelKey: string; icon: any }> = [
    { id: 'growth', labelKey: 'labSuite.tabGrowth', icon: LineChart },
    { id: 'biomass', labelKey: 'labSuite.tabBiomass', icon: Scale },
    { id: 'nutrient', labelKey: 'labSuite.tabNutrient', icon: Droplets },
    { id: 'pollutant', labelKey: 'labSuite.tabPollutant', icon: Filter },
    { id: 'co2', labelKey: 'labSuite.tabCo2', icon: Wind },
    { id: 'pigment', labelKey: 'labSuite.tabPigment', icon: Activity },
  ];

  return (
    <section className="scientific-lab-suite" aria-label="Scientific Lab Suite" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Suite Header */}
      <div className="lab-suite-header">
        <div className="lab-suite-badge">
          <FlaskConical size={16} /> {t('labSuite.badge')}
        </div>
        <h2>{t('labSuite.title')}</h2>
        <p>{t('labSuite.description')}</p>


      </div>

      {/* Nav Tabs */}
      <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }} role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={`phase2-feature-btn ${isActive ? 'active-lab-tab' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="phase2-btn-icon"><Icon size={24} color={isActive ? '#0d7c78' : 'currentColor'} /></span>
              <div className="phase2-btn-text">
                <strong style={{ fontSize: '0.95rem' }}>{t(tab.labelKey)}</strong>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Active Calculator Component */}
      <div className="lab-suite-content">
        {activeTab === 'growth' && <GrowthRateCalculator />}
        {activeTab === 'biomass' && <BiomassProductivityCalculator />}
        {activeTab === 'nutrient' && <NutrientDilutionCalculator />}
        {activeTab === 'pollutant' && <PollutantAdsorptionCalculator />}
        {activeTab === 'co2' && <Co2SequestrationRateCalculator />}
        {activeTab === 'pigment' && <PigmentCalculator />}
      </div>
    </section>
  );
}
