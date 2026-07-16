const ORDERS = [
  { id: 'RAT-1042', date: '2026-06-08', total: '$189.98', status: 'Delivered', items: 2 },
  { id: 'RAT-1039', date: '2026-05-24', total: '$54.99',  status: 'Shipped',   items: 1 },
  { id: 'RAT-1030', date: '2026-05-11', total: '$29.99',  status: 'Fulfilled', items: 1 },
  { id: 'RAT-1015', date: '2026-04-02', total: '$149.99', status: 'Delivered', items: 1 },
];

const STATUS_TINT = {
  Delivered: 'text-emerald-300 border-emerald-800/70 bg-emerald-950/40',
  Shipped:   'text-amber-300 border-amber-800/70 bg-amber-950/40',
  Fulfilled: 'text-red-300 border-red-800/70 bg-red-950/40',
};

export default function OrdersPage() {
  return (
    <section className="glass-panel frame-corners rounded-xl p-6">
      <h2 className="font-cinzel text-xl text-white mb-5">Your Orders</h2>
      <div className="space-y-3">
        {ORDERS.map((o) => (
          <div key={o.id} className="flex items-center justify-between gap-4 flex-wrap p-4 rounded-lg border border-neutral-900 bg-black/40 hover:border-red-800 transition-premium">
            <div>
              <div className="font-cinzel text-white text-lg">{o.id}</div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">Placed {o.date} · {o.items} item{o.items === 1 ? '' : 's'}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-cinzel text-red-400 text-lg">{o.total}</div>
              <div className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.25em] font-cinzel border ${STATUS_TINT[o.status]}`}>{o.status}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
