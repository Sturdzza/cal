import type { Category, DayMap, Settings } from './types';

export const STORAGE_KEY = 'kyzzo-cal:v1';

export type Persisted = {
  categories: Category[];
  days: DayMap;
  activeCategoryId: string | null;
  settings: Settings;
};

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  animations: 'system',
  defaultZoom: 'year',
  fullWidth: false,
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#22c55e' },
  { id: 'rest', name: 'Rest', color: '#3b82f6' },
  { id: 'travel', name: 'Travel', color: '#f59e0b' },
];

export function load(): Persisted {
  if (typeof localStorage === 'undefined') {
    return {
      categories: DEFAULT_CATEGORIES,
      days: {},
      activeCategoryId: 'work',
      settings: DEFAULT_SETTINGS,
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        categories: DEFAULT_CATEGORIES,
        days: {},
        activeCategoryId: 'work',
        settings: DEFAULT_SETTINGS,
      };
    }
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
      days: parsed.days ?? {},
      activeCategoryId: parsed.activeCategoryId ?? null,
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
    };
  } catch {
    return {
      categories: DEFAULT_CATEGORIES,
      days: {},
      activeCategoryId: 'work',
      settings: DEFAULT_SETTINGS,
    };
  }
}

export function save(state: Persisted): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
