'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useMigratePlanVersionCohort,
  usePlanVersionTenants,
} from '@/hooks/api/plans/usePlanVersions';
import { type PlanVersionDiff as PlanVersionDiffType } from '@/services/admin/planVersionsService';
import { PlanVersionDiffView } from '@/components/plans/PlanVersionDiff';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Source version: tenants currently pinned here will be moved. */
  sourceVersionId: string;
  sourceVersionNumber: number;
  /** Target version: where the cohort will be repinned. */
  targetVersionId: string;
  targetVersionNumber: number;
  /** Diff stored on the target version, used to gate consent. */
  targetDiff: PlanVersionDiffType | null;
  planId: string;
}

export function MigrateCohortDialog({
  open,
  onOpenChange,
  sourceVersionId,
  sourceVersionNumber,
  targetVersionId,
  targetVersionNumber,
  targetDiff,
  planId,
}: Props) {
  // Pre-fetch a single page of source-version tenants so the admin sees a
  // headcount before triggering the bulk write. The migrate-cohort backend
  // accepts an explicit subscriptionIds list — we read it from this same page,
  // which means cohorts > 100 must be migrated in batches. Acceptable for MVP.
  const { data: sourcePage } = usePlanVersionTenants(sourceVersionId, 100, 0);
  const migrate = useMigratePlanVersionCohort(targetVersionId, planId);

  const [reason, setReason] = useState('');
  const [consentObtained, setConsentObtained] = useState(false);

  useEffect(() => {
    if (open) {
      setReason('');
      setConsentObtained(false);
    }
  }, [open]);

  const subscriptionIds = (sourcePage?.data ?? []).map((row) => row.subscriptionId);
  const totalOnSource = sourcePage?.total ?? 0;
  const isUnfavorable = targetDiff?.isUnfavorable ?? false;
  const consentRequired = isUnfavorable;
  const submitDisabled =
    subscriptionIds.length === 0 ||
    migrate.isPending ||
    (consentRequired && !consentObtained);

  const handleSubmit = async () => {
    try {
      const result = await migrate.mutateAsync({
        subscriptionIds,
        tenantConsentObtainedAt: consentObtained ? new Date().toISOString() : null,
        reason: reason.trim() === '' ? null : reason.trim(),
      });

      const okCount = result.succeeded.length;
      const failCount = result.failed.length;

      if (failCount === 0) {
        toast.success(`${okCount} tenant${okCount > 1 ? 's' : ''} migré${okCount > 1 ? 's' : ''}`);
      } else {
        toast.warning(
          `${okCount} migré${okCount > 1 ? 's' : ''}, ${failCount} en erreur — voir la console pour le détail`,
        );
        // Aggregated error report logged so the admin can copy/inspect each
        // failure. The dialog stays open on partial failure so the admin can
        // adjust (e.g. record consent) and re-run for the remainder.
        // eslint-disable-next-line no-console
        console.warn('migrate-cohort partial failure', result.failed);
      }

      if (failCount === 0) {
        onOpenChange(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      toast.error(`Migration cohorte refusée : ${message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Migrer la cohorte v{sourceVersionNumber} → v{targetVersionNumber}
          </DialogTitle>
          <DialogDescription>
            Repinne tous les tenants actuellement sur v{sourceVersionNumber} vers v
            {targetVersionNumber}. Les Stripe Prices ne sont pas modifiés — seul le
            droit applicatif change.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm">
            <p className="font-medium text-zinc-900">
              {subscriptionIds.length} tenant{subscriptionIds.length > 1 ? 's' : ''} dans cette page
              {totalOnSource > subscriptionIds.length && (
                <span className="ml-2 text-xs italic text-amber-700">
                  ({totalOnSource} au total — au-delà de 100, migrez par batch)
                </span>
              )}
            </p>
          </div>

          {targetDiff && (
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                {isUnfavorable ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                )}
                Diff v{targetVersionNumber} vs version précédente
              </p>
              <PlanVersionDiffView diff={targetDiff} />
            </div>
          )}

          {consentRequired && (
            <Alert variant="default" className="border-amber-200 bg-amber-50 text-amber-900">
              <AlertTriangle className="h-4 w-4 text-amber-700" />
              <AlertDescription>
                <p className="font-semibold">Migration défavorable.</p>
                <p className="mt-1 text-sm">
                  Le serveur refusera chaque tenant tant que le consentement n’est pas
                  enregistré. Cochez la case ci-dessous une fois l’accord obtenu pour
                  l’ensemble de la cohorte — vous engagez votre responsabilité d’admin.
                </p>
                <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={consentObtained}
                    onChange={(e) => setConsentObtained(e.target.checked)}
                  />
                  <span>
                    Tous les tenants concernés ont confirmé leur accord (à conserver dans
                    l’audit trail).
                  </span>
                </label>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="cohort-reason">Raison (optionnel, ≤ 500 caractères)</Label>
            <Input
              id="cohort-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              placeholder="Ex. Bascule programmée des contrats signés en 2025"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={submitDisabled}>
            {migrate.isPending ? 'Migration en cours…' : 'Migrer la cohorte'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
