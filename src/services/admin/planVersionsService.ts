import { httpClient } from '@/services/http/httpClient';
import type {
  IMigrateCohortDto,
  IMigrateSubscriptionVersionDto,
  IPlanVersionDiff,
  GetAdminPlanVersionReadResponse,
  GetAdminPlanVersionTenantsReadResponse,
  GetAdminPlanVersionsReadResponse,
  PostAdminPlanVersionMigrateCohortResponse,
  PostAdminSubscriptionMigrateVersionResponse,
} from '@/types/generated/api-types';

export type PlanVersionDiff = IPlanVersionDiff;
export type PlanVersionListItem = GetAdminPlanVersionsReadResponse[number];
export type PlanVersionDetail = GetAdminPlanVersionReadResponse;
export type PlanVersionTenantsPage = GetAdminPlanVersionTenantsReadResponse;
export type MigrateOneResponse = PostAdminSubscriptionMigrateVersionResponse;
export type MigrateCohortResponse = PostAdminPlanVersionMigrateCohortResponse;

export const planVersionsService = {
  listForPlan: (planId: string, token: string) =>
    httpClient.get<GetAdminPlanVersionsReadResponse>(`/plan/${planId}/versions`, { token }),

  getById: (planVersionId: string, token: string) =>
    httpClient.get<PlanVersionDetail>(`/plan-version/${planVersionId}`, { token }),

  listTenants: (
    planVersionId: string,
    params: { limit?: number; offset?: number },
    token: string,
  ) => {
    const search = new URLSearchParams();
    if (params.limit !== undefined) search.set('limit', String(params.limit));
    if (params.offset !== undefined) search.set('offset', String(params.offset));
    const query = search.toString();
    const suffix = query ? `?${query}` : '';

    return httpClient.get<PlanVersionTenantsPage>(
      `/plan-version/${planVersionId}/tenants${suffix}`,
      { token },
    );
  },

  migrateCohort: (planVersionId: string, body: IMigrateCohortDto, token: string) =>
    httpClient.post<MigrateCohortResponse>(`/plan-version/${planVersionId}/migrate-cohort`, body, {
      token,
    }),
};

export const subscriptionMigrationService = {
  migrateOne: (subscriptionId: string, body: IMigrateSubscriptionVersionDto, token: string) =>
    httpClient.post<MigrateOneResponse>(`/subscription/${subscriptionId}/migrate-version`, body, {
      token,
    }),
};
