import { Badge } from '@/components/ui/badge';
import { STATUS_BADGE } from '@/lib/action-palette';

/**
 * Where a received supplier invoice stands in its CTC lifecycle, mirrored from the backend
 * EInvoiceLifecycleStatusValueObject (the buyer side). The ingested status is read straight off the
 * platform's events, so any of the nine can land here and none must render as a blank cell. An unknown
 * (future) or absent status renders NOTHING rather than asserting a state we cannot name. Mirror of
 * vista-app's ReceivedInvoiceStatusTag, in the hub's shadcn + action-palette idiom.
 */
interface ReceivedState {
  label: string;
  badgeClass: string;
  tip: string;
}

const STATES: Record<string, ReceivedState> = {
  submitted: {
    label: 'En cours',
    badgeClass: STATUS_BADGE.inactive,
    tip: 'Déposée sur la plateforme, en cours de traitement.',
  },
  delivered: {
    label: 'Mise à disposition',
    badgeClass: STATUS_BADGE.info,
    tip: 'Mise à disposition de Livora par la plateforme.',
  },
  received: {
    label: 'Reçue',
    badgeClass: STATUS_BADGE.info,
    tip: 'Reçue via la plateforme de facturation électronique.',
  },
  accepted: {
    label: 'Acceptée',
    badgeClass: STATUS_BADGE.active,
    tip: 'Livora a accepté cette facture.',
  },
  refused: {
    label: 'Refusée',
    badgeClass: STATUS_BADGE.danger,
    tip: 'Livora a refusé cette facture.',
  },
  disputed: {
    label: 'En litige',
    badgeClass: STATUS_BADGE.warning,
    tip: 'Facture signalée en litige.',
  },
  paid: {
    label: 'Payée',
    badgeClass: STATUS_BADGE.active,
    tip: 'Signalée comme payée.',
  },
  rejected: {
    label: 'Rejetée',
    badgeClass: STATUS_BADGE.danger,
    tip: 'Rejetée par la plateforme.',
  },
  routing_error: {
    label: 'Erreur de routage',
    badgeClass: STATUS_BADGE.warning,
    tip: 'Erreur de routage sur la plateforme.',
  },
};

export function LivoraReceivedInvoiceStatusTag({ status }: { status?: string | null }) {
  if (!status) {
    return null;
  }

  const state = STATES[status];

  if (!state) {
    return null;
  }

  return (
    <Badge variant="outline" className={state.badgeClass} title={state.tip}>
      {state.label}
    </Badge>
  );
}
