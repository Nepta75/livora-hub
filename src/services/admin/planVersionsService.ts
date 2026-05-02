import { httpClient } from '@/services/http/httpClient';

// Types are written by hand here until `yarn generate:api-types` is re-run
// against the backend after the plan-versioning endpoints land. Once the
// generator catches up, replace the local interfaces with the generated ones
// (per CLAUDE.md: never duplicate generated types).
export interface PlanVersionDiffEntry {
  field: string;
  from: unknown;
  to: unknown;
}

export interface PlanVersionDiff {
  favorableChanges: PlanVersionDiffEntry[];
  unfavorableChanges: PlanVersionDiffEntry[];
  isFavorable: boolean;
  isUnfavorable: boolean;
  hasChanges: boolean;
}

export interface PlanVersionListItem {
  id: string;
  versionNumber: number;
  isFrozen: boolean;
  tenantCount: number;
  monthlyPriceEuro: number | null;
  annualPriceEuro: number | null;
  trialDays: number | null;
  description: string | null;
  ctaLabel: string | null;
  changeReason: string | null;
  createdAt: string | null;
  diffVsPrevious: PlanVersionDiff | null;
}

export interface PlanVersionFeatureSnapshot {
  featureKey: string;
  enabled: boolean | null;
  limitValue: number | null;
  overageEnabled: boolean;
  overagePriceEuro: number | null;
}

export interface PlanVersionDetail {
  id: string;
  planId: string;
  planName: string;
  versionNumber: number;
  isFrozen: boolean;
  tenantCount: number;
  monthlyPriceEuro: number | null;
  annualPriceEuro: number | null;
  trialDays: number | null;
  description: string | null;
  ctaLabel: string | null;
  changeReason: string | null;
  createdAt: string | null;
  features: PlanVersionFeatureSnapshot[];
}

export interface PlanVersionTenantRow {
  subscriptionId: string;
  tenantId: string;
  tenantName: string;
  status: string;
  createdAt: string | null;
}

export interface PlanVersionTenantsPage {
  data: PlanVersionTenantRow[];
  total: number;
  limit: number;
  offset: number;
}

export interface MigrateOneResponse {
  subscriptionId: string;
  fromVersionId: string;
  toVersionId: string;
  diff: PlanVersionDiff;
}

export interface MigrateCohortResponse {
  succeeded: Array<{ subscriptionId: string; fromVersionId: string; toVersionId: string }>;
  failed: Array<{ subscriptionId: string; reason: string }>;
}

export const planVersionsService = {
  listForPlan: (planId: string, token: string) =>
    httpClient.get<PlanVersionListItem[]>(`/plan/${planId}/versions`, { token }),

  getById: (planVersionId: string, token: string) =>
    httpClient.get<PlanVersionDetail>(`/plan-version/${planVersionId}`, { token }),

  listTenants: (planVersionId: string, params: { limit?: number; offset?: number }, token: string) => {
    const search = new URLSearchParams();
    if (params.limit !== undefined) search.set('limit', String(params.limit));
    if (params.offset !== undefined) search.set('offset', String(params.offset));
    const query = search.toString();
    const suffix = query ? `?${query}` : '';

    return httpClient.get<PlanVersionTenantsPage>(`/plan-version/${planVersionId}/tenants${suffix}`, {
      token,
    });
  },

  migrateCohort: (
    planVersionId: string,
    body: { subscriptionIds: string[]; tenantConsentObtainedAt?: string | null; reason?: string | null },
    token: string,
  ) =>
    httpClient.post<MigrateCohortResponse>(`/plan-version/${planVersionId}/migrate-cohort`, body, {
      token,
    }),
};

export const subscriptionMigrationService = {
  migrateOne: (
    subscriptionId: string,
    body: {
      targetPlanVersionId: string;
      tenantConsentObtainedAt?: string | null;
      reason?: string | null;
    },
    token: string,
  ) =>
    httpClient.post<MigrateOneResponse>(`/subscription/${subscriptionId}/migrate-version`, body, {
      token,
    }),
};
