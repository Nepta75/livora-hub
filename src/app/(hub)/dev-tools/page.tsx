'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle, Receipt, Zap } from 'lucide-react';
import { useAdvanceBilling } from '@/hooks/api/devTools/useAdvanceBilling';
import { useGenerateOverageInvoices } from '@/hooks/api/devTools/useGenerateOverageInvoices';
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
  const overageMutation = useGenerateOverageInvoices();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [overageConfirmOpen, setOverageConfirmOpen] = useState(false);

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
        const summary = `${result.advanced} facture${result.advanced > 1 ? 's' : ''} générée${result.advanced > 1 ? 's' : ''}`;
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

  function handleGenerateOverage() {
    overageMutation.mutate(undefined, {
      onSuccess: (result) => {
        setOverageConfirmOpen(false);
        const summary = `${result.billed} dépassement${result.billed > 1 ? 's' : ''} facturé${result.billed > 1 ? 's' : ''}`;
        if (result.errors > 0) {
          toast.warning(`${summary} — ${result.errors} erreur(s), voir les logs.`);
        } else if (result.billed === 0) {
          toast.info('Aucun dépassement non facturé à traiter.');
        } else {
          toast.success(`${summary}. Factures Stripe émises.`);
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
            Générer une facture de proration Stripe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Repositionne le <span className="font-mono">billing_cycle_anchor</span> de chaque
            abonnement Stripe actif sur <span className="font-mono">now</span>. Stripe émet
            immédiatement une facture pour la portion non facturée du cycle en cours
            (proration), qui déclenche en chaîne <span className="font-mono">invoice.created</span>{' '}
            → <span className="font-mono">invoice.finalized</span> →{' '}
            <span className="font-mono">invoice.paid</span> via le pipeline webhook habituel.
            Ne couvre PAS les dépassements (utiliser le bouton ci-dessous).
          </p>
          <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              Action irréversible. À utiliser uniquement en environnement de test. Refusée
              côté backend si la clé Stripe est <span className="font-mono">sk_live_*</span>.
            </div>
          </div>
          <Button
            variant="default"
            onClick={() => setConfirmOpen(true)}
            disabled={advanceMutation.isPending}
          >
            {advanceMutation.isPending
              ? 'Génération…'
              : 'Générer une facture pour tous les abonnements'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="h-4 w-4 text-amber-600" />
            Générer factures de dépassement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Facture immédiatement chaque <span className="font-mono">OverageRecord</span>{' '}
            non facturé en factures Stripe standalone (un par tenant). Bypass de la
            fenêtre de grâce 24h du cron et du filtre{' '}
            <span className="font-mono">billing_reason</span> du webhook. Permet de tester
            le pipeline overage → mirror FR → PDF sans attendre le cron quotidien ni un
            cycle Stripe naturel.
          </p>
          <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              Action irréversible. Les factures Stripe émises seront réelles (en mode
              test). Refusée côté backend si la clé Stripe est{' '}
              <span className="font-mono">sk_live_*</span>.
            </div>
          </div>
          <Button
            variant="default"
            onClick={() => setOverageConfirmOpen(true)}
            disabled={overageMutation.isPending}
          >
            {overageMutation.isPending
              ? 'Facturation…'
              : 'Facturer tous les dépassements maintenant'}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirmer la génération</DialogTitle>
            <DialogDescription>
              Une facture de proration va être émise immédiatement pour chaque abonnement
              Stripe actif (portion non facturée du cycle en cours). Continuer ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAdvance} disabled={advanceMutation.isPending}>
              {advanceMutation.isPending ? 'Génération…' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={overageConfirmOpen} onOpenChange={setOverageConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirmer la facturation</DialogTitle>
            <DialogDescription>
              Tous les dépassements non facturés vont être attachés à de nouvelles
              factures Stripe standalone et finalisés immédiatement. Continuer ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOverageConfirmOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleGenerateOverage} disabled={overageMutation.isPending}>
              {overageMutation.isPending ? 'Facturation…' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
