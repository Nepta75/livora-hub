import { httpClient } from '@/services/http/httpClient';
import type {
  ChangePlanBillingPeriod,
  ChangePlanProrationBehavior,
  PostAdminTenantSubscriptionChangePlanPreviewResponse,
} from '@/types/generated/api-types';

export type PlanChangePreviewResponse =
  PostAdminTenantSubscriptionChangePlanPreviewResponse;

export interface ChangePlanPreviewPayload {
  targetPlanId: string;
  billingPeriod: ChangePlanBillingPeriod;
  prorationBehavior?: ChangePlanProrationBehavior;
}

export interface ChangePlanCommitPayload extends ChangePlanPreviewPayload {
  reason?: string | null;
  previewedAt: number;
  // Admin override only, bypasses the annual→monthly mid-cycle guard.
  force?: boolean;
}

export const subscriptionPlanChangeService = {
  preview: (
    tenantId: string,
    body: ChangePlanPreviewPayload,
    token: string,
  ) =>
    httpClient.post<PlanChangePreviewResponse>(
      `/tenant/${tenantId}/subscription/change-plan/preview`,
      body,
      { token },
    ),

  changePlan: (tenantId: string, body: ChangePlanCommitPayload, token: string) =>
    httpClient.post(
      `/tenant/${tenantId}/subscription/change-plan`,
      body,
      { token },
    ),

  cancelPendingChange: (tenantId: string, token: string) =>
    httpClient.delete(`/tenant/${tenantId}/subscription/pending-change`, { token }),
};
