'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { IAuditLog } from '@/types/generated/api-types';
import { AUDIT_ACTION_CLASSNAME, AUDIT_ACTION_LABELS } from '@/lib/audit-actions';

function formatChangeValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function AuditLogChanges({ changes }: { changes: Record<string, unknown> }) {
  const entries = Object.entries(changes);
  if (entries.length === 0) {
    return <p className="text-xs text-muted-foreground">Aucun détail de champ</p>;
  }

  return (
    <ul className="mt-2 space-y-1 border-l-2 border-border pl-3">
      {entries.map(([field, delta]) => {
        const [oldVal, newVal] = Array.isArray(delta) ? delta : [undefined, delta];
        return (
          <li key={field} className="flex flex-wrap items-baseline gap-2 text-xs">
            <span className="font-semibold text-muted-foreground">{field}</span>
            <span className="text-red-600 line-through">{formatChangeValue(oldVal)}</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-emerald-700">{formatChangeValue(newVal)}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function AuditLogCard({ log }: { log: IAuditLog }) {
  const [expanded, setExpanded] = useState(false);
  const hasChanges = log.changes && Object.keys(log.changes).length > 0;
  const action = log.action;
  const date = log.createdAt ? new Date(log.createdAt).toLocaleString('fr-FR') : '—';
  // Read from the server, never recomposed here: `isImpersonated` alone is false on a direct
  // back-office write, and a second definition on this card is how the badge comes to disagree with
  // the filter that selects the same rows.
  const byHubAdmin = log.byLivora === true;

  return (
    <Card size="sm">
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          {action && (
            <span
              // Fallbacks, though the maps are total over `AuditLogAction`: the type is only true
              // once `yarn generate:api-types` has run here, and the API ships first by rule. In
              // that window a new verb arrives as a key neither map holds, and without these the
              // badge renders as an empty uncoloured pill, which is the very defect this map
              // closed. The tenant page's own row has always had the same `??`.
              className={`inline-flex h-5 items-center rounded-full border px-2.5 text-xs font-medium ${AUDIT_ACTION_CLASSNAME[action] ?? 'bg-zinc-100 text-zinc-700 border-zinc-200'}`}
            >
              {AUDIT_ACTION_LABELS[action] ?? action}
            </span>
          )}
          {log.entityType && (
            <Badge variant="outline" className="font-mono">
              {log.entityType}
            </Badge>
          )}
          {byHubAdmin && (
            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
              <ShieldCheck className="h-3 w-3" />
              {log.isImpersonated ? 'Via impersonation' : 'Via hub admin'}
            </Badge>
          )}
          <span className="ml-auto text-xs text-muted-foreground">{date}</span>
        </div>

        <p className="mt-2 text-sm font-medium">{log.message ?? '—'}</p>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {log.userEmail && <span>{log.userEmail}</span>}
          {log.isImpersonated && log.impersonatedByEmail && (
            <span className="text-amber-700">Accès par {log.impersonatedByEmail}</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          Détails
        </button>

        {expanded && (
          <div className="mt-2">
            {hasChanges ? (
              <AuditLogChanges changes={log.changes as Record<string, unknown>} />
            ) : (
              <p className="text-xs text-muted-foreground">Aucun détail de champ</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
