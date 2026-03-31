import { jwtDecode } from 'jwt-decode';
import { ROLE_ADMIN, ROLE_MODERATOR } from '@/constants/roles';

interface TokenPayload {
  roles: string[];
  username: string;
  exp: number;
  iat: number;
}

export interface HubUserRoles {
  allRoles: string[];
  isAdmin: boolean;
  isModerator: boolean;
  hasHubAccess: boolean;
}

export function getRolesFromToken(token: string): HubUserRoles | null {
  try {
    const payload = jwtDecode<TokenPayload>(token);
    if (!payload?.roles) return null;

    const allRoles = payload.roles;
    const isAdmin = allRoles.includes(ROLE_ADMIN);
    const isModerator = allRoles.includes(ROLE_MODERATOR);
    const hasHubAccess = isAdmin || isModerator;

    return { allRoles, isAdmin, isModerator, hasHubAccess };
  } catch {
    return null;
  }
}

// Edge runtime safe version (no jwt-decode, for middleware)
export function getRolesFromTokenEdge(token: string): HubUserRoles | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as TokenPayload;
    if (!payload?.roles) return null;

    const allRoles = payload.roles;
    const isAdmin = allRoles.includes(ROLE_ADMIN);
    const isModerator = allRoles.includes(ROLE_MODERATOR);
    const hasHubAccess = isAdmin || isModerator;

    return { allRoles, isAdmin, isModerator, hasHubAccess };
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = jwtDecode<TokenPayload>(token);
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
