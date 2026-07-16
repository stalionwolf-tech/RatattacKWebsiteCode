import { PolicyPage } from '@/components/site/PolicyPage';
import { SITE_CONFIG } from '@/lib/config';

export const metadata = {
  title: 'Cookie Policy — RatAttacK',
  description: 'What cookies and browser storage RatAttacK uses and how you can control them.',
};

const SECTIONS = [
  { id: 'overview',   icon: 'info',        title: 'Overview', body: `A cookie is a small text file stored on your device by your browser. RatAttacK uses a minimal set of cookies and browser localStorage to make the site work — not to profile you across the web.` },
  { id: 'essential',  icon: 'server',      title: 'Essential (always on)', body: `• ratattack_cart_v2 — remembers items in your cart.
• ratattack_wishlist_v1 — remembers your wishlist.
• ratattack_ambient_audio — remembers whether ambient audio is muted.
• ratattack_auth_session_v1 — keeps you signed in on protected pages.
• Shopify checkout cookies — issued by Shopify during hosted checkout for cart integrity and fraud prevention.` },
  { id: 'analytics',  icon: 'toggleRight', title: 'Analytics (optional)', body: `Anonymous, aggregated metrics such as page views, referrers, and device type. We only enable analytics when you consent. Analytics data does not include personally identifying information.` },
  { id: 'thirdparty', icon: 'server',      title: 'Third-party embeds', body: `We embed YouTube and Discord widgets on some pages. Those services set their own cookies when you interact with them. Their privacy practices are governed by youtube.com/t/privacy and discord.com/privacy.` },
  { id: 'control',    icon: 'settings',    title: 'How to control cookies', body: `You can clear cookies and localStorage at any time via your browser settings. Disabling essential cookies will break the cart, wishlist, and account features. Most browsers also let you block third-party cookies specifically.` },
  { id: 'delete',     icon: 'trash2',      title: 'Delete our stored data', body: `To wipe RatAttacK-specific localStorage keys instantly, open your browser’s DevTools → Application → Local Storage → select “ratattack.gg” → Clear. You will be signed out and your cart/wishlist will reset.` },
  { id: 'contact',    icon: 'cookie',      title: 'Questions', body: `Questions about our cookie use? Email ${SITE_CONFIG.email?.support || 'support@ratattack.gg'}.` },
];

export default function CookiesPage() {
  return <PolicyPage eyebrow="The Order" title="Cookie Policy" revised="June 20, 2026" sections={SECTIONS} />;
}
