import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameId, NormalizedCard } from '@/lib/tcg/types';

interface UseCardSearchState {
  results: NormalizedCard[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Game-agnostic card search hook.
 *
 * It debounces the query, cancels stale in-flight requests, and forwards the
 * raw term to `/api/cards/search`, which dispatches to the correct adapter
 * server-side. The hook only ever deals in `NormalizedCard`, so the UI is
 * identical no matter which game is selected.
 */
export function useCardSearch() {
  const [state, setState] = useState<UseCardSearchState>({
    results: [],
    isLoading: false,
    error: null,
  });

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback((query: string, game: GameId) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    const searchTerm = query.trim();

    if (searchTerm.length < 2) {
      if (abortRef.current) abortRef.current.abort();
      setState({ results: [], isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    debounceTimer.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const url = `/api/cards/search?game=${encodeURIComponent(game)}&q=${encodeURIComponent(
          searchTerm,
        )}`;
        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.error || `Search failed (${response.status})`);
        }

        const cards = (Array.isArray(data.cards) ? data.cards : []) as NormalizedCard[];
        setState({ results: cards, isLoading: false, error: null });
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const errorMessage = err instanceof Error ? err.message : 'Failed to search cards';
        setState({ results: [], isLoading: false, error: errorMessage });
      }
    }, 300);
  }, []);

  /** Clear results immediately (used when switching games). */
  const reset = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (abortRef.current) abortRef.current.abort();
    setState({ results: [], isLoading: false, error: null });
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return { ...state, search, reset };
}
