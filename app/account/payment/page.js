'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { CreditCard, Plus, Trash2, Star, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePaymentMethods } from '@/lib/account-hooks';

function Field({ label, ...props }) {
  const id = `p-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel">{label}</Label>
      <Input id={id} className="bg-black/60 border-neutral-800 focus:border-red-600 h-11" {...props} />
    </div>
  );
}

export default function PaymentPage() {
  const { methods, add, remove, setDefault } = usePaymentMethods();
  const [open, setOpen]   = useState(false);
  const [num, setNum]     = useState('');
  const [exp, setExp]     = useState('');
  const [cvc, setCvc]     = useState('');
  const [name, setName]   = useState('');
  const [busy, setBusy]   = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const [mm, yy] = exp.split('/').map((s) => s.trim());
    if (!mm || !yy || Number(mm) < 1 || Number(mm) > 12) { toast.error('Invalid expiration. Use MM/YY.'); return; }
    setBusy(true);
    try {
      add({ cardNumber: num, expMonth: mm, expYear: yy, cardholderName: name });
      toast.success('Payment method added.');
      setNum(''); setExp(''); setCvc(''); setName('');
      setOpen(false);
    } catch (err) {
      toast.error(err?.message || 'Could not add card.');
    } finally { setBusy(false); }
  };

  return (
    <>
      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Payment Methods</h2></div>
          <Button onClick={() => setOpen((v) => !v)} className="h-9 px-3 bg-red-950/40 border border-red-800 hover:bg-red-900/50">
            <Plus className="w-3.5 h-3.5 mr-1.5" /><span className="font-cinzel tracking-widest uppercase text-[10px]">{open ? 'Close' : 'Add Card'}</span>
          </Button>
        </div>

        <div className="flex items-start gap-2 mb-4 text-[10px] uppercase tracking-widest text-amber-400/80 font-cinzel bg-amber-950/20 border border-amber-900/50 rounded-lg p-3">
          <Lock className="w-3.5 h-3.5 mt-0.5" />
          <span>Preview only. Real payments run through Shopify’s PCI-compliant hosted checkout — no card data is transmitted from this site.</span>
        </div>

        {methods.length === 0 ? (
          <div className="text-center py-10">
            <div className="font-cinzel text-neutral-300 mb-2">No payment methods stored.</div>
            <p className="text-sm text-neutral-500">Add a preview card to see how the account panel will look with real methods.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((m) => (
              <div key={m.id} className={`flex items-center justify-between glass-panel rounded-lg p-4 border ${m.isDefault ? 'border-red-700/70' : 'border-neutral-900'}`}>
                <div>
                  <div className="font-cinzel text-white">{m.brand} •••• {m.last4}</div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">Exp {m.expMonth}/{m.expYear} {m.isDefault ? '· Default' : ''}</div>
                </div>
                <div className="flex gap-3">
                  {!m.isDefault ? (
                    <button onClick={() => setDefault(m.id)} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-red-400 font-cinzel">
                      <Star className="w-3 h-3" /> Default
                    </button>
                  ) : null}
                  <button onClick={() => { remove(m.id); toast.info('Card removed.'); }} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-red-400 font-cinzel">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {open ? (
        <section className="glass-panel frame-corners rounded-xl p-6">
          <h3 className="font-cinzel text-lg text-white mb-4">Add Card (preview)</h3>
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
            <Field label="Cardholder name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="As shown on card" />
            <Field label="Card number"      value={num}  onChange={(e) => setNum(e.target.value)}  required placeholder="4242 4242 4242 4242" inputMode="numeric" />
            <Field label="Expiration (MM/YY)" value={exp} onChange={(e) => setExp(e.target.value)} required placeholder="12/28" />
            <Field label="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} required placeholder="123" inputMode="numeric" />
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={busy} className="h-11 px-6 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red disabled:opacity-70">
                {busy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span className="font-cinzel tracking-widest uppercase text-[10px]">Saving…</span></> : <span className="font-cinzel tracking-widest uppercase text-[10px]">Save Card</span>}
              </Button>
              <Button type="button" onClick={() => setOpen(false)} variant="outline" className="h-11 px-6 border-neutral-800 bg-black/40 hover:bg-red-950/40">
                <span className="font-cinzel tracking-widest uppercase text-[10px]">Cancel</span>
              </Button>
            </div>
          </form>
        </section>
      ) : null}
    </>
  );
}
