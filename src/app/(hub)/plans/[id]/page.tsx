'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAdminPlan, useUpdateAdminPlan } from '@/hooks/api/plans/useAdminPlans';
import { PlanForm } from '@/components/plans/PlanForm';
import { buildPlanFeaturesPayload, type PlanFeatureState } from '@/components/plans/PlanFeaturesEditor';
import type { PlanFormValues } from '@/validators/plans/validator';
import type { PlanType } from '@/types/generated/api-types';
import { toast } from 'sonner';

export default function EditPlanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { userRoles } = useAuth();
  const { data: plan, isLoading: planLoading } = useAdminPlan(id ?? '');
  const updateMutation = useUpdateAdminPlan(id ?? '');

  useEffect(() => {
    if (userRoles && !userRoles.isAdmin) {
      router.push('/plans');
    }
  }, [userRoles, router]);

  if (!id) return <p className="text-destructive">ID de plan manquant.</p>;
  if (userRoles && !userRoles.isAdmin) return null;

  const onSubmit = async (values: PlanFormValues, features: PlanFeatureState[]) => {
    try {
      await updateMutation.mutateAsync({
        name: values.name,
        type: values.type,
        isPublic: values.isPublic ?? false,
        trialDays: values.trialDays ?? null,
        description: values.description ?? null,
        stripeProductId: values.stripeProductId ?? null,
        stripePriceId: values.stripePriceId ?? null,
        planFeatures: buildPlanFeaturesPayload(features),
      });
      toast.success('Plan mis à jour');
      router.push('/plans');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue.');
    }
  };

  if (planLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (!plan) return <p className="text-destructive">Plan introuvable.</p>;

  const defaultValues: PlanFormValues = {
    name: plan.name,
    type: (plan.type === 'custom' ? 'custom' : 'standard') satisfies PlanType,
    isPublic: plan.isPublic ?? false,
    trialDays: plan.trialDays ?? null,
    description: plan.description ?? null,
    stripeProductId: plan.stripeProductId ?? null,
    stripePriceId: plan.stripePriceId ?? null,
  };

  return (
    <PlanForm
      title={`Modifier le plan — ${plan.name}`}
      defaultValues={defaultValues}
      existingPlanFeatures={plan.planFeatures}
      onSubmit={onSubmit}
      isPending={updateMutation.isPending}
      submitLabel="Enregistrer les modifications"
    />
  );
}
