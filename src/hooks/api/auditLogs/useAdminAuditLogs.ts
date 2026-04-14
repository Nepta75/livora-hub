import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import {
  auditLogsService,
  type AdminAuditLogFilters,
} from '@/services/admin/auditLogsService';

export const AUDIT_LOGS_PAGE_SIZE = 50;

export const AUDIT_LOGS_KEYS = {
  all: ['admin', 'audit-logs'] as const,
  list: (filters: AdminAuditLogFilters) =>
    ['admin', 'audit-logs', 'list', filters] as const,
  entityTypes: ['admin', 'audit-logs', 'entity-types'] as const,
};

export function useAdminAuditLogs(filters: AdminAuditLogFilters) {
  const { token } = useAuth();

  return useInfiniteQuery({
    queryKey: AUDIT_LOGS_KEYS.list(filters),
    queryFn: ({ pageParam }) =>
      auditLogsService.getAll(token, {
        limit: AUDIT_LOGS_PAGE_SIZE,
        offset: pageParam,
        ...filters,
      }),
    initialPageParam: 0,
    // Stop paginating as soon as a page returns less than a full window.
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < AUDIT_LOGS_PAGE_SIZE ? undefined : allPages.length * AUDIT_LOGS_PAGE_SIZE,
  });
}

export function useAdminAuditLogEntityTypes() {
  const { token } = useAuth();

  return useQuery({
    queryKey: AUDIT_LOGS_KEYS.entityTypes,
    queryFn: () => auditLogsService.getEntityTypes(token),
  });
}
