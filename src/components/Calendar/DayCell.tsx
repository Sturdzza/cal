import * as React from 'react';
import { cn } from '../../lib/cn';
import { isDarkColor } from '../../lib/color';

type Props = {
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  color?: string | null;
  size?: 'sm' | 'md' | 'lg';
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>;

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-[10px] rounded-md',
  md: 'text-sm rounded-lg sm:text-base sm:rounded-xl',
  lg: 'text-2xl rounded-2xl sm:text-3xl',
};

export const DayCell = React.forwardRef<HTMLButtonElement, Props>(function DayCell(
  { day, inCurrentMonth, isToday, color, size = 'md', className, style, ...rest },
  ref,
) {
  const filled = !!color && inCurrentMonth;
  const dark = filled && isDarkColor(color!);
  const filledStyle: React.CSSProperties | undefined = filled
    ? {
        background: color!,
        color: dark
          ? `color-mix(in srgb, ${color} 25%, white)`
          : `color-mix(in srgb, ${color} 20%, black)`,
      }
    : undefined;

  return (
    <button
      ref={ref}
      type="button"
      data-day-tile
      disabled={!inCurrentMonth}
      style={{ ...filledStyle, ...style }}
      className={cn(
        'aspect-square w-full flex flex-col items-center justify-center gap-[0.1em] select-none focus:outline-none',
        sizeClasses[size],
        filled ? 'font-bold' : 'font-medium',
        !inCurrentMonth && 'text-transparent pointer-events-none',
        inCurrentMonth && !filled && 'bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:bg-[var(--color-border)]',
        className,
      )}
      aria-label={`Day ${day}`}
      {...rest}
    >
      <span>{day}</span>
      {isToday && inCurrentMonth && (
        <span
          aria-hidden
          className="block rounded-full bg-current"
          style={{ height: '0.3em', width: '0.3em' }}
        />
      )}
    </button>
  );
});
