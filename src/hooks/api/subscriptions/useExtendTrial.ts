import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import {
  subscriptionTrialService,
  type ExtendTrialPayload,
} from '@/services/admin/subscriptionTrialService';

export function useExtendTrial(tenantId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ExtendTrialPayload) =>
      subscriptionTrialService.extendTrial(tenantId, body, token),
    onSuccess: () => {
      // ['admin', 'tenants', tenantId] is a strict prefix of both the
      // subscription detail key and the tenant detail key, so a single
      // invalidation refreshes the whole tenant page.
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants', tenantId] });
    },
  });
}
