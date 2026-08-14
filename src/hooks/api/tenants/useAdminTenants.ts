import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import {
  tenantsService,
  type CreateTenantPayload,
  type InviteTenantUserPayload,
  type TenantAuditLogFilters,
  type TenantListFilters,
  type TenantSubscriptionInvoiceFilters,
  type UpdateTenantPayload,
  type UpdateTenantUserPayload,
} from '@/services/admin/tenantsService';
import { SUBSCRIPTION_KEYS } from '@/hooks/api/plans/useAdminPlans';
import { DASHBOARD_METRICS_KEYS } from '@/hooks/api/dashboard/useAdminDashboardMetrics';
import type {
  GetAdminTenantAuditLogsResponse,
  GetAdminTenantImpersonationLogsResponse,
  GetAdminTenantSubscriptionInvoiceReadResponse,
  IRefundSubscriptionInvoiceDto,
} from '@/types/generated/api-types';

export const TENANTS_PAGE_SIZE = 25;

export const TENANTS_KEYS = {
  all: ['admin', 'tenants'] as const,
  list: (filters: TenantListFilters, page: number) =>
    ['admin', 'tenants', 'list', filters, page] as const,
  options: ['admin', 'tenants', 'options'] as const,
  detail: (id: string) => ['admin', 'tenants', id] as const,
  users: (id: string) => ['admin', 'tenants', id, 'users'] as const,
  embeddedPayment: (id: string) => ['admin', 'tenants', id, 'embedded-payment'] as const,
  impersonationLogs: (id: string) => ['admin', 'tenants', id, 'impersonation-logs'] as const,
  // No window in the key any more: every caller reads this feed through one infinite query with one
  // page size, so the filters ARE the identity of the feed. Keeping the window here would give each
  // "Charger plus" its own cache entry and the pages would stop accumulating.
  auditLogs: (id: string, filters?: TenantAuditLogFilters) =>
    ['admin', 'tenants', id, 'audit-logs', filters] as const,
  subscriptionInvoices: (
    id: string,
    filters?: TenantSubscriptionInvoiceFilters,
    page?: number,
  ) => ['admin', 'tenants', id, 'subscription-invoices', filters, page] as const,
};

/**
 * Paginated, searchable tenants listing. `placeholderData` keeps the previous
 * page on screen while the next one loads, so the table doesn't flash empty.
 */
export function useAdminTenantList(filters: TenantListFilters, page = 0) {
  const { token } = useAuth();

  return useQuery({
    queryKey: TENANTS_KEYS.list(filters, page),
    queryFn: () =>
      tenantsService.getList(filters, token, {
        limit: TENANTS_PAGE_SIZE,
        offset: page * TENANTS_PAGE_SIZE,
      }),
    placeholderData: (prev) => prev,
  });
}

/** Full lightweight `{id, name}` tenant list, for tenant pickers. */
export function useAdminTenants() {
  const { token } = useAuth();

  return useQuery({
    queryKey: TENANTS_KEYS.options,
    queryFn: () => tenantsService.getOptions(token),
  });
}

export function useAdminTenant(id: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: TENANTS_KEYS.detail(id),
    queryFn: () => tenantsService.getById(id, token),
    enabled: !!id,
  });
}

export function useCreateAdminTenant() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantPayload) => tenantsService.create(data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TENANTS_KEYS.all });
    },
  });
}

export function useUpdateAdminTenant(id: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTenantPayload) => tenantsService.update(id, data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TENANTS_KEYS.detail(id) });
      void queryClient.invalidateQueries({ queryKey: TENANTS_KEYS.all });
    },
  });
}

export function useAdminTenantUsers(tenantId: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: TENANTS_KEYS.users(tenantId),
    queryFn: () => tenantsService.getUsers(tenantId, token),
    enabled: !!tenantId,
  });
}

export function useInviteUserToTenant(tenantId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteTenantUserPayload) =>
      tenantsService.inviteUser(tenantId, data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TENANTS_KEYS.users(tenantId) });
    },
  });
}

export function useUpdateTenantUser(tenantId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateTenantUserPayload }) =>
      tenantsService.updateUser(tenantId, userId, data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TENANTS_KEYS.users(tenantId) });
    },
  });
}

export function useRemoveTenantUser(tenantId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => tenantsService.removeUser(tenantId, userId, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TENANTS_KEYS.users(tenantId) });
    },
  });
}

export function useImpersonateTenant() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: ({ tenantId, userId }: { tenantId: string; userId: string }) =>
      tenantsService.impersonate(tenantId, userId, token),
  });
}

/**
 * ⚠️ Both routes clamp `limit` to 100 (`MAX_LIMIT` in `ReadImpersonationLogsController` and
 * `ReadTenantAuditLogsController`). Past that the server serves 100 in silence, the first page comes
 * back "short", `nextWindow` stops, and the screen goes back to a single window with a truncation
 * notice and no way to reach the rest: debt 48 restored, gates green, nothing thrown. The whole
 * design rests on "a short page means the end", so these constants can never exceed the server cap.
 */
export const TENANT_IMPERSONATION_LOGS_PAGE_SIZE = 50;

export const TENANT_AUDIT_LOGS_PAGE_SIZE = 50;

/**
 * Both stop conditions, and both are load bearing. Same rule as `useAdminAuditLogs`, and it is
 * repeated rather than shared because getting it wrong is silent in opposite ways.
 *
 * The total is what lets the screen say how much is behind the window. It does not terminate on its
 * own: the listing and the count are two non-transactional queries, so a window can come back empty
 * while the count still reads higher (a concurrent write, a seed purge deleting rows under the
 * read). `loaded` would then not move, this callback would hand back the same offset, and
 * react-query appends rather than dedupes, so "Charger plus" would refetch the same empty window
 * for ever. The short-page rule beside the total is what closes that.
 */
