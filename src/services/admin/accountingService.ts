import { httpClient } from '@/services/http/httpClient';

export const accountingService = {
  // Returns a ZIP (invoice + credit note PDFs + sales journal CSV) for the
  // [from, to] issue-date period. `from`/`to` are AAAA-MM-JJ strings.
  exportPeriod: (from: string, to: string, token: string) =>
    httpClient.get<Blob>(
      `/accounting/export?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
      { token, responseType: 'blob' },
    ),
};
