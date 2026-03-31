import * as yup from 'yup';

export const registerInitSchema = yup.object({
  email: yup.string().required('Email requis').email('Email invalide'),
});

export type RegisterInitFormValues = yup.InferType<typeof registerInitSchema>;

export const registerConfirmSchema = yup.object({
  otp: yup.string().required('Code requis').length(6, 'Le code doit contenir 6 chiffres'),
  password: yup.string().required('Mot de passe requis').min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: yup.string().required('Prénom requis'),
  lastName: yup.string().required('Nom requis'),
});

export type RegisterConfirmFormValues = yup.InferType<typeof registerConfirmSchema>;
