import { httpClient } from '@/services/http/httpClient';
import type {
  AuditLogAction,
  GetAdminAuditLogsReadResponse,
} from '@/types/generated/api-types';

export interface AdminAuditLogFilters {
  search?: string;
  userEmail?: string;
  entityType?: string;
  entityId?: string;
  action?: AuditLogAction;
  dateFrom?: string;
  dateTo?: string;
  impersonatedByEmail?: string;
}

export interface AdminAuditLogPageParams extends AdminAuditLogFilters {
  limit: number;
  offset: number;
}

function buildQuery(params: AdminAuditLogPageParams): string {
  const query = new URLSearchParams();
  query.set('limit', String(params.limit));
  query.set('offset', String(params.offset));
  if (params.search) query.set('search', params.search);
  if (params.userEmail) query.set('userEmail', params.userEmail);
  if (params.entityType) query.set('entityType', params.entityType);
  if (params.entityId) query.set('entityId', params.entityId);
  if (params.action) query.set('action', params.action);
  if (params.dateFrom) query.set('dateFrom', params.dateFrom);
  if (params.dateTo) query.set('dateTo', params.dateTo);
  if (params.impersonatedByEmail) query.set('impersonatedByEmail', params.impersonatedByEmail);
  return query.toString();
}

export const auditLogsService = {
  /**
   * One window of the journal, plus how many rows match the filters behind it. The count is what
   * lets the screen say it is showing a slice: this feed is unbounded, and one pass of the tenant
   * seed writes hundreds of legitimate hub rows into it.
   */
  getAll: (token: string, params: AdminAuditLogPageParams) =>
    httpClient.get<GetAdminAuditLogsReadResponse>(`/audit-logs?${buildQuery(params)}`, { token }),

  getEntityTypes: (token: string) => httpClient.get<string[]>('/audit-logs/entity-types', { token }),
};
