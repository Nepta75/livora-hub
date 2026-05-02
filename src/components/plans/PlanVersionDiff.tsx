import { ArrowDown, ArrowUp, Check, X } from 'lucide-react';
import type { PlanVersionDiff } from '@/services/admin/planVersionsService';

type PlanVersionDiffEntry = NonNullable<PlanVersionDiff['favorableChanges']>[number];
import { Badge } from '@/components/ui/badge';

const FEATURE_LABELS: Record<string, string> = {
  monthly_price_euro: 'Prix mensuel (€)',
  annual_price_euro: 'Prix annuel (€)',
  trial_days: 'Jours d’essai',
};

function formatField(field: string): string {
  if (FEATURE_LABELS[field]) return FEATURE_LABELS[field];

  // feature.<key>.<sub>
  const featureMatch = field.match(/^feature\.(.+)\.(limit|enabled|overage_enabled|overage_price_euro|added|removed)$/);
  if (featureMatch) {
    const [, key, sub] = featureMatch;
    const niceKey = key.replace(/_/g, ' ');
    const subLabel: Record<string, string> = {
      limit: 'limite',
      enabled: 'activé',
      overage_enabled: 'dépassement activé',
      overage_price_euro: 'prix dépassement (€)',
      added: 'ajoutée',
      removed: 'supprimée',
    };
    return `${niceKey} — ${subLabel[sub] ?? sub}`;
  }

  return field;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (value === true) return 'oui';
  if (value === false) return 'non';
  if (typeof value === 'number') return value === -1 ? 'illimité' : String(value);
  if (typeof value === 'string') return value;
  // Feature add/remove summary objects come through as plain objects.
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function ChangeRow({ entry, tone }: { entry: PlanVersionDiffEntry; tone: 'favorable' | 'unfavorable' }) {
  const Icon = tone === 'favorable' ? ArrowDown : ArrowUp;
  const colorClass = tone === 'favorable' ? 'text-emerald-600' : 'text-amber-700';

  return (
    <li className="flex items-start gap-2 py-1.5 text-sm">
      <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${colorClass}`} />
      <div className="flex-1">
        <div className="font-medium text-zinc-900">{formatField(entry.field)}</div>
        <div className="text-xs text-zinc-500">
          {formatValue(entry.from)} → {formatValue(entry.to)}
        </div>
      </div>
    </li>
  );
}

interface Props {
  diff: PlanVersionDiff;
  emptyHint?: string;
}

export function PlanVersionDiffView({ diff, emptyHint }: Props) {
  if (!diff.hasChanges) {
    return (
      <p className="text-sm italic text-muted-foreground">
        {emptyHint ?? 'Aucune différence avec la version précédente.'}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {diff.favorableChanges.length > 0 && (
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Favorable au tenant
            </span>
            <Badge variant="secondary" className="font-mono text-xs">
              {diff.favorableChanges.length}
            </Badge>
          </div>
          <ul className="border-l-2 border-emerald-200 pl-3">
            {diff.favorableChanges.map((entry, idx) => (
              <ChangeRow key={`fav-${idx}-${entry.field}`} entry={entry} tone="favorable" />
            ))}
          </ul>
        </div>
      )}

      {diff.unfavorableChanges.length > 0 && (
        <div>
          <div className="mb-1 flex items-center gap-2">
            <X className="h-3.5 w-3.5 text-amber-700" />
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Défavorable au tenant
            </span>
            <Badge variant="secondary" className="font-mono text-xs">
              {diff.unfavorableChanges.length}
            </Badge>
          </div>
          <ul className="border-l-2 border-amber-200 pl-3">
            {diff.unfavorableChanges.map((entry, idx) => (
              <ChangeRow key={`unf-${idx}-${entry.field}`} entry={entry} tone="unfavorable" />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
