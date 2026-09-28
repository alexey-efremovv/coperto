import type { ComponentProps } from 'react';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent/90',
  secondary: 'bg-white text-ink ring-1 ring-ink/15 hover:bg-ink/5',
};

type ButtonProps = ComponentProps<'button'> & {
  variant?: keyof typeof variants;
  isLoading?: boolean;
};

export function Button({
  variant = 'secondary',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      {children}
    </button>
  );
}
