'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, ShieldCheck, CreditCard, Truck, CheckCircle2, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { ProductArtwork } from '@/components/store/ProductArtwork';
import { formatPrice, getProductByHandle } from '@/lib/products';
import { useCart } from '@/lib/store-hooks';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function CheckoutPage() {
  const { items, subtotal, shipping, tax, total, count } = useCart();
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);
  const grandTotal = Math.max(0, total - discount);

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    if (code === 'RATHORDE10') { setDiscount(subtotal * 0.1); toast.success('10% discount applied'); }
    else { toast.error('Invalid code'); }
  };

  const place = async (e) => {
    e.preventDefault();
    if (!items.length) { toast.error('Your cart is empty.'); return; }
    setPlacing(true);
    try {
      const lines = items.map((i) => ({ merchandiseId: i.key, quantity: i.quantity }));
      const res = await fetch('/api/shopify/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) { window.location.href = data.checkoutUrl; return; }
      }
      if (res.status === 422) {
        toast.info('Demo cart — no live Shopify items yet. Once you add these products to Shopify, checkout will route to the real hosted checkout.');
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error || 'Checkout failed.');
      }
    } catch (err) {
      toast.error(err?.message || 'Network error.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <ScrollingBackdrop />
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />
      <Toaster theme="dark" position="bottom-right" />

      <main className="relative z-10 container mx-auto px-6 pt-32 md:pt-40 pb-20">
        <Link href="/cart" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-400 hover:text-red-400 font-cinzel transition-colors mb-6"><ChevronLeft className="w-4 h-4" /> Back to Cart</Link>

        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-2 font-cinzel">Secure Checkout</div>
            <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white">Complete Order</h1>
          </div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-cinzel">
            <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> SSL</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PCI</span>
            <span className="inline-flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Encrypted</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
          <form onSubmit={place} className="space-y-8">
            <section className="glass-panel frame-corners rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5"><span className="w-8 h-8 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400 font-cinzel text-sm">1</span><h2 className="font-cinzel text-xl text-white">Contact</h2></div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Email" type="email" placeholder="knight@darklands.com" required />
                <Field label="Phone" type="tel" placeholder="(555) 123-4567" />
              </div>
            </section>

            <section className="glass-panel frame-corners rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5"><span className="w-8 h-8 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400 font-cinzel text-sm">2</span><h2 className="font-cinzel text-xl text-white">Shipping Address</h2></div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="First name" required />
                <Field label="Last name" required />
                <div className="md:col-span-2"><Field label="Address" required /></div>
                <div className="md:col-span-2"><Field label="Apt / Suite (optional)" /></div>
                <Field label="City" required />
                <Field label="State" required />
                <Field label="ZIP" required />
                <Field label="Country" defaultValue="United States" required />
              </div>
            </section>

            <section className="glass-panel frame-corners rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5"><span className="w-8 h-8 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400 font-cinzel text-sm">3</span><h2 className="font-cinzel text-xl text-white">Shipping Method</h2></div>
              <div className="space-y-2">
                {[{name:'Standard (3–5 business days)', price: 0}, {name:'Express (1–2 business days)', price: 12.99}, {name:'Overnight', price: 24.99}].map((m, i) => (
                  <label key={m.name} className="flex items-center justify-between gap-3 p-4 rounded-lg border border-neutral-800 bg-black/40 hover:border-red-800 transition-premium cursor-pointer has-[:checked]:border-red-600 has-[:checked]:bg-red-950/40">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="ship" defaultChecked={i === 0} className="accent-red-600" />
                      <div><div className="font-cinzel text-sm text-white">{m.name}</div></div>
                    </div>
                    <span className="font-cinzel text-red-400">{m.price === 0 ? 'Free' : formatPrice(m.price)}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="glass-panel frame-corners rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5"><span className="w-8 h-8 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400 font-cinzel text-sm">4</span><h2 className="font-cinzel text-xl text-white">Payment</h2></div>
              <div className="space-y-4">
                <Field label="Card number" placeholder="1234 5678 9012 3456" required />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiration (MM/YY)" placeholder="12/28" required />
                  <Field label="CVC" placeholder="123" required />
                </div>
                <label className="flex items-center gap-2 text-xs text-neutral-400"><input type="checkbox" className="accent-red-600" defaultChecked /> Billing address same as shipping</label>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel mt-5">Card fields above are for preview only. Real payments run through Shopify's secure hosted checkout when you click Place Order.</p>
            </section>

            <Button type="submit" disabled={placing} size="lg" className="w-full h-16 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-2 border-red-800 glow-red-strong animate-pulse-glow btn-glow-red disabled:opacity-70">
              {placing ? (
                <><Loader2 className="w-5 h-5 mr-3 animate-spin" /><span className="font-cinzel tracking-widest uppercase text-sm">Redirecting to Shopify…</span></>
              ) : (
                <><Lock className="w-5 h-5 mr-3" /><span className="font-cinzel tracking-widest uppercase text-sm">Place Order — {formatPrice(grandTotal)}</span></>
              )}
            </Button>
          </form>

          {/* Order Summary */}
          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="glass-panel frame-corners rounded-xl p-6">
              <h3 className="font-cinzel text-lg text-white mb-4">Order Summary</h3>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-5">
                {items.map((item) => {
                  const p = getProductByHandle(item.handle);
                  return (
                    <div key={item.key} className="flex gap-3">
                      <div className="w-14 h-16 rounded overflow-hidden border border-neutral-800 flex-shrink-0 relative">
                        <ProductArtwork product={p || { sigil: item.image?.sigil, accent: item.image?.accent }} />
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center border border-red-900">{item.quantity}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-cinzel text-xs text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-cinzel">{item.variantTitle}</div>
                        <div className="text-xs text-red-400 mt-1">{formatPrice(item.price * item.quantity, item.currency)}</div>
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && <div className="text-sm text-neutral-500 text-center py-4">Your cart is empty.</div>}
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code" className="pl-10 bg-black/60 border-neutral-800 focus:border-red-600 h-11" />
                  </div>
                  <Button type="button" onClick={applyPromo} variant="outline" className="h-11 border-red-800/60 bg-black/40 hover:bg-red-950/40">
                    <span className="font-cinzel tracking-widest uppercase text-xs">Apply</span>
                  </Button>
                </div>
                <p className="text-[10px] text-neutral-500">Try <code className="text-red-400">RATHORDE10</code></p>
              </div>

              <div className="mt-5 pt-5 border-t border-neutral-900 space-y-2 text-sm">
                <Line label="Subtotal" value={formatPrice(subtotal)} />
                <Line label="Shipping" value={shipping === 0 ? 'Free' : formatPrice(shipping)} />
                <Line label="Tax (8%)" value={formatPrice(tax)} muted />
                {discount > 0 && <Line label="Discount" value={`-${formatPrice(discount)}`} accent />}
                <div className="mt-3 pt-3 border-t border-neutral-900 flex justify-between items-baseline">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-cinzel">Grand Total</span>
                  <span className="font-cinzel text-2xl text-red-400 text-glow">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-cinzel">SSL Encrypted · Trusted Merchant · 30-Day Returns</div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, ...props }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-cinzel">{label}</Label>
      <Input id={id} className="bg-black/60 border-neutral-800 focus:border-red-600 h-11" {...props} />
    </div>
  );
}

function Line({ label, value, muted, accent }) {
  return (
    <div className="flex justify-between">
      <span className={muted ? 'text-neutral-500' : 'text-neutral-300'}>{label}</span>
      <span className={accent ? 'text-emerald-400' : muted ? 'text-neutral-500' : 'text-white'}>{value}</span>
    </div>
  );
}
