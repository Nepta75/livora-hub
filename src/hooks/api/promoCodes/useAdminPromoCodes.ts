import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { promoCodesService } from '@/services/admin/promoCodesService';
import type {
  ICreatePromoCodeDto,
  ICreatePromoCodeRuleDto,
  IUpdatePromoCodeDto,
} from '@/types/generated/api-types';

export const PROMO_CODES_KEYS = {
  all: ['admin', 'promo-codes'] as const,
  redemptions: (promoCodeId: string) =>
    ['admin', 'promo-codes', promoCodeId, 'redemptions'] as const,
};

export function useAdminPromoCodes() {
  const { token } = useAuth();

  return useQuery({
    queryKey: PROMO_CODES_KEYS.all,
    queryFn: () => promoCodesService.getAll(token),
  });
}

export function useAdminPromoCodeRedemptions(promoCodeId: string | null) {
  const { token } = useAuth();

  return useQuery({
    queryKey: PROMO_CODES_KEYS.redemptions(promoCodeId ?? ''),
    // `enabled` short-circuits the call when promoCodeId is null, so the
    // non-null assertion is the React Query idiom.
    queryFn: () => promoCodesService.getRedemptions(promoCodeId!, token),
    enabled: !!promoCodeId,
  });
}

export function useCreateAdminPromoCode() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreatePromoCodeDto) => promoCodesService.create(data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROMO_CODES_KEYS.all });
    },
  });
}

export function useUpdateAdminPromoCode() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ promoCodeId, data }: { promoCodeId: string; data: IUpdatePromoCodeDto }) =>
      promoCodesService.update(promoCodeId, data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROMO_CODES_KEYS.all });
    },
  });
}

export function useArchiveAdminPromoCode() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promoCodeId: string) => promoCodesService.archive(promoCodeId, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROMO_CODES_KEYS.all });
    },
  });
}

export function useReactivateAdminPromoCode() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promoCodeId: string) => promoCodesService.reactivate(promoCodeId, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROMO_CODES_KEYS.all });
    },
  });
}

export function useDeleteAdminPromoCode() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promoCodeId: string) => promoCodesService.delete(promoCodeId, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROMO_CODES_KEYS.all });
    },
  });
}

export function useAddPromoCodeRule(promoCodeId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreatePromoCodeRuleDto) =>
      promoCodesService.addRule(promoCodeId, data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROMO_CODES_KEYS.all });
    },
  });
}

export function useRemovePromoCodeRule(promoCodeId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ruleId: string) => promoCodesService.removeRule(promoCodeId, ruleId, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROMO_CODES_KEYS.all });
    },
  });
}
