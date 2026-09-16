import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { Scale, Sparkles, TrendingUp } from 'lucide-react';

interface SpeciesPreset {
  id: string;
  name: string;
  initial: number;
  final: number;
  days: number;
  description: string;
}

const SPECIES_PRESETS: SpeciesPreset[] = [
  { id: 'chlorella', name: 'Chlorella vulgaris', initial: 0.12, final: 1.85, days: 7, description: 'High-density green microalgae for bioenergy & protein' },
  { id: 'spirulina', name: 'Arthrospira (Spirulina) platensis', initial: 0.20, final: 2.50, days: 8, description: 'Alkaliphilic cyanobacteria rich in phycocyanin' },
  { id: 'scenedesmus', name: 'Scenedesmus obliquus', initial: 0.15, final: 2.10, days: 7, description: 'Robust wastewater bioremediation strain' },
  { id: 'dunaliella', name: 'Dunaliella salina', initial: 0.08, final: 1.25, days: 10, description: 'Halotolerant microalgae for beta-carotene production' },
  { id: 'nannochloropsis', name: 'Nannochloropsis oculata', initial: 0.15, final: 1.95, days: 7, description: 'Marine oleaginous microalgae for EPA omega-3' },
];

export default function BiomassProductivityCalculator() {
  const { t, language } = useI18n();
  const isRtl = language === 'ar';

  const [mode, setMode] = useState<'volumetric' | 'areal'>('volumetric');
  const [timeUnit, setTimeUnit] = useState<'days' | 'hours'>('days');
  const [initialBiomass, setInitialBiomass] = useState<number>(0.12);
  const [finalBiomass, setFinalBiomass] = useState<number>(1.85);
  const [duration, setDuration] = useState<number>(7);
  const [cultureVolume, setCultureVolume] = useState<number>(100); // Liters
  const [surfaceArea, setSurfaceArea] = useState<number>(10); // m²

  const handlePresetSelect = (presetId: string) => {
    const preset = SPECIES_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setInitialBiomass(preset.initial);
    setFinalBiomass(preset.final);
    setDuration(preset.days);
    setTimeUnit('days');
  };

  const results = useMemo(() => {
    const timeInDays = timeUnit === 'days' ? duration : duration / 24;
    if (timeInDays <= 0 || finalBiomass <= initialBiomass) {
      return {
        productivity: 0,
        totalHarvestGrams: 0,
        totalHarvestKg: 0,
        dailyHarvestGrams: 0,
        dailyHarvestKg: 0,
        annualYieldKg: 0,
        isValid: false,
      };
    }

    const netBiomass = finalBiomass - initialBiomass;
    const productivity = netBiomass / timeInDays; // g/L/day or g/m²/day

    const scaleFactor = mode === 'volumetric' ? cultureVolume : surfaceArea;
    const totalHarvestGrams = netBiomass * scaleFactor;
    const totalHarvestKg = totalHarvestGrams / 1000;
    const dailyHarvestGrams = productivity * scaleFactor;
    const dailyHarvestKg = dailyHarvestGrams / 1000;
    const annualYieldKg = dailyHarvestKg * 365;

    return {
      productivity: Number(productivity.toFixed(4)),
      totalHarvestGrams: Number(totalHarvestGrams.toFixed(2)),
      totalHarvestKg: Number(totalHarvestKg.toFixed(3)),
      dailyHarvestGrams: Number(dailyHarvestGrams.toFixed(2)),
      dailyHarvestKg: Number(dailyHarvestKg.toFixed(3)),
      annualYieldKg: Number(annualYieldKg.toFixed(2)),
      isValid: true,
    };
  }, [mode, timeUnit, initialBiomass, finalBiomass, duration, cultureVolume, surfaceArea]);

  // Performance benchmark classification
  const benchmarkStatus = useMemo(() => {
    if (!results.isValid) return { label: '--', color: '#64748b' };
    const p = results.productivity;
    if (mode === 'volumetric') {
      if (p < 0.15) return { label: isRtl ? 'معدل منخفض (Low)' : 'Low Growth', color: '#f59e0b' };
      if (p <= 0.35) return { label: isRtl ? 'معدل قياسي (Standard)' : 'Standard Yield', color: '#10b981' };
      return { label: isRtl ? 'إنتاجية فائقة (High Performance)' : 'High Performance PBR', color: '#06b6d4' };
    } else {
      if (p < 10) return { label: isRtl ? 'معدل منخفض (Low)' : 'Low Areal Yield', color: '#f59e0b' };
      if (p <= 25) return { label: isRtl ? 'معدل جيد (Standard Open Pond)' : 'Standard Pond Yield', color: '#10b981' };
      return { label: isRtl ? 'إنتاجية أحواض ممتازة (High Raceway)' : 'High Raceway Yield', color: '#06b6d4' };
    }
  }, [results, mode, isRtl]);

  return (
    <div className="lab-card" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="lab-card-header">
        <div className="lab-title-group">
          <span className="lab-icon-badge"><Scale size={20} /></span>
          <div>
            <h3>{t('biomassCalculator.title')}</h3>
            <p className="lab-subtitle">{t('biomassCalculator.subtitle')}</p>
          </div>
        </div>
        <div className="lab-mode-switch">
          <button
            type="button"
            className={`tab-pill ${mode === 'volumetric' ? 'active' : ''}`}
            onClick={() => setMode('volumetric')}
          >
            {t('biomassCalculator.modeVolumetric')}
          </button>
          <button
            type="button"
            className={`tab-pill ${mode === 'areal' ? 'active' : ''}`}
            onClick={() => setMode('areal')}
          >
            {t('biomassCalculator.modeAreal')}
          </button>
        </div>
      </div>

      <p className="lab-desc">{t('biomassCalculator.description')}</p>

      {/* Species Presets */}
      <div className="lab-preset-row">
        <label className="preset-label">
          <Sparkles size={14} /> {t('biomassCalculator.speciesPreset')}:
        </label>
        <div className="preset-buttons">
          {SPECIES_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="preset-btn"
              onClick={() => handlePresetSelect(preset.id)}
            >
              <em>{preset.name}</em>
            </button>
          ))}
        </div>
      </div>

      <div className="lab-grid-inputs">
        <div className="input-group">
          <label>
            {t('biomassCalculator.initialBiomass')} ({mode === 'volumetric' ? 'g/L' : 'g/m²'})
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={initialBiomass}
            onChange={(e) => setInitialBiomass(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="input-group">
          <label>
            {t('biomassCalculator.finalBiomass')} ({mode === 'volumetric' ? 'g/L' : 'g/m²'})
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={finalBiomass}
            onChange={(e) => setFinalBiomass(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="input-group">
          <div className="label-with-toggle">
            <label>{t('biomassCalculator.duration')}</label>
            <div className="mini-toggle">
              <button
                type="button"
                className={timeUnit === 'days' ? 'active' : ''}
                onClick={() => setTimeUnit('days')}
              >
                {t('biomassCalculator.unitDays')}
              </button>
              <button
                type="button"
                className={timeUnit === 'hours' ? 'active' : ''}
                onClick={() => setTimeUnit('hours')}
              >
                {t('biomassCalculator.unitHours')}
              </button>
            </div>
          </div>
          <input
            type="number"
            step="0.5"
            min="0.1"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="input-group">
          <label>
            {mode === 'volumetric'
              ? `${t('biomassCalculator.cultureVolume')} (Liters)`
              : `${t('biomassCalculator.surfaceArea')} (m²)`}
          </label>
          <input
            type="number"
            step="1"
            min="1"
            value={mode === 'volumetric' ? cultureVolume : surfaceArea}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              if (mode === 'volumetric') setCultureVolume(val);
              else setSurfaceArea(val);
            }}
          />
        </div>
      </div>

      {/* Results Display */}
      <div className="lab-results-matrix">
        <div className="result-metric-card primary">
          <span className="metric-label">
            {mode === 'volumetric'
              ? t('biomassCalculator.volumetricProductivity')
              : t('biomassCalculator.arealProductivity')}
          </span>
          <div className="metric-value">
            {results.isValid ? results.productivity : '--'}{' '}
            <small>{mode === 'volumetric' ? 'g·L⁻¹·d⁻¹' : 'g·m⁻²·d⁻¹'}</small>
          </div>
          <div className="metric-sub-badge" style={{ color: benchmarkStatus.color, borderColor: benchmarkStatus.color }}>
            {benchmarkStatus.label}
          </div>
        </div>

        <div className="result-metric-card">
          <span className="metric-label">{t('biomassCalculator.totalYield')}</span>
          <div className="metric-value">
            {results.isValid ? `${results.totalHarvestKg} kg` : '--'}
            <small>({results.totalHarvestGrams} g)</small>
          </div>
        </div>

        <div className="result-metric-card">
          <span className="metric-label">{t('biomassCalculator.dailyProduction')}</span>
          <div className="metric-value">
            {results.isValid ? `${results.dailyHarvestKg} kg/d` : '--'}
            <small>({results.dailyHarvestGrams} g/d)</small>
          </div>
        </div>

        <div className="result-metric-card accent">
          <span className="metric-label">
            <TrendingUp size={14} /> {t('biomassCalculator.annualProjection')}
          </span>
          <div className="metric-value">
            {results.isValid ? `${results.annualYieldKg.toLocaleString()} kg/yr` : '--'}
            <small>({(results.annualYieldKg / 1000).toFixed(2)} tons/yr)</small>
          </div>
        </div>
      </div>

      {/* Scientific Formula Card */}
      <div className="lab-formula-card">
        <span className="formula-title">Scientific Equation:</span>
        <code>
          {mode === 'volumetric'
            ? 'P_vol (g·L⁻¹·day⁻¹) = (X_t - X_0) / Δt'
            : 'P_area (g·m⁻²·day⁻¹) = (DW_t - DW_0) / (A · Δt)'}
        </code>
      </div>
    </div>
  );
}
