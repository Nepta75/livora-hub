'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useDownloadAdminTenantCreditNote,
  useRefundAdminTenantSubscriptionInvoice,
} from '@/hooks/api/tenants/useAdminTenants';
import { ACTION, CONFIRM_BUTTON, STATUS_BADGE } from '@/lib/action-palette';
import { cn } from '@/lib/utils';
import type {
  ISubscriptionInvoice,
  ISubscriptionInvoiceRefund,
  RefundSubscriptionInvoiceReason,
} from '@/types/generated/api-types';

const REASON_LABELS: Record<RefundSubscriptionInvoiceReason, string> = {
  requested_by_customer: 'Demande du client',
  duplicate: 'Doublon',
  fraudulent: 'Fraude',
};

// `refund.reason` is typed `string` (Stripe-origin refunds may carry a value
// outside our enum) — fall back to the raw value rather than rendering blank.
function reasonLabel(reason: string): string {
  return REASON_LABELS[reason as RefundSubscriptionInvoiceReason] ?? reason;
}

const REFUND_STATUS_LABELS: Record<string, string> = {
  pending: 'En cours',
  requires_action: 'Action requise',
  succeeded: 'Effectué',
  failed: 'Échoué',
  canceled: 'Annulé',
};

const REFUND_STATUS_BADGE: Record<string, string> = {
  pending: STATUS_BADGE.warning,
  requires_action: STATUS_BADGE.warning,
  succeeded: STATUS_BADGE.active,
  failed: STATUS_BADGE.danger,
  canceled: STATUS_BADGE.inactive,
};

function formatAmount(amountCents: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amountCents / 100);
}

function formatFrDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR');
}

interface RefundInvoiceDialogProps {
  tenantId: string;
  invoice: ISubscriptionInvoice | null;
  onOpenChange: (open: boolean) => void;
}

