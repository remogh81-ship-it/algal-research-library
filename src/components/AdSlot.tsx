import { SHOW_ADS } from '../config/ads';

type AdSlotProps = {
  variant?: 'leaderboard' | 'sidebar' | 'native';
};

export function AdSlot({ variant = 'leaderboard' }: AdSlotProps) {
  if (!SHOW_ADS) return null;

  return (
    <div className={`ad-slot ad-slot--${variant}`} role="complementary" aria-label="Advertisement">
      <span>إعلان / Advertisement</span>
    </div>
  );
}
