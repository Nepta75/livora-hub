'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useCreateAdminTenant } from '@/hooks/api/tenants/useAdminTenants';
import { createTenantSchema, type CreateTenantFormValues } from '@/validators/tenants/validator';
import { type SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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

export default function CreateTenantPage() {
  const router = useRouter();
  const createMutation = useCreateAdminTenant();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTenantFormValues>({
    resolver: yupResolver(createTenantSchema),
    defaultValues: {
      name: '', email: '', phone: '', siretNumber: '', rcsCity: '', vatNumber: '',
      address: { name: '', streetNumber: '', street: '', postalCode: '', city: '', country: 'France' },
      defaultBankDetail: { bankLabel: '', bankName: '', accountHolderName: '', iban: '', bic: '', bankCode: '', accountNumber: '' },
    },
  });

  const onSubmit = async (values: CreateTenantFormValues) => {
    try {
      const payload = {
        ...values,
        address: {
          ...values.address,
          type: 'billing' as const,
          latitude: 0,
          longitude: 0,
        },
      };
      const tenant = await createMutation.mutateAsync(payload);
      router.push(`/tenants/${tenant.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue.');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tenants">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Nouveau tenant</h2>
      </div>

      <form id="create-tenant-form" onSubmit={handleSubmit(onSubmit as SubmitHandler<CreateTenantFormValues>)} className="space-y-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nom" id="name" error={errors.name?.message}>
              <Input id="name" {...register('name')} placeholder="Acme Corp" />
            </Field>
            <Field label="Email" id="email" error={errors.email?.message}>
              <Input id="email" type="email" {...register('email')} placeholder="contact@acme.fr" />
            </Field>
            <Field label="Téléphone" id="phone" error={errors.phone?.message}>
              <Input id="phone" {...register('phone')} placeholder="+33 1 23 45 67 89" />
            </Field>
            <Field label="Numéro SIRET" id="siretNumber" error={errors.siretNumber?.message}>
              <Input id="siretNumber" {...register('siretNumber')} placeholder="12345678901234" maxLength={14} />
            </Field>
            <Field label="Ville RCS" id="rcsCity" error={errors.rcsCity?.message}>
              <Input id="rcsCity" {...register('rcsCity')} placeholder="Paris" />
            </Field>
            <Field label="Numéro de TVA" id="vatNumber" error={errors.vatNumber?.message}>
              <Input id="vatNumber" {...register('vatNumber')} placeholder="FR12345678901" />
            </Field>
          </CardContent>
        </Card>

        {/* Adresse */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Adresse</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Libellé" id="address.name" error={errors.address?.name?.message}>
              <Input id="address.name" {...register('address.name')} placeholder="Siège social" />
            </Field>
            <Field label="Numéro de rue" id="streetNumber" error={errors.address?.streetNumber?.message}>
              <Input id="streetNumber" {...register('address.streetNumber')} placeholder="12" />
            </Field>
            <div className="col-span-2">
              <Field label="Rue" id="street" error={errors.address?.street?.message}>
                <Input id="street" {...register('address.street')} placeholder="Rue de la Paix" />
              </Field>
            </div>
            <Field label="Code postal" id="postalCode" error={errors.address?.postalCode?.message}>
              <Input id="postalCode" {...register('address.postalCode')} placeholder="75001" />
            </Field>
            <Field label="Ville" id="city" error={errors.address?.city?.message}>
              <Input id="city" {...register('address.city')} placeholder="Paris" />
            </Field>
            <Field label="Pays" id="country" error={errors.address?.country?.message}>
              <Input id="country" {...register('address.country')} defaultValue="France" />
            </Field>
          </CardContent>
        </Card>

        {/* RIB */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Coordonnées bancaires</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Libellé compte" id="bankLabel" error={errors.defaultBankDetail?.bankLabel?.message}>
              <Input id="bankLabel" {...register('defaultBankDetail.bankLabel')} placeholder="Compte principal" />
            </Field>
            <Field label="Nom de la banque" id="bankName" error={errors.defaultBankDetail?.bankName?.message}>
              <Input id="bankName" {...register('defaultBankDetail.bankName')} placeholder="BNP Paribas" />
            </Field>
            <div className="col-span-2">
              <Field label="Titulaire du compte" id="accountHolderName" error={errors.defaultBankDetail?.accountHolderName?.message}>
                <Input id="accountHolderName" {...register('defaultBankDetail.accountHolderName')} placeholder="Acme Corp" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="IBAN" id="iban" error={errors.defaultBankDetail?.iban?.message}>
                <Input id="iban" {...register('defaultBankDetail.iban')} placeholder="FR76 3000 6000 0112 3456 7890 189" className="font-mono" />
              </Field>
            </div>
            <Field label="BIC" id="bic" error={errors.defaultBankDetail?.bic?.message}>
              <Input id="bic" {...register('defaultBankDetail.bic')} placeholder="BNPAFRPPXXX" className="font-mono" />
            </Field>
            <Field label="Code banque" id="bankCode" error={errors.defaultBankDetail?.bankCode?.message}>
              <Input id="bankCode" {...register('defaultBankDetail.bankCode')} placeholder="30006" />
            </Field>
            <Field label="Numéro de compte" id="accountNumber" error={errors.defaultBankDetail?.accountNumber?.message}>
              <Input id="accountNumber" {...register('defaultBankDetail.accountNumber')} placeholder="0001123456789" className="font-mono" />
            </Field>
          </CardContent>
        </Card>

        <Button
          form="create-tenant-form"
          type="submit"
          className="w-full"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Création...' : 'Créer le tenant'}
        </Button>
      </form>
    </div>
  );
}
