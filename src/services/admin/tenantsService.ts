import { httpClient } from '@/services/http/httpClient';
import type {
  AuditLogAction,
  IAuditLog,
  ImpersonationLog,
  IRefundSubscriptionInvoiceDto,
  ISubscription,
  ISubscriptionInvoice,
  ISubscriptionInvoiceRefund,
  ITenant,
  IUser,
  GetAdminTenantSubscriptionInvoiceReadResponse,
} from '@/types/generated/api-types';

export type { IAuditLog, ImpersonationLog, ISubscriptionInvoice, ISubscriptionInvoiceRefund };

/** Free-text filter for the paginated tenants listing. */
export interface TenantListFilters {
  search?: string;
}

export interface ListPagination {
  limit?: number;
  offset?: number;
}

/**
 * One row of the hub tenants listing, the tenant plus the figures the table
 * renders alongside it. `subscription` is `null` when the tenant has never
 * subscribed. Composed from generated entity types (no manual duplication).
 */
export interface AdminTenantListItem {
  tenant: ITenant;
  userCount: number;
  subscription: ISubscription | null;
}

/** Shape returned by GET /admin/tenant (paginated). */
export interface AdminTenantListResponse {
  data: AdminTenantListItem[];
  total: number;
}

/** Lightweight tenant entry for pickers, GET /admin/tenant/options. */
export interface TenantOption {
  id: string;
  name: string;
}

/** Shape returned by POST /tenant/{id}/subscription-invoice/{id}/refund. */
export interface RefundSubscriptionInvoiceResult {
  refund: ISubscriptionInvoiceRefund;
  invoice: ISubscriptionInvoice;
}

export interface TenantSubscriptionInvoiceFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TenantSubscriptionInvoicePagination {
  limit?: number;
  offset?: number;
}

export interface TenantAuditLogFilters {
  impersonationSessionId?: string;
  impersonatedByEmail?: string;
  userEmail?: string;
  entityType?: string;
  action?: AuditLogAction | '';
  dateFrom?: string;
  dateTo?: string;
  isImpersonated?: boolean;
}

export interface TenantAuditLogPagination {
  limit?: number;
  offset?: number;
}

export interface CreateTenantPayload {
  name: string;
  email: string;
  phone: string;
  siretNumber: string;
  rcsCity: string;
  vatNumber: string;
  address: {
    name: string;
    streetNumber: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    type: 'billing';
    latitude: number;
    longitude: number;
  };
  defaultBankDetail: {
    bankLabel: string;
    bankName: string;
    iban: string;
    bic: string;
    bankCode: string;
    accountNumber: string;
  };
}

export interface InviteTenantUserPayload {
  email: string;
  roles: string[];
}

export interface UpdateTenantUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export type UpdateTenantPayload = Partial<CreateTenantPayload>;

export const tenantsService = {
  getList: (filters: TenantListFilters, token: string, pagination?: ListPagination) => {
    const query = new URLSearchParams();
    Object.entries({ ...filters, ...pagination }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });
    const qs = query.toString();
    return httpClient.get<AdminTenantListResponse>(`/tenant${qs ? `?${qs}` : ''}`, { token });
  },

  getOptions: (token: string) => httpClient.get<TenantOption[]>('/tenant/options', { token }),

  getById: (id: string, token: string) =>
    httpClient.get<ITenant>(`/tenant/${id}`, { token }),

  create: (data: CreateTenantPayload, token: string) =>
    httpClient.post<ITenant>('/tenant', data, { token }),

  getUsers: (tenantId: string, token: string) =>
    httpClient.get<IUser[]>(`/tenant/${tenantId}/users`, { token }),

  inviteUser: (tenantId: string, data: InviteTenantUserPayload, token: string) =>
    httpClient.post<IUser>(`/tenant/${tenantId}/users/invite`, data, { token }),

  updateUser: (tenantId: string, userId: string, data: UpdateTenantUserPayload, token: string) =>
    httpClient.patch<IUser>(`/tenant/${tenantId}/users/${userId}`, data, { token }),

  update: (id: string, data: UpdateTenantPayload, token: string) =>
    httpClient.patch<ITenant>(`/tenant/${id}`, data, { token }),

  removeUser: (tenantId: string, userId: string, token: string) =>
    httpClient.delete(`/tenant/${tenantId}/users/${userId}`, { token }),

  impersonate: (tenantId: string, userId: string, token: string) =>
    httpClient.post<{ token: string }>(`/tenant/${tenantId}/impersonate/${userId}`, {}, { token }),

  getImpersonationLogs: (tenantId: string, token: string) =>
    httpClient.get<ImpersonationLog[]>(`/tenant/${tenantId}/impersonation-logs`, { token }),

  getAuditLogs: (
    tenantId: string,
    filters: TenantAuditLogFilters,
    token: string,
    pagination?: TenantAuditLogPagination,
  ) => {
    const query = new URLSearchParams();
    Object.entries({ ...filters, ...pagination }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });
    const qs = query.toString();
    return httpClient.get<IAuditLog[]>(
      `/tenant/${tenantId}/audit-logs${qs ? `?${qs}` : ''}`,
      { token },
    );
  },

  getSubscriptionInvoices: (
    tenantId: string,
    filters: TenantSubscriptionInvoiceFilters,
    token: string,
    pagination?: TenantSubscriptionInvoicePagination,
  ) => {
    const query = new URLSearchParams();
    Object.entries({ ...filters, ...pagination }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });
    const qs = query.toString();
    return httpClient.get<GetAdminTenantSubscriptionInvoiceReadResponse>(
      `/tenant/${tenantId}/subscription-invoice${qs ? `?${qs}` : ''}`,
      { token },
    );
  },

  downloadSubscriptionInvoicePdf: (tenantId: string, invoiceId: string, token: string) =>
    httpClient.get<Blob>(
      `/tenant/${tenantId}/subscription-invoice/${invoiceId}/pdf`,
      { token, responseType: 'blob' },
    ),

  downloadCreditNotePdf: (tenantId: string, creditNoteId: string, token: string) =>
    httpClient.get<Blob>(
      `/tenant/${tenantId}/credit-note/${creditNoteId}/pdf`,
      { token, responseType: 'blob' },
    ),

  refundSubscriptionInvoice: (
    tenantId: string,
    invoiceId: string,
    body: IRefundSubscriptionInvoiceDto,
    token: string,
  ) =>
    httpClient.post<RefundSubscriptionInvoiceResult>(
      `/tenant/${tenantId}/subscription-invoice/${invoiceId}/refund`,
      body,
      { token },
    ),

  cancelSubscription: (tenantId: string, force: boolean, token: string) =>
    httpClient.delete(
      `/tenant/${tenantId}/subscription${force ? '?force=true' : ''}`,
      { token },
    ),
};
