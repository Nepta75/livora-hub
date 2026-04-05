import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { seedService } from '@/services/admin/seedService';

export function useAdminSeed() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: () => seedService.seed(token),
  });
}
