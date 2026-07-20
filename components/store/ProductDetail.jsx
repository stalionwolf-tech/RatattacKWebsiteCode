'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Zap, ChevronLeft, Truck, ShieldCheck, PackageCheck, Clock, Heart, Share2, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductArtwork } from './ProductArtwork';
import { ProductCard, Stars } from './ProductCard';
import { AverageRating, ReviewItem } from './Reviews';
import { formatPrice, AVAILABILITY_META, getProductByHandle } from '@/lib/products';
import { useCart, useWishlist, useRecentlyViewed, openCartDrawer } from '@/lib/store-hooks';

export function ProductDetail({ product, related, reviews }) {
  const router = useRouter();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [variantIdx, setVariantIdx] = useState(0);
  const [buyingNow, setBuyingNow] = useState(false);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const status = AVAILABILITY_META[product.availability] || AVAILABILITY_META.in_stock;
  const isSoon = product.availability === 'coming_soon';
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPrice;
  const salePct = compareAt ? Math.round((1 - Number(price.amount) / Number(compareAt.amount)) * 100) : 0;
  const maxQty = Math.max(1, Math.min(product.totalInventory || 1, 10));

  const cart = useCart();
  const wish = useWishlist();
  const rv = useRecentlyViewed();
  const wished = wish.has(product.handle);

  useEffect(() => { rv.record(product.handle); }, [product.handle]); // eslint-disable-line

  const recentProducts = useMemo(() => rv.items.filter((h) => h !== product.handle).map(getProductByHandle).filter(Boolean).slice(0, 4), [rv.items, product.handle]);

  const addToCart = () => {
    if (isSoon) { toast.info(`We'll notify you when ${product.title} drops.`); return; }
    cart.add(product, qty);
    toast.success(`Added ${qty} × ${product.title} to cart`);
    openCartDrawer();
  };
  const buyNow = async () => {
    if (isSoon) return addToCart();
    const merchandiseId = product.variants?.[variantIdx]?.id;
    if (!merchandiseId) { toast.error('This product is unavailable for checkout.'); return; }
    setBuyingNow(true);
    try {
      const lines = [{ merchandiseId, quantity: 1 }];
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
        toast.info('Preview cart — no live Shopify items yet. Loading demo checkout.');
        router.push('/checkout');
        return;
      }
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error || 'Checkout failed. Please try again.');
    } catch (err) {
      toast.error(err?.message || 'Network error. Please try again.');
    } finally {
      setBuyingNow(false);
    }
  };
  const share = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: product.title, url: window.location.href }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(window.location.href); toast.success('Link copied to clipboard'); } catch {}
    }
  };
  const onMouseMoveZoom = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({ active: true, x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <div className="container mx-auto px-6 pt-32 md:pt-36 pb-16 md:pb-24">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link href="/store" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-400 hover:text-red-400 font-cinzel transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Store
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start">
        {/* Gallery */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-4">
          <div
            onMouseMove={onMouseMoveZoom}
            onMouseLeave={() => setZoom({ active: false, x: 50, y: 50 })}
            className="relative aspect-[4/5] rounded-xl overflow-hidden glass-panel frame-corners cursor-zoom-in"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: zoom.active ? 1.6 : 1, transformOrigin: `${zoom.x}% ${zoom.y}%` }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                <ProductArtwork product={product} size="lg" variant={product.images[activeImg]?.variant} />
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 rounded text-[10px] uppercase tracking-[0.3em] text-red-300 border border-red-900/70 font-cinzel">{product.productType}</div>
            <div className={`absolute top-4 right-4 px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.3em] font-cinzel backdrop-blur-sm border ${status.tint}`}>{status.label}</div>
            {product.isOnSale && (
              <div className="absolute top-14 right-4 px-2.5 py-1 bg-red-600 text-white rounded text-[10px] uppercase tracking-widest font-cinzel font-bold">-{salePct}%</div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-premium ${i === activeImg ? 'border-red-500 glow-red' : 'border-neutral-800 hover:border-red-800'}`} aria-label={`View image ${i + 1}`}>
                <ProductArtwork product={{ ...product, sigil: img.sigil, accent: img.accent }} size="sm" variant={img.variant} />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Details + Sticky purchase */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="lg:sticky lg:top-24 space-y-5">
          <div>
            <div className="text-red-500 tracking-[0.35em] text-[10px] font-semibold uppercase mb-3 font-cinzel">{product.vendor} · {product.productType}</div>
            <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-white leading-tight mb-4 tracking-wide">{product.title}</h1>
            <div className="flex items-center gap-3 mb-4">
              <Stars rating={product.rating} size={16} />
              <span className="text-xs text-neutral-500">{product.rating.toFixed(1)} · {product.reviewCount} reviews</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-cinzel text-3xl md:text-4xl text-red-400 text-glow">{formatPrice(price.amount, price.currencyCode)}</span>
              {compareAt && (
                <>
                  <span className="text-base text-neutral-500 line-through">{formatPrice(compareAt.amount, compareAt.currencyCode)}</span>
                  <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] uppercase tracking-widest font-bold">Save {salePct}%</span>
                </>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-cinzel">
              <span className={`inline-block w-2 h-2 rounded-full ${product.availability === 'in_stock' ? 'bg-emerald-500' : product.availability === 'low_stock' ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className="text-neutral-300">{status.label}</span>
              {product.availability === 'low_stock' && <span className="text-amber-400">· Only {product.totalInventory} left</span>}
            </div>
          </div>

          {/* Variant selector */}
          {product.variants.length > 1 && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel mb-2">Variant</div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button key={v.id} onClick={() => setVariantIdx(i)} className={`px-3 py-2 rounded-md border text-sm transition-premium ${i === variantIdx ? 'border-red-500 bg-red-950/40 text-white' : 'border-neutral-800 text-neutral-300 hover:border-red-800'}`}>
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel">Quantity</div>
              <div className="inline-flex items-center border border-red-900/60 rounded-lg overflow-hidden bg-black/50">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1 || isSoon} className="w-11 h-11 flex items-center justify-center text-neutral-300 hover:text-red-400 hover:bg-red-950/40 disabled:opacity-40"><Minus className="w-4 h-4" /></button>
                <div className="w-12 text-center font-cinzel text-lg text-white">{qty}</div>
                <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty || isSoon} className="w-11 h-11 flex items-center justify-center text-neutral-300 hover:text-red-400 hover:bg-red-950/40 disabled:opacity-40"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={addToCart} size="lg" variant="outline" className="h-14 border-2 border-red-800/60 bg-black/40 hover:bg-red-950/40 hover:border-red-600 text-white transition-premium">
                <ShoppingCart className="w-5 h-5 mr-3" />
                <span className="font-cinzel tracking-widest uppercase text-sm">{isSoon ? 'Notify Me' : 'Add to Cart'}</span>
              </Button>
              <Button onClick={buyNow} disabled={buyingNow} size="lg" className="h-14 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-2 border-red-800 text-white glow-red animate-pulse-glow btn-glow-red disabled:opacity-70">
                {buyingNow ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    <span className="font-cinzel tracking-widest uppercase text-sm">Preparing…</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-3" />
                    <span className="font-cinzel tracking-widest uppercase text-sm">Buy Now</span>
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { const n = wish.toggle(product); toast[n?'success':'message'](n?'Saved to wishlist':'Removed from wishlist'); }} className={`flex-1 h-11 rounded-md border flex items-center justify-center gap-2 transition-premium ${wished ? 'border-red-600 bg-red-950/40 text-red-300' : 'border-neutral-800 bg-black/40 text-neutral-300 hover:border-red-700'}`}>
                <Heart className={`w-4 h-4 ${wished ? 'fill-red-500' : ''}`} />
                <span className="font-cinzel tracking-widest uppercase text-[10px]">{wished ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>
              <button onClick={share} className="flex-1 h-11 rounded-md border border-neutral-800 bg-black/40 text-neutral-300 hover:border-red-700 flex items-center justify-center gap-2 transition-premium">
                <Share2 className="w-4 h-4" />
                <span className="font-cinzel tracking-widest uppercase text-[10px]">Share</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs: Description / Specs / Shipping / Returns / Reviews */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="glass-panel h-auto p-1 flex flex-wrap gap-1">
            <TabsTrigger value="description" className="font-cinzel tracking-widest uppercase text-[10px] data-[state=active]:bg-red-950/60 data-[state=active]:text-white">Description</TabsTrigger>
            <TabsTrigger value="specs"       className="font-cinzel tracking-widest uppercase text-[10px] data-[state=active]:bg-red-950/60 data-[state=active]:text-white">Specifications</TabsTrigger>
            <TabsTrigger value="shipping"    className="font-cinzel tracking-widest uppercase text-[10px] data-[state=active]:bg-red-950/60 data-[state=active]:text-white">Shipping</TabsTrigger>
            <TabsTrigger value="returns"     className="font-cinzel tracking-widest uppercase text-[10px] data-[state=active]:bg-red-950/60 data-[state=active]:text-white">Returns</TabsTrigger>
            <TabsTrigger value="reviews"     className="font-cinzel tracking-widest uppercase text-[10px] data-[state=active]:bg-red-950/60 data-[state=active]:text-white">Reviews ({reviews.total})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6 glass-panel rounded-xl p-6 md:p-8">
            <p className="text-neutral-300 leading-relaxed mb-5">{product.description}</p>
            {product.features?.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-neutral-400"><span className="text-red-500 mt-1">◆</span> {f}</li>)}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="specs" className="mt-6 glass-panel rounded-xl p-6 md:p-8">
            <table className="w-full text-sm">
              <tbody>
                {product.specifications.map(([k, v]) => (
                  <tr key={k} className="border-b border-neutral-900 last:border-b-0">
                    <td className="py-3 pr-4 text-neutral-500 uppercase tracking-widest text-xs font-cinzel w-1/3">{k}</td>
                    <td className="py-3 text-neutral-200">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6 glass-panel rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoRow icon={Truck} title="Shipping" body={product.shipping} />
            <InfoRow icon={ShieldCheck} title="Authentic" body="Every product sourced through authorized channels or graded/verified before shipment." />
            <InfoRow icon={PackageCheck} title="Careful Packaging" body="Sleeved, top-loaded, or bubble-wrapped as appropriate." />
            <InfoRow icon={Clock} title="Turnaround" body="Orders placed before 2 PM ET ship the same business day." />
          </TabsContent>

          <TabsContent value="returns" className="mt-6 glass-panel rounded-xl p-6 md:p-8">
            <p className="text-neutral-300 leading-relaxed">{product.returns}</p>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 space-y-6">
            <AverageRating average={reviews.average} total={reviews.total} breakdown={reviews.breakdown} />
            <div className="grid gap-4">
              {reviews.items.map((r) => <ReviewItem key={r.id} review={r} product={product} />)}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-20">
          <div className="text-center mb-10">
            <div className="text-red-500 tracking-[0.4em] text-xs font-semibold uppercase mb-3 font-cinzel">✦ You May Also Like ✦</div>
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white">Related Wares</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {related.map((p, i) => <ProductCard key={p.handle} product={p} index={i} />)}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <div className="mt-16">
          <div className="text-center mb-10">
            <div className="text-red-500 tracking-[0.4em] text-xs font-semibold uppercase mb-3 font-cinzel">Recently Viewed</div>
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-white">Return to the Hoard</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {recentProducts.map((p, i) => <ProductCard key={p.handle} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, title, body }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div>
        <div className="text-xs uppercase tracking-widest text-white font-cinzel mb-1">{title}</div>
        <div className="text-xs text-neutral-400 leading-relaxed">{body}</div>
      </div>
    </div>
  );
}
