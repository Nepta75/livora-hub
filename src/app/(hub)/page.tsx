'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2,
  FlaskConical,
  Wallet,
  TrendingUp,
  CalendarClock,
  Receipt,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useAdminUsers } from '@/hooks/api/users/useAdminUsers';
import { useAdminDashboardMetrics } from '@/hooks/api/dashboard/useAdminDashboardMetrics';
import { useAdminSeed } from '@/hooks/api/seed/useAdminSeed';
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
import { STATUS_BADGE } from '@/lib/action-palette';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type {
  DashboardRecentPayment,
  DashboardRecentRefund,
  DashboardRecentSubscription,
} from '@/services/admin/dashboardService';

const ENABLE_SEED = process.env.NEXT_PUBLIC_ENABLE_SEED === 'true';

const formatEuro = (amount: number | undefined): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount ?? 0);

const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Subscription lifecycle status → French label + badge tone.
const STATUS_META: Record<string, { label: string; tone: string }> = {
  active: { label: 'Actif', tone: STATUS_BADGE.active },
  trialing: { label: 'Essai', tone: STATUS_BADGE.info },
  past_due: { label: 'Impayé', tone: STATUS_BADGE.warning },
  canceled: { label: 'Annulé', tone: STATUS_BADGE.inactive },
  incomplete: { label: 'Incomplet', tone: STATUS_BADGE.warning },
  registration_failed: { label: 'Échec inscription', tone: STATUS_BADGE.danger },
};

const KIND_LABEL: Record<string, string> = {
  subscription: 'Abonnement',
  overage: 'Dépassement',
  subscription_with_overage: 'Abonnement + dépassement',
  other: 'Autre',
};

const BILLING_PERIOD_LABEL: Record<string, string> = {
  monthly: 'Mensuel',
  annual: 'Annuel',
};

const REFUND_REASON_LABEL: Record<string, string> = {
  duplicate: 'Doublon',
  fraudulent: 'Fraude',
  requested_by_customer: 'Demande client',
};

// Refund status → French label + badge tone.
const REFUND_STATUS_META: Record<string, { label: string; tone: string }> = {
  pending: { label: 'En cours', tone: STATUS_BADGE.warning },
  requires_action: { label: 'Action requise', tone: STATUS_BADGE.warning },
  succeeded: { label: 'Effectué', tone: STATUS_BADGE.active },
  failed: { label: 'Échoué', tone: STATUS_BADGE.danger },
  canceled: { label: 'Annulé', tone: STATUS_BADGE.inactive },
};

