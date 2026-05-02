'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import {
  useAdminUser,
  useUpdateAdminUser,
  useUpdateAdminUserPassword,
  useUpdateAdminUserRoles,
} from '@/hooks/api/users/useAdminUsers';
import {
  updateUserSchema,
  updatePasswordSchema,
  type UpdateUserFormValues,
  type UpdatePasswordFormValues,
} from '@/validators/users/validator';
import { HUB_ROLES } from '@/constants/roles';
import type { HubUserRoles } from '@/types/generated/api-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: user, isLoading } = useAdminUser(id);
  const updateMutation = useUpdateAdminUser(id);
  const updatePasswordMutation = useUpdateAdminUserPassword(id);
  const updateRolesMutation = useUpdateAdminUserRoles(id);

  const infoForm = useForm<UpdateUserFormValues>({
    resolver: yupResolver(updateUserSchema),
    defaultValues: { email: '', firstName: '', lastName: '' },
  });

  const passwordForm = useForm<UpdatePasswordFormValues>({
    resolver: yupResolver(updatePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (user) {
      infoForm.reset({ email: user.email, firstName: user.firstName, lastName: user.lastName });
    }
  }, [user, infoForm]);

  const onUpdateInfo = async (values: UpdateUserFormValues) => {
    try {
      await updateMutation.mutateAsync(values);
      router.push('/users');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue.');
    }
  };

  const onUpdatePassword = async (values: UpdatePasswordFormValues) => {
    try {
      await updatePasswordMutation.mutateAsync({ password: values.password });
      toast.success('Mot de passe mis à jour.');
      passwordForm.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue.');
    }
  };

  const onUpdateRole = async (role: HubUserRoles | null) => {
    if (!role) return;
    try {
      await updateRolesMutation.mutateAsync({ roles: [role] });
      toast.success('Rôle mis à jour.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue.');
    }
  };

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (!user) return <p className="text-destructive">Utilisateur introuvable.</p>;

  const currentRole = user.roles?.[0] ?? '';

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">
          {user.firstName} {user.lastName}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="update-info-form" onSubmit={infoForm.handleSubmit(onUpdateInfo)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input {...infoForm.register('firstName')} />
                {infoForm.formState.errors.firstName && (
                  <p className="text-sm text-destructive">{infoForm.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input {...infoForm.register('lastName')} />
                {infoForm.formState.errors.lastName && (
                  <p className="text-sm text-destructive">{infoForm.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...infoForm.register('email')} />
              {infoForm.formState.errors.email && (
                <p className="text-sm text-destructive">{infoForm.formState.errors.email.message}</p>
              )}
            </div>
          </form>
          <Button form="update-info-form" type="submit" className="mt-4" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rôle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select
            defaultValue={currentRole}
            onValueChange={(value) => onUpdateRole((value as HubUserRoles) ?? null)}
            disabled={updateRolesMutation.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              {HUB_ROLES.map(r => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Changer le mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="update-password-form" onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-4">
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input type="password" {...passwordForm.register('password')} />
              {passwordForm.formState.errors.password && (
                <p className="text-sm text-destructive">{passwordForm.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Confirmer</Label>
              <Input type="password" {...passwordForm.register('confirmPassword')} />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </form>
          <Button form="update-password-form" type="submit" variant="secondary" className="mt-4" disabled={updatePasswordMutation.isPending}>
            {updatePasswordMutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
