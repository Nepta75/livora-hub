'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ScrollText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  useAdminAuditLogEntityTypes,
  useAdminAuditLogs,
} from '@/hooks/api/auditLogs/useAdminAuditLogs';
import type { AdminAuditLogFilters } from '@/services/admin/auditLogsService';
import type { AuditLogAction } from '@/types/generated/api-types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AuditLogCard } from '@/components/auditLogs/AuditLogCard';

// base-ui Select requires a concrete value — use a sentinel to express "no filter".
const ALL = '__all__';

const ACTION_OPTIONS: Array<{ value: AuditLogAction; label: string }> = [
  { value: 'CREATE', label: 'Création' },
  { value: 'UPDATE', label: 'Modification' },
  { value: 'DELETE', label: 'Suppression' },
];

function isAuditLogAction(value: string): value is AuditLogAction {
  return value === 'CREATE' || value === 'UPDATE' || value === 'DELETE';
}

function parseFiltersFromSearch(params: URLSearchParams): AdminAuditLogFilters {
  const str = (key: string) => {
    const v = params.get(key);
    return v && v.length > 0 ? v : undefined;
  };
  const rawAction = str('action');
  return {
    search: str('search'),
    userEmail: str('userEmail'),
    entityType: str('entityType'),
    action: rawAction && isAuditLogAction(rawAction) ? rawAction : undefined,
    dateFrom: str('dateFrom'),
    dateTo: str('dateTo'),
    impersonatedByEmail: str('impersonatedByEmail'),
  };
}

function filtersToSearch(filters: AdminAuditLogFilters): string {
  const params = new URLSearchParams();
  (Object.keys(filters) as Array<keyof AdminAuditLogFilters>).forEach((key) => {
    const value = filters[key];
    if (value) params.set(key, value);
  });
  const q = params.toString();
  return q ? `?${q}` : '';
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-xl bg-muted/50 ring-1 ring-foreground/10"
        />
      ))}
    </div>
  );
}

export default function LogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userRoles } = useAuth();
  const isAdmin = userRoles?.isAdmin ?? false;

  // URL is the source of truth for applied filters.
  const applied = useMemo(
    () => parseFiltersFromSearch(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  // Local (draft) state lets text inputs feel snappy while debouncing URL writes.
  const [draft, setDraft] = useState<AdminAuditLogFilters>(applied);

  // Resync draft whenever the URL changes (back/forward nav, external update).
  useEffect(() => {
    setDraft(applied);
  }, [applied]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const writeFilters = useCallback(
    (next: AdminAuditLogFilters) => {
      router.replace(`/logs${filtersToSearch(next)}`, { scroll: false });
    },
    [router],
  );

  const scheduleWrite = useCallback(
    (next: AdminAuditLogFilters) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => writeFilters(next), 300);
    },
    [writeFilters],
  );

  const patchDraft = (patch: Partial<AdminAuditLogFilters>, { debounce }: { debounce: boolean }) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      if (debounce) scheduleWrite(next);
      else writeFilters(next);
      return next;
    });
  };

  const handleReset = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setDraft({});
    writeFilters({});
  };

  const { data: entityTypes } = useAdminAuditLogEntityTypes();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useAdminAuditLogs(applied);

  const logs = data?.pages.flat() ?? [];

  if (!isAdmin) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Journal d&apos;activité admin</h2>
        <p className="mt-4 text-muted-foreground">Accès refusé.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <ScrollText className="h-6 w-6 text-muted-foreground" />
        <div>
          <h2 className="text-2xl font-bold">Journal d&apos;activité admin</h2>
          <p className="text-sm text-muted-foreground">
            Actions réalisées depuis le hub (plans, tenants, utilisateurs) et impersonations.
          </p>
        </div>
      </div>

      <Card size="sm" className="mb-4">
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="audit-search">Recherche</Label>
              <Input
                id="audit-search"
                placeholder="Rechercher dans les messages..."
                value={draft.search ?? ''}
                onChange={(e) =>
                  patchDraft({ search: e.target.value || undefined }, { debounce: true })
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="audit-action">Action</Label>
              <Select
                value={draft.action ?? ALL}
                onValueChange={(v) => {
                  const value = typeof v === 'string' ? v : ALL;
                  patchDraft(
                    { action: value === ALL ? undefined : (value as AuditLogAction) },
                    { debounce: false },
                  );
                }}
              >
                <SelectTrigger id="audit-action" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Toutes les actions</SelectItem>
                  {ACTION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="audit-entity-type">Type d&apos;entité</Label>
              <Select
                value={draft.entityType ?? ALL}
                onValueChange={(v) => {
                  const value = typeof v === 'string' ? v : ALL;
                  patchDraft(
                    { entityType: value === ALL ? undefined : value },
                    { debounce: false },
                  );
                }}
              >
                <SelectTrigger id="audit-entity-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Tous les types</SelectItem>
                  {(entityTypes ?? []).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="audit-user-email">Utilisateur</Label>
              <Input
                id="audit-user-email"
                placeholder="email@exemple.fr"
                value={draft.userEmail ?? ''}
                onChange={(e) =>
                  patchDraft({ userEmail: e.target.value || undefined }, { debounce: true })
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="audit-impersonator">Admin impersonateur</Label>
              <Input
                id="audit-impersonator"
                placeholder="admin@livora.fr"
                value={draft.impersonatedByEmail ?? ''}
                onChange={(e) =>
                  patchDraft(
                    { impersonatedByEmail: e.target.value || undefined },
                    { debounce: true },
                  )
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="audit-date-from">Du</Label>
              <Input
                id="audit-date-from"
                type="date"
                value={draft.dateFrom ?? ''}
                onChange={(e) =>
                  patchDraft({ dateFrom: e.target.value || undefined }, { debounce: false })
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="audit-date-to">Au</Label>
              <Input
                id="audit-date-to"
                type="date"
                value={draft.dateTo ?? ''}
                onChange={(e) =>
                  patchDraft({ dateTo: e.target.value || undefined }, { debounce: false })
                }
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <LoadingSkeleton />
      ) : logs.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
          Aucun événement correspondant aux filtres.
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <AuditLogCard key={log.id} log={log} />
          ))}

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isFetchingNextPage ? 'Chargement...' : 'Charger plus'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
