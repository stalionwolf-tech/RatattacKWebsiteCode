import { useState, useCallback, useRef, useEffect } from 'react';

export interface PokemonCard {
  id: string;
  name: string;
  image: string;
  set: {
    name: string;
    id: string;
  };
  cardNumber: string;
  rarity?: string;
  hp?: string;
  types?: string[];
  artist?: string;
}

interface UsePokemonTCGSearchState {
  results: PokemonCard[];
  isLoading: boolean;
  error: string | null;
}

export function usePokemonTCGSearch() {
  const [state, setState] = useState<UsePokemonTCGSearchState>({
    results: [],
    isLoading: false,
    error: null,
  });

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback((query: string) => {
    // Clear any pending debounced call.
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const searchTerm = query.trim();

    // Reset when the query is too short to search.
    if (searchTerm.length < 2) {
      if (abortRef.current) abortRef.current.abort();
      setState({ results: [], isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Debounce the request by 300ms.
    debounceTimer.current = setTimeout(async () => {
      // Cancel any in-flight request so responses can't arrive out of order.
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // All query generation, URL-encoding, retry/backoff, and normalization
        // happen server-side in /api/pokemon/search. The client just forwards
        // the raw term and renders the normalized cards.
        const url = `/api/pokemon/search?q=${encodeURIComponent(searchTerm)}`;
        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.error || `Search failed (${response.status})`);
        }

        const cards = (Array.isArray(data.cards) ? data.cards : []) as PokemonCard[];
        setState({ results: cards, isLoading: false, error: null });
      } catch (err) {
        // Ignore aborted requests — a newer search superseded this one.
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const errorMessage = err instanceof Error ? err.message : 'Failed to search cards';
        setState({ results: [], isLoading: false, error: errorMessage });
      }
    }, 300);
  }, []);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return {
    ...state,
    search,
  };
}
