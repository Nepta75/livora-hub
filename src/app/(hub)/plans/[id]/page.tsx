'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  useAdminPlan,
  useUpdateAdminPlan,
  useDuplicateAdminPlan,
} from '@/hooks/api/plans/useAdminPlans';
import { usePlanSubscriptions } from '@/hooks/api/plans/usePlanSubscriptions';
import { useAdminAuditLogs } from '@/hooks/api/auditLogs/useAdminAuditLogs';
import { AuditLogCard } from '@/components/auditLogs/AuditLogCard';
import { PlanForm } from '@/components/plans/PlanForm';
import { buildPlanFeaturesPayload, type PlanFeatureState } from '@/components/plans/PlanFeaturesEditor';
import type { PlanFormValues } from '@/validators/plans/validator';
import type { PlanType } from '@/types/generated/api-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, ExternalLink, Copy, AlertTriangle, Loader2, ScrollText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  trialing: 'Période d\'essai',
  past_due: 'Paiement en retard',
  canceled: 'Annulé',
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  trialing: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50',
  past_due: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50',
  canceled: 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-100',
};

function formatEuroCents(cents?: number | null): string {
  if (cents === null || cents === undefined) return '—';
  return (cents / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
}

function formatFrDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR');
}

function PlanSubscriptionsCard({ planId }: { planId: string }) {
  const { data, isLoading } = usePlanSubscriptions(planId);
  const rows = data ?? [];
  const isCapped = rows.length === 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          Tenants abonnés
          {!isLoading && (
            <Badge variant="secondary" className="ml-2 font-mono text-xs">
              {rows.length} {rows.length > 1 ? 'tenants' : 'tenant'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 rounded bg-muted animate-pulse" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Aucun tenant abonné à ce plan.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Prix actuel</TableHead>
                    <TableHead>Tarif</TableHead>
                    <TableHead>Depuis</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(row => {
                    const status = row.status ?? '';
                    return (
                      <TableRow key={row.id ?? `${row.tenantId}-${row.startedAt}`}>
                        <TableCell className="font-medium">
                          {row.tenantName ?? '—'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={STATUS_BADGE_CLASS[status] ?? 'bg-zinc-100 text-zinc-600 border-zinc-200'}
                          >
                            {STATUS_LABELS[status] ?? status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatEuroCents(row.currentPriceEuroCents)}</TableCell>
                        <TableCell>
                          {row.isOnLatestPrice === true ? (
                            <span className="text-emerald-600">✓</span>
                          ) : row.isOnLatestPrice === false ? (
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-xs"
                            >
                              Ancien tarif
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>{formatFrDate(row.startedAt)}</TableCell>
                        <TableCell>
                          {row.tenantId && (
                            <Link
                              href={`/tenants/${row.tenantId}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                              title="Ouvrir la fiche tenant"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {isCapped && (
              <p className="mt-2 text-xs text-muted-foreground">
                Affichage limité aux 100 plus récents.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

const ACTIVE_STATUSES = new Set(['active', 'trialing', 'past_due']);

function PlanHistoryCard({ planId }: { planId: string }) {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useAdminAuditLogs({
    entityType: 'Plan',
    entityId: planId,
  });

  const logs = data?.pages.flat() ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-muted-foreground" />
          Historique
          {!isLoading && (
            <Badge variant="secondary" className="ml-2 font-mono text-xs">
              {logs.length}
              {hasNextPage ? '+' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded bg-muted animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Aucun événement sur ce plan.
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <AuditLogCard key={log.id} log={log} />
            ))}
            {hasNextPage && (
              <div className="flex justify-center pt-2">
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
      </CardContent>
    </Card>
  );
}

export default function EditPlanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { userRoles } = useAuth();
  const { data: plan, isLoading: planLoading } = useAdminPlan(id ?? '');
  const { data: subscriptions } = usePlanSubscriptions(id ?? '');
  const updateMutation = useUpdateAdminPlan(id ?? '');
  const duplicateMutation = useDuplicateAdminPlan();

  const [pendingSubmit, setPendingSubmit] = useState<
    { values: PlanFormValues; features: PlanFeatureState[] } | null
  >(null);

  useEffect(() => {
    if (userRoles && !userRoles.isAdmin) {
      router.push('/plans');
    }
  }, [userRoles, router]);

  if (!id) return <p className="text-destructive">ID de plan manquant.</p>;
  if (userRoles && !userRoles.isAdmin) return null;
  if (planLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (!plan) return <p className="text-destructive">Plan introuvable.</p>;

  const activeCount = (subscriptions ?? []).filter((s) =>
    ACTIVE_STATUSES.has(s.status ?? '')
  ).length;

  const persist = async (values: PlanFormValues, features: PlanFeatureState[]) => {
    try {
      await updateMutation.mutateAsync({
        name: values.name,
        type: values.type,
        isVisible: values.isVisible ?? false,
        trialDays: values.trialDays ?? null,
        description: values.description ?? null,
        monthlyPriceEuro: values.monthlyPriceEuro ?? null,
        annualPriceEuro: values.annualPriceEuro ?? null,
        isFeatured: values.isFeatured ?? false,
        ctaLabel: values.ctaLabel ?? null,
        planFeatures: buildPlanFeaturesPayload(features),
      });
      toast.success('Plan mis à jour');
      router.push('/plans');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue.');
    }
  };

  const onSubmit = async (values: PlanFormValues, features: PlanFeatureState[]) => {
    const priceChanged =
      (values.monthlyPriceEuro ?? null) !== (plan.monthlyPriceEuro ?? null) ||
      (values.annualPriceEuro ?? null) !== (plan.annualPriceEuro ?? null);

    if (priceChanged && activeCount > 0) {
      setPendingSubmit({ values, features });
      return;
    }

    await persist(values, features);
  };

  const defaultValues: PlanFormValues = {
    name: plan.name,
    type: (plan.type === 'custom' ? 'custom' : 'standard') satisfies PlanType,
    isVisible: plan.isVisible ?? false,
    trialDays: plan.trialDays ?? null,
    description: plan.description ?? null,
    monthlyPriceEuro: plan.monthlyPriceEuro ?? null,
    annualPriceEuro: plan.annualPriceEuro ?? null,
    isFeatured: plan.isFeatured ?? false,
    ctaLabel: plan.ctaLabel ?? null,
  };

  const handleDuplicate = () => {
    duplicateMutation.mutate(
      { id },
      {
        onError: (err) => toast.error(err instanceof Error ? err.message : 'Erreur'),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="max-w-3xl flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDuplicate}
          disabled={duplicateMutation.isPending}
        >
          <Copy className="h-4 w-4 mr-2" />
          Dupliquer
        </Button>
      </div>
      {activeCount > 0 && (
        <div className="max-w-3xl flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">
              {activeCount} {activeCount > 1 ? 'tenants sont abonnés' : 'tenant est abonné'} à
              ce plan.
            </p>
            <p className="mt-0.5 text-amber-800">
              Les changements de prix ne s&rsquo;appliquent qu&rsquo;aux nouveaux abonnés. Les
              tenants déjà abonnés gardent leur tarif (grandfathering).
            </p>
          </div>
        </div>
      )}
      <PlanForm
        key={id}
        title={`Modifier le plan — ${plan.name}`}
        defaultValues={defaultValues}
        existingPlanFeatures={plan.planFeatures}
        stripeIds={{
          productId: plan.stripeProductId ?? null,
          monthlyPriceId: plan.stripeMonthlyPriceId ?? null,
          annualPriceId: plan.stripeAnnualPriceId ?? null,
        }}
        onSubmit={onSubmit}
        isPending={updateMutation.isPending}
        submitLabel="Enregistrer les modifications"
      />
      <PlanSubscriptionsCard planId={id} />
      <PlanHistoryCard planId={id} />

      <Dialog
        open={pendingSubmit !== null}
        onOpenChange={(open) => {
          if (!open) setPendingSubmit(null);
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirmer le changement de prix</DialogTitle>
            <DialogDescription>
              {activeCount} {activeCount > 1 ? 'tenants sont abonnés' : 'tenant est abonné'}{' '}
              à ce plan. Un nouveau Price Stripe sera créé et deviendra le tarif par défaut
              pour les futurs abonnements. Les tenants déjà abonnés conserveront leur tarif
              actuel (aucune migration automatique).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingSubmit(null)}>
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!pendingSubmit) return;
                const snapshot = pendingSubmit;
                setPendingSubmit(null);
                await persist(snapshot.values, snapshot.features);
              }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Enregistrement...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
