'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminUsers, useDeleteAdminUser } from '@/hooks/api/users/useAdminUsers';
import { useAuth } from '@/hooks/useAuth';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const { userRoles } = useAuth();
  const deleteMutation = useDeleteAdminUser();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteMutation.mutateAsync(confirmDeleteId);
      toast.success('Utilisateur supprimé.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Chargement...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Utilisateurs Hub</h2>
        {userRoles?.isAdmin && (
          <Button asChild>
            <Link href="/users/create">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel utilisateur
            </Link>
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Rôles</TableHead>
              {userRoles?.isAdmin && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                  <div className="text-xs text-muted-foreground sm:hidden">{user.email}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {(user.roles ?? []).map(role => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                {userRoles?.isAdmin && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/users/${user.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setConfirmDeleteId(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!confirmDeleteId} onOpenChange={open => !open && setConfirmDeleteId(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;utilisateur</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. L&apos;utilisateur sera définitivement supprimé.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
