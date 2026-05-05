'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import {
  useAdminTenant,
  useAdminTenantAuditLogs,
  useAdminTenantUsers,
  useInviteUserToTenant,
  useImpersonationLogs,
  useImpersonateTenant,
  useRemoveTenantUser,
  useUpdateAdminTenant,
  useUpdateTenantUser,
} from '@/hooks/api/tenants/useAdminTenants';
import type { IAuditLog, ImpersonationLog } from '@/services/admin/tenantsService';
import {
  TENANT_USER_ROLES,
  inviteTenantUserSchema,
  editTenantUserSchema,
  updateTenantSchema,
  type InviteTenantUserFormValues,
  type EditTenantUserFormValues,
  type UpdateTenantFormValues,
} from '@/validators/tenants/validator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { ArrowLeft, Plus, UserPlus, Pencil, Trash2, ExternalLink, ShieldCheck, ScrollText, ChevronDown, ChevronRight, ClipboardList, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { STATUS_BADGE } from '@/lib/action-palette';
import type { IUser } from '@/types/generated/api-types';
import { useTenantSubscription } from '@/hooks/api/plans/useAdminPlans';
import { MigrateSubscriptionDialog } from '@/components/plans/MigrateSubscriptionDialog';
import { SubscriptionInvoicesSection } from '@/components/tenants/SubscriptionInvoicesSection';

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
};

function formatShortDateTime(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function AuditLogEntry({ log }: { log: IAuditLog }) {
  const hasChanges = log.changes && Object.keys(log.changes).length > 0;
  const [changesExpanded, setChangesExpanded] = useState(false);

  return (
    <div className="py-2 border-b last:border-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {log.action && (
              <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                {ACTION_LABELS[log.action] ?? log.action}
              </span>
            )}
            {log.entityType && (
              <span className="text-xs text-muted-foreground font-medium">{log.entityType}</span>
            )}
          </div>
          <p className="text-sm mt-0.5">{log.message}</p>
          {hasChanges && (
            <button
              type="button"
              onClick={() => setChangesExpanded(p => !p)}
              className="flex items-center gap-1 text-xs text-muted-foreground mt-1 hover:text-foreground transition-colors"
            >
              {changesExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              Détails
            </button>
          )}
          {changesExpanded && hasChanges && (
            <div className="mt-1 pl-2 border-l-2 border-muted space-y-0.5">
              {Object.entries(log.changes as Record<string, [unknown, unknown]>).map(
                ([field, [oldVal, newVal]]) => (
                  <p key={field} className="text-xs">
                    <span className="font-medium text-muted-foreground">{field}: </span>
                    <span className="line-through text-destructive">{String(oldVal ?? '—')}</span>
                    {' → '}
                    <span className="text-green-600 dark:text-green-400">
                      {String(newVal ?? '—')}
                    </span>
                  </p>
                ),
              )}
            </div>
          )}
        </div>
        <time className="shrink-0 text-xs text-muted-foreground">
          {formatShortDateTime(log.createdAt)}
        </time>
      </div>
    </div>
  );
}

