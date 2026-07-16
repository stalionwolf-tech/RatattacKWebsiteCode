'use client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function Toggle({ label, description, defaultChecked = true }) {
  return (
    <label className="flex items-start justify-between gap-4 p-4 rounded-lg border border-neutral-900 bg-black/40 hover:border-red-800 transition-premium cursor-pointer">
      <div>
        <div className="font-cinzel text-white text-sm">{label}</div>
        <div className="text-xs text-neutral-500 mt-1 leading-relaxed">{description}</div>
      </div>
      <input type="checkbox" defaultChecked={defaultChecked} className="mt-1 accent-red-600 w-5 h-5" />
    </label>
  );
}

export default function SettingsPage() {
  return (
    <>
      <section className="glass-panel frame-corners rounded-xl p-6">
        <h2 className="font-cinzel text-xl text-white mb-5">Notifications</h2>
        <div className="space-y-3">
          <Toggle label="Order updates" description="Emails when your order ships and delivers." />
          <Toggle label="Restock alerts" description="Get pinged when wishlisted items return to stock." />
          <Toggle label="Community events" description="Announcements about tournaments and giveaways." defaultChecked={false} />
          <Toggle label="Promotional emails" description="Sale drops and members-only codes." defaultChecked={false} />
        </div>
      </section>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <h2 className="font-cinzel text-xl text-white mb-5">Security</h2>
        <div className="space-y-3">
          <Button onClick={() => toast.info('Password reset link sent to your email.')} variant="outline" className="h-11 border-red-800/60 bg-black/40 hover:bg-red-950/40">
            <span className="font-cinzel tracking-widest uppercase text-xs">Change Password</span>
          </Button>
          <Button onClick={() => toast.info('Two-factor authentication configured.')} variant="outline" className="h-11 border-red-800/60 bg-black/40 hover:bg-red-950/40 ml-3">
            <span className="font-cinzel tracking-widest uppercase text-xs">Enable 2FA</span>
          </Button>
        </div>
      </section>

      <section className="glass-panel frame-corners rounded-xl p-6">
        <h2 className="font-cinzel text-xl text-white mb-5">Danger Zone</h2>
        <p className="text-sm text-neutral-400 mb-4">Deleting your account will remove your order history and saved details permanently.</p>
        <Button onClick={() => toast.error('Account deletion is disabled in demo mode.')} variant="outline" className="h-11 border-red-800/60 bg-red-950/20 hover:bg-red-950/50 text-red-300">
          <span className="font-cinzel tracking-widest uppercase text-xs">Delete Account</span>
        </Button>
      </section>
    </>
  );
}
