import { MonthGrid } from './MonthGrid';
import { MONTHS } from '../../lib/date';
import type { Category, DayMap } from '../../lib/types';

type Props = {
  year: number;
  monthIdx: number;
  days: DayMap;
  categoriesById: Record<string, Category>;
  onPaint: (key: string) => void;
  today: Date;
  fullWidth?: boolean;
};

export function MonthView({ year, monthIdx, days, categoriesById, onPaint, today, fullWidth = false }: Props) {
  return (
    <div className={`mx-auto w-full ${fullWidth ? '' : 'max-w-[40rem]'}`}>
      <h2 className="px-1 mb-3 text-lg font-semibold tracking-tight">{MONTHS[monthIdx]} {year}</h2>
      <MonthGrid
        year={year}
        monthIdx={monthIdx}
        days={days}
        categoriesById={categoriesById}
        onPaint={onPaint}
        today={today}
        size="md"
      />
    </div>
  );
}
