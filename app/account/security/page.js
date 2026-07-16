'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { KeyRound, Mail, Smartphone, Link2, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthProvider';

function Row({ label, ...props }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel">{label}</Label>
      <Input id={id} className="bg-black/60 border-neutral-800 focus:border-red-600 h-11 disabled:opacity-70" {...props} />
    </div>
  );
}

export default function SecurityPage() {
  const { user, changePassword } = useAuth();
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [busy, setBusy] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await changePassword({ currentPassword: cur, newPassword: next });
      toast.success('Password updated. Use it on your next sign-in.');
      setCur(''); setNext('');
    } catch (err) {
      toast.error(err?.message || 'Could not update password.');
    } finally { setBusy(false); }
  };

  return (
    <>
      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5"><KeyRound className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Password</h2></div>
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4 max-w-2xl">
          <Row label="Current password" type="password" value={cur}  onChange={(e) => setCur(e.target.value)}  required autoComplete="current-password" />
          <Row label="New password"     type="password" value={next} onChange={(e) => setNext(e.target.value)} required autoComplete="new-password" />
          <div className="md:col-span-2">
            <Button type="submit" disabled={busy} className="h-11 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red disabled:opacity-70">
              {busy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span className="font-cinzel tracking-widest uppercase text-[10px]">Updating…</span></> : <span className="font-cinzel tracking-widest uppercase text-[10px]">Update Password</span>}
            </Button>
          </div>
        </form>
        <p className="mt-3 text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">Minimum 8 characters, must include a letter and a number.</p>
      </section>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5"><Mail className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Email</h2></div>
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
          <Row label="Current email" value={user?.email || ''} disabled />
          <Row label="New email" type="email" placeholder="new@ratattack.gg" disabled title="Available when Shopify Customer Accounts are connected" />
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">Email changes will be enabled when Shopify Customer Accounts are connected.</p>
      </section>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5"><Smartphone className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Two-Factor Authentication</h2></div>
        <div className="flex items-center justify-between glass-panel rounded-lg p-4">
          <div>
            <div className="font-cinzel text-sm text-white mb-1">Authenticator app</div>
            <div className="text-xs text-neutral-400">{twoFA ? <span className="text-emerald-400">Enabled</span> : <span className="text-neutral-400">Not set up</span>} · Available when Shopify Customer Accounts are connected</div>
          </div>
          <Button onClick={() => { setTwoFA((v) => !v); toast.info('2FA will be available once Customer Accounts are wired.'); }} variant="outline" className="h-10 border-red-800/60 bg-black/40 hover:bg-red-950/40">
            <span className="font-cinzel tracking-widest uppercase text-[10px]">{twoFA ? 'Disable' : 'Enable'}</span>
          </Button>
        </div>
      </section>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3"><ShieldCheck className="w-5 h-5 text-emerald-400" /><h2 className="font-cinzel text-xl text-white">Sign-in Activity</h2></div>
        <div className="text-xs text-neutral-400">Signed in as <span className="text-neutral-200">{user?.email}</span> · Session active</div>
      </section>
    </>
  );
}
