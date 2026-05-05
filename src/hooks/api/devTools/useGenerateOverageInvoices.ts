import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { devToolsService } from '@/services/admin/devToolsService';

export function useGenerateOverageInvoices() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => devToolsService.generateOverageInvoices(token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'billing'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'plan-subscriptions'] });
    },
  });
}
