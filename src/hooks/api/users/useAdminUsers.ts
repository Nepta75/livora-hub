import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { usersService, type CreateUserPayload, type UpdateUserPayload, type UpdatePasswordPayload, type UpdateRolesPayload } from '@/services/admin/usersService';

export const USERS_KEYS = {
  all: ['admin', 'users'] as const,
  detail: (id: string) => ['admin', 'users', id] as const,
};

export function useAdminUsers() {
  const { token } = useAuth();

  return useQuery({
    queryKey: USERS_KEYS.all,
    queryFn: () => usersService.getAll(token),
  });
}

export function useAdminUser(id: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: USERS_KEYS.detail(id),
    queryFn: () => usersService.getById(id, token),
    enabled: !!id,
  });
}

export function useCreateAdminUser() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserPayload) => usersService.create(data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USERS_KEYS.all });
    },
  });
}

export function useUpdateAdminUser(id: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserPayload) => usersService.update(id, data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USERS_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: USERS_KEYS.detail(id) });
    },
  });
}

export function useUpdateAdminUserPassword(id: string) {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (data: UpdatePasswordPayload) => usersService.updatePassword(id, data, token),
  });
}

export function useUpdateAdminUserRoles(id: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRolesPayload) => usersService.updateRoles(id, data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USERS_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: USERS_KEYS.detail(id) });
    },
  });
}

export function useDeleteAdminUser() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.delete(id, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USERS_KEYS.all });
    },
  });
}
