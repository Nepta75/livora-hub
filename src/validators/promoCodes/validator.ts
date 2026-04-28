import * as yup from 'yup';
import type {
  CreatePromoCodeDuration,
  PromoCodeApplicableBillingPeriods,
} from '@/types/generated/api-types';

export const BILLING_PERIODS = ['monthly', 'annual'] as const satisfies readonly PromoCodeApplicableBillingPeriods[];

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
  discountType: yup
    .string()
    .oneOf<DiscountType>(['percent', 'amount'], 'Type de réduction invalide')
    .required('Type de réduction requis'),
  percentOff: nullableInt()
    .min(1, 'Doit être >= 1')
    .max(100, 'Doit être <= 100')
    .when('discountType', {
      is: 'percent',
      then: (s) => s.required('Pourcentage requis'),
    }),
  amountOff: nullableInt()
    .min(1, 'Doit être >= 1')
    .when('discountType', {
      is: 'amount',
      then: (s) => s.required('Montant requis'),
    }),
  currency: yup
    .string()
    .nullable()
    .transform((value, original) => (original === '' ? null : value))
    .when('discountType', {
      is: 'amount',
      then: (s) =>
        s
          .required('Devise requise')
          .length(3, 'Code ISO 4217 à 3 caractères (ex: eur)'),
    }),
  duration: yup
    .string()
    .oneOf<CreatePromoCodeDuration>(['once', 'repeating', 'forever'], 'Durée invalide')
    .required('Durée requise'),
  durationInMonths: nullableInt()
    .min(1, 'Doit être >= 1')
    .max(36, 'Doit être <= 36')
    .when('duration', {
      is: 'repeating',
      then: (s) => s.required('Nombre de mois requis'),
    }),
  maxRedemptions: nullableInt().min(1, 'Doit être >= 1'),
  expiresAt: yup
    .string()
    .nullable()
    .transform((value, original) => (original === '' ? null : value)),
  // null = no restriction (any period accepted). A non-null array narrows
  // the promo to the listed periods only — required for `repeating` coupons
  // applied in annual mode, which Stripe would otherwise expand to the full
  // first annual invoice.
  applicableBillingPeriods: yup
    .array()
    .of(yup.string().oneOf<PromoCodeApplicableBillingPeriods>(BILLING_PERIODS).required())
    .nullable()
    .transform((value: unknown) =>
      Array.isArray(value) && value.length === 0 ? null : value,
    ),
});

export type PromoCodeFormValues = yup.InferType<typeof promoCodeSchema>;
