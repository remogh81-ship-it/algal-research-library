import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { Filter, Percent, ShieldCheck, Sparkles } from 'lucide-react';

interface PollutantPreset {
  id: string;
  name: string;
  category: 'Heavy Metal' | 'Nutrient' | 'Dye';
  initial: number; // mg/L
  residual: number; // mg/L
  biomass: number; // g
  volume: number; // L
  standardLimit: number; // mg/L (e.g. EPA / WHO wastewater limit)
}

const POLLUTANT_PRESETS: PollutantPreset[] = [
  { id: 'lead', name: 'Lead (Pb²⁺)', category: 'Heavy Metal', initial: 50, residual: 2.1, biomass: 1.0, volume: 1.0, standardLimit: 0.05 },
  { id: 'cadmium', name: 'Cadmium (Cd²⁺)', category: 'Heavy Metal', initial: 25, residual: 1.8, biomass: 1.0, volume: 1.0, standardLimit: 0.01 },
  { id: 'copper', name: 'Copper (Cu²⁺)', category: 'Heavy Metal', initial: 40, residual: 3.2, biomass: 1.0, volume: 1.0, standardLimit: 1.3 },
  { id: 'chromium', name: 'Chromium (Cr⁶⁺)', category: 'Heavy Metal', initial: 30, residual: 4.5, biomass: 1.5, volume: 1.0, standardLimit: 0.1 },
  { id: 'ammonium', name: 'Ammonium-N (NH₄⁺-N)', category: 'Nutrient', initial: 45, residual: 4.0, biomass: 2.0, volume: 1.0, standardLimit: 5.0 },
  { id: 'phosphate', name: 'Phosphate-P (PO₄³⁻-P)', category: 'Nutrient', initial: 15, residual: 0.75, biomass: 1.5, volume: 1.0, standardLimit: 1.0 },
  { id: 'methyleneBlue', name: 'Methylene Blue (Dye)', category: 'Dye', initial: 100, residual: 5.8, biomass: 1.0, volume: 1.0, standardLimit: 10.0 },
];

export default function PollutantAdsorptionCalculator() {
  const { t, language } = useI18n();
  const isRtl = language === 'ar';

  const [c0, setC0] = useState<number>(50); // mg/L
  const [ce, setCe] = useState<number>(2.1); // mg/L
  const [volume, setVolume] = useState<number>(1.0); // Liters
  const [mass, setMass] = useState<number>(1.0); // g dry biomass
  const [activePreset, setActivePreset] = useState<string>('lead');

  const handlePresetSelect = (presetId: string) => {
    const p = POLLUTANT_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setActivePreset(presetId);
    setC0(p.initial);
    setCe(p.residual);
    setMass(p.biomass);
    setVolume(p.volume);
  };

  const results = useMemo(() => {
    if (c0 <= 0 || ce < 0 || ce >= c0 || volume <= 0 || mass <= 0) {
      return {
        removalEfficiency: 0,
        qe: 0,
        totalRemovedMg: 0,
        kd: 0,
        isValid: false,
      };
    }

    const removalEfficiency = ((c0 - ce) / c0) * 100;
    const totalRemovedMg = (c0 - ce) * volume;
    const qe = totalRemovedMg / mass; // mg/g
    const kd = ce > 0 ? (qe / ce) * 1000 : 0; // mL/g distribution coefficient

    return {
      removalEfficiency: Number(removalEfficiency.toFixed(2)),
      qe: Number(qe.toFixed(2)),
      totalRemovedMg: Number(totalRemovedMg.toFixed(2)),
      kd: Number(kd.toFixed(1)),
      isValid: true,
    };
  }, [c0, ce, volume, mass]);

  return (
    <div className="lab-card" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="lab-card-header">
        <div className="lab-title-group">
          <span className="lab-icon-badge"><Filter size={20} /></span>
          <div>
            <h3>{t('pollutantCalculator.title')}</h3>
            <p className="lab-subtitle">{t('pollutantCalculator.subtitle')}</p>
          </div>
        </div>
      </div>

      <p className="lab-desc">{t('pollutantCalculator.description')}</p>

      {/* Target Presets */}
      <div className="lab-preset-row">
        <label className="preset-label">
          <Sparkles size={14} /> {t('pollutantCalculator.presetSelect')}:
        </label>
        <div className="preset-buttons">
          {POLLUTANT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`preset-btn ${activePreset === preset.id ? 'active' : ''}`}
              onClick={() => handlePresetSelect(preset.id)}
            >
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="lab-grid-inputs">
        <div className="input-group">
          <label>{t('pollutantCalculator.initialConc')} (C₀, mg/L)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={c0}
            onChange={(e) => setC0(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="input-group">
          <label>{t('pollutantCalculator.finalConc')} (C_e, mg/L)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={ce}
            onChange={(e) => setCe(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="input-group">
          <label>{t('pollutantCalculator.effluentVolume')} (V, Liters)</label>
          <input
            type="number"
            step="0.1"
            min="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="input-group">
          <label>{t('pollutantCalculator.algaeMass')} (m, g dry wt)</label>
          <input
            type="number"
            step="0.05"
            min="0.01"
            value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Progress Bar for Removal Efficiency */}
      {results.isValid && (
        <div className="efficiency-bar-wrapper">
          <div className="efficiency-header">
            <span>Removal Efficiency:</span>
            <strong>{results.removalEfficiency}%</strong>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(results.removalEfficiency, 100)}%`,
                background:
                  results.removalEfficiency >= 90
                    ? 'linear-gradient(90deg, #10b981, #059669)'
                    : results.removalEfficiency >= 70
                    ? 'linear-gradient(90deg, #06b6d4, #0284c7)'
                    : 'linear-gradient(90deg, #f59e0b, #d97706)',
              }}
            />
          </div>
        </div>
      )}

      {/* Results Matrix */}
      <div className="lab-results-matrix">
        <div className="result-metric-card primary">
          <span className="metric-label">
            <Percent size={14} /> {t('pollutantCalculator.removalEfficiency')}
          </span>
          <div className="metric-value">
            {results.isValid ? `${results.removalEfficiency}%` : '--'}
          </div>
          <div className="metric-sub-badge">
            {results.removalEfficiency >= 90 ? 'Excellent Remediation' : 'Active Biosorption'}
          </div>
        </div>

        <div className="result-metric-card">
          <span className="metric-label">{t('pollutantCalculator.adsorptionCapacity')} (q_e)</span>
          <div className="metric-value">
            {results.isValid ? results.qe : '--'} <small>mg/g</small>
          </div>
          <div className="metric-sub-badge">mg pollutant / g biomass</div>
        </div>

        <div className="result-metric-card">
          <span className="metric-label">Total Removed Mass</span>
          <div className="metric-value">
            {results.isValid ? results.totalRemovedMg : '--'} <small>mg</small>
          </div>
          <div className="metric-sub-badge">Captured from solution</div>
        </div>

        <div className="result-metric-card accent">
          <span className="metric-label">{t('pollutantCalculator.distributionCoeff')} (K_d)</span>
          <div className="metric-value">
            {results.isValid ? results.kd.toLocaleString() : '--'} <small>mL/g</small>
          </div>
          <div className="metric-sub-badge">Affinity Partitioning</div>
        </div>
      </div>

      {/* Scientific Formula Card */}
      <div className="lab-formula-card">
        <span className="formula-title">Scientific Equations:</span>
        <code>
          R (%) = [(C₀ - C_e) / C₀] × 100  |  q_e (mg/g) = [(C₀ - C_e) × V] / m
        </code>
      </div>
    </div>
  );
}
