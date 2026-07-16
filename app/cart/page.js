'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { ProductArtwork } from '@/components/store/ProductArtwork';
import { formatPrice, getProductByHandle } from '@/lib/products';
import { useCart } from '@/lib/store-hooks';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const { items, subtotal, shipping, tax, total, setQuantity, remove, count } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  // Smart checkout: if any item has a live Shopify variant GID, send those to
  // Shopify's hosted checkout via the Storefront cart API; otherwise fall back
  // to the local (mock) checkout page for demo/testing.
  const handleCheckout = async () => {
    if (!items.length) return;
    setCheckingOut(true);
    try {
      const lines = items.map((i) => ({ merchandiseId: i.key, quantity: i.quantity }));
      const res = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
      }
      if (res.status === 422) {
        // Mock cart (or products not yet in Shopify) — go to local checkout preview
        toast.info('Preview cart — no live Shopify items yet. Loading demo checkout.');
        router.push('/checkout');
        return;
      }
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error || 'Checkout failed. Please try again.');
    } catch (err) {
      toast.error(err?.message || 'Network error. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <ScrollingBackdrop />
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />
      <Toaster theme="dark" position="bottom-right" />

      <main className="relative z-10 container mx-auto px-6 pt-32 md:pt-40 pb-20">
        <Link href="/store" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-400 hover:text-red-400 font-cinzel transition-colors mb-6"><ChevronLeft className="w-4 h-4" /> Continue Shopping</Link>
        <div className="mb-8">
          <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-3 font-cinzel">The Hoard</div>
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white">Cart</h1>
          <p className="text-neutral-400 mt-2">{count} {count === 1 ? 'item' : 'items'}</p>
        </div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center glass-panel frame-corners rounded-2xl p-10">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-950/40 border border-red-900/60 flex items-center justify-center text-red-400"><ShoppingBag className="w-7 h-7" /></div>
            <h3 className="font-cinzel text-2xl text-white mb-2">The Hoard is Empty</h3>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">Fill it with sealed boxes, singles, and merch from the vault.</p>
            <Button asChild className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
              <Link href="/store"><span className="font-cinzel tracking-widest uppercase text-xs">Browse Store</span></Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((item) => {
                  const p = getProductByHandle(item.handle);
                  return (
                    <motion.div key={item.key} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-panel rounded-lg p-4 flex gap-4">
                      <Link href={`/store/product/${item.handle}`} className="w-24 h-32 rounded overflow-hidden border border-neutral-800 flex-shrink-0">
                        <ProductArtwork product={p || { sigil: item.image?.sigil, accent: item.image?.accent, productType: item.title }} />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/store/product/${item.handle}`} className="font-cinzel text-base md:text-lg text-white hover:text-red-300 leading-snug transition-colors">{item.title}</Link>
                        <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel mt-1 mb-3">{item.variantTitle}</div>
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="inline-flex items-center border border-neutral-800 rounded bg-black/50">
                            <button onClick={() => setQuantity(item.key, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-red-400"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="w-10 text-center font-cinzel text-white">{item.quantity}</span>
                            <button onClick={() => setQuantity(item.key, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-red-400"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                          <div className="font-cinzel text-lg text-red-400">{formatPrice(item.price * item.quantity, item.currency)}</div>
                        </div>
                      </div>
                      <button onClick={() => remove(item.key)} aria-label="Remove" className="self-start text-neutral-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <aside className="glass-panel frame-corners rounded-xl p-6 lg:sticky lg:top-24">
              <h3 className="font-cinzel text-xl text-white mb-5">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-neutral-400">Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">Est. Shipping</span><span className="text-white">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">Est. Tax</span><span className="text-neutral-500">{formatPrice(tax)}</span></div>
              </div>
              <div className="my-5 border-t border-neutral-900" />
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-cinzel">Grand Total</span>
                <span className="font-cinzel text-3xl text-red-400 text-glow">{formatPrice(total)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={checkingOut}
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-2 border-red-800 glow-red btn-glow-red disabled:opacity-70"
              >
                {checkingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span className="font-cinzel tracking-widest uppercase text-sm">Preparing Checkout…</span>
                  </>
                ) : (
                  <>
                    <span className="font-cinzel tracking-widest uppercase text-sm">Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-neutral-500 mt-4 uppercase tracking-widest font-cinzel">Secure checkout via Shopify · SSL encrypted</p>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
