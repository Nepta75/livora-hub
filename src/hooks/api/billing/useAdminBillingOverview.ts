import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { billingOverviewService } from '@/services/admin/billingOverviewService';

export const BILLING_OVERVIEW_KEYS = {
  all: ['admin', 'billing', 'overview'] as const,
  pending: ['admin', 'billing', 'pending-records'] as const,
};

export function useAdminBillingOverview() {
  const { token } = useAuth();

  return useQuery({
    queryKey: BILLING_OVERVIEW_KEYS.all,
    // Backend already caches the aggregate for 60s; align the client cache so
    // we don't hammer the endpoint on tab focus, but stay short enough that
    // ops see fresh numbers within a minute of refreshing the page.
    staleTime: 60_000,
    queryFn: () => billingOverviewService.getOverview(token),
  });
}

export function useAdminBillingPendingRecords() {
  const { token } = useAuth();

  return useQuery({
    queryKey: BILLING_OVERVIEW_KEYS.pending,
    // No backend cache on this one — the hub uses the count for an alert
    // banner, so a 30s freshness gives ops near-real-time visibility while
    // staying off the endpoint on every tab focus.
    staleTime: 30_000,
    queryFn: () => billingOverviewService.getPendingRecords(token),
  });
}

export function useRunBillingCron() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => billingOverviewService.runCron(token),
    // After a manual run both the overview totals and the pending queue
    // change; invalidate them so the dashboard reflects the result without
    // a manual refresh.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_OVERVIEW_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BILLING_OVERVIEW_KEYS.pending });
    },
  });
}
