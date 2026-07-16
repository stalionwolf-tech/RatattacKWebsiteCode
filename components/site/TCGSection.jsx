'use client';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconCoin, IconBell } from './MedievalIcons';

const PRODUCTS = [
  { name: 'Sealed Booster Box', rarity: 'Ultra Rare', price: '???' },
  { name: 'Charizard Vault Pull', rarity: 'Legendary', price: '???' },
  { name: 'Elite Trainer Box', rarity: 'Rare', price: '???' },
  { name: 'Vintage Base Set', rarity: 'Mythic', price: '???' },
];

export function TCGSection() {
  return (
    <section id="tcg" className="relative py-28 md:py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.06),transparent_60%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow="Coming Soon"
          title="Pokémon TCG Store"
          description="Sealed product, singles, and vintage vault pulls curated by RatAttacK. The rat hoards the good stuff."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-6xl mx-auto">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -8 }}
            >
              <Card className="group relative glass-panel frame-corners overflow-hidden hover:border-red-600/70 card-lift h-full">
                <div className="relative aspect-[3/4] bg-gradient-to-br from-red-950/30 via-neutral-900 to-black flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(220,38,38,0.05) 20px, rgba(220,38,38,0.05) 22px)',
                  }} />
                  <div className="text-red-800/70 group-hover:text-red-500 group-hover:scale-110 transition-premium">
                    <IconCoin size={72} />
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/80 border border-red-900 rounded text-[9px] uppercase tracking-[0.25em] text-red-400 font-cinzel">
                    Soon
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <div className="p-5">
                  <div className="text-[9px] uppercase tracking-[0.3em] text-red-500 font-cinzel mb-1.5">{p.rarity}</div>
                  <div className="font-semibold text-white text-sm mb-2 line-clamp-1">{p.name}</div>
                  <div className="text-xs text-neutral-500">Price: {p.price}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14"
        >
          <Button variant="outline" className="border-red-800/60 bg-black/40 hover:bg-red-950/40 text-neutral-200 h-12 px-6 transition-premium">
            <span className="mr-2 text-red-500"><IconBell size={16} /></span>
            <span className="font-cinzel tracking-widest uppercase text-xs">Notify Me When It Drops</span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
