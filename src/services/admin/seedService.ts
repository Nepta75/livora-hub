import { httpClient } from '@/services/http/httpClient';
import type { ITenant, IUser } from '@/types/generated/api-types';

export interface SeedResult {
  tenant: ITenant;
  user: IUser;
  password: string;
}

export const seedService = {
  seed: (token: string) => httpClient.post<SeedResult>('/seed', {}, { token }),
};
