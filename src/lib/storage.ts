import type { Category, DayMap, Settings } from './types';

export const STORAGE_KEY = 'kyzzo-cal:v1';
export const EXPORT_VERSION = 1;

export type Persisted = {
  categories: Category[];
  days: DayMap;
  activeCategoryId: string | null;
  settings: Settings;
};

export type ExportEnvelope = {
  app: 'kyzzo-cal';
  version: number;
  exportedAt: string;
  data: Persisted;
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

export function serializeExport(state: Persisted): string {
  const envelope: ExportEnvelope = {
    app: 'kyzzo-cal',
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: state,
  };
  return JSON.stringify(envelope, null, 2);
}

export function parseImport(raw: string): Persisted {
  const parsed = JSON.parse(raw);
  const data = parsed && typeof parsed === 'object' && 'data' in parsed ? parsed.data : parsed;
  if (!data || typeof data !== 'object') throw new Error('File does not contain calendar data');
  if (!Array.isArray(data.categories)) throw new Error('Missing or invalid "categories" array');
  if (!data.days || typeof data.days !== 'object') throw new Error('Missing or invalid "days" map');
  for (const c of data.categories) {
    if (!c || typeof c.id !== 'string' || typeof c.name !== 'string' || typeof c.color !== 'string') {
      throw new Error('A category is missing id, name, or color');
    }
  }
  for (const [k, v] of Object.entries(data.days)) {
    if (typeof v !== 'string') throw new Error(`Day "${k}" must map to a category id string`);
  }
  return {
    categories: data.categories as Category[],
    days: data.days as DayMap,
    activeCategoryId: typeof data.activeCategoryId === 'string' ? data.activeCategoryId : null,
    settings: { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) },
  };
}

export function mergeState(current: Persisted, incoming: Persisted): Persisted {
  const byId = new Map(current.categories.map((c) => [c.id, c] as const));
  for (const c of incoming.categories) byId.set(c.id, c);
  return {
    categories: Array.from(byId.values()),
    days: { ...current.days, ...incoming.days },
    activeCategoryId: current.activeCategoryId,
    settings: current.settings,
  };
}
