import * as React from 'react';
import { DayCell } from './DayCell';
import { DayContextMenu } from './DayContextMenu';
import { addDays, dayKey, isSameDay, MONTHS, WEEKDAYS_LONG } from '../../lib/date';
import type { Category, DayMap } from '../../lib/types';

type Props = {
  weekStart: Date;
  days: DayMap;
  categories: Category[];
  categoriesById: Record<string, Category>;
  onPaint: (key: string) => void;
  onPaintPointerDown: (e: React.PointerEvent<HTMLButtonElement>, key: string) => void;
  onAssign: (key: string, categoryId: string | null) => void;
  today: Date;
  fullWidth?: boolean;
};

export function WeekView({ weekStart, days, categories, categoriesById, onPaint, onPaintPointerDown, onAssign, today, fullWidth = false }: Props) {
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const start = weekDates[0]!;
  const end = weekDates[6]!;
  const sameMonth = start.getMonth() === end.getMonth();
  const label = sameMonth
    ? `${MONTHS[start.getMonth()]} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`
    : `${MONTHS[start.getMonth()]} ${start.getDate()} – ${MONTHS[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;

  return (
    <div className={`mx-auto w-full ${fullWidth ? '' : 'max-w-[56.25rem]'}`}>
      <h2 className="px-1 mb-3 text-lg font-semibold tracking-tight">{label}</h2>
      <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-2 px-0.5">
        {weekDates.map((d, i) => (
          <div key={i} className="text-center text-[10px] sm:text-xs uppercase tracking-wider text-[var(--color-muted)]">
            {WEEKDAYS_LONG[d.getDay()]}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {weekDates.map((d) => {
          const k = dayKey(d.getFullYear(), d.getMonth(), d.getDate());
          const catId = days[k] ?? null;
          const color = catId ? categoriesById[catId]?.color : null;
          return (
            <DayContextMenu
              key={k}
              categories={categories}
              currentCategoryId={catId}
              onAssign={(id) => onAssign(k, id)}
            >
              <DayCell
                day={d.getDate()}
                inCurrentMonth
                isToday={isSameDay(d, today)}
                color={color}
                size="lg"
                data-day-key={k}
                onClick={() => onPaint(k)}
                onPointerDown={(e) => onPaintPointerDown(e, k)}
              />
            </DayContextMenu>
          );
        })}
      </div>
    </div>
  );
}
