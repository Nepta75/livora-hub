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
  vatNumber: yup.string().required('Numéro de TVA requis'),

  address: yup.object({
    name: yup.string().required('Libellé adresse requis'),
    streetNumber: yup.string().required('Numéro de rue requis'),
    street: yup.string().required('Rue requise'),
    postalCode: yup.string().required('Code postal requis'),
    city: yup.string().required('Ville requise'),
    country: yup.string().required('Pays requis'),
  }).required(),

  defaultBankDetail: yup.object({
    bankLabel: yup.string().required('Libellé requis'),
    bankName: yup.string().required('Nom de la banque requis'),
    accountHolderName: yup.string().required('Titulaire du compte requis'),
    iban: yup.string().required('IBAN requis').min(15, 'IBAN invalide').max(34, 'IBAN invalide'),
    bic: yup.string().required('BIC requis').min(8, 'BIC invalide').max(11, 'BIC invalide'),
    bankCode: yup.string().required('Code banque requis'),
    accountNumber: yup.string().required('Numéro de compte requis'),
  }).required(),
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
