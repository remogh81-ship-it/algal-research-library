import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { Beaker, BookOpen, CheckCircle, Droplets, Info } from 'lucide-react';

interface MediaRecipe {
  id: string;
  name: string;
  targetAlgae: string;
  targetPh: string;
  components: Array<{ name: string; amountPerLiter: number; unit: 'g/L' | 'mg/L' | 'mL/L' }>;
  instructions: string;
}

const ALGAE_MEDIA_RECIPES: MediaRecipe[] = [
  {
    id: 'bg11',
    name: 'BG-11 Medium (Stanier et al., 1971)',
    targetAlgae: 'Cyanobacteria & freshwater green microalgae',
    targetPh: '7.1 - 7.5 (Adjust with 1M NaOH or HCl)',
    components: [
      { name: 'Sodium Nitrate (NaNO₃)', amountPerLiter: 1.5, unit: 'g/L' },
      { name: 'Dipotassium Hydrogen Phosphate (K₂HPO₄)', amountPerLiter: 0.04, unit: 'g/L' },
      { name: 'Magnesium Sulfate Heptahydrate (MgSO₄·7H₂O)', amountPerLiter: 0.075, unit: 'g/L' },
      { name: 'Calcium Chloride Dihydrate (CaCl₂·2H₂O)', amountPerLiter: 0.036, unit: 'g/L' },
      { name: 'Citric Acid (C₆H₈O₇)', amountPerLiter: 0.006, unit: 'g/L' },
      { name: 'Ferric Ammonium Citrate', amountPerLiter: 0.006, unit: 'g/L' },
      { name: 'EDTA Disodium Salt (Na₂EDTA)', amountPerLiter: 0.001, unit: 'g/L' },
      { name: 'Sodium Carbonate (Na₂CO₃)', amountPerLiter: 0.02, unit: 'g/L' },
      { name: 'Trace Metal Mix A5 Solution', amountPerLiter: 1.0, unit: 'mL/L' },
    ],
    instructions: 'Dissolve salts in 900 mL distilled water. Adjust pH to 7.2. Top up to 1 L. Autoclave at 121°C for 20 minutes.',
  },
  {
    id: 'zarrouk',
    name: "Zarrouk's Medium (Zarrouk, 1966)",
    targetAlgae: 'Arthrospira / Spirulina platensis (Alkaliphilic)',
    targetPh: '9.2 - 9.8 (High bicarbonate buffering)',
    components: [
      { name: 'Sodium Bicarbonate (NaHCO₃)', amountPerLiter: 16.8, unit: 'g/L' },
      { name: 'Sodium Nitrate (NaNO₃)', amountPerLiter: 2.5, unit: 'g/L' },
      { name: 'Potassium Sulfate (K₂SO₄)', amountPerLiter: 1.0, unit: 'g/L' },
      { name: 'Sodium Chloride (NaCl)', amountPerLiter: 1.0, unit: 'g/L' },
      { name: 'Dipotassium Hydrogen Phosphate (K₂HPO₄)', amountPerLiter: 0.5, unit: 'g/L' },
      { name: 'Magnesium Sulfate Heptahydrate (MgSO₄·7H₂O)', amountPerLiter: 0.2, unit: 'g/L' },
      { name: 'Calcium Chloride Dihydrate (CaCl₂·2H₂O)', amountPerLiter: 0.04, unit: 'g/L' },
      { name: 'Ferrous Sulfate Heptahydrate (FeSO₄·7H₂O)', amountPerLiter: 0.01, unit: 'g/L' },
      { name: 'EDTA Disodium Salt', amountPerLiter: 0.08, unit: 'g/L' },
      { name: 'Micronutrient A6 Solution', amountPerLiter: 1.0, unit: 'mL/L' },
    ],
    instructions: 'Autoclave sodium bicarbonate separately or add after cooling to prevent carbonate precipitation and CO₂ degassing.',
  },
  {
    id: 'bbm',
    name: "Bold's Basal Medium (BBM) (Bischoff & Bold, 1963)",
    targetAlgae: 'Chlorophyceae (Chlorella, Scenedesmus, Haematococcus)',
    targetPh: '6.6 - 6.8',
    components: [
      { name: 'Sodium Nitrate (NaNO₃)', amountPerLiter: 0.25, unit: 'g/L' },
      { name: 'Magnesium Sulfate Heptahydrate (MgSO₄·7H₂O)', amountPerLiter: 0.075, unit: 'g/L' },
      { name: 'Sodium Chloride (NaCl)', amountPerLiter: 0.025, unit: 'g/L' },
      { name: 'Dipotassium Hydrogen Phosphate (K₂HPO₄)', amountPerLiter: 0.075, unit: 'g/L' },
      { name: 'Potassium Dihydrogen Phosphate (KH₂PO₄)', amountPerLiter: 0.175, unit: 'g/L' },
      { name: 'Calcium Chloride Dihydrate (CaCl₂·2H₂O)', amountPerLiter: 0.025, unit: 'g/L' },
      { name: 'BBM Trace Elements & Iron Solution', amountPerLiter: 1.0, unit: 'mL/L' },
    ],
    instructions: 'Recommended for axenic cultures of green microalgae. Autoclave at 121°C for 15 min.',
  },
  {
    id: 'f2',
    name: 'Guillard f/2 Medium (Guillard & Ryther, 1962)',
    targetAlgae: 'Marine microalgae, Diatoms (Nannochloropsis, Phaeodactylum)',
    targetPh: '8.0 - 8.2 (Filtered natural seawater or artificial seawater base)',
    components: [
      { name: 'Sodium Nitrate (NaNO₃)', amountPerLiter: 0.075, unit: 'g/L' },
      { name: 'Sodium Dihydrogen Phosphate (NaH₂PO₄·H₂O)', amountPerLiter: 0.005, unit: 'g/L' },
      { name: 'Sodium Metasilicate (Na₂SiO₃·9H₂O - for Diatoms)', amountPerLiter: 0.03, unit: 'g/L' },
      { name: 'f/2 Trace Metal Stock Solution', amountPerLiter: 1.0, unit: 'mL/L' },
      { name: 'f/2 Vitamin Mix (Thiamine, Biotin, B₁₂)', amountPerLiter: 0.5, unit: 'mL/L' },
    ],
    instructions: 'Prepare in sterile filtered seawater (30-35 PSU salinity). Add vitamins filter-sterilized after autoclaving.',
  },
];

