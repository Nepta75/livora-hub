---
name: hub-feature
description: Generate the full scaffold for a new hub feature in livora-hub — validator, service, hook, and component. Use when adding a new resource, a new action on an existing resource, or a new page in the admin back office.
---

You are generating a new feature in livora-hub (Next.js 14, React Query v5, Zod, TypeScript strict).

Before writing: read an existing feature in the same domain (e.g., `services/admin/userService.ts` + `hooks/api/users/`) for naming and structure conventions.

## Layer order — never skip a layer

```
httpClient → service → hook → component
```

1. **Validator** — `src/validators/{resource}/index.ts` — Zod schema + inferred type
2. **Service** — `src/services/admin/{resource}Service.ts` — calls `httpClient`, typed with generated API types
3. **Hook** — `src/hooks/api/{resource}/use{Resource}.ts` — React Query with `RESOURCE_KEYS`
4. **Component** — `src/components/{domain}/` — uses shadcn wrappers from `src/components/ui/`, never `@radix-ui` directly

## React Query hook pattern

```ts
export const RESOURCE_KEYS = {
  all: ['resource'] as const,
  list: () => ['resource', 'list'] as const,
  detail: (id: string) => ['resource', id] as const,
};
// Mutations invalidate RESOURCE_KEYS.all (broad)
```

## Permissions

- Check `userRoles?.isAdmin` for ROLE_ADMIN-only actions (create, delete)
- ROLE_MODERATOR gets read + update only — never show write actions to moderators

## After generating

- `yarn lint && yarn type-check`
- If API contract changed: `yarn generate:api-types` first
