import { httpClient } from '@/services/http/httpClient';
import type {
  IFeature,
  IPlan,
  IPlanDto,
  GetAdminTenantSubscriptionReadResponse,
} from '@/types/generated/api-types';

export type TenantSubscriptionRead = GetAdminTenantSubscriptionReadResponse;

export const plansService = {
  getAll: (token: string) => httpClient.get<IPlan[]>('/plan', { token }),

  getById: (id: string, token: string) => httpClient.get<IPlan>(`/plan/${id}`, { token }),

  // Both POST and PATCH share IPlanDto. On PATCH, planFeatures = null leaves
  // features untouched, [] clears them, [...] replaces wholesale.
  create: (data: IPlanDto, token: string) => httpClient.post<IPlan>('/plan', data, { token }),

  update: (id: string, data: IPlanDto, token: string) =>
    httpClient.patch<IPlan>(`/plan/${id}`, data, { token }),

  delete: (id: string, token: string) => httpClient.delete(`/plan/${id}`, { token }),

  duplicate: (id: string, token: string, name?: string) =>
    httpClient.post<IPlan>(`/plan/${id}/duplicate`, name ? { name } : {}, { token }),
};

export const featuresService = {
  getAll: (token: string) => httpClient.get<IFeature[]>('/feature', { token }),
};

export const subscriptionsService = {
  getByTenant: (tenantId: string, token: string) =>
    httpClient.get<TenantSubscriptionRead>(`/tenant/${tenantId}/subscription`, { token }),
};
