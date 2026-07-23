'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Package,
  UploadCloud,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CONDITIONS } from '@/lib/admin/mock-pokemon';
import { SignOutButton } from '@/components/admin/SignOutButton';
import { usePokemonTCGSearch, type PokemonCard } from '@/hooks/usePokemonTCGSearch';

const TYPE_STYLES: Record<string, string> = {
  Colorless: 'bg-neutral-700/80 text-neutral-100 border-neutral-600',
  Darkness: 'bg-purple-950/80 text-purple-200 border-purple-800',
  Dragon: 'bg-indigo-950/80 text-indigo-200 border-indigo-800',
  Fairy: 'bg-pink-950/80 text-pink-200 border-pink-800',
  Fighting: 'bg-orange-950/80 text-orange-200 border-orange-800',
  Fire: 'bg-red-900/80 text-red-100 border-red-800',
  Grass: 'bg-green-950/80 text-green-200 border-green-800',
  Lightning: 'bg-yellow-900/80 text-yellow-100 border-yellow-700',
  Metal: 'bg-slate-700/80 text-slate-100 border-slate-600',
  Psychic: 'bg-violet-950/80 text-violet-200 border-violet-800',
  Water: 'bg-blue-900/80 text-blue-100 border-blue-800',
};

function TypeChip({ type }: { type: string }) {
  const style = TYPE_STYLES[type] || 'bg-neutral-800/80 text-neutral-300 border-neutral-700';
  return (
    <span className={`px-2.5 py-1 rounded-full border text-[11px] font-medium tracking-wide ${style}`}>
      {type}
    </span>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-neutral-800/70 last:border-b-0">
      <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</span>
      <span className="text-sm text-neutral-100 text-right">{children}</span>
    </div>
  );
}

interface AdminDashboardProps {
  user?: { email: string } | null;
}

