'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { ProductArtwork } from '@/components/store/ProductArtwork';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { formatPrice, getProductByHandle, AVAILABILITY_META } from '@/lib/products';
import { useCart, useWishlist, openCartDrawer } from '@/lib/store-hooks';

export default function WishlistPage() {
  const wish = useWishlist();
  const cart = useCart();
  const products = wish.items.map(getProductByHandle).filter(Boolean);

  const moveToCart = (p) => {
    cart.add(p, 1);
    wish.remove(p.handle);
    toast.success(`Moved “${p.title}” to cart`);
    openCartDrawer();
  };

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <ScrollingBackdrop />
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />
      <CartDrawer />
      <Toaster theme="dark" position="bottom-right" />

      <main className="relative z-10 container mx-auto px-6 pt-32 md:pt-40 pb-20">
        <div className="text-center mb-10">
          <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-3 font-cinzel">✦ The Reliquary ✦</div>
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white mb-3">Wishlist</h1>
          <p className="text-neutral-400">{products.length} {products.length === 1 ? 'item' : 'items'} saved for later.</p>
        </div>

        {products.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center glass-panel frame-corners rounded-2xl p-10">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-950/40 border border-red-900/60 flex items-center justify-center text-red-400"><Heart className="w-7 h-7" /></div>
            <h3 className="font-cinzel text-2xl text-white mb-2">Your Reliquary is Empty</h3>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">Bookmark hoodies, boxes, and singles for later. They’ll wait for you here.</p>
            <Button asChild className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
              <Link href="/store"><span className="font-cinzel tracking-widest uppercase text-xs">Browse Store</span></Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {products.map((p, i) => {
              const status = AVAILABILITY_META[p.availability];
              return (
                <motion.div key={p.handle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel frame-corners rounded-xl overflow-hidden flex flex-col">
                  <Link href={`/store/product/${p.handle}`} className="relative aspect-[4/5] block group">
                    <ProductArtwork product={p} />
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.25em] font-cinzel border ${status.tint}`}>{status.label}</div>
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-cinzel mb-1.5">{p.productType}</div>
                    <Link href={`/store/product/${p.handle}`} className="font-cinzel text-sm text-white hover:text-red-300 leading-snug mb-3 line-clamp-2 transition-colors">{p.title}</Link>
                    <div className="font-cinzel text-lg text-red-400 mb-4">{formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}</div>
                    <div className="grid grid-cols-[1fr_auto] gap-2 mt-auto">
                      <Button onClick={() => moveToCart(p)} className="h-10 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
                        <ShoppingCart className="w-4 h-4 mr-2" /><span className="font-cinzel tracking-widest uppercase text-[10px]">Move to Cart</span>
                      </Button>
                      <button onClick={() => { wish.remove(p.handle); toast.message('Removed from wishlist'); }} aria-label="Remove" className="w-10 h-10 rounded-md border border-neutral-800 bg-black/40 text-neutral-400 hover:text-red-400 hover:border-red-800 flex items-center justify-center transition-premium">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
