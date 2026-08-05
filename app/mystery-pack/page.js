import QRCode from 'qrcode';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { MysteryPackExperience } from '@/components/mystery/MysteryPackExperience';
import { getActivePack, getArchivePacks, defaultSeed } from '@/lib/mystery-packs';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mystery Pack · RatAttacK',
  description:
    'Every RatAttacK Mystery Pack production run is assembled before launch, with a randomly inserted Featured Chase Card. See the current run, odds, and chase status.',
  alternates: { canonical: '/mystery-pack' },
};

async function buildQrMap(packs) {
  const map = {};
  await Promise.all(
    packs.map(async (pack) => {
      const url = (pack.qrUrl || '').trim();
      if (!url) return;
      try {
        map[pack.id] = await QRCode.toDataURL(url, {
          margin: 1,
          width: 320,
          color: { dark: '#0a0a0a', light: '#f5c542' },
        });
      } catch {
        /* skip invalid URLs */
      }
    }),
  );
  return map;
}

export default async function MysteryPackPage() {
  let active = null;
  let archive = [];
  try {
    active = await getActivePack();
    archive = await getArchivePacks(active?.id);
  } catch (err) {
    // Database unavailable (e.g. preview without MONGO_URL) — fall back to the
    // built-in default run so the page still renders meaningfully.
    console.log('[v0] mystery-pack: DB unavailable, using default seed:', err.message);
    active = defaultSeed();
    archive = [];
  }

  const allPacks = [active, ...archive].filter(Boolean);
  const qrMap = await buildQrMap(allPacks);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-neutral-100">
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />
      <main className="relative z-10">
        <MysteryPackExperience active={active} archive={archive} qrMap={qrMap} />
      </main>
      <Footer />
    </div>
  );
}
