'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCreateAdminPlan } from '@/hooks/api/plans/useAdminPlans';
import { PlanForm } from '@/components/plans/PlanForm';
import { buildPlanFeaturesPayload, type PlanFeatureState } from '@/components/plans/PlanFeaturesEditor';
import type { PlanFormValues } from '@/validators/plans/validator';
import { toast } from 'sonner';

const CREATE_DEFAULTS: PlanFormValues = {
  name: '',
  type: 'standard',
  isPublic: false,
  trialDays: null,
  description: null,
  stripeProductId: null,
  stripePriceId: null,
};

export default function CreatePlanPage() {
  const router = useRouter();
  const { userRoles } = useAuth();
  const createMutation = useCreateAdminPlan();

  useEffect(() => {
    if (userRoles && !userRoles.isAdmin) {
      router.push('/plans');
    }
  }, [userRoles, router]);

  if (userRoles && !userRoles.isAdmin) return null;

  const onSubmit = async (values: PlanFormValues, features: PlanFeatureState[]) => {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        type: values.type,
        isPublic: values.isPublic ?? false,
        trialDays: values.trialDays ?? null,
        description: values.description ?? null,
        stripeProductId: values.stripeProductId ?? null,
        stripePriceId: values.stripePriceId ?? null,
        planFeatures: buildPlanFeaturesPayload(features),
      });
      toast.success('Plan créé avec succès');
      router.push('/plans');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue.');
    }
  };

  return (
    <PlanForm
      title="Nouveau plan"
      defaultValues={CREATE_DEFAULTS}
      onSubmit={onSubmit}
      isPending={createMutation.isPending}
      submitLabel="Créer le plan"
    />
  );
}
