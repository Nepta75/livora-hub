'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Archive, Pencil, Plus, RotateCcw, Settings2, Trash2 } from 'lucide-react';
import {
  useAdminPromoCodes,
  useArchiveAdminPromoCode,
  useDeleteAdminPromoCode,
  useReactivateAdminPromoCode,
} from '@/hooks/api/promoCodes/useAdminPromoCodes';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreatePromoCodeDialog } from '@/components/promoCodes/CreatePromoCodeDialog';
import { EditPromoCodeDialog } from '@/components/promoCodes/EditPromoCodeDialog';
import { ManagePromoCodeRulesDialog } from '@/components/promoCodes/ManagePromoCodeRulesDialog';
import { ACTION, CONFIRM_BUTTON, STATUS_BADGE } from '@/lib/action-palette';
import type { IPromoCodeDto } from '@/types/generated/api-types';

function formatDiscount(code: IPromoCodeDto): string {
  const { coupon } = code;
  if (coupon.percentOff != null) return `-${coupon.percentOff}%`;
  if (coupon.amountOff != null) {
    const currency = (coupon.currency ?? 'eur').toUpperCase();
    const value = coupon.amountOff / 100;
    return `-${value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency}`;
  }
  return '—';
}

function formatDuration(code: IPromoCodeDto): string {
  switch (code.coupon.duration) {
    case 'once':
      return 'Une fois';
    case 'forever':
      return 'Permanent';
    case 'repeating':
      return `${code.coupon.durationInMonths ?? '?'} mois`;
    default:
      return '—';
  }
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR');
}

