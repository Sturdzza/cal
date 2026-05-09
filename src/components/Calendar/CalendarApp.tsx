import * as React from 'react';
import { Toolbar } from './Toolbar';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import { WeekView } from './WeekView';
import { SettingsDialog } from '../Settings/SettingsDialog';
import { addDays, addMonths, startOfWeek } from '../../lib/date';
import { DEFAULT_SETTINGS, load, save, type Persisted } from '../../lib/storage';
import type { Category, Settings, ZoomLevel } from '../../lib/types';

function applyDomSettings(s: Settings) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (s.theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', s.theme);
  if (s.animations === 'system') root.removeAttribute('data-motion');
  else root.setAttribute('data-motion', s.animations);
}

export function CalendarApp() {
  const [hydrated, setHydrated] = React.useState(false);
  const [state, setState] = React.useState<Persisted>(() => ({
    categories: [],
    days: {},
    activeCategoryId: null,
    settings: DEFAULT_SETTINGS,
  }));

  const [zoom, setZoom] = React.useState<ZoomLevel>(DEFAULT_SETTINGS.defaultZoom);
  const [cursor, setCursor] = React.useState(() => {
    const t = new Date();
    return { year: t.getFullYear(), monthIdx: t.getMonth(), weekStart: startOfWeek(t) };
  });

  const [today, setToday] = React.useState(() => new Date());

  React.useEffect(() => {
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const t = window.setTimeout(() => setToday(new Date()), msUntilMidnight + 100);
    return () => window.clearTimeout(t);
  }, [today]);

  React.useEffect(() => {
    const loaded = load();
    setState(loaded);
    setZoom(loaded.settings.defaultZoom);
    applyDomSettings(loaded.settings);
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (hydrated) save(state);
  }, [state, hydrated]);

  React.useEffect(() => {
    if (hydrated) applyDomSettings(state.settings);
  }, [state.settings, hydrated]);

  const categoriesById = React.useMemo(() => {
    const m: Record<string, Category> = {};
    for (const c of state.categories) m[c.id] = c;
    return m;
  }, [state.categories]);

  function paint(key: string) {
    setState((s) => {
      const next = { ...s.days };
      const current = next[key];
      if (s.activeCategoryId === null) {
        delete next[key];
      } else if (current === s.activeCategoryId) {
        delete next[key];
      } else {
        next[key] = s.activeCategoryId;
      }
      return { ...s, days: next };
    });
  }

  const dragRef = React.useRef<{
    active: boolean;
    mode: 'paint' | 'clear';
    lastKey: string | null;
    didDrag: boolean;
  }>({ active: false, mode: 'paint', lastKey: null, didDrag: false });

  function paintForce(key: string) {
    setState((s) => {
      const next = { ...s.days };
      if (dragRef.current.mode === 'clear' || s.activeCategoryId === null) {
        delete next[key];
      } else {
        next[key] = s.activeCategoryId;
      }
      return { ...s, days: next };
    });
  }

  function onCellPointerDown(e: React.PointerEvent<HTMLButtonElement>, key: string) {
    if (e.button !== 0) return;
    const cellCat = state.days[key];
    const active = state.activeCategoryId;
    const mode: 'paint' | 'clear' = active === null || cellCat === active ? 'clear' : 'paint';
    dragRef.current = { active: true, mode, lastKey: key, didDrag: false };
  }

  function onCellClick(key: string) {
    if (dragRef.current.didDrag) {
      dragRef.current.didDrag = false;
      return;
    }
    paint(key);
  }

  React.useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragRef.current.active) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const tile = el?.closest<HTMLElement>('[data-day-tile][data-day-key]');
      const key = tile?.getAttribute('data-day-key');
      if (!key || key === dragRef.current.lastKey) return;
      if (!dragRef.current.didDrag) {
        dragRef.current.didDrag = true;
        if (dragRef.current.lastKey) paintForce(dragRef.current.lastKey);
      }
      dragRef.current.lastKey = key;
      paintForce(key);
    }
    function onUp() {
      dragRef.current.active = false;
      dragRef.current.lastKey = null;
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  function assign(key: string, categoryId: string | null) {
    setState((s) => {
      const next = { ...s.days };
      if (categoryId === null) delete next[key];
      else next[key] = categoryId;
      return {
        ...s,
        days: next,
        activeCategoryId: categoryId ?? s.activeCategoryId,
      };
    });
  }

  function saveCategory(cat: Category) {
    setState((s) => {
      const exists = s.categories.some((c) => c.id === cat.id);
      const categories = exists
        ? s.categories.map((c) => (c.id === cat.id ? cat : c))
        : [...s.categories, cat];
      return {
        ...s,
        categories,
        activeCategoryId: s.activeCategoryId ?? cat.id,
      };
    });
  }

  function deleteCategory(id: string) {
    setState((s) => {
      const days = { ...s.days };
      for (const k of Object.keys(days)) if (days[k] === id) delete days[k];
      return {
        ...s,
        categories: s.categories.filter((c) => c.id !== id),
        days,
        activeCategoryId: s.activeCategoryId === id ? null : s.activeCategoryId,
      };
    });
  }

  function updateSettings(next: Settings) {
    setState((s) => ({ ...s, settings: next }));
  }

  function nav(delta: number) {
    setCursor((c) => {
      if (zoom === 'year') return { ...c, year: c.year + delta };
      if (zoom === 'month') {
        const { year, monthIdx } = addMonths(c.year, c.monthIdx, delta);
        return { ...c, year, monthIdx };
      }
      return { ...c, weekStart: addDays(c.weekStart, delta * 7) };
    });
  }

  function goToday() {
    const t = new Date();
    setCursor({ year: t.getFullYear(), monthIdx: t.getMonth(), weekStart: startOfWeek(t) });
  }

  function onYearMonthClick(monthIdx: number) {
    setCursor((c) => ({ ...c, monthIdx, weekStart: startOfWeek(new Date(c.year, monthIdx, 1)) }));
    setZoom('month');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-7 w-7 rounded-lg"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden
            />
            <h1 className="text-base sm:text-lg font-semibold tracking-tight">kyzzo cal</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Toolbar
              zoom={zoom}
              onZoom={setZoom}
              onPrev={() => nav(-1)}
              onNext={() => nav(1)}
              onToday={goToday}
            />
            <SettingsDialog
              settings={state.settings}
              onChange={updateSettings}
              categories={state.categories}
              onSaveCategory={saveCategory}
              onDeleteCategory={deleteCategory}
            />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className={`mx-auto px-3 sm:px-6 py-4 ${state.settings.fullWidth ? 'w-full' : 'max-w-[80rem]'}`}>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-6">
            {zoom === 'month' && (
              <MonthView
                year={cursor.year}
                monthIdx={cursor.monthIdx}
                days={state.days}
                categories={state.categories}
                categoriesById={categoriesById}
                onPaint={onCellClick}
                onPaintPointerDown={onCellPointerDown}
                onAssign={assign}
                today={today}
                fullWidth={state.settings.fullWidth}
              />
            )}
            {zoom === 'year' && (
              <YearView
                year={cursor.year}
                days={state.days}
                categories={state.categories}
                categoriesById={categoriesById}
                onPaint={onCellClick}
                onPaintPointerDown={onCellPointerDown}
                onAssign={assign}
                onMonthClick={onYearMonthClick}
                today={today}
                fullWidth={state.settings.fullWidth}
              />
            )}
            {zoom === 'week' && (
              <WeekView
                weekStart={cursor.weekStart}
                days={state.days}
                categories={state.categories}
                categoriesById={categoriesById}
                onPaint={onCellClick}
                onPaintPointerDown={onCellPointerDown}
                onAssign={assign}
                today={today}
                fullWidth={state.settings.fullWidth}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="px-3 sm:px-6 py-4 text-center text-[10px] text-[var(--color-muted)]">
        Saved locally · Click a day to paint · Click and drag to paint many · Right-click (or long-press) to pick a color
      </footer>
    </div>
  );
}
