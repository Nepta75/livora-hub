import * as yup from 'yup';
import type {
  CreatePromoCodeDuration,
  PromoCodeApplicableBillingPeriods,
  AppliedPromoCodeType,
} from '@/types/generated/api-types';

export const BILLING_PERIODS = ['monthly', 'annual'] as const satisfies readonly PromoCodeApplicableBillingPeriods[];

export const PROMO_TYPES = ['discount', 'trial'] as const satisfies readonly AppliedPromoCodeType[];

const nullableInt = () =>
  yup
    .number()
    .nullable()
    .transform((value, original) => (original === '' ? null : value));

export const DISCOUNT_TYPES = ['percent', 'amount'] as const;
export type DiscountType = (typeof DISCOUNT_TYPES)[number];

export const promoCodeSchema = yup.object({
  code: yup
    .string()
    .required('Code requis')
    .matches(
      /^[A-Z0-9_-]{3,40}$/,
      '3-40 caractères, uniquement A-Z, 0-9, tiret et underscore'
    ),
  type: yup
    .string()
    .oneOf<AppliedPromoCodeType>(PROMO_TYPES, 'Type de promo invalide')
    .required('Type de promo requis'),
  // Trial: applies via Stripe trial_period_days, no Coupon. Required when
  // type=trial, must stay null otherwise (the backend rejects otherwise).
  trialDays: nullableInt()
    .min(1, 'Doit être >= 1')
    .max(365, 'Doit être <= 365')
    .when('type', {
      is: 'trial',
      then: (s) => s.required('Nombre de jours requis pour un essai'),
      otherwise: (s) => s.test('must-be-null', 'Doit être vide pour une réduction', (v) => v == null),
    }),
  discountType: yup
    .string()
    .oneOf<DiscountType>(['percent', 'amount'], 'Type de réduction invalide')
    .when('type', {
      is: 'discount',
      then: (s) => s.required('Type de réduction requis'),
      otherwise: (s) => s.notRequired(),
    }),
  percentOff: nullableInt()
    .min(1, 'Doit être >= 1')
    .max(100, 'Doit être <= 100')
    .when(['type', 'discountType'], {
      is: (type: AppliedPromoCodeType, discountType: DiscountType) => 'discount' === type && 'percent' === discountType,
      then: (s) => s.required('Pourcentage requis'),
    }),
  amountOff: nullableInt()
    .min(1, 'Doit être >= 1')
    .when(['type', 'discountType'], {
      is: (type: AppliedPromoCodeType, discountType: DiscountType) => 'discount' === type && 'amount' === discountType,
      then: (s) => s.required('Montant requis'),
    }),
  currency: yup
    .string()
    .nullable()
    .transform((value, original) => (original === '' ? null : value))
    .when(['type', 'discountType'], {
      is: (type: AppliedPromoCodeType, discountType: DiscountType) => 'discount' === type && 'amount' === discountType,
      then: (s) =>
        s
          .required('Devise requise')
          .length(3, 'Code ISO 4217 à 3 caractères (ex: eur)'),
    }),
  duration: yup
    .string()
    .nullable()
    .oneOf<CreatePromoCodeDuration | null>(['once', 'repeating', 'forever', null], 'Durée invalide')
    .when('type', {
      is: 'discount',
      then: (s) => s.required('Durée requise'),
    }),
  durationInMonths: nullableInt()
    .min(1, 'Doit être >= 1')
    .max(36, 'Doit être <= 36')
    .when(['type', 'duration'], {
      is: (type: AppliedPromoCodeType, duration: CreatePromoCodeDuration | null) =>
        'discount' === type && 'repeating' === duration,
      then: (s) => s.required('Nombre de mois requis'),
    }),
  maxRedemptions: nullableInt().min(1, 'Doit être >= 1'),
  expiresAt: yup
    .string()
    .nullable()
    .transform((value, original) => (original === '' ? null : value)),
  // null = no restriction (any period accepted). A non-null array narrows
  // the promo to the listed periods only — useful for discount codes whose
  // semantics break in a given mode (legacy use case before trial codes).
  applicableBillingPeriods: yup
    .array()
    .of(yup.string().oneOf<PromoCodeApplicableBillingPeriods>(BILLING_PERIODS).required())
    .nullable()
    .transform((value: unknown) =>
      Array.isArray(value) && value.length === 0 ? null : value,
    ),
});

export type PromoCodeFormValues = yup.InferType<typeof promoCodeSchema>;
