import * as React from 'react';
import { cn } from '../../lib/cn';

type Variant = 'default' | 'ghost' | 'outline' | 'accent';
type Size = 'sm' | 'md' | 'icon';

const variantClasses: Record<Variant, string> = {
  default: 'bg-[var(--color-surface-2)] text-[var(--color-fg)] hover:bg-[var(--color-border)]',
  ghost: 'bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]',
  outline: 'bg-transparent border border-[var(--color-border)] text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]',
  accent: 'bg-[var(--color-accent)] text-black hover:opacity-90',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  icon: 'h-9 w-9 p-0',
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(({ className, variant = 'default', size = 'md', ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40',
      'disabled:opacity-50 disabled:pointer-events-none',
      variantClasses[variant],
      sizeClasses[size],
      className,
    )}
    {...props}
  />
));
Button.displayName = 'Button';
