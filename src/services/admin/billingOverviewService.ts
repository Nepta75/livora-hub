import { httpClient } from '@/services/http/httpClient';
import type {
  GetAdminBillingOverviewResponse,
  GetAdminBillingPendingRecordsResponse,
  PostAdminBillingRunCronResponse,
} from '@/types/generated/api-types';

export type BillingOverviewRow = GetAdminBillingOverviewResponse[number];
export type BillingPendingRecord = GetAdminBillingPendingRecordsResponse[number];
export type BillingRunResult = PostAdminBillingRunCronResponse;

export const billingOverviewService = {
  getOverview: (token: string) =>
    httpClient.get<GetAdminBillingOverviewResponse>('/billing/overview', { token }),

  getPendingRecords: (token: string) =>
    httpClient.get<GetAdminBillingPendingRecordsResponse>('/billing/pending-records', { token }),

  runCron: (token: string) =>
    httpClient.post<BillingRunResult>('/billing/run-cron', {}, { token }),
};
