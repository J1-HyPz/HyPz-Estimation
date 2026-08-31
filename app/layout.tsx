import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gametrack-hypz.kingbossj1609.chatgpt.site'),
  title: 'GameTrack — Football match centre',
  description:
    'Football fixtures, live scores, league standings and detailed match information across Europe’s leading competitions.',
  openGraph: {
    type: 'website',
    title: 'GameTrack — Football match centre',
    description:
      'Football fixtures, match details and league standings across Europe’s leading competitions.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'GameTrack sports schedule and scores dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GameTrack — Football match centre',
    description:
      'Football fixtures, match details and league standings across Europe’s leading competitions.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
