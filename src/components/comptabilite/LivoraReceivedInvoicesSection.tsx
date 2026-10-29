'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Inbox } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SearchInput } from '@/components/listing/SearchInput';
import { ListingPagination } from '@/components/listing/ListingPagination';
import { LivoraReceivedInvoiceStatusTag } from '@/components/comptabilite/LivoraReceivedInvoiceStatusTag';
import {
  LivoraReceivedInvoiceRowActions,
  type LivoraReceivedInvoiceAckEvent,
} from '@/components/comptabilite/LivoraReceivedInvoiceRowActions';
import {
  LIVORA_RECEIVED_INVOICES_PAGE_SIZE,
  useLivoraReceivedInvoices,
  useRefreshLivoraReceivedInvoice,
  useReportLivoraReceivedInvoiceEvent,
} from '@/hooks/api/livoraReceivedInvoice/useLivoraReceivedInvoices';
import type { ILivoraReceivedInvoice } from '@/types/generated/api-types';
import { cn } from '@/lib/utils';

// The CTC statuses the filter offers. `submitted` is left out: it is the emission-side "deposited"
// state and never lands on a received document. 'all' is the default (no status filter).
const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'delivered', label: 'Mise à disposition' },
  { value: 'received', label: 'Reçue' },
  { value: 'accepted', label: 'Acceptée' },
  { value: 'refused', label: 'Refusée' },
  { value: 'disputed', label: 'En litige' },
  { value: 'paid', label: 'Payée' },
  { value: 'rejected', label: 'Rejetée' },
  { value: 'routing_error', label: 'Erreur de routage' },
];

const STATUS_FILTER_LABELS: Record<string, string> = Object.fromEntries(
  STATUS_FILTER_OPTIONS.map((option) => [option.value, option.label]),
);

// What Livora DECLARED to the supplier (reportedStatus), shown under the observed status tag. The
// observed-vs-declared split: the tag is what the platform assigns, this caption is our own ack.
const REPORTED_LABELS: Record<string, string> = {
  received: 'Réception accusée',
  accepted: 'Approuvée',
  paid: 'Paiement déclaré',
};

const ACK_SUCCESS: Record<string, string> = {
  received: 'Réception accusée auprès du fournisseur.',
  accepted: 'Facture approuvée auprès du fournisseur.',
  paid: 'Paiement déclaré auprès du fournisseur.',
};

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(cents / 100);
}

