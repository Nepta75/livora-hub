export const ROLE_ADMIN = 'ROLE_ADMIN';
export const ROLE_MODERATOR = 'ROLE_MODERATOR';

export const HUB_ROLES = [
  { value: ROLE_ADMIN, label: 'Admin' },
  { value: ROLE_MODERATOR, label: 'Modérateur' },
] as const;

export type HubRole = (typeof HUB_ROLES)[number]['value'];
