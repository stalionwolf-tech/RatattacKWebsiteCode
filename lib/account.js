/** Mock account data — shaped for Shopify Customer Accounts API.
 *  Swap functions to a real client later; components read only these shapes. */
export const CUSTOMER = {
  id: 'gid://shopify/Customer/9001',
  firstName: 'Sir',
  lastName: 'Ratsalot',
  email: 'ratsalot@ratattack.gg',
  phone: '(555) 234-1122',
  createdAt: '2025-11-02T00:00:00Z',
  avatar: '/ratattack-avatar.png',
  hordeRank: 'Rat Marshal',
  points: 4820,
  nextTier: 'Warden of the Vault',
  nextTierAt: 6000,
};

export const ORDERS = [
  { id: 'RAT-1042', name: '#RAT-1042', processedAt: '2026-06-08', total: 189.98, currency: 'USD', financialStatus: 'PAID', fulfillmentStatus: 'DELIVERED', trackingNumber: '1Z999AA10123456784', carrier: 'UPS', items: [
    { handle: 'scarlet-violet-booster-box',  title: 'Scarlet & Violet Booster Box',  quantity: 1, price: 149.99 },
    { handle: 'ultra-pro-sleeves-100',       title: 'Ultra Pro Sleeves 100ct',       quantity: 2, price: 4.99 },
  ]},
  { id: 'RAT-1039', name: '#RAT-1039', processedAt: '2026-05-24', total: 54.99, currency: 'USD', financialStatus: 'PAID', fulfillmentStatus: 'IN_TRANSIT', trackingNumber: '9400111899223197428397', carrier: 'USPS', items: [
    { handle: 'journey-together-elite-trainer-box', title: 'Journey Together ETB', quantity: 1, price: 54.99 },
  ]},
  { id: 'RAT-1030', name: '#RAT-1030', processedAt: '2026-05-11', total: 29.99, currency: 'USD', financialStatus: 'PAID', fulfillmentStatus: 'DELIVERED', trackingNumber: '1Z999AA10123456750', carrier: 'UPS', items: [
    { handle: 'ratattack-mystery-pack', title: 'RatAttacK Mystery Pack', quantity: 1, price: 29.99 },
  ]},
  { id: 'RAT-1015', name: '#RAT-1015', processedAt: '2026-04-02', total: 149.99, currency: 'USD', financialStatus: 'PAID', fulfillmentStatus: 'DELIVERED', trackingNumber: '1Z999AA10123456701', carrier: 'UPS', items: [
    { handle: 'obsidian-flames-booster-box', title: 'Obsidian Flames Booster Box', quantity: 1, price: 149.99 },
  ]},
];
export const getOrders = () => ORDERS;
export const getOrder = (id) => ORDERS.find((o) => o.id === id) || null;

export const ADDRESSES = [
  { id: 'addr_1', firstName: 'Sir', lastName: 'Ratsalot', address1: '1 Warren Way', address2: 'Suite 42', city: 'Darklands', province: 'CA', zip: '94016', country: 'United States', phone: '(555) 234-1122', isDefault: true },
  { id: 'addr_2', firstName: 'Sir', lastName: 'Ratsalot', address1: '742 Extraction Rd', address2: '',       city: 'Rustholm',   province: 'OR', zip: '97205', country: 'United States', phone: '(555) 234-1122', isDefault: false },
];

export const PAYMENT_METHODS = [
  { id: 'pm_1', brand: 'Visa',       last4: '4242', expMonth: 12, expYear: 28, holder: 'Sir Ratsalot', isDefault: true },
  { id: 'pm_2', brand: 'Mastercard', last4: '8319', expMonth: 6,  expYear: 27, holder: 'Sir Ratsalot', isDefault: false },
];

export const ACHIEVEMENTS = [
  { key: 'first_purchase',      title: 'First Purchase',       desc: 'Your first raid into the vault.',                        earned: true,  sigil: 'coin',    accent: 'crimson' },
  { key: 'collector',           title: 'Collector',            desc: 'Owned 10+ items across the store.',                       earned: true,  sigil: 'chalice', accent: 'amber' },
  { key: 'rat_horde_member',    title: 'Rat Horde Member',     desc: 'Joined the Discord & linked your account.',               earned: true,  sigil: 'shield',  accent: 'crimson-dark' },
  { key: 'legendary_collector', title: 'Legendary Collector',  desc: 'Acquired a legendary-rarity single.',                     earned: false, sigil: 'crown',   accent: 'gold' },
  { key: 'community_veteran',   title: 'Community Veteran',    desc: 'One year in the horde. Loyalty is rewarded.',              earned: false, sigil: 'skull',   accent: 'crimson' },
  { key: 'set_completionist',   title: 'Set Completionist',    desc: 'Finished a full Pokémon TCG set.',                       earned: false, sigil: 'scroll',  accent: 'neutral' },
];

export const VAULT_COLLECTIONS = [
  { id: 'col_pull_targets', name: 'Pull Targets',    description: 'Sealed product I am chasing next month.',        itemHandles: ['scarlet-violet-booster-box','obsidian-flames-booster-box'] },
  { id: 'col_singles_wl',   name: 'Singles Wishlist',description: 'Graded singles I want in the binder.',           itemHandles: ['charizard-vault-single','pikachu-illustrator-single'] },
  { id: 'col_merch',        name: 'Merch Drops',     description: 'Apparel + accessories from the horde.',           itemHandles: ['ratattack-hoodie','ratattack-tee','ratattack-enamel-pin'] },
];

export const COMMUNITY_UPDATES = [
  { id: 'u1', title: 'Squad night: Dark and Darker — Friday 9pm ET', tag: 'Event',    date: '2026-06-14' },
  { id: 'u2', title: 'New RatAttacK video: Tarkov Extraction Nightmare', tag: 'Video',  date: '2026-06-12' },
  { id: 'u3', title: 'Restock alert: Scarlet & Violet booster boxes',    tag: 'Restock', date: '2026-06-10' },
];

export const RECOMMENDED_HANDLES = ['temporal-forces-etb', 'crown-zenith-booster-bundle', 'ratattack-enamel-pin', 'binder-9pocket'];

export const STATUS_TINT = {
  DELIVERED:  'text-emerald-300 border-emerald-800/70 bg-emerald-950/40',
  IN_TRANSIT: 'text-amber-300 border-amber-800/70 bg-amber-950/40',
  PROCESSING: 'text-red-300 border-red-800/70 bg-red-950/40',
  PAID:       'text-emerald-300 border-emerald-800/70 bg-emerald-950/40',
};
export const STATUS_LABEL = { DELIVERED: 'Delivered', IN_TRANSIT: 'In Transit', PROCESSING: 'Processing', PAID: 'Paid' };
