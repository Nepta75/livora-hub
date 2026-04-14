import { httpClient } from '@/services/http/httpClient';
import type { AuditLogAction, IAuditLog } from '@/types/generated/api-types';

export interface AdminAuditLogFilters {
  search?: string;
  userEmail?: string;
  entityType?: string;
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
  if (params.action) query.set('action', params.action);
  if (params.dateFrom) query.set('dateFrom', params.dateFrom);
  if (params.dateTo) query.set('dateTo', params.dateTo);
  if (params.impersonatedByEmail) query.set('impersonatedByEmail', params.impersonatedByEmail);
  return query.toString();
}

export const auditLogsService = {
  getAll: (token: string, params: AdminAuditLogPageParams) =>
    httpClient.get<IAuditLog[]>(`/audit-logs?${buildQuery(params)}`, { token }),

  getEntityTypes: (token: string) => httpClient.get<string[]>('/audit-logs/entity-types', { token }),
};
