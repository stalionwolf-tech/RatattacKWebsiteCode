'use client';
import Link from 'next/link';
import { Boxes, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * The Vault — the user's curated collections. Empty by default. Real vault
 * management will land alongside Shopify Customer Accounts + saved lists.
 */
export default function VaultPage() {
  return (
    <section className="glass-panel frame-corners rounded-xl p-8 md:p-14 text-center">
      <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-950/40 border border-red-800 flex items-center justify-center text-red-400">
        <Boxes className="w-7 h-7" />
      </div>
      <div className="text-[10px] uppercase tracking-widest text-red-500 font-cinzel mb-3">Vault</div>
      <h2 className="font-cinzel text-2xl md:text-3xl text-white mb-3">The Vault is empty.</h2>
      <p className="text-neutral-400 max-w-md mx-auto mb-8">
        Build custom collections — pull targets, chase cards, unopened stashes — and stake claim to your favorite gear. New collections you create will appear here.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild className="h-11 px-6 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
          <Link href="/store"><Sparkles className="w-4 h-4 mr-2" /><span className="font-cinzel tracking-widest uppercase text-xs">Browse Store</span></Link>
        </Button>
        <Button asChild variant="outline" className="h-11 px-6 border-red-800/60 bg-black/40 hover:bg-red-950/40">
          <Link href="/account/wishlist"><span className="font-cinzel tracking-widest uppercase text-xs">Open Wishlist</span><ArrowRight className="w-4 h-4 ml-2" /></Link>
        </Button>
      </div>
    </section>
  );
}
