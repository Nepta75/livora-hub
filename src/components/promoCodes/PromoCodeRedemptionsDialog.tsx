'use client';

import Link from 'next/link';
import { useAdminPromoCodeRedemptions } from '@/hooks/api/promoCodes/useAdminPromoCodes';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { IPromoCodeDto } from '@/types/generated/api-types';

interface PromoCodeRedemptionsDialogProps {
  promoCode: IPromoCodeDto | null;
  onOpenChange: (open: boolean) => void;
}

function formatEuroCents(cents: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PromoCodeRedemptionsDialog({
  promoCode,
  onOpenChange,
}: PromoCodeRedemptionsDialogProps) {
  const open = promoCode !== null;
  const { data: redemptions, isLoading } = useAdminPromoCodeRedemptions(promoCode?.id ?? null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Utilisations — <span className="font-mono">{promoCode?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Liste des tenants ayant utilisé ce code, ordonnés du plus récent au plus ancien.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Chargement...</p>
        ) : !redemptions || redemptions.length === 0 ? (
          <p className="text-sm text-muted-foreground italic py-6 text-center">
            Aucune utilisation enregistrée pour ce code.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Montant remisé</TableHead>
                  <TableHead>Provider</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redemptions.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/tenants/${r.tenantId}`}
                        className="hover:underline"
                        onClick={() => onOpenChange(false)}
                      >
                        {r.tenantName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.tenantEmail}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(r.redeemedAt)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatEuroCents(r.amountDiscountedCents, r.currency)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground capitalize">
                      {r.provider}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
