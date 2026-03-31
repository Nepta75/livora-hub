import { authHttpClient } from '@/services/http/authHttpClient';

export const registerService = {
  init: (email: string) => authHttpClient.post<void>('/hub/register/init', { email }),

  confirm: (payload: {
    email: string;
    otp: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => authHttpClient.post<void>('/hub/register/confirm', payload),
};