export function AdminDashboard({ user = null }: AdminDashboardProps) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('9.99');
  const [trackInventory, setTrackInventory] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    productAdminId: string;
    adminUrl: string;
    storeUrl: string;
  } | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const { results, isLoading, error, search } = usePokemonTCGSearch();

  const resetPublishState = () => {
    setPublishResult(null);
    setPublishError(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedId(null);
    resetPublishState();
    search(newQuery);
  };

  const handleSelectCard = (id: string) => {
    setSelectedId(id);
    resetPublishState();
  };

  const selected = useMemo(
    () => results.find((c) => c.id === selectedId) || null,
    [selectedId, results],
  );

  const handlePublish = async () => {
    if (!selected) {
      toast.error('Select a card to publish.');
      return;
    }

    // ---- Client-side validation (server re-validates too) ----
    if (!selected.name?.trim()) {
      toast.error('Card name is missing.');
      return;
    }
    const priceNumber = Number(price);
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      toast.error('Enter a price greater than 0 before publishing.');
      return;
    }
    const quantityNumber = Number(quantity);
    if (!Number.isFinite(quantityNumber) || quantityNumber < 0) {
      toast.error('Quantity cannot be negative.');
      return;
    }

    setIsPublishing(true);
    resetPublishState();
    try {
      const res = await fetch('/api/admin/shopify/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card: selected,
          condition,
          quantity: Math.floor(quantityNumber),
          price,
          trackInventory,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        // Surface the EXACT error returned by the server/Shopify — never fake success.
        const message = data?.error || `Request failed (${res.status}).`;
        setPublishError(message);
        toast.error('Failed to publish to Shopify', { description: message });
        return;
      }

      // Only report success after Shopify confirmed the product was created.
      setPublishResult({
        productAdminId: data.productAdminId,
        adminUrl: data.adminUrl,
        storeUrl: data.storeUrl,
      });
      toast.success('Published Successfully', {
        description: `"${selected.name}" is now a product in your Shopify store.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error.';
      setPublishError(message);
      toast.error('Failed to publish to Shopify', { description: message });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-neutral-800/70 bg-black/40">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-950/60 border border-red-800/60">
            <Package className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-white tracking-wide">
              RatAttacK Inventory Manager
            </h1>
            <p className="text-sm text-neutral-400 mt-0.5">
              Search Pokémon cards and publish directly to Shopify
            </p>
          </div>

          <div className="ml-auto flex items-center gap-4">
            {user?.email ? (
              <div className="hidden text-right sm:block">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Signed in as
                </p>
                <p className="max-w-[220px] truncate text-sm font-medium text-neutral-200">
                  {user.email}
                </p>
              </div>
            ) : null}
            <SignOutButton className="h-10 gap-2 border-neutral-700 bg-neutral-950/60 hover:border-red-700 hover:bg-red-950/30" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Left panel — search */}
          <Card className="glass-panel rounded-2xl p-5 flex flex-col h-fit lg:h-[calc(100vh-160px)] lg:sticky lg:top-6">
            <div className="space-y-2">
              <Label htmlFor="card-search" className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                Search Pokémon Cards
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input
                  id="card-search"
                  value={query}
                  onChange={handleSearchChange}
                  placeholder="Name, set, or card number…"
                  className="pl-10 bg-neutral-950/70 border-neutral-800 focus-visible:ring-red-600 text-neutral-100"
                  minLength={2}
                />
              </div>
              {query.length > 0 && query.length < 2 && (
                <p className="text-xs text-neutral-500 mt-1">Enter at least 2 characters to search.</p>
              )}
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-950/30 border border-red-800/50 p-3">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <p className="mt-4 mb-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
              {isLoading ? 'Searching...' : `${results.length} result${results.length === 1 ? '' : 's'}`}
            </p>

            <ScrollArea className="flex-1 -mx-1 pr-2">
              <ul className="space-y-2 px-1">
                {isLoading && query.length >= 2 && (
                  <li className="py-8 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-5 w-5 text-red-500 animate-spin" />
                      <p className="text-xs text-neutral-500">Searching cards...</p>
                    </div>
                  </li>
                )}
                {!isLoading && results.map((card) => {
                  const active = card.id === selectedId;
                  return (
                    <li key={card.id}>
                      <button
                        onClick={() => handleSelectCard(card.id)}
                        className={`w-full flex items-center gap-3 rounded-xl border p-2.5 text-left transition-colors ${
                          active
                            ? 'border-red-600 bg-red-950/30'
                            : 'border-neutral-800 bg-neutral-950/50 hover:border-red-800/70 hover:bg-neutral-900/60'
                        }`}
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800">
                          {card.image ? (
                            <Image
                              src={card.image}
                              alt={card.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-[8px] text-neutral-500">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm font-semibold ${active ? 'text-red-300' : 'text-white'}`}>
                            {card.name}
                          </p>
                          <p className="truncate text-xs text-neutral-400">{card.set.name}</p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">#{card.cardNumber}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
                {!isLoading && query.length >= 2 && results.length === 0 && (
                  <li className="py-10 text-center text-sm text-neutral-500">
                    No cards match "{query}".
                  </li>
                )}
                {!isLoading && query.length < 2 && query.length > 0 && (
                  <li className="py-10 text-center text-sm text-neutral-500">
                    Enter at least 2 characters to search.
                  </li>
                )}
              </ul>
            </ScrollArea>
          </Card>

          {/* Right panel — preview + publish */}
          <Card className="glass-panel rounded-2xl p-5 md:p-7">
            {selected ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {/* Card art + attributes */}
                <div>
                  <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black">
                    {selected.image ? (
                      <Image
                        src={selected.image}
                        alt={selected.name}
                        fill
                        sizes="(max-width: 768px) 90vw, 400px"
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">
                        No image available
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <h2 className="font-cinzel text-2xl font-bold text-white">{selected.name}</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selected.types && selected.types.map((t) => (
                        <TypeChip key={t} type={t} />
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl border border-neutral-800/70 bg-neutral-950/40 px-4">
                      <DetailRow label="Set">{selected.set.name}</DetailRow>
                      <DetailRow label="Card Number">#{selected.cardNumber}</DetailRow>
                      {selected.rarity && <DetailRow label="Rarity">{selected.rarity}</DetailRow>}
                      {selected.hp && <DetailRow label="HP">{selected.hp}</DetailRow>}
                      {selected.artist && <DetailRow label="Artist">{selected.artist}</DetailRow>}
                    </div>
                  </div>
                </div>

                {/* Editable listing fields */}
                <div className="flex flex-col">
                  <div className="mb-5 flex items-center gap-2 text-red-400">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-[0.2em]">Listing Details</span>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                        Condition
                      </Label>
                      <Select value={condition} onValueChange={setCondition}>
                        <SelectTrigger className="bg-neutral-950/70 border-neutral-800 focus:ring-red-600 text-neutral-100">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONDITIONS.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="qty" className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                          Quantity
                        </Label>
                        <Input
                          id="qty"
                          type="number"
                          min="0"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="bg-neutral-950/70 border-neutral-800 focus-visible:ring-red-600 text-neutral-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                          Price (USD)
                        </Label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">$</span>
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="pl-8 bg-neutral-950/70 border-neutral-800 focus-visible:ring-red-600 text-neutral-100"
                          />
                        </div>
                      </div>
                    </div>

                    <label
                      htmlFor="track"
                      className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950/50 px-4 py-3 cursor-pointer hover:border-neutral-700"
                    >
                      <Checkbox
                        id="track"
                        checked={trackInventory}
                        onCheckedChange={(v) => setTrackInventory(Boolean(v))}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <span className="text-sm">
                        <span className="block font-medium text-white">Track Inventory</span>
                        <span className="block text-xs text-neutral-400">
                          Let Shopify manage stock levels for this listing
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="mt-auto pt-7">
                    <Button
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-70"
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Publishing to Shopify…
                        </>
                      ) : (
                        <>
                          <UploadCloud className="mr-2 h-5 w-5" />
                          Publish to Shopify
                        </>
                      )}
                    </Button>

                    {/* Success state */}
                    {publishResult && (
                      <div className="mt-4 rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-4">
                        <div className="flex items-center gap-2 text-emerald-300">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="text-sm font-semibold">Published Successfully</span>
                        </div>
                        <p className="mt-1 text-xs text-emerald-200/80">
                          Product ID {publishResult.productAdminId} created in your Shopify store.
                        </p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Button
                            asChild
                            variant="outline"
                            className="h-10 border-emerald-700 bg-transparent text-emerald-200 hover:bg-emerald-900/40 hover:text-emerald-100"
                          >
                            <a href={publishResult.adminUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open in Shopify Admin
                            </a>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="h-10 border-neutral-700 bg-transparent text-neutral-200 hover:bg-neutral-800/60 hover:text-white"
                          >
                            <a href={publishResult.storeUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Live Product
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Error state */}
                    {publishError && (
                      <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-800/60 bg-red-950/30 p-4">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                        <div>
                          <p className="text-sm font-semibold text-red-300">Publish failed</p>
                          <p className="mt-1 text-xs text-red-200/90 break-words">{publishError}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center text-neutral-500">
                {query.length >= 2 && isLoading ? 'Searching...' : 'Select a card to preview its details.'}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
