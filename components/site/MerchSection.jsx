'use client';
import { motion } from 'framer-motion';
import { Shirt, Bell } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ITEMS = [
  { name: 'Rat Crest Tee', tag: 'Apparel' },
  { name: 'Crimson Signet Hoodie', tag: 'Apparel' },
  { name: 'Rat Sigil Enamel Pin', tag: 'Accessory' },
  { name: 'Dark Fantasy Poster', tag: 'Print' },
];

export function MerchSection() {
  return (
    <section id="merch" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.06),transparent_60%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow="Coming Soon"
          title="Merchandise"
          description="Wearable dark fantasy. Forged for those who ride at dawn and die at dusk."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Card className="group relative glass-panel overflow-hidden hover:border-red-600/60 transition-all duration-500 h-full">
                <div className="relative aspect-square bg-gradient-to-br from-neutral-900 via-black to-red-950/30 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(220,38,38,0.3), transparent 40%)',
                  }} />
                  <Shirt className="w-20 h-20 text-red-800/60 group-hover:scale-110 group-hover:text-red-600 transition-all duration-500" />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 border border-red-900 rounded text-[10px] uppercase tracking-widest text-red-400 font-cinzel">
                    Soon
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-widest text-red-500 font-cinzel mb-1">{item.tag}</div>
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
          className="text-center mt-12"
        >
          <Button variant="outline" className="border-red-800/60 bg-black/40 hover:bg-red-950/40 text-neutral-200">
            <Bell className="w-4 h-4 mr-2 text-red-500" /> Notify Me at Launch
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
