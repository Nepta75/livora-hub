'use client';

import { useState } from 'react';
import { useAdminPlans, useDeleteAdminPlan } from '@/hooks/api/plans/useAdminPlans';
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
import { Trash2, ChevronDown, ChevronRight, Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import type { IPlan, IPlanFeature } from '@/types/generated/api-types';

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
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/plans/${plan.id}`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => setConfirmOpen(true)}
                disabled={deletePlan.isPending}
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

export default function PlansPage() {
  const { data: plans, isLoading } = useAdminPlans();
  const { userRoles } = useAuth();
  const isAdmin = userRoles?.isAdmin ?? false;

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

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
