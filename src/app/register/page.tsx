'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  registerInitSchema,
  registerConfirmSchema,
  type RegisterInitFormValues,
  type RegisterConfirmFormValues,
} from '@/validators/auth/registerValidator';
import { registerService } from '@/services/auth/registerService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'init' | 'confirm'>('init');
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const initForm = useForm<RegisterInitFormValues>({
    resolver: yupResolver(registerInitSchema),
    defaultValues: { email: '' },
  });

  const confirmForm = useForm<RegisterConfirmFormValues>({
    resolver: yupResolver(registerConfirmSchema),
    defaultValues: { otp: '', firstName: '', lastName: '', password: '' },
  });

  const onInitSubmit = async (values: RegisterInitFormValues) => {
    setLoading(true);
    try {
      await registerService.init(values.email);
      setAdminEmail(values.email);
      setStep('confirm');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const onConfirmSubmit = async (values: RegisterConfirmFormValues) => {
    setLoading(true);
    try {
      await registerService.confirm({ email: adminEmail, ...values });
      router.push('/login');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        {step === 'init' ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Livora Hub</CardTitle>
              <CardDescription>Créer le premier compte administrateur</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="register-init-form" onSubmit={initForm.handleSubmit(onInitSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email administrateur</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@livoraexpress.fr"
                    autoComplete="email"
                    {...initForm.register('email')}
                  />
                  {initForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{initForm.formState.errors.email.message}</p>
                  )}
                </div>
              </form>
              <Button form="register-init-form" type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Envoi...' : 'Recevoir le code OTP'}
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Vérification</CardTitle>
              <CardDescription>
                Un code a été envoyé à <strong>{adminEmail}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="register-confirm-form" onSubmit={confirmForm.handleSubmit(onConfirmSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Code OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    autoComplete="one-time-code"
                    {...confirmForm.register('otp')}
                  />
                  {confirmForm.formState.errors.otp && (
                    <p className="text-sm text-destructive">{confirmForm.formState.errors.otp.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" type="text" {...confirmForm.register('firstName')} />
                  {confirmForm.formState.errors.firstName && (
                    <p className="text-sm text-destructive">{confirmForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" type="text" {...confirmForm.register('lastName')} />
                  {confirmForm.formState.errors.lastName && (
                    <p className="text-sm text-destructive">{confirmForm.formState.errors.lastName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...confirmForm.register('password')}
                  />
                  {confirmForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{confirmForm.formState.errors.password.message}</p>
                  )}
                </div>
              </form>
              <Button form="register-confirm-form" type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Création...' : 'Créer le compte'}
              </Button>
              <Button variant="ghost" className="w-full mt-2" onClick={() => setStep('init')}>
                Renvoyer le code
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
