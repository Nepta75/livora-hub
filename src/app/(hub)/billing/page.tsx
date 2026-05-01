'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAdminBillingOverview } from '@/hooks/api/billing/useAdminBillingOverview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { STATUS_BADGE } from '@/lib/action-palette';
import { featureLabel } from '@/lib/feature-labels';
import { ArrowDownUp, ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BillingOverviewRow } from '@/services/admin/billingOverviewService';

type SortKey = 'tenant' | 'plan' | 'projected' | 'nextInvoice' | 'status';
type SortDir = 'asc' | 'desc';

const STATUS_LABEL: Record<string, string> = {
  on_track: 'Sous limite',
  approaching: 'Proche limite',
  at_limit: 'À la limite',
  over_limit: 'Dépassement',
};

const STATUS_RANK: Record<string, number> = {
  over_limit: 4,
  at_limit: 3,
  approaching: 2,
  on_track: 1,
};

function StatusBadge({ status }: { status: string | undefined }) {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const tone =
    status === 'over_limit'
      ? STATUS_BADGE.danger
      : status === 'at_limit' || status === 'approaching'
        ? STATUS_BADGE.warning
        : STATUS_BADGE.active;

  return (
    <Badge variant="outline" className={cn('rounded-full', tone)}>
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}

const formatEuro = (amount: number | undefined): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount ?? 0);

const formatDate = (iso: string | undefined): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const billingPeriodLabel = (value: string | null | undefined): string => {
  if (value === 'monthly') return 'Mensuel';
  if (value === 'annual') return 'Annuel';
  return '—';
};

