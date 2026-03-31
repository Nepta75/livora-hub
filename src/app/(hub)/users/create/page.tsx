'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateAdminUser } from '@/hooks/api/users/useAdminUsers';
import { useAdminRoles } from '@/hooks/api/roles/useAdminRoles';
import { createUserSchema, type CreateUserFormValues } from '@/validators/users/validator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateUserPage() {
  const router = useRouter();
  const createMutation = useCreateAdminUser();
  const { data: rolesData } = useAdminRoles();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: yupResolver(createUserSchema),
    defaultValues: { email: '', firstName: '', lastName: '', password: '', roles: [] },
  });

  const onSubmit = async (values: CreateUserFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      router.push('/users');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue.');
    }
  };

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Nouvel utilisateur</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="create-user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Rôle</Label>
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange([value])}
                    value={field.value[0] ?? ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {rolesData?.roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.roles && (
                <p className="text-sm text-destructive">{errors.roles.message}</p>
              )}
            </div>
          </form>

          <Button
            form="create-user-form"
            type="submit"
            className="w-full mt-4"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Création...' : 'Créer l\'utilisateur'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
