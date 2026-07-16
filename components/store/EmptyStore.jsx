'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PackageOpen, Sparkles, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Shown whenever a Shopify query returns zero products.
 * The site never renders mock products — this is what users see until
 * the merchant adds real inventory in Shopify Admin.
 */
export function EmptyStore({
  title = 'The Vault is Being Forged',
  eyebrow = 'Coming Soon',
  message = 'Sealed product, singles, and merch are being catalogued as we speak. Return shortly, or join the horde to be notified the moment the vault opens.',
  ctas = [
    { href: '/#community',  label: 'Join Discord',        variant: 'primary' },
    { href: '/videos',      label: 'Watch on YouTube',    variant: 'ghost' },
  ],
  showIcon = true,
}) {
  return (
    <section className="container mx-auto px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center glass-panel frame-corners rounded-2xl p-10 md:p-14 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {showIcon && (
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-950/40 border border-red-800/70 flex items-center justify-center text-red-400 shadow-[0_0_40px_-10px_rgba(220,38,38,0.7)]">
              <PackageOpen className="w-9 h-9" />
            </div>
          </div>
        )}

        <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-3 font-cinzel inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" /> {eyebrow}
        </div>
        <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-4">{title}</h2>
        <p className="text-neutral-400 leading-relaxed max-w-lg mx-auto mb-8">{message}</p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {ctas.map((c) => (
            c.variant === 'primary' ? (
              <Button asChild key={c.href + c.label} className="h-12 px-6 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red glow-red">
                <Link href={c.href}>
                  <span className="font-cinzel tracking-widest uppercase text-xs">{c.label}</span>
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" key={c.href + c.label} className="h-12 px-6 border-red-800/60 bg-black/40 hover:bg-red-950/40 hover:border-red-600 text-neutral-200">
                <Link href={c.href}>
                  <span className="font-cinzel tracking-widest uppercase text-xs">{c.label}</span>
                </Link>
              </Button>
            )
          ))}
        </div>

        <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel inline-flex items-center gap-2">
          <Bell className="w-3 h-3" /> Subscribe below for a raven when the vault opens
        </p>
      </motion.div>
    </section>
  );
}
