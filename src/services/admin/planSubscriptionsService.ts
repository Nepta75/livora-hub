import { httpClient } from '@/services/http/httpClient';
import type { GetAdminPlanSubscriptionsReadResponse } from '@/types/generated/api-types';

export type PlanSubscriptionRow = GetAdminPlanSubscriptionsReadResponse[number];

export const planSubscriptionsService = {
  getByPlan: (planId: string, token: string) =>
    httpClient.get<GetAdminPlanSubscriptionsReadResponse>(
      `/plan/${planId}/subscriptions`,
      { token },
    ),
};
