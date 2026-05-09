export type Category = {
  id: string;
  name: string;
  color: string;
};

export type DayMap = Record<string, string>;

export type ZoomLevel = 'year' | 'month' | 'week';

export type ThemeChoice = 'system' | 'light' | 'dark';
export type MotionChoice = 'system' | 'on' | 'off';

export type Settings = {
  theme: ThemeChoice;
  animations: MotionChoice;
  defaultZoom: ZoomLevel;
  fullWidth: boolean;
};

export type CalendarState = {
  categories: Category[];
  days: DayMap;
  activeCategoryId: string | null;
  zoom: ZoomLevel;
  settings: Settings;
};
