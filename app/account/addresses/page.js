'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MapPin, Plus, Star, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ADDRESSES } from '@/lib/account';

const BLANK = { id: '', firstName: '', lastName: '', address1: '', address2: '', city: '', province: '', zip: '', country: 'United States', phone: '', isDefault: false };

export default function AddressesPage() {
  const [items, setItems] = useState(ADDRESSES);
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [draft, setDraft] = useState(BLANK);

  const open = (a) => { setDraft(a || { ...BLANK, id: `addr_${Date.now()}` }); setEditing(a ? a.id : 'new'); };
  const save = (e) => {
    e.preventDefault();
    setItems((list) => {
      const exists = list.find((x) => x.id === draft.id);
      const next = exists ? list.map((x) => x.id === draft.id ? draft : x) : [...list, draft];
      if (draft.isDefault) return next.map((x) => ({ ...x, isDefault: x.id === draft.id }));
      return next;
    });
    setEditing(null); toast.success('Address saved');
  };
  const setDefault = (id) => { setItems((l) => l.map((x) => ({ ...x, isDefault: x.id === id }))); toast.success('Default address updated'); };
  const remove = (id) => { setItems((l) => l.filter((x) => x.id !== id)); toast.message('Address removed'); };

  return (
    <section className="glass-panel frame-corners rounded-xl p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Addresses</h2></div>
        <Button onClick={() => open(null)} className="h-11 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
          <Plus className="w-4 h-4 mr-2" /><span className="font-cinzel tracking-widest uppercase text-[10px]">Add Address</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((a) => (
          <div key={a.id} className={`glass-panel rounded-lg p-5 relative ${a.isDefault ? 'border-red-600/60' : ''}`}>
            {a.isDefault && (
              <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded bg-red-600 text-white text-[9px] uppercase tracking-widest font-cinzel font-bold">Default</div>
            )}
            <div className="font-cinzel text-white">{a.firstName} {a.lastName}</div>
            <div className="text-sm text-neutral-400 mt-1 leading-relaxed">
              {a.address1}{a.address2 && `, ${a.address2}`}<br />
              {a.city}, {a.province} {a.zip}<br />
              {a.country}<br />
              <span className="text-neutral-500">{a.phone}</span>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button onClick={() => open(a)} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-red-400 font-cinzel"><Pencil className="w-3 h-3" /> Edit</button>
              {!a.isDefault && <button onClick={() => setDefault(a.id)} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-red-400 font-cinzel"><Star className="w-3 h-3" /> Set default</button>}
              {!a.isDefault && <button onClick={() => remove(a.id)} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-red-400 font-cinzel"><Trash2 className="w-3 h-3" /> Delete</button>}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm" onClick={() => setEditing(null)} />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-0 z-[91] flex items-center justify-center p-4">
              <form onSubmit={save} className="glass-panel frame-corners rounded-2xl p-6 w-full max-w-lg bg-neutral-950/95 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-cinzel text-lg text-white">{editing === 'new' ? 'New Address' : 'Edit Address'}</h3>
                  <button type="button" onClick={() => setEditing(null)} className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-400 hover:text-red-400"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" value={draft.firstName} onChange={(v) => setDraft({ ...draft, firstName: v })} />
                  <Field label="Last name"  value={draft.lastName}  onChange={(v) => setDraft({ ...draft, lastName: v })} />
                  <div className="col-span-2"><Field label="Address" value={draft.address1} onChange={(v) => setDraft({ ...draft, address1: v })} /></div>
                  <div className="col-span-2"><Field label="Apt / Suite" value={draft.address2} onChange={(v) => setDraft({ ...draft, address2: v })} /></div>
                  <Field label="City"    value={draft.city}     onChange={(v) => setDraft({ ...draft, city: v })} />
                  <Field label="State"   value={draft.province} onChange={(v) => setDraft({ ...draft, province: v })} />
                  <Field label="ZIP"     value={draft.zip}      onChange={(v) => setDraft({ ...draft, zip: v })} />
                  <Field label="Country" value={draft.country}  onChange={(v) => setDraft({ ...draft, country: v })} />
                  <div className="col-span-2"><Field label="Phone" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} /></div>
                  <label className="col-span-2 flex items-center gap-2 text-xs text-neutral-400">
                    <input type="checkbox" checked={!!draft.isDefault} onChange={(e) => setDraft({ ...draft, isDefault: e.target.checked })} className="accent-red-600" />
                    Make this my default address
                  </label>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button type="submit" className="flex-1 h-11 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
                    <span className="font-cinzel tracking-widest uppercase text-[10px]">Save Address</span>
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

function Field({ label, value, onChange }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel">{label}</Label>
      <Input id={id} value={value || ''} onChange={(e) => onChange(e.target.value)} className="bg-black/60 border-neutral-800 focus:border-red-600 h-11" />
    </div>
  );
}
