import Link from 'next/link';
import { Package, Heart, MapPin, Settings, ArrowRight } from 'lucide-react';

const RECENT = [
  { id: 'RAT-1042', date: '2026-06-08', total: '$189.98', status: 'Delivered' },
  { id: 'RAT-1039', date: '2026-05-24', total: '$54.99',  status: 'Shipped' },
  { id: 'RAT-1030', date: '2026-05-11', total: '$29.99',  status: 'Fulfilled' },
];

export default function AccountOverview() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Orders', value: '7', icon: Package, href: '/account/orders' },
          { label: 'Wishlist', value: '—', icon: Heart, href: '/wishlist' },
          { label: 'Addresses', value: '2', icon: MapPin, href: '/account/profile' },
          { label: 'Settings', value: 'Manage', icon: Settings, href: '/account/settings' },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="glass-panel frame-corners rounded-lg p-5 hover:border-red-600/60 card-lift group">
            <s.icon className="w-6 h-6 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
            <div className="font-cinzel text-2xl text-white leading-none mb-1">{s.value}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel">{s.label}</div>
          </Link>
        ))}
      </div>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-cinzel text-xl text-white">Recent Orders</h2>
          <Link href="/account/orders" className="text-xs uppercase tracking-[0.3em] text-neutral-400 hover:text-red-400 font-cinzel inline-flex items-center gap-1.5">View all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="divide-y divide-neutral-900">
          {RECENT.map((o) => (
            <div key={o.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-cinzel text-white">{o.id}</div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">{o.date}</div>
              </div>
              <div className="text-right">
                <div className="font-cinzel text-red-400">{o.total}</div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-cinzel">{o.status}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
