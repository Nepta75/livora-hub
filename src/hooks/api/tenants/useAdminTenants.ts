import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import {
  tenantsService,
  type CreateTenantPayload,
  type InviteTenantUserPayload,
  type UpdateTenantPayload,
  type UpdateTenantUserPayload,
} from '@/services/admin/tenantsService';

export const TENANTS_KEYS = {
  all: ['admin', 'tenants'] as const,
  detail: (id: string) => ['admin', 'tenants', id] as const,
  users: (id: string) => ['admin', 'tenants', id, 'users'] as const,
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
    mutationFn: (tenantId: string) => tenantsService.impersonate(tenantId, token),
  });
}
