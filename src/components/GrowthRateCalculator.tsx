import { useMemo, useState } from 'react';

type GrowthRateCalculatorProps = {
  className?: string;
};

export default function GrowthRateCalculator({ className = '' }: GrowthRateCalculatorProps) {
  const [initialValue, setInitialValue] = useState('1');
  const [finalValue, setFinalValue] = useState('2');
  const [days, setDays] = useState('7');

  const growthRate = useMemo(() => {
    const initial = Number(initialValue);
    const final = Number(finalValue);
    const duration = Number(days);
    if (!Number.isFinite(initial) || !Number.isFinite(final) || !Number.isFinite(duration) || initial <= 0 || final <= 0 || duration <= 0) {
      return null;
    }
    return (Math.log(final / initial) / duration) * 100;
  }, [initialValue, finalValue, days]);

  return (
    <section className={className} aria-labelledby="growth-rate-calculator-title">
      <h2 id="growth-rate-calculator-title">Growth Rate Calculator</h2>
      <div>
        <label>
          Initial biomass
          <input type="number" min="0" step="any" value={initialValue} onChange={(event) => setInitialValue(event.target.value)} />
        </label>
        <label>
          Final biomass
          <input type="number" min="0" step="any" value={finalValue} onChange={(event) => setFinalValue(event.target.value)} />
        </label>
        <label>
          Duration (days)
          <input type="number" min="0" step="any" value={days} onChange={(event) => setDays(event.target.value)} />
        </label>
      </div>
      <p aria-live="polite">
        Specific growth rate:{' '}
        {growthRate === null ? 'Enter positive values to calculate.' : `${growthRate.toFixed(2)}% per day`}
      </p>
    </section>
  );
}
