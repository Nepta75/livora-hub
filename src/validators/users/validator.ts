import * as yup from 'yup';
import type { HubUserRoles } from '@/types/generated/api-types';

const HUB_ROLE_VALUES: readonly HubUserRoles[] = ['ROLE_ADMIN', 'ROLE_MODERATOR'];

export const createUserSchema = yup.object({
  email: yup.string().required('Email requis').email('Email invalide'),
  firstName: yup.string().required('Prénom requis'),
  lastName: yup.string().required('Nom requis'),
  password: yup.string().required('Mot de passe requis').min(8, 'Minimum 8 caractères'),
  roles: yup
    .array(yup.string<HubUserRoles>().oneOf(HUB_ROLE_VALUES).required())
    .min(1, 'Au moins un rôle requis')
    .required(),
});

export const updateUserSchema = yup.object({
  email: yup.string().required('Email requis').email('Email invalide'),
  firstName: yup.string().required('Prénom requis'),
  lastName: yup.string().required('Nom requis'),
});

export const updatePasswordSchema = yup.object({
  password: yup.string().required('Mot de passe requis').min(8, 'Minimum 8 caractères'),
  confirmPassword: yup
    .string()
    .required('Confirmation requise')
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
});

export type CreateUserFormValues = yup.InferType<typeof createUserSchema>;
export type UpdateUserFormValues = yup.InferType<typeof updateUserSchema>;
export type UpdatePasswordFormValues = yup.InferType<typeof updatePasswordSchema>;
