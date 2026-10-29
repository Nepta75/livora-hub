import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import {
  livoraReceivedInvoiceService,
  type LivoraReceivedInvoiceFilters,
} from '@/services/admin/livoraReceivedInvoiceService';
import type {
  GetAdminLivoraReceivedInvoiceListResponse,
  IReportReceivedInvoiceEventDto,
} from '@/types/generated/api-types';

export const LIVORA_RECEIVED_INVOICES_PAGE_SIZE = 25;

export const LIVORA_RECEIVED_INVOICES_KEYS = {
  all: ['admin', 'livora-received-invoices'] as const,
  list: (filters: LivoraReceivedInvoiceFilters, page: number) =>
    ['admin', 'livora-received-invoices', 'list', filters, page] as const,
};

/**
 * Paginated inbox of the invoices Livora received from its suppliers, plus the accounts-payable
 * snapshot. `placeholderData` keeps the previous page on screen while the next one loads.
 */
export function useLivoraReceivedInvoices(
  filters: LivoraReceivedInvoiceFilters = {},
  page = 0,
) {
  const { token } = useAuth();

  return useQuery<GetAdminLivoraReceivedInvoiceListResponse>({
    queryKey: LIVORA_RECEIVED_INVOICES_KEYS.list(filters, page),
    queryFn: () =>
      livoraReceivedInvoiceService.getList(filters, token, {
        limit: LIVORA_RECEIVED_INVOICES_PAGE_SIZE,
        offset: page * LIVORA_RECEIVED_INVOICES_PAGE_SIZE,
      }),
    placeholderData: (prev) => prev,
  });
}

export function useRefreshLivoraReceivedInvoice() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => livoraReceivedInvoiceService.refresh(id, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LIVORA_RECEIVED_INVOICES_KEYS.all });
    },
  });
}

export function useReportLivoraReceivedInvoiceEvent() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: IReportReceivedInvoiceEventDto }) =>
      livoraReceivedInvoiceService.report(id, body, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LIVORA_RECEIVED_INVOICES_KEYS.all });
    },
  });
}
