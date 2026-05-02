import { httpClient } from '@/services/http/httpClient';
import type {
  IHubUser,
  IHubUserDto,
  IUpdateHubUserDto,
  IUpdateHubUserRolesDto,
  IUpdatePasswordDto,
} from '@/types/generated/api-types';

export const usersService = {
  getAll: (token: string) => httpClient.get<IHubUser[]>('/user', { token }),

  getById: (id: string, token: string) => httpClient.get<IHubUser>(`/user/${id}`, { token }),

  create: (data: IHubUserDto, token: string) =>
    httpClient.post<{ token: string }>('/user', data, { token }),

  update: (id: string, data: IUpdateHubUserDto, token: string) =>
    httpClient.patch<IHubUser>(`/user/${id}`, data, { token }),

  updatePassword: (id: string, data: IUpdatePasswordDto, token: string) =>
    httpClient.patch<void>(`/user/${id}/password`, data, { token }),

  updateRoles: (id: string, data: IUpdateHubUserRolesDto, token: string) =>
    httpClient.patch<IHubUser>(`/user/${id}/roles`, data, { token }),

  delete: (id: string, token: string) => httpClient.delete(`/user/${id}`, { token }),
};
