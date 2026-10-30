import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import {
  livoraEmittedInvoiceService,
  type LivoraEmittedInvoiceFilters,
} from '@/services/admin/livoraEmittedInvoiceService';
import type { GetAdminLivoraSubscriptionInvoiceListResponse } from '@/types/generated/api-types';

export const LIVORA_EMITTED_INVOICES_PAGE_SIZE = 25;

export const LIVORA_EMITTED_INVOICES_KEYS = {
  all: ['admin', 'livora-emitted-invoices'] as const,
  list: (filters: LivoraEmittedInvoiceFilters, page: number) =>
    ['admin', 'livora-emitted-invoices', 'list', filters, page] as const,
};

/**
 * Paginated listing of the subscription invoices Livora emitted to its tenants. `placeholderData` keeps
 * the previous page on screen while the next one loads.
 */
export function useLivoraEmittedInvoices(filters: LivoraEmittedInvoiceFilters = {}, page = 0) {
  const { token } = useAuth();

  return useQuery<GetAdminLivoraSubscriptionInvoiceListResponse>({
    queryKey: LIVORA_EMITTED_INVOICES_KEYS.list(filters, page),
    queryFn: () =>
      livoraEmittedInvoiceService.getList(filters, token, {
        limit: LIVORA_EMITTED_INVOICES_PAGE_SIZE,
        offset: page * LIVORA_EMITTED_INVOICES_PAGE_SIZE,
      }),
    placeholderData: (prev) => prev,
  });
}

/**
 * Fetches one blob and triggers a browser save. Factored so the Factur-X and the XML downloads share it
 * rather than repeating the object-URL dance (the tenant-side hooks duplicate it twice; this does not).
 */
function useBlobDownload(fetcher: (id: string, token: string) => Promise<Blob>, extension: string) {
  const { token } = useAuth();

  return useMutation({
    mutationFn: async ({ id, invoiceNumber }: { id: string; invoiceNumber: string }) => {
      const blob = await fetcher(id, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoiceNumber}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}

export function useDownloadLivoraEmittedFacturX() {
  return useBlobDownload(livoraEmittedInvoiceService.downloadFacturX, 'pdf');
}

export function useDownloadLivoraEmittedXml() {
  return useBlobDownload(livoraEmittedInvoiceService.downloadXml, 'xml');
}
