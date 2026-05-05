import { httpClient } from '@/services/http/httpClient';

export interface AdvanceBillingResult {
  advanced: number;
  skipped: number;
  errors: { tenant: string; error: string }[];
}

export interface GenerateOverageInvoicesResult {
  billed: number;
  skipped: number;
  errors: number;
}

export const devToolsService = {
  advanceBilling: (token: string) =>
    httpClient.post<AdvanceBillingResult>('/dev-tools/advance-billing', {}, { token }),
  generateOverageInvoices: (token: string) =>
    httpClient.post<GenerateOverageInvoicesResult>(
      '/dev-tools/generate-overage-invoices',
      {},
      { token },
    ),
};
