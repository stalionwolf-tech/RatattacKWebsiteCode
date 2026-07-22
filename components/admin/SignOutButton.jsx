'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SignOutButton({ className, callbackUrl = '/admin/login', label = 'Sign Out' }) {
  const [busy, setBusy] = useState(false);

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await signOut({ callbackUrl });
    } catch {
      setBusy(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleSignOut}
      disabled={busy}
      className={className}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span className="font-cinzel text-[11px] uppercase tracking-widest">{label}</span>
    </Button>
  );
}
