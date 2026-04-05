'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CookiesProvider, useCookies } from 'react-cookie';
import { toast } from 'sonner';
import { AuthContext } from '@/contexts/AuthContext';
import { getRolesFromToken, isTokenExpired, type HubUserRoles } from '@/utils/getRolesFromToken';
import { authService } from '@/services/auth/authService';

const HUB_TOKEN_COOKIE_NAME = 'hub_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </CookiesProvider>
  );
}

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies([HUB_TOKEN_COOKIE_NAME]);
  const [loading, setLoading] = useState(false);

  const rawToken: string = (cookies[HUB_TOKEN_COOKIE_NAME] as string | undefined) ?? '';

  const userRoles: HubUserRoles | null = useMemo(() => {
    if (!rawToken) return null;
    if (isTokenExpired(rawToken)) return null;
    return getRolesFromToken(rawToken);
  }, [rawToken]);

  useEffect(() => {
    if (rawToken && isTokenExpired(rawToken)) {
      removeCookie(HUB_TOKEN_COOKIE_NAME, { path: '/' });
    }
  }, [rawToken, removeCookie]);

  useEffect(() => {
    const handleAuthError = () => {
      removeCookie(HUB_TOKEN_COOKIE_NAME, { path: '/' });
      router.replace('/login');
    };

    document.addEventListener('auth-error', handleAuthError);
    return () => document.removeEventListener('auth-error', handleAuthError);
  }, [removeCookie, router]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      removeCookie(HUB_TOKEN_COOKIE_NAME, { path: '/' });

      try {
        const data = await authService.login(email, password);
        const token = data?.token;

        if (!token) {
          toast.error('Email ou mot de passe incorrect.');
          return;
        }

        const roles = getRolesFromToken(token);
        if (!roles?.hasHubAccess) {
          toast.error("Accès refusé. Vous n'avez pas les droits nécessaires.");
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as { exp: number };
        setCookie(HUB_TOKEN_COOKIE_NAME, token, {
          path: '/',
          expires: new Date(payload.exp * 1000),
        });

        window.location.href = '/';
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    },
    [setCookie],
  );

  const logout = useCallback(() => {
    removeCookie(HUB_TOKEN_COOKIE_NAME, { path: '/' });
    router.replace('/login');
  }, [removeCookie, router]);

  const value = useMemo(
    () => ({ token: rawToken, userRoles, loading, login, logout }),
    [rawToken, userRoles, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
