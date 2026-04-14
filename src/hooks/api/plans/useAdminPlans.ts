import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  plansService,
  featuresService,
  subscriptionsService,
  type CreatePlanPayload,
  type UpdatePlanPayload,
} from '@/services/admin/plansService';
import type { IPlan } from '@/types/generated/api-types';

export const PLANS_KEYS = {
  all: ['admin', 'plans'] as const,
  detail: (id: string) => ['admin', 'plans', id] as const,
};

export const FEATURES_KEYS = {
  all: ['admin', 'features'] as const,
};

export const SUBSCRIPTION_KEYS = {
  byTenant: (tenantId: string) => ['admin', 'tenants', tenantId, 'subscription'] as const,
};

export function useAdminPlans() {
  const { token } = useAuth();

  return useQuery({
    queryKey: PLANS_KEYS.all,
    queryFn: () => plansService.getAll(token),
  });
}

export function useAdminPlan(id: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: PLANS_KEYS.detail(id),
    queryFn: () => plansService.getById(id, token),
    enabled: !!id,
  });
}

export function useCreateAdminPlan() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlanPayload) => plansService.create(data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PLANS_KEYS.all });
    },
  });
}

export function useUpdateAdminPlan(id: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePlanPayload) => plansService.update(id, data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PLANS_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: PLANS_KEYS.detail(id) });
    },
  });
}

export function useDeleteAdminPlan() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plansService.delete(id, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PLANS_KEYS.all });
    },
  });
}

export function useDuplicateAdminPlan() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name?: string }) =>
      plansService.duplicate(id, token, name),
    onSuccess: (newPlan: IPlan) => {
      void queryClient.invalidateQueries({ queryKey: PLANS_KEYS.all });
      toast.success('Plan dupliqué');
      if (newPlan?.id) {
        router.push(`/plans/${newPlan.id}`);
      }
    },
  });
}

export function useAdminFeatures() {
  const { token } = useAuth();

  return useQuery({
    queryKey: FEATURES_KEYS.all,
    queryFn: () => featuresService.getAll(token),
  });
}

export function useTenantSubscription(tenantId: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.byTenant(tenantId),
    queryFn: () => subscriptionsService.getByTenant(tenantId, token),
    enabled: !!tenantId,
    retry: false,
  });
}
