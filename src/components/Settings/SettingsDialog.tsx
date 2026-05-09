import * as React from 'react';
import { Button } from '../ui/button';
import { DialogClose, DialogPopup, DialogRoot, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { CategoryList } from '../Categories/CategoryList';
import { cn } from '../../lib/cn';
import type { Category, Settings, ThemeChoice, MotionChoice, ZoomLevel } from '../../lib/types';

type Props = {
  settings: Settings;
  onChange: (next: Settings) => void;
  categories: Category[];
  onSaveCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
};

const THEMES: { value: ThemeChoice; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const MOTIONS: { value: MotionChoice; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'on', label: 'On' },
  { value: 'off', label: 'Off' },
];

const VIEWS: { value: ZoomLevel; label: string }[] = [
  { value: 'year', label: 'Year' },
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
];

export function SettingsDialog({ settings, onChange, categories, onSaveCategory, onDeleteCategory }: Props) {
  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <DialogRoot>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label="Settings"
            className={cn(
              'inline-flex items-center justify-center h-9 w-9 rounded-lg',
              'border border-[var(--color-border)] text-[var(--color-fg)]',
              'hover:bg-[var(--color-surface-2)] transition-colors',
            )}
          >
            <SettingsIcon />
          </button>
        }
      />
      <DialogPopup className="w-[min(92vw,460px)] max-h-[85vh] overflow-y-auto">
        <DialogTitle className="text-base font-semibold mb-5">Settings</DialogTitle>

        <div className="space-y-5">
          <Field label="Categories" hint="Right-click any day to assign one">
            <CategoryList
              categories={categories}
              onSave={onSaveCategory}
              onDelete={onDeleteCategory}
            />
          </Field>

          <Field label="Theme">
            <Segmented
              value={settings.theme}
              options={THEMES}
              onSelect={(v) => set('theme', v)}
            />
          </Field>

          <Field label="Animations" hint="System follows your reduced-motion preference">
            <Segmented
              value={settings.animations}
              options={MOTIONS}
              onSelect={(v) => set('animations', v)}
            />
          </Field>

          <Field label="Default view" hint="The view shown when the app loads">
            <Segmented
              value={settings.defaultZoom}
              options={VIEWS}
              onSelect={(v) => set('defaultZoom', v)}
            />
          </Field>

          <div className="flex items-center justify-between gap-4 pt-1">
            <div>
              <label htmlFor="full-width" className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                Full width
              </label>
              <p className="mt-1 text-[11px] text-[var(--color-muted)]">
                Stretch the calendar to fill the browser window (overrides scale)
              </p>
            </div>
            <Switch
              id="full-width"
              checked={settings.fullWidth}
              onCheckedChange={(v) => set('fullWidth', v)}
              aria-label="Use full browser width"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <DialogClose render={<Button variant="accent" size="sm">Done</Button>} />
        </div>
      </DialogPopup>
    </DialogRoot>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs uppercase tracking-wider text-[var(--color-muted)]">{label}</label>
      </div>
      {children}
      {hint && <p className="mt-1.5 text-[11px] text-[var(--color-muted)]">{hint}</p>}
    </div>
  );
}

function Segmented<T extends string>({
  value, options, onSelect,
}: {
  value: T;
  options: { value: T; label: string }[];
  onSelect: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-[var(--color-border)] p-0.5 bg-[var(--color-surface)] w-full">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onSelect(o.value)}
          className={cn(
            'flex-1 h-8 px-3 text-xs rounded-md transition-colors',
            value === o.value
              ? 'bg-[var(--color-surface-2)] text-[var(--color-fg)]'
              : 'text-[var(--color-muted)] hover:text-[var(--color-fg)]',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
