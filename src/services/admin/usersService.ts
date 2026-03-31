import { httpClient } from '@/services/http/httpClient';
import type { IHubUser } from '@/types/generated/api-types';

export interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles: string[];
}

export interface UpdateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdatePasswordPayload {
  password: string;
}

export interface UpdateRolesPayload {
  roles: string[];
}

export const usersService = {
  getAll: (token: string) => httpClient.get<IHubUser[]>('/user', { token }),

  getById: (id: string, token: string) => httpClient.get<IHubUser>(`/user/${id}`, { token }),

  create: (data: CreateUserPayload, token: string) =>
    httpClient.post<{ token: string }>('/user', data, { token }),

  update: (id: string, data: UpdateUserPayload, token: string) =>
    httpClient.patch<IHubUser>(`/user/${id}`, data, { token }),

  updatePassword: (id: string, data: UpdatePasswordPayload, token: string) =>
    httpClient.patch<void>(`/user/${id}/password`, data, { token }),

  updateRoles: (id: string, data: UpdateRolesPayload, token: string) =>
    httpClient.patch<IHubUser>(`/user/${id}/roles`, data, { token }),

  delete: (id: string, token: string) => httpClient.delete(`/user/${id}`, { token }),
};
