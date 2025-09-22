import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../server/src/router';

// tRPC client for type-safe API calls
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${(import.meta as any).env.VITE_API_URL || 'http://192.168.10.130:4000'}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include', // Include cookies for authentication
        });
      },
    }),
  ],
});