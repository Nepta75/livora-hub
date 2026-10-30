import * as yup from 'yup';

export const createTenantSchema = yup.object({
  name: yup.string().required('Nom requis'),
  email: yup.string().required('Email requis').email('Email invalide'),
  phone: yup.string().required('Téléphone requis'),
  siretNumber: yup
    .string()
    .required('SIRET requis')
    .length(14, 'Le SIRET doit contenir 14 chiffres')
    .matches(/^\d{14}$/, 'Le SIRET doit contenir uniquement des chiffres'),
  rcsCity: yup.string().required('Ville RCS requise'),
  vatExempt: yup.boolean().required(),
  vatNumber: yup
    .string()
    .defined()
    .when('vatExempt', {
      is: false,
      then: schema => schema.required('Numéro de TVA requis'),
      otherwise: schema => schema,
    }),

  address: yup.object({
    name: yup.string().required('Libellé adresse requis'),
    streetNumber: yup.string().required('Numéro de rue requis'),
    street: yup.string().required('Rue requise'),
    postalCode: yup.string().required('Code postal requis'),
    city: yup.string().required('Ville requise'),
    country: yup.string().required('Pays requis'),
  }).required(),

  // Bank details are OPTIONAL: they only feed the RIB line on the tenant's own client invoices, so they
  // must not block tenant creation. The rule is complete-or-empty, which mirrors the back (a sent bank
  // block must have every field, @Assert\NotBlank on each): leave the whole block blank, or fill it fully.
  defaultBankDetail: yup
    .object({
      bankLabel: yup.string().default(''),
      bankName: yup.string().default(''),
      accountHolderName: yup.string().default(''),
      iban: yup.string().default('').max(34, 'IBAN invalide'),
      bic: yup.string().default('').max(11, 'BIC invalide'),
      bankCode: yup.string().default(''),
      accountNumber: yup.string().default(''),
    })
    .required()
    .test(
      'rib-complete-or-empty',
      'Coordonnées bancaires incomplètes : remplissez tout le bloc ou laissez-le entièrement vide.',
      (value) => {
        const fields = [
          value?.bankLabel, value?.bankName, value?.accountHolderName,
          value?.iban, value?.bic, value?.bankCode, value?.accountNumber,
        ];
        const filled = fields.filter((field) => (field ?? '').trim() !== '').length;

        if (0 === filled) {
          return true;
        }
        if (filled !== fields.length) {
          return false;
        }

        // Fully filled: the IBAN/BIC lengths the back also enforces (min side; max is a field rule above).
        return (value?.iban ?? '').length >= 15 && (value?.bic ?? '').length >= 8;
      },
    ),
});

export type CreateTenantFormValues = yup.InferType<typeof createTenantSchema>;

export const updateTenantSchema = createTenantSchema;
export type UpdateTenantFormValues = CreateTenantFormValues;

export const TENANT_USER_ROLES = [
  { value: 'ROLE_MANAGER_ADMIN', label: 'Manager Admin' },
  { value: 'ROLE_MANAGER', label: 'Manager' },
  { value: 'ROLE_DELIVERER', label: 'Livreur' },
  { value: 'ROLE_CUSTOMER_ADMIN', label: 'Client Admin' },
  { value: 'ROLE_CUSTOMER', label: 'Client' },
] as const;

export const inviteTenantUserSchema = yup.object({
  email: yup.string().required('Email requis').email('Email invalide'),
  role: yup.string().required('Rôle requis'),
});

export type InviteTenantUserFormValues = yup.InferType<typeof inviteTenantUserSchema>;

export const editTenantUserSchema = yup.object({
  firstName: yup.string().required('Prénom requis'),
  lastName: yup.string().required('Nom requis'),
  email: yup.string().required('Email requis').email('Email invalide'),
  role: yup.string().required('Rôle requis'),
});

export type EditTenantUserFormValues = yup.InferType<typeof editTenantUserSchema>;
