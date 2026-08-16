'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

import { HttpError } from '@/services/http/httpClient';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            /**
             * A 4xx is never retried. Replaying a refusal changes nothing, and the default three
             * attempts meant the API's own refusal (a malformed date filter answers 400 and names
             * the offending key) took about seven seconds to reach the screen, four requests deep.
             * 5xx and network failures keep their retries: those can genuinely succeed on a second
             * attempt.
             */
            retry: (failureCount, error) => {
              if (error instanceof HttpError && error.status >= 400 && error.status < 500) {
                return false;
              }

              return failureCount < 3;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
