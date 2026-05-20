import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService } from '@/services/admin/dashboardService';

export const DASHBOARD_METRICS_KEYS = {
  all: ['admin', 'dashboard', 'metrics'] as const,
};

export function useAdminDashboardMetrics() {
  const { token } = useAuth();

  return useQuery({
    queryKey: DASHBOARD_METRICS_KEYS.all,
    // Backend caches the aggregate for 60s; align the client cache so tab
    // focus doesn't re-hit the endpoint while ops still see fresh numbers
    // within a minute of a refresh.
    staleTime: 60_000,
    queryFn: () => dashboardService.getMetrics(token),
  });
}
