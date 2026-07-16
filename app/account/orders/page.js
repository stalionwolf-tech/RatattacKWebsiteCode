import Link from 'next/link';
import { ProductArtwork } from '@/components/store/ProductArtwork';
import { getProductByHandle } from '@/lib/products';
import { ORDERS, STATUS_LABEL, STATUS_TINT } from '@/lib/account';

export default function OrdersPage() {
  return (
    <section className="glass-panel frame-corners rounded-xl p-6">
      <h2 className="font-cinzel text-xl text-white mb-5">Your Orders</h2>
      <div className="space-y-4">
        {ORDERS.map((o) => (
          <Link key={o.id} href={`/account/order/${o.id}`} className="block glass-panel rounded-lg p-4 hover:border-red-600/60 card-lift group">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <div>
                <div className="font-cinzel text-white text-lg">{o.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">Placed {o.processedAt} · {o.items.length} item{o.items.length === 1 ? '' : 's'}</div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-cinzel mt-1">{o.carrier} · {o.trackingNumber}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-cinzel text-red-400 text-lg">${o.total.toFixed(2)}</div>
                <div className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.25em] font-cinzel border ${STATUS_TINT[o.fulfillmentStatus]}`}>{STATUS_LABEL[o.fulfillmentStatus]}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {o.items.map((it) => {
                const p = getProductByHandle(it.handle);
                return (
                  <div key={it.handle} className="flex items-center gap-2 pr-3 pl-1 py-1 rounded-md border border-neutral-800 bg-black/40">
                    <div className="w-9 h-11 rounded overflow-hidden border border-neutral-800 flex-shrink-0"><ProductArtwork product={p || { sigil: 'coin', accent: 'crimson' }} size="sm" /></div>
                    <div className="text-xs text-neutral-300"><span className="text-neutral-500">×{it.quantity}</span> {it.title}</div>
                  </div>
                );
              })}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
