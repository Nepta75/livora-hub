'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListingPaginationProps {
  /** 0-indexed current page. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Total number of matching rows (all pages). */
  total: number;
  /** Called with the requested 0-indexed page. */
  onPageChange: (page: number) => void;
}

/**
 * Footer for server-paginated listings: a result count plus prev/next
 * controls. The prev/next row is hidden when everything fits on one page.
 */
export function ListingPagination({
  page,
  pageCount,
  total,
  onPageChange,
}: ListingPaginationProps) {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {total} résultat{total > 1 ? 's' : ''}
      </p>

      {pageCount > 1 && (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 0}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pageCount - 1}
            onClick={() => onPageChange(page + 1)}
          >
            Suivant
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
