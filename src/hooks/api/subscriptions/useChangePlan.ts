import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import {
  subscriptionPlanChangeService,
  type ChangePlanCommitPayload,
  type ChangePlanPreviewPayload,
} from '@/services/admin/subscriptionPlanChangeService';
const PREVIEW_KEY = (tenantId: string, body: ChangePlanPreviewPayload | null) =>
  ['admin', 'tenants', tenantId, 'subscription', 'change-plan-preview', body] as const;

interface UseChangePlanPreviewArgs {
  tenantId: string;
  body: ChangePlanPreviewPayload | null;
  enabled?: boolean;
}

export function useChangePlanPreview({
  tenantId,
  body,
  enabled = true,
}: UseChangePlanPreviewArgs) {
  const { token } = useAuth();

  return useQuery({
    queryKey: PREVIEW_KEY(tenantId, body),
    queryFn: () => {
      if (!body) throw new Error('Preview body required');
      return subscriptionPlanChangeService.preview(tenantId, body, token);
    },
    enabled: enabled && !!tenantId && !!body,
    // The preview is a billable Stripe round-trip and locked to a specific
    // proration_date — never reuse a stale result, refetch every time the
    // body changes.
    staleTime: 0,
    retry: false,
  });
}

export function useChangePlan(tenantId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ChangePlanCommitPayload) =>
      subscriptionPlanChangeService.changePlan(tenantId, body, token),
    onSuccess: () => {
      // ['admin', 'tenants', tenantId] is a strict prefix of
      // SUBSCRIPTION_KEYS.byTenant(tenantId) so the single invalidation
      // already matches both query keys.
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants', tenantId] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'plan-subscriptions'] });
    },
  });
}

export function useCancelPendingPlanChange(tenantId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => subscriptionPlanChangeService.cancelPendingChange(tenantId, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants', tenantId] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'plan-subscriptions'] });
    },
  });
}