export default function DashboardPage() {
  const { data: metrics, isLoading, error } = useAdminDashboardMetrics();
  const { data: users } = useAdminUsers();
  const seedMutation = useAdminSeed();

  const handleSeed = async () => {
    try {
      const result = await seedMutation.mutateAsync();
      toast.success(
        `Tenant "${result.tenant.name}" créé — login: ${result.user.email} / ${result.password}`,
        { duration: 15000 },
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors du seed.');
    }
  };

  const tenants = metrics?.tenants;
  const revenue = metrics?.revenue;
  const refunds = metrics?.refunds;
  const recentPayments = metrics?.recentPayments ?? [];
  const recentSubscriptions = metrics?.recentSubscriptions ?? [];
  const recentRefunds = metrics?.refunds?.recent ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        {ENABLE_SEED && (
          <Button variant="outline" size="sm" onClick={handleSeed} disabled={seedMutation.isPending}>
            <FlaskConical className="h-4 w-4 mr-2" />
            {seedMutation.isPending ? 'Génération...' : 'Seed test data'}
          </Button>
        )}
      </div>

      {error && (
        <p className="text-destructive mb-6">Impossible de charger les métriques du dashboard.</p>
      )}

      {/* Revenue — realised cash + recurring run-rate */}
      <SectionTitle>Revenus</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MetricCard
          title="Chiffre d'affaires total"
          icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
          value={isLoading ? null : formatEuro(revenue?.totalPaidEuro)}
          hint="encaissé sur toutes les factures payées"
        />
        <MetricCard
          title="Encaissé ce mois-ci"
          icon={<CalendarClock className="h-4 w-4 text-muted-foreground" />}
          value={isLoading ? null : formatEuro(revenue?.currentMonthPaidEuro)}
          hint="factures payées depuis le 1er du mois"
        />
        <MetricCard
          title="MRR"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          value={isLoading ? null : formatEuro(revenue?.mrrEuro)}
          hint="revenu mensuel récurrent (abos actifs)"
        />
      </div>

      {/* Tenants — lifecycle breakdown */}
      <SectionTitle>Tenants</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard
          title="Total"
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          value={isLoading ? null : String(tenants?.total ?? 0)}
        />
        <MetricCard
          title="Actifs"
          value={isLoading ? null : String(tenants?.active ?? 0)}
          tone={STATUS_BADGE.active}
        />
        <MetricCard
          title="En essai"
          value={isLoading ? null : String(tenants?.trialing ?? 0)}
          tone={STATUS_BADGE.info}
        />
        <MetricCard
          title="Impayés"
          value={isLoading ? null : String(tenants?.pastDue ?? 0)}
          tone={STATUS_BADGE.warning}
        />
        <MetricCard
          title="Annulés"
          value={isLoading ? null : String(tenants?.canceled ?? 0)}
          tone={STATUS_BADGE.inactive}
        />
        <MetricCard
          title="Résiliés ce mois"
          value={isLoading ? null : String(tenants?.canceledThisMonth ?? 0)}
          tone={(tenants?.canceledThisMonth ?? 0) > 0 ? STATUS_BADGE.danger : undefined}
        />
      </div>

      {/* Refunds — money returned to tenants */}
      <SectionTitle>Remboursements</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <MetricCard
          title="Total remboursé"
          icon={<RotateCcw className="h-4 w-4 text-muted-foreground" />}
          value={isLoading ? null : formatEuro(refunds?.totalRefundedEuro)}
          hint="remboursements aboutis, toutes périodes"
        />
        <MetricCard
          title="Remboursé ce mois-ci"
          icon={<CalendarClock className="h-4 w-4 text-muted-foreground" />}
          value={isLoading ? null : formatEuro(refunds?.currentMonthRefundedEuro)}
          hint="remboursements aboutis depuis le 1er du mois"
        />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Derniers paiements</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <RecentPaymentsTable
              rows={recentPayments}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Souscriptions récentes</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <RecentSubscriptionsTable
              rows={recentSubscriptions}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">Derniers remboursements</CardTitle>
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <RecentRefundsTable rows={recentRefunds} isLoading={isLoading} />
        </CardContent>
      </Card>

      {users && (
        <p className="text-xs text-muted-foreground mt-6">
          {users.length} compte{users.length > 1 ? 's' : ''} hub (admins et modérateurs).
        </p>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
      {children}
    </h3>
  );
}

function MetricCard({
  title,
  value,
  icon,
  hint,
  tone,
}: {
  title: string;
  value: string | null;
  icon?: React.ReactNode;
  hint?: string;
  tone?: string;
}) {
  return (
    <Card className={cn(tone)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className={cn('text-2xl font-bold', value === null && 'text-muted-foreground')}>
          {value ?? '—'}
        </p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string | undefined }) {
  const meta = status ? STATUS_META[status] : undefined;
  if (!meta) return <span className="text-muted-foreground">{status ?? '—'}</span>;
  return (
    <Badge variant="outline" className={cn('rounded-full', meta.tone)}>
      {meta.label}
    </Badge>
  );
}

function RecentPaymentsTable({
  rows,
  isLoading,
}: {
  rows: DashboardRecentPayment[];
  isLoading: boolean;
}) {
  const router = useRouter();

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement...</p>;
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun paiement enregistré.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Montant</TableHead>
          <TableHead className="text-right">Payé le</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <ClickableRow key={row.invoiceId} href={`/tenants/${row.tenantId}`} router={router}>
            <TableCell className="font-medium">
              <span className="text-primary underline-offset-2 group-hover:underline">
                {row.tenantName}
              </span>
              <span className="block text-xs text-muted-foreground font-normal">
                {row.invoiceNumber}
              </span>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {KIND_LABEL[row.kind ?? ''] ?? row.kind ?? '—'}
            </TableCell>
            <TableCell className="text-right font-mono font-semibold">
              {formatEuro(row.amountPaidEuro)}
            </TableCell>
            <TableCell className="text-right text-muted-foreground text-sm">
              {formatDateTime(row.paidAt)}
            </TableCell>
          </ClickableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/**
 * Table row that navigates to `href` on click or keyboard activation —
 * the whole row is the link target so dashboard panels stay scannable.
 */
function ClickableRow({
  href,
  router,
  children,
}: {
  href: string;
  router: ReturnType<typeof useRouter>;
  children: React.ReactNode;
}) {
  return (
    <TableRow
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(href);
        }
      }}
      className="group cursor-pointer hover:bg-muted/50"
    >
      {children}
    </TableRow>
  );
}

function RecentRefundsTable({
  rows,
  isLoading,
}: {
  rows: DashboardRecentRefund[];
  isLoading: boolean;
}) {
  const router = useRouter();

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement...</p>;
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun remboursement enregistré.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant</TableHead>
          <TableHead>Motif</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Montant</TableHead>
          <TableHead className="text-right">Émis le</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const meta = row.status ? REFUND_STATUS_META[row.status] : undefined;
          return (
            <ClickableRow key={row.refundId} href={`/tenants/${row.tenantId}`} router={router}>
              <TableCell className="font-medium">
                <span className="text-primary underline-offset-2 group-hover:underline">
                  {row.tenantName}
                </span>
                <span className="block text-xs text-muted-foreground font-normal">
                  {row.invoiceNumber}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {REFUND_REASON_LABEL[row.reason ?? ''] ?? row.reason ?? '—'}
              </TableCell>
              <TableCell>
                {meta ? (
                  <Badge variant="outline" className={cn('rounded-full', meta.tone)}>
                    {meta.label}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">{row.status ?? '—'}</span>
                )}
              </TableCell>
              <TableCell className="text-right font-mono font-semibold">
                {formatEuro(row.amountEuro)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                {formatDateTime(row.createdAt)}
              </TableCell>
            </ClickableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function RecentSubscriptionsTable({
  rows,
  isLoading,
}: {
  rows: DashboardRecentSubscription[];
  isLoading: boolean;
}) {
  const router = useRouter();

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement...</p>;
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune souscription enregistrée.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant</TableHead>
          <TableHead>Offre</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Créée le</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <ClickableRow
            key={row.subscriptionId}
            href={`/tenants/${row.tenantId}`}
            router={router}
          >
            <TableCell className="font-medium">
              <span className="text-primary underline-offset-2 group-hover:underline">
                {row.tenantName}
              </span>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {row.planName}
              {row.billingPeriod && (
                <span className="block text-xs">
                  {BILLING_PERIOD_LABEL[row.billingPeriod] ?? row.billingPeriod}
                </span>
              )}
            </TableCell>
            <TableCell>
              <StatusBadge status={row.status} />
            </TableCell>
            <TableCell className="text-right text-muted-foreground text-sm">
              {formatDateTime(row.createdAt)}
            </TableCell>
          </ClickableRow>
        ))}
      </TableBody>
    </Table>
  );
}
