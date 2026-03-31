import { authHttpClient } from '@/services/http/authHttpClient';

interface LoginResponse {
  token: string;
}

export const authService = {
  login: (email: string, password: string) =>
    authHttpClient.post<LoginResponse>('/hub/login', { email, password }),
};
