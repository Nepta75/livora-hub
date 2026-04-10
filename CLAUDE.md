# livora-hub — Admin Back Office

Next.js 14 (App Router) + Tailwind + shadcn/ui + React Hook Form + Zod + TanStack React Query v5.

## Rules
- Abstraction layer: tous les composants UI passent par `src/components/ui/` (wrappers shadcn)
- Ne jamais importer directement depuis @radix-ui — passer par les wrappers
- Service layer: httpClient → service → hook → composant (jamais fetch direct dans un composant)
- Types: toujours depuis `src/types/generated/api-types.ts`, jamais dupliqués manuellement
- English only for code comments
- No dead code, no unused imports
- Path aliases: toujours `@/` (jamais de chemins relatifs)

## Architecture
- `app/` — Pages (App Router, Server Components par défaut)
- `app/(hub)/` — Routes protégées par middleware (layout avec sidebar)
- `components/ui/` — Wrappers shadcn/ui (ne pas modifier directement)
- `components/layouts/` — Sidebar, layout components
- `components/{domain}/` — Composants spécifiques à un domaine
- `hooks/api/{resource}/` — React Query hooks par ressource
- `services/http/` — httpClient (admin) + authHttpClient (login)
- `services/admin/` — Services API par ressource
- `services/auth/` — Service login (/hub/login)
- `providers/` — AuthProvider, QueryProvider
- `contexts/` — AuthContext
- `validators/{resource}/` — Schémas Zod + types inférés
- `utils/` — getRolesFromToken, getRolesFromTokenEdge
- `constants/roles.ts` — ROLE_ADMIN, ROLE_MODERATOR

## Auth
- Token JWT stocké dans cookie `hub_token`
- Middleware vérifie ROLE_ADMIN | ROLE_MODERATOR (Edge runtime safe)
- AuthProvider gère login, logout, auto-logout sur 401
- Login via `/hub/login` (pas `/login` — endpoint hub séparé)
- httpClient appelle `${API_HOST}/admin${endpoint}`
- authHttpClient appelle `${API_HOST}${endpoint}` (pour /hub/login)

## Permissions front
- ROLE_ADMIN : accès complet (créer tenants, gérer users, voir roles)
- ROLE_MODERATOR : lecture + mise à jour users, pas de création de tenants
- Vérifier `userRoles?.isAdmin` dans les composants pour cacher les actions réservées admin

## Types
`yarn generate:api-types` — génère depuis `http://localhost:8000/api/doc.json`. See `/commit` and `/review` skills for when to run it.

## Quality gates
`yarn lint && yarn type-check`. See `/review` and `/commit` skills.
