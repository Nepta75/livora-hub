'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCancelTenantSubscription } from '@/hooks/api/tenants/useAdminTenants';
import { HttpError } from '@/services/http/httpClient';

const CONFIRM_WORD = 'ANNULER';

function formatCents(cents: number, currency: string): string {
  const value = Math.abs(cents) / 100;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency || 'EUR',
    minimumFractionDigits: 2,
  }).format(value);
}

interface StrandedCreditPayload {
  message: string;
  customerBalance: number;
  currency: string;
}

function isStrandedCreditPayload(body: unknown): body is StrandedCreditPayload {
  return (
    typeof body === 'object'
    && body !== null
    && 'customerBalance' in body
    && typeof (body as { customerBalance: unknown }).customerBalance === 'number'
    && 'currency' in body
    && typeof (body as { currency: unknown }).currency === 'string'
  );
}

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  tenantName: string;
}

export function CancelSubscriptionDialog({
  open,
  onOpenChange,
  tenantId,
  tenantName,
}: CancelSubscriptionDialogProps) {
  const [confirm, setConfirm] = useState('');
  const [strandedCredit, setStrandedCredit] = useState<StrandedCreditPayload | null>(null);
  const [acknowledgedRefund, setAcknowledgedRefund] = useState(false);
  const cancelMutation = useCancelTenantSubscription(tenantId);
  // `reset` is a stable reference in React Query v5; the mutation object
  // itself is NOT — depending on the whole object re-runs this effect every
  // render and `reset()` re-renders, producing an infinite update loop.
  const { reset: resetCancelMutation } = cancelMutation;

  useEffect(() => {
    if (!open) {
      setConfirm('');
      setStrandedCredit(null);
      setAcknowledgedRefund(false);
      resetCancelMutation();
    }
  }, [open, resetCancelMutation]);

  const confirmReady = confirm.trim() === CONFIRM_WORD;
  const force = strandedCredit !== null && acknowledgedRefund;
  const submitDisabled =
    cancelMutation.isPending
    || !confirmReady
    || (strandedCredit !== null && !acknowledgedRefund);

  const handleSubmit = () => {
    cancelMutation.mutate(force, {
      onSuccess: () => {
        toast.success('Abonnement annulé chez Stripe et supprimé localement.');
        onOpenChange(false);
      },
      onError: (err) => {
        if (err instanceof HttpError && err.status === 409 && isStrandedCreditPayload(err.body)) {
          setStrandedCredit(err.body);
          setAcknowledgedRefund(false);
          return;
        }
        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        toast.error(`Annulation refusée : ${message}`);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Annuler l’abonnement de {tenantName}</DialogTitle>
          <DialogDescription>
            Action irréversible : l’abonnement Stripe est annulé immédiatement (pas de fin de
            période) et la ligne locale est supprimée. Le client perd l’accès tout de suite.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Avant d’annuler</AlertTitle>
            <AlertDescription>
              <ul className="ml-4 list-disc text-sm">
                <li>Préférer le flux côté client (`cancel_at_period_end`) quand possible.</li>
                <li>
                  L’audit log est généré automatiquement et reste visible sur la page{' '}
                  <span className="font-mono">/logs</span>.
                </li>
                <li>
                  Si le client a payé un cycle, vérifier <span className="font-mono">customer.balance</span>{' '}
                  sur Stripe avant — un crédit non remboursé sera bloqué ci-dessous.
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {strandedCredit && (
            <Alert variant="destructive">
              <AlertTitle>Avoir Stripe non remboursé</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  Le client a un avoir de{' '}
                  <span className="font-mono font-semibold">
                    {formatCents(strandedCredit.customerBalance, strandedCredit.currency)}
                  </span>{' '}
                  sur Stripe. Annuler maintenant{' '}
                  <span className="font-semibold">ne le rembourse pas automatiquement</span>.
                </p>
                <p>
                  Procédure à suivre AVANT de forcer : voir{' '}
                  <span className="font-mono">BILLING_TESTING.md § Manual refund</span>{' '}
                  (refund Stripe Dashboard → <span className="font-mono">customer.balance = 0</span>).
                </p>
                <label className="flex items-start gap-2 pt-1 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4"
                    checked={acknowledgedRefund}
                    onChange={(e) => setAcknowledgedRefund(e.target.checked)}
                  />
                  <span>
                    Le remboursement manuel a été émis et{' '}
                    <span className="font-mono">customer.balance</span> remis à 0. Forcer l’annulation.
                  </span>
                </label>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="cancel-subscription-confirm">
              Tapez <span className="font-mono font-bold">{CONFIRM_WORD}</span> pour confirmer
            </Label>
            <Input
              id="cancel-subscription-confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={CONFIRM_WORD}
              autoComplete="off"
              className="font-mono"
            />
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={submitDisabled}
            className="w-full sm:w-auto"
          >
            {cancelMutation.isPending
              ? 'Annulation…'
              : strandedCredit
                ? 'Forcer l’annulation'
                : 'Annuler l’abonnement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
