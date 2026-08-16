# livora-hub — Admin Back Office

Next.js 14 (App Router) + Tailwind + shadcn/ui + React Hook Form + Yup + TanStack React Query v5.

## ⚠️ Ce dépôt n'a AUCUN runner de test

Ni jest, ni vitest, ni un seul fichier de test. Ce qui garde le hub est `yarn type-check` plus
`yarn lint` : les types et le style, **aucun comportement**. Une fonction juste et une fonction
fausse passent les mêmes portes.

Conséquence pratique : tout ce qui porte une règle ici est tenu par la relecture seule. Trois choses
en dépendent aujourd'hui, dont `src/lib/dateFilter.ts`, dont le jumeau de vista-app est couvert par
un test avec son mutant joué. C'est la **dette 64** de `../api-vista-app/TECH_DEBT.md`, qui est la
liste canonique unique des dettes ouvertes des trois dépôts. Ce n'est pas « le hub n'est pas testé »,
c'est « le hub ne peut pas l'être » : il manque une infrastructure, pas un test.

## Rules
- Abstraction layer: tous les composants UI passent par `src/components/ui/` (wrappers shadcn)
- Ne jamais importer directement depuis @radix-ui — passer par les wrappers
- Service layer: httpClient → service → hook → composant (jamais fetch direct dans un composant)
- Types: toujours depuis `src/types/generated/api-types.ts`, jamais dupliqués manuellement
- English only for code comments
- No dead code, no unused imports
- Path aliases: toujours `@/` (jamais de chemins relatifs)
- Pas d'em-dash (`—`) dans le code, virgule ou point à la place. Placeholder `'—'` de cellule vide OK.

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
- **Status badges** use `STATUS_BADGE.active` (emerald) / `STATUS_BADGE.inactive` (zinc) / `STATUS_BADGE.warning` (amber, "approaching limit") / `STATUS_BADGE.danger` (red, "over limit / failed billing") / `STATUS_BADGE.info` (sky), pill-shaped via the base Badge component's `rounded-full`.
- **Confirm dialogs** mirror the action tone — archive confirm uses `CONFIRM_BUTTON.warning`, delete uses shadcn `variant="destructive"`.
- Do not introduce a new color scale without updating `action-palette.ts` and this section together.

## API errors — never display `err.message` raw

`httpClient` throws an `HttpError` whose `message` has already been resolved by
`readableMessage` (`src/services/http/httpClient.ts`), and `body` carries the raw
payload. Resolve, never re-derive.

**Why it needs resolving at all.** `InvalidJsonException` is what the API raises
for every refusal a screen can act on, and it builds its message as
`"<Class> invalid json"` — an internal PHP class name, in English. The meaning is
in `fields[]`, which is either a list of `{field: code}` objects or a flat list of
strings depending on the service that threw. `readableMessage` reads a known code
first, then the raw field value, then the top-level message unless it is that
wrapper.

- **A new typed backend code gets its French copy in `CODE_TO_FR`**, in
  `httpClient.ts`, and nowhere else. `promoCodesService.ts` still carries its own
  `PROMO_ERROR_FR` matching on the message; it works because the raw field value
  now reaches the message, and it is the copy that should move here, not the
  reverse.
- **A toast may show `err.message` directly**, since it is resolved. What it must
  not do is read `body.message`.
- This repo has no test harness at all (no jest, no vitest), so nothing here is
  pinned by a test. `vista-app` mirrors this resolution in
  `src/services/http/apiErrorMessage.ts`, which IS pinned, and the two are meant
  to stay recognisably the same shape.

## Subscription billing UI

The admin subscription surface (`/tenants/[id]` + plan-change dialog) reads
the same `PlanChangePreview` contract as the tenant app. Behaviour rules,
the four plan-change directions, VAT model, and the Stripe Dahlia field
quirks live in **`../api-vista-app/BILLING_WORKFLOW.md`** — read that
before changing the dialog, preview card, cancel banner, or any other
subscription UI.

Key hub-specific points:
- `ChangePlanDialog.tsx` exposes a **"Mode avancé"** that lets admins override `prorationBehavior` (`create_prorations` / `always_invoice` / `none`) and bypass the annual→monthly engagement gate via type-to-confirm `ROMPRE` (sends `force=true` to the backend).
- `PlanChangePreviewCard.tsx` renders two variants driven by `preview.scheduledAt`: scheduled-downgrade (sky-blue info card with HT + TTC) vs immediate-swap (HT + TTC + per-line proration toggle).
- The pending-change banner on the tenant detail page lets the admin cancel a queued schedule (`DELETE /admin/tenant/{id}/subscription/pending-change`); the same endpoint clears `Subscription.pending_*` fields in the same transaction as the Stripe schedule release.

