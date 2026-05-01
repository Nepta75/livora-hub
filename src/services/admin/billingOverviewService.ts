import { httpClient } from '@/services/http/httpClient';
import type {
  get_admin_billing_overviewResponse,
  get_admin_billing_pending_recordsResponse,
  post_admin_billing_run_cronResponse,
} from '@/types/generated/api-types';

export type BillingOverviewRow = get_admin_billing_overviewResponse[number];
export type BillingPendingRecord = get_admin_billing_pending_recordsResponse[number];
export type BillingRunResult = post_admin_billing_run_cronResponse;

export const billingOverviewService = {
  getOverview: (token: string) =>
    httpClient.get<get_admin_billing_overviewResponse>('/billing/overview', { token }),

  getPendingRecords: (token: string) =>
    httpClient.get<get_admin_billing_pending_recordsResponse>('/billing/pending-records', { token }),

  runCron: (token: string) =>
    httpClient.post<BillingRunResult>('/billing/run-cron', {}, { token }),
};
