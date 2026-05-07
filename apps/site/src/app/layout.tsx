import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const serif = Instrument_Serif({
  weight: '400',
  style: 'italic',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ghost UI — interfaces that learn',
  description:
    'A self-optimizing UI engine for React. Drop in <Ghost.Button> and your interface rearranges itself around each user’s muscle memory.',
  metadataBase: new URL('https://ghost-ui.dev'),
  openGraph: {
    title: 'Ghost UI — interfaces that learn',
    description: 'A self-optimizing UI engine for React.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
