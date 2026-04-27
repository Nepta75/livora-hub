'use client';

import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  useAddPromoCodeRule,
  useRemovePromoCodeRule,
} from '@/hooks/api/promoCodes/useAdminPromoCodes';
import { mapPromoCodeError } from '@/services/admin/promoCodesService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  PromoCodeRulesEditor,
  type EditorRule,
} from '@/components/promoCodes/PromoCodeRulesEditor';
import type {
  ICreatePromoCodeRuleDto,
  IPromoCodeDto,
} from '@/types/generated/api-types';

interface ManagePromoCodeRulesDialogProps {
  promoCode: IPromoCodeDto | null;
  onOpenChange: (open: boolean) => void;
}

export function ManagePromoCodeRulesDialog({
  promoCode,
  onOpenChange,
}: ManagePromoCodeRulesDialogProps) {
  const open = promoCode !== null;
  const promoCodeId = promoCode?.id ?? '';

  const addMutation = useAddPromoCodeRule(promoCodeId);
  const removeMutation = useRemovePromoCodeRule(promoCodeId);

  if (!promoCode) return null;

  const rules: EditorRule[] = (promoCode.rules ?? []).map((rule) => ({
    id: rule.id,
    type: rule.type,
    value: rule.value,
  }));

  async function handleAdd(rule: ICreatePromoCodeRuleDto) {
    try {
      await addMutation.mutateAsync(rule);
      toast.success('Règle ajoutée');
    } catch (error) {
      toast.error(mapPromoCodeError(error));
    }
  }

  async function handleRemove(ruleId: string) {
    try {
      await removeMutation.mutateAsync(ruleId);
      toast.success('Règle supprimée');
    } catch (error) {
      toast.error(mapPromoCodeError(error));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Règles d&rsquo;éligibilité —{' '}
            <span className="font-mono text-primary">{promoCode.code}</span>
          </DialogTitle>
          <DialogDescription>
            Évaluées côté serveur au checkout. Toutes les règles doivent passer pour que le code
            soit utilisable.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Attention — la modification ne resynchronise pas Stripe.</p>
            <p>
              Ajouter ou retirer une règle ici met à jour la base, mais le coupon Stripe garde
              son <code>applies_to</code> d&rsquo;origine. Pour que la nouvelle restriction soit
              appliquée aussi sur la page Stripe Checkout, exécute{' '}
              <code>php bin/console livora:promo:resync-stripe</code> ou recrée le code.
            </p>
          </div>
        </div>

        <PromoCodeRulesEditor
          rules={rules}
          onAdd={handleAdd}
          onRemove={handleRemove}
          isBusy={addMutation.isPending || removeMutation.isPending}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
