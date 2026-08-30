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
  metadataBase: new URL('http://localhost:3000'),
  title: 'GameTrack — Every game, one view',
  description:
    'A unified live score, schedule, and league standings dashboard for the sports you follow.',
  openGraph: {
    type: 'website',
    title: 'GameTrack — Every game, one view',
    description:
      'Live scores, schedules and league standings across the sports you follow.',
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
    title: 'GameTrack — Every game, one view',
    description:
      'Live scores, schedules and league standings across the sports you follow.',
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
