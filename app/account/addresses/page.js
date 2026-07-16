'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { MapPin, Plus, Trash2, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddresses } from '@/lib/account-hooks';

function Field({ label, ...props }) {
  const id = `f-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel">{label}</Label>
      <Input id={id} className="bg-black/60 border-neutral-800 focus:border-red-600 h-11" {...props} />
    </div>
  );
}

const EMPTY = { firstName:'', lastName:'', address1:'', address2:'', city:'', province:'', zip:'', country:'United States', phone:'', isDefault:false };

export default function AddressesPage() {
  const { addresses, add, remove, setDefault } = useAddresses();
  const [form, setForm] = useState(EMPTY);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const on = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.address1 || !form.city || !form.zip) {
      toast.error('First, Last, Address, City and ZIP are required.'); return;
    }
    setBusy(true);
    try {
      add({ ...form, isDefault: addresses.length === 0 || form.isDefault });
      toast.success('Address saved.');
      setForm(EMPTY); setOpen(false);
    } finally { setBusy(false); }
  };

  return (
    <>
      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Saved Addresses</h2></div>
          <Button onClick={() => setOpen((v) => !v)} className="h-9 px-3 bg-red-950/40 border border-red-800 hover:bg-red-900/50">
            <Plus className="w-3.5 h-3.5 mr-1.5" /><span className="font-cinzel tracking-widest uppercase text-[10px]">{open ? 'Close' : 'Add Address'}</span>
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-10">
            <div className="font-cinzel text-neutral-300 mb-2">No addresses stored yet.</div>
            <p className="text-sm text-neutral-500">Add a shipping address so raids arrive at the right vault.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <div key={a.id} className={`glass-panel rounded-lg p-4 border ${a.isDefault ? 'border-red-700/70' : 'border-neutral-900'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="font-cinzel text-white">{a.firstName} {a.lastName}</div>
                  {a.isDefault ? (
                    <span className="text-[9px] uppercase tracking-widest text-red-400 font-cinzel border border-red-800/60 rounded-full px-2 py-0.5">Default</span>
                  ) : null}
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {a.address1}{a.address2 ? `, ${a.address2}` : ''}<br />
                  {a.city}, {a.province} {a.zip}<br />
                  {a.country}
                </p>
                {a.phone ? <p className="text-xs text-neutral-500 mt-1">{a.phone}</p> : null}
                <div className="flex gap-2 mt-4">
                  {!a.isDefault ? (
                    <button onClick={() => setDefault(a.id)} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-red-400 font-cinzel">
                      <Star className="w-3 h-3" /> Set default
                    </button>
                  ) : null}
                  <button onClick={() => { remove(a.id); toast.info('Address removed.'); }} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-red-400 font-cinzel ml-auto">
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
          <h3 className="font-cinzel text-lg text-white mb-4">New Address</h3>
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
            <Field label="First name" value={form.firstName} onChange={on('firstName')} required />
            <Field label="Last name"  value={form.lastName}  onChange={on('lastName')}  required />
            <Field label="Address"    value={form.address1}  onChange={on('address1')}  required />
            <Field label="Apt / Suite"value={form.address2}  onChange={on('address2')} />
            <Field label="City"       value={form.city}      onChange={on('city')} required />
            <Field label="State / Province" value={form.province} onChange={on('province')} />
            <Field label="ZIP"        value={form.zip}       onChange={on('zip')} required />
            <Field label="Country"    value={form.country}   onChange={on('country')} />
            <Field label="Phone (optional)" type="tel" value={form.phone} onChange={on('phone')} />
            <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none md:col-span-2">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} className="accent-red-600" />
              Set as default shipping address
            </label>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={busy} className="h-11 px-6 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red disabled:opacity-70">
                {busy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span className="font-cinzel tracking-widest uppercase text-[10px]">Saving…</span></> : <span className="font-cinzel tracking-widest uppercase text-[10px]">Save Address</span>}
              </Button>
              <Button type="button" onClick={() => { setForm(EMPTY); setOpen(false); }} variant="outline" className="h-11 px-6 border-neutral-800 bg-black/40 hover:bg-red-950/40">
                <span className="font-cinzel tracking-widest uppercase text-[10px]">Cancel</span>
              </Button>
            </div>
          </form>
        </section>
      ) : null}
    </>
  );
}
