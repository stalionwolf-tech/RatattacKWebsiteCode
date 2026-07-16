import { PolicyPage } from '@/components/site/PolicyPage';
import { SITE_CONFIG } from '@/lib/config';

export const metadata = {
  title: 'Return Policy — RatAttacK',
  description: 'RatAttacK’s return and refund policy for sealed products, singles, and merchandise.',
};

const SECTIONS = [
  { id: 'window',     icon: 'clockAlert', title: 'Return window', body: `Sealed and unused product may be returned within 30 days of delivery for a refund minus shipping costs. Requests received after 30 days are not eligible.` },
  { id: 'eligible',   icon: 'check',      title: 'Eligible items', body: `Factory-sealed booster boxes, ETBs, packs and merchandise in original condition. Items must be unopened, undamaged, and in their original packaging.` },
  { id: 'ineligible', icon: 'ban',        title: 'Non-returnable items', body: `Graded and raw singles are FINAL SALE unless the card was materially misrepresented at listing time. Opened boxes/packs cannot be returned. Digital / gift cards are non-refundable.` },
  { id: 'damaged',    icon: 'package',    title: 'Damaged in transit', body: `Damaged-in-transit claims must be filed within 7 days of delivery with clear photos of the outer packaging and product. We’ll replace the item free of charge (subject to inventory) or issue a full refund.` },
  { id: 'process',    icon: 'refreshCw',  title: 'How to start a return', body: `Email ${SITE_CONFIG.email?.support || 'support@ratattack.gg'} with your order number and a photo of the item. We’ll respond with a prepaid return label (domestic) or return instructions (international). Refunds are issued to the original payment method within 5–10 business days of receipt.` },
  { id: 'contact',    icon: 'mail',       title: 'Questions', body: `Confused about a return? Reach out at ${SITE_CONFIG.email?.support || 'support@ratattack.gg'} — humans reply, usually within 24 hours.` },
];

export default function ReturnsPage() {
  return <PolicyPage eyebrow="The Order" title="Return Policy" revised="June 20, 2026" sections={SECTIONS} />;
}
