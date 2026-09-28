import type { ReactNode } from 'react';

const tones = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  danger: 'bg-accent/10 text-accent ring-accent/20',
};

interface BadgeProps {
  tone: keyof typeof tones;
  children: ReactNode;
}

export function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
