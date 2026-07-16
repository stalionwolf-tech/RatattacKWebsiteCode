'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AuthCinematicLayout } from '@/components/auth/AuthCinematicLayout';
import { useAuth } from '@/components/auth/AuthProvider';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/account';
  const { login, providerMeta } = useAuth();

  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login({ email, password, remember });
      toast.success('Welcome back to the Horde.');
      router.replace(next);
    } catch (err) {
      toast.error(err?.message || 'Login failed.');
    } finally { setBusy(false); }
  };

  const fillDemo = () => {
    if (!providerMeta?.seed) return;
    setEmail(providerMeta.seed.email);
    setPassword(providerMeta.seed.password);
    toast.info('Demo credentials filled. Click Sign In.');
  };

  return (
    <AuthCinematicLayout
      eyebrow="The Order"
      title="Sign in"
      subtitle="Return to your vault, your wishlist, your unopened pulls."
      footerNote={<>New to RatAttacK? <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-red-400 hover:text-red-300 font-cinzel tracking-widest uppercase text-xs">Join the Horde</Link></>}
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.3em] font-cinzel text-neutral-400 mb-2 block">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@ratattack.gg" className="pl-10 h-12 bg-black/50 border-neutral-800 focus:border-red-700" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.3em] font-cinzel text-neutral-400">Password</Label>
            <Link href="/forgot-password" className="text-[10px] uppercase tracking-[0.2em] font-cinzel text-red-400 hover:text-red-300">Forgot?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <Input id="password" type={show ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10 h-12 bg-black/50 border-neutral-800 focus:border-red-700" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-400" aria-label="Toggle password visibility">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
          <span>Keep me signed in for 30 days</span>
        </label>

        <Button type="submit" disabled={busy} size="lg" className="w-full h-12 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 glow-red btn-glow-red disabled:opacity-70">
          {busy ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span className="font-cinzel tracking-widest uppercase text-xs">Signing in…</span></>) : (<><span className="font-cinzel tracking-widest uppercase text-xs">Sign In</span><ArrowRight className="w-4 h-4 ml-2" /></>)}
        </Button>

        {providerMeta?.id === 'mock' ? (
          <div className="pt-3 border-t border-neutral-900/80">
            <button type="button" onClick={fillDemo} className="w-full text-[10px] uppercase tracking-[0.3em] font-cinzel text-neutral-500 hover:text-red-400 transition-colors">
              Use demo credentials → {providerMeta.seed.email}
            </button>
          </div>
        ) : null}
      </form>
    </AuthCinematicLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