function SortHeader({
  label,
  currentKey,
  currentDir,
  thisKey,
  align = 'left',
  onClick,
}: {
  label: string;
  currentKey: SortKey;
  currentDir: SortDir;
  thisKey: SortKey;
  align?: 'left' | 'right';
  onClick: (key: SortKey) => void;
}) {
  const active = currentKey === thisKey;
  const Icon = !active ? ArrowDownUp : currentDir === 'asc' ? ArrowUp : ArrowDown;

  return (
    <TableHead
      className={cn(align === 'right' && 'text-right')}
      aria-sort={!active ? 'none' : currentDir === 'asc' ? 'ascending' : 'descending'}
    >
      <button
        type="button"
        onClick={() => onClick(thisKey)}
        className={cn(
          'inline-flex items-center gap-1 font-semibold cursor-pointer select-none',
          align === 'right' && 'flex-row-reverse',
          active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label={`Trier par ${label}${active ? (currentDir === 'asc' ? ' (croissant)' : ' (décroissant)') : ''}`}
      >
        {label}
        <Icon className="h-3.5 w-3.5" />
      </button>
    </TableHead>
  );
}

export default function BillingOverviewPage() {
  const { data: rows, isLoading, error } = useAdminBillingOverview();

  const [sortKey, setSortKey] = useState<SortKey>('projected');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'tenant' || key === 'plan' ? 'asc' : 'desc');
    }
  };

  const sortedRows = useMemo<BillingOverviewRow[]>(() => {
    const data = rows ?? [];
    const filtered =
      statusFilter === 'all' ? data : data.filter((r) => r.status === statusFilter);

    const direction = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case 'tenant':
          return direction * (a.tenantName ?? '').localeCompare(b.tenantName ?? '', 'fr');
        case 'plan':
          return direction * (a.planName ?? '').localeCompare(b.planName ?? '', 'fr');
        case 'projected':
          return direction * ((a.projectedTotalOverageEuro ?? 0) - (b.projectedTotalOverageEuro ?? 0));
        case 'nextInvoice': {
          // Compare numerically so equal/empty dates produce 0 (stable order)
          // and missing values fall consistently to the end regardless of dir.
          const aTs = a.nextInvoiceDate ? Date.parse(a.nextInvoiceDate) : NaN;
          const bTs = b.nextInvoiceDate ? Date.parse(b.nextInvoiceDate) : NaN;
          if (Number.isNaN(aTs) && Number.isNaN(bTs)) return 0;
          if (Number.isNaN(aTs)) return 1;
          if (Number.isNaN(bTs)) return -1;
          return direction * (aTs - bTs);
        }
        case 'status':
          return direction * ((STATUS_RANK[a.status ?? ''] ?? 0) - (STATUS_RANK[b.status ?? ''] ?? 0));
        default:
          return 0;
      }
    });
  }, [rows, sortKey, sortDir, statusFilter]);

  const totalProjected = useMemo(
    () => (rows ?? []).reduce((sum, r) => sum + (r.projectedTotalOverageEuro ?? 0), 0),
    [rows]
  );

  const overLimitCount = (rows ?? []).filter((r) => r.status === 'over_limit').length;
  const approachingCount = (rows ?? []).filter(
    (r) => r.status === 'approaching' || r.status === 'at_limit'
  ).length;

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (error) return <p className="text-destructive">Erreur de chargement.</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Facturation — Vue d&apos;ensemble</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Consommation et dépassements en cours, par tenant. Les montants sont projetés sur la
          période courante et seront facturés à la prochaine clôture (mensuelle pour les abos
          mensuels, fin de mois pour les abos annuels via cron).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <SummaryCard label="Tenants en dépassement" value={overLimitCount} tone="danger" />
        <SummaryCard label="Tenants proches limite" value={approachingCount} tone="warning" />
        <SummaryCard label="Total projeté" value={formatEuro(totalProjected)} tone="info" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Filtrer par statut">
        {(['all', 'over_limit', 'approaching', 'on_track'] as const).map((s) => {
          const active = statusFilter === s;
          return (
            <Button
              key={s}
              variant={active ? 'default' : 'outline'}
              size="sm"
              role="radio"
              aria-checked={active}
              onClick={() => {
                // Clicking the active non-`all` pill resets to `all` so the
                // user can clear a filter without hunting for the "Tous" pill.
                setStatusFilter(active && s !== 'all' ? 'all' : s);
              }}
            >
              {s === 'all' ? 'Tous' : (STATUS_LABEL[s] ?? s)}
            </Button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortHeader
                label="Tenant"
                currentKey={sortKey}
                currentDir={sortDir}
                thisKey="tenant"
                onClick={handleSort}
              />
              <SortHeader
                label="Plan"
                currentKey={sortKey}
                currentDir={sortDir}
                thisKey="plan"
                onClick={handleSort}
              />
              <TableHead>Cadence</TableHead>
              <SortHeader
                label="Dépassement projeté"
                currentKey={sortKey}
                currentDir={sortDir}
                thisKey="projected"
                align="right"
                onClick={handleSort}
              />
              <TableHead>Feature principale</TableHead>
              <SortHeader
                label="Statut"
                currentKey={sortKey}
                currentDir={sortDir}
                thisKey="status"
                onClick={handleSort}
              />
              <SortHeader
                label="Prochaine facture"
                currentKey={sortKey}
                currentDir={sortDir}
                thisKey="nextInvoice"
                align="right"
                onClick={handleSort}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Aucun tenant correspondant.
                </TableCell>
              </TableRow>
            ) : (
              sortedRows.map((row) => (
                <TableRow key={row.tenantId} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <Link
                      href={`/tenants/${row.tenantId}`}
                      className="hover:underline underline-offset-2"
                    >
                      {row.tenantName}
                    </Link>
                  </TableCell>
                  <TableCell>{row.planName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {billingPeriodLabel(row.billingPeriod ?? null)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-mono',
                      (row.projectedTotalOverageEuro ?? 0) > 0 && 'font-semibold'
                    )}
                  >
                    {formatEuro(row.projectedTotalOverageEuro)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.topOverageFeature ? featureLabel(row.topOverageFeature) : '—'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {formatDate(row.nextInvoiceDate)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: 'danger' | 'warning' | 'info';
}) {
  // Reuse the central palette so a tone change in action-palette.ts
  // automatically propagates to this card.
  return (
    <div className={cn('rounded-md border p-4', STATUS_BADGE[tone])}>
      <p className="text-xs uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
