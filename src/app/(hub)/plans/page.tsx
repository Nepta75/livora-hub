'use client';

import { useState } from 'react';
import {
  useAdminPlans,
  useDeleteAdminPlan,
  useDuplicateAdminPlan,
} from '@/hooks/api/plans/useAdminPlans';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Trash2, ChevronDown, ChevronRight, Pencil, Plus, Copy } from 'lucide-react';
import { ACTION } from '@/lib/action-palette';
import { toast } from 'sonner';
import Link from 'next/link';
import type { IPlan, IPlanFeature } from '@/types/generated/api-types';

// Mirror of AdminPlanService::MAX_VISIBLE_STANDARD — backend is the source of truth
// (409 Conflict on create/update beyond cap); this drives the list page UX only.
// Custom plans are negotiated 1-to-1 per client, never shown on the landing, uncapped.
const MAX_VISIBLE_STANDARD = 4;

function PlanFeaturesPanel({ features }: { features: IPlanFeature[] }) {
  const limits = features.filter((f) => f.feature?.type === 'limit');
  const booleans = features.filter((f) => f.feature?.type === 'boolean');

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold mb-2">Limites</p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {limits.map((pf) => (
            <div key={pf.id} className="flex justify-between border rounded px-2 py-1">
              <span className="text-muted-foreground">{pf.feature?.key}</span>
              <span className="font-mono font-semibold">
                {pf.limitValue === -1 ? '∞' : pf.limitValue}
                {pf.overageEnabled && pf.overagePriceEuro != null && (
                  <span className="ml-1 text-orange-500">+€{pf.overagePriceEuro}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Fonctionnalités</p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {booleans.map((pf) => (
            <div key={pf.id} className="flex justify-between border rounded px-2 py-1">
              <span className="text-muted-foreground">{pf.feature?.key}</span>
              <span>{pf.enabled ? '✅' : '❌'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanRow({ plan, isAdmin }: { plan: IPlan; isAdmin: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deletePlan = useDeleteAdminPlan();
  const duplicatePlan = useDuplicateAdminPlan();

  function handleDeleteConfirm() {
    deletePlan.mutate(plan.id, {
      onSuccess: () => {
        toast.success(`Plan "${plan.name}" supprimé`);
        setConfirmOpen(false);
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : 'Erreur'),
    });
  }

  return (
    <>
      <TableRow className="cursor-pointer" onClick={() => setExpanded((e) => !e)}>
        <TableCell>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </TableCell>
        <TableCell className="font-semibold">{plan.name}</TableCell>
        <TableCell>
          <PlanTypeBadge type={plan.type} />
        </TableCell>
        <TableCell>{plan.isVisible ? '✅' : '—'}</TableCell>
        <TableCell>{plan.trialDays ? `${plan.trialDays}j` : '—'}</TableCell>
        <TableCell className="text-muted-foreground text-sm">{plan.description ?? '—'}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          {isAdmin && (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" asChild className={ACTION.neutral}>
                <Link href={`/plans/${plan.id}`} title="Modifier">
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={ACTION.neutral}
                onClick={(e) => {
                  e.stopPropagation();
                  duplicatePlan.mutate(
                    { id: plan.id },
                    {
                      onError: (err) =>
                        toast.error(err instanceof Error ? err.message : 'Erreur'),
                    }
                  );
                }}
                disabled={duplicatePlan.isPending}
                title="Dupliquer"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={ACTION.destructive}
                onClick={() => setConfirmOpen(true)}
                disabled={deletePlan.isPending}
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow>
          <TableCell colSpan={7} className="bg-muted/30 p-4">
            <PlanFeaturesPanel features={plan.planFeatures ?? []} />
          </TableCell>
        </TableRow>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Supprimer le plan</DialogTitle>
            <DialogDescription>
              Supprimer &ldquo;{plan.name}&rdquo; ? Cette action est irréversible. Les tenants déjà
              abonnés à ce plan ne seront pas affectés.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deletePlan.isPending}
            >
              {deletePlan.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PlanTypeBadge({ type }: { type: string }) {
  return (
    <Badge variant={type === 'custom' ? 'secondary' : 'default'}>
      {type === 'custom' ? 'Custom' : 'Standard'}
    </Badge>
  );
}

function VisiblePlanCapBadges({ standard }: { standard: number }) {
  const atCap = standard >= MAX_VISIBLE_STANDARD;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <div
        className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm ${
          atCap ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-border bg-muted/40'
        }`}
      >
        <span className="text-muted-foreground">Plans standard visibles sur la landing</span>
        <span className="font-mono font-semibold">
          {standard}/{MAX_VISIBLE_STANDARD}
        </span>
        {atCap && <span className="text-xs font-medium">— limite atteinte</span>}
      </div>
      <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground">
        Les plans sur mesure ne sont jamais affichés sur la landing.
      </div>
    </div>
  );
}

export default function PlansPage() {
  const { data: plans, isLoading } = useAdminPlans();
  const { userRoles } = useAuth();
  const isAdmin = userRoles?.isAdmin ?? false;

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  const visibleStandard = plans?.filter((p) => p.isVisible && p.type === 'standard').length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Plans</h2>
        {isAdmin && (
          <Button asChild>
            <Link href="/plans/create">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau plan
            </Link>
          </Button>
        )}
      </div>

      <VisiblePlanCapBadges standard={visibleStandard} />

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Public</TableHead>
              <TableHead>Trial</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans?.map((plan) => (
              <PlanRow key={plan.id} plan={plan} isAdmin={isAdmin} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
