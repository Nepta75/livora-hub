import { httpClient } from '@/services/http/httpClient';
import type {
  IHubUser,
  IHubUserDto,
  IUpdateHubUserDto,
  IUpdateHubUserRolesDto,
  IUpdatePasswordDto,
} from '@/types/generated/api-types';
import type { ListPagination } from '@/services/admin/tenantsService';

/** Free-text filter for the paginated hub users listing. */
export interface HubUserListFilters {
  search?: string;
}

/** Shape returned by GET /admin/user (paginated). */
export interface AdminHubUserListResponse {
  data: IHubUser[];
  total: number;
}

export const usersService = {
  getList: (filters: HubUserListFilters, token: string, pagination?: ListPagination) => {
    const query = new URLSearchParams();
    Object.entries({ ...filters, ...pagination }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });
    const qs = query.toString();
    return httpClient.get<AdminHubUserListResponse>(`/user${qs ? `?${qs}` : ''}`, { token });
  },

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
