import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { devToolsService } from '@/services/admin/devToolsService';

export function useAdvanceBilling() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => devToolsService.advanceBilling(token),
    onSuccess: () => {
      // Invalidate everything subscription/billing-related — webhooks
      // landed mid-run will repopulate with fresh data on next read.
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'billing'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'plan-subscriptions'] });
    },
  });
}
