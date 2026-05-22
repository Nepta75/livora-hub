'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  /** Applied search term (source of truth). */
  value: string;
  /** Called with the new term after the debounce window. */
  onChange: (value: string) => void;
  placeholder?: string;
}

const DEBOUNCE_MS = 300;

/**
 * Search field for listing pages. Keeps a local draft so typing stays snappy
 * while debouncing the (URL-writing) `onChange`. Re-syncs when `value` changes
 * externally, e.g. back/forward navigation or a reset.
 */
export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const handleChange = (next: string) => {
    setDraft(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(next), DEBOUNCE_MS);
  };

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder ?? 'Rechercher...'}
        className="pl-9"
      />
    </div>
  );
}
