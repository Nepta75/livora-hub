import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { billingOverviewService } from '@/services/admin/billingOverviewService';

export const BILLING_OVERVIEW_KEYS = {
  all: ['admin', 'billing', 'overview'] as const,
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
