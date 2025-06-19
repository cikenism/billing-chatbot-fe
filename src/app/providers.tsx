'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/auth';
import ClientOnly from '@/components/client-only';
import { SessionLogger } from '@/components/session-logger';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClientOnly>
      <AuthProvider>
        <SessionLogger />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthProvider>
    </ClientOnly>
  );
}
