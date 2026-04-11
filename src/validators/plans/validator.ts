import * as yup from 'yup';
import type { PlanType } from '@/types/generated/api-types';

export const planSchema = yup.object({
  name: yup.string().required('Nom requis'),
  type: yup
    .string()
    .oneOf<PlanType>(['standard', 'custom'], 'Type invalide')
    .required('Type requis'),
  isPublic: yup.boolean().required(),
  trialDays: yup
    .number()
    .nullable()
    .min(0, 'Doit être >= 0')
    .transform((value, original) => (original === '' ? null : value))
    .optional(),
  description: yup.string().nullable().optional(),
  stripeProductId: yup.string().nullable().optional(),
  stripePriceId: yup.string().nullable().optional(),
});

// Explicit type with required keys to avoid Yup optional vs RHF type friction
export interface PlanFormValues {
  name: string;
  type: PlanType;
  isPublic: boolean;
  trialDays: number | null | undefined;
  description: string | null | undefined;
  stripeProductId: string | null | undefined;
  stripePriceId: string | null | undefined;
}
