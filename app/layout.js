import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { AmbientAudioPlayer } from '@/components/site/AmbientAudioPlayer';
import { CustomCursor } from '@/components/site/CustomCursor';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SITE_CONFIG, SITE_URL } from '@/lib/config';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  title: SITE_CONFIG.seo.defaultTitle,
  description: SITE_CONFIG.seo.defaultDescription,
  keywords: SITE_CONFIG.seo.defaultKeywords,
  manifest: '/site.webmanifest',
  applicationName: SITE_CONFIG.brand.name,
  icons: {
    // App-Router auto-serves /app/icon.svg and /app/apple-icon.png,
    // but we declare explicit entries so we can also expose the /public
    // copies (needed for the webmanifest + Safari mask-icon references).
    icon: [
      { url: '/icon.svg',     type: 'image/svg+xml' },
      { url: '/favicon.svg',  type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: SITE_CONFIG.theme.primary },
    ],
  },
  openGraph: {
    title: SITE_CONFIG.seo.defaultTitle,
    description: SITE_CONFIG.seo.defaultDescription,
    type: 'website',
    images: [SITE_CONFIG.seo.ogImage],
    siteName: SITE_CONFIG.brand.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.brand.name,
    description: SITE_CONFIG.seo.defaultDescription,
    images: [SITE_CONFIG.seo.ogImage],
  },
  other: {
    // Windows tile color (used by pinned start-menu tiles)
    'msapplication-TileColor': SITE_CONFIG.theme.primary,
    'msapplication-config':    '/browserconfig.xml',
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
        <AuthProvider>
          {children}
          {/* Persistent floating ambient audio control. Lives in root layout so
              playback survives client-side route changes. Renders nothing that
              affects layout — fixed positioned in the bottom-right. */}
          <AmbientAudioPlayer />
          {/* Custom medieval dagger cursor. Auto-disables on touch devices +
              reduced-motion. Toggle via SITE_CONFIG.ui.customCursor. */}
          <CustomCursor />
          <Toaster theme="dark" position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
