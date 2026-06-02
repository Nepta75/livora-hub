import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { devToolsService } from '@/services/admin/devToolsService';

const driverSimulationKey = (tenantId: string) =>
  ['admin', 'dev-tools', 'driver-simulation', tenantId] as const;

export function useDriverSimulationStatus(tenantId: string | null) {
  const { token } = useAuth();

  return useQuery({
    queryKey: driverSimulationKey(tenantId ?? ''),
    queryFn: () => devToolsService.getDriverSimulationStatus(token, tenantId!),
    enabled: !!token && !!tenantId,
    // The status changes from outside the hub (CLI worker ticks lastTickAt).
    // 5s polling keeps the card fresh without becoming noisy.
    refetchInterval: 5000,
  });
}

export function useStartDriverSimulation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string) => devToolsService.startDriverSimulation(token, tenantId),
    onSuccess: (_, tenantId) => {
      void queryClient.invalidateQueries({ queryKey: driverSimulationKey(tenantId) });
    },
  });
}

export function useStopDriverSimulation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string) => devToolsService.stopDriverSimulation(token, tenantId),
    onSuccess: (_, tenantId) => {
      void queryClient.invalidateQueries({ queryKey: driverSimulationKey(tenantId) });
    },
  });
}

export function useSimulateDriverDeviation() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (tenantId: string) => devToolsService.simulateDriverDeviation(token, tenantId),
  });
}
