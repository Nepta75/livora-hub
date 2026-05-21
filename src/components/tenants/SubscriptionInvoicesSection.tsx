'use client';

import { useState } from 'react';
import { Download, FileText, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { RefundInvoiceDialog } from '@/components/tenants/RefundInvoiceDialog';
import { useAuth } from '@/hooks/useAuth';
import {
  TENANT_SUBSCRIPTION_INVOICES_PAGE_SIZE,
  useAdminTenantSubscriptionInvoices,
  useDownloadAdminTenantSubscriptionInvoice,
} from '@/hooks/api/tenants/useAdminTenants';
import { ACTION, STATUS_BADGE } from '@/lib/action-palette';
import { cn } from '@/lib/utils';
import type { ISubscriptionInvoice } from '@/types/generated/api-types';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Brouillon',
  open: 'À régler',
  paid: 'Payée',
  uncollectible: 'Irrécouvrable',
  void: 'Annulée',
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  draft: STATUS_BADGE.inactive,
  open: STATUS_BADGE.warning,
  paid: STATUS_BADGE.active,
  uncollectible: STATUS_BADGE.warning,
  void: STATUS_BADGE.inactive,
};

function formatAmount(amountCents: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amountCents / 100);
}

function formatFrDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR');
}

export function SubscriptionInvoicesSection({ tenantId }: { tenantId: string }) {
  const [page, setPage] = useState(0);
  const [refundTarget, setRefundTarget] = useState<ISubscriptionInvoice | null>(null);
  const { userRoles } = useAuth();
  const { data, isLoading } = useAdminTenantSubscriptionInvoices(tenantId, {}, page);
  const downloadMutation = useDownloadAdminTenantSubscriptionInvoice(tenantId);

  const invoices = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.ceil(total / TENANT_SUBSCRIPTION_INVOICES_PAGE_SIZE);

  const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
    try {
      await downloadMutation.mutateAsync({ invoiceId, invoiceNumber });
    } catch {
      toast.error('Impossible de télécharger la facture.');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Factures d&apos;abonnement
          {total > 0 && (
            <Badge variant="secondary" className="ml-auto font-mono text-xs">
              {total}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Aucune facture émise pour ce tenant.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Émise le</TableHead>
                    <TableHead className="hidden md:table-cell">Période</TableHead>
                    <TableHead className="text-right">Total TTC</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map(invoice => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-xs">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{formatFrDate(invoice.issuedAt)}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        {formatFrDate(invoice.periodStart)} – {formatFrDate(invoice.periodEnd)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatAmount(invoice.total, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start gap-1">
                          <Badge
                            variant="outline"
                            className={STATUS_BADGE_CLASS[invoice.status] ?? STATUS_BADGE.inactive}
                          >
                            {STATUS_LABELS[invoice.status] ?? invoice.status}
                          </Badge>
                          {(invoice.refundedAmount ?? 0) > 0 && (
                            <Badge variant="outline" className={STATUS_BADGE.info}>
                              {(invoice.refundedAmount ?? 0) >= (invoice.amountPaid ?? 0)
                                ? 'Remboursée'
                                : `Remb. ${formatAmount(invoice.refundedAmount ?? 0, invoice.currency)}`}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Télécharger le PDF (audit logué)"
                            className={cn(ACTION.neutral)}
                            disabled={downloadMutation.isPending}
                            onClick={() => handleDownload(invoice.id, invoice.invoiceNumber)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {userRoles?.isAdmin &&
                            invoice.status === 'paid' &&
                            (invoice.amountPaid ?? 0) > (invoice.refundedAmount ?? 0) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Rembourser la facture"
                                className={cn(ACTION.warning)}
                                onClick={() => setRefundTarget(invoice)}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {pageCount > 1 && (
              <div className="flex items-center justify-between mt-3 text-sm">
                <span className="text-muted-foreground">
                  Page {page + 1} sur {pageCount}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pageCount - 1}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      <RefundInvoiceDialog
        tenantId={tenantId}
        invoice={refundTarget}
        onOpenChange={(open) => {
          if (!open) setRefundTarget(null);
        }}
      />
    </Card>
  );
}
