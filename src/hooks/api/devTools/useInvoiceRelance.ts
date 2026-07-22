import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { devToolsService } from '@/services/admin/devToolsService';

/**
 * Move a tenant's issued invoices back in time so they read as overdue.
 *
 * Creates nothing: issuing an invoice reserves a number in a legally sequential series, and a
 * document minted outside the real path would leave a hole in it. Issue one normally in the app,
 * then age it here.
 */
export function useAgeInvoices() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, days }: { tenantId: string; days: number }) =>
      devToolsService.ageInvoices(token, tenantId, days),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'billing'] });
    },
  });
}

/**
 * The per-tenant opt-in. Off for everyone by default and fail-safe, so without flipping it the two
 * run actions below are a silent no-op: nothing sent, nothing logged, nothing wrong.
 */
export function useToggleInvoiceRelance() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: ({ tenantId, enabled }: { tenantId: string; enabled: boolean }) =>
      devToolsService.toggleInvoiceRelance(token, tenantId, enabled),
  });
}

/** Runs the 06:00 chase now, through the real cron service, opt-ins read exactly as in production. */
export function useRunInvoiceRelance() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => devToolsService.runInvoiceRelance(token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'billing'] });
    },
  });
}

/** Runs the 06:30 preview now. It describes TOMORROW's chase, not today's. */
export function useRunInvoiceRelancePreview() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: () => devToolsService.runInvoiceRelancePreview(token),
  });
}
