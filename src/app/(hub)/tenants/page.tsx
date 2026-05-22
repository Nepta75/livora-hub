'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useAdminTenantList, TENANTS_PAGE_SIZE } from '@/hooks/api/tenants/useAdminTenants';
import { useAuth } from '@/hooks/useAuth';
import { useListingState } from '@/hooks/useListingState';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/listing/SearchInput';
import { ListingPagination } from '@/components/listing/ListingPagination';
import { STATUS_BADGE } from '@/lib/action-palette';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Eye } from 'lucide-react';
import type { ChangePlanBillingPeriod } from '@/types/generated/api-types';

type StatusTone = keyof typeof STATUS_BADGE;

// Subscription status → French label + badge tone. Any status not listed
// (none expected) falls back to a neutral pill so the table never breaks.
const STATUS_META: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: 'Actif', tone: 'active' },
  trialing: { label: 'Essai', tone: 'info' },
  past_due: { label: 'Retard de paiement', tone: 'danger' },
  canceled: { label: 'Résilié', tone: 'inactive' },
  incomplete: { label: 'Incomplet', tone: 'warning' },
  registration_failed: { label: 'Échec inscription', tone: 'danger' },
};

const BILLING_PERIOD_LABEL: Record<ChangePlanBillingPeriod, string> = {
  monthly: 'mensuel',
  annual: 'annuel',
};

function TenantsPageContent() {
  const { userRoles } = useAuth();
  const { search, page, setSearch, setPage } = useListingState();

  const { data, isLoading } = useAdminTenantList({ search: search || undefined }, page);

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.ceil(total / TENANTS_PAGE_SIZE);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tenants</h2>
        {userRoles?.isAdmin && (
          <Link href="/tenants/create" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau tenant
          </Link>
        )}
      </div>

      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Rechercher par nom, email, SIRET..."
        />
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Forfait</TableHead>
              <TableHead className="hidden md:table-cell">Statut</TableHead>
              <TableHead className="hidden lg:table-cell">Utilisateurs</TableHead>
              <TableHead className="hidden lg:table-cell">Créé le</TableHead>
              <TableHead className="w-16">Voir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Aucun tenant trouvé.
                </TableCell>
              </TableRow>
            ) : (
              rows.map(({ tenant, userCount, subscription }) => {
                const statusMeta = subscription
                  ? STATUS_META[subscription.status]
                  : undefined;
                const periodLabel = subscription?.billingPeriod
                  ? BILLING_PERIOD_LABEL[subscription.billingPeriod]
                  : undefined;

                return (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">
                      {tenant.name}
                      <div className="text-xs text-muted-foreground sm:hidden">
                        {tenant.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{tenant.email}</TableCell>
                    <TableCell>
                      {subscription?.plan ? (
                        <Badge variant="secondary">
                          {subscription.plan.name}
                          {periodLabel ? ` · ${periodLabel}` : ''}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Non abonné</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {statusMeta ? (
                        <Badge className={STATUS_BADGE[statusMeta.tone]}>
                          {statusMeta.label}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{userCount}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {tenant.createdAt
                        ? new Date(tenant.createdAt).toLocaleDateString('fr-FR')
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/tenants/${tenant.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && total > 0 && (
        <ListingPagination
          page={page}
          pageCount={pageCount}
          total={total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export default function TenantsPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Chargement...</p>}>
      <TenantsPageContent />
    </Suspense>
  );
}
