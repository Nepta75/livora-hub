'use client';

import { useAdminFeatures } from '@/hooks/api/plans/useAdminPlans';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function FeaturesPage() {
  const { data: features, isLoading } = useAdminFeatures();

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Features</h2>
        <p className="text-sm text-muted-foreground">{features?.length ?? 0} features enregistrées</p>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Clé</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features?.map((feature) => (
              <TableRow key={feature.id}>
                <TableCell className="font-mono text-sm">{feature.key}</TableCell>
                <TableCell>
                  <Badge variant={feature.type === 'boolean' ? 'secondary' : 'outline'}>
                    {feature.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {feature.description ?? '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
