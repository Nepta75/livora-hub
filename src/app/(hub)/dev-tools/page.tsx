'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle, Database, MapPin, Navigation, Receipt, Square, Trash2, Zap } from 'lucide-react';
import { useAdvanceBilling } from '@/hooks/api/devTools/useAdvanceBilling';
import {
  useDriverSimulationStatus,
  useSimulateDriverDeviation,
  useStartDriverSimulation,
  useStopDriverSimulation,
} from '@/hooks/api/devTools/useDriverSimulation';
import { useGenerateOverageInvoices } from '@/hooks/api/devTools/useGenerateOverageInvoices';
import {
  useAgeInvoices,
  useRunInvoiceRelance,
  useRunInvoiceRelancePreview,
  useToggleInvoiceRelance,
} from '@/hooks/api/devTools/useInvoiceRelance';
import { usePurgeTenantSeedData } from '@/hooks/api/devTools/usePurgeTenantSeedData';
import { useSeedTenantData } from '@/hooks/api/devTools/useSeedTenantData';
import { useAdminTenants } from '@/hooks/api/tenants/useAdminTenants';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Fail-safe gate: positive opt-in via `=test`. If the env var is unset or
// holds any other value (`live`, empty, typo) the page 404s. Backend already
// refuses live keys; this just keeps a misbuilt image from rendering the UI.
const IS_TEST_MODE = process.env.NEXT_PUBLIC_STRIPE_MODE === 'test';

