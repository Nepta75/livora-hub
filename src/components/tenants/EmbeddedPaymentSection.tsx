'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { STATUS_BADGE, CONFIRM_BUTTON } from '@/lib/action-palette';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  useAdminTenantEmbeddedPayment,
  useSetAdminTenantAuthCapture,
} from '@/hooks/api/tenants/useAdminTenants';

/**
 * Reservation (auth-then-capture) rollout for one tenant: the switch Livora owns.
 *
 * ON: an embedded order due within the safe hold window holds the funds and debits
 * the customer when a driver takes the job. OFF: every new embedded order is
 * charged immediately, as before. Turning it off never strands money, holds
 * already placed are still captured or released by the backend pipeline.
 */
export function EmbeddedPaymentSection({ tenantId }: { tenantId: string }) {
  const { userRoles } = useAuth();
  const isAdmin = userRoles?.isAdmin ?? false;

  const { data: settings, isLoading, isError } = useAdminTenantEmbeddedPayment(tenantId);
  const setAuthCapture = useSetAdminTenantAuthCapture(tenantId);

  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading || isError || !settings) return null;

  const enabled = settings.authCaptureEnabled;

  // What the tenant's customers actually experience today. Enrolment alone is not
  // enough: without online payment, or with the tenant's own opt-out, nothing is
  // ever reserved.
  const effective = enabled && settings.onlinePaymentEnabled && !settings.forceImmediatePayment;

  const apply = async (next: boolean) => {
    try {
      await setAuthCapture.mutateAsync(next);
      toast.success(
        next
          ? 'Réservation activée pour ce tenant.'
          : 'Réservation désactivée, les nouvelles commandes sont débitées immédiatement.',
      );
      setConfirmOpen(false);
    } catch {
      toast.error('La mise à jour a échoué.');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          Réservation avant débit (paiement embarqué)
          <Badge
            variant="outline"
            className={cn('ml-auto', enabled ? STATUS_BADGE.active : STATUS_BADGE.inactive)}
          >
            {enabled ? 'Activée' : 'Désactivée'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Quand elle est activée, une commande embarquée à livrer sous 5 jours réserve le montant
          sur la carte du client (aucun débit), puis le débite à la prise en charge par un livreur.
          Au-delà de 5 jours, la commande reste encaissée immédiatement. La désactivation ne touche
          que les nouvelles commandes : les réservations en cours sont capturées ou levées
          normalement.
        </p>

        {enabled && !effective && (
          <div className={cn('rounded-md border p-3 text-sm', STATUS_BADGE.warning)}>
            {!settings.onlinePaymentEnabled
              ? "Aucune réservation n'a lieu : ce tenant n'a pas activé le paiement en ligne."
              : "Aucune réservation n'a lieu : ce tenant a choisi le débit immédiat dans ses réglages."}
          </div>
        )}

        {enabled && effective && !settings.chargesEnabled && (
          <div className={cn('rounded-md border p-3 text-sm', STATUS_BADGE.warning)}>
            Le compte Stripe de ce tenant ne peut pas encaisser pour le moment.
          </div>
        )}

        {isAdmin && (
          <Button
            variant="outline"
            disabled={setAuthCapture.isPending}
            onClick={() => (enabled ? setConfirmOpen(true) : apply(true))}
          >
            {enabled ? 'Désactiver la réservation' : 'Activer la réservation'}
          </Button>
        )}
      </CardContent>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Désactiver la réservation ?</DialogTitle>
            <DialogDescription>
              Les nouvelles commandes embarquées de ce tenant seront de nouveau débitées
              immédiatement. Les réservations déjà posées suivent leur cours : elles seront
              débitées à la prise en charge, ou levées si la course n&apos;est pas assurée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              className={CONFIRM_BUTTON.warning}
              disabled={setAuthCapture.isPending}
              onClick={() => apply(false)}
            >
              Désactiver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
