import React, { useState, useMemo } from 'react';

interface DataPoint {
  id: string;
  time: number;
  od: number;
}

export default function GrowthRateCalculator() {
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

  // Calculations
  const stats = useMemo(() => {
    const p1 = points.find((p) => p.id === startPointId);
    const p2 = points.find((p) => p.id === endPointId);

    if (!p1 || !p2 || p1.time >= p2.time || p1.od <= 0 || p2.od <= 0) {
      return { mu: 0, doublingTime: 0, isValid: false };
    }

    // mu = (ln(OD2) - ln(OD1)) / (t2 - t1)
    const mu = (Math.log(p2.od) - Math.log(p1.od)) / (p2.time - p1.time);
    // td = ln(2) / mu
    const doublingTime = mu > 0 ? Math.log(2) / mu : 0;

    return {
      mu: Number(mu.toFixed(4)),
      doublingTime: Number(doublingTime.toFixed(2)),
      isValid: true,
      t1: p1.time,
      t2: p2.time,
      od1: p1.od,
      od2: p2.od,
    };
  }, [points, startPointId, endPointId]);

  // Chart Rendering Helpers (SVG)
  const chartWidth = 500;
  const chartHeight = 250;
  const padding = 40;

  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => a.time - b.time);
  }, [points]);

  const maxTime = Math.max(...sortedPoints.map((p) => p.time), 1);
  const maxOd = Math.max(...sortedPoints.map((p) => p.od), 0.5) * 1.1;

  const getX = (t: number) => padding + (t / maxTime) * (chartWidth - padding * 2);
  const getY = (od: number) => chartHeight - padding - (od / maxOd) * (chartHeight - padding * 2);

  const svgPath = useMemo(() => {
    if (sortedPoints.length === 0) return '';
    return sortedPoints.reduce((acc, p, idx) => {
      const x = getX(p.time);
      const y = getY(p.od);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }, [sortedPoints, maxTime, maxOd]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900 text-slate-100 rounded-2xl shadow-xl border border-slate-800 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <span>🧪</span> حاسبة معدل نمو الطحالب (Specific Growth Rate)
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            حساب معدل النمو النوعي ($\mu$) وزمن المضاعفة ($t_d$) لإنماء الطحالب الدقيقة بالاعتماد على الكثافة الضوئية ($OD_{600}$).
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700 self-start">
          <button
            onClick={() => setTimeUnit('days')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              timeUnit === 'days' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            بالأيام (Days)
          </button>
          <button
            onClick={() => setTimeUnit('hours')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              timeUnit === 'hours' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            بالساعات (Hours)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Data Table Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-300">جدول القراءات المخبرية</h3>
            <button
              onClick={addPoint}
              className="px-2.5 py-1 text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-md border border-emerald-500/30 transition flex items-center gap-1"
            >
              <span>+</span> إضافة قراءة
            </button>
          </div>

          <div className="overflow-x-auto bg-slate-950/60 rounded-xl border border-slate-800">
            <table className="w-full text-xs text-right text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2.5">الزمن ({timeUnit === 'days' ? 'يوم' : 'ساعة'})</th>
                  <th className="p-2.5">الكثافة ($OD_{600}$)</th>
                  <th className="p-2.5 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {points.map((point) => (
                  <tr key={point.id} className="hover:bg-slate-800/30">
                    <td className="p-2">
                      <input
                        type="number"
                        value={point.time}
                        onChange={(e) => updatePoint(point.id, 'time', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:border-emerald-500 outline-none text-left dir-ltr"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.01"
                        value={point.od}
                        onChange={(e) => updatePoint(point.id, 'od', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:border-emerald-500 outline-none text-left dir-ltr"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => removePoint(point.id)}
                        className="text-rose-400 hover:text-rose-300 px-1 disabled:opacity-30"
                        disabled={points.length <= 2}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Exponential Phase Selectors */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300">تحديد مرحلة النمو اللوغاريتمي (Exponential Phase):</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">بداية الطور ($t_1$)</label>
                <select
                  value={startPointId}
                  onChange={(e) => setStartPointId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200"
                >
                  {points.map((p) => (
                    <option key={p.id} value={p.id}>
                      الزمن: {p.time} | OD: {p.od}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">نهاية الطور ($t_2$)</label>
                <select
                  value={endPointId}
                  onChange={(e) => setEndPointId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200"
                >
                  {points.map((p) => (
                    <option key={p.id} value={p.id}>
                      الزمن: {p.time} | OD: {p.od}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations & Chart */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Results Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <span className="text-xs text-emerald-400 font-medium block">معدل النمو النوعي ($\mu$)</span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1 dir-ltr text-right">
                {stats.isValid ? stats.mu : '--'}{' '}
                <span className="text-xs font-normal text-slate-400">
                  {timeUnit === 'days' ? 'day⁻¹' : 'h⁻¹'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
              <span className="text-xs text-cyan-400 font-medium block">زمن المضاعفة ($t_d$)</span>
              <div className="text-3xl font-extrabold text-cyan-400 mt-1 dir-ltr text-right">
                {stats.isValid ? stats.doublingTime : '--'}{' '}
                <span className="text-xs font-normal text-slate-400">
                  {timeUnit === 'days' ? 'أيام' : 'ساعات'}
                </span>
              </div>
            </div>
          </div>

          {/* Growth Curve Chart */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 relative">
            <h4 className="text-xs font-semibold text-slate-400 mb-2">منحنى النمو الحيوي (Growth Curve)</h4>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
              {/* Axes */}
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#334155" strokeWidth="1" />
              <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#334155" strokeWidth="1" />

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75].map((ratio, idx) => {
                const y = chartHeight - padding - ratio * (chartHeight - padding * 2);
                return (
                  <line key={idx} x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                );
              })}

              {/* Curve Line */}
              <path d={svgPath} fill="none" stroke="#10b981" strokeWidth="2.5" />

              {/* Data Points */}
              {sortedPoints.map((p) => {
                const cx = getX(p.time);
                const cy = getY(p.od);
                const isSelected = p.id === startPointId || p.id === endPointId;
                return (
                  <g key={p.id}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? '#06b6d4' : '#10b981'}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    <text x={cx} y={cy - 10} fill="#94a3b8" fontSize="10" textAnchor="middle">
                      {p.od}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Axis Labels */}
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-8">
              <span>0</span>
              <span>الزمن ({timeUnit === 'days' ? 'أيام' : 'ساعات'})</span>
              <span>{maxTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
