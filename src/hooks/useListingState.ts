'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export interface ListingState {
  /** Applied search term, the URL is the single source of truth. */
  search: string;
  /** 0-indexed current page. */
  page: number;
  /** Write a new search term and reset to the first page. */
  setSearch: (value: string) => void;
  /** Write a new 0-indexed page, keeping the current search. */
  setPage: (page: number) => void;
}

/**
 * URL-backed search + pagination state for hub listing pages.
 *
 * The query string (`?search=...&page=...`) is the single source of truth, so
 * the listing survives reloads and back/forward navigation. Page is stored
 * 1-indexed in the URL (human-friendly) and exposed 0-indexed to callers.
 *
 * Must be rendered inside a `<Suspense>` boundary, `useSearchParams` requires
 * it under the App Router.
 */
export function useListingState(): ListingState {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const parsedPage = parseInt(searchParams.get('page') ?? '1', 10);
  const page = Math.max(0, (Number.isNaN(parsedPage) ? 1 : parsedPage) - 1);

  const write = useCallback(
    (nextSearch: string, nextPage: number) => {
      const params = new URLSearchParams();
      if (nextSearch) params.set('search', nextSearch);
      if (nextPage > 0) params.set('page', String(nextPage + 1));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const setSearch = useCallback((value: string) => write(value, 0), [write]);
  const setPage = useCallback((nextPage: number) => write(search, nextPage), [write, search]);

  return { search, page, setSearch, setPage };
}