## Listing pages — server-side pagination + search

Listing pages backed by a paginated endpoint (`/tenants`, `/users`) share
three primitives — reuse them, do not re-roll per page:

- `useListingState()` (`src/hooks/`) — reads/writes `?search=` + `?page=` in
  the URL (the single source of truth). Page is 1-indexed in the URL,
  0-indexed in code. Requires a `<Suspense>` boundary (`useSearchParams`).
- `SearchInput` (`src/components/listing/`) — debounced search field; keeps a
  local draft so typing stays snappy while the URL write is debounced 300ms.
- `ListingPagination` (`src/components/listing/`) — result count + prev/next.

The matching list hooks (`useAdminTenantList`, `useAdminUserList`) hit
`{data, total}` endpoints and use `placeholderData: prev => prev` so the
table doesn't flash empty between pages. Page size constants live next to
the hook (`TENANTS_PAGE_SIZE`, `HUB_USERS_PAGE_SIZE`).

**Journal screens say what they are leaving out.** The three audit routes (`/logs`, the tenant
page's "Actions de Livora" section and its access register, plus a plan's history card) answer
`{data, total}`, and the total comes from the server under the same filters as the listing, never
recomputed on the front. `WindowSummary` in `tenants/[id]/page.tsx` renders the notice and returns
null when nothing is truncated. `useAdminAuditLogs` paginates against that total rather than against
"did this page come back full", which could not tell a last full page from an exhausted feed. The
access register's badge counts **arrivals on the tenant, not sessions**: one impersonation journey
writes a row per tenant it visits and nothing correlates the rows of one journey.

**Saying what is left out and reaching it are two halves.** Since 2026-08-14 all five windowed
journals paginate: `/logs`, a plan's history, and the tenant page's three (the access register,
"Actions de Livora", and the per-session drill-down), each a `useInfiniteQuery` behind the shared
`LoadMoreRows` beside `WindowSummary`. The stop rule is written twice, inline in `useAdminAuditLogs`
and as `nextWindow` in `useAdminTenants`, and that repetition is deliberate rather than a missing
abstraction. ⚠️ **It keeps TWO stop conditions and the total is not enough on its own**: the listing
and the count are separate queries, so an empty window beside a higher count (concurrent write, seed
purge under the read) would leave `loaded` frozen, hand back the same `pageParam`, and react-query
appends rather than dedupes, refetching the same empty window for ever. Three more rules fall out:
the window is NOT part of the query key (one entry per "Charger plus" means pages that never
accumulate), the total displayed is the **last** page's (a purge under the read would otherwise
render "100 affichés sur 60"), and a page size may never exceed the route's `MAX_LIMIT` of 100,
since a silently clamped `limit` makes the first page look short and stops the paging dead.

**Audit verb labels live in `src/lib/audit-actions.ts`, once.** There were three copies before
(the `/logs` card, the tenant page, the filter's options), each with a different subset, so the same
row was labelled on one screen and blank on another. The maps are `Record<AuditLogAction, ...>` and
NOT partial on purpose: a verb added to the API's `AuditLogActionValueObject` fails `yarn type-check`
here until it is named, which is the only mechanism there is across two repositories. Wording is
kept identical to vista-app's map, since the carrier and Livora read the same rows.

**Tenant pickers** (e.g. `PromoCodeRulesEditor`) need the *full* tenant list,
not a page — they use `useAdminTenants()`, which now hits
`GET /admin/tenant/options` (lightweight `{id, name}[]`). The paginated
`GET /admin/tenant` is for the listing only.

## Archive + delete pattern

Resources that can be temporarily disabled AND permanently removed (e.g. promo codes) expose **three** mutations and **three** buttons:

1. `archive` — `POST /{resource}/{id}/archive` → soft, reversible, flips `active=false`
2. `reactivate` — `POST /{resource}/{id}/reactivate` → reverses archive
3. `delete` — `DELETE /{resource}/{id}` → hard, removes DB row + external refs + provider-side objects

Do not reuse the HTTP `DELETE` verb for a soft archive — a dedicated `/archive` endpoint keeps the semantics honest and lets the same verb always mean "irreversible".

## Dispatch engine reference

The route optimization engine lives in the backend; its canonical spec is
`../api-vista-app/DISPATCH_ALGORITHM.md`. The hub `/dev-tools` driver
simulation and tenant seed exercise it end-to-end. Read that doc before
changing anything that feeds or reads dispatch tours/suggestions from the hub.
