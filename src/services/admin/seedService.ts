import { httpClient } from '@/services/http/httpClient';
import type { ITenant3 as ITenant, IUser } from '@/types/generated/api-types';

export interface SeedResult {
  tenant: ITenant;
  user: IUser;
  password: string;
}

/**
 * Optional overrides. A fixed `siretNumber` pins the seeded tenant's SIREN to a SUPER PDP sandbox company
 * number (e.g. "000000002"), which the normal create-tenant form can never accept (its first 9 digits
 * must pass Luhn). Empty fields keep the backend's timestamp-derived defaults.
 */
export interface SeedOptions {
  siretNumber?: string;
  name?: string;
}

export const seedService = {
  seed: (token: string, options: SeedOptions = {}) =>
    httpClient.post<SeedResult>('/seed', options, { token }),
};
