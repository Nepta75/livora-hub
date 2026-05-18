'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { STATUS_BADGE } from '@/lib/action-palette';
import { cn } from '@/lib/utils';
import type { PlanChangePreviewResponse } from '@/services/admin/subscriptionPlanChangeService';

type LineItem = PlanChangePreviewResponse['lineItems'][number];

interface Props {
  isPending: boolean;
  preview: PlanChangePreviewResponse | undefined;
  errorMessage: string | null;
}

function formatEuroCents(cents: number | null | undefined, currency: string): string {
  if (cents === null || cents === undefined) return '—';
  return (cents / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
}

function formatFrDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR');
}

export function PlanChangePreviewCard({ isPending, preview, errorMessage }: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (errorMessage) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-2 rounded-md border border-zinc-200 bg-zinc-50 p-3">
        <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-2/5 animate-pulse rounded bg-zinc-200" />
      </div>
    );
  }

  if (!preview) {
    return null;
  }

  const currency = preview.currency || 'eur';
  const isScheduled = !!preview.scheduledAt;

  if (isScheduled) {
    return (
      <div className={cn('space-y-2 rounded-md border p-3 text-sm', STATUS_BADGE.info)}>
        <p className="font-semibold">
          Changement programmé le {formatFrDate(preview.scheduledAt)}
        </p>
        <p className="text-xs">
          Aucun frais aujourd&apos;hui — l&apos;offre actuelle reste active jusque-là.
        </p>
        <p className="text-sm">
          Prochaine facture :{' '}
          <span className="font-semibold">
            {formatEuroCents(preview.targetPriceCents, currency)}
          </span>{' '}
          le {formatFrDate(preview.scheduledAt)}.
        </p>
      </div>
    );
  }

  const netImmediateCents = preview.totalChargeCents - preview.totalCreditCents;
  const isNetCredit = netImmediateCents < 0;

  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {isNetCredit ? 'Crédit généré' : 'À facturer'}
          </p>
          <p
            className={`mt-1 text-base font-semibold ${
              isNetCredit ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {formatEuroCents(Math.abs(netImmediateCents), currency)}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {isNetCredit
              ? 'Reporté sur les prochaines factures — aucun remboursement sur la carte.'
              : 'Ajouté à la prochaine facture (prorata Stripe).'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Prochaine facture</p>
          <p className="mt-1 text-base font-semibold text-zinc-900">
            {formatFrDate(preview.nextInvoiceDate)}
          </p>
        </div>
      </div>

      <PreviewLineDetails
        lines={preview.lineItems}
        currency={currency}
        open={detailsOpen}
        onToggle={() => setDetailsOpen((v) => !v)}
      />
    </div>
  );
}

interface PreviewLineDetailsProps {
  lines: LineItem[];
  currency: string;
  open: boolean;
  onToggle: () => void;
}

function PreviewLineDetails({ lines, currency, open, onToggle }: PreviewLineDetailsProps) {
  if (lines.length === 0) return null;
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900"
      >
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        Détail prorata ({lines.length})
      </button>
      {open && (
        <ul className="mt-2 space-y-1.5 rounded border border-zinc-200 bg-white p-2 text-xs">
          {lines.map((line, i) => {
            const amount = line.amountCents ?? 0;
            return (
              <li key={i} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-zinc-800">{line.description ?? '—'}</p>
                  {(line.periodStart || line.periodEnd) && (
                    <p className="text-zinc-500">
                      {formatFrDate(line.periodStart)} → {formatFrDate(line.periodEnd)}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 font-mono ${
                    amount < 0 ? 'text-emerald-700' : 'text-zinc-900'
                  }`}
                >
                  {amount >= 0 ? '+' : ''}
                  {formatEuroCents(amount, currency)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
