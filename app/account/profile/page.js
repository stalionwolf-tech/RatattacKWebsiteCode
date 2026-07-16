'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function Field({ label, ...props }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-cinzel">{label}</Label>
      <Input id={id} className="bg-black/60 border-neutral-800 focus:border-red-600 h-11" {...props} />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <>
      <section className="glass-panel frame-corners rounded-xl p-6">
        <h2 className="font-cinzel text-xl text-white mb-5">Profile</h2>
        <form onSubmit={(e) => { e.preventDefault(); toast.success('Profile saved.'); }} className="grid md:grid-cols-2 gap-4">
          <Field label="First name" defaultValue="Sir" />
          <Field label="Last name" defaultValue="Ratsalot" />
          <Field label="Email" type="email" defaultValue="ratsalot@ratattack.gg" />
          <Field label="Phone" type="tel" defaultValue="(555) 234-1122" />
          <div className="md:col-span-2 pt-2">
            <Button className="h-12 px-8 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
              <span className="font-cinzel tracking-widest uppercase text-xs">Save changes</span>
            </Button>
          </div>
        </form>
      </section>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <h2 className="font-cinzel text-xl text-white mb-5">Shipping Address</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Address" defaultValue="1 Warren Way" />
          <Field label="Apt / Suite" defaultValue="Suite 42" />
          <Field label="City" defaultValue="Darklands" />
          <Field label="State" defaultValue="CA" />
          <Field label="ZIP" defaultValue="94016" />
          <Field label="Country" defaultValue="United States" />
        </div>
      </section>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <h2 className="font-cinzel text-xl text-white mb-5">Payment Methods</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-900 bg-black/40">
            <div>
              <div className="font-cinzel text-white">Visa ending in 4242</div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">Expires 12/28 · Default</div>
            </div>
            <button className="text-xs uppercase tracking-widest text-neutral-400 hover:text-red-400 font-cinzel">Manage</button>
          </div>
          <button className="w-full py-3 rounded-lg border border-dashed border-neutral-800 hover:border-red-700 text-neutral-400 hover:text-red-400 font-cinzel tracking-widest uppercase text-xs transition-premium">+ Add Payment Method</button>
        </div>
      </section>
    </>
  );
}
