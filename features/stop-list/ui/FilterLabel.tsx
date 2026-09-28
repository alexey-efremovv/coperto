'use client';

import { useLinkStatus } from 'next/link';
import type { ReactNode } from 'react';

export function FilterLabel({ children }: { children: ReactNode }) {
  const { pending } = useLinkStatus();

  return <span className={pending ? 'animate-pulse' : undefined}>{children}</span>;
}
