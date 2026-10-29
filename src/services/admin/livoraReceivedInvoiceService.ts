import { httpClient } from '@/services/http/httpClient';
import type {
  GetAdminLivoraReceivedInvoiceListResponse,
  ILivoraReceivedInvoice,
  IReportReceivedInvoiceEventDto,
} from '@/types/generated/api-types';

export type { ILivoraReceivedInvoice };

/** Free-text + status filter for the paginated Livora received-invoices inbox. */
export interface LivoraReceivedInvoiceFilters {
  search?: string;
  status?: string;
}

export interface ListPagination {
  limit?: number;
  offset?: number;
}

/**
 * The B2B invoices LIVORA itself received from its own suppliers (the platform reception channel).
 * Mirrors the tenant inbox service, but with no tenant dimension: the hub firewall arms no tenant, so
 * the backend reads Livora's own inbox with its client_credentials. Endpoints live under
 * `/admin/livora/received-invoice` (the `/admin` prefix is added by httpClient).
 */
export const livoraReceivedInvoiceService = {
  getList: (
    filters: LivoraReceivedInvoiceFilters,
    token: string,
    pagination?: ListPagination,
  ) => {
    const query = new URLSearchParams();
    Object.entries({ ...filters, ...pagination }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });
    const qs = query.toString();
    return httpClient.get<GetAdminLivoraReceivedInvoiceListResponse>(
      `/livora/received-invoice${qs ? `?${qs}` : ''}`,
      { token },
    );
  },

  // Re-poll one inbound's observed status from the platform. A read: a platform outage leaves the row
  // unchanged, so this is a safe no-op when down.
  refresh: (id: string, token: string) =>
    httpClient.post<ILivoraReceivedInvoice>(
      `/livora/received-invoice/${id}/refresh`,
      {},
      { token },
    ),

  // Report a lifecycle event (ack) back to the supplier. The hub only offers the three no-motif acks
  // (received / accepted / paid); refused / disputed carry a motif and are a documented follow-up.
  report: (id: string, body: IReportReceivedInvoiceEventDto, token: string) =>
    httpClient.post<ILivoraReceivedInvoice>(
      `/livora/received-invoice/${id}/report`,
      body,
      { token },
    ),
};
