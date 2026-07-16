import './globals.css';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'RatAttacK — Dark Fantasy Gaming Content',
  description: 'RatAttacK creates funny, high-quality gaming content on Dark and Darker, Escape from Tarkov, extraction shooters, survival games, and other multiplayer chaos. Join the horde.',
  keywords: ['RatAttacK', 'Dark and Darker', 'Escape from Tarkov', 'gaming', 'YouTube', 'extraction shooter', 'survival games'],
  openGraph: {
    title: 'RatAttacK — Dark Fantasy Gaming Content',
    description: 'Funny, high-quality gaming content. Extraction shooters, survival, and multiplayer chaos.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RatAttacK',
    description: 'Funny, high-quality gaming content.',
  },
};

export const viewport = {
  themeColor: '#dc2626',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
