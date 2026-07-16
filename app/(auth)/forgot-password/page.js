'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowRight, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthCinematicLayout } from '@/components/auth/AuthCinematicLayout';
import { useAuth } from '@/components/auth/AuthProvider';

export default function ForgotPasswordPage() {
  const { requestPasswordReset, providerMeta } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [devToken, setDevToken] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await requestPasswordReset(email);
      toast.success('If an account exists for that email, a raven has been dispatched.');
      if (providerMeta?.id === 'mock' && res?.token) setDevToken(res.token);
    } catch (err) {
      toast.error(err?.message || 'Something went wrong.');
    } finally { setBusy(false); }
  };

  return (
    <AuthCinematicLayout
      eyebrow="Lost Sigil"
      title="Reset your password"
      subtitle="Enter your email and we’ll send you a token to reforge your sigil."
      footerNote={<>Remembered it? <Link href="/login" className="text-red-400 hover:text-red-300 font-cinzel tracking-widest uppercase text-xs">Back to Sign In</Link></>}
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.3em] font-cinzel text-neutral-400 mb-2 block">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@ratattack.gg" className="pl-10 h-12 bg-black/50 border-neutral-800 focus:border-red-700" />
          </div>
        </div>

        <Button type="submit" disabled={busy} size="lg" className="w-full h-12 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 glow-red btn-glow-red disabled:opacity-70">
          {busy ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span className="font-cinzel tracking-widest uppercase text-xs">Dispatching Raven…</span></>) : (<><span className="font-cinzel tracking-widest uppercase text-xs">Send Reset Token</span><ArrowRight className="w-4 h-4 ml-2" /></>)}
        </Button>

        {devToken ? (
          <div className="mt-4 p-4 rounded-lg border border-amber-800/50 bg-amber-950/30">
            <div className="flex items-center gap-2 text-amber-400 text-[10px] uppercase tracking-[0.3em] font-cinzel mb-2">
              <KeyRound className="w-3 h-3" /> Dev mode — reset token
            </div>
            <code className="block break-all text-xs text-amber-200 bg-black/60 rounded p-2 font-mono">{devToken}</code>
            <Link href={`/reset-password?token=${devToken}`} className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] font-cinzel text-red-400 hover:text-red-300">
              Continue to reset page <ArrowRight className="w-3 h-3" />
            </Link>
            <p className="text-[9px] uppercase tracking-widest text-amber-600/70 font-cinzel mt-2">This token box only appears in the mock provider. Emailed by Shopify Customer Accounts when live.</p>
          </div>
        ) : null}
      </form>
    </AuthCinematicLayout>
  );
}
