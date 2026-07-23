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

        // Run a single query against the Pokémon TCG API. URLSearchParams
        // handles all URL-encoding (spaces, apostrophes, accents, ♀/♂, etc.),
        // so we never manually concatenate the query string.
        const runQuery = async (q: string) => {
          const params = new URLSearchParams({ q, pageSize: '20' });
          const url = `https://api.pokemontcg.io/v2/cards?${params.toString()}`;
          console.log('[v0] Pokémon TCG Search:', { q, url });

          const response = await fetch(url);

          if (!response.ok) {
            // Surface the real API error message instead of "Unknown error".
            let apiMessage = '';
            try {
              const body = await response.clone().json();
              apiMessage = body?.error?.message || body?.message || '';
            } catch {
              try {
                apiMessage = await response.text();
              } catch {
                apiMessage = '';
              }
            }
            const message =
              apiMessage || response.statusText || `Request failed (${response.status})`;
            console.error('[v0] API Error:', { status: response.status, message });
            throw new Error(message);
          }

          const data = await response.json();
          return (data.data || []) as any[];
        };

        // 1) Exact phrase search: name:"search term".
        //    Inside a quoted phrase only " and \ are special to Lucene.
        const phrase = searchTerm.replace(/(["\\])/g, '\\$1');
        let rawCards = await runQuery(`name:"${phrase}"`);

        // 2) Fallback to a wildcard search when the phrase yields nothing.
        //    Escape Lucene special characters so names with : - . ' etc. stay
        //    valid, then bridge internal spaces with * (an un-escaped space in a
        //    wildcard query is rejected by the API).
        if (rawCards.length === 0) {
          const escaped = searchTerm
            .replace(/([+\-&|!(){}[\]^"~?:\\/])/g, '\\$1')
            .replace(/\s+/g, '*');
          console.log('[v0] No phrase matches, falling back to wildcard search');
          rawCards = await runQuery(`name:*${escaped}*`);
        }

        // Transform API response to our card format
        const cards: PokemonCard[] = rawCards.map((card: any) => ({
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
