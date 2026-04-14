import * as yup from 'yup';
import type { PlanType } from '@/types/generated/api-types';

export const planSchema = yup.object({
  name: yup.string().required('Nom requis'),
  type: yup
    .string()
    .oneOf<PlanType>(['standard', 'custom'], 'Type invalide')
    .required('Type requis'),
  isVisible: yup
    .boolean()
    .required()
    .test(
      'custom-never-visible',
      'Un plan sur mesure ne peut pas être visible sur la landing',
      function (value) {
        const { type } = this.parent as { type?: PlanType };
        return type !== 'custom' || value !== true;
      }
    ),
  trialDays: yup
    .number()
    .nullable()
    .min(1, 'Doit être >= 1')
    .transform((value, original) => (original === '' ? null : value)),
  description: yup.string().nullable(),
  monthlyPriceEuro: yup
    .number()
    .nullable()
    .min(0, 'Doit être >= 0')
    .transform((value, original) => (original === '' ? null : value))
    .test(
      'monthly-positive-if-set',
      'Le prix mensuel doit être strictement supérieur à 0.',
      function (value) {
        if (value == null) return true;
        return value > 0;
      }
    ),
  annualPriceEuro: yup
    .number()
    .nullable()
    .min(0, 'Doit être >= 0')
    .transform((value, original) => (original === '' ? null : value))
    .test(
      'annual-positive-if-set',
      'Le prix annuel doit être strictement supérieur à 0.',
      function (value) {
        if (value == null) return true;
        return value > 0;
      }
    )
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
