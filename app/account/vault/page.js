'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Boxes, Plus, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductArtwork } from '@/components/store/ProductArtwork';
import { getProductByHandle } from '@/lib/products';
import { VAULT_COLLECTIONS } from '@/lib/account';

export default function VaultPage() {
  const [collections, setCollections] = useState(VAULT_COLLECTIONS);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  const create = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCollections((c) => [{ id: `col_${Date.now()}`, name: name.trim(), description: 'Custom collection.', itemHandles: [] }, ...c]);
    setName(''); setCreating(false); toast.success('Collection created');
  };

  return (
    <>
      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
          <div>
            <div className="flex items-center gap-2"><Boxes className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">The Vault</h2></div>
            <p className="text-sm text-neutral-400 mt-1">Organize saved products into private collections — build sets, wishlists, and trade piles.</p>
          </div>
          <Button onClick={() => setCreating(true)} className="h-11 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
            <Plus className="w-4 h-4 mr-2" /><span className="font-cinzel tracking-widest uppercase text-[10px]">New Collection</span>
          </Button>
        </div>

        <AnimatePresence>
          {creating && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={create} className="mb-6 overflow-hidden">
              <div className="flex gap-2">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Collection name…" className="bg-black/60 border-neutral-800 focus:border-red-600 h-11" autoFocus />
                <Button type="submit" className="h-11 bg-red-700 hover:bg-red-600 border border-red-900"><span className="font-cinzel tracking-widest uppercase text-[10px]">Create</span></Button>
                <button type="button" onClick={() => { setCreating(false); setName(''); }} className="w-11 h-11 rounded-md border border-neutral-800 bg-black/40 text-neutral-400 hover:text-red-400 flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collections.map((c) => {
            const products = c.itemHandles.map(getProductByHandle).filter(Boolean);
            return (
              <div key={c.id} className="glass-panel rounded-lg p-4 hover:border-red-600/60 card-lift group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-cinzel text-lg text-white group-hover:text-red-300 transition-colors">{c.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{c.description}</p>
                    <p className="text-[10px] uppercase tracking-widest text-red-500 font-cinzel mt-2">{products.length} item{products.length === 1 ? '' : 's'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-500 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </div>
                {products.length > 0 ? (
                  <div className="flex -space-x-2">
                    {products.slice(0, 5).map((p, i) => (
                      <Link key={p.handle} href={`/store/product/${p.handle}`} className="w-14 h-18 rounded-md overflow-hidden border-2 border-neutral-950 hover:border-red-600 transition-premium" style={{ zIndex: 5 - i }}>
                        <ProductArtwork product={p} size="sm" />
                      </Link>
                    ))}
                    {products.length > 5 && <div className="w-14 h-18 rounded-md border-2 border-neutral-950 bg-black/60 flex items-center justify-center text-[10px] font-cinzel text-neutral-400">+{products.length - 5}</div>}
                  </div>
                ) : (
                  <div className="text-xs text-neutral-500 py-3">Empty — add products from any product page.</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
