import { Switch as BaseSwitch } from '@base-ui-components/react/switch';
import { cn } from '../../lib/cn';

type Props = {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  id?: string;
  'aria-label'?: string;
};

export function Switch({ checked, onCheckedChange, id, ...rest }: Props) {
  return (
    <BaseSwitch.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      {...rest}
      className={cn(
        'relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors',
        'border border-[var(--color-border)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40',
        checked ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-surface-2)]',
      )}
    >
      <BaseSwitch.Thumb
        className={cn(
          'block h-4 w-4 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-1',
        )}
      />
    </BaseSwitch.Root>
  );
}
