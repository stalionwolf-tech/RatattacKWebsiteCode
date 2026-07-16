import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Truck } from 'lucide-react';
import { ProductArtwork } from '@/components/store/ProductArtwork';
import { getProductByHandle } from '@/lib/products';
import { getOrder, ORDERS, STATUS_LABEL, STATUS_TINT } from '@/lib/account';

export async function generateStaticParams() { return ORDERS.map((o) => ({ id: o.id })); }

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const o = getOrder(id);
  if (!o) notFound();
  const subtotal = o.items.reduce((s, i) => s + i.price * i.quantity, 0);
  return (
    <>
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-400 hover:text-red-400 font-cinzel transition-colors"><ChevronLeft className="w-4 h-4" /> All Orders</Link>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
          <div>
            <div className="text-red-500 tracking-[0.4em] text-[10px] uppercase mb-1 font-cinzel">Order</div>
            <h2 className="font-cinzel text-2xl md:text-3xl text-white">{o.name}</h2>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel mt-1">Placed {o.processedAt}</div>
          </div>
          <div className={`px-3 py-1.5 rounded text-[10px] uppercase tracking-[0.25em] font-cinzel border ${STATUS_TINT[o.fulfillmentStatus]}`}>{STATUS_LABEL[o.fulfillmentStatus]}</div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg border border-neutral-900 bg-black/40 mb-6">
          <Truck className="w-5 h-5 text-red-500" />
          <div>
            <div className="text-xs uppercase tracking-widest text-white font-cinzel">Tracking</div>
            <div className="text-xs text-neutral-400">{o.carrier} · <span className="text-neutral-200">{o.trackingNumber}</span></div>
          </div>
        </div>

        <div className="space-y-3">
          {o.items.map((it) => {
            const p = getProductByHandle(it.handle);
            return (
              <div key={it.handle} className="flex gap-3 glass-panel rounded-lg p-3">
                <div className="w-16 h-20 rounded overflow-hidden border border-neutral-800 flex-shrink-0"><ProductArtwork product={p || { sigil: 'coin', accent: 'crimson' }} size="sm" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-cinzel text-white text-sm">{it.title}</div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">Qty {it.quantity}</div>
                </div>
                <div className="font-cinzel text-red-400">${(it.price * it.quantity).toFixed(2)}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-900 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-400">Subtotal</span><span className="text-white">${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-neutral-400">Shipping</span><span className="text-white">Included</span></div>
          <div className="pt-2 border-t border-neutral-900 flex justify-between items-baseline">
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-cinzel">Total</span>
            <span className="font-cinzel text-2xl text-red-400 text-glow">${o.total.toFixed(2)}</span>
          </div>
        </div>
      </section>
    </>
  );
}
