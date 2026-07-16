'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Zap, ChevronLeft, Truck, ShieldCheck, PackageCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ProductArtwork } from './ProductArtwork';
import { ProductCard } from './ProductCard';
import { formatPrice, AVAILABILITY_META, getRelatedProducts } from '@/lib/products';

const CART_KEY = 'ratattack_cart_v1';

function readCart() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}
function writeCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('ratattack:cart'));
  } catch {}
}

export function ProductDetail({ product }) {
  const router = useRouter();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const status = AVAILABILITY_META[product.availability] || AVAILABILITY_META.in_stock;
  const isSoon = product.availability === 'coming_soon';
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPrice;
  const related = getRelatedProducts(product.handle, 4);
  const maxQty = Math.max(1, Math.min(product.totalInventory || 1, 10));

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(maxQty, q + 1));

  const addToCart = () => {
    if (isSoon) {
      toast.info(`We'll ping you the moment ${product.title} drops.`);
      return;
    }
    const cart = readCart();
    const existing = cart.find((c) => c.handle === product.handle);
    if (existing) existing.quantity = Math.min(existing.quantity + qty, maxQty);
    else cart.push({
      handle: product.handle,
      title: product.title,
      price: Number(price.amount),
      currency: price.currencyCode,
      quantity: qty,
    });
    writeCart(cart);
    toast.success(`Added ${qty} × ${product.title} to your cart`);
  };

  const buyNow = () => {
    if (isSoon) return addToCart();
    addToCart();
    toast.info('Checkout arrives with the Shopify integration — stay tuned.');
  };

  return (
    <div className="container mx-auto px-6 pt-32 md:pt-36 pb-16 md:pb-24">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-400 hover:text-red-400 font-cinzel transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Store
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="space-y-4"
        >
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden glass-panel frame-corners">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <ProductArtwork product={product} size="lg" variant={product.images[activeImg]?.variant} />
              </motion.div>
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-sm rounded text-[10px] uppercase tracking-[0.3em] text-red-300 border border-red-900/70 font-cinzel">
              {product.productType}
            </div>
            <div className={`absolute top-4 right-4 px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.3em] font-cinzel backdrop-blur-sm border ${status.tint}`}>
              {status.label}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-premium ${
                  i === activeImg ? 'border-red-500 glow-red' : 'border-neutral-800 hover:border-red-800'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <ProductArtwork product={{ ...product, sigil: img.sigil, accent: img.accent }} size="sm" variant={img.variant} />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          className="space-y-6"
        >
          <div>
            <div className="text-red-500 tracking-[0.35em] text-[10px] font-semibold uppercase mb-3 font-cinzel">
              {product.vendor} · {product.productType}
            </div>
            <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-white leading-tight mb-4 tracking-wide">
              {product.title}
            </h1>
            <div className="flex items-baseline gap-3">
              <span className="font-cinzel text-3xl md:text-4xl text-red-400 text-glow">
                {formatPrice(price.amount, price.currencyCode)}
              </span>
              {compareAt && (
                <span className="text-base text-neutral-500 line-through">
                  {formatPrice(compareAt.amount, compareAt.currencyCode)}
                </span>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-cinzel">
              <span className={`inline-block w-2 h-2 rounded-full ${
                product.availability === 'in_stock' ? 'bg-emerald-500' :
                product.availability === 'low_stock' ? 'bg-amber-500' : 'bg-red-500'
              }`} />
              <span className="text-neutral-300">{status.label}</span>
              {product.availability === 'low_stock' && (
                <span className="text-amber-400">· Only {product.totalInventory} left</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="glass-panel rounded-lg p-5">
            <div className="text-[10px] uppercase tracking-[0.35em] text-red-500 font-cinzel mb-3">Description</div>
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-4">
              {product.description}
            </p>
            {product.features?.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-neutral-400">
                    <span className="text-red-500 mt-1">◆</span> {f}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quantity + Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-[10px] uppercase tracking-[0.35em] text-neutral-500 font-cinzel">Quantity</div>
              <div className="inline-flex items-center border border-red-900/60 rounded-lg overflow-hidden bg-black/50">
                <button
                  onClick={dec}
                  disabled={qty <= 1 || isSoon}
                  className="w-11 h-11 flex items-center justify-center text-neutral-300 hover:text-red-400 hover:bg-red-950/40 transition-premium disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 text-center font-cinzel text-lg text-white">{qty}</div>
                <button
                  onClick={inc}
                  disabled={qty >= maxQty || isSoon}
                  className="w-11 h-11 flex items-center justify-center text-neutral-300 hover:text-red-400 hover:bg-red-950/40 transition-premium disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={addToCart}
                size="lg"
                variant="outline"
                className="h-14 border-2 border-red-800/60 bg-black/40 hover:bg-red-950/40 hover:border-red-600 text-white transition-premium"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                <span className="font-cinzel tracking-widest uppercase text-sm">
                  {isSoon ? 'Notify Me' : 'Add to Cart'}
                </span>
              </Button>
              <Button
                onClick={buyNow}
                size="lg"
                className="h-14 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-2 border-red-800 text-white glow-red animate-pulse-glow btn-glow-red transition-premium"
              >
                <Zap className="w-5 h-5 mr-3" />
                <span className="font-cinzel tracking-widest uppercase text-sm">Buy Now</span>
              </Button>
            </div>
          </div>

          {/* Shipping strip */}
          <div className="glass-panel rounded-lg p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs uppercase tracking-widest text-white font-cinzel mb-1">Shipping</div>
                <div className="text-xs text-neutral-400 leading-relaxed">{product.shipping}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs uppercase tracking-widest text-white font-cinzel mb-1">Authentic</div>
                <div className="text-xs text-neutral-400 leading-relaxed">Every product is sourced through authorized channels or graded/verified before shipment.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PackageCheck className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs uppercase tracking-widest text-white font-cinzel mb-1">Careful Packaging</div>
                <div className="text-xs text-neutral-400 leading-relaxed">Sleeved, top-loaded, or bubble-wrapped as appropriate. No bent cards on our watch.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs uppercase tracking-widest text-white font-cinzel mb-1">Turnaround</div>
                <div className="text-xs text-neutral-400 leading-relaxed">Orders placed before 2 PM ET ship the same business day.</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-24">
          <div className="text-center mb-10">
            <div className="text-red-500 tracking-[0.4em] text-xs font-semibold uppercase mb-3 font-cinzel">✦ You May Also Like ✦</div>
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white">Related Wares</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.handle} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
