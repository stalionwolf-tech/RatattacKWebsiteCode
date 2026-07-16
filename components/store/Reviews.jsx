'use client';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { ProductArtwork } from './ProductArtwork';
import { Stars } from './ProductCard';

export function AverageRating({ average, total, breakdown }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 glass-panel rounded-xl p-6 md:p-8">
      <div className="text-center md:border-r md:border-red-900/30 md:pr-6">
        <div className="font-cinzel text-6xl md:text-7xl text-white text-glow leading-none mb-3">{average.toFixed(1)}</div>
        <div className="flex justify-center mb-2"><Stars rating={average} size={18} /></div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-cinzel">Based on {total} reviews</div>
      </div>
      <div className="md:col-span-2 space-y-2">
        {[5,4,3,2,1].map((star, i) => {
          const count = breakdown[i] || 0;
          const pct = total ? (count / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-10">
                <span className="text-xs text-neutral-400 font-cinzel">{star}</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </div>
              <div className="flex-1 h-2 bg-neutral-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-red-700 to-red-500"
                />
              </div>
              <span className="text-xs text-neutral-500 w-8 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ReviewItem({ review, product }) {
  const date = new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-lg p-5 md:p-6"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-cinzel text-white text-sm">{review.author}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-emerald-400 font-cinzel">
                <CheckCircle2 className="w-3 h-3" /> Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Stars rating={review.rating} />
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">{date}</span>
          </div>
        </div>
      </div>
      <h4 className="font-cinzel text-white text-base mb-2">{review.title}</h4>
      <p className="text-sm text-neutral-400 leading-relaxed mb-3">{review.body}</p>
      {review.images?.length > 0 && (
        <div className="flex gap-2 mb-3">
          {review.images.map((img, i) => (
            <div key={i} className="w-16 h-16 rounded overflow-hidden border border-neutral-800">
              <ProductArtwork product={{ sigil: img.sigil, accent: img.accent, productType: 'Review' }} size="sm" />
            </div>
          ))}
        </div>
      )}
      <button className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-red-400 transition-colors">
        <ThumbsUp className="w-3.5 h-3.5" />
        <span className="uppercase tracking-widest font-cinzel">Helpful ({review.helpful})</span>
      </button>
    </motion.article>
  );
}
