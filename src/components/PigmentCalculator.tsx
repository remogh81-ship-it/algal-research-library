import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { Activity, Award, Eye, Pipette } from 'lucide-react';

type PigmentProtocol = 'acetone' | 'methanol' | 'phycocyanin';

export default function PigmentCalculator() {
  const { t, language } = useI18n();
  const isRtl = language === 'ar';

  const [protocol, setProtocol] = useState<PigmentProtocol>('acetone');

  // Spectrophotometric Absorbance Inputs
  const [a663, setA663] = useState<number>(0.542);
  const [a647, setA647] = useState<number>(0.218);
  const [a470, setA470] = useState<number>(0.875);

  // Phycobiliprotein Absorbance Inputs
  const [a620, setA620] = useState<number>(0.785);
  const [a652, setA652] = useState<number>(0.342);
  const [a565, setA565] = useState<number>(0.125);
  const [a280, setA280] = useState<number>(0.650); // Total protein peak for purity ratio

  // Volumes
  const [extractVol, setExtractVol] = useState<number>(5.0); // mL solvent
  const [cultureVol, setCultureVol] = useState<number>(10.0); // mL culture filtered
  const [dryWeightMg, setDryWeightMg] = useState<number>(15.0); // mg dry biomass filtered

  const results = useMemo(() => {
    const volRatio = cultureVol > 0 ? extractVol / cultureVol : 1;

    if (protocol === 'acetone') {
      // 80% Acetone (Lichtenthaler & Wellburn 1983)
      const chla_ug_ml = 12.25 * a663 - 2.79 * a647;
      const chlb_ug_ml = 21.50 * a647 - 5.10 * a663;
      const totalChl_ug_ml = chla_ug_ml + chlb_ug_ml;
      const car_ug_ml = (1000 * a470 - 1.82 * chla_ug_ml - 85.02 * chlb_ug_ml) / 198;

      const chla_culture = chla_ug_ml * volRatio; // ug/mL in culture = mg/L
      const chlb_culture = chlb_ug_ml * volRatio;
      const car_culture = car_ug_ml * volRatio;

      const chla_mg_g = dryWeightMg > 0 ? (chla_ug_ml * extractVol) / dryWeightMg : 0;
      const car_mg_g = dryWeightMg > 0 ? (car_ug_ml * extractVol) / dryWeightMg : 0;

      return {
        protocol: 'acetone',
        chla_extract: Number(Math.max(chla_ug_ml, 0).toFixed(2)),
        chlb_extract: Number(Math.max(chlb_ug_ml, 0).toFixed(2)),
        totalChl: Number(Math.max(totalChl_ug_ml, 0).toFixed(2)),
        car_extract: Number(Math.max(car_ug_ml, 0).toFixed(2)),
        chla_culture: Number(Math.max(chla_culture, 0).toFixed(2)),
        car_culture: Number(Math.max(car_culture, 0).toFixed(2)),
        chla_mg_g: Number(Math.max(chla_mg_g, 0).toFixed(2)),
        car_mg_g: Number(Math.max(car_mg_g, 0).toFixed(2)),
        ratioAb: chlb_ug_ml > 0 ? Number((chla_ug_ml / chlb_ug_ml).toFixed(2)) : 0,
        isValid: chla_ug_ml > 0,
      };
    } else if (protocol === 'methanol') {
      // 100% Methanol (Lichtenthaler 1987)
      const chla_ug_ml = 16.72 * a663 - 9.16 * a647;
      const chlb_ug_ml = 34.09 * a647 - 15.28 * a663;
      const totalChl_ug_ml = chla_ug_ml + chlb_ug_ml;
      const car_ug_ml = (1000 * a470 - 1.63 * chla_ug_ml - 104.96 * chlb_ug_ml) / 221;

      const chla_culture = chla_ug_ml * volRatio;
      const car_culture = car_ug_ml * volRatio;
      const chla_mg_g = dryWeightMg > 0 ? (chla_ug_ml * extractVol) / dryWeightMg : 0;

      return {
        protocol: 'methanol',
        chla_extract: Number(Math.max(chla_ug_ml, 0).toFixed(2)),
        chlb_extract: Number(Math.max(chlb_ug_ml, 0).toFixed(2)),
        totalChl: Number(Math.max(totalChl_ug_ml, 0).toFixed(2)),
        car_extract: Number(Math.max(car_ug_ml, 0).toFixed(2)),
        chla_culture: Number(Math.max(chla_culture, 0).toFixed(2)),
        car_culture: Number(Math.max(car_culture, 0).toFixed(2)),
        chla_mg_g: Number(Math.max(chla_mg_g, 0).toFixed(2)),
        car_mg_g: 0,
        ratioAb: chlb_ug_ml > 0 ? Number((chla_ug_ml / chlb_ug_ml).toFixed(2)) : 0,
        isValid: chla_ug_ml > 0,
      };
    } else {
      // Bennett & Bogorad (1973) Phycobiliproteins in mg/mL
      const cpc_mg_ml = (a620 - 0.474 * a652) / 5.34;
      const apc_mg_ml = (a652 - 0.208 * a620) / 5.09;
      const pe_mg_ml = (a565 - 2.41 * cpc_mg_ml - 0.849 * apc_mg_ml) / 9.62;
      const purityRatio = a280 > 0 ? a620 / a280 : 0;

      let purityGrade = 'Crude / Raw Extract';
      let gradeColor = '#94a3b8';
      if (purityRatio >= 4.0) {
        purityGrade = 'Analytical / Diagnostic Grade (A₆₂₀/A₂₈₀ ≥ 4.0)';
        gradeColor = '#a855f7';
      } else if (purityRatio >= 1.5) {
        purityGrade = 'Cosmetic Grade (A₆₂₀/A₂₈₀ ≥ 1.5)';
        gradeColor = '#06b6d4';
      } else if (purityRatio >= 0.7) {
        purityGrade = 'Food Grade (A₆₂₀/A₂₈₀ ≥ 0.7)';
        gradeColor = '#10b981';
      }

      const cpcYieldGrams = (cpc_mg_ml * extractVol) / 1000;
      const cpcPercentBiomass = dryWeightMg > 0 ? ((cpc_mg_ml * extractVol) / (dryWeightMg / 1000)) * 100 : 0;

      return {
        protocol: 'phycocyanin',
        cpc: Number(Math.max(cpc_mg_ml, 0).toFixed(3)),
        apc: Number(Math.max(apc_mg_ml, 0).toFixed(3)),
        pe: Number(Math.max(pe_mg_ml, 0).toFixed(3)),
        purityRatio: Number(purityRatio.toFixed(2)),
        purityGrade,
        gradeColor,
        cpcYieldGrams: Number(cpcYieldGrams.toFixed(3)),
        cpcPercentBiomass: Number(cpcPercentBiomass.toFixed(1)),
        isValid: cpc_mg_ml > 0,
      };
    }
  }, [protocol, a663, a647, a470, a620, a652, a565, a280, extractVol, cultureVol, dryWeightMg]);

  return (
    <div className="lab-card" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="lab-card-header">
        <div className="lab-title-group">
          <span className="lab-icon-badge"><Activity size={20} /></span>
          <div>
            <h3>{t('pigmentCalculator.title')}</h3>
            <p className="lab-subtitle">{t('pigmentCalculator.subtitle')}</p>
          </div>
        </div>

        <div className="lab-mode-switch">
          <button
            type="button"
            className={`tab-pill ${protocol === 'acetone' ? 'active' : ''}`}
            onClick={() => setProtocol('acetone')}
          >
            {t('pigmentCalculator.methodAcetone')}
          </button>
          <button
            type="button"
            className={`tab-pill ${protocol === 'methanol' ? 'active' : ''}`}
            onClick={() => setProtocol('methanol')}
          >
            {t('pigmentCalculator.methodMethanol')}
          </button>
          <button
            type="button"
            className={`tab-pill ${protocol === 'phycocyanin' ? 'active' : ''}`}
            onClick={() => setProtocol('phycocyanin')}
          >
            {t('pigmentCalculator.methodPhycocyanin')}
          </button>
        </div>
      </div>

      <p className="lab-desc">{t('pigmentCalculator.description')}</p>

      {protocol !== 'phycocyanin' ? (
        <div className="space-y-6">
          <div className="lab-grid-inputs">
            <div className="input-group">
              <label>Absorbance at 663 nm (A₆₆₃)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={a663}
                onChange={(e) => setA663(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label>Absorbance at 647 nm (A₆₄₇)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={a647}
                onChange={(e) => setA647(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label>Absorbance at 470 nm (A₄₇₀ - Carotenoids)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={a470}
                onChange={(e) => setA470(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label>{t('pigmentCalculator.extractVolume')} (V_e, mL)</label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={extractVol}
                onChange={(e) => setExtractVol(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label>{t('pigmentCalculator.cultureVolume')} (V_s, mL)</label>
              <input
                type="number"
                step="1"
                min="1"
                value={cultureVol}
                onChange={(e) => setCultureVol(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label>{t('pigmentCalculator.biomassWeight')} (Dry Weight, mg)</label>
              <input
                type="number"
                step="1"
                min="0"
                value={dryWeightMg}
                onChange={(e) => setDryWeightMg(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Results Matrix */}
          <div className="lab-results-matrix">
            <div className="result-metric-card primary">
              <span className="metric-label">{t('pigmentCalculator.chlA')} (Extract)</span>
              <div className="metric-value">
                {'chla_extract' in results ? results.chla_extract : '--'}{' '}
                <small>μg/mL</small>
              </div>
              <div className="metric-sub-badge">
                {'chla_culture' in results ? `${results.chla_culture} mg/L in culture` : ''}
              </div>
            </div>

            <div className="result-metric-card">
              <span className="metric-label">{t('pigmentCalculator.chlB')} (Extract)</span>
              <div className="metric-value">
                {'chlb_extract' in results ? results.chlb_extract : '--'}{' '}
                <small>μg/mL</small>
              </div>
              <div className="metric-sub-badge">
                Ratio Chl a/b: {'ratioAb' in results ? results.ratioAb : '--'}
              </div>
            </div>

            <div className="result-metric-card">
              <span className="metric-label">{t('pigmentCalculator.carotenoids')}</span>
              <div className="metric-value">
                {'car_extract' in results ? results.car_extract : '--'}{' '}
                <small>μg/mL</small>
              </div>
              <div className="metric-sub-badge">
                {'car_culture' in results ? `${results.car_culture} mg/L in culture` : ''}
              </div>
            </div>

            <div className="result-metric-card accent">
              <span className="metric-label">Specific Cell Content</span>
              <div className="metric-value">
                {'chla_mg_g' in results ? results.chla_mg_g : '--'}{' '}
                <small>mg Chl a / g DW</small>
              </div>
              <div className="metric-sub-badge">
                {'car_mg_g' in results ? `${results.car_mg_g} mg Car / g DW` : ''}
              </div>
            </div>
          </div>

          <div className="lab-formula-card">
            <span className="formula-title">Lichtenthaler Spectrophotometric Formula:</span>
            <code>
              Chl a = 12.25·A₆₆₃ - 2.79·A₆₄₇ | Chl b = 21.50·A₆₄₇ - 5.10·A₆₆₃ | Car = (1000·A₄₇₀ - 1.82·Chla - 85.02·Chlb)/198
            </code>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="lab-grid-inputs">
            <div className="input-group">
              <label>A₆₂₀ (C-Phycocyanin Peak)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={a620}
                onChange={(e) => setA620(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label>A₆₅₂ (Allophycocyanin Peak)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={a652}
                onChange={(e) => setA652(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label>A₅₆₅ (Phycoerythrin Peak)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={a565}
                onChange={(e) => setA565(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label>A₂₈₀ (Total Protein Peak)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={a280}
                onChange={(e) => setA280(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label>{t('pigmentCalculator.extractVolume')} (Buffer, mL)</label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={extractVol}
                onChange={(e) => setExtractVol(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label>Spirulina Biomass Dry Weight (mg)</label>
              <input
                type="number"
                step="1"
                min="0"
                value={dryWeightMg}
                onChange={(e) => setDryWeightMg(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Results Matrix for Phycocyanin */}
          <div className="lab-results-matrix">
            <div className="result-metric-card primary">
              <span className="metric-label">{t('pigmentCalculator.cpc')}</span>
              <div className="metric-value">
                {'cpc' in results ? results.cpc : '--'}{' '}
                <small>mg/mL</small>
              </div>
              <div className="metric-sub-badge">
                Yield: {'cpcYieldGrams' in results ? `${results.cpcYieldGrams} g` : ''}
              </div>
            </div>

            <div className="result-metric-card">
              <span className="metric-label">{t('pigmentCalculator.apc')}</span>
              <div className="metric-value">
                {'apc' in results ? results.apc : '--'}{' '}
                <small>mg/mL</small>
              </div>
              <div className="metric-sub-badge">Allophycocyanin</div>
            </div>

            <div className="result-metric-card">
              <span className="metric-label">{t('pigmentCalculator.pe')}</span>
              <div className="metric-value">
                {'pe' in results ? results.pe : '--'}{' '}
                <small>mg/mL</small>
              </div>
              <div className="metric-sub-badge">Phycoerythrin</div>
            </div>

            <div className="result-metric-card accent">
              <span className="metric-label">
                <Award size={14} /> {t('pigmentCalculator.purityRatio')}
              </span>
              <div className="metric-value">
                {'purityRatio' in results ? results.purityRatio : '--'}
              </div>
              <div
                className="metric-sub-badge"
                style={{ color: 'gradeColor' in results ? (results.gradeColor as string) : undefined }}
              >
                {'purityGrade' in results ? (results.purityGrade as string) : ''}
              </div>
            </div>
          </div>

          <div className="lab-formula-card">
            <span className="formula-title">Bennett & Bogorad (1973) Phycobiliprotein Equations:</span>
            <code>
              CPC (mg/mL) = (A₆₂₀ - 0.474·A₆₅₂) / 5.34 | APC = (A₆₅₂ - 0.208·A₆₂₀) / 5.09 | Purity Index = A₆₂₀ / A₂₈₀
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
