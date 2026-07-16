'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';

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
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) setForm({
      firstName: user.firstName || '',
      lastName:  user.lastName || '',
      email:     user.email || '',
      phone:     user.phone || '',
    });
  }, [user?.id]);

  const on = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      // Email changes are handled on the Security page (require verification).
      await updateProfile({ firstName: form.firstName, lastName: form.lastName, phone: form.phone });
      toast.success('Profile saved.');
    } catch (err) {
      toast.error(err?.message || 'Could not save profile.');
    } finally { setBusy(false); }
  };

  return (
    <section className="glass-panel frame-corners rounded-xl p-6">
      <h2 className="font-cinzel text-xl text-white mb-5">Profile</h2>
      <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
        <Field label="First name" value={form.firstName} onChange={on('firstName')} required />
        <Field label="Last name"  value={form.lastName}  onChange={on('lastName')}  required />
        <Field label="Email" type="email" value={form.email} readOnly title="Change email from the Security page" />
        <Field label="Phone" type="tel" value={form.phone || ''} onChange={on('phone')} placeholder="Optional" />
        <div className="md:col-span-2 pt-2">
          <Button disabled={busy} className="h-12 px-8 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red disabled:opacity-70">
            {busy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span className="font-cinzel tracking-widest uppercase text-xs">Saving…</span></> : <span className="font-cinzel tracking-widest uppercase text-xs">Save changes</span>}
          </Button>
        </div>
      </form>
    </section>
  );
}
