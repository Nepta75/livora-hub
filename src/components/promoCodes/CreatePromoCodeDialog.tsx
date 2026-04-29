'use client';

import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { CalendarClock, Gift, Hash, Percent, Tag, Users } from 'lucide-react';
import { useCreateAdminPromoCode } from '@/hooks/api/promoCodes/useAdminPromoCodes';
import { mapPromoCodeError } from '@/services/admin/promoCodesService';
import {
  BILLING_PERIODS,
  promoCodeSchema,
  type PromoCodeFormValues,
} from '@/validators/promoCodes/validator';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  type: 'discount',
  trialDays: null,
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
  hint,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <header className="flex items-center gap-2.5">
        <span className="text-primary">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold leading-tight">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </header>
      <div className="space-y-3 pl-7">{children}</div>
    </section>
  );
}

function TypeCard({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'group flex flex-col gap-1.5 rounded-lg border-2 p-4 text-left transition-all',
        selected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-input hover:border-primary/50 hover:bg-muted/50',
      )}
    >
      <div className={cn(
        'flex h-9 w-9 items-center justify-center rounded-md',
        selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
      )}>
        {icon}
      </div>
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-xs text-muted-foreground leading-snug">{description}</div>
    </button>
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

  const promoType = watch('type');
  const discountType = watch('discountType');
  const duration = watch('duration');
  const applicableBillingPeriods = watch('applicableBillingPeriods') ?? [];
  const isTrial = promoType === 'trial';

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
    const baseRules = draftRules.length > 0
      ? {
          rules: draftRules.map((r) => ({
            type: r.type as ICreatePromoCodeRuleDto['type'],
            value: r.value,
          })),
        }
      : {};

    const baseShared: Pick<ICreatePromoCodeDto, 'code' | 'type'> = {
      code: values.code.toUpperCase(),
      type: values.type,
    };

    const baseLifecycle = {
      ...(values.maxRedemptions != null ? { maxRedemptions: values.maxRedemptions } : {}),
      ...(values.expiresAt
        ? { expiresAt: new Date(values.expiresAt).toISOString() }
        : {}),
      ...(values.applicableBillingPeriods && values.applicableBillingPeriods.length > 0
        ? { applicableBillingPeriods: values.applicableBillingPeriods }
        : {}),
    };

    // Backend expects amount_off in the smallest currency unit (cents for EUR).
    // We let the operator type euros to remove the "5000 = 50€" footgun, then
    // convert here at the boundary.
    const amountOffInCents = values.amountOff != null ? Math.round(values.amountOff * 100) : null;

    const payload: ICreatePromoCodeDto = values.type === 'trial'
      ? {
          ...baseShared,
          trialDays: values.trialDays ?? undefined,
          ...baseLifecycle,
          ...baseRules,
        }
      : {
          ...baseShared,
          duration: values.duration ?? undefined,
          ...(values.discountType === 'percent'
            ? { percentOff: values.percentOff ?? undefined }
            : {
                amountOff: amountOffInCents ?? undefined,
                currency: values.currency?.toLowerCase(),
              }),
          ...(values.duration === 'repeating'
            ? { durationInMonths: values.durationInMonths ?? undefined }
            : {}),
          ...baseLifecycle,
          ...baseRules,
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
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl">Nouveau code promo</DialogTitle>
          <DialogDescription>
            Crée une réduction (coupon Stripe) ou un essai gratuit (
            <code className="text-xs">trial_period_days</code>, sans coupon).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ── Section 1: Identité ───────────────────────────────────────── */}
          <Section
            icon={<Tag className="h-4 w-4" />}
            title="Identité"
            description="Le code que les clients tapent à l'inscription ou sur leur compte."
          >
            <Field
              label="Code"
              id="code"
              error={errors.code?.message}
              hint="3-40 caractères, A-Z, 0-9, tiret et underscore."
            >
              <Input
                id="code"
                {...register('code')}
                placeholder="BIENVENUE2026"
                className="font-mono uppercase tracking-wider text-base"
                autoComplete="off"
              />
            </Field>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <TypeCard
                  icon={<Gift className="h-4 w-4" />}
                  title="Essai gratuit"
                  description="X jours offerts. Marche en mensuel et annuel."
                  selected={isTrial}
                  onClick={() => setValue('type', 'trial', { shouldValidate: true })}
                />
                <TypeCard
                  icon={<Percent className="h-4 w-4" />}
                  title="Réduction"
                  description="% ou montant fixe via coupon Stripe."
                  selected={!isTrial}
                  onClick={() => setValue('type', 'discount', { shouldValidate: true })}
                />
              </div>
            </div>
          </Section>

          {/* ── Section 2: Avantage ───────────────────────────────────────── */}
          <Section
            icon={isTrial ? <Gift className="h-4 w-4" /> : <Percent className="h-4 w-4" />}
            title="Avantage"
            description={
              isTrial
                ? 'Pas de prélèvement pendant la période. Premier paiement à la fin.'
                : 'La réduction s\'applique au prochain cycle de facturation.'
            }
          >
            {isTrial ? (
              <Field
                label="Durée d'essai (jours)"
                id="trialDays"
                error={errors.trialDays?.message}
                hint="Ex: 14, 30, 90."
              >
                <Input
                  id="trialDays"
                  type="number"
                  min={1}
                  max={365}
                  {...register('trialDays')}
                  placeholder="90"
                />
              </Field>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        <SelectItem value="amount">Montant fixe (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  {discountType === 'percent' ? (
                    <Field
                      label="Pourcentage"
                      id="percentOff"
                      error={errors.percentOff?.message}
                    >
                      <div className="relative">
                        <Input
                          id="percentOff"
                          type="number"
                          min={1}
                          max={100}
                          {...register('percentOff')}
                          placeholder="50"
                          className="pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                          %
                        </span>
                      </div>
                    </Field>
                  ) : (
                    <Field
                      label="Montant"
                      id="amountOff"
                      error={errors.amountOff?.message}
                    >
                      <div className="relative">
                        <Input
                          id="amountOff"
                          type="number"
                          min={1}
                          step="0.01"
                          {...register('amountOff')}
                          placeholder="50"
                          className="pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                          €
                        </span>
                      </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field
                    label="Récurrence"
                    id="duration"
                    error={errors.duration?.message}
                    hint={
                      duration === 'forever'
                        ? 'Appliqué à chaque facture, à vie.'
                        : duration === 'repeating'
                        ? 'Appliqué pendant N mois consécutifs.'
                        : 'Une seule facture concernée.'
                    }
                  >
                    <Select
                      value={duration ?? 'once'}
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
                        <SelectItem value="repeating">Plusieurs mois</SelectItem>
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
                        placeholder="3"
                      />
                    </Field>
                  )}
                </div>
              </>
            )}
          </Section>

          {/* ── Section 3: Limites ────────────────────────────────────────── */}
          <Section
            icon={<CalendarClock className="h-4 w-4" />}
            title="Limites"
            description="Optionnel. Tout vide = code illimité dans le temps et en usage."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Utilisations max"
                id="maxRedemptions"
                error={errors.maxRedemptions?.message}
                hint="Ex: 100 pilotes."
              >
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="maxRedemptions"
                    type="number"
                    min={1}
                    {...register('maxRedemptions')}
                    placeholder="Illimité"
                    className="pl-9"
                  />
                </div>
              </Field>

              <Field
                label="Expire le"
                id="expiresAt"
                error={errors.expiresAt?.message}
                hint="Vide = jamais."
              >
                <Input id="expiresAt" type="date" {...register('expiresAt')} />
              </Field>
            </div>

            <Field
              label="Périodicités acceptées"
              id="applicableBillingPeriods"
              error={errors.applicableBillingPeriods?.message as string | undefined}
              hint="Vide = mensuel et annuel acceptés."
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
            </Field>
          </Section>

          {/* ── Section 4: Règles d'éligibilité ───────────────────────────── */}
          <Section
            icon={<Users className="h-4 w-4" />}
            title="Règles d'éligibilité"
            description="Optionnel. Sans règle, le code est utilisable par tous les tenants."
          >
            <PromoCodeRulesEditor
              rules={draftRules}
              onAdd={handleAddRule}
              onRemove={handleRemoveRule}
              isBusy={createMutation.isPending}
            />
          </Section>

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
              {createMutation.isPending ? 'Création...' : 'Créer le code'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
