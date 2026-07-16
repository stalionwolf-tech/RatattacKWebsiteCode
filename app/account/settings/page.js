'use client';
import { toast } from 'sonner';
import { Bell, MessageSquare, ShoppingBag, Sparkles, Monitor, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useNotificationPrefs } from '@/lib/account-hooks';
import { useAuth } from '@/components/auth/AuthProvider';
import { useState } from 'react';

function Toggle({ label, description, icon: Icon, checked, onChange }) {
  return (
    <label className="flex items-start gap-4 p-4 rounded-lg glass-panel border border-neutral-900 cursor-pointer select-none hover:border-red-800/60 transition-colors">
      <span className="w-10 h-10 rounded-full bg-red-950/40 border border-red-800 flex items-center justify-center text-red-400 flex-shrink-0"><Icon className="w-4 h-4" /></span>
      <span className="flex-1">
        <span className="block font-cinzel text-sm text-white">{label}</span>
        <span className="block text-xs text-neutral-400 mt-1">{description}</span>
      </span>
      <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-red-600' : 'bg-neutral-800'}`}>
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </span>
    </label>
  );
}

export default function SettingsPage() {
  const { prefs, update } = useNotificationPrefs();
  const { user, updateProfile } = useAuth();
  const [busy, setBusy] = useState(false);

  const set = (k) => (v) => { update({ [k]: v }); toast.success(`Preference updated.`); };

  const saveMarketing = async () => {
    setBusy(true);
    try {
      await updateProfile({ acceptsMarketing: !user?.acceptsMarketing });
      toast.success('Marketing preference updated.');
    } catch (err) { toast.error(err?.message || 'Could not update.'); }
    finally { setBusy(false); }
  };

  return (
    <>
      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5"><Bell className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Notifications</h2></div>
        <div className="space-y-3">
          <Toggle label="Order updates"      description="Shipping, delivery, and refund emails." icon={ShoppingBag}   checked={prefs.orderUpdates}      onChange={set('orderUpdates')} />
          <Toggle label="Restock alerts"     description="Get pinged when a wishlist product is back in stock." icon={Sparkles} checked={prefs.restockAlerts}     onChange={set('restockAlerts')} />
          <Toggle label="Community digest"   description="Weekly recap of raids, streams, and Discord highlights." icon={MessageSquare} checked={prefs.communityDigest}  onChange={set('communityDigest')} />
          <Toggle label="Promotional offers" description="Discount codes and exclusive Rat Horde drops." icon={Bell}              checked={prefs.promotionalOffers} onChange={set('promotionalOffers')} />
          <Toggle label="Desktop push"       description="Browser push notifications on this device." icon={Monitor}             checked={prefs.desktopPush}       onChange={set('desktopPush')} />
        </div>
      </section>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3"><Sparkles className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-xl text-white">Marketing Emails</h2></div>
        <p className="text-sm text-neutral-400 mb-4">
          You are {user?.acceptsMarketing ? <span className="text-emerald-400">subscribed</span> : <span className="text-neutral-300">not subscribed</span>} to the RatAttacK newsletter. This preference is mirrored in Shopify.
        </p>
        <Button onClick={saveMarketing} disabled={busy} variant="outline" className="h-10 border-red-800/60 bg-black/40 hover:bg-red-950/40 disabled:opacity-70">
          {busy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span className="font-cinzel tracking-widest uppercase text-[10px]">Saving…</span></> : <span className="font-cinzel tracking-widest uppercase text-[10px]">{user?.acceptsMarketing ? 'Unsubscribe' : 'Subscribe'}</span>}
        </Button>
      </section>
    </>
  );
}
