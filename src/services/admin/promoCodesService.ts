import { httpClient } from '@/services/http/httpClient';
import type {
  ICreatePromoCodeDto,
  ICreatePromoCodeRuleDto,
  IPromoCodeDto,
} from '@/types/generated/api-types';

export const promoCodesService = {
  getAll: (token: string) => httpClient.get<IPromoCodeDto[]>('/promo-code', { token }),

  create: (data: ICreatePromoCodeDto, token: string) =>
    httpClient.post<IPromoCodeDto>('/promo-code', data, { token }),

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