export function RefundInvoiceDialog({ tenantId, invoice, onOpenChange }: RefundInvoiceDialogProps) {
  const refundMutation = useRefundAdminTenantSubscriptionInvoice(tenantId);
  const downloadCreditNoteMutation = useDownloadAdminTenantCreditNote(tenantId);

  const [mode, setMode] = useState<'full' | 'partial'>('full');
  const [amountEuro, setAmountEuro] = useState('');
  const [reason, setReason] = useState<RefundSubscriptionInvoiceReason>('requested_by_customer');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  // The mirror counts pending/succeeded refunds; `refundedAmount` is that
  // running total, so the still-refundable balance is paid − refunded.
  const amountPaid = invoice?.amountPaid ?? 0;
  const refundedAmount = invoice?.refundedAmount ?? 0;
  const refundable = Math.max(0, amountPaid - refundedAmount);
  const currency = invoice?.currency ?? 'EUR';
  const refunds: ISubscriptionInvoiceRefund[] = invoice?.refunds ?? [];

  useEffect(() => {
    if (invoice) {
      setMode('full');
      setAmountEuro('');
      setReason('requested_by_customer');
      setNote('');
      setError(null);
    }
  }, [invoice]);

  const handleDownloadCreditNote = async (refund: ISubscriptionInvoiceRefund) => {
    if (!refund.creditNote) return;
    try {
      await downloadCreditNoteMutation.mutateAsync({
        creditNoteId: refund.creditNote.id,
        creditNoteNumber: refund.creditNote.creditNoteNumber,
      });
    } catch {
      toast.error("Impossible de télécharger l'avoir.");
    }
  };

  const handleSubmit = async () => {
    if (!invoice) return;
    setError(null);

    let amountCents: number | null = null;
    if (mode === 'partial') {
      const parsed = Number.parseFloat(amountEuro.replace(',', '.'));
      if (!Number.isFinite(parsed) || parsed <= 0) {
        setError('Saisissez un montant valide.');
        return;
      }
      amountCents = Math.round(parsed * 100);
      if (amountCents > refundable) {
        setError(`Le montant dépasse le solde remboursable (${formatAmount(refundable, currency)}).`);
        return;
      }
    }

    try {
      const result = await refundMutation.mutateAsync({
        invoiceId: invoice.id,
        body: { amount: amountCents, reason, note: note.trim() || null },
      });
      const creditNote = result.refund.creditNote;
      toast.success(
        `Remboursement de ${formatAmount(result.refund.amount, result.refund.currency)} émis sur ${invoice.invoiceNumber}.` +
          (creditNote ? ` Avoir ${creditNote.creditNoteNumber} généré.` : ''),
      );
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Le remboursement a échoué.');
    }
  };

  return (
    <Dialog open={invoice !== null} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex max-h-[85vh] flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Rembourser la facture {invoice?.invoiceNumber}</DialogTitle>
          <DialogDescription>
            Le remboursement est exécuté immédiatement via Stripe et tracé dans les logs d&rsquo;audit.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-3 gap-3 rounded-md border p-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Payé</p>
              <p className="font-medium">{formatAmount(amountPaid, currency)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Déjà remboursé</p>
              <p className="font-medium">{formatAmount(refundedAmount, currency)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Remboursable</p>
              <p className="font-medium">{formatAmount(refundable, currency)}</p>
            </div>
          </div>

          {refundable <= 0 ? (
            <p className="text-sm text-destructive">
              Cette facture est déjà intégralement remboursée.
            </p>
          ) : (
            <>
              <div className="space-y-1">
                <Label>Type de remboursement</Label>
                <Select value={mode} onValueChange={(v) => setMode(v as 'full' | 'partial')}>
                  <SelectTrigger>
                    <SelectValue>
                      {(value) =>
                        value === 'partial'
                          ? 'Partiel'
                          : `Total — ${formatAmount(refundable, currency)}`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">
                      Total — {formatAmount(refundable, currency)}
                    </SelectItem>
                    <SelectItem value="partial">Partiel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {mode === 'partial' && (
                <div className="space-y-1">
                  <Label htmlFor="refund-amount">Montant ({currency})</Label>
                  <Input
                    id="refund-amount"
                    type="number"
                    min={0}
                    step="0.01"
                    value={amountEuro}
                    onChange={(e) => setAmountEuro(e.target.value)}
                    placeholder="0,00"
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label>Motif</Label>
                <Select
                  value={reason}
                  onValueChange={(v) => setReason(v as RefundSubscriptionInvoiceReason)}
                >
                  <SelectTrigger>
                    <SelectValue>{(value) => reasonLabel(String(value))}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(REASON_LABELS) as RefundSubscriptionInvoiceReason[]).map((r) => (
                      <SelectItem key={r} value={r}>
                        {REASON_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="refund-note">Note (optionnelle)</Label>
                <Input
                  id="refund-note"
                  maxLength={500}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contexte interne — visible dans l'audit et Stripe"
                />
              </div>
            </>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {refunds.length > 0 && (
            <div className="space-y-1">
              <Label>Remboursements précédents</Label>
              <ul className="rounded-md border divide-y text-sm">
                {refunds.map((refund) => (
                  <li key={refund.id} className="flex items-center justify-between gap-2 px-3 py-2">
                    <div className="min-w-0">
                      <span className="font-medium">
                        {formatAmount(refund.amount, refund.currency)}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {reasonLabel(refund.reason)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatFrDate(refund.createdAt)}
                    </span>
                    <Badge
                      variant="outline"
                      className={REFUND_STATUS_BADGE[refund.status] ?? STATUS_BADGE.inactive}
                    >
                      {REFUND_STATUS_LABELS[refund.status] ?? refund.status}
                    </Badge>
                    {refund.creditNote ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn('h-7 w-7', ACTION.neutral)}
                        title={`Télécharger l'avoir ${refund.creditNote.creditNoteNumber}`}
                        disabled={downloadCreditNoteMutation.isPending}
                        onClick={() => handleDownloadCreditNote(refund)}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <span className="w-7" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={refundMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            type="button"
            className={CONFIRM_BUTTON.warning}
            disabled={refundMutation.isPending || refundable <= 0}
            onClick={handleSubmit}
          >
            {refundMutation.isPending ? 'Remboursement…' : 'Rembourser'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
