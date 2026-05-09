import { Button } from '../ui/button';
import { cn } from '../../lib/cn';
import type { ZoomLevel } from '../../lib/types';

type Props = {
  zoom: ZoomLevel;
  onZoom: (z: ZoomLevel) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

const zoomOptions: ZoomLevel[] = ['year', 'month', 'week'];

export function Toolbar({ zoom, onZoom, onPrev, onNext, onToday }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" onClick={onPrev} aria-label="Previous">
          <ChevronLeftIcon />
        </Button>
        <Button variant="outline" size="sm" onClick={onToday}>Today</Button>
        <Button variant="outline" size="icon" onClick={onNext} aria-label="Next">
          <ChevronRightIcon />
        </Button>
      </div>

      <div className="flex items-center rounded-lg border border-[var(--color-border)] p-0.5 bg-[var(--color-surface)]">
        {zoomOptions.map((z) => (
          <button
            key={z}
            onClick={() => onZoom(z)}
            className={cn(
              'h-7 px-3 text-xs rounded-md capitalize transition-colors',
              zoom === z
                ? 'bg-[var(--color-surface-2)] text-[var(--color-fg)]'
                : 'text-[var(--color-muted)] hover:text-[var(--color-fg)]',
            )}
          >
            {z}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