function ImpersonationSessionRow({
  log,
  tenantId,
}: {
  log: ImpersonationLog;
  tenantId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const { data: auditLogs, isLoading } = useAdminTenantAuditLogs(
    tenantId,
    { impersonationSessionId: log.id ?? '' },
    expanded,
    { limit: 100 },
  );

  return (
    <div className="border-b last:border-0">
      <div className="flex items-start gap-3 px-6 py-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
          <ShieldCheck className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-snug">
            <span className="font-medium">
              {log.hubUserFirstName} {log.hubUserLastName}
            </span>
            <span className="text-muted-foreground"> a accédé en tant que </span>
            <span className="font-medium">
              {log.impersonatedUserFirstName} {log.impersonatedUserLastName}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {log.hubUserEmail} → {log.impersonatedUserEmail}
          </p>
          <button
            type="button"
            onClick={() => setExpanded(p => !p)}
            className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5 hover:text-foreground transition-colors"
          >
            <ClipboardList className="h-3 w-3" />
            {expanded ? 'Masquer les changements' : 'Voir les changements'}
            {expanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        </div>
        <time className="shrink-0 text-xs text-muted-foreground pt-0.5">
          {formatShortDateTime(log.createdAt)}
        </time>
      </div>
      {expanded && (
        <div className="px-6 pb-3">
          {isLoading && (
            <p className="text-xs text-muted-foreground">Chargement…</p>
          )}
          {!isLoading && auditLogs && auditLogs.length === 0 && (
            <p className="text-xs text-muted-foreground">Aucun changement enregistré pour cette session.</p>
          )}
          {!isLoading && auditLogs && auditLogs.length > 0 && (
            <div className="rounded border bg-muted/30 px-3 py-1">
              {auditLogs.map(entry => (
                <AuditLogEntry key={entry.id} log={entry} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  trialing: 'Période d\'essai',
  past_due: 'Paiement en retard',
  canceled: 'Annulé',
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  trialing: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50',
  past_due: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50',
  canceled: 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-100',
};

const INVOICE_KIND_META: Record<string, { label: string; tooltip: string; className: string }> = {
  subscription: {
    label: 'Abonnement',
    tooltip: 'Facture du cycle d’abonnement',
    className: STATUS_BADGE.inactive,
  },
  overage: {
    label: 'Dépassement',
    tooltip: 'Facture standalone de dépassement (cron ou dev-tools)',
    className: STATUS_BADGE.warning,
  },
  subscription_with_overage: {
    label: 'Abonnement + dépass.',
    tooltip: 'Facture de cycle qui inclut des lignes de dépassement attachées via webhook',
    className: STATUS_BADGE.info,
  },
  other: {
    label: 'Autre',
    tooltip: 'Facture ponctuelle (ajustement ops, ancien abonnement, etc.)',
    className: STATUS_BADGE.inactive,
  },
};

function formatEuroCents(cents?: number | null): string {
  if (cents === null || cents === undefined) return '—';
  return (cents / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
}

function formatFrDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR');
}

function SubscriptionSection({ tenantId }: { tenantId: string }) {
  const { data: subscription, isLoading } = useTenantSubscription(tenantId);
  const [migrateDialogOpen, setMigrateDialogOpen] = useState(false);

  const hasSubscription = !!subscription && !!subscription.id;
  const planVersion = subscription?.planVersion ?? null;
  const planLatestVersion = subscription?.planLatestVersion ?? null;
  const isOnLatestVersion =
    planVersion && planLatestVersion ? planVersion.id === planLatestVersion.id : null;
  const status = subscription?.status ?? '';
  const invoices = subscription?.recentInvoices ?? [];
  const isOnLatestPrice = subscription?.isOnLatestPrice ?? null;
  const planBasePricesTooltip = subscription
    ? [
        subscription.planMonthlyPriceEuroCents != null
          ? `Mensuel ${formatEuroCents(subscription.planMonthlyPriceEuroCents)}`
          : null,
        subscription.planAnnualPriceEuroCents != null
          ? `Annuel ${formatEuroCents(subscription.planAnnualPriceEuroCents)}`
          : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : '';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          Abonnement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : !hasSubscription ? (
          <p className="text-sm text-muted-foreground italic">
            Aucun abonnement actif pour ce tenant.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Plan</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {subscription.planId ? (
                    <Link
                      href={`/plans/${subscription.planId}`}
                      className="font-semibold hover:underline"
                    >
                      {subscription.planName ?? '—'}
                    </Link>
                  ) : (
                    <span className="font-semibold">{subscription.planName ?? '—'}</span>
                  )}
                  {subscription.planType && (
                    <Badge variant="outline" className="text-xs">
                      {subscription.planType === 'custom' ? 'Custom' : 'Standard'}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Statut</p>
                <Badge
                  variant="outline"
                  className={STATUS_BADGE_CLASS[status] ?? 'bg-zinc-100 text-zinc-600 border-zinc-200'}
                >
                  {STATUS_LABELS[status] ?? status}
                </Badge>
              </div>
              {subscription.billingPeriod && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Période</p>
                  <p>{subscription.billingPeriod === 'annual' ? 'Annuel' : 'Mensuel'}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-xs mb-1">Prix actuel</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{formatEuroCents(subscription.currentPriceEuroCents)}</p>
                  {isOnLatestPrice === false && (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-xs"
                      title={
                        planBasePricesTooltip
                          ? `Prix actuel du plan — ${planBasePricesTooltip}`
                          : 'Le prix du plan a été mis à jour depuis'
                      }
                    >
                      Tarif différent du prix actuel du plan
                    </Badge>
                  )}
                </div>
              </div>
              {status === 'trialing' && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Essai</p>
                  <p>Essai en cours</p>
                </div>
              )}
              {subscription.startedAt && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Depuis</p>
                  <p>{formatFrDate(subscription.startedAt)}</p>
                </div>
              )}
              {planVersion && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Version du plan</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="font-mono">
                      v{planVersion.versionNumber}
                    </Badge>
                    {isOnLatestVersion === false && planLatestVersion && (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-xs"
                        title={`Version actuelle disponible : v${planLatestVersion.versionNumber}`}
                      >
                        v{planLatestVersion.versionNumber} disponible
                      </Badge>
                    )}
                    {subscription.planId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMigrateDialogOpen(true)}
                      >
                        Migrer
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {subscription.appliedPromoCode && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Code promo</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="font-mono">
                      {subscription.appliedPromoCode.code}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`${
                        subscription.appliedPromoCode.type === 'trial'
                          ? STATUS_BADGE.info
                          : STATUS_BADGE.active
                      } text-xs`}
                    >
                      {subscription.appliedPromoCode.type === 'trial' ? 'Essai' : 'Réduction'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatFrDate(subscription.appliedPromoCode.redeemedAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {subscription.id && subscription.planId && (
              <MigrateSubscriptionDialog
                open={migrateDialogOpen}
                onOpenChange={setMigrateDialogOpen}
                subscriptionId={subscription.id}
                planId={subscription.planId}
                currentPlanVersionId={planVersion?.id ?? null}
              />
            )}

            <div>
              <h4 className="text-sm font-semibold mb-2">Factures récentes (Stripe)</h4>
              {invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Aucune facture récente.</p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Total TTC</TableHead>
                        <TableHead className="hidden md:table-cell">Encaissé</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="w-12 text-right" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.slice(0, 6).map(inv => {
                        const meta = INVOICE_KIND_META[inv.kind ?? 'other'] ?? INVOICE_KIND_META.other;
                        return (
                          <TableRow key={inv.id ?? `${inv.paidAt}-${inv.amountPaidEuroCents}`}>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`${meta.className} text-xs`}
                                title={meta.tooltip}
                              >
                                {meta.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatEuroCents(inv.totalEuroCents ?? inv.amountPaidEuroCents)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                              {formatEuroCents(inv.amountPaidEuroCents)}
                            </TableCell>
                            <TableCell>{formatFrDate(inv.paidAt)}</TableCell>
                            <TableCell className="text-muted-foreground">{inv.status ?? '—'}</TableCell>
                            <TableCell className="text-right">
                              {inv.hostedInvoiceUrl ? (
                                <a
                                  href={inv.hostedInvoiceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Ouvrir sur Stripe"
                                  className="inline-flex items-center text-zinc-500 hover:text-zinc-900"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: tenant, isLoading: tenantLoading } = useAdminTenant(id);
  const { data: users, isLoading: usersLoading } = useAdminTenantUsers(id);
  const inviteMutation = useInviteUserToTenant(id);
  const updateTenantMutation = useUpdateAdminTenant(id);
  const updateMutation = useUpdateTenantUser(id);
  const removeMutation = useRemoveTenantUser(id);
  const impersonateMutation = useImpersonateTenant();
  const { data: impersonationLogs } = useImpersonationLogs(id);

  const [isEditing, setIsEditing] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [impersonatingUserId, setImpersonatingUserId] = useState<string | null>(null);

  const handleImpersonate = async (userId: string) => {
    setImpersonatingUserId(userId);
    try {
      const { token } = await impersonateMutation.mutateAsync({ tenantId: id, userId });
      const vistaUrl = process.env.NEXT_PUBLIC_VISTA_APP_URL ?? '';
      window.open(`${vistaUrl}/auth/impersonate?token=${token}`, '_blank');
    } catch {
      toast.error("Impossible d'accéder à l'application.");
    } finally {
      setImpersonatingUserId(null);
    }
  };

  const inviteForm = useForm<InviteTenantUserFormValues>({
    resolver: yupResolver(inviteTenantUserSchema),
    defaultValues: { email: '', role: '' },
  });

  const editForm = useForm<EditTenantUserFormValues>({
    resolver: yupResolver(editTenantUserSchema),
  });

  const editTenantForm = useForm<UpdateTenantFormValues>({
    resolver: yupResolver(updateTenantSchema),
  });

  const openEditTenant = () => {
    if (!tenant) return;
    editTenantForm.reset({
      name: tenant.name ?? '',
      email: tenant.email ?? '',
      phone: '',
      siretNumber: tenant.siretNumber ?? '',
      rcsCity: tenant.rcsCity ?? '',
      vatExempt: !tenant.vatNumber,
      vatNumber: tenant.vatNumber ?? '',
      address: {
        name: tenant.address?.name ?? '',
        streetNumber: tenant.address?.streetNumber ?? '',
        street: tenant.address?.street ?? '',
        postalCode: tenant.address?.postalCode ?? '',
        city: tenant.address?.city ?? '',
        country: tenant.address?.country ?? 'France',
      },
      defaultBankDetail: {
        bankLabel: tenant.defaultBankDetail?.bankLabel ?? '',
        bankName: tenant.defaultBankDetail?.bankName ?? '',
        accountHolderName: tenant.defaultBankDetail?.accountHolderName ?? '',
        iban: tenant.defaultBankDetail?.iban ?? '',
        bic: tenant.defaultBankDetail?.bic ?? '',
        bankCode: tenant.defaultBankDetail?.bankCode ?? '',
        accountNumber: tenant.defaultBankDetail?.accountNumber ?? '',
      },
    });
    setIsEditing(true);
  };

  const onEditTenantSubmit = async (values: UpdateTenantFormValues) => {
    try {
      const payload = {
        ...values,
        vatNumber: values.vatExempt ? '' : values.vatNumber,
        address: {
          ...values.address,
          type: 'billing' as const,
          latitude: tenant?.address?.latitude ?? 0,
          longitude: tenant?.address?.longitude ?? 0,
        },
      };
      await updateTenantMutation.mutateAsync(payload);
      toast.success('Tenant mis à jour.');
      setIsEditing(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  const onInviteSubmit = async (values: InviteTenantUserFormValues) => {
    try {
      await inviteMutation.mutateAsync({ email: values.email, roles: [values.role] });
      inviteForm.reset();
      setInviteDialogOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  const openEditDialog = (user: IUser) => {
    setEditingUser(user);
    const currentRole = user.roles?.[0] ?? '';
    editForm.reset({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      role: currentRole,
    });
  };

  const onEditSubmit = async (values: EditTenantUserFormValues) => {
    if (!editingUser?.id) return;
    try {
      await updateMutation.mutateAsync({
        userId: editingUser.id,
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          roles: [values.role],
        },
      });
      toast.success('Utilisateur mis à jour.');
      setEditingUser(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  const handleRemove = async () => {
    if (!confirmRemoveId) return;
    try {
      await removeMutation.mutateAsync(confirmRemoveId);
      toast.success('Utilisateur retiré du tenant.');
      setConfirmRemoveId(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  const handleInviteDialogOpenChange = (open: boolean) => {
    setInviteDialogOpen(open);
    if (!open) inviteForm.reset();
  };

  if (tenantLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (!tenant) return <p className="text-destructive">Tenant introuvable.</p>;

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/tenants">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold">{tenant.name}</h2>
        </div>
      </div>

      {isEditing ? (
        <form
          id="edit-tenant-form"
          onSubmit={editTenantForm.handleSubmit(onEditTenantSubmit)}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nom" id="edit-name" error={editTenantForm.formState.errors.name?.message}>
                <Input id="edit-name" {...editTenantForm.register('name')} />
              </Field>
              <Field label="Email" id="edit-email" error={editTenantForm.formState.errors.email?.message}>
                <Input id="edit-email" type="email" {...editTenantForm.register('email')} />
              </Field>
              <Field label="Téléphone" id="edit-phone" error={editTenantForm.formState.errors.phone?.message}>
                <Input id="edit-phone" {...editTenantForm.register('phone')} />
              </Field>
              <Field label="Numéro SIRET" id="edit-siretNumber" error={editTenantForm.formState.errors.siretNumber?.message}>
                <Input id="edit-siretNumber" {...editTenantForm.register('siretNumber')} maxLength={14} />
              </Field>
              <Field label="Ville RCS" id="edit-rcsCity" error={editTenantForm.formState.errors.rcsCity?.message}>
                <Input id="edit-rcsCity" {...editTenantForm.register('rcsCity')} />
              </Field>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  id="edit-vatExempt"
                  type="checkbox"
                  {...editTenantForm.register('vatExempt')}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <Label htmlFor="edit-vatExempt" className="font-normal">
                  Franchise de TVA (auto-entrepreneur, art. 293 B du CGI)
                </Label>
              </div>
              {!editTenantForm.watch('vatExempt') && (
                <Field label="Numéro de TVA" id="edit-vatNumber" error={editTenantForm.formState.errors.vatNumber?.message}>
                  <Input id="edit-vatNumber" {...editTenantForm.register('vatNumber')} />
                </Field>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Adresse</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Libellé" id="edit-address-name" error={editTenantForm.formState.errors.address?.name?.message}>
                <Input id="edit-address-name" {...editTenantForm.register('address.name')} />
              </Field>
              <Field label="Numéro de rue" id="edit-streetNumber" error={editTenantForm.formState.errors.address?.streetNumber?.message}>
                <Input id="edit-streetNumber" {...editTenantForm.register('address.streetNumber')} />
              </Field>
              <div className="col-span-2">
                <Field label="Rue" id="edit-street" error={editTenantForm.formState.errors.address?.street?.message}>
                  <Input id="edit-street" {...editTenantForm.register('address.street')} />
                </Field>
              </div>
              <Field label="Code postal" id="edit-postalCode" error={editTenantForm.formState.errors.address?.postalCode?.message}>
                <Input id="edit-postalCode" {...editTenantForm.register('address.postalCode')} />
              </Field>
              <Field label="Ville" id="edit-city" error={editTenantForm.formState.errors.address?.city?.message}>
                <Input id="edit-city" {...editTenantForm.register('address.city')} />
              </Field>
              <Field label="Pays" id="edit-country" error={editTenantForm.formState.errors.address?.country?.message}>
                <Input id="edit-country" {...editTenantForm.register('address.country')} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Coordonnées bancaires</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Libellé compte" id="edit-bankLabel" error={editTenantForm.formState.errors.defaultBankDetail?.bankLabel?.message}>
                <Input id="edit-bankLabel" {...editTenantForm.register('defaultBankDetail.bankLabel')} />
              </Field>
              <Field label="Nom de la banque" id="edit-bankName" error={editTenantForm.formState.errors.defaultBankDetail?.bankName?.message}>
                <Input id="edit-bankName" {...editTenantForm.register('defaultBankDetail.bankName')} />
              </Field>
              <div className="col-span-2">
                <Field label="Titulaire du compte" id="edit-accountHolderName" error={editTenantForm.formState.errors.defaultBankDetail?.accountHolderName?.message}>
                  <Input id="edit-accountHolderName" {...editTenantForm.register('defaultBankDetail.accountHolderName')} />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="IBAN" id="edit-iban" error={editTenantForm.formState.errors.defaultBankDetail?.iban?.message}>
                  <Input id="edit-iban" {...editTenantForm.register('defaultBankDetail.iban')} className="font-mono" />
                </Field>
              </div>
              <Field label="BIC" id="edit-bic" error={editTenantForm.formState.errors.defaultBankDetail?.bic?.message}>
                <Input id="edit-bic" {...editTenantForm.register('defaultBankDetail.bic')} className="font-mono" />
              </Field>
              <Field label="Code banque" id="edit-bankCode" error={editTenantForm.formState.errors.defaultBankDetail?.bankCode?.message}>
                <Input id="edit-bankCode" {...editTenantForm.register('defaultBankDetail.bankCode')} />
              </Field>
              <Field label="Numéro de compte" id="edit-accountNumber" error={editTenantForm.formState.errors.defaultBankDetail?.accountNumber?.message}>
                <Input id="edit-accountNumber" {...editTenantForm.register('defaultBankDetail.accountNumber')} className="font-mono" />
              </Field>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </Button>
            <Button
              form="edit-tenant-form"
              type="submit"
              className="flex-1"
              disabled={updateTenantMutation.isPending}
            >
              {updateTenantMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Détails</CardTitle>
            <Button variant="ghost" size="icon" onClick={openEditTenant}>
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{tenant.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SIRET</span>
              <span className="font-mono">{tenant.siretNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TVA</span>
              <span className="font-mono">
                {tenant.vatNumber || (
                  <span className="text-muted-foreground italic">Franchise (art. 293 B CGI)</span>
                )}
              </span>
            </div>
            {tenant.rcsCity && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ville RCS</span>
                <span>{tenant.rcsCity}</span>
              </div>
            )}
            {tenant.address && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adresse</span>
                <span className="text-right">
                  {tenant.address.streetNumber} {tenant.address.street},{' '}
                  {tenant.address.postalCode} {tenant.address.city}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Créé le</span>
              <span>{new Date(tenant.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mis à jour le</span>
              <span>{new Date(tenant.updatedAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Utilisateurs</h3>
          <Dialog open={inviteDialogOpen} onOpenChange={handleInviteDialogOpenChange}>
            <DialogTrigger className={buttonVariants({ size: 'sm' })}>
              <UserPlus className="h-4 w-4 mr-2" />
              Inviter
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inviter un utilisateur</DialogTitle>
              </DialogHeader>
              <form
                id="invite-user-form"
                onSubmit={inviteForm.handleSubmit(onInviteSubmit)}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="user@example.com"
                    {...inviteForm.register('email')}
                  />
                  {inviteForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {inviteForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Rôle</Label>
                  <Select
                    onValueChange={value => inviteForm.setValue('role', value as string)}
                  >
                    <SelectTrigger id="invite-role">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {TENANT_USER_ROLES.map(r => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {inviteForm.formState.errors.role && (
                    <p className="text-sm text-destructive">
                      {inviteForm.formState.errors.role.message}
                    </p>
                  )}
                </div>
                <Button
                  form="invite-user-form"
                  type="submit"
                  className="w-full"
                  disabled={inviteMutation.isPending}
                >
                  {inviteMutation.isPending ? 'Envoi...' : "Envoyer l'invitation"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {usersLoading ? (
          <p className="text-muted-foreground text-sm">Chargement des utilisateurs...</p>
        ) : !users?.length ? (
          <div className="flex flex-col items-center justify-center py-10 border rounded-lg text-center">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-sm">Aucun utilisateur pour ce tenant.</p>
            <p className="text-muted-foreground text-sm">Invitez le premier utilisateur.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Rôles</TableHead>
                  <TableHead className="w-32" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                      <div className="text-xs text-muted-foreground sm:hidden">{user.email}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {user.roles?.join(', ') || '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Accéder à l'app en tant que cet utilisateur"
                          disabled={impersonatingUserId === user.id}
                          onClick={() => user.id && handleImpersonate(user.id)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setConfirmRemoveId(user.id ?? null)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <SubscriptionSection tenantId={id} />

      <SubscriptionInvoicesSection tenantId={id} />

      {impersonationLogs && impersonationLogs.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-muted-foreground" />
              Journal d&apos;accès admin
              <Badge variant="secondary" className="ml-auto font-mono text-xs">
                {impersonationLogs.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto divide-y">
              {impersonationLogs.map(log => (
                <ImpersonationSessionRow key={log.id} log={log} tenantId={id} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit user dialog */}
      <Dialog open={!!editingUser} onOpenChange={open => { if (!open) setEditingUser(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
          </DialogHeader>
          <form
            id="edit-user-form"
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            className="space-y-4 pt-2"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">Prénom</Label>
                <Input id="edit-firstName" {...editForm.register('firstName')} />
                {editForm.formState.errors.firstName && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Nom</Label>
                <Input id="edit-lastName" {...editForm.register('lastName')} />
                {editForm.formState.errors.lastName && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" {...editForm.register('email')} />
              {editForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rôle</Label>
              <Select
                defaultValue={editingUser?.roles?.[0] ?? ''}
                onValueChange={value => editForm.setValue('role', value as string)}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {TENANT_USER_ROLES.map(r => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editForm.formState.errors.role && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.role.message}
                </p>
              )}
            </div>
            <Button
              form="edit-user-form"
              type="submit"
              className="w-full"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove confirmation dialog */}
      <Dialog open={!!confirmRemoveId} onOpenChange={open => { if (!open) setConfirmRemoveId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retirer l&apos;utilisateur</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Confirmer le retrait de cet utilisateur du tenant ? Cette action ne supprime pas le
            compte utilisateur.
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setConfirmRemoveId(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={removeMutation.isPending}
              onClick={handleRemove}
            >
              {removeMutation.isPending ? 'Suppression...' : 'Retirer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
