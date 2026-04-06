'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layouts/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function HubLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <main className="flex-1 overflow-auto min-w-0">
        {/* Mobile header */}
        <div className="flex items-center gap-3 border-b px-4 py-3 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-sm">Livora Hub</span>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  );
}
