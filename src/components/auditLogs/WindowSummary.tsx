/**
 * What a windowed journal is showing, and what it is leaving out.
 *
 * Every audit list in the hub asks the server for one window and renders exactly what comes back,
 * so without this line each of them reads as an exhaustive answer while being a page of one. Debts
 * 41 and 45 of MULTI_TENANT_AUDIT.md, which are the same defect on two registers. The total is
 * served by the API under the same predicate as the listing and is never recomputed here.
 *
 * `label` is the FULL noun phrase, participle included ("écritures affichées"), because the
 * agreement follows the noun the caller passes and a participle frozen in the template gets it
 * wrong on the first feminine one.
 */
export function WindowSummary({
  shown,
  total,
  label,
}: {
  shown: number;
  total: number;
  label: string;
}) {
  // Nothing left out, nothing to warn about: the list below IS the answer.
  if (shown >= total) {
    return null;
  }

  return (
    <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">
      {shown} {label} sur {total}, les plus récents en premier
    </p>
  );
}
