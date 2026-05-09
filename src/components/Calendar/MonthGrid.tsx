import { DayCell } from './DayCell';
import { DayContextMenu } from './DayContextMenu';
import { dayKey, daysInMonth, firstWeekdayOfMonth, WEEKDAYS } from '../../lib/date';
import type { Category, DayMap } from '../../lib/types';

type Props = {
  year: number;
  monthIdx: number;
  days: DayMap;
  categories: Category[];
  categoriesById: Record<string, Category>;
  onPaint: (key: string) => void;
  onAssign: (key: string, categoryId: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
  showWeekdays?: boolean;
  today: Date;
  gap?: 'sm' | 'md';
};

export function MonthGrid({
  year, monthIdx, days, categories, categoriesById, onPaint, onAssign,
  size = 'md', showWeekdays = true, today, gap = 'md',
}: Props) {
  const total = daysInMonth(year, monthIdx);
  const offset = firstWeekdayOfMonth(year, monthIdx);
  const cells: Array<{ day: number; inMonth: boolean }> = [];
  for (let i = 0; i < offset; i++) cells.push({ day: 0, inMonth: false });
  for (let d = 1; d <= total; d++) cells.push({ day: d, inMonth: true });
  while (cells.length % 7 !== 0) cells.push({ day: 0, inMonth: false });

  const gapCls = gap === 'sm' ? 'gap-1' : 'gap-1.5 sm:gap-2';

  return (
    <div className="w-full">
      {showWeekdays && (
        <div className={`grid grid-cols-7 ${gapCls} mb-1.5 px-0.5`}>
          {WEEKDAYS.map((w, i) => (
            <div
              key={i}
              className={
                size === 'sm'
                  ? 'text-center text-[8px] uppercase tracking-wide text-[var(--color-muted)]'
                  : 'text-center text-[10px] sm:text-xs uppercase tracking-wider text-[var(--color-muted)]'
              }
            >
              {w}
            </div>
          ))}
        </div>
      )}
      <div className={`grid grid-cols-7 ${gapCls}`}>
        {cells.map((c, idx) => {
          if (!c.inMonth) {
            return <div key={`e-${idx}`} aria-hidden className="aspect-square" />;
          }
          const k = dayKey(year, monthIdx, c.day);
          const catId = days[k] ?? null;
          const color = catId ? categoriesById[catId]?.color : null;
          const isToday = today.getFullYear() === year
            && today.getMonth() === monthIdx
            && today.getDate() === c.day;
          return (
            <DayContextMenu
              key={k}
              categories={categories}
              currentCategoryId={catId}
              onAssign={(id) => onAssign(k, id)}
            >
              <DayCell
                day={c.day}
                inCurrentMonth
                isToday={isToday}
                color={color}
                size={size}
                onClick={() => onPaint(k)}
              />
            </DayContextMenu>
          );
        })}
      </div>
    </div>
  );
}
