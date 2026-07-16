'use client';
import { IconCoin, IconChalice, IconShield, IconSkull, IconCrown, IconScroll } from '@/components/site/MedievalIcons';

const SIGILS = {
  coin: IconCoin,
  chalice: IconChalice,
  shield: IconShield,
  skull: IconSkull,
  crown: IconCrown,
  scroll: IconScroll,
};

const ACCENT_GRADIENTS = {
  crimson:      'from-red-900/40 via-neutral-900 to-black',
  'crimson-dark': 'from-red-950/50 via-black to-neutral-950',
  amber:        'from-amber-900/30 via-neutral-900 to-black',
  gold:         'from-yellow-900/25 via-neutral-900 to-black',
  purple:       'from-purple-900/30 via-neutral-900 to-black',
  neutral:      'from-neutral-800/40 via-neutral-900 to-black',
};

/**
 * Placeholder product artwork rendered as a stylized "pixel-art" trading card.
 * Automatically replaced when `product.featuredImage.url` is present
 * (which will happen once Shopify data is wired up).
 */
export function ProductArtwork({ product, size = 'md', variant = 'front', className = '' }) {
  const sigilKey = product?.featuredImage?.sigil || product?.sigil || 'coin';
  const accentKey = product?.featuredImage?.accent || product?.accent || 'crimson';
  const Sigil = SIGILS[sigilKey] || IconCoin;
  const gradient = ACCENT_GRADIENTS[accentKey] || ACCENT_GRADIENTS.crimson;

  // Optional real image if Shopify is wired
  const url = product?.featuredImage?.url;

  const iconSize = size === 'lg' ? 140 : size === 'sm' ? 56 : 96;

  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden ${className}`}>
      {url ? (
        <img src={url} alt={product?.featuredImage?.altText || product?.title || ''} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <>
          {/* Diagonal weave */}
          <div className="absolute inset-0 opacity-25" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(220,38,38,0.06) 22px, rgba(220,38,38,0.06) 24px)',
          }} />
          {/* Radial red aura */}
          <div className="absolute inset-0 opacity-40" style={{
            background: 'radial-gradient(circle at 50% 35%, rgba(220,38,38,0.22), transparent 55%)',
          }} />

          {/* Pixel-art trading card frame */}
          <div className="relative flex flex-col items-center">
            {size === 'lg' && (
              <div className="text-[9px] uppercase tracking-[0.4em] text-red-300/80 font-cinzel mb-2">
                {product?.productType || 'RatAttacK'}
              </div>
            )}
            <div className="text-red-800/85 drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Sigil size={iconSize} />
            </div>
            {size === 'lg' && (
              <div className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 font-cinzel mt-3">
                {variant === 'back' ? 'Reverse' : variant === 'detail' ? 'Detail' : 'Sigil'}
              </div>
            )}
          </div>

          {/* Corners */}
          <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-red-700/60" />
          <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-red-700/60" />
          <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-red-700/60" />
          <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-red-700/60" />
        </>
      )}
    </div>
  );
}
