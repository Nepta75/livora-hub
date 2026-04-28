'use client';

import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { useCreateAdminPromoCode } from '@/hooks/api/promoCodes/useAdminPromoCodes';
import { mapPromoCodeError } from '@/services/admin/promoCodesService';
import {
  BILLING_PERIODS,
  promoCodeSchema,
  type PromoCodeFormValues,
} from '@/validators/promoCodes/validator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PromoCodeRulesEditor,
  type EditorRule,
} from '@/components/promoCodes/PromoCodeRulesEditor';
import type {
  ICreatePromoCodeDto,
  ICreatePromoCodeRuleDto,
} from '@/types/generated/api-types';

const DEFAULTS: PromoCodeFormValues = {
  code: '',
  discountType: 'percent',
  percentOff: null,
  amountOff: null,
  currency: 'eur',
  duration: 'once',
  durationInMonths: null,
  maxRedemptions: null,
  expiresAt: null,
  applicableBillingPeriods: null,
};

const BILLING_PERIOD_LABEL: Record<(typeof BILLING_PERIODS)[number], string> = {
  monthly: 'Mensuel',
  annual: 'Annuel',
};

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

interface CreatePromoCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePromoCodeDialog({ open, onOpenChange }: CreatePromoCodeDialogProps) {
  const createMutation = useCreateAdminPromoCode();
  const [draftRules, setDraftRules] = useState<EditorRule[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PromoCodeFormValues>({
    // Cast needed: yupResolver infers optional keys (field?) while RHF expects required keys
    // with undefined in value type (field: T | undefined). Same shape, different optionality.
    resolver: yupResolver(promoCodeSchema) as unknown as Resolver<PromoCodeFormValues>,
    defaultValues: DEFAULTS,
  });

  const discountType = watch('discountType');
  const duration = watch('duration');
  const applicableBillingPeriods = watch('applicableBillingPeriods') ?? [];

  useEffect(() => {
    if (!open) {
      reset(DEFAULTS);
      setDraftRules([]);
    }
  }, [open, reset]);

  function handleAddRule(rule: ICreatePromoCodeRuleDto) {
    setDraftRules((prev) => [
      ...prev,
      {
        // Client-only id — only used for React keys + local removal. The
        // backend assigns a real UUID when the code is created.
        id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: rule.type,
        value: rule.value ?? {},
      },
    ]);
  }

  function handleRemoveRule(id: string) {
    setDraftRules((prev) => prev.filter((r) => r.id !== id));
  }

  const onSubmit = async (values: PromoCodeFormValues) => {
    const payload: ICreatePromoCodeDto = {
      code: values.code.toUpperCase(),
      duration: values.duration,
      ...(values.discountType === 'percent'
        ? { percentOff: values.percentOff ?? undefined }
        : {
            amountOff: values.amountOff ?? undefined,
            currency: values.currency?.toLowerCase(),
          }),
      ...(values.duration === 'repeating'
        ? { durationInMonths: values.durationInMonths ?? undefined }
        : {}),
      ...(values.maxRedemptions != null ? { maxRedemptions: values.maxRedemptions } : {}),
      ...(values.expiresAt
        ? { expiresAt: new Date(values.expiresAt).toISOString() }
        : {}),
      ...(values.applicableBillingPeriods && values.applicableBillingPeriods.length > 0
        ? { applicableBillingPeriods: values.applicableBillingPeriods }
        : {}),
      ...(draftRules.length > 0
        ? {
            rules: draftRules.map((r) => ({
              type: r.type as ICreatePromoCodeRuleDto['type'],
              value: r.value,
            })),
          }
        : {}),
    };

    try {
      await createMutation.mutateAsync(payload);
      toast.success(`Code "${payload.code}" créé`);
      onOpenChange(false);
    } catch (error) {
      toast.error(mapPromoCodeError(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau code promo</DialogTitle>
          <DialogDescription>
            Crée un coupon Stripe + un promotion code avec le libellé saisi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Code" id="code" error={errors.code?.message}>
            <Input
              id="code"
              {...register('code')}
              placeholder="PILOTE"
              className="font-mono uppercase"
              autoComplete="off"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Type de réduction"
              id="discountType"
              error={errors.discountType?.message}
            >
              <Select
                value={discountType}
                onValueChange={(v) =>
                  setValue('discountType', v as PromoCodeFormValues['discountType'], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="discountType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Pourcentage (%)</SelectItem>
                  <SelectItem value="amount">Montant fixe</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {discountType === 'percent' ? (
              <Field label="% de réduction" id="percentOff" error={errors.percentOff?.message}>
                <Input
                  id="percentOff"
                  type="number"
                  min={1}
                  max={100}
                  {...register('percentOff')}
                  placeholder="Ex : 50"
                />
              </Field>
            ) : (
              <Field label="Montant" id="amountOff" error={errors.amountOff?.message}>
                <Input
                  id="amountOff"
                  type="number"
                  min={1}
                  {...register('amountOff')}
                  placeholder="Unité mineure (ex: 5000 = 50€)"
                />
              </Field>
            )}
          </div>

          {discountType === 'amount' && (
            <Field label="Devise (ISO 4217)" id="currency" error={errors.currency?.message}>
              <Input
                id="currency"
                {...register('currency')}
                placeholder="eur"
                className="font-mono"
                maxLength={3}
              />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Durée" id="duration" error={errors.duration?.message}>
              <Select
                value={duration}
                onValueChange={(v) =>
                  setValue('duration', v as PromoCodeFormValues['duration'], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Une fois</SelectItem>
                  <SelectItem value="repeating">Répété sur X mois</SelectItem>
                  <SelectItem value="forever">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {duration === 'repeating' && (
              <Field
                label="Nombre de mois"
                id="durationInMonths"
                error={errors.durationInMonths?.message}
              >
                <Input
                  id="durationInMonths"
                  type="number"
                  min={1}
                  max={36}
                  {...register('durationInMonths')}
                  placeholder="Ex : 3"
                />
              </Field>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Redemptions max"
              id="maxRedemptions"
              error={errors.maxRedemptions?.message}
            >
              <Input
                id="maxRedemptions"
                type="number"
                min={1}
                {...register('maxRedemptions')}
                placeholder="Illimité si vide"
              />
            </Field>

            <Field label="Expire le" id="expiresAt" error={errors.expiresAt?.message}>
              <Input id="expiresAt" type="date" {...register('expiresAt')} />
            </Field>
          </div>

          <Field
            label="Périodicités acceptées"
            id="applicableBillingPeriods"
            error={errors.applicableBillingPeriods?.message as string | undefined}
          >
            <div className="flex flex-wrap gap-2">
              {BILLING_PERIODS.map((period) => {
                const checked = applicableBillingPeriods.includes(period);
                return (
                  <Button
                    key={period}
                    type="button"
                    size="sm"
                    variant={checked ? 'default' : 'outline'}
                    onClick={() => {
                      const next = checked
                        ? applicableBillingPeriods.filter((p) => p !== period)
                        : [...applicableBillingPeriods, period];
                      setValue(
                        'applicableBillingPeriods',
                        next.length > 0 ? next : null,
                        { shouldValidate: true, shouldDirty: true },
                      );
                    }}
                  >
                    {BILLING_PERIOD_LABEL[period]}
                  </Button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Aucune sélection = toutes périodicités acceptées. Restreindre est requis pour
              les coupons « répété sur X mois » qui doivent rester en mensuel — Stripe
              applique sinon la remise sur la totalité de la première facture annuelle.
            </p>
          </Field>

          <Separator />

          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-semibold">Règles d&rsquo;éligibilité</h3>
              <p className="text-xs text-muted-foreground">
                Optionnel. Le code est utilisable par tous les tenants si aucune règle n&rsquo;est
                définie. Les règles sont créées en même temps que le code (atomique — annulation
                complète si la création échoue).
              </p>
            </div>
            <PromoCodeRulesEditor
              rules={draftRules}
              onAdd={handleAddRule}
              onRemove={handleRemoveRule}
              isBusy={createMutation.isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
