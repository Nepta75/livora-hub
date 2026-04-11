import { httpClient } from '@/services/http/httpClient';
import type { IFeature, IPlan, ISubscription } from '@/types/generated/api-types';

export interface CreatePlanPayload {
  name: string;
  type: string;
  isPublic: boolean;
  trialDays?: number | null;
  description?: string | null;
  stripeProductId?: string | null;
  stripePriceId?: string | null;
  planFeatures?: Array<{
    featureKey: string;
    enabled?: boolean | null;
    limitValue?: number | null;
    overageEnabled: boolean;
    overagePriceEuro?: number | null;
  }>;
}

export type UpdatePlanPayload = CreatePlanPayload;

export interface CreateSubscriptionPayload {
  planId: string;
  source: string;
  status: string;
  trialEndsAt?: string | null;
  allowOverage?: boolean;
}

export type UpdateSubscriptionPayload = CreateSubscriptionPayload;

export const plansService = {
  getAll: (token: string) => httpClient.get<IPlan[]>('/plan', { token }),

  getById: (id: string, token: string) => httpClient.get<IPlan>(`/plan/${id}`, { token }),

  create: (data: CreatePlanPayload, token: string) =>
    httpClient.post<IPlan>('/plan', data, { token }),

  update: (id: string, data: UpdatePlanPayload, token: string) =>
    httpClient.patch<IPlan>(`/plan/${id}`, data, { token }),

  delete: (id: string, token: string) => httpClient.delete(`/plan/${id}`, { token }),
};

export const featuresService = {
  getAll: (token: string) => httpClient.get<IFeature[]>('/feature', { token }),
};

export const subscriptionsService = {
  getByTenant: (tenantId: string, token: string) =>
    httpClient.get<ISubscription>(`/tenant/${tenantId}/subscription`, { token }),

  create: (tenantId: string, data: CreateSubscriptionPayload, token: string) =>
    httpClient.post<ISubscription>(`/tenant/${tenantId}/subscription`, data, { token }),

  update: (tenantId: string, data: UpdateSubscriptionPayload, token: string) =>
    httpClient.patch<ISubscription>(`/tenant/${tenantId}/subscription`, data, { token }),

  delete: (tenantId: string, token: string) =>
    httpClient.delete(`/tenant/${tenantId}/subscription`, { token }),
};
