import { httpClient } from '@/services/http/httpClient';

export interface AdvanceBillingResult {
  advanced: number;
  skipped: number;
  errors: { tenant: string; error: string }[];
}

export const devToolsService = {
  advanceBilling: (token: string) =>
    httpClient.post<AdvanceBillingResult>('/dev-tools/advance-billing', {}, { token }),
};
