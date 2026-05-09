import { Button } from '../ui/button';
import { cn } from '../../lib/cn';
import type { ZoomLevel } from '../../lib/types';

type Props = {
  zoom: ZoomLevel;
  onZoom: (z: ZoomLevel) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  scale: number;
  onScale: (s: number) => void;
  fullWidth: boolean;
  onFullWidth: (v: boolean) => void;
};

const zoomOptions: ZoomLevel[] = ['year', 'month', 'week'];

export const SCALE_MIN = 0.6;
export const SCALE_MAX = 1.8;

export function Toolbar({ zoom, onZoom, onPrev, onNext, onToday, scale, onScale, fullWidth, onFullWidth }: Props) {
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

      <ScaleSlider value={scale} onChange={onScale} fullWidth={fullWidth} onFullWidth={onFullWidth} />
    </div>
  );
}

function ScaleSlider({
  value, onChange, fullWidth, onFullWidth,
}: {
  value: number;
  onChange: (v: number) => void;
  fullWidth: boolean;
  onFullWidth: (v: boolean) => void;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 h-9 px-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] transition-opacity',
        fullWidth && 'opacity-40',
      )}
      title={fullWidth ? 'Scale is disabled while Full width is on — click the wide icon to turn it off' : `Scale ${Math.round(value * 100)}%`}
    >
      <SmallSquareIcon />
      <input
        type="range"
        min={SCALE_MIN}
        max={SCALE_MAX}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onDoubleClick={() => onChange(1)}
        disabled={fullWidth}
        aria-label="Calendar scale"
        className="kc-scale-slider w-28 sm:w-36"
      />
      <BigSquareIcon />
      <button
        type="button"
        onClick={() => onChange(1)}
        className="text-[10px] tabular-nums text-[var(--color-muted)] hover:text-[var(--color-fg)] w-9 text-right"
        aria-label="Reset scale"
        disabled={fullWidth}
      >
        {Math.round(value * 100)}%
      </button>
      <span className="w-px h-5 bg-[var(--color-border)] mx-0.5" aria-hidden />
      <button
        type="button"
        onClick={() => onFullWidth(!fullWidth)}
        aria-label={fullWidth ? 'Disable full width' : 'Enable full width'}
        title={fullWidth ? 'Disable full width' : 'Enable full width'}
        className={cn(
          'h-7 w-7 rounded-md flex items-center justify-center transition-colors opacity-100',
          fullWidth ? 'bg-[var(--color-surface-2)] text-[var(--color-fg)]' : 'text-[var(--color-muted)] hover:text-[var(--color-fg)]',
        )}
      >
        <FullWidthIcon />
      </button>

      <style>{`
        .kc-scale-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          background: var(--color-surface-2);
          outline: none;
        }
        .kc-scale-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: var(--color-accent);
          border: 2px solid var(--color-surface);
          box-shadow: 0 0 0 1px var(--color-border);
          cursor: pointer;
        }
        .kc-scale-slider::-moz-range-thumb {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: var(--color-accent);
          border: 2px solid var(--color-surface);
          box-shadow: 0 0 0 1px var(--color-border);
          cursor: pointer;
        }
      `}</style>
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
function SmallSquareIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-muted)]">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
function BigSquareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-muted)]">
      <rect x="2" y="2" width="20" height="20" rx="3" />
    </svg>
  );
}
function FullWidthIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8v8M21 8v8M7 12h10M7 12l3-3M7 12l3 3M17 12l-3-3M17 12l-3 3" />
    </svg>
  );
}
