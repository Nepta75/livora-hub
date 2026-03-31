'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import {
  useAdminTenant,
  useAdminTenantUsers,
  useInviteUserToTenant,
  useUpdateTenantUser,
  useRemoveTenantUser,
} from '@/hooks/api/tenants/useAdminTenants';
import {
  TENANT_USER_ROLES,
  inviteTenantUserSchema,
  editTenantUserSchema,
  type InviteTenantUserFormValues,
  type EditTenantUserFormValues,
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
import { ArrowLeft, Plus, UserPlus, Pencil, Trash2 } from 'lucide-react';
import type { IUser } from '@/types/generated/api-types';

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: tenant, isLoading: tenantLoading } = useAdminTenant(id);
  const { data: users, isLoading: usersLoading } = useAdminTenantUsers(id);
  const inviteMutation = useInviteUserToTenant(id);
  const updateMutation = useUpdateTenantUser(id);
  const removeMutation = useRemoveTenantUser(id);

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const inviteForm = useForm<InviteTenantUserFormValues>({
    resolver: yupResolver(inviteTenantUserSchema),
    defaultValues: { email: '', role: '' },
  });

  const editForm = useForm<EditTenantUserFormValues>({
    resolver: yupResolver(editTenantUserSchema),
  });

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
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tenants">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">{tenant.name}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Détails</CardTitle>
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
            <span className="font-mono">{tenant.vatNumber}</span>
          </div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôles</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.roles?.join(', ') || '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
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
        )}
      </div>

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
