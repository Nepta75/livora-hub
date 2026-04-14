import * as yup from 'yup';
import type { PlanType } from '@/types/generated/api-types';

export const planSchema = yup.object({
  name: yup.string().required('Nom requis'),
  type: yup
    .string()
    .oneOf<PlanType>(['standard', 'custom'], 'Type invalide')
    .required('Type requis'),
  isVisible: yup.boolean().required(),
  trialDays: yup
    .number()
    .nullable()
    .min(1, 'Doit être >= 1')
    .transform((value, original) => (original === '' ? null : value)),
  description: yup.string().nullable(),
  stripeProductId: yup.string().nullable(),
  stripeMonthlyPriceId: yup.string().nullable(),
  stripeAnnualPriceId: yup.string().nullable(),
  monthlyPriceEuro: yup
    .number()
    .nullable()
    .min(0, 'Doit être >= 0')
    .transform((value, original) => (original === '' ? null : value)),
  annualPriceEuro: yup
    .number()
    .nullable()
    .min(0, 'Doit être >= 0')
    .transform((value, original) => (original === '' ? null : value))
    .test(
      'annual-lte-monthly',
      'Le prix annuel par mois doit être ≤ au prix mensuel',
      function (annualValue) {
        const { monthlyPriceEuro } = this.parent as { monthlyPriceEuro?: number | null };
        if (annualValue == null || monthlyPriceEuro == null) return true;
        return annualValue <= monthlyPriceEuro;
      }
    ),
  isFeatured: yup.boolean().required(),
  ctaLabel: yup
    .string()
    .nullable()
    .max(255, 'Maximum 255 caractères')
    .transform((value, original) => (original === '' ? null : value)),
});

export type PlanFormValues = yup.InferType<typeof planSchema>;
