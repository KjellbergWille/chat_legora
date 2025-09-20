import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server-router';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});