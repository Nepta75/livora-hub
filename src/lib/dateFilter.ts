/**
 * What an `<input type="date">` can actually show.
 *
 * The API refuses a date filter it cannot parse instead of dropping it (debt 60 of
 * `api-vista-app/MULTI_TENANT_AUDIT.md`), so a bad value in the URL is a 400 rather than a listing
 * that quietly answers for everything. That exposed a client-side defect the hub carries too: **an
 * `<input type="date">` silently replaces a value it cannot represent with the empty string**,
 * without firing a change event. So `?dateFrom=2026-02-30` renders an EMPTY field while the filter
 * state still holds the bad value, and every subsequent edit writes it straight back into the URL.
 * The journal then answers 400 for ever, and this screen rendered its empty state on that.
 *
 * ⚠️ This is NOT a validation and not the mirror of the server's parser. It answers one narrow
 * question: can the field the user is about to edit render this string. The round trip is what
 * rules out a well-formed day that does not exist, `2026-02-30` passing the shape while `Date.UTC`
 * rolls it to March 2nd exactly as `createFromFormat` does server-side. Deliberately a copy of
 * `vista-app/src/utils/dateFilter.ts` rather than a shared package: the two repositories share no
 * build, and a fourth copy of a shape regex is what debt 56 was about, so the duplication is
 * bounded to one function whose test is duplicated with it.
 */
export function isDisplayableDay(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (null === match) {
    return false;
  }

  const [, year, month, day] = match;
  const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  return parsed.toISOString().slice(0, 10) === value;
}
