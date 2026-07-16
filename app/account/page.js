'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Heart, Boxes, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';

function Stat({ icon: Icon, label, value, href }) {
  const body = (
    <div className="glass-panel frame-corners rounded-xl p-5 hover:border-red-700/60 transition-colors group">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-9 h-9 rounded-full bg-red-950/40 border border-red-800 flex items-center justify-center text-red-400"><Icon className="w-4 h-4" /></span>
        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">{label}</span>
      </div>
      <div className="font-cinzel text-3xl text-white">{value}</div>
    </div>
  );
  return href ? <Link href={href} className="block">{body}</Link> : body;
}

export default function AccountOverview() {
  const { user } = useAuth();
  const firstName = user?.firstName || 'Raider';

  return (
    <>
      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="text-[10px] uppercase tracking-widest text-red-500 font-cinzel mb-2">Welcome back</div>
        <h2 className="font-cinzel text-2xl md:text-3xl text-white mb-1">{firstName}</h2>
        <p className="text-sm text-neutral-400">You’re signed in as <span className="text-neutral-200">{user?.email}</span>. Explore the vault, track raids, and keep an eye on your loot.</p>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={Package}     label="Orders"       value={0} href="/account/orders" />
        <Stat icon={Heart}       label="Wishlist"     value={0} href="/account/wishlist" />
        <Stat icon={Boxes}       label="Vault"        value={0} href="/account/vault" />
        <Stat icon={Sparkles}    label="Achievements" value={"0/6"} />
      </div>

      <section className="glass-panel frame-corners rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-950/40 border border-red-800 flex items-center justify-center text-red-400">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div className="text-[10px] uppercase tracking-widest text-red-500 font-cinzel mb-2">No orders yet</div>
        <h3 className="font-cinzel text-xl md:text-2xl text-white mb-2">The Vault Awaits Your First Raid</h3>
        <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
          You haven’t placed an order yet. Browse the store, claim sealed product or singles, and your history will appear here.
        </p>
        <Button asChild className="h-11 px-6 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
          <Link href="/store"><span className="font-cinzel tracking-widest uppercase text-xs">Browse Store</span><ArrowRight className="w-4 h-4 ml-2" /></Link>
        </Button>
      </section>
    </>
  );
}
