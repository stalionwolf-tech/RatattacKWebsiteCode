'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';

const NAV_LINKS = [
  { href: '#videos', label: 'Videos' },
  { href: '#about', label: 'About' },
  { href: '#community', label: 'Community' },
  { href: '#tcg', label: 'TCG Store' },
  { href: '#merch', label: 'Merch' },
  { href: '#contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/70 backdrop-blur-xl border-b border-red-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <a href="#top" className="flex items-center">
            <Logo size="md" />
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-neutral-300 hover:text-white transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              className="bg-red-700 hover:bg-red-600 text-white border border-red-900 btn-glow-red animate-pulse-glow"
            >
              <a href="https://www.youtube.com/channel/UCro3AjNRHR1Jbd-P2IVztFA?sub_confirmation=1" target="_blank" rel="noopener noreferrer">
                <Youtube className="w-4 h-4 mr-2" /> Subscribe
              </a>
            </Button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-neutral-200 hover:text-red-500 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-black/95 backdrop-blur-xl border-t border-red-900/30"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-neutral-200 hover:text-red-500 font-medium py-2 border-b border-neutral-900"
                >
                  {link.label}
                </a>
              ))}
              <Button asChild className="bg-red-700 hover:bg-red-600 w-full mt-2">
                <a href="https://www.youtube.com/channel/UCro3AjNRHR1Jbd-P2IVztFA?sub_confirmation=1" target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-4 h-4 mr-2" /> Subscribe on YouTube
                </a>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
