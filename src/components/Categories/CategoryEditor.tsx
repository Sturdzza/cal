import * as React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DialogClose, DialogPopup, DialogRoot, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AdvancedColorPicker } from './AdvancedColorPicker';
import type { Category } from '../../lib/types';

const FALLBACK_COLOR = '#22c55e';

type Props = {
  trigger: React.ReactElement<Record<string, unknown>>;
  initial?: Category;
  onSave: (cat: Category) => void;
  onDelete?: (id: string) => void;
};

export function CategoryEditor({ trigger, initial, onSave, onDelete }: Props) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(initial?.name ?? '');
  const [color, setColor] = React.useState(initial?.color ?? FALLBACK_COLOR);

  React.useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setColor(initial?.color ?? FALLBACK_COLOR);
    }
  }, [open, initial]);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      name: trimmed,
      color,
    });
    setOpen(false);
  }

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogPopup>
        <DialogTitle className="text-base font-semibold mb-4">
          {initial ? 'Edit category' : 'New category'}
        </DialogTitle>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1.5">Name</label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Deep work"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-2">Color</label>
            <AdvancedColorPicker value={color} onChange={setColor} />
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center gap-2">
          <div>
            {initial && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-500/10"
                onClick={() => { onDelete(initial.id); setOpen(false); }}
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <DialogClose render={<Button variant="ghost" size="sm">Cancel</Button>} />
            <Button variant="accent" size="sm" onClick={handleSave} disabled={!name.trim()}>
              Save
            </Button>
          </div>
        </div>
      </DialogPopup>
    </DialogRoot>
  );
}
