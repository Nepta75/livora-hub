'use client';

import { useAdminRoles } from '@/hooks/api/roles/useAdminRoles';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RolesPage() {
  const { data, isLoading } = useAdminRoles();

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Rôles Hub</h2>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-base">Rôles disponibles</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {data?.roles.map((role) => (
            <Badge key={role} variant="secondary" className="text-sm px-3 py-1">
              {role}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
