'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useAdminFeatures } from '@/hooks/api/plans/useAdminPlans';
import { planSchema, type PlanFormValues } from '@/validators/plans/validator';
import {
  PlanFeaturesEditor,
  initFeaturesState,
  type PlanFeatureState,
} from '@/components/plans/PlanFeaturesEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import type { IPlanFeature } from '@/types/generated/api-types';

export interface PlanFormProps {
  title: string;
  defaultValues: PlanFormValues;
  existingPlanFeatures?: IPlanFeature[];
  onSubmit: (values: PlanFormValues, features: PlanFeatureState[]) => Promise<void>;
  isPending: boolean;
  submitLabel: string;
}

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

export function PlanForm({
  title,
  defaultValues,
  existingPlanFeatures,
  onSubmit,
  isPending,
  submitLabel,
}: PlanFormProps) {
  const { data: features = [], isLoading: featuresLoading } = useAdminFeatures();
  const [planFeatures, setPlanFeatures] = useState<PlanFeatureState[]>([]);
  const featuresInitialized = useRef(false);

  useEffect(() => {
    if (!featuresInitialized.current && features.length > 0) {
      featuresInitialized.current = true;
      setPlanFeatures(initFeaturesState(features, existingPlanFeatures));
    }
    // Intentionally one-shot: background RQ refetches must not reset the user's
    // in-progress edits. Navigation between plans is handled via key={id} on PlanForm
    // in the edit page, which remounts the component entirely.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features, existingPlanFeatures]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlanFormValues>({
    // Cast needed: yupResolver infers optional keys (field?) while RHF expects required keys
    // with undefined in value type (field: T | undefined). Same shape, different optionality.
    resolver: yupResolver(planSchema) as unknown as Resolver<PlanFormValues>,
    defaultValues,
  });

  const typeValue = watch('type');

  const handleFormSubmit = async (values: PlanFormValues) => {
    await onSubmit(values, planFeatures);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/plans">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Nom" id="name" error={errors.name?.message}>
                <Input id="name" {...register('name')} placeholder="Solo" />
              </Field>
            </div>

            <Field label="Type" id="type" error={errors.type?.message}>
              <Select
                value={typeValue ?? 'standard'}
                onValueChange={(v) => setValue('type', v as PlanFormValues['type'], { shouldValidate: true })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Trial (jours)" id="trialDays" error={errors.trialDays?.message}>
              <Input
                id="trialDays"
                type="number"
                min={1}
                {...register('trialDays')}
                placeholder="14"
              />
            </Field>

            <div className="col-span-2">
              <Field label="Description" id="description" error={errors.description?.message}>
                <Input
                  id="description"
                  {...register('description')}
                  placeholder="Description du plan..."
                />
              </Field>
            </div>

            <Field
              label="Stripe Product ID"
              id="stripeProductId"
              error={errors.stripeProductId?.message}
            >
              <Input
                id="stripeProductId"
                {...register('stripeProductId')}
                placeholder="prod_xxx"
                className="font-mono"
              />
            </Field>

            <Field
              label="Stripe Price ID mensuel"
              id="stripeMonthlyPriceId"
              error={errors.stripeMonthlyPriceId?.message}
            >
              <Input
                id="stripeMonthlyPriceId"
                {...register('stripeMonthlyPriceId')}
                placeholder="price_xxx_monthly"
                className="font-mono"
              />
            </Field>

            <Field
              label="Stripe Price ID annuel"
              id="stripeAnnualPriceId"
              error={errors.stripeAnnualPriceId?.message}
            >
              <Input
                id="stripeAnnualPriceId"
                {...register('stripeAnnualPriceId')}
                placeholder="price_xxx_annual"
                className="font-mono"
              />
            </Field>

            <Field
              label="Prix mensuel (€)"
              id="monthlyPriceEuro"
              error={errors.monthlyPriceEuro?.message}
            >
              <Input
                id="monthlyPriceEuro"
                type="number"
                min={0}
                {...register('monthlyPriceEuro')}
                placeholder="Ex : 49"
              />
            </Field>

            <Field
              label="Prix annuel / mois (€)"
              id="annualPriceEuro"
              error={errors.annualPriceEuro?.message}
            >
              <Input
                id="annualPriceEuro"
                type="number"
                min={0}
                {...register('annualPriceEuro')}
                placeholder="Ex : 39"
              />
            </Field>

            <div className="col-span-2 flex flex-wrap gap-6 pt-1">
              <div className="flex items-center gap-2">
                <input
                  id="isVisible"
                  type="checkbox"
                  className="h-4 w-4"
                  {...register('isVisible')}
                />
                <Label htmlFor="isVisible">Visible sur la landing page</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isFeatured"
                  type="checkbox"
                  className="h-4 w-4"
                  {...register('isFeatured')}
                />
                <Label htmlFor="isFeatured">Mis en avant (badge &quot;populaire&quot;)</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Features</CardTitle>
          </CardHeader>
          <CardContent>
            {featuresLoading ? (
              <p className="text-sm text-muted-foreground">Chargement des features...</p>
            ) : (
              <PlanFeaturesEditor value={planFeatures} onChange={setPlanFeatures} />
            )}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Enregistrement...' : submitLabel}
        </Button>
      </form>
    </div>
  );
}

