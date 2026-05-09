import * as React from 'react';
import { cn } from '../../lib/cn';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-9 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-sm',
      'text-[var(--color-fg)] placeholder:text-[var(--color-muted)]',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';
