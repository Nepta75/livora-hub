'use client';

import type { IFeature, IPlanFeature } from '@/types/generated/api-types';

export interface PlanFeatureState {
  featureKey: string;
  featureType: string;
  limitValue: number;
  overageEnabled: boolean;
  overagePriceEuro: number | null;
  enabled: boolean;
}

const FEATURE_LABELS: Record<string, string> = {
  max_users: 'Utilisateurs max',
  max_drivers: 'Chauffeurs max',
  max_orders_per_month: 'Commandes / mois',
  max_quotes_per_month: 'Devis / mois',
  max_invoices_per_month: 'Factures / mois',
  max_customers: 'Clients max',
  max_vehicles: 'Véhicules max',
  max_warehouses: 'Entrepôts max',
  max_pricing_configs: 'Configs tarifs max',
  max_prestations: 'Prestations max',
  max_address_searches_per_month: 'Recherches adresse / mois',
  max_route_calculations_per_month: 'Calculs itinéraire / mois',
  can_create_quotes: 'Créer des devis',
  can_create_invoices: 'Créer des factures',
  can_use_dispatch: 'Dispatch',
  can_use_planning: 'Planning',
  can_use_messaging: 'Messagerie',
  can_manage_fleet: 'Gestion flotte',
  can_view_audit_logs: "Logs d'audit",
  can_use_api: 'Accès API',
  can_configure_stripe: 'Config Stripe',
  can_use_premium_address_search: 'Adresse premium',
  can_use_route_optimization: 'Optimisation itinéraires',
};

export function initFeaturesState(
  features: IFeature[],
  existingFeatures?: IPlanFeature[],
): PlanFeatureState[] {
  return features.map((feature) => {
    const existing = existingFeatures?.find((pf) => pf.feature?.key === feature.key);
    if (feature.type === 'boolean') {
      return {
        featureKey: feature.key,
        featureType: 'boolean',
        limitValue: 0,
        overageEnabled: false,
        overagePriceEuro: null,
        enabled: existing?.enabled ?? false,
      };
    }
    return {
      featureKey: feature.key,
      featureType: 'limit',
      limitValue: existing?.limitValue ?? 0,
      overageEnabled: existing?.overageEnabled ?? false,
      overagePriceEuro: existing?.overagePriceEuro ?? null,
      enabled: false,
    };
  });
}

export function buildPlanFeaturesPayload(planFeatures: PlanFeatureState[]) {
  return planFeatures.map((f) => ({
    featureKey: f.featureKey,
    enabled: f.featureType === 'boolean' ? f.enabled : undefined,
    limitValue: f.featureType === 'limit' ? f.limitValue : undefined,
    overageEnabled: f.overageEnabled,
    overagePriceEuro: f.overagePriceEuro ?? undefined,
  }));
}

interface PlanFeaturesEditorProps {
  value: PlanFeatureState[];
  onChange: (updated: PlanFeatureState[]) => void;
}

export function PlanFeaturesEditor({ value, onChange }: PlanFeaturesEditorProps) {
  function update(featureKey: string, patch: Partial<PlanFeatureState>) {
    onChange(value.map((f) => (f.featureKey === featureKey ? { ...f, ...patch } : f)));
  }

  const limits = value.filter((f) => f.featureType === 'limit');
  const booleans = value.filter((f) => f.featureType === 'boolean');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold mb-3">Limites</p>
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Feature</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground w-32">
                  Limite (-1 = ∞)
                </th>
                <th className="text-center px-3 py-2 font-medium text-muted-foreground w-24">
                  Dépassement
                </th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground w-32">
                  Prix dépassement (€)
                </th>
              </tr>
            </thead>
            <tbody>
              {limits.map((f) => (
                <tr key={f.featureKey} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {FEATURE_LABELS[f.featureKey] ?? f.featureKey}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={-1}
                      value={f.limitValue}
                      onChange={(e) =>
                        update(f.featureKey, {
                          limitValue: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full border rounded px-2 py-1 text-sm font-mono bg-background"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={f.overageEnabled}
                      onChange={(e) => update(f.featureKey, { overageEnabled: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="px-3 py-2">
                    {f.overageEnabled && (
                      <input
                        type="number"
                        min={0}
                        step="any"
                        value={f.overagePriceEuro ?? ''}
                        onChange={(e) =>
                          update(f.featureKey, {
                            overagePriceEuro:
                              e.target.value === '' ? null : parseFloat(e.target.value),
                          })
                        }
                        className="w-full border rounded px-2 py-1 text-sm font-mono bg-background"
                        placeholder="0.00"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-3">Fonctionnalités</p>
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Feature</th>
                <th className="text-center px-3 py-2 font-medium text-muted-foreground w-24">
                  Activé
                </th>
              </tr>
            </thead>
            <tbody>
              {booleans.map((f) => (
                <tr key={f.featureKey} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {FEATURE_LABELS[f.featureKey] ?? f.featureKey}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={f.enabled}
                      onChange={(e) => update(f.featureKey, { enabled: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
