'use client';

import { useState } from 'react';
import { ArrowRightLeft, History, Lock, Unlock, Users } from 'lucide-react';
import { usePlanVersions } from '@/hooks/api/plans/usePlanVersions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlanVersionDiffView } from '@/components/plans/PlanVersionDiff';
import { MigrateCohortDialog } from '@/components/plans/MigrateCohortDialog';
import type { PlanVersionListItem } from '@/services/admin/planVersionsService';

function formatEuro(value: number | null): string {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface Props {
  planId: string;
}

interface CohortTarget {
  source: PlanVersionListItem;
  target: PlanVersionListItem;
}

export function PlanVersionTimeline({ planId }: Props) {
  const { data, isLoading, error } = usePlanVersions(planId);
  const [cohortTarget, setCohortTarget] = useState<CohortTarget | null>(null);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4 text-muted-foreground" />
          Historique des versions
          {data && (
            <Badge variant="secondary" className="ml-2 font-mono text-xs">
              {data.length} {data.length > 1 ? 'versions' : 'version'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 rounded bg-muted animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm italic text-red-600">
            Impossible de charger l’historique des versions.
          </p>
        ) : !data || data.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">
            Aucune version pour ce plan. Lancez `app:plan:backfill-versions` pour matérialiser v1.
          </p>
        ) : (
          <ol className="space-y-4">
            {data.map((version, index) => {
              // The list is newest-first. The "older neighbour" of v(N) sits at
              // index+1 — that's the cohort source when admin clicks "Migrer
              // depuis v(N-1)" on the v(N) row. The latest version (index 0)
              // therefore offers cohort migration if a previous version exists
              // and still has tenants pinned to it.
              const olderNeighbour = data[index + 1];
              const cohortAvailable =
                olderNeighbour !== undefined && olderNeighbour.tenantCount > 0;

              return (
              <li key={version.id} className="rounded-md border border-zinc-200 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-base font-semibold">v{version.versionNumber}</span>
                  {version.isFrozen ? (
                    <Badge
                      variant="secondary"
                      className="gap-1 border-zinc-200 bg-zinc-100 text-zinc-700"
                    >
                      <Lock className="h-3 w-3" />
                      Frozen
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700"
                    >
                      <Unlock className="h-3 w-3" />
                      Brouillon (mutable)
                    </Badge>
                  )}
                  <Badge variant="secondary" className="gap-1 font-mono">
                    <Users className="h-3 w-3" />
                    {version.tenantCount}
                  </Badge>
                  {cohortAvailable && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCohortTarget({ source: olderNeighbour, target: version })
                      }
                      className="ml-auto"
                    >
                      <ArrowRightLeft className="h-3 w-3 mr-1" />
                      Migrer v{olderNeighbour.versionNumber} → v{version.versionNumber}
                    </Button>
                  )}
                  <span className={cohortAvailable ? 'text-xs text-muted-foreground' : 'ml-auto text-xs text-muted-foreground'}>
                    {formatDate(version.createdAt)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4">
                  <div>
                    <span className="text-muted-foreground">Mensuel : </span>
                    <span className="font-mono">{formatEuro(version.monthlyPriceEuro)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Annuel : </span>
                    <span className="font-mono">{formatEuro(version.annualPriceEuro)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Essai : </span>
                    <span className="font-mono">
                      {version.trialDays === null ? '—' : `${version.trialDays} j`}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CTA : </span>
                    <span>{version.ctaLabel ?? '—'}</span>
                  </div>
                </div>

                {version.changeReason && (
                  <p className="mt-2 text-xs italic text-muted-foreground">
                    Raison : {version.changeReason}
                  </p>
                )}

                {version.diffVsPrevious && version.diffVsPrevious.hasChanges && (
                  <>
                    <Separator className="my-3" />
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Diff vs v{version.versionNumber - 1}
                    </p>
                    <PlanVersionDiffView diff={version.diffVsPrevious} />
                  </>
                )}
              </li>
            );
            })}
          </ol>
        )}
      </CardContent>

      {cohortTarget && (
        <MigrateCohortDialog
          open={cohortTarget !== null}
          onOpenChange={(open) => {
            if (!open) setCohortTarget(null);
          }}
          sourceVersionId={cohortTarget.source.id}
          sourceVersionNumber={cohortTarget.source.versionNumber}
          targetVersionId={cohortTarget.target.id}
          targetVersionNumber={cohortTarget.target.versionNumber}
          targetDiff={cohortTarget.target.diffVsPrevious}
          planId={planId}
        />
      )}
    </Card>
  );
}
