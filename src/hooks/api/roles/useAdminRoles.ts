import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { rolesService } from '@/services/admin/rolesService';

export const ROLES_KEYS = {
  all: ['admin', 'roles'] as const,
};

export function useAdminRoles() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ROLES_KEYS.all,
    queryFn: () => rolesService.getAll(token),
    enabled: !!token,
  });
}
