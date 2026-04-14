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
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { IPlanFeature } from '@/types/generated/api-types';

// Stripe mode detection: NEXT_PUBLIC_STRIPE_MODE env var.
// Dashboard URL pattern: https://dashboard.stripe.com/{mode}/{resource}/{id}
// (mode is prefixed only for test; live omits the /test/ segment, but keeping
// explicit segments works for both and matches what Stripe redirects handle.)
// Fail loud in production if misconfigured — silently falling back to "test"
// would send admins to the wrong Stripe dashboard in live builds.
const STRIPE_MODE: 'live' | 'test' = (() => {
  const mode = process.env.NEXT_PUBLIC_STRIPE_MODE;
  if (mode === 'live' || mode === 'test') return mode;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_STRIPE_MODE must be "live" or "test" in production builds.',
    );
  }
  return 'test'; // dev fallback
})();

function stripeDashboardUrl(resource: 'products' | 'prices', id: string): string {
  const prefix = STRIPE_MODE === 'test' ? '/test' : '';
  return `https://dashboard.stripe.com${prefix}/${resource}/${id}`;
}

function StripeReadOnlyField({
  label,
  id,
  value,
  resource,
}: {
  label: string;
  id: string;
  value: string | null | undefined;
  resource: 'products' | 'prices';
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      {value ? (
        <div className="flex items-center gap-2 rounded-md border border-input bg-muted/40 px-3 py-2">
          <span id={id} className="truncate font-mono text-sm text-muted-foreground">
            {value}
          </span>
          <a
            href={stripeDashboardUrl(resource, value)}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            title="Ouvrir dans Stripe"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      ) : (
        <div
          className="flex items-center rounded-md border border-dashed border-input bg-muted/20 px-3 py-2 text-sm italic text-muted-foreground"
          title="Sera créé automatiquement après sauvegarde"
        >
          Non synchronisé
        </div>
      )}
    </div>
  );
}

export interface PlanFormProps {
  title: string;
  defaultValues: PlanFormValues;
  existingPlanFeatures?: IPlanFeature[];
  stripeIds?: {
    productId: string | null;
    monthlyPriceId: string | null;
    annualPriceId: string | null;
  };
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
  stripeIds,
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
  const isCustom = typeValue === 'custom';
  const stripeProductId = stripeIds?.productId ?? null;
  const stripeMonthlyPriceId = stripeIds?.monthlyPriceId ?? null;
  const stripeAnnualPriceId = stripeIds?.annualPriceId ?? null;

  // Annual auto-fill: on first blur of an empty annual when monthly is set,
  // mirror monthly into annual. Tracked per-mount to avoid re-filling if the
  // user explicitly clears annual after the initial blur.
  const annualAutoFilled = useRef(false);
  const handleAnnualBlur = () => {
    if (annualAutoFilled.current) return;
    const annualRaw = watch('annualPriceEuro');
    const monthlyRaw = watch('monthlyPriceEuro');
    if ((annualRaw == null || Number.isNaN(annualRaw)) && monthlyRaw != null && !Number.isNaN(monthlyRaw)) {
      setValue('annualPriceEuro', monthlyRaw, { shouldDirty: true, shouldValidate: true });
      annualAutoFilled.current = true;
    } else {
      annualAutoFilled.current = true;
    }
  };

  // Flipping to custom: reset landing-only fields so a dirty value from a prior
  // standard edit doesn't get silently submitted (backend would 400 on isVisible=true
  // for custom, and isFeatured/ctaLabel are meaningless for a non-public plan).
  useEffect(() => {
    if (isCustom) {
      setValue('isVisible', false, { shouldDirty: true });
      setValue('isFeatured', false, { shouldDirty: true });
      setValue('ctaLabel', null, { shouldDirty: true });
    }
  }, [isCustom, setValue]);

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

            <StripeReadOnlyField
              label="Stripe Product ID"
              id="stripeProductId"
              value={stripeProductId}
              resource="products"
            />

            <StripeReadOnlyField
              label="Stripe Price ID mensuel"
              id="stripeMonthlyPriceId"
              value={stripeMonthlyPriceId}
              resource="prices"
            />

            <StripeReadOnlyField
              label="Stripe Price ID annuel"
              id="stripeAnnualPriceId"
              value={stripeAnnualPriceId}
              resource="prices"
            />

            <div className="col-span-2 -mt-1 text-xs italic text-muted-foreground">
              Les identifiants Stripe sont synchronisés automatiquement. Modifiez le prix ou le nom
              du plan, Stripe suit.
            </div>

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
                {...register('annualPriceEuro', { onBlur: handleAnnualBlur })}
                placeholder="Ex : 39"
              />
            </Field>

            {!isCustom && (
              <div className="col-span-2">
                <Field
                  label="Libellé du CTA (landing page)"
                  id="ctaLabel"
                  error={errors.ctaLabel?.message}
                >
                  <Input
                    id="ctaLabel"
                    {...register('ctaLabel')}
                    placeholder="Ex : Démarrer l'essai — laisser vide pour le libellé par défaut"
                  />
                </Field>
              </div>
            )}

            {!isCustom && (
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
            )}

            {isCustom && (
              <div className="col-span-2 rounded-md border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                Les plans sur mesure sont négociés au cas par cas et ne sont jamais affichés sur la
                landing — les options &laquo;&nbsp;visible&nbsp;&raquo;, &laquo;&nbsp;mis en
                avant&nbsp;&raquo; et le libellé de CTA sont masqués.
              </div>
            )}
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

