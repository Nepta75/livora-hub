'use client';

import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useUpdateAdminPromoCode } from '@/hooks/api/promoCodes/useAdminPromoCodes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { IPromoCodeDto, IUpdatePromoCodeDto } from '@/types/generated/api-types';

const editPromoCodeSchema = yup.object({
  maxRedemptions: yup
    .number()
    .nullable()
    .transform((value, original) => (original === '' || Number.isNaN(value) ? null : value))
    .min(1, 'Doit être >= 1'),
  expiresAt: yup
    .string()
    .nullable()
    .transform((value, original) => (original === '' ? null : value)),
});

type EditFormValues = yup.InferType<typeof editPromoCodeSchema>;

function toDateInputValue(iso?: string | null): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

interface EditPromoCodeDialogProps {
  promoCode: IPromoCodeDto | null;
  onOpenChange: (open: boolean) => void;
}

export function EditPromoCodeDialog({ promoCode, onOpenChange }: EditPromoCodeDialogProps) {
  const updateMutation = useUpdateAdminPromoCode();

  const hadMaxRedemptions = (promoCode?.maxRedemptions ?? null) !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: yupResolver(editPromoCodeSchema) as unknown as Resolver<EditFormValues>,
  });

  useEffect(() => {
    if (promoCode) {
      reset({
        maxRedemptions: promoCode.maxRedemptions ?? null,
        expiresAt: toDateInputValue(promoCode.expiresAt),
      });
    }
  }, [promoCode, reset]);

  const onSubmit = async (values: EditFormValues) => {
    if (!promoCode) return;

    // Stripe does not allow unsetting max_redemptions once set — enforce here.
    if (hadMaxRedemptions && values.maxRedemptions == null) {
      toast.error(
        'Le nombre max de redemptions ne peut pas être retiré une fois défini (contrainte Stripe). Augmentez-le à la place.'
      );
      return;
    }

    const payload: IUpdatePromoCodeDto = {};

    // maxRedemptions: compare against original, send explicit null if cleared (only reachable when not previously set)
    const newMax = values.maxRedemptions ?? null;
    const oldMax = promoCode.maxRedemptions ?? null;
    if (newMax !== oldMax) {
      payload.maxRedemptions = newMax;
    }

    // expiresAt: compare against original, send explicit null to clear
    const newExpiry = values.expiresAt ?? null;
    const oldExpiry = toDateInputValue(promoCode.expiresAt) || null;
    if (newExpiry !== oldExpiry) {
      payload.expiresAt = newExpiry
        ? new Date(newExpiry + 'T23:59:59.999Z').toISOString()
        : null;
    }

    if (Object.keys(payload).length === 0) {
      onOpenChange(false);
      return;
    }

    try {
      await updateMutation.mutateAsync({ promoCodeId: promoCode.id, data: payload });
      toast.success(`Code "${promoCode.code}" mis à jour`);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    }
  };

  return (
    <Dialog open={promoCode !== null} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Modifier {promoCode?.code}</DialogTitle>
          <DialogDescription>
            Seuls le nombre max de redemptions et la date d&rsquo;expiration sont modifiables. Le
            code, la réduction et la durée sont figés par Stripe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="edit-maxRedemptions">Redemptions max</Label>
            <Input
              id="edit-maxRedemptions"
              type="number"
              min={1}
              {...register('maxRedemptions')}
              placeholder="Illimité si vide"
            />
            {hadMaxRedemptions && (
              <p className="text-xs text-muted-foreground">
                Une fois défini, ne peut pas être retiré (contrainte Stripe). Vous pouvez
                l&rsquo;augmenter.
              </p>
            )}
            {errors.maxRedemptions && (
              <p className="text-sm text-destructive">{errors.maxRedemptions.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-expiresAt">Expire le</Label>
            <Input id="edit-expiresAt" type="date" {...register('expiresAt')} />
            <p className="text-xs text-muted-foreground">
              Videz le champ pour retirer l&rsquo;expiration.
            </p>
            {errors.expiresAt && (
              <p className="text-sm text-destructive">{errors.expiresAt.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Mise à jour...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
