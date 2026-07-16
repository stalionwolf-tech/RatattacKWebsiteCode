'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, User, LogOut, LayoutDashboard, Package, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { IconMenu, IconClose } from './MedievalIcons';
import { SITE_CONFIG } from '@/lib/config';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

const NAV_LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/store', label: 'Store' },
  { href: '/#community', label: 'Community' },
  { href: '/#videos', label: 'Videos' },
  { href: '/#contact', label: 'Contact' },
];

function AccountMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initials = `${(user?.firstName?.[0] || '').toUpperCase()}${(user?.lastName?.[0] || '').toUpperCase()}` || 'R';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-10 pl-2 pr-3 rounded-full border border-red-900/60 bg-black/40 hover:bg-red-950/40 hover:border-red-700 transition-colors"
        aria-label="Account menu"
      >
        <span className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-red-700/60 bg-gradient-to-br from-red-800 via-red-700 to-amber-700 flex items-center justify-center font-cinzel text-white text-[10px]">
          {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : initials}
        </span>
        <span className="hidden xl:inline text-xs font-cinzel tracking-widest uppercase text-neutral-200 max-w-[110px] truncate">
          {user?.firstName || 'Horde'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-xl border border-red-900/60 bg-black/95 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(220,38,38,0.4)] overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-neutral-900">
              <div className="text-white font-cinzel text-sm truncate">{user?.displayName || user?.firstName}</div>
              <div className="text-[10px] uppercase tracking-widest text-red-500 font-cinzel truncate">{user?.email}</div>
            </div>
            <nav className="py-2">
              <Link href="/account" className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-red-950/30 hover:text-white" onClick={() => setOpen(false)}>
                <LayoutDashboard className="w-4 h-4 text-red-500" /> Overview
              </Link>
              <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-red-950/30 hover:text-white" onClick={() => setOpen(false)}>
                <Package className="w-4 h-4 text-red-500" /> Orders
              </Link>
              <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-red-950/30 hover:text-white" onClick={() => setOpen(false)}>
                <Heart className="w-4 h-4 text-red-500" /> Wishlist
              </Link>
            </nav>
            <button
              onClick={async () => { setOpen(false); try { await logout(); toast.info('Signed out.'); } catch {} }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:bg-red-950/30 hover:text-red-300 border-t border-neutral-900"
            >
              <LogOut className="w-4 h-4 text-red-500" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

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
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>

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
            {!loading && (
              user ? (
                <AccountMenu />
              ) : (
                <Link href="/login" className="inline-flex items-center gap-2 h-10 px-3 rounded-md text-xs font-cinzel tracking-widest uppercase text-neutral-200 hover:text-white border border-red-900/60 hover:border-red-700 hover:bg-red-950/40 transition-colors">
                  <User className="w-3.5 h-3.5" /> Sign In
                </Link>
              )
            )}
            <Button
              asChild
              className="bg-red-700 hover:bg-red-600 text-white border border-red-900 btn-glow-red animate-pulse-glow"
            >
              <a href={SITE_CONFIG.youtube} target="_blank" rel="noopener noreferrer">
                <Youtube className="w-4 h-4 mr-2" /> Subscribe
              </a>
            </Button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-neutral-200 hover:text-red-500 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <IconClose size={22} /> : <IconMenu size={22} />}
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
              {!loading && (
                user ? (
                  <Link href="/account" onClick={() => setOpen(false)} className="text-neutral-200 hover:text-red-500 font-medium py-2 border-b border-neutral-900 flex items-center gap-2">
                    <User className="w-4 h-4" /> My Account
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)} className="text-neutral-200 hover:text-red-500 font-medium py-2 border-b border-neutral-900 flex items-center gap-2">
                    <User className="w-4 h-4" /> Sign In
                  </Link>
                )
              )}
              <Button asChild className="bg-red-700 hover:bg-red-600 w-full mt-2">
                <a href={SITE_CONFIG.youtube} target="_blank" rel="noopener noreferrer">
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
