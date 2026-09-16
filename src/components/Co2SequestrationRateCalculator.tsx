import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { CloudRain, DollarSign, Leaf, Trees, Wind } from 'lucide-react';

export default function Co2SequestrationRateCalculator() {
  const { t, language } = useI18n();
  const isRtl = language === 'ar';

  const [biomassProductivity, setBiomassProductivity] = useState<number>(0.25); // g/L/day
  const [carbonContent, setCarbonContent] = useState<number>(50); // % of dry weight
  const [cultureVolume, setCultureVolume] = useState<number>(500); // Liters
  const [flueGasCo2Pct, setFlueGasCo2Pct] = useState<number>(5.0); // % CO2 in feed gas
  const [carbonCreditPrice, setCarbonCreditPrice] = useState<number>(30); // USD per metric ton CO2

  const results = useMemo(() => {
    if (biomassProductivity <= 0 || carbonContent <= 0 || cultureVolume <= 0) {
      return {
        rCo2: 0,
        dailyKgCo2: 0,
        annualKgCo2: 0,
        annualTonsCo2: 0,
        carbonCreditVal: 0,
        treesEquivalent: 0,
        isValid: false,
      };
    }

    const cFraction = carbonContent / 100;
    // R_CO2 in g CO2 / L / day
    // 44 / 12 = 3.6667
    const rCo2 = cFraction * biomassProductivity * (44 / 12);
    const dailyGramsCo2 = rCo2 * cultureVolume;
    const dailyKgCo2 = dailyGramsCo2 / 1000;
    const annualKgCo2 = dailyKgCo2 * 365;
    const annualTonsCo2 = annualKgCo2 / 1000;

    // 1 mature tree sequesters ~21.77 kg CO2 / year (US EPA standard)
    const treesEquivalent = Math.round(annualKgCo2 / 21.77);
    const carbonCreditVal = annualTonsCo2 * carbonCreditPrice;

    return {
      rCo2: Number(rCo2.toFixed(4)),
      dailyKgCo2: Number(dailyKgCo2.toFixed(3)),
      annualKgCo2: Number(annualKgCo2.toFixed(1)),
      annualTonsCo2: Number(annualTonsCo2.toFixed(3)),
      carbonCreditVal: Number(carbonCreditVal.toFixed(2)),
      treesEquivalent,
      isValid: true,
    };
  }, [biomassProductivity, carbonContent, cultureVolume, carbonCreditPrice]);

  return (
    <div className="lab-card" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="lab-card-header">
        <div className="lab-title-group">
          <span className="lab-icon-badge"><Wind size={20} /></span>
          <div>
            <h3>{t('co2Calculator.title')}</h3>
            <p className="lab-subtitle">{t('co2Calculator.subtitle')}</p>
          </div>
        </div>
      </div>

      <p className="lab-desc">{t('co2Calculator.description')}</p>

      {/* Aeration Source Selector */}
      <div className="lab-preset-row">
        <label className="preset-label">
          <Leaf size={14} /> Aeration Source Preset:
        </label>
        <div className="preset-buttons">
          <button
            type="button"
            className={`preset-btn ${flueGasCo2Pct === 0.04 ? 'active' : ''}`}
            onClick={() => {
              setFlueGasCo2Pct(0.04);
              setBiomassProductivity(0.12);
            }}
          >
            Ambient Air (0.04% CO₂)
          </button>
          <button
            type="button"
            className={`preset-btn ${flueGasCo2Pct === 5.0 ? 'active' : ''}`}
            onClick={() => {
              setFlueGasCo2Pct(5.0);
              setBiomassProductivity(0.28);
            }}
          >
            5% CO₂ Enrichment (Bioreactor)
          </button>
          <button
            type="button"
            className={`preset-btn ${flueGasCo2Pct === 12.0 ? 'active' : ''}`}
            onClick={() => {
              setFlueGasCo2Pct(12.0);
              setBiomassProductivity(0.35);
            }}
          >
            12% Industrial Flue Gas
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="lab-grid-inputs">
        <div className="input-group">
          <label>{t('co2Calculator.biomassProd')} (P, g·L⁻¹·day⁻¹)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={biomassProductivity}
            onChange={(e) => setBiomassProductivity(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="input-group">
          <label>{t('co2Calculator.carbonContent')} (C_C, %)</label>
          <input
            type="number"
            step="1"
            min="30"
            max="65"
            value={carbonContent}
            onChange={(e) => setCarbonContent(parseFloat(e.target.value) || 50)}
          />
        </div>

        <div className="input-group">
          <label>{t('co2Calculator.cultureVolume')} (V, Liters)</label>
          <input
            type="number"
            step="10"
            min="1"
            value={cultureVolume}
            onChange={(e) => setCultureVolume(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="input-group">
          <label>Carbon Credit Value ($ / Ton CO₂)</label>
          <input
            type="number"
            step="5"
            min="0"
            value={carbonCreditPrice}
            onChange={(e) => setCarbonCreditPrice(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Results Matrix */}
      <div className="lab-results-matrix">
        <div className="result-metric-card primary">
          <span className="metric-label">{t('co2Calculator.sequestrationRate')} (R_CO₂)</span>
          <div className="metric-value">
            {results.isValid ? results.rCo2 : '--'}{' '}
            <small>g CO₂·L⁻¹·d⁻¹</small>
          </div>
          <div className="metric-sub-badge">1.833 g CO₂ per g biomass</div>
        </div>

        <div className="result-metric-card">
          <span className="metric-label">{t('co2Calculator.dailyCapture')}</span>
          <div className="metric-value">
            {results.isValid ? `${results.dailyKgCo2} kg/d` : '--'}
            <small>({(results.dailyKgCo2 * 1000).toFixed(0)} g/d)</small>
          </div>
        </div>

        <div className="result-metric-card">
          <span className="metric-label">{t('co2Calculator.annualCapture')}</span>
          <div className="metric-value">
            {results.isValid ? `${results.annualTonsCo2} t/yr` : '--'}
            <small>({results.annualKgCo2.toLocaleString()} kg/yr)</small>
          </div>
        </div>

        <div className="result-metric-card accent">
          <span className="metric-label">
            <Trees size={14} /> {t('co2Calculator.treesEquivalent')}
          </span>
          <div className="metric-value">
            {results.isValid ? `${results.treesEquivalent} trees` : '--'}
          </div>
          <div className="metric-sub-badge">
            <DollarSign size={12} /> Carbon Offset: ${results.carbonCreditVal} / yr
          </div>
        </div>
      </div>

      {/* Scientific Formula Card */}
      <div className="lab-formula-card">
        <span className="formula-title">Bio-fixation Stoichiometric Equation:</span>
        <code>R_CO₂ = C_biomass × P_biomass × (44 / 12) = {carbonContent}% × P × 3.667</code>
      </div>
    </div>
  );
}
