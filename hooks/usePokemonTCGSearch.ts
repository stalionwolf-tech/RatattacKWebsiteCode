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
        const searchTerm = query.trim();
        const encodedTerm = encodeURIComponent(searchTerm);
        const url = `https://api.pokemontcg.io/v2/cards?q=name:${encodedTerm}&pageSize=20`;
        
        console.log('[v0] Pokémon TCG Search:', { searchTerm, url });

        const response = await fetch(url);

        if (!response.ok) {
          const errorBody = await response.text();
          console.error('[v0] API Error:', { status: response.status, statusText: response.statusText, body: errorBody });
          throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[v0] API Response:', { dataCount: data.data?.length || 0, totalCount: data.totalCount });

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
        const errorMessage = err instanceof Error ? err.message : 'Failed to search cards';
        console.error('[v0] Search error:', errorMessage);
        setState({
          results: [],
          isLoading: false,
          error: errorMessage,
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
