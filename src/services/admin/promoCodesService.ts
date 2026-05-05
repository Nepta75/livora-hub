import { httpClient } from '@/services/http/httpClient';
import type {
  GetAdminPromoCodeRedemptionsResponse,
  ICreatePromoCodeDto,
  ICreatePromoCodeRuleDto,
  IPromoCodeDto,
  IUpdatePromoCodeDto,
} from '@/types/generated/api-types';

export const promoCodesService = {
  getAll: (token: string) => httpClient.get<IPromoCodeDto[]>('/promo-code', { token }),

  getRedemptions: (promoCodeId: string, token: string) =>
    httpClient.get<GetAdminPromoCodeRedemptionsResponse>(
      `/promo-code/${promoCodeId}/redemptions`,
      { token },
    ),

  create: (data: ICreatePromoCodeDto, token: string) =>
    httpClient.post<IPromoCodeDto>('/promo-code', data, { token }),

  update: (promoCodeId: string, data: IUpdatePromoCodeDto, token: string) =>
    httpClient.patch<IPromoCodeDto>(`/promo-code/${promoCodeId}`, data, { token }),

  archive: (promoCodeId: string, token: string) =>
    httpClient.post<IPromoCodeDto>(`/promo-code/${promoCodeId}/archive`, {}, { token }),

  reactivate: (promoCodeId: string, token: string) =>
    httpClient.post<IPromoCodeDto>(`/promo-code/${promoCodeId}/reactivate`, {}, { token }),

  delete: (promoCodeId: string, token: string) =>
    httpClient.delete(`/promo-code/${promoCodeId}`, { token }),

  addRule: (promoCodeId: string, data: ICreatePromoCodeRuleDto, token: string) =>
    httpClient.post<IPromoCodeDto>(`/promo-code/${promoCodeId}/rule`, data, { token }),

  removeRule: (promoCodeId: string, ruleId: string, token: string) =>
    httpClient.delete<IPromoCodeDto>(`/promo-code/${promoCodeId}/rule/${ruleId}`, { token }),
};

const PROMO_ERROR_FR: Record<string, string> = {
  promo_unsynced_plan:
    'Un plan référencé par les règles n’est pas synchronisé avec Stripe (stripeProductId manquant). Synchronise le plan avant d’associer le code.',
  promo_not_eligible_for_plan:
    'Ce code promo n’est pas éligible pour l’offre sélectionnée.',
  promo_unsynced:
    'Code promo en cours d’activation chez Stripe. Réessaie dans quelques instants.',
  promo_invalid: 'Code promo invalide ou désactivé.',
  promo_expired: 'Code promo expiré.',
  promo_exhausted: 'Code promo épuisé (toutes les redémptions sont prises).',
};

const FALLBACK_MESSAGE = 'Une erreur est survenue. Réessaie ou contacte le support.';

/**
 * Maps a backend error (typed `InvalidJsonException` payload OR raw
 * `RuntimeException` message string from `StripePaymentProvider`) to a
 * French toast. The Stripe sync path throws strings prefixed with the
 * typed code; we strip the prefix and translate.
 */
export function mapPromoCodeError(error: unknown): string {
  if (!(error instanceof Error)) return FALLBACK_MESSAGE;

  const message = error.message ?? '';

  for (const [code, copy] of Object.entries(PROMO_ERROR_FR)) {
    if (message.includes(code)) return copy;
  }

  return message || FALLBACK_MESSAGE;
}
