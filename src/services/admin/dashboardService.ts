import { httpClient } from '@/services/http/httpClient';
import type { GetAdminDashboardMetricsResponse } from '@/types/generated/api-types';

export type DashboardMetrics = GetAdminDashboardMetricsResponse;
export type DashboardRecentPayment = NonNullable<DashboardMetrics['recentPayments']>[number];
export type DashboardRecentSubscription = NonNullable<DashboardMetrics['recentSubscriptions']>[number];
export type DashboardRecentRefund = NonNullable<
  NonNullable<DashboardMetrics['refunds']>['recent']
>[number];

export const dashboardService = {
  getMetrics: (token: string) =>
    httpClient.get<DashboardMetrics>('/dashboard/metrics', { token }),
};
