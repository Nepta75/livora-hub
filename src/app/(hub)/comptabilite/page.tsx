'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Calculator, Download, FileArchive } from 'lucide-react';
import { useAccountingExport } from '@/hooks/api/accounting/useAccountingExport';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function AccountingPage() {
  const { userRoles } = useAuth();
  const exportMutation = useAccountingExport();

  const now = new Date();
  const [mode, setMode] = useState<'month' | 'range'>('month');
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [year, setYear] = useState(now.getFullYear());
  const [from, setFrom] = useState(isoDate(new Date(now.getFullYear(), now.getMonth(), 1)));
  const [to, setTo] = useState(isoDate(now));

  // Backend restricts the export to ROLE_ADMIN; mirror that here so a
  // moderator never sees a page whose only action would 403.
  if (!userRoles?.isAdmin) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Accès réservé aux administrateurs.
      </p>
    );
  }

  const years = [now.getFullYear(), now.getFullYear() - 1, now.getFullYear() - 2];

  // Resolves the active tab to a [from, to] AAAA-MM-JJ pair, or null when the
  // free range is incomplete / inverted.
  function resolvePeriod(): { from: string; to: string } | null {
    if (mode === 'month') {
      const lastDay = new Date(year, month, 0).getDate();
      return {
        from: `${year}-${pad(month)}-01`,
        to: `${year}-${pad(month)}-${pad(lastDay)}`,
      };
    }

    if (!from || !to) {
      toast.error('Renseignez les deux dates.');
      return null;
    }
    if (from > to) {
      toast.error('La date de début doit précéder la date de fin.');
      return null;
    }
    return { from, to };
  }

  function handleExport() {
    const period = resolvePeriod();
    if (!period) return;

    exportMutation.mutate(period, {
      onSuccess: () => toast.success('Export comptable téléchargé.'),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "L'export a échoué."),
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Comptabilité
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Exporte sur une période les factures d&apos;abonnement et avoirs émis
          par Livora, à transmettre au comptable.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exporter une période</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="inline-flex rounded-md border p-0.5">
            <button
              type="button"
              onClick={() => setMode('month')}
              className={cn(
                'rounded px-3 py-1 text-sm transition-colors',
                mode === 'month'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Mois
            </button>
            <button
              type="button"
              onClick={() => setMode('range')}
              className={cn(
                'rounded px-3 py-1 text-sm transition-colors',
                mode === 'range'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Plage de dates
            </button>
          </div>

          {mode === 'month' ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Mois</Label>
                <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                  <SelectTrigger>
                    <SelectValue>{(value) => MONTHS[Number(value) - 1]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((label, idx) => (
                      <SelectItem key={label} value={String(idx + 1)}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Année</Label>
                <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
                  <SelectTrigger>
                    <SelectValue>{(value) => String(value)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="from">Du</Label>
                <Input
                  id="from"
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="to">Au</Label>
                <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
            <FileArchive className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              Le ZIP contient les PDF des factures d&apos;abonnement (statut
              payé) et des avoirs émis sur la période, plus un{' '}
              <span className="font-medium">journal des ventes</span> au format
              CSV importable par le comptable.
            </div>
          </div>

          <Button onClick={handleExport} disabled={exportMutation.isPending}>
            <Download className="h-4 w-4" />
            {exportMutation.isPending ? 'Génération…' : 'Exporter'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
