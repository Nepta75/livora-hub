import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { devToolsService } from '@/services/admin/devToolsService';

export function usePurgeTenantSeedData() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string) => devToolsService.purgeTenantSeedData(token, tenantId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
    },
  });
}
