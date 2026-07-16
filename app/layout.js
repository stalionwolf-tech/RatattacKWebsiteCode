import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { AmbientAudioPlayer } from '@/components/site/AmbientAudioPlayer';
import { CustomCursor } from '@/components/site/CustomCursor';
import { SITE_CONFIG } from '@/lib/config';

export const metadata = {
  title: SITE_CONFIG.seo.defaultTitle,
  description: SITE_CONFIG.seo.defaultDescription,
  keywords: SITE_CONFIG.seo.defaultKeywords,
  icons: {
    icon: SITE_CONFIG.brand.logoAvatar,
    shortcut: SITE_CONFIG.brand.logoAvatar,
    apple: SITE_CONFIG.brand.logoAvatar,
  },
  openGraph: {
    title: SITE_CONFIG.seo.defaultTitle,
    description: SITE_CONFIG.seo.defaultDescription,
    type: 'website',
    images: [SITE_CONFIG.seo.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.brand.name,
    description: SITE_CONFIG.seo.defaultDescription,
    images: [SITE_CONFIG.seo.ogImage],
  },
};

export const viewport = {
  themeColor: SITE_CONFIG.theme.primary,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        {children}
        {/* Persistent floating ambient audio control. Lives in root layout so
            playback survives client-side route changes. Renders nothing that
            affects layout — fixed positioned in the bottom-right. */}
        <AmbientAudioPlayer />
        {/* Custom medieval dagger cursor. Auto-disables on touch devices +
            reduced-motion. Toggle via SITE_CONFIG.ui.customCursor. */}
        <CustomCursor />
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
