'use client';

import { toast } from 'sonner';
import {
  useAddPromoCodeRule,
  useRemovePromoCodeRule,
} from '@/hooks/api/promoCodes/useAdminPromoCodes';
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
      toast.error(error instanceof Error ? error.message : 'Erreur');
    }
  }

  async function handleRemove(ruleId: string) {
    try {
      await removeMutation.mutateAsync(ruleId);
      toast.success('Règle supprimée');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur');
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
