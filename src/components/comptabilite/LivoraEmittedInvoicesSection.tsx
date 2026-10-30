'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FileDown, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { LivoraEmittedInvoiceStatusTag } from '@/components/comptabilite/LivoraEmittedInvoiceStatusTag';
import {
  LIVORA_EMITTED_INVOICES_PAGE_SIZE,
  useDownloadLivoraEmittedFacturX,
  useDownloadLivoraEmittedXml,
  useLivoraEmittedInvoices,
} from '@/hooks/api/livoraEmittedInvoice/useLivoraEmittedInvoices';
import type { ISubscriptionInvoice } from '@/types/generated/api-types';

function formatAmount(amountCents: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amountCents / 100);
}

// issuedAt is a timestamptz instant (unlike the received invoices' DATE columns), so a Date renders the
// right calendar day in fr-FR.
function dayLabel(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR');
}

/**
 * The subscription invoices LIVORA emitted to its tenants, for the hub. Lists them cross-tenant with
 * their e-invoice transmission status, and lets an admin download the conforming artefact: the Factur-X
 * PDF (the branded invoice carrying the embedded CII) or the bare CII XML. Mirror of the received-invoice
 * section, emission side. The backend rebuilds the artefact on demand; a draft or a non-conforming invoice
 * answers a clean 409, surfaced here as a toast.
 */
export function LivoraEmittedInvoicesSection() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const filters = { search: search || undefined };

  const { data, isLoading, isError } = useLivoraEmittedInvoices(filters, page);
  const facturxDownload = useDownloadLivoraEmittedFacturX();
  const xmlDownload = useDownloadLivoraEmittedXml();

  // Every row with a download in flight, so each disables its own buttons independently (both hooks are
  // single shared observers). Marked before the call, cleared on settle.
  const [busyIds, setBusyIds] = useState<Set<string>>(() => new Set());

  const clearBusy = (id: string) =>
    setBusyIds((previous) => {
      const next = new Set(previous);
      next.delete(id);
      return next;
    });

  const handleDownload = async (
    download: (vars: { id: string; invoiceNumber: string }) => Promise<unknown>,
    id: string,
    invoiceNumber: string,
  ) => {
    setBusyIds((previous) => new Set(previous).add(id));
    try {
      await download({ id, invoiceNumber });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Le téléchargement n'a pas pu aboutir.");
    } finally {
      clearBusy(id);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const invoices = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.ceil(total / LIVORA_EMITTED_INVOICES_PAGE_SIZE);

  const renderRow = (invoice: ISubscriptionInvoice) => {
    const isBusy = busyIds.has(invoice.id);

    return (
      <TableRow key={invoice.id}>
        <TableCell>{dayLabel(invoice.issuedAt)}</TableCell>
        <TableCell className="font-medium">{invoice.customerName}</TableCell>
        <TableCell className="font-mono text-xs">{invoice.invoiceNumber}</TableCell>
        <TableCell className="text-right font-medium tabular-nums">
          {formatAmount(invoice.total, invoice.currency)}
        </TableCell>
        <TableCell>
          <LivoraEmittedInvoiceStatusTag
            status={invoice.eInvoiceStatus}
            bareXmlFallback={invoice.eInvoiceBareXmlFallback}
          />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={isBusy}
              onClick={() =>
                handleDownload(facturxDownload.mutateAsync, invoice.id, invoice.invoiceNumber)
              }
            >
              <FileDown className="mr-1 h-4 w-4" />
              Factur-X
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isBusy}
              onClick={() =>
                handleDownload(xmlDownload.mutateAsync, invoice.id, invoice.invoiceNumber)
              }
            >
              XML
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">Factures d&apos;abonnement émises</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Les factures que Livora émet à ses clients (les tenants) pour leur abonnement, et leur facture
          électronique conforme (Factur-X PDF ou XML CII) à télécharger.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="N° de facture…" />
      </div>

      {isError ? (
        <p className="text-sm text-red-600">
          Erreur lors du chargement des factures émises. Veuillez réessayer.
        </p>
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement...</p>
      ) : invoices.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed py-12 text-center">
          <Receipt className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Aucune facture émise ne correspond.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>N°</TableHead>
                  <TableHead className="text-right">Montant TTC</TableHead>
                  <TableHead>E-facture</TableHead>
                  <TableHead className="w-40" />
                </TableRow>
              </TableHeader>
              <TableBody>{invoices.map(renderRow)}</TableBody>
            </Table>
          </div>

          <ListingPagination page={page} pageCount={pageCount} total={total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
