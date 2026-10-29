'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AccountingExportSection } from '@/components/comptabilite/AccountingExportSection';
import { LivoraReceivedInvoicesSection } from '@/components/comptabilite/LivoraReceivedInvoicesSection';
import { cn } from '@/lib/utils';

type Tab = 'export' | 'received';

const TABS: { id: Tab; label: string }[] = [
  { id: 'export', label: 'Export comptable' },
  { id: 'received', label: 'Factures reçues' },
];

export default function AccountingPage() {
  const { userRoles } = useAuth();
  const [tab, setTab] = useState<Tab>('export');

  // Backend restricts both the export and the Livora received-invoice routes to ROLE_ADMIN; mirror
  // that here so a moderator never sees a page whose only actions would 403.
  if (!userRoles?.isAdmin) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Accès réservé aux administrateurs.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Comptabilité
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          La facturation de Livora : l&apos;export comptable des factures émises, et les factures
          reçues des fournisseurs via la plateforme de facturation électronique.
        </p>
      </div>

      <div className="inline-flex rounded-md border p-0.5">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              'rounded px-3 py-1 text-sm transition-colors',
              tab === item.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'export' ? <AccountingExportSection /> : <LivoraReceivedInvoicesSection />}
    </div>
  );
}
