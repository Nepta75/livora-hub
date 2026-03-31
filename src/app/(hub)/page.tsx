'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2 } from 'lucide-react';
import { useAdminUsers } from '@/hooks/api/users/useAdminUsers';
import { useAdminTenants } from '@/hooks/api/tenants/useAdminTenants';

export default function DashboardPage() {
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: tenants, isLoading: tenantsLoading } = useAdminTenants();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Hub</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <p className="text-2xl font-bold text-muted-foreground">—</p>
            ) : (
              <p className="text-2xl font-bold">{users?.length ?? 0}</p>
            )}
            <p className="text-xs text-muted-foreground">comptes admin et modérateurs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {tenantsLoading ? (
              <p className="text-2xl font-bold text-muted-foreground">—</p>
            ) : (
              <p className="text-2xl font-bold">{tenants?.length ?? 0}</p>
            )}
            <p className="text-xs text-muted-foreground">organisations clientes actives</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
