import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import {
  planVersionsService,
  subscriptionMigrationService,
} from '@/services/admin/planVersionsService';
import { PLANS_KEYS } from '@/hooks/api/plans/useAdminPlans';

export const PLAN_VERSIONS_KEYS = {
  forPlan: (planId: string) => ['admin', 'plans', planId, 'versions'] as const,
  detail: (planVersionId: string) => ['admin', 'plan-versions', planVersionId] as const,
  tenants: (planVersionId: string, limit: number, offset: number) =>
    ['admin', 'plan-versions', planVersionId, 'tenants', limit, offset] as const,
};

export function usePlanVersions(planId: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: PLAN_VERSIONS_KEYS.forPlan(planId),
    queryFn: () => planVersionsService.listForPlan(planId, token),
    enabled: !!planId,
  });
}

export function usePlanVersionDetail(planVersionId: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: PLAN_VERSIONS_KEYS.detail(planVersionId),
    queryFn: () => planVersionsService.getById(planVersionId, token),
    enabled: !!planVersionId,
  });
}

export function usePlanVersionTenants(planVersionId: string, limit = 25, offset = 0) {
  const { token } = useAuth();

  return useQuery({
    queryKey: PLAN_VERSIONS_KEYS.tenants(planVersionId, limit, offset),
    queryFn: () => planVersionsService.listTenants(planVersionId, { limit, offset }, token),
    enabled: !!planVersionId,
  });
}

export function useMigrateSubscriptionVersion(subscriptionId: string, planId?: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      targetPlanVersionId: string;
      tenantConsentObtainedAt?: string | null;
      reason?: string | null;
    }) => subscriptionMigrationService.migrateOne(subscriptionId, body, token),
    onSuccess: () => {
      // Invalidate enough surfaces that any open page sees the new pinned
      // version: subscription detail (badge, latest-version banner), the
      // version list (tenant counts shift), and the plan versions tree.
      void queryClient.invalidateQueries({ queryKey: ['admin', 'plan-versions'] });
      if (planId) {
        void queryClient.invalidateQueries({ queryKey: PLAN_VERSIONS_KEYS.forPlan(planId) });
        void queryClient.invalidateQueries({ queryKey: PLANS_KEYS.detail(planId) });
      }
      // Subscription cache keys live under ['admin', 'tenants', tenantId,
      // 'subscription'] — invalidating the tenants prefix evicts every cached
      // tenant + subscription read in one shot, which is what we want after a
      // pinned-version change.
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
    },
  });
}

export function useMigratePlanVersionCohort(planVersionId: string, planId?: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      subscriptionIds: string[];
      tenantConsentObtainedAt?: string | null;
      reason?: string | null;
    }) => planVersionsService.migrateCohort(planVersionId, body, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'plan-versions'] });
      if (planId) {
        void queryClient.invalidateQueries({ queryKey: PLAN_VERSIONS_KEYS.forPlan(planId) });
      }
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
    },
  });
}
