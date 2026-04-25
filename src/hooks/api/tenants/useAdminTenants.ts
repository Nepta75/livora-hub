import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import {
  tenantsService,
  type CreateTenantPayload,
  type IAuditLog,
  type ImpersonationLog,
  type InviteTenantUserPayload,
  type TenantAuditLogFilters,
  type TenantAuditLogPagination,
  type TenantSubscriptionInvoiceFilters,
  type UpdateTenantPayload,
  type UpdateTenantUserPayload,
} from '@/services/admin/tenantsService';
import type { get_admin_tenant_subscription_invoice_readResponse } from '@/types/generated/api-types';

export const TENANTS_KEYS = {
  all: ['admin', 'tenants'] as const,
  detail: (id: string) => ['admin', 'tenants', id] as const,
  users: (id: string) => ['admin', 'tenants', id, 'users'] as const,
  impersonationLogs: (id: string) => ['admin', 'tenants', id, 'impersonation-logs'] as const,
  auditLogs: (id: string, filters?: TenantAuditLogFilters) =>
    ['admin', 'tenants', id, 'audit-logs', filters] as const,
  subscriptionInvoices: (
    id: string,
    filters?: TenantSubscriptionInvoiceFilters,
    page?: number,
  ) => ['admin', 'tenants', id, 'subscription-invoices', filters, page] as const,
};

export function useAdminTenants() {
  const { token } = useAuth();

  return useQuery({
    queryKey: TENANTS_KEYS.all,
    queryFn: () => tenantsService.getAll(token),
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

export function useImpersonationLogs(tenantId: string) {
  const { token } = useAuth();

  return useQuery<ImpersonationLog[]>({
    queryKey: TENANTS_KEYS.impersonationLogs(tenantId),
    queryFn: () => tenantsService.getImpersonationLogs(tenantId, token),
  });
}

export function useAdminTenantAuditLogs(
  tenantId: string,
  filters: TenantAuditLogFilters,
  enabled: boolean,
  pagination?: TenantAuditLogPagination,
) {
  const { token } = useAuth();

  return useQuery<IAuditLog[]>({
    queryKey: TENANTS_KEYS.auditLogs(tenantId, filters),
    queryFn: () => tenantsService.getAuditLogs(tenantId, filters, token, pagination),
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

  return useQuery<get_admin_tenant_subscription_invoice_readResponse>({
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
