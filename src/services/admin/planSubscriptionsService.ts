import { httpClient } from '@/services/http/httpClient';
import type { get_admin_plan_subscriptions_readResponse } from '@/types/generated/api-types';

export type PlanSubscriptionRow = get_admin_plan_subscriptions_readResponse[number];

export const planSubscriptionsService = {
  getByPlan: (planId: string, token: string) =>
    httpClient.get<get_admin_plan_subscriptions_readResponse>(
      `/plan/${planId}/subscriptions`,
      { token },
    ),
};
