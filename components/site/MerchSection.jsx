'use client';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconShield, IconBell } from './MedievalIcons';

const ITEMS = [
  { name: 'Rat Crest Tee', tag: 'Apparel' },
  { name: 'Crimson Signet Hoodie', tag: 'Apparel' },
  { name: 'Rat Sigil Enamel Pin', tag: 'Accessory' },
  { name: 'Dark Fantasy Poster', tag: 'Print' },
];

export function MerchSection() {
  return (
    <section id="merch" className="relative py-28 md:py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.06),transparent_60%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow="Coming Soon"
          title="Merchandise"
          description="Wearable dark fantasy. Forged for those who ride at dawn and die at dusk."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-6xl mx-auto">
          {ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -8 }}
            >
              <Card className="group relative glass-panel frame-corners overflow-hidden hover:border-red-600/70 card-lift h-full">
                <div className="relative aspect-square bg-gradient-to-br from-neutral-900 via-black to-red-950/30 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(220,38,38,0.3), transparent 40%)',
                  }} />
                  <div className="text-red-800/70 group-hover:text-red-500 group-hover:scale-110 transition-premium">
                    <IconShield size={80} />
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/80 border border-red-900 rounded text-[9px] uppercase tracking-[0.25em] text-red-400 font-cinzel">
                    Soon
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[9px] uppercase tracking-[0.3em] text-red-500 font-cinzel mb-1.5">{item.tag}</div>
                  <div className="font-semibold text-white text-sm mb-2 line-clamp-1">{item.name}</div>
                  <div className="text-xs text-neutral-500">Coming Soon</div>
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
            <span className="font-cinzel tracking-widest uppercase text-xs">Notify Me at Launch</span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
