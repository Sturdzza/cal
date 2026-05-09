import { CategoryEditor } from './CategoryEditor';
import type { Category } from '../../lib/types';

type Props = {
  categories: Category[];
  onSave: (cat: Category) => void;
  onDelete: (id: string) => void;
};

export function CategoryList({ categories, onSave, onDelete }: Props) {
  return (
    <div className="space-y-1.5">
      {categories.length === 0 && (
        <p className="text-[11px] text-[var(--color-muted)] py-1">
          No categories yet. Add one to start painting days.
        </p>
      )}

      {categories.map((c) => (
        <CategoryEditor
          key={c.id}
          initial={c}
          onSave={onSave}
          onDelete={onDelete}
          trigger={
            <button
              type="button"
              className="w-full flex items-center gap-2.5 h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] transition-colors text-left"
            >
              <span
                className="h-5 w-5 rounded-md shrink-0"
                style={{ background: c.color }}
                aria-hidden
              />
              <span className="flex-1 text-sm">{c.name}</span>
              <span className="text-[10px] text-[var(--color-muted)] tabular-nums">{c.color.toUpperCase()}</span>
            </button>
          }
        />
      ))}

      <CategoryEditor
        onSave={onSave}
        trigger={
          <button
            type="button"
            className="w-full h-9 px-3 rounded-lg border border-dashed border-[var(--color-border)] text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-fg)] transition-colors flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add category
          </button>
        }
      />
    </div>
  );
}
