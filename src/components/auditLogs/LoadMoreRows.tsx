'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * The other half of a windowed journal: `WindowSummary` says what is left out, this reaches it.
 *
 * Beside that component on purpose. There were three hand-rolled copies of this button across the
 * audit screens and they had already drifted (one without a spinner, one with a different ellipsis),
 * which is exactly why `WindowSummary` was extracted in the first place.
 *
 * Render it only while `hasNextPage`, which the hooks answer from the total AND from a short page,
 * never from the total alone.
 */
export function LoadMoreRows({
  onClick,
  isFetching,
  className,
}: {
  onClick: () => void;
  isFetching: boolean;
  className?: string;
}) {
  return (
    <div className={`flex justify-center pt-2 ${className ?? ''}`}>
      <Button variant="outline" size="sm" onClick={onClick} disabled={isFetching}>
        {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isFetching ? 'Chargement...' : 'Charger plus'}
      </Button>
    </div>
  );
}

/**
 * The figure to show beside a window is the LAST page's total, not the first's.
 *
 * The listing and its count are two queries, so rows written or deleted while the reader pages down
 * move the count. Holding the first page's copy renders "100 affichés sur 60" as soon as a purge
 * runs under the read.
 */
export function lastWindowTotal(data: { pages: Array<{ total: number }> }): number {
  return data.pages[data.pages.length - 1]?.total ?? 0;
}