function PromoCodeRow({
  promoCode,
  isAdmin,
  onEdit,
  onManageRules,
}: {
  promoCode: IPromoCodeDto;
  isAdmin: boolean;
  onEdit: (promoCode: IPromoCodeDto) => void;
  onManageRules: (promoCode: IPromoCodeDto) => void;
}) {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const archiveMutation = useArchiveAdminPromoCode();
  const reactivateMutation = useReactivateAdminPromoCode();
  const deleteMutation = useDeleteAdminPromoCode();

  const redemptions = promoCode.maxRedemptions
    ? `${promoCode.timesRedeemed} / ${promoCode.maxRedemptions}`
    : `${promoCode.timesRedeemed}`;

  const rulesCount = promoCode.rules?.length ?? 0;

  // Hard delete is refused server-side as soon as a single redemption row
  // exists — the audit trail outweighs the convenience of cleanup. Mirror
  // that here so the user sees why the button is disabled instead of getting
  // a 409 after clicking.
  const canDelete = promoCode.redemptionCount === 0;
  const deleteDisabledReason = canDelete
    ? 'Supprimer définitivement'
    : `Suppression bloquée — ${promoCode.redemptionCount} utilisation${promoCode.redemptionCount > 1 ? 's' : ''} tracée${promoCode.redemptionCount > 1 ? 's' : ''}. Désactivez le code à la place.`;

  function handleArchive() {
    archiveMutation.mutate(promoCode.id, {
      onSuccess: () => {
        toast.success(`Code "${promoCode.code}" désactivé`);
        setArchiveOpen(false);
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : 'Erreur'),
    });
  }

  function handleReactivate() {
    reactivateMutation.mutate(promoCode.id, {
      onSuccess: () => toast.success(`Code "${promoCode.code}" réactivé`),
      onError: (err) => toast.error(err instanceof Error ? err.message : 'Erreur'),
    });
  }

  function handleDelete() {
    deleteMutation.mutate(promoCode.id, {
      onSuccess: () => {
        toast.success(`Code "${promoCode.code}" supprimé`);
        setDeleteOpen(false);
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : 'Erreur'),
    });
  }

  return (
    <>
      <TableRow>
        <TableCell className="font-mono font-semibold">{promoCode.code}</TableCell>
        <TableCell>{formatDiscount(promoCode)}</TableCell>
        <TableCell>{formatDuration(promoCode)}</TableCell>
        <TableCell>
          <div className="flex flex-col leading-tight">
            <span>{redemptions}</span>
            {promoCode.redemptionCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {promoCode.redemptionCount} tracée{promoCode.redemptionCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <Badge className={promoCode.active ? STATUS_BADGE.active : STATUS_BADGE.inactive}>
            {promoCode.active ? 'Actif' : 'Inactif'}
          </Badge>
        </TableCell>
        <TableCell className="text-muted-foreground text-sm">
          {formatDate(promoCode.expiresAt)}
        </TableCell>
        <TableCell className="text-muted-foreground text-sm">
          {formatDate(promoCode.createdAt)}
        </TableCell>
        <TableCell>
          <Badge variant={rulesCount > 0 ? 'default' : 'outline'}>
            {rulesCount === 0 ? 'Aucune' : `${rulesCount} règle${rulesCount > 1 ? 's' : ''}`}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center justify-end gap-1">
            {isAdmin && promoCode.active && (
              <Button
                variant="ghost"
                size="icon"
                className={ACTION.neutral}
                onClick={() => onEdit(promoCode)}
                title="Modifier"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className={ACTION.neutral}
                onClick={() => onManageRules(promoCode)}
                title="Gérer les règles"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            )}
            {isAdmin && promoCode.active && (
              <Button
                variant="ghost"
                size="icon"
                className={ACTION.warning}
                onClick={() => setArchiveOpen(true)}
                disabled={archiveMutation.isPending}
                title="Désactiver"
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
            {isAdmin && !promoCode.active && (
              <Button
                variant="ghost"
                size="icon"
                className={ACTION.success}
                onClick={handleReactivate}
                disabled={reactivateMutation.isPending}
                title="Réactiver"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className={
                  canDelete
                    ? ACTION.destructive
                    : `${ACTION.neutral} opacity-40 cursor-not-allowed`
                }
                onClick={() => setDeleteOpen(true)}
                disabled={deleteMutation.isPending || !canDelete}
                title={deleteDisabledReason}
                aria-label={deleteDisabledReason}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Désactiver le code</DialogTitle>
            <DialogDescription>
              Désactiver &ldquo;{promoCode.code}&rdquo; ? Il ne pourra plus être utilisé à partir de
              maintenant, mais reste réactivable. Les souscriptions déjà actives avec ce code ne
              sont pas affectées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveOpen(false)}>
              Annuler
            </Button>
            <Button
              className={CONFIRM_BUTTON.warning}
              onClick={handleArchive}
              disabled={archiveMutation.isPending}
            >
              {archiveMutation.isPending ? 'Désactivation...' : 'Désactiver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Supprimer définitivement</DialogTitle>
            <DialogDescription>
              Supprimer &ldquo;{promoCode.code}&rdquo; ? Cette action est{' '}
              <strong>irréversible</strong> : le code est retiré de la base et les objets Stripe
              associés sont supprimés. Les souscriptions déjà actives avec ce code conservent leur
              remise.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function PromoCodesPage() {
  const { data: promoCodes, isLoading } = useAdminPromoCodes();
  const { userRoles } = useAuth();
  const isAdmin = userRoles?.isAdmin ?? false;
  const [createOpen, setCreateOpen] = useState(false);
  const [editFor, setEditFor] = useState<IPromoCodeDto | null>(null);
  const [rulesFor, setRulesFor] = useState<IPromoCodeDto | null>(null);

  // Keep the rules dialog's promo code in sync with the latest list refetch —
  // a mutation from inside the dialog invalidates the list, and we want the
  // dialog to reflect the refreshed rules without closing.
  const syncedRulesFor = rulesFor
    ? (promoCodes?.find((c) => c.id === rulesFor.id) ?? rulesFor)
    : null;

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Codes promo</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Coupons et promotion codes Stripe (réductions sur abonnements).
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau code
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Réduction</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Redemptions</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Expire</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead>Règles</TableHead>
              <TableHead className="w-32 text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {promoCodes && promoCodes.length > 0 ? (
              promoCodes.map((code) => (
                <PromoCodeRow
                  key={code.id}
                  promoCode={code}
                  isAdmin={isAdmin}
                  onEdit={setEditFor}
                  onManageRules={setRulesFor}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  Aucun code promo
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CreatePromoCodeDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditPromoCodeDialog
        promoCode={editFor}
        onOpenChange={(open) => {
          if (!open) setEditFor(null);
        }}
      />
      <ManagePromoCodeRulesDialog
        promoCode={syncedRulesFor}
        onOpenChange={(open) => {
          if (!open) setRulesFor(null);
        }}
      />
    </div>
  );
}
