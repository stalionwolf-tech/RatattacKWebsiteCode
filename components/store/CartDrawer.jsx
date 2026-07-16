'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductArtwork } from './ProductArtwork';
import { getProductByHandle, formatPrice } from '@/lib/products';
import { useCart, CART_OPEN_EVENT } from '@/lib/store-hooks';
import { useState } from 'react';

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, subtotal, shipping, tax, total, count, setQuantity, remove } = useCart();

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener(CART_OPEN_EVENT, openHandler);
    return () => window.removeEventListener(CART_OPEN_EVENT, openHandler);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            className="fixed right-0 top-0 h-full w-full sm:w-[440px] z-[81] bg-neutral-950 border-l border-red-900/40 shadow-[-12px_0_60px_rgba(0,0,0,0.6)] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-red-900/30">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-red-500" />
                <div>
                  <div className="font-cinzel tracking-widest uppercase text-sm">Your Hoard</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel">{count} {count === 1 ? 'item' : 'items'}</div>
                </div>
              </div>
              <button onClick={close} aria-label="Close cart" className="w-9 h-9 rounded-md flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-red-950/40 transition-premium">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-900/60 flex items-center justify-center text-red-500 mb-5">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div className="font-cinzel text-lg text-white mb-2">The Hoard is Empty</div>
                  <p className="text-sm text-neutral-500 mb-6 max-w-xs leading-relaxed">Fill it with sealed boxes, singles, and merch from the vault.</p>
                  <Button asChild onClick={close} className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
                    <Link href="/store"><span className="font-cinzel tracking-widest uppercase text-xs">Browse Store</span></Link>
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <CartRow key={item.key} item={item} setQuantity={setQuantity} remove={remove} onNav={close} />
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-red-900/30 px-5 py-4 space-y-3 bg-black/60">
                <Row label="Subtotal" value={formatPrice(subtotal)} />
                <Row label="Est. Shipping" value={shipping === 0 ? 'Free' : formatPrice(shipping)} />
                <Row label="Est. Tax (8%)" value={formatPrice(tax)} muted />
                <div className="pt-3 border-t border-neutral-900 flex justify-between items-baseline">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-cinzel">Grand Total</span>
                  <span className="font-cinzel text-2xl text-red-400 text-glow">{formatPrice(total)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button asChild variant="outline" onClick={close} className="h-12 border-red-800/60 bg-black/40 hover:bg-red-950/40 hover:border-red-600 text-neutral-200">
                    <Link href="/store"><span className="font-cinzel tracking-widest uppercase text-[10px]">Continue Shopping</span></Link>
                  </Button>
                  <Button asChild onClick={close} className="h-12 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red glow-red">
                    <Link href="/checkout">
                      <span className="font-cinzel tracking-widest uppercase text-[10px]">Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, muted }) {
  return (
    <div className="flex justify-between text-sm">
      <span className={muted ? 'text-neutral-500' : 'text-neutral-300'}>{label}</span>
      <span className={muted ? 'text-neutral-500' : 'text-white'}>{value}</span>
    </div>
  );
}

function CartRow({ item, setQuantity, remove, onNav }) {
  const product = getProductByHandle(item.handle);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-3 glass-panel rounded-lg p-3"
    >
      <Link href={`/store/product/${item.handle}`} onClick={onNav} className="relative w-16 h-20 rounded overflow-hidden flex-shrink-0 border border-neutral-800">
        <ProductArtwork product={product || { sigil: item.image?.sigil, accent: item.image?.accent, productType: item.title }} size="sm" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/store/product/${item.handle}`} onClick={onNav} className="block font-cinzel text-sm text-white hover:text-red-300 line-clamp-2 leading-snug mb-1 transition-colors">
          {item.title}
        </Link>
        <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel mb-2">{item.variantTitle}</div>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center border border-neutral-800 rounded bg-black/50">
            <button onClick={() => setQuantity(item.key, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-red-400"><Minus className="w-3 h-3" /></button>
            <span className="w-8 text-center font-cinzel text-sm text-white">{item.quantity}</span>
            <button onClick={() => setQuantity(item.key, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-red-400"><Plus className="w-3 h-3" /></button>
          </div>
          <div className="font-cinzel text-red-400 text-sm">{formatPrice(item.price * item.quantity, item.currency)}</div>
        </div>
      </div>
      <button onClick={() => remove(item.key)} aria-label="Remove" className="self-start text-neutral-500 hover:text-red-400 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
