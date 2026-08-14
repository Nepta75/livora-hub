import type { AuditLogAction } from '@/types/generated/api-types';

/**
 * How an audit verb is named and coloured, once for the whole hub.
 *
 * There were three copies of this before: the card of the `/logs` screen, the tenant page's own
 * map, and the filter's option list. Each held a different subset, so the same PLAN_CHANGE row
 * rendered with a label on one screen, with an empty badge on another, and could not be picked in
 * the filter at all. Debt 43 of MULTI_TENANT_AUDIT.md.
 *
 * `Record<AuditLogAction, ...>` and NOT a Partial: the type is generated from the server's
 * `AuditLogActionValueObject`, so a verb added there fails the build here until it is named. That
 * is the only mechanism there is, since the API cannot test a front end in another repository, and
 * the failure it replaces is silent, a badge that renders empty.
 *
 * Wording is identical to vista-app's map. The carrier and Livora read the same rows, and a row
 * that changes name depending on who is looking is a support call.
 */
export const AUDIT_ACTION_LABELS: Record<AuditLogAction, string> = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
  CUSTOMER_ACCESS_GRANTED: 'Mise en compte',
  QUOTE_OTP_SPENT: 'Code de signature renvoyé',
  QUOTE_OTP_LOCKED: 'Signature bloquée',
  PLAN_CHANGE: 'Changement de plan',
  PLAN_CHANGE_SCHEDULED: 'Changement de plan programmé',
  UPDATE_PAYMENT_METHOD: 'Moyen de paiement modifié',
  TRIAL_EXTENDED: 'Essai prolongé',
  OVERAGE_INVOICE_CREATED: 'Facture de dépassement',
  EMBEDDED_AUTH_CAPTURE_TOGGLED: 'Réservation avant débit',
  TAX_DELTA: 'Écart de TVA détecté',
  DOWNLOAD: 'Document téléchargé',
  REPLACE_PROMO: 'Code promo remplacé',
  EXPORT: 'Export comptable',
  OVERAGE_CAP_HIT: 'Plafond de dépassement atteint',
  RETENTION_PURGED: 'Purge de rétention',
  DEVTOOLS_ADVANCE_BILLING: 'Outil dev, avance facturation',
  DEVTOOLS_OVERAGE_INVOICES: 'Outil dev, factures de dépassement',
};

/**
 * Badge tone per verb. Three families: what happened to data (emerald / blue / red), what touches
 * money or an entitlement (sky), and what is an alert someone has to act on (amber, red).
 * Neutral is the fourth family, for rows nobody has to act on: the dev-tools verbs, which are noise
 * on a real environment and a signal only on the one where they were run, and the retention sweep,
 * which is the system doing exactly its job.
 */
export const AUDIT_ACTION_CLASSNAME: Record<AuditLogAction, string> = {
  CREATE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  UPDATE: 'bg-blue-100 text-blue-800 border-blue-200',
  DELETE: 'bg-red-100 text-red-800 border-red-200',
  CUSTOMER_ACCESS_GRANTED: 'bg-amber-100 text-amber-800 border-amber-200',
  QUOTE_OTP_SPENT: 'bg-amber-100 text-amber-800 border-amber-200',
  QUOTE_OTP_LOCKED: 'bg-red-100 text-red-800 border-red-200',
  PLAN_CHANGE: 'bg-sky-100 text-sky-800 border-sky-200',
  PLAN_CHANGE_SCHEDULED: 'bg-sky-100 text-sky-800 border-sky-200',
  UPDATE_PAYMENT_METHOD: 'bg-sky-100 text-sky-800 border-sky-200',
  TRIAL_EXTENDED: 'bg-sky-100 text-sky-800 border-sky-200',
  OVERAGE_INVOICE_CREATED: 'bg-amber-100 text-amber-800 border-amber-200',
  EMBEDDED_AUTH_CAPTURE_TOGGLED: 'bg-sky-100 text-sky-800 border-sky-200',
  TAX_DELTA: 'bg-red-100 text-red-800 border-red-200',
  DOWNLOAD: 'bg-sky-100 text-sky-800 border-sky-200',
  REPLACE_PROMO: 'bg-sky-100 text-sky-800 border-sky-200',
  EXPORT: 'bg-sky-100 text-sky-800 border-sky-200',
  OVERAGE_CAP_HIT: 'bg-amber-100 text-amber-800 border-amber-200',
  // Neutral, not an alert: the sweep deleting what aged out is the system working. And absence is
  // not the signal it looks like, so no badge is missing here: a sweep that never ran writes
  // nothing, and neither does one that found nothing old enough, which is the ordinary state until
  // the oldest row reaches twelve months.
  RETENTION_PURGED: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  DEVTOOLS_ADVANCE_BILLING: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  DEVTOOLS_OVERAGE_INVOICES: 'bg-zinc-100 text-zinc-700 border-zinc-200',
};

/** The verbs a filter can offer, derived so a new one shows up without a second edit. */
export const AUDIT_ACTION_OPTIONS: Array<{ value: AuditLogAction; label: string }> = (
  Object.keys(AUDIT_ACTION_LABELS) as AuditLogAction[]
).map(value => ({ value, label: AUDIT_ACTION_LABELS[value] }));

/**
 * Whether a string read back from the URL is a verb the API knows.
 *
 * Derived from the map rather than spelled out: the hand-written version listed the three lifecycle
 * verbs, so a `?action=PLAN_CHANGE` link, which is the kind one pastes into a support thread, was
 * silently dropped and the screen answered as if no filter had been asked for.
 */
export function isAuditLogAction(value: string): value is AuditLogAction {
  return Object.prototype.hasOwnProperty.call(AUDIT_ACTION_LABELS, value);
}
