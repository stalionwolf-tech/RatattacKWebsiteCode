import { PolicyPage } from '@/components/site/PolicyPage';
import { SITE_CONFIG } from '@/lib/config';

export const metadata = {
  title: 'Shipping Policy — RatAttacK',
  description: 'How, when, and where RatAttacK ships. Carriers, timelines, and international details.',
};

const SECTIONS = [
  { id: 'processing',    icon: 'timer',        title: 'Processing time', body: `Orders are typically processed within 24–48 business hours of payment. During major drops or holiday weekends, processing may extend to 3–5 business days. You’ll receive a shipping confirmation the moment your order leaves the vault.` },
  { id: 'domestic',      icon: 'truck',        title: 'Domestic (United States)', body: `Standard shipping via USPS Ground / Priority Mail. Typical delivery: 3–5 business days. Free shipping on domestic orders over $150. Signature-required on orders over $500.` },
  { id: 'international', icon: 'globe2',       title: 'International shipping', body: `We ship worldwide via tracked international carriers (DHL, FedEx, UPS, or USPS International). Typical delivery: 7–14 business days depending on destination. Customs, duties, and import taxes are the buyer’s responsibility.` },
  { id: 'packaging',     icon: 'package',      title: 'Packaging', body: `Sealed product ships in double-boxed protection with corner protectors. Singles ship in top-loaders + team bags inside a bubble mailer with tracking. Grades are always shipped with tamper-evident seals.` },
  { id: 'insurance',     icon: 'shieldCheck',  title: 'Insurance & tracking', body: `All orders over $100 are insured up to full value. Tracking numbers are provided in your shipping confirmation email and viewable in your account under Orders.` },
  { id: 'addresses',     icon: 'mapPin',       title: 'Delivery address', body: `We ship to the address you provided at checkout. Please double-check your address before placing the order — we’re not liable for shipments to incorrect addresses. Address changes after dispatch are not possible.` },
  { id: 'issues',        icon: 'alertTriangle',title: 'Lost or damaged packages', body: `If your package is marked delivered but you can’t find it, contact us within 7 days. Damaged-in-transit claims require photos of the package and product within 48 hours of delivery. Email ${SITE_CONFIG.email?.support || 'support@ratattack.gg'} to open a claim.` },
];

export default function ShippingPage() {
  return <PolicyPage eyebrow="The Order" title="Shipping Policy" revised="June 20, 2026" sections={SECTIONS} />;
}
