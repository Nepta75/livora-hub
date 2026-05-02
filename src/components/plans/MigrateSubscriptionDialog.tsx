'use client';

import { useEffect, useMemo, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePlanVersions, useMigrateSubscriptionVersion } from '@/hooks/api/plans/usePlanVersions';
import {
  type PlanVersionDiff as PlanVersionDiffType,
  type PlanVersionListItem,
} from '@/services/admin/planVersionsService';
import { PlanVersionDiffView } from '@/components/plans/PlanVersionDiff';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId: string;
  planId: string;
  currentPlanVersionId: string | null;
}

/**
 * Computes a synthetic diff using the `diffVsPrevious` chain stored on each
 * version. The hub list endpoint already returns each version with its diff
 * vs predecessor — for migrations between non-adjacent versions we surface
 * the diff of the target itself for transparency. The legal gate (favorable
 * vs unfavorable) is enforced server-side regardless of what we show here.
 */
function pickDiffForTarget(
  versions: PlanVersionListItem[] | undefined,
  targetId: string,
): PlanVersionDiffType | null {
  if (!versions) return null;
  const target = versions.find((v) => v.id === targetId);
  return target?.diffVsPrevious ?? null;
}

export function MigrateSubscriptionDialog({
  open,
  onOpenChange,
  subscriptionId,
  planId,
  currentPlanVersionId,
}: Props) {
  const { data: versions, isLoading } = usePlanVersions(planId);
  const migrate = useMigrateSubscriptionVersion(subscriptionId, planId);

  const [targetId, setTargetId] = useState<string>('');
  const [reason, setReason] = useState('');
  const [consentObtained, setConsentObtained] = useState(false);

  // Reset local state every time the dialog opens so a previously-cancelled
  // migration does not leak into the next attempt.
  useEffect(() => {
    if (open) {
      setTargetId('');
      setReason('');
      setConsentObtained(false);
    }
  }, [open]);

  const candidates = useMemo(() => {
    if (!versions) return [];
    return versions.filter((v) => v.id !== currentPlanVersionId);
  }, [versions, currentPlanVersionId]);

  const targetDiff = pickDiffForTarget(versions, targetId);
  const isUnfavorable = targetDiff?.isUnfavorable ?? false;
  const consentRequired = isUnfavorable;
  const submitDisabled =
    !targetId || migrate.isPending || (consentRequired && !consentObtained);

  const handleSubmit = async () => {
    try {
      await migrate.mutateAsync({
        targetPlanVersionId: targetId,
        tenantConsentObtainedAt: consentObtained ? new Date().toISOString() : null,
        reason: reason.trim() === '' ? null : reason.trim(),
      });
      toast.success('Migration appliquée');
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      toast.error(`Migration refusée : ${message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Migrer vers une autre version</DialogTitle>
          <DialogDescription>
            La migration épingle l’abonnement à une nouvelle PlanVersion. Stripe Price n’est
            pas touché — ce flux concerne uniquement les droits applicatifs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="target-version">Version cible</Label>
            <Select
              value={targetId}
              onValueChange={(value) => setTargetId(value ?? '')}
              disabled={isLoading}
            >
              <SelectTrigger id="target-version">
                <SelectValue placeholder={isLoading ? 'Chargement…' : 'Choisir une version'} />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    v{version.versionNumber} — {version.tenantCount} tenant
                    {version.tenantCount === 1 ? '' : 's'}
                  </SelectItem>
                ))}
                {candidates.length === 0 && !isLoading && (
                  <SelectItem value="" disabled>
                    Aucune autre version disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {targetDiff && (
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                {isUnfavorable ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                )}
                Diff vs version précédente
              </p>
              <PlanVersionDiffView diff={targetDiff} />
            </div>
          )}

          {consentRequired && (
            <Alert
              variant="default"
              className="border-amber-200 bg-amber-50 text-amber-900"
            >
              <AlertTriangle className="h-4 w-4 text-amber-700" />
              <AlertDescription>
                <p className="font-semibold">Migration défavorable.</p>
                <p className="mt-1 text-sm">
                  L’API refuse cette opération sans consentement explicite du tenant
                  (Code conso L221-3). Cochez la case ci-dessous une fois l’accord obtenu —
                  vous engagez votre responsabilité d’admin.
                </p>
                <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={consentObtained}
                    onChange={(e) => setConsentObtained(e.target.checked)}
                  />
                  <span>
                    Le tenant a confirmé son accord pour cette migration (à conserver dans
                    l’audit trail).
                  </span>
                </label>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="reason">Raison (optionnel, ≤ 500 caractères)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              placeholder="Ex. Reprise commerciale suite à upgrade"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={submitDisabled}>
            {migrate.isPending ? 'Migration en cours…' : 'Appliquer la migration'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
