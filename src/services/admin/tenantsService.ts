import { httpClient } from '@/services/http/httpClient';
import type { ITenant, IUser } from '@/types/generated/api-types';

export interface CreateTenantPayload {
  name: string;
  email: string;
  phone: string;
  siretNumber: string;
  rcsCity: string;
  vatNumber: string;
  address: {
    name: string;
    streetNumber: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    type: 'billing';
    latitude: number;
    longitude: number;
  };
  defaultBankDetail: {
    bankLabel: string;
    bankName: string;
    iban: string;
    bic: string;
    bankCode: string;
    accountNumber: string;
  };
}

export interface InviteTenantUserPayload {
  email: string;
  roles: string[];
}

export interface UpdateTenantUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export type UpdateTenantPayload = Partial<CreateTenantPayload>;

export const tenantsService = {
  getAll: (token: string) => httpClient.get<ITenant[]>('/tenant', { token }),

  getById: (id: string, token: string) =>
    httpClient.get<ITenant>(`/tenant/${id}`, { token }),

  create: (data: CreateTenantPayload, token: string) =>
    httpClient.post<ITenant>('/tenant', data, { token }),

  getUsers: (tenantId: string, token: string) =>
    httpClient.get<IUser[]>(`/tenant/${tenantId}/users`, { token }),

  inviteUser: (tenantId: string, data: InviteTenantUserPayload, token: string) =>
    httpClient.post<IUser>(`/tenant/${tenantId}/users/invite`, data, { token }),

  updateUser: (tenantId: string, userId: string, data: UpdateTenantUserPayload, token: string) =>
    httpClient.patch<IUser>(`/tenant/${tenantId}/users/${userId}`, data, { token }),

  update: (id: string, data: UpdateTenantPayload, token: string) =>
    httpClient.patch<ITenant>(`/tenant/${id}`, data, { token }),

  removeUser: (tenantId: string, userId: string, token: string) =>
    httpClient.delete(`/tenant/${tenantId}/users/${userId}`, { token }),
};
