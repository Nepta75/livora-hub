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
  useUpdateAdminTenant,
  useUpdateTenantUser,
  useRemoveTenantUser,
  useImpersonateTenant,
} from '@/hooks/api/tenants/useAdminTenants';
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
import { ArrowLeft, Plus, UserPlus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import type { IUser } from '@/types/generated/api-types';

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

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: tenant, isLoading: tenantLoading } = useAdminTenant(id);
  const { data: users, isLoading: usersLoading } = useAdminTenantUsers(id);
  const inviteMutation = useInviteUserToTenant(id);
  const updateTenantMutation = useUpdateAdminTenant(id);
  const updateMutation = useUpdateTenantUser(id);
  const removeMutation = useRemoveTenantUser(id);
  const impersonateMutation = useImpersonateTenant();

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
    <div className="max-w-2xl space-y-6">
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
            <CardContent className="grid grid-cols-2 gap-4">
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
              <Field label="Numéro de TVA" id="edit-vatNumber" error={editTenantForm.formState.errors.vatNumber?.message}>
                <Input id="edit-vatNumber" {...editTenantForm.register('vatNumber')} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Adresse</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
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
            <CardContent className="grid grid-cols-2 gap-4">
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
              <span className="font-mono">{tenant.vatNumber}</span>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôles</TableHead>
                <TableHead className="w-32" />
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
