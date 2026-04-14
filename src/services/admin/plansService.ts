import { httpClient } from '@/services/http/httpClient';
import type {
  IFeature,
  IPlan,
  get_admin_tenant_subscription_readResponse,
} from '@/types/generated/api-types';

export type TenantSubscriptionRead = get_admin_tenant_subscription_readResponse;

export interface CreatePlanPayload {
  name: string;
  type: string;
  isVisible: boolean;
  trialDays?: number | null;
  description?: string | null;
  monthlyPriceEuro?: number | null;
  annualPriceEuro?: number | null;
  isFeatured?: boolean;
  ctaLabel?: string | null;
  planFeatures?: Array<{
    featureKey: string;
    enabled?: boolean | null;
    limitValue?: number | null;
    overageEnabled: boolean;
    overagePriceEuro?: number | null;
  }>;
}

// Full replace — the backend update() always sets all fields.
// planFeatures: null = skip features update; [] = remove all features.
export type UpdatePlanPayload = CreatePlanPayload;

export const plansService = {
  getAll: (token: string) => httpClient.get<IPlan[]>('/plan', { token }),

  getById: (id: string, token: string) => httpClient.get<IPlan>(`/plan/${id}`, { token }),

  create: (data: CreatePlanPayload, token: string) =>
    httpClient.post<IPlan>('/plan', data, { token }),

  update: (id: string, data: UpdatePlanPayload, token: string) =>
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
