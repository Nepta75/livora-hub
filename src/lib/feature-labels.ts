import type { PlanFeatureKey } from '@/types/generated/api-types';

// The plan keys that carry a NUMBER (a quota), as opposed to the `can_*` booleans.
// Derived from the generated union rather than listed by hand, so a key added on the
// backend lands here on the next `yarn generate:api-types`.
type LimitFeatureKey = Extract<PlanFeatureKey, `max_${string}`>;

// FR labels for plan feature keys. Used by the billing dashboard and any
// other admin view that surfaces a feature key.
//
// A FULL Record, not a loose index signature: a missing key is a type-check failure,
// not an admin screen printing `max_customer_accounts` in raw snake_case. That is how
// max_customer_accounts and max_dispatch_sectors stayed unlabelled here and in the two
// vista-app copies of the same map.
export const FEATURE_LABEL: Record<LimitFeatureKey, string> = {
  max_users: 'Utilisateurs',
  max_drivers: 'Chauffeurs',
  max_orders_per_month: 'Commandes / mois',
  max_quotes_per_month: 'Devis / mois',
  max_invoices_per_month: 'Factures / mois',
  max_customers: 'Clients',
  max_customer_accounts: 'Accès clients',
  max_vehicles: 'Véhicules',
  max_warehouses: 'Entrepôts',
  max_pricing_configs: 'Configurations tarifaires',
  max_dispatch_sectors: 'Secteurs de dispatch',
  max_prestations: 'Prestations',
  max_address_searches_per_month: 'Recherches adresse / mois',
  max_route_calculations_per_month: 'Calculs d’itinéraire / mois',
};

export const featureLabel = (key: string | null | undefined): string =>
  (key && FEATURE_LABEL[key as LimitFeatureKey]) || key || '—';
