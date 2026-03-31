---
name: commit
description: Stage and commit changes with conventional commits format. Reads changed files before writing the message.
---

## Process

1. Run `git diff --staged` and `git diff` to see all changes
2. Run `git status` to identify untracked files
3. Read each modified file fully before writing the commit message
4. Stage relevant files
5. Write and commit with a conventional commits message

## Conventional Commits format

```
<type>[optional scope]: <description>

[optional body]
```

## Types and release impact

> This repo uses release-please. Wrong type = wrong version bump.

| Type | Release | Bump |
|---|---|---|
| `feat:` | YES | minor |
| `fix:` | YES | patch |
| `feat!:` / `BREAKING CHANGE:` | YES | major |
| `refactor:`, `chore:`, `docs:`, `ci:`, `test:` | no | — |

**Examples:**
```
feat(tenants): add edit and remove user actions on tenant detail page
fix(auth): remove token from React Query enabled condition to prevent hydration mismatch
refactor(hub): distinguish HubUser and User roles in sidebar
ci: add release-please workflow
```

## Rules

- English, lowercase, no trailing period, max 72 chars on first line
- Never use `--no-verify`
- No `console.log` in committed code
- Always add footer: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
