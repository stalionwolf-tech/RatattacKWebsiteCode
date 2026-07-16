import { PolicyPage } from '@/components/site/PolicyPage';
import { SITE_CONFIG } from '@/lib/config';

export const metadata = {
  title: 'FAQ — RatAttacK',
  description: 'Answers to the most common questions about RatAttacK orders, singles, sealed product, community and more.',
};

const FAQ = [
  { id: 'orders',    icon: 'package',       title: 'Orders & Fulfillment', body: `We process most orders within 24–48 hours. You’ll receive an email confirmation the moment a raven is dispatched with your tracking number. During drop weekends fulfillment can slip by a day.` },
  { id: 'shipping',  icon: 'truck',         title: 'Shipping speed & carriers', body: `US orders ship USPS Ground / Priority (3–5 business days). International ships via tracked carriers (7–14 business days). Once a package leaves the vault, delays are out of our hands — but we’ll always help you file a claim.` },
  { id: 'condition', icon: 'package',       title: 'Are sealed products factory sealed?', body: `Yes. Every booster box, ETB, and sealed pack we ship is factory sealed and stored in a climate-controlled vault. If you receive a compromised seal, contact us within 48h with photos and we’ll make it right.` },
  { id: 'singles',   icon: 'refreshCw',     title: 'Do you sell singles?', body: `We list select singles under the Singles collection. Grades are as-described at listing time. Singles are final sale unless we materially misrepresented the card.` },
  { id: 'payments',  icon: 'creditCard',    title: 'What payment methods do you accept?', body: `Checkout is fully hosted by Shopify — Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay, Shop Pay, and PayPal (region-dependent).` },
  { id: 'returns',   icon: 'refreshCw',     title: 'Returns & refunds', body: `Sealed & unused product may be returned within 30 days for a refund minus shipping. Damaged-in-transit claims must be filed within 7 days of delivery. See our Return Policy for the full policy.` },
  { id: 'accounts',  icon: 'shield',        title: 'Account & the Horde', body: `Sign up to track orders, save a wishlist, and stake claims on Vault drops. Your data is protected and you can request deletion at any time under our Privacy Policy.` },
  { id: 'community', icon: 'messageSquare', title: 'How do I join the community?', body: `Two homes: our Discord server for live raid chatter, and our YouTube channel for pulls, opens, and rituals. Both are linked in the footer and homepage.` },
  { id: 'cookies',   icon: 'cookie',        title: 'What cookies does the site use?', body: `Only what’s needed to remember your cart, wishlist, ambient audio, and (if enabled) light anonymous analytics. See the Cookie Policy for the full breakdown.` },
  { id: 'contact',   icon: 'helpCircle',    title: 'Still stuck?', body: `Email ${SITE_CONFIG.email?.support || 'support@ratattack.gg'} or ping us on Discord. Real humans answer, usually within 24 hours.` },
];

export default function FAQPage() {
  return <PolicyPage eyebrow="Help" title="Frequently Asked" revised="June 20, 2026" sections={FAQ} sidebarTitle="Topics" />;
}
