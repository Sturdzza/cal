import * as React from 'react';
import { ContextMenu } from '@base-ui-components/react/context-menu';
import { cn } from '../../lib/cn';
import type { Category } from '../../lib/types';

type Props = {
  categories: Category[];
  currentCategoryId: string | null;
  onAssign: (categoryId: string | null) => void;
  children: React.ReactElement<Record<string, unknown>>;
};

export function DayContextMenu({ categories, currentCategoryId, onAssign, children }: Props) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger render={children} />
      <ContextMenu.Portal>
        <ContextMenu.Positioner sideOffset={4}>
          <ContextMenu.Popup
            className={cn(
              'min-w-[12rem] z-50 p-1 rounded-xl border border-[var(--color-border)]',
              'bg-[var(--color-surface)] shadow-xl outline-none',
              'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity',
            )}
          >
            {categories.length === 0 && (
              <div className="px-2.5 py-1.5 text-xs text-[var(--color-muted)]">
                No categories. Add one in Settings.
              </div>
            )}
            {categories.map((c) => {
              const active = c.id === currentCategoryId;
              return (
                <ContextMenu.Item
                  key={c.id}
                  onClick={() => onAssign(c.id)}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm cursor-pointer',
                    'data-[highlighted]:bg-[var(--color-surface-2)] outline-none',
                    active && 'font-semibold',
                  )}
                >
                  <span
                    className="h-4 w-4 rounded-md shrink-0"
                    style={{ background: c.color }}
                    aria-hidden
                  />
                  <span className="flex-1">{c.name}</span>
                  {active && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent)]">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </ContextMenu.Item>
              );
            })}
            {currentCategoryId !== null && (
              <>
                <div className="my-1 h-px bg-[var(--color-border)]" />
                <ContextMenu.Item
                  onClick={() => onAssign(null)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm cursor-pointer data-[highlighted]:bg-[var(--color-surface-2)] outline-none text-[var(--color-muted)]"
                >
                  <span className="h-4 w-4 rounded-md border border-dashed border-[var(--color-border)] shrink-0" aria-hidden />
                  <span>Clear</span>
                </ContextMenu.Item>
              </>
            )}
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
