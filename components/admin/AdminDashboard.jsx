'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, Package, UploadCloud, Sparkles } from 'lucide-react';
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
import { MOCK_CARDS, CONDITIONS, TYPE_STYLES } from '@/lib/admin/mock-pokemon';

function TypeChip({ type }) {
  const style = TYPE_STYLES[type] || 'bg-neutral-800/80 text-neutral-300 border-neutral-700';
  return (
    <span className={`px-2.5 py-1 rounded-full border text-[11px] font-medium tracking-wide ${style}`}>
      {type}
    </span>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-neutral-800/70 last:border-b-0">
      <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</span>
      <span className="text-sm text-neutral-100 text-right">{children}</span>
    </div>
  );
}

export function AdminDashboard() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(MOCK_CARDS[0].id);
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('9.99');
  const [trackInventory, setTrackInventory] = useState(true);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_CARDS;
    return MOCK_CARDS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.set.toLowerCase().includes(q) ||
        c.number.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = useMemo(
    () => MOCK_CARDS.find((c) => c.id === selectedId) || null,
    [selectedId],
  );

  const handlePublish = () => {
    if (!selected) {
      toast.error('Select a card to publish.');
      return;
    }
    toast.success(`Published “${selected.name}” to Shopify`, {
      description: `${condition} · Qty ${quantity || 0} · $${price || '0.00'}`,
    });
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
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Name, set, or card number…"
                  className="pl-9 bg-neutral-950/70 border-neutral-800 focus-visible:ring-red-600"
                />
              </div>
            </div>

            <p className="mt-4 mb-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
              {results.length} result{results.length === 1 ? '' : 's'}
            </p>

            <ScrollArea className="flex-1 -mx-1 pr-2">
              <ul className="space-y-2 px-1">
                {results.map((card) => {
                  const active = card.id === selectedId;
                  return (
                    <li key={card.id}>
                      <button
                        onClick={() => setSelectedId(card.id)}
                        className={`w-full flex items-center gap-3 rounded-xl border p-2.5 text-left transition-colors ${
                          active
                            ? 'border-red-600 bg-red-950/30'
                            : 'border-neutral-800 bg-neutral-950/50 hover:border-red-800/70 hover:bg-neutral-900/60'
                        }`}
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800">
                          <Image
                            src={card.image || '/placeholder.svg'}
                            alt={card.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm font-semibold ${active ? 'text-red-300' : 'text-white'}`}>
                            {card.name}
                          </p>
                          <p className="truncate text-xs text-neutral-400">{card.set}</p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">#{card.number}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
                {results.length === 0 && (
                  <li className="py-10 text-center text-sm text-neutral-500">
                    No cards match “{query}”.
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
                    <Image
                      src={selected.image || '/placeholder.svg'}
                      alt={selected.name}
                      fill
                      sizes="(max-width: 768px) 90vw, 400px"
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="mt-5">
                    <h2 className="font-cinzel text-2xl font-bold text-white">{selected.name}</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selected.types.map((t) => (
                        <TypeChip key={t} type={t} />
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl border border-neutral-800/70 bg-neutral-950/40 px-4">
                      <DetailRow label="Set">{selected.set}</DetailRow>
                      <DetailRow label="Card Number">#{selected.number}</DetailRow>
                      <DetailRow label="Rarity">{selected.rarity}</DetailRow>
                      <DetailRow label="HP">{selected.hp}</DetailRow>
                      <DetailRow label="Artist">{selected.artist}</DetailRow>
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
                        <SelectTrigger className="bg-neutral-950/70 border-neutral-800 focus:ring-red-600">
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
                          className="bg-neutral-950/70 border-neutral-800 focus-visible:ring-red-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                          Price (USD)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">$</span>
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="pl-7 bg-neutral-950/70 border-neutral-800 focus-visible:ring-red-600"
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
                      className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <UploadCloud className="mr-2 h-5 w-5" />
                      Publish to Shopify
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center text-neutral-500">
                Select a card to preview its details.
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
