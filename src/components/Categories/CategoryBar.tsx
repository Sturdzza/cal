import * as React from 'react';
import { CategoryEditor } from './CategoryEditor';
import { cn } from '../../lib/cn';
import type { Category } from '../../lib/types';

type Props = {
  categories: Category[];
  activeId: string | null;
  onSelectActive: (id: string | null) => void;
  onSave: (cat: Category) => void;
  onDelete: (id: string) => void;
};

export function CategoryBar({ categories, activeId, onSelectActive, onSave, onDelete }: Props) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs uppercase tracking-wider text-[var(--color-muted)]">Categories</h3>
        <span className="text-[10px] text-[var(--color-muted)]">tap day to paint · long press to edit</span>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => onSelectActive(null)}
          className={cn(
            'h-8 px-3 rounded-lg text-xs flex items-center gap-2 border transition-colors',
            activeId === null
              ? 'border-[var(--color-fg)] bg-[var(--color-surface-2)]'
              : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)]',
          )}
        >
          <EraserIcon />
          Erase
        </button>

        {categories.map((c) => (
          <CategoryPill
            key={c.id}
            category={c}
            active={activeId === c.id}
            onSelect={() => onSelectActive(c.id)}
            onSave={onSave}
            onDelete={onDelete}
          />
        ))}

        <CategoryEditor
          trigger={
            <button
              type="button"
              className="h-8 w-8 rounded-lg border border-dashed border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-fg)]"
              aria-label="Add category"
            >
              <PlusIcon />
            </button>
          }
          onSave={onSave}
        />
      </div>
    </div>
  );
}

type PillProps = {
  category: Category;
  active: boolean;
  onSelect: () => void;
  onSave: (cat: Category) => void;
  onDelete: (id: string) => void;
};

function CategoryPill({ category, active, onSelect, onSave, onDelete }: PillProps) {
  const longPressTimer = React.useRef<number | null>(null);
  const triggeredLongPress = React.useRef(false);
  const editorTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => () => {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
  }, []);

  function startLongPress() {
    triggeredLongPress.current = false;
    longPressTimer.current = window.setTimeout(() => {
      triggeredLongPress.current = true;
      editorTriggerRef.current?.click();
    }, 500);
  }
  function cancelLongPress() {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => { if (!triggeredLongPress.current) onSelect(); }}
        onPointerDown={startLongPress}
        onPointerUp={cancelLongPress}
        onPointerLeave={cancelLongPress}
        onPointerCancel={cancelLongPress}
        onContextMenu={(e) => { e.preventDefault(); editorTriggerRef.current?.click(); }}
        className={cn(
          'h-8 pl-2 pr-3 rounded-lg text-xs flex items-center gap-2 border transition-colors',
          active
            ? 'border-[var(--color-fg)] bg-[var(--color-surface-2)]'
            : 'border-[var(--color-border)] hover:bg-[var(--color-surface-2)]',
        )}
      >
        <span className="h-4 w-4 rounded-md" style={{ background: category.color }} />
        <span>{category.name}</span>
      </button>

      <CategoryEditor
        trigger={<button ref={editorTriggerRef} type="button" className="hidden" aria-hidden />}
        initial={category}
        onSave={onSave}
        onDelete={onDelete}
      />
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function EraserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4L13 5l6 6-9.4 9.4a1 1 0 0 1-.8.3z" />
      <path d="M22 21H7" />
    </svg>
  );
}
