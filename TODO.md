# livora-hub — Todo

## Features manquantes

### Utilisateurs hub
- [x] **Edition des rôles** — `PATCH /admin/user/{id}/roles` + section Select sur `/users/[id]`
- [x] **Confirmation avant suppression** — Dialog de confirmation avant suppression

### Tenants
- [ ] **Mise à jour d'un tenant** — la page `/tenants/[id]` est read-only, pas de formulaire d'édition
- [ ] **Retirer un utilisateur d'un tenant** — la liste des users du tenant n'a aucune action (lecture seule)

### Dashboard
- [x] **Stats réelles** — counts live depuis les hooks useAdminUsers / useAdminTenants

### CI/CD
- [ ] **Workflow deploy preprod** — le CI pousse l'image `:preprod` mais ne déclenche pas le deploy sur le VPS (pas de `deploy.yml`)
