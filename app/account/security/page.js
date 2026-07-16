'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck, KeyRound, Mail, Smartphone, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CUSTOMER } from '@/lib/account';

export default function SecurityPage() {
  const [twoFA, setTwoFA] = useState(true);

  return (
    <>
      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5"><KeyRound className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Password</h2></div>
        <form onSubmit={(e) => { e.preventDefault(); toast.success('Password updated.'); }} className="grid md:grid-cols-2 gap-4 max-w-2xl">
          <Row label="Current password" type="password" placeholder="•••••••••" />
          <Row label="New password"     type="password" placeholder="•••••••••" />
          <div className="md:col-span-2">
            <Button type="submit" className="h-11 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red">
              <span className="font-cinzel tracking-widest uppercase text-[10px]">Update Password</span>
            </Button>
          </div>
        </form>
      </section>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5"><Mail className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Email</h2></div>
        <form onSubmit={(e) => { e.preventDefault(); toast.success('Verification email sent.'); }} className="grid md:grid-cols-2 gap-4 max-w-2xl">
          <Row label="Current email" defaultValue={CUSTOMER.email} disabled />
          <Row label="New email"     type="email" placeholder="new@ratattack.gg" />
          <div className="md:col-span-2">
            <Button type="submit" variant="outline" className="h-11 border-red-800/60 bg-black/40 hover:bg-red-950/40">
              <span className="font-cinzel tracking-widest uppercase text-[10px]">Send Verification</span>
            </Button>
          </div>
        </form>
      </section>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5"><Smartphone className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Two-Factor Authentication</h2></div>
        <div className="flex items-center justify-between glass-panel rounded-lg p-4">
          <div>
            <div className="font-cinzel text-sm text-white mb-1">Authenticator app</div>
            <div className="text-xs text-neutral-400">{twoFA ? <span className="text-emerald-400">Enabled</span> : <span className="text-red-400">Disabled</span>} · Backup codes generated</div>
          </div>
          <Button onClick={() => { setTwoFA((v) => !v); toast.success(twoFA ? '2FA disabled' : '2FA enabled'); }} variant="outline" className="h-10 border-red-800/60 bg-black/40 hover:bg-red-950/40">
            <span className="font-cinzel tracking-widest uppercase text-[10px]">{twoFA ? 'Disable' : 'Enable'}</span>
          </Button>
        </div>
      </section>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5"><Link2 className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Connected Accounts</h2></div>
        <div className="space-y-3">
          {[
            { name: 'Discord',  connected: true,  meta: 'Sir_Ratsalot#4242' },
            { name: 'YouTube',  connected: true,  meta: '@llratattackll' },
            { name: 'Twitch',   connected: false, meta: 'Not linked' },
            { name: 'Google',   connected: false, meta: 'Sign in with Google' },
          ].map((c) => (
            <div key={c.name} className="flex items-center justify-between glass-panel rounded-lg p-4">
              <div>
                <div className="font-cinzel text-sm text-white">{c.name}</div>
                <div className="text-xs text-neutral-400">{c.meta}</div>
              </div>
              <Button onClick={() => toast.info(c.connected ? `${c.name} disconnected.` : `${c.name} linked.`)} variant="outline" className={`h-10 ${c.connected ? 'border-red-800/60 bg-red-950/30 hover:bg-red-950/50 text-red-300' : 'border-neutral-800 bg-black/40 hover:bg-red-950/40'}`}>
                <span className="font-cinzel tracking-widest uppercase text-[10px]">{c.connected ? 'Disconnect' : 'Connect'}</span>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3"><ShieldCheck className="w-5 h-5 text-emerald-400" /><h2 className="font-cinzel text-xl text-white">Sign-in Activity</h2></div>
        <div className="text-xs text-neutral-400">Last sign-in: <span className="text-neutral-200">Today, 09:42 ET</span> · <span className="text-neutral-200">Chrome / macOS</span> · Darklands, CA</div>
      </section>
    </>
  );
}

function Row({ label, ...props }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel">{label}</Label>
      <Input id={id} className="bg-black/60 border-neutral-800 focus:border-red-600 h-11 disabled:opacity-70" {...props} />
    </div>
  );
}
