import { MonthGrid } from './MonthGrid';
import { SHORT_MONTHS } from '../../lib/date';
import type { Category, DayMap } from '../../lib/types';

type Props = {
  year: number;
  days: DayMap;
  categoriesById: Record<string, Category>;
  onPaint: (key: string) => void;
  onMonthClick: (monthIdx: number) => void;
  today: Date;
  fullWidth?: boolean;
};

export function YearView({ year, days, categoriesById, onPaint, onMonthClick, today, fullWidth = false }: Props) {
  return (
    <div className={`mx-auto w-full ${fullWidth ? '' : 'max-w-[68.75rem]'}`}>
      <h2 className="px-1 mb-3 text-lg font-semibold tracking-tight">{year}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {SHORT_MONTHS.map((m, i) => (
          <div key={m} className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-2 sm:p-3">
            <button
              type="button"
              onClick={() => onMonthClick(i)}
              className="w-full text-left text-sm font-medium mb-2 px-1 hover:text-[var(--color-accent)]"
            >
              {m}
            </button>
            <MonthGrid
              year={year}
              monthIdx={i}
              days={days}
              categoriesById={categoriesById}
              onPaint={onPaint}
              today={today}
              size="sm"
              gap="sm"
              showWeekdays={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
