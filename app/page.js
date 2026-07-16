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

const App = () => {
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
        <FeaturedStoreSection />
        <CommunitySection />
        <VideosSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
