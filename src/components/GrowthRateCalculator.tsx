import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { LineChart, Plus, Trash2 } from 'lucide-react';

interface DataPoint {
  id: string;
  time: number;
  od: number;
}

export default function GrowthRateCalculator() {
  const { t, language } = useI18n();
  const isRtl = language === 'ar';

  const [timeUnit, setTimeUnit] = useState<'days' | 'hours'>('days');
  const [points, setPoints] = useState<DataPoint[]>([
    { id: '1', time: 0, od: 0.10 },
    { id: '2', time: 2, od: 0.25 },
    { id: '3', time: 4, od: 0.68 },
    { id: '4', time: 6, od: 1.45 },
    { id: '5', time: 8, od: 1.82 },
  ]);

  const [startPointId, setStartPointId] = useState<string>('2');
  const [endPointId, setEndPointId] = useState<string>('4');

  const addPoint = () => {
    const lastPoint = points[points.length - 1];
    const newTime = lastPoint ? lastPoint.time + 2 : 0;
    const newOd = lastPoint ? Number((lastPoint.od * 1.5).toFixed(2)) : 0.1;
    const newId = Date.now().toString();
    setPoints([...points, { id: newId, time: newTime, od: newOd }]);
  };

  const removePoint = (id: string) => {
    if (points.length <= 2) return;
    setPoints(points.filter((p) => p.id !== id));
  };

  const updatePoint = (id: string, field: 'time' | 'od', value: number) => {
    setPoints(
      points.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const stats = useMemo(() => {
    const p1 = points.find((p) => p.id === startPointId);
    const p2 = points.find((p) => p.id === endPointId);

    if (!p1 || !p2 || p1.time >= p2.time || p1.od <= 0 || p2.od <= 0) {
      return { mu: 0, doublingTime: 0, isValid: false };
    }

    const mu = (Math.log(p2.od) - Math.log(p1.od)) / (p2.time - p1.time);
    const doublingTime = mu > 0 ? Math.log(2) / mu : 0;

    return {
      mu: Number(mu.toFixed(4)),
      doublingTime: Number(doublingTime.toFixed(2)),
      isValid: true,
    };
  }, [points, startPointId, endPointId]);

  const chartWidth = 500;
  const chartHeight = 250;
  const padding = 40;

  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => a.time - b.time);
  }, [points]);

  const maxTime = Math.max(...sortedPoints.map((p) => p.time), 1);
  const maxOd = Math.max(...sortedPoints.map((p) => p.od), 0.5) * 1.15;

  const getX = (time: number) => padding + (time / maxTime) * (chartWidth - padding * 2);
  const getY = (od: number) => chartHeight - padding - (od / maxOd) * (chartHeight - padding * 2);

  const svgPath = useMemo(() => {
    if (sortedPoints.length === 0) return '';
    return sortedPoints.reduce((acc, p, idx) => {
      const x = padding + (p.time / maxTime) * (chartWidth - padding * 2);
      const y = chartHeight - padding - (p.od / maxOd) * (chartHeight - padding * 2);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }, [sortedPoints, maxTime, maxOd]);

  return (
    <div className="lab-card" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="lab-card-header">
        <div className="lab-title-group">
          <span className="lab-icon-badge"><LineChart size={20} /></span>
          <div>
            <h3>{t('growthCalculator.title')}</h3>
            <p className="lab-subtitle">{t('growthCalculator.subtitle')}</p>
          </div>
        </div>
        <div className="mini-toggle">
          <button
            type="button"
            className={timeUnit === 'days' ? 'active' : ''}
            onClick={() => setTimeUnit('days')}
          >
            {t('growthCalculator.unitDays')}
          </button>
          <button
            type="button"
            className={timeUnit === 'hours' ? 'active' : ''}
            onClick={() => setTimeUnit('hours')}
          >
            {t('growthCalculator.unitHours')}
          </button>
        </div>
      </div>

      <p className="lab-desc">{t('growthCalculator.description')}</p>

      <div className="growth-calc-layout">
        {/* Left Column: Data Table & Phase Selectors */}
        <div className="growth-table-column">
          <div className="table-header-action">
            <span className="section-subtitle">{t('growthCalculator.tableTitle')}</span>
            <button type="button" onClick={addPoint} className="small-action-btn">
              <Plus size={14} /> {t('growthCalculator.addPoint')}
            </button>
          </div>

          <div className="lab-table-container">
            <table className="lab-table">
              <thead>
                <tr>
                  <th>
                    {t('growthCalculator.colTime')} ({timeUnit === 'days' ? t('growthCalculator.unitDaysText') : t('growthCalculator.unitHoursText')})
                  </th>
                  <th>{t('growthCalculator.colOd')}</th>
                  <th style={{ width: '40px', textAlign: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr key={point.id}>
                    <td>
                      <input
                        type="number"
                        value={point.time}
                        onChange={(e) => updatePoint(point.id, 'time', parseFloat(e.target.value) || 0)}
                        className="table-input"
                        dir="ltr"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={point.od}
                        onChange={(e) => updatePoint(point.id, 'od', parseFloat(e.target.value) || 0)}
                        className="table-input"
                        dir="ltr"
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => removePoint(point.id)}
                        className="table-del-btn"
                        disabled={points.length <= 2}
                        title={t('growthCalculator.colDelete')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Exponential Phase Selection Box */}
          <div className="phase-selection-card">
            <span className="phase-title">{t('growthCalculator.phaseSelection')}</span>
            <div className="phase-grid">
              <div className="input-group">
                <label>{t('growthCalculator.startPhase')}</label>
                <select
                  value={startPointId}
                  onChange={(e) => setStartPointId(e.target.value)}
                  className="lab-select"
                >
                  {points.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t('growthCalculator.colTime')}: {p.time} | OD: {p.od}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>{t('growthCalculator.endPhase')}</label>
                <select
                  value={endPointId}
                  onChange={(e) => setEndPointId(e.target.value)}
                  className="lab-select"
                >
                  {points.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t('growthCalculator.colTime')}: {p.time} | OD: {p.od}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Metrics & SVG Chart */}
        <div className="growth-chart-column">
          <div className="lab-results-matrix two-col">
            <div className="result-metric-card primary">
              <span className="metric-label">{t('growthCalculator.specificRate')}</span>
              <div className="metric-value">
                {stats.isValid ? stats.mu : '--'}{' '}
                <small>
                  {timeUnit === 'days' ? t('growthCalculator.unitDayInverse') : t('growthCalculator.unitHourInverse')}
                </small>
              </div>
              <div className="metric-sub-badge">μ (Specific Growth Rate)</div>
            </div>

            <div className="result-metric-card accent">
              <span className="metric-label">{t('growthCalculator.doublingTime')}</span>
              <div className="metric-value">
                {stats.isValid ? stats.doublingTime : '--'}{' '}
                <small>
                  {timeUnit === 'days' ? t('growthCalculator.unitDaysText') : t('growthCalculator.unitHoursText')}
                </small>
              </div>
              <div className="metric-sub-badge">t_d = ln(2) / μ</div>
            </div>
          </div>

          {/* SVG Growth Curve */}
          <div className="chart-wrapper">
            <div className="chart-header">
              <span>{t('growthCalculator.chartTitle')}</span>
              <span className="chart-legend">
                <span className="legend-dot selected"></span> Phase Points
                <span className="legend-dot normal" style={{ marginLeft: '12px' }}></span> Other
              </span>
            </div>

            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="growth-svg">
              {/* Axes */}
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#64748b" strokeWidth="1.5" />
              <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#64748b" strokeWidth="1.5" />

              {/* Gridlines */}
              {[0.25, 0.5, 0.75].map((ratio, idx) => {
                const y = chartHeight - padding - ratio * (chartHeight - padding * 2);
                return (
                  <line key={`grid-${idx}`} x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#94a3b833" strokeDasharray="3 3" />
                );
              })}

              {/* Curve Line */}
              <path d={svgPath} fill="none" stroke="#0d7c78" strokeWidth="2.5" />

              {/* Data Points */}
              {sortedPoints.map((p) => {
                const cx = getX(p.time);
                const cy = getY(p.od);
                const isSelected = p.id === startPointId || p.id === endPointId;
                return (
                  <g key={`pt-${p.id}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? '#0284c7' : '#0d7c78'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text x={cx} y={cy - 10} fill="#64748b" fontSize="10" fontWeight="600" textAnchor="middle">
                      {p.od}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="chart-x-labels">
              <span>0</span>
              <span>{t('growthCalculator.timeLabel')} ({timeUnit === 'days' ? t('growthCalculator.unitDaysText') : t('growthCalculator.unitHoursText')})</span>
              <span>{maxTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Formula Card */}
      <div className="lab-formula-card">
        <span className="formula-title">Kinetic Equations:</span>
        <code>
          μ = [ln(OD₂) - ln(OD₁)] / (t₂ - t₁)  |  t_d = ln(2) / μ = 0.693 / μ
        </code>
      </div>
    </div>
  );
}