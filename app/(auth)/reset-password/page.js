'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, KeyRound, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthCinematicLayout } from '@/components/auth/AuthCinematicLayout';
import { useAuth } from '@/components/auth/AuthProvider';

function ResetInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { resetPassword } = useAuth();

  const [token, setToken] = useState(params.get('token') || '');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await resetPassword({ token, newPassword: password });
      toast.success('Password reforged. Welcome back to the Horde.');
      router.replace('/account');
    } catch (err) {
      toast.error(err?.message || 'Reset failed.');
    } finally { setBusy(false); }
  };

  return (
    <AuthCinematicLayout
      eyebrow="Reforge Sigil"
      title="Set a new password"
      subtitle="Paste your reset token and choose a fresh password."
      footerNote={<>Need a new token? <Link href="/forgot-password" className="text-red-400 hover:text-red-300 font-cinzel tracking-widest uppercase text-xs">Request Reset</Link></>}
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <Label htmlFor="token" className="text-[10px] uppercase tracking-[0.3em] font-cinzel text-neutral-400 mb-2 block">Reset Token</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <Input id="token" required value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste your token" className="pl-10 h-12 bg-black/50 border-neutral-800 focus:border-red-700 font-mono text-xs" />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.3em] font-cinzel text-neutral-400 mb-2 block">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <Input id="password" type={show ? 'text' : 'password'} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 chars, letter + number" className="pl-10 pr-10 h-12 bg-black/50 border-neutral-800 focus:border-red-700" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-400" aria-label="Toggle password visibility">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" disabled={busy} size="lg" className="w-full h-12 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 glow-red btn-glow-red disabled:opacity-70">
          {busy ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span className="font-cinzel tracking-widest uppercase text-xs">Reforging…</span></>) : (<><span className="font-cinzel tracking-widest uppercase text-xs">Reforge Sigil</span><ArrowRight className="w-4 h-4 ml-2" /></>)}
        </Button>
      </form>
    </AuthCinematicLayout>
  );
}

export default function ResetPasswordPage() {
  return <Suspense fallback={null}><ResetInner /></Suspense>;
}
