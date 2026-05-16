'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { useAdminPlans } from '@/hooks/api/plans/useAdminPlans';
import { useChangePlan, useChangePlanPreview } from '@/hooks/api/subscriptions/useChangePlan';
import type {
  ChangePlanBillingPeriod,
  ChangePlanProrationBehavior,
} from '@/types/generated/api-types';
import { PlanChangePreviewCard } from '@/components/subscriptions/PlanChangePreviewCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  currentPlanId: string;
  currentBillingPeriod: ChangePlanBillingPeriod;
}

function formatEuroCents(cents?: number | null): string {
  if (cents === null || cents === undefined) return '—';
  return (cents / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
}

export function ChangePlanDialog({
  open,
  onOpenChange,
  tenantId,
  currentPlanId,
  currentBillingPeriod,
}: Props) {
  const { data: plans, isLoading: plansLoading } = useAdminPlans();
  const changePlan = useChangePlan(tenantId);

  const [targetPlanId, setTargetPlanId] = useState<string>('');
  const [billingPeriod, setBillingPeriod] =
    useState<ChangePlanBillingPeriod>(currentBillingPeriod);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [prorationBehavior, setProrationBehavior] =
    useState<ChangePlanProrationBehavior>('create_prorations');
  const [reason, setReason] = useState('');
  const [bypassConfirm, setBypassConfirm] = useState('');

  // Reset every time the dialog opens so an aborted attempt does not leak.
  useEffect(() => {
    if (open) {
      setTargetPlanId('');
      setBillingPeriod(currentBillingPeriod);
      setAdvancedOpen(false);
      setProrationBehavior('create_prorations');
      setReason('');
      setBypassConfirm('');
    }
  }, [open, currentBillingPeriod]);

  // Switching an annual subscription to monthly mid-cycle is an engagement
  // break — the customer pre-paid 12 months at the annual discount. The hub
  // admin can still do it (commercial edge cases) but only after the
  // type-to-confirm gate in Mode avancé.
  const isPeriodDowngrade =
    currentBillingPeriod === 'annual' && billingPeriod === 'monthly';
  const bypassReady = bypassConfirm.trim() === 'ROMPRE';

  const candidatePlans = useMemo(() => {
    return (plans ?? []).filter(
      (p) =>
        p.id
        && p.id !== currentPlanId
        && (p.stripeMonthlyPriceId || p.stripeAnnualPriceId),
    );
  }, [plans, currentPlanId]);

  const targetPlan = useMemo(
    () => candidatePlans.find((p) => p.id === targetPlanId),
    [candidatePlans, targetPlanId],
  );

  const periodAvailable = (period: ChangePlanBillingPeriod): boolean => {
    if (!targetPlan) return true;
    // Annual → monthly is gated behind Mode avancé — keep the button reachable
    // only once the admin has explicitly opened the override panel.
    if (currentBillingPeriod === 'annual' && period === 'monthly' && !advancedOpen) {
      return false;
    }
    return period === 'annual' ? !!targetPlan.stripeAnnualPriceId : !!targetPlan.stripeMonthlyPriceId;
  };

  // Auto-correct if the previously chosen period is unavailable on the new plan.
  useEffect(() => {
    if (!targetPlan) return;
    if (billingPeriod === 'annual' && !targetPlan.stripeAnnualPriceId && targetPlan.stripeMonthlyPriceId) {
      setBillingPeriod('monthly');
    } else if (
      billingPeriod === 'monthly'
      && !targetPlan.stripeMonthlyPriceId
      && targetPlan.stripeAnnualPriceId
    ) {
      setBillingPeriod('annual');
    }
  }, [targetPlan, billingPeriod]);

  const isDifferent =
    !!targetPlanId
    && (targetPlanId !== currentPlanId || billingPeriod !== currentBillingPeriod);

  const previewBody = isDifferent
    ? { targetPlanId, billingPeriod, prorationBehavior }
    : null;

  const previewQuery = useChangePlanPreview({
    tenantId,
    body: previewBody,
    enabled: open && isDifferent,
  });

  const previewError = previewQuery.error
    ? previewQuery.error instanceof Error
      ? previewQuery.error.message
      : 'Erreur de prévisualisation'
    : null;

  const submitDisabled =
    !isDifferent
    || changePlan.isPending
    || previewQuery.isFetching
    || !previewQuery.data
    || (isPeriodDowngrade && !bypassReady);

  const handleSubmit = async () => {
    if (!previewQuery.data) return;
    try {
      await changePlan.mutateAsync({
        targetPlanId,
        billingPeriod,
        prorationBehavior,
        reason: reason.trim() === '' ? null : reason.trim(),
        previewedAt: previewQuery.data.previewedAt,
        force: isPeriodDowngrade,
      });
      toast.success('Changement de plan appliqué');
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      toast.error(`Changement refusé : ${message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Changer de plan</DialogTitle>
          <DialogDescription>
            Bascule l’abonnement Stripe sur un autre plan / une autre période. Le prorata
            est calculé par Stripe et ajouté à la prochaine facture.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="target-plan">Plan cible</Label>
            <Select
              value={targetPlanId}
              onValueChange={(value) => setTargetPlanId(value ?? '')}
              disabled={plansLoading}
            >
              <SelectTrigger id="target-plan">
                <SelectValue placeholder={plansLoading ? 'Chargement…' : 'Choisir un plan'}>
                  {targetPlan?.name ?? null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {candidatePlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id ?? ''}>
                    {plan.name}
                    {plan.monthlyPriceEuro != null && (
                      <span className="ml-1 text-zinc-500">
                        — {formatEuroCents(plan.monthlyPriceEuro * 100)}/mois
                      </span>
                    )}
                    {plan.annualPriceEuro != null && (
                      <span className="ml-1 text-zinc-500">
                        · {formatEuroCents(plan.annualPriceEuro * 100)}/an
                      </span>
                    )}
                  </SelectItem>
                ))}
                {candidatePlans.length === 0 && !plansLoading && (
                  <SelectItem value="" disabled>
                    Aucun plan candidat
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Période de facturation</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['monthly', 'annual'] as const).map((period) => {
                const available = periodAvailable(period);
                const selected = billingPeriod === period;
                return (
                  <button
                    key={period}
                    type="button"
                    disabled={!available}
                    onClick={() => setBillingPeriod(period)}
                    className={`rounded-md border p-3 text-left text-sm transition-colors ${
                      selected
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 bg-white hover:border-zinc-400'
                    } ${!available ? 'cursor-not-allowed opacity-40' : ''}`}
                  >
                    <p className="font-semibold">
                      {period === 'monthly' ? 'Mensuel' : 'Annuel'}
                    </p>
                    {targetPlan && (
                      <p className={`text-xs ${selected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {period === 'monthly'
                          ? targetPlan.monthlyPriceEuro != null
                            ? `${formatEuroCents(targetPlan.monthlyPriceEuro * 100)}/mois`
                            : '—'
                          : targetPlan.annualPriceEuro != null
                            ? `${formatEuroCents(targetPlan.annualPriceEuro * 100)}/mois facturé annuellement`
                            : '—'}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
            {currentBillingPeriod === 'annual' && !advancedOpen && (
              <p className="text-xs text-zinc-500">
                Le passage en mensuel rompt l’engagement annuel — déverrouillable via le mode avancé.
              </p>
            )}
          </div>

          {isDifferent && (
            <PlanChangePreviewCard
              isPending={previewQuery.isFetching}
              preview={previewQuery.data}
              errorMessage={previewError}
            />
          )}

          {isPeriodDowngrade && (
            <Alert variant="destructive">
              <AlertTitle>Rupture d’engagement annuel</AlertTitle>
              <AlertDescription>
                <p>
                  L’abonnement courant est annuel — le client a payé 12 mois d’avance au tarif
                  remisé. Le bascule en mensuel génère un crédit Stripe (consommé sur les
                  prochaines factures, jamais remboursé sur la carte) et casse l’engagement.
                </p>
                <p>
                  Action visible dans <span className="font-mono">/logs</span>. Tapez{' '}
                  <span className="font-mono font-bold">ROMPRE</span> pour confirmer :
                </p>
                <Input
                  value={bypassConfirm}
                  onChange={(e) => setBypassConfirm(e.target.value)}
                  placeholder="ROMPRE"
                  autoComplete="off"
                  className="mt-1 font-mono"
                />
              </AlertDescription>
            </Alert>
          )}

          <div>
            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
            >
              {advancedOpen ? 'Masquer' : 'Afficher'} le mode avancé
            </button>
            {advancedOpen && (
              <div className="mt-2 space-y-1.5">
                <Label htmlFor="proration-behavior">Politique de prorata</Label>
                <Select
                  value={prorationBehavior}
                  onValueChange={(value) =>
                    setProrationBehavior((value || 'create_prorations') as ChangePlanProrationBehavior)
                  }
                >
                  <SelectTrigger id="proration-behavior">
                    <SelectValue>
                      {prorationBehavior === 'create_prorations'
                        ? 'Proratiser (recommandé)'
                        : prorationBehavior === 'always_invoice'
                          ? 'Proratiser et facturer immédiatement'
                          : 'Pas de prorata'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create_prorations">
                      Proratiser (recommandé) — crédit ou charge sur la prochaine facture
                    </SelectItem>
                    <SelectItem value="always_invoice">
                      Proratiser et facturer immédiatement
                    </SelectItem>
                    <SelectItem value="none">
                      Pas de prorata — la nouvelle période démarre sans ajustement
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reason">Raison (optionnel, ≤ 500 caractères)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              placeholder="Ex. Upgrade demandé par le tenant suite à appel commercial"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitDisabled}
            variant={isPeriodDowngrade ? 'destructive' : 'default'}
          >
            {changePlan.isPending
              ? 'Application…'
              : isPeriodDowngrade
                ? 'Confirmer la rupture d’engagement'
                : 'Confirmer le changement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
