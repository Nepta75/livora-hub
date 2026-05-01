import { httpClient } from '@/services/http/httpClient';
import type { get_admin_billing_overviewResponse } from '@/types/generated/api-types';

export type BillingOverviewRow = get_admin_billing_overviewResponse[number];

export const billingOverviewService = {
  getOverview: (token: string) =>
    httpClient.get<get_admin_billing_overviewResponse>('/billing/overview', { token }),
};
