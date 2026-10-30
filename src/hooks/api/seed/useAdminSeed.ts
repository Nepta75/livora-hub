import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { seedService, type SeedOptions } from '@/services/admin/seedService';

export function useAdminSeed() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (options: SeedOptions = {}) => seedService.seed(token, options),
  });
}
