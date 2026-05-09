import * as React from 'react';
import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from '../../lib/color';
import { cn } from '../../lib/cn';
import { Input } from '../ui/input';

const PALETTE = [
  '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#d946ef', '#ec4899', '#ef4444', '#f97316',
  '#f59e0b', '#eab308', '#84cc16', '#14b8a6', '#64748b',
];

type Props = {
  value: string;
  onChange: (color: string) => void;
};

export function AdvancedColorPicker({ value, onChange }: Props) {
  const rgb = hexToRgb(value) ?? { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb);
  const [hexInput, setHexInput] = React.useState(value);

  React.useEffect(() => {
    setHexInput(value);
  }, [value]);

  function commitHex(raw: string) {
    setHexInput(raw);
    const parsed = hexToRgb(raw);
    if (parsed) onChange(rgbToHex(parsed));
  }

  function setChannel(channel: 'r' | 'g' | 'b', v: number) {
    onChange(rgbToHex({ ...rgb, [channel]: v }));
  }

  function setHue(h: number) {
    const next = hslToRgb({ h, s: hsl.s || 1, l: hsl.l || 0.5 });
    onChange(rgbToHex(next));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            aria-label={`Select color ${c}`}
            style={{ background: c }}
            className={cn(
              'h-7 w-7 rounded-md transition-transform',
              value.toLowerCase() === c.toLowerCase()
                ? 'ring-2 ring-[var(--color-fg)] scale-110'
                : 'hover:scale-105',
            )}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-lg shrink-0 border border-[var(--color-border)]"
          style={{ background: value }}
          aria-label="Current color"
        />
        <div className="flex-1">
          <label className="block text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-1">Hex</label>
          <Input
            value={hexInput}
            onChange={(e) => commitHex(e.target.value)}
            spellCheck={false}
            className="font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-1.5">Hue</label>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={Math.round(hsl.h)}
          onChange={(e) => setHue(Number(e.target.value))}
          className="kc-hue-slider"
          aria-label="Hue"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ChannelSlider label="R" value={rgb.r} accent="#ef4444" onChange={(v) => setChannel('r', v)} />
        <ChannelSlider label="G" value={rgb.g} accent="#22c55e" onChange={(v) => setChannel('g', v)} />
        <ChannelSlider label="B" value={rgb.b} accent="#3b82f6" onChange={(v) => setChannel('b', v)} />
      </div>

      <style>{`
        .kc-hue-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 14px;
          border-radius: 7px;
          background: linear-gradient(to right,
            #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%,
            #0000ff 67%, #ff00ff 83%, #ff0000 100%);
          outline: none;
        }
        .kc-hue-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #1a1a1a;
          box-shadow: 0 1px 3px rgba(0,0,0,.3);
          cursor: pointer;
        }
        .kc-hue-slider::-moz-range-thumb {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #1a1a1a;
          box-shadow: 0 1px 3px rgba(0,0,0,.3);
          cursor: pointer;
        }
        .kc-channel-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: var(--color-surface-2);
          outline: none;
        }
        .kc-channel-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: var(--kc-thumb, #fff);
          border: 2px solid var(--color-fg);
          cursor: pointer;
        }
        .kc-channel-slider::-moz-range-thumb {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: var(--kc-thumb, #fff);
          border: 2px solid var(--color-fg);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function ChannelSlider({
  label, value, onChange, accent,
}: {
  label: string; value: number; accent: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">{label}</span>
        <input
          type="number"
          min={0}
          max={255}
          value={value}
          onChange={(e) => onChange(Math.max(0, Math.min(255, Number(e.target.value) || 0)))}
          className="w-12 h-6 px-1 text-xs text-right rounded bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-fg)] focus:outline-none"
        />
      </div>
      <input
        type="range"
        min={0}
        max={255}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="kc-channel-slider"
        style={{ ['--kc-thumb' as string]: accent } as React.CSSProperties}
        aria-label={`${label} channel`}
      />
    </div>
  );
}
