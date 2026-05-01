// FR labels for plan feature keys. Used by the billing dashboard and any
// other admin view that surfaces a feature key.
export const FEATURE_LABEL: Record<string, string> = {
  max_users: 'Utilisateurs',
  max_drivers: 'Chauffeurs',
  max_orders_per_month: 'Commandes / mois',
  max_quotes_per_month: 'Devis / mois',
  max_invoices_per_month: 'Factures / mois',
  max_customers: 'Clients',
  max_vehicles: 'Véhicules',
  max_warehouses: 'Entrepôts',
  max_pricing_configs: 'Configurations tarifaires',
  max_prestations: 'Prestations',
  max_address_searches_per_month: 'Recherches adresse / mois',
  max_route_calculations_per_month: 'Calculs d’itinéraire / mois',
};

export const featureLabel = (key: string | null | undefined): string =>
  (key && FEATURE_LABEL[key]) || key || '—';
