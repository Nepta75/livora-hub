'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle, Zap } from 'lucide-react';
import { useAdvanceBilling } from '@/hooks/api/devTools/useAdvanceBilling';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const IS_LIVE_MODE = process.env.NEXT_PUBLIC_STRIPE_MODE === 'live';

export default function DevToolsPage() {
  const { userRoles } = useAuth();
  const advanceMutation = useAdvanceBilling();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Defense in depth — sidebar already hides the entry, but a direct URL
  // hit on a prod build should 404 rather than render a button that would
  // 403 anyway.
  if (IS_LIVE_MODE) {
    notFound();
  }

  if (!userRoles?.isAdmin) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Accès réservé aux administrateurs.
      </p>
    );
  }

  function handleAdvance() {
    advanceMutation.mutate(undefined, {
      onSuccess: (result) => {
        setConfirmOpen(false);
        const summary = `${result.advanced} abonnement${result.advanced > 1 ? 's' : ''} avancé${result.advanced > 1 ? 's' : ''}`;
        if (result.errors.length > 0) {
          toast.warning(`${summary} — ${result.errors.length} erreur(s) Stripe, voir les logs.`);
        } else {
          toast.success(`${summary}. Les webhooks Stripe arrivent.`);
        }
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Erreur inattendue.';
        toast.error(message.includes('production') ? 'Refusé en production.' : message);
      },
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Dev Tools</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Outils de simulation pour tester les flux de facturation. Bloqués en production.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-600" />
            Avancer la facturation Stripe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Repositionne le <span className="font-mono">billing_cycle_anchor</span> de chaque
            abonnement Stripe actif sur <span className="font-mono">now</span> avec proration
            facturée immédiatement. Stripe émet une nouvelle facture, qui déclenche en chaîne{' '}
            <span className="font-mono">invoice.created</span> →{' '}
            <span className="font-mono">invoice.finalized</span> →{' '}
            <span className="font-mono">invoice.paid</span> via le pipeline webhook habituel.
          </p>
          <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              Action irréversible. À utiliser uniquement en environnement de test. Refusée
              côté backend si <span className="font-mono">APP_ENV=prod</span>.
            </div>
          </div>
          <Button
            variant="default"
            onClick={() => setConfirmOpen(true)}
            disabled={advanceMutation.isPending}
          >
            {advanceMutation.isPending ? 'Avancement…' : 'Avancer tous les abonnements (1 mois)'}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirmer l&apos;avancement</DialogTitle>
            <DialogDescription>
              Tous les abonnements Stripe actifs vont être facturés immédiatement pour leur
              prochain cycle. Continuer ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAdvance} disabled={advanceMutation.isPending}>
              {advanceMutation.isPending ? 'Avancement…' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
