# livora-hub — Admin Back Office

Next.js 14 (App Router) + Tailwind + shadcn/ui + React Hook Form + Yup + TanStack React Query v5.

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

## UI theme — action color palette

Icon actions and status badges across the hub share a single palette defined
in `src/lib/action-palette.ts` (`ACTION`, `STATUS_BADGE`, `CONFIRM_BUTTON`).
Import these tokens rather than hand-picking Tailwind classes — this is how
pages stay coherent as the hub grows.

| Intent | Token | Tailwind | Use for |
|---|---|---|---|
| Neutral | `ACTION.neutral` | `text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100` | Edit, open dialog, navigate, manage |
| Warning | `ACTION.warning` | `text-amber-600 hover:text-amber-700 hover:bg-amber-50` | Reversible deactivation (archive, disable) |
| Success | `ACTION.success` | `text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50` | Reactivate, enable, confirm |
| Destructive | `ACTION.destructive` | `text-red-600 hover:text-red-700 hover:bg-red-50` | Permanent delete |

Rules:
- **Archive ≠ Delete**: archive is reversible and uses the `warning` tone; hard delete uses `destructive` and must sit behind its own confirm dialog.
- **Status badges** use `STATUS_BADGE.active` / `STATUS_BADGE.inactive` (pill-shaped via the base Badge component's `rounded-full`).
- **Confirm dialogs** mirror the action tone — archive confirm uses `CONFIRM_BUTTON.warning`, delete uses shadcn `variant="destructive"`.
- Do not introduce a new color scale without updating `action-palette.ts` and this section together.

## Archive + delete pattern

Resources that can be temporarily disabled AND permanently removed (e.g. promo codes) expose **three** mutations and **three** buttons:

1. `archive` — `POST /{resource}/{id}/archive` → soft, reversible, flips `active=false`
2. `reactivate` — `POST /{resource}/{id}/reactivate` → reverses archive
3. `delete` — `DELETE /{resource}/{id}` → hard, removes DB row + external refs + provider-side objects

Do not reuse the HTTP `DELETE` verb for a soft archive — a dedicated `/archive` endpoint keeps the semantics honest and lets the same verb always mean "irreversible".
