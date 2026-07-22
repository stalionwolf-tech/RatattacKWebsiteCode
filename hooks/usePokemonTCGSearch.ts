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

  const debounceTimer = useRef<NodeJS.Timeout>();

  const search = useCallback((query: string) => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Reset if query is too short
    if (query.trim().length < 2) {
      setState({ results: [], isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Debounce the API call by 300ms
    debounceTimer.current = setTimeout(async () => {
      try {
        const searchQuery = encodeURIComponent(query.trim());
        const response = await fetch(
          `https://api.pokemontcg.io/v2/cards?q=name:"${query.trim()}"*&pageSize=20`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform API response to our card format
        const cards: PokemonCard[] = (data.data || []).map((card: any) => ({
          id: card.id,
          name: card.name,
          image: card.images?.small || card.images?.large || '',
          set: {
            name: card.set?.name || 'Unknown Set',
            id: card.set?.id || '',
          },
          cardNumber: card.number || '',
          rarity: card.rarity || '',
          hp: card.hp || '',
          types: card.types || [],
          artist: card.artist || '',
        }));

        setState({
          results: cards.slice(0, 20),
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setState({
          results: [],
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to search cards',
        });
      }
    }, 300);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    ...state,
    search,
  };
}
