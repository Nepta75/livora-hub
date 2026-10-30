import { httpClient } from '@/services/http/httpClient';
import type {
  GetAdminLivoraSubscriptionInvoiceListResponse,
  ISubscriptionInvoice,
} from '@/types/generated/api-types';

export type { ISubscriptionInvoice };

/** Free-text filter for the paginated Livora emitted-invoices listing. */
export interface LivoraEmittedInvoiceFilters {
  search?: string;
}

export interface ListPagination {
  limit?: number;
  offset?: number;
}

/**
 * The subscription invoices LIVORA emitted to its tenants (the emission channel), for the hub "Émises"
 * tab. Mirrors the received-invoice service, cross-tenant: the hub firewall arms no tenant, so the backend
 * reads every tenant's invoices. Endpoints live under `/admin/livora/subscription-invoice` (the `/admin`
 * prefix is added by httpClient). The downloads return the conforming e-invoice: the Factur-X PDF by
 * default, the bare CII XML with ?format=xml, rebuilt on demand by the backend.
 */
export const livoraEmittedInvoiceService = {
  getList: (filters: LivoraEmittedInvoiceFilters, token: string, pagination?: ListPagination) => {
    const query = new URLSearchParams();
    Object.entries({ ...filters, ...pagination }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });
    const qs = query.toString();
    return httpClient.get<GetAdminLivoraSubscriptionInvoiceListResponse>(
      `/livora/subscription-invoice${qs ? `?${qs}` : ''}`,
      { token },
    );
  },

  downloadFacturX: (id: string, token: string) =>
    httpClient.get<Blob>(`/livora/subscription-invoice/${id}/facturx`, {
      token,
      responseType: 'blob',
    }),

  downloadXml: (id: string, token: string) =>
    httpClient.get<Blob>(`/livora/subscription-invoice/${id}/facturx?format=xml`, {
      token,
      responseType: 'blob',
    }),
};