export default function NutrientDilutionCalculator() {
  const { t, language } = useI18n();
  const isRtl = language === 'ar';

  const [activeSubTab, setActiveSubTab] = useState<'solver' | 'recipes'>('solver');

  // Solver State
  const [c1, setC1] = useState<number>(1000);
  const [c2, setC2] = useState<number>(10);
  const [v2, setV2] = useState<number>(500); // mL
  const [unitConc, setUnitConc] = useState<'mg/L' | 'g/L' | 'mM' | 'fold'>('mg/L');
  const [unitVol, setUnitVol] = useState<'mL' | 'L'>('mL');

  // Recipe State
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('bg11');
  const [batchVolumeLiters, setBatchVolumeLiters] = useState<number>(10);

  // C1V1 = C2V2 Calculations
  const solverResults = useMemo(() => {
    if (c1 <= 0 || c2 <= 0 || v2 <= 0 || c2 > c1) {
      return { v1: 0, vDiluent: 0, dilutionFactor: 0, isValid: false };
    }
    const v1 = (c2 * v2) / c1;
    const vDiluent = v2 - v1;
    const dilutionFactor = c1 / c2;

    return {
      v1: Number(v1.toFixed(3)),
      vDiluent: Number(vDiluent.toFixed(3)),
      dilutionFactor: Number(dilutionFactor.toFixed(2)),
      isValid: true,
    };
  }, [c1, c2, v2]);

  const activeRecipe = useMemo(() => {
    return ALGAE_MEDIA_RECIPES.find((r) => r.id === selectedRecipeId) ?? ALGAE_MEDIA_RECIPES[0];
  }, [selectedRecipeId]);

  return (
    <div className="lab-card" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="lab-card-header">
        <div className="lab-title-group">
          <span className="lab-icon-badge"><Droplets size={20} /></span>
          <div>
            <h3>{t('dilutionCalculator.title')}</h3>
            <p className="lab-subtitle">{t('dilutionCalculator.subtitle')}</p>
          </div>
        </div>

        <div className="lab-mode-switch">
          <button
            type="button"
            className={`tab-pill ${activeSubTab === 'solver' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('solver')}
          >
            {t('dilutionCalculator.modeSolver')}
          </button>
          <button
            type="button"
            className={`tab-pill ${activeSubTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('recipes')}
          >
            {t('dilutionCalculator.modeRecipes')}
          </button>
        </div>
      </div>

      <p className="lab-desc">{t('dilutionCalculator.description')}</p>

      {activeSubTab === 'solver' ? (
        <div className="solver-section space-y-6">
          <div className="lab-grid-inputs">
            <div className="input-group">
              <label>
                {t('dilutionCalculator.c1Label')}{' '}
                <span className="unit-tag">({unitConc === 'fold' ? 'X' : unitConc})</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={c1}
                onChange={(e) => setC1(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label>
                {t('dilutionCalculator.c2Label')}{' '}
                <span className="unit-tag">({unitConc === 'fold' ? 'X' : unitConc})</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={c2}
                onChange={(e) => setC2(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <div className="label-with-toggle">
                <label>{t('dilutionCalculator.v2Label')}</label>
                <div className="mini-toggle">
                  <button
                    type="button"
                    className={unitVol === 'mL' ? 'active' : ''}
                    onClick={() => setUnitVol('mL')}
                  >
                    mL
                  </button>
                  <button
                    type="button"
                    className={unitVol === 'L' ? 'active' : ''}
                    onClick={() => setUnitVol('L')}
                  >
                    L
                  </button>
                </div>
              </div>
              <input
                type="number"
                step="1"
                min="0"
                value={v2}
                onChange={(e) => setV2(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-group">
              <label>Concentration Metric</label>
              <select
                value={unitConc}
                onChange={(e) => setUnitConc(e.target.value as any)}
                className="lab-select"
              >
                <option value="mg/L">mg/L (ppm)</option>
                <option value="g/L">g/L</option>
                <option value="mM">mM (Millimolar)</option>
                <option value="fold">Stock Factor (e.g. 1000X → 1X)</option>
              </select>
            </div>
          </div>

          {/* Results Matrix */}
          <div className="lab-results-matrix">
            <div className="result-metric-card primary">
              <span className="metric-label">{t('dilutionCalculator.v1Result')}</span>
              <div className="metric-value">
                {solverResults.isValid ? solverResults.v1 : '--'}{' '}
                <small>{unitVol}</small>
              </div>
              <div className="metric-sub-badge">Pipette / Dispense</div>
            </div>

            <div className="result-metric-card">
              <span className="metric-label">{t('dilutionCalculator.diluentResult')}</span>
              <div className="metric-value">
                {solverResults.isValid ? solverResults.vDiluent : '--'}{' '}
                <small>{unitVol}</small>
              </div>
              <div className="metric-sub-badge">Sterile Solvent</div>
            </div>

            <div className="result-metric-card accent">
              <span className="metric-label">{t('dilutionCalculator.dilutionFactor')}</span>
              <div className="metric-value">
                {solverResults.isValid ? `1 : ${solverResults.dilutionFactor}` : '--'}
                <small>({solverResults.dilutionFactor}X)</small>
              </div>
            </div>
          </div>

          <div className="lab-formula-card">
            <span className="formula-title">Governing Formula:</span>
            <code>C₁ · V₁ = C₂ · V₂  ⟹  V₁ = (C₂ · V₂) / C₁</code>
          </div>
        </div>
      ) : (
        <div className="recipes-section space-y-6">
          <div className="recipe-selector-row">
            <div className="input-group flex-1">
              <label>{t('dilutionCalculator.selectRecipe')}</label>
              <select
                value={selectedRecipeId}
                onChange={(e) => setSelectedRecipeId(e.target.value)}
                className="lab-select"
              >
                {ALGAE_MEDIA_RECIPES.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group" style={{ maxWidth: '240px' }}>
              <label>{t('dilutionCalculator.batchVolume')}</label>
              <input
                type="number"
                step="1"
                min="0.1"
                value={batchVolumeLiters}
                onChange={(e) => setBatchVolumeLiters(parseFloat(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Media Info Banner */}
          <div className="recipe-meta-banner">
            <div>
              <strong>Target Organism:</strong> {activeRecipe.targetAlgae}
            </div>
            <div>
              <strong>Optimum pH:</strong> {activeRecipe.targetPh}
            </div>
          </div>

          {/* Formulation Table */}
          <div className="lab-table-container">
            <table className="lab-table">
              <thead>
                <tr>
                  <th>{t('dilutionCalculator.component')}</th>
                  <th>{t('dilutionCalculator.standardFormula')}</th>
                  <th className="highlight-col">{t('dilutionCalculator.batchAmount')} ({batchVolumeLiters} L)</th>
                </tr>
              </thead>
              <tbody>
                {activeRecipe.components.map((comp, idx) => {
                  const total = comp.amountPerLiter * batchVolumeLiters;
                  const unitDisplay = comp.unit === 'g/L' ? 'g' : comp.unit === 'mg/L' ? 'mg' : 'mL';
                  return (
                    <tr key={idx}>
                      <td className="font-semibold">{comp.name}</td>
                      <td>
                        {comp.amountPerLiter} {comp.unit}
                      </td>
                      <td className="highlight-col font-bold">
                        {total >= 1000 && unitDisplay === 'g'
                          ? `${(total / 1000).toFixed(3)} kg`
                          : `${Number(total.toFixed(4))} ${unitDisplay}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="recipe-instructions-card">
            <div className="inst-title">
              <Info size={16} /> {t('dilutionCalculator.notes')}
            </div>
            <p>{activeRecipe.instructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}
