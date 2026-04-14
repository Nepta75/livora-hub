import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { planSubscriptionsService } from '@/services/admin/planSubscriptionsService';

export const PLAN_SUBSCRIPTIONS_KEYS = {
  byPlan: (planId: string) => ['plans', planId, 'subscriptions'] as const,
};

export function usePlanSubscriptions(planId: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: PLAN_SUBSCRIPTIONS_KEYS.byPlan(planId),
    queryFn: () => planSubscriptionsService.getByPlan(planId, token),
    enabled: !!planId,
  });
}
