'use client';
import Link from 'next/link';
import { toast } from 'sonner';
import { Heart, ShoppingCart, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductArtwork } from '@/components/store/ProductArtwork';
import { getProductByHandle, AVAILABILITY_META, formatPrice } from '@/lib/products';
import { useCart, useWishlist, openCartDrawer } from '@/lib/store-hooks';

export default function AccountWishlistPage() {
  const wish = useWishlist();
  const cart = useCart();
  const products = wish.items.map(getProductByHandle).filter(Boolean);

  const move = (p) => { cart.add(p, 1); wish.remove(p.handle); toast.success(`Moved “${p.title}” to cart`); openCartDrawer(); };
  const share = async () => {
    const list = products.map(p => `• ${p.title}`).join('\n');
    const text = `My RatAttacK wishlist:\n${list || '(empty)'}\n${window.location.origin}/account/wishlist`;
    try {
      if (navigator.share) await navigator.share({ title: 'RatAttacK Wishlist', text });
      else { await navigator.clipboard.writeText(text); toast.success('Wishlist copied to clipboard'); }
    } catch {}
  };

  return (
    <section className="glass-panel frame-corners rounded-xl p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div>
          <h2 className="font-cinzel text-xl text-white">Wishlist</h2>
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel mt-1">{products.length} saved</p>
        </div>
        <Button onClick={share} variant="outline" className="h-10 border-red-800/60 bg-black/40 hover:bg-red-950/40">
          <Share2 className="w-4 h-4 mr-2 text-red-400" /><span className="font-cinzel tracking-widest uppercase text-[10px]">Share Wishlist</span>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-14">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-950/40 border border-red-900/60 flex items-center justify-center text-red-400"><Heart className="w-6 h-6" /></div>
          <div className="font-cinzel text-lg text-white mb-2">Your Reliquary is Empty</div>
          <p className="text-sm text-neutral-400 mb-5">Bookmark items to save them here.</p>
          <Button asChild className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
            <Link href="/store"><span className="font-cinzel tracking-widest uppercase text-xs">Browse Store</span></Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => {
            const status = AVAILABILITY_META[p.availability];
            return (
              <div key={p.handle} className="glass-panel frame-corners rounded-xl overflow-hidden flex flex-col">
                <Link href={`/store/product/${p.handle}`} className="relative aspect-[4/5] block">
                  <ProductArtwork product={p} />
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.25em] font-cinzel border ${status.tint}`}>{status.label}</div>
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-cinzel mb-1.5">{p.productType}</div>
                  <Link href={`/store/product/${p.handle}`} className="font-cinzel text-sm text-white hover:text-red-300 leading-snug mb-3 line-clamp-2">{p.title}</Link>
                  <div className="font-cinzel text-lg text-red-400 mb-4">{formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}</div>
                  <div className="grid grid-cols-[1fr_auto] gap-2 mt-auto">
                    <Button onClick={() => move(p)} className="h-10 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
                      <ShoppingCart className="w-4 h-4 mr-2" /><span className="font-cinzel tracking-widest uppercase text-[10px]">Move to Cart</span>
                    </Button>
                    <button onClick={() => { wish.remove(p.handle); toast.message('Removed'); }} className="w-10 h-10 rounded-md border border-neutral-800 bg-black/40 text-neutral-400 hover:text-red-400 hover:border-red-800 flex items-center justify-center transition-premium"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
