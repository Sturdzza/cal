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
  const ringWidth = size === 'sm' ? 3 : size === 'lg' ? 6 : 4;
  const innerRing = size === 'sm' ? 1 : size === 'lg' ? 2 : 1.5;
  const dark = filled && isDarkColor(color!);
  const filledStyle: React.CSSProperties | undefined = filled
    ? {
        background: color!,
        color: dark
          ? `color-mix(in srgb, ${color} 25%, white)`
          : `color-mix(in srgb, ${color} 20%, black)`,
        border: `${ringWidth}px solid ${
          dark
            ? `color-mix(in srgb, ${color} 45%, white)`
            : `color-mix(in srgb, ${color} 35%, black)`
        }`,
        boxShadow: `inset 0 0 0 ${innerRing}px ${
          dark
            ? `color-mix(in srgb, ${color} 60%, black)`
            : `color-mix(in srgb, ${color} 75%, white)`
        }`,
        boxSizing: 'border-box',
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
        'aspect-square w-full flex items-center justify-center select-none',
        'transition-transform active:scale-95',
        sizeClasses[size],
        filled ? 'font-bold' : 'font-medium',
        !inCurrentMonth && 'text-transparent pointer-events-none',
        inCurrentMonth && !filled && 'bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:bg-[var(--color-border)]',
        isToday && inCurrentMonth && !filled && 'ring-1 ring-[var(--color-accent)] text-[var(--color-fg)]',
        isToday && filled && 'outline outline-2 outline-offset-2 outline-[var(--color-fg)]/30',
        className,
      )}
      aria-label={`Day ${day}`}
      {...rest}
    >
      {day}
    </button>
  );
});
