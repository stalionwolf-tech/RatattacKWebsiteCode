import { Navbar } from '@/components/site/Navbar';
import { HeroSection } from '@/components/site/HeroSection';
import { VideosSection } from '@/components/site/VideosSection';
import { AboutSection } from '@/components/site/AboutSection';
import { CommunitySection } from '@/components/site/CommunitySection';
import { TCGSection } from '@/components/site/TCGSection';
import { MerchSection } from '@/components/site/MerchSection';
import { ContactSection } from '@/components/site/ContactSection';
import { Footer } from '@/components/site/Footer';
import { ParticleBackground } from '@/components/site/ParticleBackground';
import { CinematicIntro } from '@/components/site/CinematicIntro';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';

const App = () => {
  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <CinematicIntro />
      <ParticleBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <VideosSection />
        <AboutSection />
        <CommunitySection />
        <TCGSection />
        <MerchSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
