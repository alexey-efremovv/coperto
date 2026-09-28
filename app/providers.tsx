'use client';

import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { showToast } from '@/shared/ui/Toast';

function createQueryClient() {
  return new QueryClient({
    mutationCache: new MutationCache({ onError: (error) => showToast(error.message) }),
  });
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
