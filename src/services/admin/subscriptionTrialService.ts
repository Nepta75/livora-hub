import { httpClient } from '@/services/http/httpClient';

export interface ExtendTrialPayload {
  // ISO 8601 datetime, the new trial end date.
  trialEndsAt: string;
  // Mandatory justification, recorded in the audit log.
  reason: string;
}

export const subscriptionTrialService = {
  extendTrial: (tenantId: string, body: ExtendTrialPayload, token: string) =>
    httpClient.post(
      `/tenant/${tenantId}/subscription/extend-trial`,
      body,
      { token },
    ),
};
