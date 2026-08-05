import { randomUUID } from 'crypto';
import { getDb } from '@/lib/mongo';

const COLLECTION = 'mystery_packs';

export const PACK_STATUSES = ['draft', 'active', 'soldout', 'archived'];

export const STATUS_LABELS = {
  draft: 'Draft',
  active: 'Active',
  soldout: 'Sold Out',
  archived: 'Archived',
};

/**
 * Default seed for the very first production run (RMP-2026-001).
 *
 * The artwork lives in /public/mystery/rmp-2026-001.png so it ships as the
 * DEFAULT image — it is NOT hardcoded into the page. Uploading a new image
 * through the Mystery Pack Manager simply overwrites `packArtwork` on the doc.
 */
export const DEFAULT_PACK_ARTWORK = '/mystery/rmp-2026-001.png';

export function defaultSeed() {
  const now = new Date().toISOString();
  return {
    id: 'rmp-2026-001',
    name: 'RatAttacK Mystery Pack',
    runId: 'RMP-2026-001',
    status: 'active',
    packArtwork: DEFAULT_PACK_ARTWORK,
    chaseImage: '',
    chaseName: 'Charizard',
    chaseSet: 'Base Set',
    chaseNumber: '4/102',
    productionSize: '500 Packs',
    chaseOdds: '1 in 500',
    chaseValue: '$5,000+',
    description:
      'Every RatAttacK Mystery Pack is a sealed, hand-assembled production run. One lucky pack in the run hides the Featured Chase Card — everything is mixed before sale so no one knows which pack holds the prize.',
    contents: [
      '1x Sealed RatAttacK Mystery Pack',
      '4x Assorted trading cards',
      '1x Chance at the Featured Chase Card',
      '1x Collector certificate of authenticity',
    ],
    faq: [
      {
        q: 'How is the chase card inserted?',
        a: 'The Featured Chase Card is randomly inserted into a single pack before every pack in the run is sealed.',
      },
      {
        q: 'Are the packs mixed?',
        a: 'Yes. All packs are thoroughly mixed before being offered for sale, so no one — including us — knows which pack contains the chase.',
      },
      {
        q: 'What happens when the chase is claimed?',
        a: 'Once the chase card is pulled and verified, this production run is marked as Claimed and archived.',
      },
    ],
    disclaimer:
      'RatAttacK Mystery Packs are collectible products. Odds are approximate and based on the stated production size. No purchase guarantees any specific card. Must be 18+ or have guardian consent to purchase.',
    qrUrl: '',
    claimed: false,
    dateClaimed: '',
    winnerLocation: '',
    releaseDate: now,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Normalize an arbitrary input object into a well-formed pack document.
 * Used on create and update so the shape is always consistent regardless of
 * what the admin form sends.
 */
export function normalizePack(input = {}, existing = null) {
  const base = existing || {};
  const str = (v, fallback = '') =>
    typeof v === 'string' ? v : v == null ? fallback : String(v);

  const status = PACK_STATUSES.includes(input.status)
    ? input.status
    : base.status || 'draft';

  // Contents: array of non-empty strings.
  let contents = input.contents ?? base.contents ?? [];
  if (!Array.isArray(contents)) contents = [];
  contents = contents.map((c) => str(c).trim()).filter(Boolean);

  // FAQ: array of { q, a }.
  let faq = input.faq ?? base.faq ?? [];
  if (!Array.isArray(faq)) faq = [];
  faq = faq
    .map((item) => ({ q: str(item?.q).trim(), a: str(item?.a).trim() }))
    .filter((item) => item.q || item.a);

  const claimed = typeof input.claimed === 'boolean' ? input.claimed : Boolean(base.claimed);

  return {
    name: str(input.name, base.name || 'Untitled Production Run'),
    runId: str(input.runId, base.runId || ''),
    status,
    packArtwork: str(input.packArtwork, base.packArtwork || ''),
    chaseImage: str(input.chaseImage, base.chaseImage || ''),
    chaseName: str(input.chaseName, base.chaseName || ''),
    chaseSet: str(input.chaseSet, base.chaseSet || ''),
    chaseNumber: str(input.chaseNumber, base.chaseNumber || ''),
    productionSize: str(input.productionSize, base.productionSize || ''),
    chaseOdds: str(input.chaseOdds, base.chaseOdds || ''),
    chaseValue: str(input.chaseValue, base.chaseValue || ''),
    description: str(input.description, base.description || ''),
    contents,
    faq,
    disclaimer: str(input.disclaimer, base.disclaimer || ''),
    qrUrl: str(input.qrUrl, base.qrUrl || ''),
    claimed,
    dateClaimed: claimed ? str(input.dateClaimed, base.dateClaimed || '') : '',
    winnerLocation: claimed ? str(input.winnerLocation, base.winnerLocation || '') : '',
  };
}

async function collection() {
  const db = await getDb();
  return db.collection(COLLECTION);
}

/**
 * Ensure the collection has at least the default seed run.
 * Runs once (only inserts when the collection is empty).
 */
export async function ensureSeed() {
  const col = await collection();
  const count = await col.countDocuments({});
  if (count === 0) {
    await col.insertOne(defaultSeed());
  }
}

const PROJECTION = { projection: { _id: 0 } };

export async function listPacks() {
  await ensureSeed();
  const col = await collection();
  return col.find({}, PROJECTION).sort({ createdAt: -1 }).toArray();
}

export async function getPackById(id) {
  const col = await collection();
  return col.findOne({ id }, PROJECTION);
}

export async function getActivePack() {
  await ensureSeed();
  const col = await collection();
  // If more than one run is marked active, show the most recently released.
  const [pack] = await col
    .find({ status: 'active' }, PROJECTION)
    .sort({ releaseDate: -1, createdAt: -1 })
    .limit(1)
    .toArray();
  return pack || null;
}

/**
 * Packs shown in the public "Other Production Runs" archive: everything that
 * is publicly visible (active, sold out, archived) except drafts. The active
 * run is excluded so it is not duplicated below itself.
 */
export async function getArchivePacks(excludeId) {
  const col = await collection();
  const query = { status: { $in: ['active', 'soldout', 'archived'] } };
  if (excludeId) query.id = { $ne: excludeId };
  return col.find(query, PROJECTION).sort({ releaseDate: -1, createdAt: -1 }).toArray();
}

export async function createPack(input) {
  const col = await collection();
  const now = new Date().toISOString();
  const doc = {
    id: randomUUID(),
    ...normalizePack(input),
    releaseDate: input.releaseDate || now,
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne(doc);
  const { _id, ...clean } = doc;
  return clean;
}

export async function updatePack(id, input) {
  const col = await collection();
  const existing = await col.findOne({ id });
  if (!existing) return null;
  const update = {
    ...normalizePack(input, existing),
    updatedAt: new Date().toISOString(),
  };
  if (input.releaseDate) update.releaseDate = input.releaseDate;
  await col.updateOne({ id }, { $set: update });
  return getPackById(id);
}

export async function deletePack(id) {
  const col = await collection();
  const res = await col.deleteOne({ id });
  return res.deletedCount > 0;
}
