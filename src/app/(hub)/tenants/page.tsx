'use client';

import Link from 'next/link';
import { useAdminTenants } from '@/hooks/api/tenants/useAdminTenants';
import { useAuth } from '@/hooks/useAuth';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Eye } from 'lucide-react';

export default function TenantsPage() {
  const { data: tenants, isLoading } = useAdminTenants();
  const { userRoles } = useAuth();

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tenants</h2>
        {userRoles?.isAdmin && (
          <Link href="/tenants/create" className={buttonVariants()}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau tenant
          </Link>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead className="w-16">Voir</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants?.map(tenant => (
            <TableRow key={tenant.id}>
              <TableCell className="font-medium">{tenant.name}</TableCell>
              <TableCell>{tenant.email}</TableCell>
              <TableCell>{new Date(tenant.createdAt).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/tenants/${tenant.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
