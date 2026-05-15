import * as yup from 'yup';

export const changePlanSchema = yup.object({
  targetPlanId: yup.string().uuid().required('Plan cible obligatoire'),
  billingPeriod: yup
    .mixed<'monthly' | 'annual'>()
    .oneOf(['monthly', 'annual'], 'Période invalide')
    .required('Période obligatoire'),
  prorationBehavior: yup
    .mixed<'create_prorations' | 'none' | 'always_invoice'>()
    .oneOf(['create_prorations', 'none', 'always_invoice'])
    .optional(),
  reason: yup.string().max(500, '500 caractères max').optional().nullable(),
});

export type ChangePlanFormValues = yup.InferType<typeof changePlanSchema>;
