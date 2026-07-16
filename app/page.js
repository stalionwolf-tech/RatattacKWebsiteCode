import { Navbar } from '@/components/site/Navbar';
import { HeroSection } from '@/components/site/HeroSection';
import { AboutSection } from '@/components/site/AboutSection';
import { FeaturedStoreSection } from '@/components/site/FeaturedStoreSection';
import { CommunitySection } from '@/components/site/CommunitySection';
import { VideosSection } from '@/components/site/VideosSection';
import { ContactSection } from '@/components/site/ContactSection';
import { Footer } from '@/components/site/Footer';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { CinematicIntro } from '@/components/site/CinematicIntro';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { getAllProductsLive } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

const App = async () => {
  // Featured products come exclusively from Shopify. Empty state renders when there are none.
  const { products } = await getAllProductsLive({ first: 6 });
  const featured = products.slice(0, 6);

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <CinematicIntro />
      <ScrollingBackdrop />
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <FeaturedStoreSection featured={featured} />
        <CommunitySection />
        <VideosSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
