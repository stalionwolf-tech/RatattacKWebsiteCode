'use client';
import Link from 'next/link';
import { Package, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Order history is sourced from Shopify Customer Accounts once integrated.
 * Until then we deliberately render an empty state — never fake orders.
 */
export default function OrdersPage() {
  return (
    <section className="glass-panel frame-corners rounded-xl p-8 md:p-14 text-center">
      <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-950/40 border border-red-800 flex items-center justify-center text-red-400">
        <Package className="w-7 h-7" />
      </div>
      <div className="text-[10px] uppercase tracking-widest text-red-500 font-cinzel mb-3">Orders</div>
      <h2 className="font-cinzel text-2xl md:text-3xl text-white mb-3">No orders yet.</h2>
      <p className="text-neutral-400 max-w-md mx-auto mb-8">
        Your purchase history will appear here after you complete an order. Sealed product, singles, and merch are all logged in your account.
      </p>
      <Button asChild className="h-11 px-6 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
        <Link href="/store"><ShoppingBag className="w-4 h-4 mr-2" /><span className="font-cinzel tracking-widest uppercase text-xs">Browse Store</span><ArrowRight className="w-4 h-4 ml-2" /></Link>
      </Button>
    </section>
  );
}
