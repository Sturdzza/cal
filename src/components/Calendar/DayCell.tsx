import { cn } from '../../lib/cn';

type Props = {
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  color?: string | null;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
};

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-[10px] rounded-md',
  md: 'text-sm rounded-lg sm:text-base sm:rounded-xl',
  lg: 'text-2xl rounded-2xl sm:text-3xl',
};

export function DayCell({ day, inCurrentMonth, isToday, color, size = 'md', onClick }: Props) {
  const filled = !!color && inCurrentMonth;
  const ringWidth = size === 'sm' ? 3 : size === 'lg' ? 6 : 4;
  const innerRing = size === 'sm' ? 1 : size === 'lg' ? 2 : 1.5;
  const filledStyle: React.CSSProperties | undefined = filled
    ? {
        background: color!,
        color: `color-mix(in srgb, ${color} 20%, black)`,
        border: `${ringWidth}px solid color-mix(in srgb, ${color} 35%, black)`,
        boxShadow: `inset 0 0 0 ${innerRing}px color-mix(in srgb, ${color} 75%, white)`,
        boxSizing: 'border-box',
      }
    : undefined;

  return (
    <button
      type="button"
      data-day-tile
      onClick={onClick}
      disabled={!inCurrentMonth}
      style={filledStyle}
      className={cn(
        'aspect-square w-full flex items-center justify-center select-none',
        'transition-transform active:scale-95',
        sizeClasses[size],
        filled ? 'font-bold' : 'font-medium',
        !inCurrentMonth && 'text-transparent pointer-events-none',
        inCurrentMonth && !filled && 'bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:bg-[var(--color-border)]',
        isToday && inCurrentMonth && !filled && 'ring-1 ring-[var(--color-accent)] text-[var(--color-fg)]',
        isToday && filled && 'outline outline-2 outline-offset-2 outline-[var(--color-fg)]/30',
      )}
      aria-label={`Day ${day}`}
    >
      {day}
    </button>
  );
}
