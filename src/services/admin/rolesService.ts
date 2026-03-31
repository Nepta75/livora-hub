import { httpClient } from '@/services/http/httpClient';

export const rolesService = {
  getAll: (token: string) => httpClient.get<{ roles: string[] }>('/roles', { token }),
};
