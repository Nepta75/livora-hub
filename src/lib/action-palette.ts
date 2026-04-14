// Single source of truth for row-action tones and status badge tones across the
// hub. Pages import these tokens instead of hand-picking Tailwind utilities,
// so adding a new resource table never drifts from the established look.
//
// Palette scale: zinc (neutral) · amber (reversible disable) · emerald (enable /
// confirm) · red (permanent delete). See livora-hub/CLAUDE.md for usage rules.

export const ACTION = {
  neutral: 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100',
  warning: 'text-amber-600 hover:text-amber-700 hover:bg-amber-50',
  success: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50',
  destructive: 'text-red-600 hover:text-red-700 hover:bg-red-50',
} as const;

// Each token carries its own border color because shadcn's Badge variants
// default to `border-transparent`; twMerge resolves the collision so the
// palette's border wins, keeping the pill readable against any row hover tint.
export const STATUS_BADGE = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  inactive: 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50',
  info: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50',
} as const;

export const CONFIRM_BUTTON = {
  warning: 'bg-amber-600 hover:bg-amber-700 text-white',
} as const;
