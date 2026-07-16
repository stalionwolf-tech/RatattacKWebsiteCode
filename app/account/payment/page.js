'use client';
import { toast } from 'sonner';
import { CreditCard, ShieldCheck, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PAYMENT_METHODS } from '@/lib/account';

export default function PaymentPage() {
  const openShopify = () => toast.info('Opening Shopify Customer Accounts portal… (wired at go-live)');

  return (
    <>
      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Payment Methods</h2></div>
          <Button onClick={openShopify} className="h-11 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
            <ExternalLink className="w-4 h-4 mr-2" /><span className="font-cinzel tracking-widest uppercase text-[10px]">Edit Payment Methods</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAYMENT_METHODS.map((pm) => (
            <div key={pm.id} className={`relative glass-panel rounded-xl p-5 overflow-hidden ${pm.isDefault ? 'border-red-600/60' : ''}`}>
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(220,38,38,0.35), transparent 55%)' }} />
              {pm.isDefault && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded bg-red-600 text-white text-[9px] uppercase tracking-widest font-cinzel font-bold">Default</div>
              )}
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="font-cinzel text-lg text-white">{pm.brand}</div>
                  <CreditCard className="w-6 h-6 text-red-400" />
                </div>
                <div className="font-cinzel text-xl md:text-2xl tracking-[0.3em] text-neutral-100 mb-6">
                  ••••  ••••  ••••  {pm.last4}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-cinzel">Cardholder</div>
                    <div className="text-neutral-200">{pm.holder}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-cinzel">Expires</div>
                    <div className="text-neutral-200">{String(pm.expMonth).padStart(2, '0')}/{pm.expYear}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 glass-panel rounded-lg p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5" />
          <div className="text-xs text-neutral-400 leading-relaxed">
            Payment details are <span className="text-white">never stored on RatAttacK servers</span>. Cards are managed securely by Shopify Customer Accounts. Click <span className="text-red-400">Edit Payment Methods</span> above to add, remove, or update cards in Shopify’s secure portal.
          </div>
        </div>
      </section>
    </>
  );
}
