import { MonthGrid } from './MonthGrid';
import { MONTHS } from '../../lib/date';
import type { Category, DayMap } from '../../lib/types';

type Props = {
  year: number;
  monthIdx: number;
  days: DayMap;
  categories: Category[];
  categoriesById: Record<string, Category>;
  onPaint: (key: string) => void;
  onAssign: (key: string, categoryId: string | null) => void;
  today: Date;
  fullWidth?: boolean;
};

export function MonthView({
  year, monthIdx, days, categories, categoriesById, onPaint, onAssign, today, fullWidth = false,
}: Props) {
  return (
    <div className={`mx-auto w-full ${fullWidth ? '' : 'max-w-[40rem]'}`}>
      <h2 className="px-1 mb-3 text-lg font-semibold tracking-tight">{MONTHS[monthIdx]} {year}</h2>
      <MonthGrid
        year={year}
        monthIdx={monthIdx}
        days={days}
        categories={categories}
        categoriesById={categoriesById}
        onPaint={onPaint}
        onAssign={onAssign}
        today={today}
        size="md"
      />
    </div>
  );
}
