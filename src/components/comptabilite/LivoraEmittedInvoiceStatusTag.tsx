import { Badge } from '@/components/ui/badge';
import { STATUS_BADGE } from '@/lib/action-palette';

/**
 * Where an EMITTED subscription invoice stands in its transmission to the platform, mirrored from the
 * backend EInvoiceStatusValueObject (the emitter side, as opposed to the received CTC lifecycle of
 * LivoraReceivedInvoiceStatusTag). An unknown or absent status renders NOTHING rather than asserting a
 * state we cannot name. A bare-XML fallback (the Factur-X PDF could not be rendered, so only the CII XML
 * was deposited) rides along as a second small badge. Same shadcn + action-palette idiom.
 */
interface EmittedState {
  label: string;
  badgeClass: string;
  tip: string;
}

const STATES: Record<string, EmittedState> = {
  not_required: {
    label: 'Non requise',
    badgeClass: STATUS_BADGE.inactive,
    tip: 'Pas de facture électronique (client sans SIRET, relève de l\'e-reporting).',
  },
  pending: {
    label: 'En attente',
    badgeClass: STATUS_BADGE.inactive,
    tip: 'En attente de transmission à la plateforme.',
  },
  transmitted: {
    label: 'Transmise',
    badgeClass: STATUS_BADGE.info,
    tip: 'Déposée sur la plateforme de facturation électronique.',
  },
  accepted: {
    label: 'Acceptée',
    badgeClass: STATUS_BADGE.active,
    tip: 'Acceptée par la plateforme ou le destinataire.',
  },
  rejected: {
    label: 'Rejetée',
    badgeClass: STATUS_BADGE.danger,
    tip: 'Rejetée par la plateforme ou le destinataire.',
  },
  undeliverable: {
    label: 'Non distribuée',
    badgeClass: STATUS_BADGE.warning,
    tip: 'La plateforme n\'a pas pu distribuer la facture.',
  },
  failed: {
    label: 'En échec',
    badgeClass: STATUS_BADGE.danger,
    tip: 'La transmission a échoué.',
  },
};

export function LivoraEmittedInvoiceStatusTag({
  status,
  bareXmlFallback,
}: {
  status?: string | null;
  bareXmlFallback?: boolean;
}) {
  const state = status ? STATES[status] : undefined;

  if (!state && !bareXmlFallback) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {state && (
        <Badge variant="outline" className={state.badgeClass} title={state.tip}>
          {state.label}
        </Badge>
      )}
      {bareXmlFallback && (
        <Badge
          variant="outline"
          className={STATUS_BADGE.warning}
          title="Transmise en XML CII seul : le PDF Factur-X n'a pas pu être produit."
        >
          XML seul
        </Badge>
      )}
    </div>
  );
}