function nextWindow<T extends { data: unknown[]; total: number }>(
  pageSize: number,
): (lastPage: T, allPages: T[]) => number | undefined {
  return (lastPage, allPages) => {
    if (lastPage.data.length < pageSize) {
      return undefined;
    }

    const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0);

    return loaded < lastPage.total ? loaded : undefined;
  };
}

/**
 * The tenant's access register, one window at a time.
 *
 * It said how many rows it was leaving out since debt 41 and had no way to reach them, because
 * nothing sent `limit` or `offset` to a route that has accepted them since 2026-08-14: a tenant at
 * 250 accesses read "100 accès affichés sur 250" and stopped there. Debt 48.
 */
export function useImpersonationLogs(tenantId: string) {
  const { token } = useAuth();

  return useInfiniteQuery<GetAdminTenantImpersonationLogsResponse>({
    queryKey: TENANTS_KEYS.impersonationLogs(tenantId),
    queryFn: ({ pageParam }) =>
      tenantsService.getImpersonationLogs(tenantId, token, {
        limit: TENANT_IMPERSONATION_LOGS_PAGE_SIZE,
        offset: pageParam as number,
      }),
    initialPageParam: 0,
    getNextPageParam: nextWindow(TENANT_IMPERSONATION_LOGS_PAGE_SIZE),
    enabled: !!tenantId,
  });
}

export function useAdminTenantAuditLogs(
  tenantId: string,
  filters: TenantAuditLogFilters,
  enabled: boolean,
) {
  const { token } = useAuth();

  return useInfiniteQuery<GetAdminTenantAuditLogsResponse>({
    queryKey: TENANTS_KEYS.auditLogs(tenantId, filters),
    queryFn: ({ pageParam }) =>
      tenantsService.getAuditLogs(tenantId, filters, token, {
        limit: TENANT_AUDIT_LOGS_PAGE_SIZE,
        offset: pageParam as number,
      }),
    initialPageParam: 0,
    getNextPageParam: nextWindow(TENANT_AUDIT_LOGS_PAGE_SIZE),
    enabled: enabled && !!tenantId,
  });
}

export const TENANT_SUBSCRIPTION_INVOICES_PAGE_SIZE = 25;

export function useAdminTenantSubscriptionInvoices(
  tenantId: string,
  filters: TenantSubscriptionInvoiceFilters = {},
  page = 0,
  enabled = true,
) {
  const { token } = useAuth();

  return useQuery<GetAdminTenantSubscriptionInvoiceReadResponse>({
    queryKey: TENANTS_KEYS.subscriptionInvoices(tenantId, filters, page),
    queryFn: () =>
      tenantsService.getSubscriptionInvoices(tenantId, filters, token, {
        limit: TENANT_SUBSCRIPTION_INVOICES_PAGE_SIZE,
        offset: page * TENANT_SUBSCRIPTION_INVOICES_PAGE_SIZE,
      }),
    enabled: enabled && !!tenantId,
    placeholderData: prev => prev,
  });
}

export function useCancelTenantSubscription(tenantId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (force: boolean) => tenantsService.cancelSubscription(tenantId, force, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.byTenant(tenantId) });
      void queryClient.invalidateQueries({ queryKey: TENANTS_KEYS.detail(tenantId) });
    },
  });
}

export function useDownloadAdminTenantSubscriptionInvoice(tenantId: string) {
  const { token } = useAuth();

  return useMutation({
    mutationFn: async ({ invoiceId, invoiceNumber }: { invoiceId: string; invoiceNumber: string }) => {
      const blob = await tenantsService.downloadSubscriptionInvoicePdf(tenantId, invoiceId, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}

export function useDownloadAdminTenantCreditNote(tenantId: string) {
  const { token } = useAuth();

  return useMutation({
    mutationFn: async ({
      creditNoteId,
      creditNoteNumber,
    }: {
      creditNoteId: string;
      creditNoteNumber: string;
    }) => {
      const blob = await tenantsService.downloadCreditNotePdf(tenantId, creditNoteId, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${creditNoteNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}

export function useRefundAdminTenantSubscriptionInvoice(tenantId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invoiceId, body }: { invoiceId: string; body: IRefundSubscriptionInvoiceDto }) =>
      tenantsService.refundSubscriptionInvoice(tenantId, invoiceId, body, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'tenants', tenantId, 'subscription-invoices'],
      });
      void queryClient.invalidateQueries({ queryKey: TENANTS_KEYS.detail(tenantId) });
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_METRICS_KEYS.all });
    },
  });
}

/**
 * Reservation (auth-then-capture) settings for one tenant: whether Livora enrolled
 * them, plus the tenant-side state that decides whether a reservation would
 * actually happen (online payment on, account collecting, no opt-out).
 */
export function useAdminTenantEmbeddedPayment(tenantId: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: TENANTS_KEYS.embeddedPayment(tenantId),
    queryFn: () => tenantsService.getEmbeddedPayment(tenantId, token),
    enabled: !!tenantId,
  });
}

export function useSetAdminTenantAuthCapture(tenantId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (authCaptureEnabled: boolean) =>
      tenantsService.setAuthCaptureEnabled(tenantId, authCaptureEnabled, token),
    onSuccess: (settings) => {
      queryClient.setQueryData(TENANTS_KEYS.embeddedPayment(tenantId), settings);
    },
  });
}
