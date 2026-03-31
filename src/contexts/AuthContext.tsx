'use client';

import { createContext } from 'react';
import type { HubUserRoles } from '@/utils/getRolesFromToken';

export interface AuthContextValue {
  token: string;
  userRoles: HubUserRoles | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
