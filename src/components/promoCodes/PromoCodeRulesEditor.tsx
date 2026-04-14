'use client';

import { useMemo, useState } from 'react';
import { Check, Package, Plus, Trash2 } from 'lucide-react';
import { useAdminPlans } from '@/hooks/api/plans/useAdminPlans';
import { ACTION } from '@/lib/action-palette';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  CreatePromoCodeRuleType,
  ICreatePromoCodeRuleDto,
} from '@/types/generated/api-types';

export interface EditorRule {
  /** Persisted UUID or draft id (`draft-xxx`). */
  id: string;
  type: string;
  value: { [key: string]: unknown };
}

interface PromoCodeRulesEditorProps {
  rules: EditorRule[];
  onAdd: (rule: ICreatePromoCodeRuleDto) => Promise<void> | void;
  onRemove: (id: string) => Promise<void> | void;
  isBusy?: boolean;
}

const RULE_TYPE_META: Record<CreatePromoCodeRuleType, { label: string; description: string }> = {
  ELIGIBLE_PLAN_IDS: {
    label: 'Plans éligibles',
    description: "Le code ne s'applique qu'aux plans sélectionnés.",
  },
};

function ruleTypeLabel(type: string): string {
  return RULE_TYPE_META[type as CreatePromoCodeRuleType]?.label ?? type;
}

export function PromoCodeRulesEditor({
  rules,
  onAdd,
  onRemove,
  isBusy = false,
}: PromoCodeRulesEditorProps) {
  const [ruleType, setRuleType] = useState<CreatePromoCodeRuleType>('ELIGIBLE_PLAN_IDS');
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data: plans } = useAdminPlans();

  const planNameById = useMemo(() => {
    const map: Record<string, string> = {};
    (plans ?? []).forEach((plan) => {
      map[plan.id] = plan.name;
    });
    return map;
  }, [plans]);

  function togglePlan(planId: string) {
    setSelectedPlanIds((prev) =>
      prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId],
    );
  }

  async function handleAdd() {
    setError(null);

    if (ruleType === 'ELIGIBLE_PLAN_IDS' && selectedPlanIds.length === 0) {
      setError('Sélectionne au moins un plan.');
      return;
    }

    await onAdd({
      type: ruleType,
      value: ruleType === 'ELIGIBLE_PLAN_IDS' ? { planIds: selectedPlanIds } : {},
    });
    setSelectedPlanIds([]);
  }

  return (
    <div className="space-y-3">
      {rules.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          Aucune règle. Le code est utilisable par tous les tenants.
        </div>
      ) : (
        <ul className="space-y-2">
          {rules.map((rule) => {
            const planIds = Array.isArray(rule.value?.planIds)
              ? (rule.value.planIds as string[])
              : [];

            return (
              <li
                key={rule.id}
                className="group flex items-start justify-between gap-3 rounded-md border bg-muted/30 p-3"
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge>{ruleTypeLabel(rule.type)}</Badge>
                  </div>
                  {rule.type === 'ELIGIBLE_PLAN_IDS' && (
                    <div className="flex flex-wrap gap-1.5">
                      {planIds.length === 0 ? (
                        <span className="text-xs text-muted-foreground">Aucun plan</span>
                      ) : (
                        planIds.map((id) => (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 rounded-full bg-background border px-2 py-0.5 text-xs"
                          >
                            <Package className="h-3 w-3" />
                            {planNameById[id] ?? id}
                          </span>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    ACTION.destructive,
                    'opacity-60 group-hover:opacity-100 transition-opacity',
                  )}
                  onClick={() => onRemove(rule.id)}
                  disabled={isBusy}
                  title="Supprimer"
                  aria-label="Supprimer la règle"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="rounded-md border p-4 space-y-3 bg-background">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Ajouter une règle</h4>
          {error && <span className="text-xs text-destructive">{error}</span>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ruleType">Type de règle</Label>
          <Select
            value={ruleType}
            onValueChange={(v) => {
              // Reset auxiliary state when switching rule type so stale input
              // from a previous type doesn't leak into the newly selected one.
              setRuleType(v as CreatePromoCodeRuleType);
              setSelectedPlanIds([]);
              setError(null);
            }}
          >
            <SelectTrigger id="ruleType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(RULE_TYPE_META) as [CreatePromoCodeRuleType, { label: string; description: string }][]).map(
                ([type, meta]) => (
                  <SelectItem key={type} value={type}>
                    {meta.label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {RULE_TYPE_META[ruleType]?.description}
          </p>
        </div>

        {ruleType === 'ELIGIBLE_PLAN_IDS' && (
          <div className="space-y-1.5">
            <Label>Plans</Label>
            {plans && plans.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {plans.map((plan) => {
                  const selected = selectedPlanIds.includes(plan.id);
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => togglePlan(plan.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors',
                        selected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-input bg-background hover:bg-muted',
                      )}
                    >
                      {selected ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Package className="h-3 w-3" />
                      )}
                      <span>{plan.name}</span>
                      <span className="text-muted-foreground">· {plan.type}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Aucun plan disponible.</p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="button" onClick={handleAdd} disabled={isBusy} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {isBusy ? 'Ajout...' : 'Ajouter'}
          </Button>
        </div>
      </div>
    </div>
  );
}
