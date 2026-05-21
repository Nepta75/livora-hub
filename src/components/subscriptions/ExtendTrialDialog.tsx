'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useExtendTrial } from '@/hooks/api/subscriptions/useExtendTrial';

interface ExtendTrialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  currentTrialEnd: string | null;
}

const QUICK_ADD_DAYS = [7, 14, 30];

// `YYYY-MM-DD` in local time — the value shape an <input type="date"> expects.
function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function ExtendTrialDialog({
  open,
  onOpenChange,
  tenantId,
  currentTrialEnd,
}: ExtendTrialDialogProps) {
  const extendMutation = useExtendTrial(tenantId);

  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Quick-add buttons extend from the current trial end — but never from a
  // date in the past (a lapsed manual trial), so the result always lands in
  // the future.
  const baseDate = useMemo(() => {
    const now = new Date();
    if (!currentTrialEnd) return now;
    const current = new Date(currentTrialEnd);
    return current > now ? current : now;
  }, [currentTrialEnd]);

  useEffect(() => {
    if (!open) return;
    const fortnightOut = new Date(baseDate);
    fortnightOut.setDate(fortnightOut.getDate() + 14);
    setDate(toDateInputValue(fortnightOut));
    setReason('');
    setError(null);
  }, [open, baseDate]);

  const applyQuickAdd = (days: number) => {
    const next = new Date(baseDate);
    next.setDate(next.getDate() + days);
    setDate(toDateInputValue(next));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!date) {
      setError('Choisissez une nouvelle date de fin d’essai.');
      return;
    }
    if (!reason.trim()) {
      setError('Le motif est obligatoire.');
      return;
    }

    // Send end-of-day local time: the tenant keeps access through the whole
    // chosen day, and the 48h floor is comfortably cleared for any day picked
    // two or more days out.
    const [year, month, day] = date.split('-').map(Number);
    const newTrialEnd = new Date(year, month - 1, day, 23, 59, 59);

    const minimum = new Date();
    minimum.setHours(minimum.getHours() + 48);
    if (newTrialEnd < minimum) {
      setError('La nouvelle date doit être au moins 48h dans le futur.');
      return;
    }
    if (currentTrialEnd && newTrialEnd <= new Date(currentTrialEnd)) {
      setError('La nouvelle date doit être postérieure à la fin d’essai actuelle.');
      return;
    }

    try {
      await extendMutation.mutateAsync({
        trialEndsAt: newTrialEnd.toISOString(),
        reason: reason.trim(),
      });
      toast.success(
        `Période d’essai prolongée jusqu’au ${newTrialEnd.toLocaleDateString('fr-FR')}.`,
      );
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'La prolongation a échoué.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prolonger la période d’essai</DialogTitle>
          <DialogDescription>
            La nouvelle date est appliquée à l’abonnement et tracée dans les logs d’audit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border p-3 text-sm">
            <p className="text-xs text-muted-foreground">Fin d’essai actuelle</p>
            <p className="font-medium">
              {currentTrialEnd
                ? new Date(currentTrialEnd).toLocaleDateString('fr-FR')
                : '—'}
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="trial-end">Nouvelle fin d’essai</Label>
            <Input
              id="trial-end"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div className="flex gap-2 pt-1">
              {QUICK_ADD_DAYS.map((days) => (
                <Button
                  key={days}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickAdd(days)}
                >
                  +{days} j
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="trial-reason">Motif (obligatoire)</Label>
            <Input
              id="trial-reason"
              maxLength={500}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Geste commercial, support client…"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={extendMutation.isPending}
          >
            Annuler
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={extendMutation.isPending}>
            {extendMutation.isPending ? 'Prolongation…' : 'Prolonger l’essai'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