// issueDate and paymentDueDate are DATE columns (a calendar day, no instant), serialised by the API
// as a midnight-UTC instant. Read the day straight off the string rather than through a Date, or a
// viewer west of UTC renders the day before. Same rule as the tenant inbox and the true DATE columns.
function dayLabel(iso?: string | null): string {
  if (!iso) return '—';
  const [year, month, day] = iso.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

function reportedAtLabel(iso?: string | null): string {
  if (!iso) return '';
  return ` le ${new Date(iso).toLocaleDateString('fr-FR')}`;
}

/**
 * The B2B invoices LIVORA itself received from its own suppliers (the platform reception channel), for
 * the hub. Opens on the accounts-payable snapshot (what came in this month, what is past its due date),
 * then the inbox: supplier, number, amount, due date, CTC status, and the buyer's lifecycle acks. No
 * download (the source document is not retained). Mirror of vista-app's tenant inbox, hub idiom.
 */
export function LivoraReceivedInvoicesSection() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);

  const filters = {
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
  };

  const { data, isLoading, isError } = useLivoraReceivedInvoices(filters, page);
  const refreshMutation = useRefreshLivoraReceivedInvoice();
  const reportMutation = useReportLivoraReceivedInvoiceEvent();

  // Every row with a mutation in flight, so each disables its own trigger independently. A single
  // pending flag would name only ONE row (both hooks are shared instances), re-enabling a duplicate
  // ack the moment a second row started. Marked before mutate, cleared on settle.
  const [busyIds, setBusyIds] = useState<Set<string>>(() => new Set());

  const clearBusy = (id: string) =>
    setBusyIds((previous) => {
      const next = new Set(previous);
      next.delete(id);
      return next;
    });

  // mutateAsync, not mutate + per-call callbacks: reportMutation / refreshMutation are each a SINGLE
  // shared observer for the whole table, and a second mutate() on the same hook detaches the observer
  // from the first mutation (query-core MutationObserver), so the first call's onSettled would never
  // fire and its row would spin for ever. The returned promise is tied to its own mutation, so
  // awaiting it clears the right row no matter how many rows act at once. Same idiom as the hub's
  // plan-change dialogs.
  const handleReport = async (id: string, event: LivoraReceivedInvoiceAckEvent) => {
    setBusyIds((previous) => new Set(previous).add(id));
    try {
      await reportMutation.mutateAsync({ id, body: { event } });
      toast.success(ACK_SUCCESS[event] ?? 'Statut déclaré.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "L'accusé n'a pas pu être enregistré.");
    } finally {
      clearBusy(id);
    }
  };

  const handleRefresh = async (id: string) => {
    setBusyIds((previous) => new Set(previous).add(id));
    try {
      await refreshMutation.mutateAsync(id);
      toast.success('Statut mis à jour.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Le statut n'a pas pu être rafraîchi.");
    } finally {
      clearBusy(id);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleStatusChange = (value: string | null) => {
    setStatus(value ?? 'all');
    setPage(0);
  };

  const invoices = data?.data ?? [];
  const summary = data?.summary;
  const total = data?.total ?? 0;
  const pageCount = Math.ceil(total / LIVORA_RECEIVED_INVOICES_PAGE_SIZE);

  const renderRow = (invoice: ILivoraReceivedInvoice) => (
    <TableRow key={invoice.id}>
      <TableCell>{dayLabel(invoice.issueDate)}</TableCell>
      <TableCell>
        <span className="font-medium">{invoice.sellerName ?? '—'}</span>
        {invoice.sellerLegalRegistrationId && (
          <span className="block text-xs text-muted-foreground">
            {invoice.sellerLegalRegistrationId}
          </span>
        )}
      </TableCell>
      <TableCell className="font-mono text-xs">{invoice.number ?? '—'}</TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {formatAmount(invoice.taxInclusiveCents ?? 0, invoice.currencyCode ?? 'EUR')}
      </TableCell>
      <TableCell className="text-muted-foreground">{dayLabel(invoice.paymentDueDate)}</TableCell>
      <TableCell>
        <LivoraReceivedInvoiceStatusTag status={invoice.status} />
        {invoice.reportedStatus && REPORTED_LABELS[invoice.reportedStatus] && (
          <span className="mt-1 block text-xs text-muted-foreground">
            {REPORTED_LABELS[invoice.reportedStatus]}
            {reportedAtLabel(invoice.reportedAt)}
          </span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <LivoraReceivedInvoiceRowActions
          reportedStatus={invoice.reportedStatus}
          isBusy={busyIds.has(invoice.id)}
          onReport={(event) => handleReport(invoice.id, event)}
          onRefresh={() => handleRefresh(invoice.id)}
        />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">Factures reçues des fournisseurs</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Les factures que Livora reçoit de ses fournisseurs via la plateforme de facturation
          électronique. La réception est obligatoire pour toute entreprise depuis le 1er septembre
          2026.
        </p>
      </div>

      {/* What came in this month, and what is past its due date, before the first scroll. */}
      {summary && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Card>
            <CardContent className="py-4">
              <p className="text-xs text-muted-foreground">
                Reçues ce mois-ci ({summary.receivedThisMonthCount})
              </p>
              {/* EUR: the backend sums taxInclusiveCents across every currency without carrying one on
                  the summary payload. Livora's suppliers are its own French accounts-payable, so EUR
                  holds today; a non-EUR supplier invoice would make this aggregate silently off. */}
              <p className="text-xl font-bold">{formatAmount(summary.receivedThisMonthCents, 'EUR')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p
                className={cn(
                  'text-xs',
                  summary.overdueCount ? 'text-red-600' : 'text-muted-foreground',
                )}
              >
                Échéance dépassée
              </p>
              <p className={cn('text-xl font-bold', summary.overdueCount && 'text-red-600')}>
                {summary.overdueCount}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="N° de facture, fournisseur…"
        />
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue>{(value) => STATUS_FILTER_LABELS[String(value)] ?? 'Statut'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <p className="text-sm text-red-600">
          Erreur lors du chargement des factures reçues. Veuillez réessayer.
        </p>
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement...</p>
      ) : invoices.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed py-12 text-center">
          <Inbox className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Aucune facture reçue ne correspond.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead>N°</TableHead>
                  <TableHead className="text-right">Montant TTC</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>{invoices.map(renderRow)}</TableBody>
            </Table>
          </div>

          <ListingPagination
            page={page}
            pageCount={pageCount}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
