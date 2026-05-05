'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Users, Building2, Shield, LayoutDashboard, LogOut, X, CreditCard, Zap, Tag, ScrollText, Receipt, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Dev tools are gated to non-live Stripe environments — backend already
// refuses POST /admin/dev-tools/advance-billing when APP_ENV=prod, this
// just hides the entry point so a prod admin never sees a useless button.
const IS_LIVE_MODE = process.env.NEXT_PUBLIC_STRIPE_MODE === 'live';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { href: '/users', label: 'Utilisateurs', icon: Users, adminOnly: false },
  { href: '/tenants', label: 'Tenants', icon: Building2, adminOnly: true },
  { href: '/plans', label: 'Plans', icon: CreditCard, adminOnly: true },
  { href: '/promo-codes', label: 'Codes promo', icon: Tag, adminOnly: true },
  { href: '/billing', label: 'Dépassements', icon: Receipt, adminOnly: false },
  { href: '/features', label: 'Features', icon: Zap, adminOnly: true },
  { href: '/logs', label: 'Logs', icon: ScrollText, adminOnly: true },
  { href: '/roles', label: 'Rôles', icon: Shield, adminOnly: false },
  ...(IS_LIVE_MODE
    ? []
    : [{ href: '/dev-tools', label: 'Dev Tools', icon: Wrench, adminOnly: true }]),
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout, userRoles } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Close mobile sidebar on route change
  useEffect(() => { onMobileClose?.(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleItems = mounted
    ? navItems.filter((item) => !item.adminOnly || userRoles?.isAdmin)
    : navItems;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'flex flex-col w-64 border-r bg-card z-50',
          'fixed inset-y-0 left-0 transition-transform duration-200',
          'md:relative md:translate-x-0 md:min-h-screen',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Livora Hub</h1>
            <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
              {userRoles?.isAdmin ? 'Admin' : 'Modérateur'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMobileClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        <nav className="flex-1 p-4 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Separator />

        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>
    </>
  );
}
