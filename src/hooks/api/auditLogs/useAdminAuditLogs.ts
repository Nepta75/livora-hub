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
    // Two stop conditions, and BOTH are load bearing.
    //
    // The total is what lets the screen say how much is behind the window, which the old rule
    // ("the page came back short, so we are done") could never answer. But the total alone does not
    // terminate: the listing and the count are two non-transactional queries, so a window can come
    // back empty while the count still reads higher (a concurrent write, or a seed purge deleting
    // rows under the read). `loaded` would then not move, this callback would hand back the same
    // offset, and react-query appends rather than dedupes, so "Charger plus" would refetch the same
    // empty window for ever. Keeping the short-page rule beside the total is what closes that.
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < AUDIT_LOGS_PAGE_SIZE) {
        return undefined;
      }

      const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0);

      return loaded < lastPage.total ? loaded : undefined;
    },
  });
}

export function useAdminAuditLogEntityTypes() {
  const { token } = useAuth();

  return useQuery({
    queryKey: AUDIT_LOGS_KEYS.entityTypes,
    queryFn: () => auditLogsService.getEntityTypes(token),
  });
}
