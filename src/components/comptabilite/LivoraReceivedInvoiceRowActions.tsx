'use client';

import { Banknote, CheckCheck, Loader2, MoreHorizontal, RefreshCw, ThumbsUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ACTION } from '@/lib/action-palette';
import { cn } from '@/lib/utils';

/**
 * The three no-motif lifecycle acks the inbox offers. A literal union, NOT a bare string: refusing and
 * disputing carry a motif (MDT-113) and are a documented follow-up, so the type is the one guard that
 * keeps a fourth value (a typo, or a copy of the five-value emission set) from reaching the API as an
 * unchecked cast. Extending the list with anything outside the set is then a compile error.
 */
export type LivoraReceivedInvoiceAckEvent = 'received' | 'accepted' | 'paid';

/**
 * The acks in the buyer's progression order. Mirror of vista-app's RECEIVED_INVOICE_ACKS.
 */
export const LIVORA_RECEIVED_INVOICE_ACKS: {
  event: LivoraReceivedInvoiceAckEvent;
  label: string;
  icon: typeof CheckCheck;
}[] = [
  { event: 'received', label: 'Accuser réception', icon: CheckCheck },
  { event: 'accepted', label: 'Approuver', icon: ThumbsUp },
  { event: 'paid', label: 'Marquer payée', icon: Banknote },
];

interface Props {
  /** The last ack already reported, hidden from the menu (it cannot be re-declared). */
  reportedStatus?: string | null;
  /** A mutation is in flight for this row: the trigger shows a spinner and the menu is unavailable. */
  isBusy: boolean;
  onReport: (event: LivoraReceivedInvoiceAckEvent) => void;
  onRefresh: () => void;
}

/**
 * Row actions for one Livora received invoice: the buyer's lifecycle acks and a status refresh, in a
 * menu rather than as buttons on the row (a listing is scanned, and a page of buttons is noise). An ack
 * already declared is hidden rather than greyed, so the menu only ever shows what can still be done.
 */
export function LivoraReceivedInvoiceRowActions({
  reportedStatus,
  isBusy,
  onReport,
  onRefresh,
}: Props) {
  const acks = LIVORA_RECEIVED_INVOICE_ACKS.filter((ack) => ack.event !== reportedStatus);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Actions sur la facture reçue"
        disabled={isBusy}
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50',
          ACTION.neutral,
        )}
      >
        {isBusy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MoreHorizontal className="h-4 w-4" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {acks.map((ack) => (
          <DropdownMenuItem key={ack.event} onClick={() => onReport(ack.event)}>
            <ack.icon className="h-4 w-4" />
            {ack.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
          Rafraîchir le statut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