export default function DevToolsPage() {
  const { userRoles } = useAuth();
  const advanceMutation = useAdvanceBilling();
  const overageMutation = useGenerateOverageInvoices();
  const seedMutation = useSeedTenantData();
  const purgeMutation = usePurgeTenantSeedData();
  const { data: tenants = [] } = useAdminTenants();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [overageConfirmOpen, setOverageConfirmOpen] = useState(false);
  const [seedConfirmOpen, setSeedConfirmOpen] = useState(false);
  const [purgeConfirmOpen, setPurgeConfirmOpen] = useState(false);
  const [seedTenantId, setSeedTenantId] = useState<string>('');
  const [simTenantId, setSimTenantId] = useState<string>('');
  const { data: simStatus } = useDriverSimulationStatus(simTenantId || null);
  const startSimMutation = useStartDriverSimulation();
  const stopSimMutation = useStopDriverSimulation();
  const deviationMutation = useSimulateDriverDeviation();
  const [relanceTenantId, setRelanceTenantId] = useState<string>('');
  const ageInvoicesMutation = useAgeInvoices();
  const toggleRelanceMutation = useToggleInvoiceRelance();
  const runRelanceMutation = useRunInvoiceRelance();
  const runPreviewMutation = useRunInvoiceRelancePreview();

  // Defense in depth, sidebar already hides the entry, but a direct URL
  // hit on a non-test build should 404 rather than render a button that
  // would 403 anyway.
  if (!IS_TEST_MODE) {
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
          toast.warning(`${summary}, ${result.errors.length} erreur(s) Stripe, voir les logs.`);
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

  function handleSeedTenant() {
    if (!seedTenantId) return;
    seedMutation.mutate(seedTenantId, {
      onSuccess: (result) => {
        setSeedConfirmOpen(false);
        const summary = [
          `${result.ordersAppended} commande(s) ajoutée(s)`,
          `${result.schedulesAppended} planning(s) ajouté(s)`,
        ].join(', ');
        const adminLine = `Admin: ${result.adminUser.email} / ${result.adminUser.password}`;
        if (result.warnings.length > 0) {
          toast.warning(`${summary}. ${adminLine}. Warnings: ${result.warnings.join(' ')}`);
        } else {
          toast.success(`${summary}. ${adminLine}`);
        }
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Erreur inattendue.';
        toast.error(message.includes('live') ? 'Refusé en mode live.' : message);
      },
    });
  }

  function handleStartSim() {
    if (!simTenantId) return;
    startSimMutation.mutate(simTenantId, {
      onSuccess: (result) => {
        toast.success(
          result.alreadyRunning
            ? 'Simulation déjà en cours pour ce tenant.'
            : 'Simulation démarrée. Les livreurs vont avancer le long des tournées du jour.',
        );
      },
      onError: (e) => {
        toast.error(`Erreur démarrage: ${e instanceof Error ? e.message : 'inconnue'}`);
      },
    });
  }

  function handleStopSim() {
    if (!simTenantId) return;
    stopSimMutation.mutate(simTenantId, {
      onSuccess: (result) => {
        toast.success(
          result.stopped
            ? 'Simulation arrêtée. Le worker quitte au prochain tick.'
            : 'Aucune simulation en cours pour ce tenant.',
        );
      },
      onError: (e) => {
        toast.error(`Erreur arrêt: ${e instanceof Error ? e.message : 'inconnue'}`);
      },
    });
  }

  function handleSimulateDeviation() {
    if (!simTenantId) return;
    deviationMutation.mutate(simTenantId, {
      onSuccess: (result) => {
        if (result.alreadyDeviating) {
          toast.info('Une déviation est déjà en cours pour ce tenant.');
          return;
        }
        const driver = result.driverName ?? 'Le livreur';
        if (!result.liveRerouteEnabled) {
          toast.warning(
            `Déviation lancée pour ${driver}, mais le recalcul sur déviation est désactivé pour ce tenant : il va dévier sans que le tracé se recalcule. Active-le dans les Réglages dispatch de l'app.`,
          );
          return;
        }
        toast.success(
          `${driver} va quitter son tracé dans les prochaines secondes. Sélectionne sa tournée sur la carte dispatch : la détection tombera vers ~500 m d'écart, puis le tracé se recalculera.`,
        );
      },
      onError: (e) => {
        toast.error(`Erreur déviation: ${e instanceof Error ? e.message : 'inconnue'}`);
      },
    });
  }

  function handlePurgeTenant() {
    if (!seedTenantId) return;
    purgeMutation.mutate(seedTenantId, {
      onSuccess: (result) => {
        setPurgeConfirmOpen(false);
        const removed = [
          `${result.orders} commande(s)`,
          `${result.tours} tournée(s)`,
          `${result.organizations} client(s)`,
          `${result.warehouses} entrepôt(s)`,
          `${result.vehicles} véhicule(s)`,
          `${result.users} utilisateur(s)`,
        ].join(', ');
        const total =
          result.orders +
          result.tours +
          result.assignmentSuggestions +
          result.driverLocations +
          result.driverSchedules +
          result.orderAddresses +
          result.deliveryPrestations +
          result.pricingConfigs +
          result.organizations +
          result.organizationAddresses +
          result.warehouses +
          result.vehicles +
          result.userTenants +
          result.users;
        if (total === 0) {
          toast.info('Aucune donnée [SEED] à supprimer sur ce tenant.');
        } else {
          toast.success(`Purge effectuée: ${removed}.`);
        }
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Erreur inattendue.';
        toast.error(message.includes('live') ? 'Refusé en mode live.' : message);
      },
    });
  }

  function handleToggleRelance(enabled: boolean) {
    toggleRelanceMutation.mutate(
      { tenantId: relanceTenantId, enabled },
      {
        onSuccess: (result) => {
          toast.success(
            result.enabled
              ? 'Relance activée pour ce tenant. Ses clients peuvent désormais recevoir un mail.'
              : 'Relance éteinte, état par défaut du produit rétabli.',
          );
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : 'Erreur inattendue.';
          toast.error(message.includes('settings row') ? 'Ce tenant n’a pas encore de réglages.' : message);
        },
      },
    );
  }

  function handleAgeInvoices(days: number) {
    ageInvoicesMutation.mutate(
      { tenantId: relanceTenantId, days },
      {
        onSuccess: (result) => {
          if (result.aged === 0) {
            // The common first-run case, and the message has to say what to do about it: the tool
            // ages, it never creates, so an empty result means there is nothing issued yet.
            toast.info(
              `Aucune facture à vieillir (${result.skipped} ignorée(s) : brouillon, avoirée ou déjà payée). Émettez d’abord une facture depuis l’app.`,
            );
          } else {
            toast.success(
              `${result.aged} facture(s) vieillie(s) de ${days} jours, ${result.skipped} ignorée(s).`,
            );
          }
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : 'Erreur inattendue.';
          toast.error(message.includes('preprod') ? 'Refusé en production.' : message);
        },
      },
    );
  }

  function handleRunPreview() {
    runPreviewMutation.mutate(undefined, {
      onSuccess: (result) => {
        if (result.lockHeld) {
          toast.info('Un autre passage tient le verrou, rien n’a été fait.');
        } else if (result.tenantsWarned === 0) {
          toast.info('Aucun transporteur à prévenir : rien ne sera relancé demain.');
        } else {
          toast.success(
            `${result.tenantsWarned} transporteur(s) prévenu(s), ${result.invoicesAnnounced} facture(s) annoncée(s).`,
          );
        }
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Erreur inattendue.';
        toast.error(message.includes('preprod') ? 'Refusé en production.' : message);
      },
    });
  }

  function handleRunRelance() {
    runRelanceMutation.mutate(undefined, {
      onSuccess: (result) => {
        if (result.lockHeld) {
          toast.info('Un autre passage tient le verrou, rien n’a été fait.');
        } else if (result.sent === 0) {
          toast.info(
            `Aucune relance envoyée (${result.skipped} pas encore due(s)). Vérifiez l’interrupteur et le vieillissement.`,
          );
        } else {
          const tail = result.undeliverable > 0 ? `, ${result.undeliverable} adresse(s) refusée(s)` : '';
          toast.success(`${result.sent} relance(s) envoyée(s)${tail}.`);
        }
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Erreur inattendue.';
        toast.error(message.includes('preprod') ? 'Refusé en production.' : message);
      },
    });
  }

  function handleGenerateOverage() {
    overageMutation.mutate(undefined, {
      onSuccess: (result) => {
        setOverageConfirmOpen(false);
        const summary = `${result.billed} dépassement${result.billed > 1 ? 's' : ''} facturé${result.billed > 1 ? 's' : ''}`;
        if (result.errors > 0) {
          toast.warning(`${summary}, ${result.errors} erreur(s), voir les logs.`);
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4 text-amber-600" />
            Peupler un tenant avec des données de test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Crée des refs stables (3 véhicules de types différents : vélo cargo, van,
            scooter, 3 livreurs avec véhicule par défaut, 2 entrepôts, 5 clients) la
            première fois. Chaque relance ajoute 10 commandes
            <span className="font-mono"> ready_for_shipping</span> pour aujourd&apos;hui et 3
            plannings livreurs, dont 2 commandes volumineuses que seul le livreur en van
            peut prendre (test du garde-fou véhicule). Toutes les entités créées sont
            préfixées <span className="font-mono">[SEED]</span> pour les distinguer.
          </p>
          <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              Bloqué en production. Le tenant doit déjà avoir au moins une DeliveryPrestation
              + un PricingConfig pour que les commandes soient créées.
            </div>
          </div>
          <Select value={seedTenantId} onValueChange={(v) => setSeedTenantId(v ?? '')}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un tenant" />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              onClick={() => setSeedConfirmOpen(true)}
              disabled={!seedTenantId || seedMutation.isPending}
            >
              {seedMutation.isPending ? 'Peuplement…' : 'Peupler ce tenant'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setPurgeConfirmOpen(true)}
              disabled={!seedTenantId || purgeMutation.isPending}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {purgeMutation.isPending ? 'Purge…' : 'Purger [SEED]'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Simuler les tournées (drivers walker)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Démarre un worker CLI en arrière-plan qui ping{' '}
            <span className="font-mono">/driver-location</span> toutes les 5s pour chaque
            tournée du jour, en avançant le livreur le long du polyline Mapbox
            proportionnellement au temps écoulé. La carte du dispatcher (
            <span className="font-mono">/dashboard/dispatch</span>) s&apos;anime en temps
            réel, sans app driver. Hard-stop automatique après 4h pour éviter de laisser
            tourner indéfiniment.
          </p>
          <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              Bloqué en production côté backend (refuse si clé Stripe live). Outil
              preprod/local uniquement.
            </div>
          </div>
          <Select value={simTenantId} onValueChange={(v) => setSimTenantId(v ?? '')}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un tenant" />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {simTenantId && simStatus?.job && (
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs space-y-1">
              <div>
                <span className="text-muted-foreground">Statut:</span>{' '}
                <span className="font-medium">
                  {simStatus.job.status === 'running' ? 'En cours' : 'Arrêté'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Démarré:</span>{' '}
                <span className="font-mono">
                  {new Date(simStatus.job.startedAt).toLocaleTimeString('fr-FR')}
                </span>
              </div>
              {(simStatus.job.lastTickAt || simStatus.job.lastTickMessage) && (
                <div>
                  {simStatus.job.lastTickAt ? (
                    <>
                      <span className="text-muted-foreground">Dernier tick:</span>{' '}
                      <span className="font-mono">
                        {new Date(simStatus.job.lastTickAt).toLocaleTimeString('fr-FR')}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Diag spawn:</span>
                  )}
                  {simStatus.job.lastTickMessage && (
                    <span className="text-muted-foreground">
                      {' '}
                      ({simStatus.job.lastTickMessage})
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              onClick={handleStartSim}
              disabled={
                !simTenantId ||
                startSimMutation.isPending ||
                simStatus?.job?.status === 'running'
              }
            >
              <MapPin className="h-4 w-4 mr-2" />
              {startSimMutation.isPending ? 'Démarrage…' : 'Démarrer la simulation'}
            </Button>
            <Button
              variant="outline"
              onClick={handleStopSim}
              disabled={
                !simTenantId ||
                stopSimMutation.isPending ||
                simStatus?.job?.status !== 'running'
              }
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Square className="h-4 w-4 mr-2" />
              {stopSimMutation.isPending ? 'Arrêt…' : 'Arrêter'}
            </Button>
            <Button
              variant="outline"
              onClick={handleSimulateDeviation}
              disabled={!simTenantId || deviationMutation.isPending}
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              title="Pousse une position GPS à ~1-2 km du trajet prévu pour un livreur en tournée, via le vrai endpoint d'ingestion. Teste le recalcul du tracé sur déviation (à activer dans les Réglages dispatch du tenant)."
            >
              <Navigation className="h-4 w-4 mr-2" />
              {deviationMutation.isPending ? 'Déviation…' : 'Simuler une déviation'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* The chase is close to untestable by hand: it wants an invoice issued, delivered, seven
          days past due and unpaid, on a tenant who opted in, fired from a 06:00 crontab. That is
          why it shipped having never sent a mail, and why a DQL error in its query survived to
          production. These four actions collapse that into an afternoon, in the order they are
          listed. */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="h-4 w-4 text-rose-600" />
            Simuler la relance des factures impayées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Émettez d&apos;abord une vraie facture depuis l&apos;app (Facturation → À facturer →
            valider), puis déroulez ici. <strong>Rien n&apos;est fabriqué</strong> : émettre une
            facture réserve un numéro dans une série légalement séquentielle, et un document créé
            hors du vrai chemin y laisserait un trou. On fait vieillir l&apos;existant.
          </p>
          <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              La relance écrit <strong>aux clients du transporteur, sous son nom</strong>. Elle est
              opt-in et éteinte partout : sans l&apos;interrupteur ci-dessous, «&nbsp;Lancer la
              relance&nbsp;» ne fait rien et ne signale rien.
            </div>
          </div>

          <Select value={relanceTenantId} onValueChange={(v) => setRelanceTenantId(v ?? '')}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un tenant" />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => handleToggleRelance(true)}
              disabled={!relanceTenantId || toggleRelanceMutation.isPending}
              title="Active GlobalSetting.invoiceRelanceEnabled pour ce tenant. Sans ça, le cron ignore le tenant en silence."
            >
              <Zap className="h-4 w-4 mr-2" />
              1. Activer la relance
            </Button>

            <Button
              variant="outline"
              onClick={() => handleAgeInvoices(10)}
              disabled={!relanceTenantId || ageInvoicesMutation.isPending}
              title="Recule l'échéance de 10 jours et la date d'envoi de 17, et remet le compteur de relances à zéro. Ignore brouillons, avoirées et déjà payées."
            >
              <Database className="h-4 w-4 mr-2" />
              {ageInvoicesMutation.isPending ? 'Vieillissement…' : '2. Vieillir de 10 jours'}
            </Button>

            <Button
              variant="outline"
              onClick={handleRunPreview}
              disabled={runPreviewMutation.isPending}
              title="Lance le cron de 06:30. Il décrit la relance de DEMAIN, donc il annonce ce que l'étape 4 enverra."
            >
              <Receipt className="h-4 w-4 mr-2" />
              {runPreviewMutation.isPending ? 'Préavis…' : '3. Envoyer le préavis'}
            </Button>

            <Button
              variant="outline"
              onClick={handleRunRelance}
              disabled={runRelanceMutation.isPending}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              title="Lance le cron de 06:00 pour de vrai. Envoie une relance au CLIENT de chaque tenant opt-in dont une facture est due."
            >
              <Zap className="h-4 w-4 mr-2" />
              {runRelanceMutation.isPending ? 'Relance…' : '4. Lancer la relance'}
            </Button>

            <Button
              variant="outline"
              onClick={() => handleToggleRelance(false)}
              disabled={!relanceTenantId || toggleRelanceMutation.isPending}
              title="Remet le tenant dans l'état par défaut du produit."
            >
              <Square className="h-4 w-4 mr-2" />
              Éteindre
            </Button>
          </div>
          {/* The two run actions are global on purpose: they call the real cron services, which
              iterate every tenant and read each opt-in themselves. A per-tenant variant would be a
              second implementation of the selection, free to disagree with what it tests. */}
          <p className="text-xs text-muted-foreground">
            Les étapes 3 et 4 tournent sur <strong>tous</strong> les tenants, comme le vrai cron.
            C&apos;est l&apos;interrupteur qui délimite le test, exactement comme en production.
          </p>
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

      <Dialog open={purgeConfirmOpen} onOpenChange={setPurgeConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirmer la purge</DialogTitle>
            <DialogDescription>
              Suppression de toutes les entités <span className="font-mono">[SEED]</span> du
              tenant: véhicules, livreurs, entrepôts, clients, commandes, tournées,
              suggestions, plannings, pricing config. Le compte admin{' '}
              <span className="font-mono">admin.seed@livora.test</span> n&apos;est retiré que
              s&apos;il n&apos;est plus lié à un autre tenant. Action irréversible. Continuer ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPurgeConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handlePurgeTenant}
              disabled={purgeMutation.isPending}
            >
              {purgeMutation.isPending ? 'Purge…' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={seedConfirmOpen} onOpenChange={setSeedConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirmer le peuplement</DialogTitle>
            <DialogDescription>
              Le tenant sélectionné va recevoir des entités{' '}
              <span className="font-mono">[SEED]</span> (idempotent) et 10 commandes du
              jour + 3 plannings livreurs (append à chaque relance). Continuer ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSeedConfirmOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSeedTenant} disabled={seedMutation.isPending}>
              {seedMutation.isPending ? 'Peuplement…' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
