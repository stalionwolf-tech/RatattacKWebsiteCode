'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AuthCinematicLayout } from '@/components/auth/AuthCinematicLayout';
import { useAuth } from '@/components/auth/AuthProvider';

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/account';
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [acceptsMarketing, setAcceptsMarketing] = useState(true);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signup({ email, password, firstName, lastName, acceptsMarketing });
      // Best-effort mirror to Shopify newsletter subscribers (real API).
      if (acceptsMarketing) {
        try { await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }); } catch {}
      }
      toast.success('Welcome to the Horde. Your sigil is ready.');
      router.replace(next);
    } catch (err) {
      toast.error(err?.message || 'Signup failed.');
    } finally { setBusy(false); }
  };

  return (
    <AuthCinematicLayout
      eyebrow="Join the Horde"
      title="Create your account"
      subtitle="Track pulls, favorite drops, and collect proofs of every raid."
      footerNote={<>Already have a sigil? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-red-400 hover:text-red-300 font-cinzel tracking-widest uppercase text-xs">Sign In</Link></>}
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName" className="text-[10px] uppercase tracking-[0.3em] font-cinzel text-neutral-400 mb-2 block">First</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              <Input id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ratsalot" className="pl-10 h-12 bg-black/50 border-neutral-800 focus:border-red-700" />
            </div>
          </div>
          <div>
            <Label htmlFor="lastName" className="text-[10px] uppercase tracking-[0.3em] font-cinzel text-neutral-400 mb-2 block">Last</Label>
            <Input id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Verrik" className="h-12 bg-black/50 border-neutral-800 focus:border-red-700" />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.3em] font-cinzel text-neutral-400 mb-2 block">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@ratattack.gg" className="pl-10 h-12 bg-black/50 border-neutral-800 focus:border-red-700" />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.3em] font-cinzel text-neutral-400 mb-2 block">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <Input id="password" type={show ? 'text' : 'password'} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 chars, letter + number" className="pl-10 pr-10 h-12 bg-black/50 border-neutral-800 focus:border-red-700" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-400" aria-label="Toggle password visibility">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-neutral-400 cursor-pointer select-none">
          <Checkbox checked={acceptsMarketing} onCheckedChange={(v) => setAcceptsMarketing(!!v)} />
          <span>Send me raven-mails for drops, restocks, and Rat Horde exclusives.</span>
        </label>

        <Button type="submit" disabled={busy} size="lg" className="w-full h-12 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 glow-red btn-glow-red disabled:opacity-70">
          {busy ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span className="font-cinzel tracking-widest uppercase text-xs">Forging Sigil…</span></>) : (<><span className="font-cinzel tracking-widest uppercase text-xs">Forge My Sigil</span><ArrowRight className="w-4 h-4 ml-2" /></>)}
        </Button>

        <p className="text-[10px] text-center text-neutral-500 uppercase tracking-widest font-cinzel">
          By joining you accept the <Link href="/terms" className="hover:text-red-400">Pact</Link> and <Link href="/privacy" className="hover:text-red-400">Privacy Rites</Link>.
        </p>
      </form>
    </AuthCinematicLayout>
  );
}

export default function SignupPage() {
  return <Suspense fallback={null}><SignupInner /></Suspense>;
}
